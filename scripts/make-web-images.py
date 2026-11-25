"""Make web-sized copies of the photos the site shows.

Originals stay where they are (data files keep pointing at them). Copies mirror the original
path under public/web/<tier>/, and PNGs become .jpg (none of them use transparency):

  full   1800px long edge, for a lightbox. Only made when the original is big
         (long edge > 2000px or file > 1 MB); otherwise the original is fine.
  thumb  640px long edge, for anything shown at ~320 CSS px or less.
  tiny   200px long edge, for contact sheets and little thumbnails.

Writes src/components/webImages.json ({ tier: { "/original/path": "/web/tier/path" } }) so the
helpers in src/components/webImage.js only ask for copies that exist.

Run from the repo root:  python scripts/make-web-images.py   (needs Pillow)
Re-run after adding photos; unchanged copies are skipped.
"""
import json
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
PUB = ROOT / 'public'
SOURCES = ['jasoning', 'vaisi', 'achievements', 'map']   # folders under public/
SKIP = {'vaisi/vaisi_homepage.jpg'}                        # screenshot, shown as-is
TIERS = {'full': 1800, 'thumb': 640, 'tiny': 200}
QUALITY = {'full': 82, 'thumb': 80, 'tiny': 76}
EXTS = {'.jpg', '.jpeg', '.png'}
BIG_EDGE, BIG_BYTES = 2000, 1_000_000


def out_rel(rel):
    p = Path(rel)
    return p.with_suffix('.jpg').as_posix() if p.suffix.lower() == '.png' else rel


def wanted(tier, f, im):
    if tier != 'full':
        return max(im.size) > TIERS[tier]
    return max(im.size) > BIG_EDGE or f.stat().st_size > BIG_BYTES


made = {tier: {} for tier in TIERS}
for folder in SOURCES:
    for f in sorted(p for p in (PUB / folder).rglob('*') if p.suffix.lower() in EXTS):
        rel = f.relative_to(PUB).as_posix()
        if rel in SKIP:
            continue
        with Image.open(f) as probe:
            im = None
            for tier, size in TIERS.items():
                if not wanted(tier, f, probe):
                    continue
                dest_rel = f'web/{tier}/{out_rel(rel)}'
                dest = PUB / dest_rel
                if not dest.exists() or dest.stat().st_mtime < f.stat().st_mtime:
                    if im is None:
                        im = ImageOps.exif_transpose(Image.open(f)).convert('RGB')
                    copy = im.copy()
                    copy.thumbnail((size, size), Image.LANCZOS)
                    dest.parent.mkdir(parents=True, exist_ok=True)
                    copy.save(dest, 'JPEG', quality=QUALITY[tier], optimize=True, progressive=True)
                if tier == 'full' and dest.stat().st_size > 0.8 * f.stat().st_size:
                    dest.unlink()   # not worth it: the original is already about this light
                    continue
                made[tier]['/' + rel] = '/' + dest_rel
                print(f'{tier:5} {f.stat().st_size / 1024:8.0f}K -> {dest.stat().st_size / 1024:6.0f}K  {rel}')

(ROOT / 'src' / 'components' / 'webImages.json').write_text(json.dumps(made, indent=1, ensure_ascii=False) + '\n')
