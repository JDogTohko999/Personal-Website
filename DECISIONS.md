# sky (round 3, take A): decisions

## Thesis and layout
A caption written in the corner of a photograph. The home page is the hiker photo, full bleed and left alone. Top-left, in
the open sky, sit the name (Newsreader, about 34px at 1440, weight 380), the one line in italic, and a short vertical list
of tiny lowercase links: writing, now, places, work, vaisi, then a small gap, then linkedin and meet. "now" carries its
date in italic ("now  nov 15", with a title "Updated November 15, 2026"). Nothing else is on the page. It is one screen
with no scroll at every size checked.

- **Type:** one face, Newsreader (Google Fonts, variable, with optical sizes). The name gets the display cut and the 13–14px
  links get the caption cut automatically. Hierarchy comes from size and italic only. There is one ink (`#121a18`),
  because on a mid-tone sky any lighter "muted" ink drops below 4.5:1. The current page in the nav is shown in italic.
- **Inner pages:** the photo recedes.
  - At 960px and wider, a sky-tinted reading panel (`rgba(226,229,219,.9)` plus a 24px backdrop blur) runs down the left
    at `clamp(30rem, 47vw, 43rem)`. The photo stays sharp to the right, and the hiker is never under the panel.
  - Below 960px, the photo becomes a 38svh band framed on the hiker. The name and the same tiny links sit in the band's
    sky, so each inner page opens like a small copy of the home. The solid panel starts under the band.
- **Where things went:**
  - The intro paragraph and Jason-ing (a small square photo; click it for another) are at the top of /blog.
  - Debate (with photos and a lightbox) and Eagle Scout are under "Also" on /experience.
  - The globe is on /places, with /map kept as an alias.
- **Borrowed from hearth (read-only):** the lightbox with focus trap, WorkRow, `dates.js`, and the structure of the
  places page.
- **Palette:** the base's palettes and switcher are not mounted. sky has one palette, taken from the photo. Its tokens
  are on `:root[data-theme]` in `src/index.css`.

## Contrast (measured, with numbers)
`scripts/measure-sky.js`: run `(await import('/scripts/measure-sky.js')).measure()` in the console. It redraws the
`<img>` exactly as cropped (cover plus the computed object-position) and composites the veil from its computed geometry
and stops. It pushes every pixel darker by the grain's worst step (noise 0.3, overlay, 16%). It then takes the WCAG ratio
of the text colour against every pixel under every text run. Panel text is bounded by compositing the panel over the
darkest photo pixel under it (the blur is ignored).

**The veil.** Without it, the tall crop's sky is too dark. At 390x844 the worst runs were 3.08 (min) and 3.49 (p5). The
veil is a soft oval of haze, `radial-gradient(closest-side, rgba(217,221,206,.38), .30 at 55%, 0)`, behind the caption
and behind the band's head on mobile. It reads as light in the corner, not as a box.

| Viewport | Crop | Min (worst pixel) | p5 | Median of the lowest run |
| --- | --- | --- | --- | --- |
| 390x844 home | tall-1140 | 4.67 ("Jason Chin", large text) | 5.48 | 5.83 |
| 390x844 /now band head | tall | 5.07 | 5.32 | 5.73 |
| 768x1024 home | tall | 5.31 | 5.69 | 6.06 |
| 768x1024 inner band head | tall | 5.86 | 6.09 | 6.38 |
| 844x390 home (phone sideways) | wide-1310 | 5.31 | 5.55 | 5.95 |
| 1280x720 home | wide-1310 | 5.97 | 6.31 | 6.62 |
| 1440x900 home | wide-1920 | 5.69 | 6.17 | 6.43 |
| 1920x1080 home | wide-1920 | 5.75 | 6.13 | 6.40 |
| Desktop panel (1440x900, 1024x768), worst case | | ≥ 5.96 | | |

Solid tokens on the mobile panel (`#e2e5db`): ink 13.9, text 12.9, muted 6.5, link 8.4, accent 7.9, accent-2 7.5. On
the surface tint everything is higher. Lightbox text is 12.4.

## Background positioning
`object-fit: cover` with `object-position` set to the hiker's own spot: `62% 76%` in the wide crop, `61% 71%` in the tall
one (`<picture>`, tall below a 4:5 aspect). Cover only crops, and object-position pins that image point to the same
fraction of the box, so the hiker lands at exactly (62%, 76%) or (61%, 71%) of the screen at every size. Measured with
`hiker()`:

| Viewport | Hiker on screen (px) | Crop | Scale | Covered? |
| --- | --- | --- | --- | --- |
| 1440x900 | 893, 684 | wide-1920 | 1.0 | no |
| 1280x720 | 794, 547 | wide-1310 | 1.0 | no |
| 1920x1080 | 1190, 821 | wide-1920 | 1.0 | no |
| 390x844 | 238, 599 | tall-1140 | 1.44 | no |
| 768x1024 | 468, 727 | tall | | no |
| 844x390 | 523, 296 | wide | | no |

Scale 1.0 means native or downsampled pixels. At 390 the tall copy is shown at 1.44x for a DPR-2 screen. It is never
scaled up into mush.

- The inner band on mobile uses `60% 80%`. That puts the hiker at about (61%, 24%) of the viewport, near the band's
  ridge (390x844: 238, 204).
- The desktop panel at 1024x768 ends at x 481, and the hiker is at x 626.
- Short, wide screens (≤560px tall, landscape) set the links in a line, so they never reach the scree.

## Grain
A 200px tile of SVG `feTurbulence` fractal noise (greyscale), `mix-blend-mode: overlay`, opacity 0.16, inside the
backdrop and under all text. It jumps between 8 offsets every 0.1s (stepped, never sliding), which reads as projected
film. It is static under `prefers-reduced-motion`. It gives the upscaled 1920 copy back its texture. The one deliberate
moment of motion is the photo fading in over 0.7s, followed by the caption.

## Open questions for Jason
1. Do you want a word for the intro ("about")? Right now it lives at the top of writing, which is reachable only by
   "writing".
2. Is the veil acceptable? It is the only change to the photo. Without it, the phone home measures 3.1:1.
3. Should the external links be marked (an arrow or italic), or are the words enough?
4. Should the inner panel be on the left, as now, or would you prefer the band layout on desktop too?

## Known weaknesses
- The links have no underline at rest (hover and focus only). This is fine in a nav list, but it is quiet by design.
- The desktop inner panel's right half is just photo. On very wide screens that is a lot of empty sky.
- Post bodies keep their own inline styles: the dark chart image and the tilted figures in "Losing" don't fully match
  the calm panel.
- `/now/bonus` works, but the current Now entry has no bonus, so nothing opens.
- The grain animates over the whole viewport. It is cheap (transform only), but not tested on a slow phone.
- The in-app pane was mostly hidden, so CSS transitions were throttled. Screenshots were taken with transitions off,
  and the measurements don't depend on them.

## Blocked
Nothing was blocked.
