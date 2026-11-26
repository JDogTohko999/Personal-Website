"""Backgrounds for the two-people photo (public/bg4).

Jason's file ~/Downloads/background_screen saver_NOLS_2ppl_cropped.jpg (1375x917) is a mirrored,
colour-graded crop of ~/Downloads/NOLS_I_THINK_I_CAN.JPG at native resolution: it matches the
mirrored scan at (988, 229), 1378x919 (normalised cross-correlation 0.991). The wide copies are
his file as-is (plus resized copies). For phones, a taller portrait crop is cut from the mirrored
scan around the standing hiker and given his grade, learned per channel from the matching crop
(sky and ground separately). Originals are never modified.
"""
import numpy as np
from pathlib import Path
from PIL import Image, ImageEnhance, ImageOps

# Jason: "dim everything by a little, it's a bit too bright." Every output is darkened by this
# factor (1.0 = his original brightness).
DIM = 0.88

DL = Path.home() / "Downloads"
OUT = Path(__file__).resolve().parent.parent / "public" / "bg4"
OUT.mkdir(parents=True, exist_ok=True)

# v3 (Nov 26): Jason re-graded the same crop again ("_3"); same framing and size, slightly different after-effects.
jason = Image.open(DL / "background_screen saver_NOLS_2ppl_cropped_3.jpg").convert("RGB")
scan = ImageOps.mirror(Image.open(DL / "NOLS_I_THINK_I_CAN.JPG").convert("RGB"))

def save(im, name, w=None):
    x = ImageEnhance.Brightness(im).enhance(DIM)
    if w: x = x.resize((w, round(w * im.size[1] / im.size[0])), Image.LANCZOS)
    x.save(OUT / name, quality=82, optimize=True, progressive=True)

# wide: Jason's grade, untouched
save(jason, "twoppl-wide-1375.jpg")
save(jason, "twoppl-wide-1920.jpg", 1920)
save(jason, "twoppl-wide-800.jpg", 800)

# learn the grade: matching crop of the mirrored scan -> Jason's file
src = np.asarray(scan.crop((988, 229, 988 + 1378, 229 + 919)).resize(jason.size), dtype=np.float32)
ref = np.asarray(jason, dtype=np.float32)
def fit(a, b): return [(b[..., i].std() / (a[..., i].std() + 1e-6), b[..., i].mean(), a[..., i].mean()) for i in range(3)]
def apply(img, p):
    o = img.copy()
    for i, (k, mb, ma) in enumerate(p): o[..., i] = (img[..., i] - ma) * k + mb
    return np.clip(o, 0, 255)
h = ref.shape[0]
sky = fit(src[: int(h * 0.45)], ref[: int(h * 0.45)])
gnd = fit(src[int(h * 0.82):], ref[int(h * 0.82):])
def grade(im):
    a = np.asarray(im, dtype=np.float32)
    m = np.clip((a.mean(axis=2) - 90) / 60, 0, 1)[..., None]
    return Image.fromarray((apply(a, sky) * m + apply(a, gnd) * (1 - m)).astype(np.uint8))

# tall: around the standing hiker (scan ~2146, 790), 2:3
tall = grade(scan.crop((1586, 0, 1586 + 933, 1400)))
save(tall, "twoppl-tall-933.jpg")
save(tall, "twoppl-tall-1170.jpg", 1170)
print("hiker in wide ~ (84%, 61%); seated person ~ (9%, 87%); hiker in tall ~ (60%, 56%)")
