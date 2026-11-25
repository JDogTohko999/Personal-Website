# bg3: the hiker-on-the-ridge background (round 3)

Jason's reference, `hiker-ref-646.jpg` (646x431), turned out to be a mirrored, teal-graded crop of his NOLS film
scan (`~/Downloads/NOLS_I_THINK_I_CAN.JPG`, 2620x1738). No higher-res copy of that exact framing exists, so
`scripts/make-hiker-bg.py` learns the reference's grade and applies it to wider crops of the full-res original:

| File | Size | Use |
|---|---|---|
| `hiker-wide-1310.jpg` | 1310x873, native pixels | desktop (default) |
| `hiker-wide-1920.jpg` | 1920x1280, Lanczos 1.47x upscale | large/retina desktop; pair with a grain overlay |
| `hiker-wide-800.jpg` | 800x533 | small/low-bandwidth, blur-up placeholder |
| `hiker-tall-760.jpg` | 760x1140, native pixels | phones (portrait) |
| `hiker-tall-1140.jpg` | 1140x1710, upscale | retina phones |
| `hiker-ref-646.jpg` | Jason's original reference | for comparison only |

**Composition, wide (3:2):** about the top 70% is open sky, teal at top-right fading to grey-green haze near the horizon. The
ridge rises from the lower-left (top at about 85% height at the left edge) to the right (about 70% at the right edge). There is **one small hiker
at about (62%, 76%)**, standing on the ridge line. The scree below is olive-brown with film grain. Keep text in the sky (upper-left / upper-
centre) and never cover the hiker.
**Composition, tall (2:3):** the sky fills the top ~70%, the hiker is at about (61%, 71%), and the ridge occupies the lower third.

**Palette sampled from the wide crop:**
- sky top-right `#4A6A69`
- sky top-left `#849082`
- sky mid `#838F82`
- haze `#9A9D89`
- olive scree `#3B351F`
- dark rock `#3D3523`

The sky is mid-tone, so pure white text over it needs checking (≥ 4.5:1 against the actual pixels). Use a dark
ink (≈ `#1F2A28`) or a subtle scrim.
