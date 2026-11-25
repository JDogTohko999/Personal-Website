/*
  Web-sized photo copies. Some originals are 6000px / 16 MB camera files; the data files keep
  pointing at the originals and these helpers swap in a lighter copy when one exists:

    full(src)   1800px copy, for a lightbox / full view     (falls back to the original)
    thumb(src)  640px copy, for anything shown at <= ~320 CSS px   (falls back to full())
    tiny(src)   200px copy, for contact sheets and little thumbnails (falls back to thumb())

  Pass the src exactly as the data files have it (percent-encoded spaces and '!' are fine).
  Copies are made by `python scripts/make-web-images.py`, which also writes webImages.json.
  Covered: public/jasoning, public/vaisi, public/achievements (debate), public/map (SF photos).
*/
import made from './webImages.json';

// Data files percent-encode spaces and '!'; the manifest has plain paths.
const plain = (src) => {
  try {
    return decodeURIComponent(src);
  } catch {
    return src;
  }
};

const lookup = (tier, src) => {
  const hit = made[tier]?.[plain(src)];
  return hit ? encodeURI(hit) : null;
};

export const full = (src) => (src ? lookup('full', src) || src : src);
export const thumb = (src) => (src ? lookup('thumb', src) || full(src) : src);
export const tiny = (src) => (src ? lookup('tiny', src) || thumb(src) : src);

/** srcSet string "tiny 200w, thumb 640w, full 1800w" (only the copies that exist). */
export const srcSet = (src) => {
  const out = [];
  const t = lookup('tiny', src);
  const m = lookup('thumb', src);
  const f = lookup('full', src);
  if (t) out.push(`${t} 200w`);
  if (m) out.push(`${m} 640w`);
  if (f) out.push(`${f} 1800w`);
  return out.join(', ') || undefined;
};
