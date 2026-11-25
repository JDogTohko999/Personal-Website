# sky (round 3, take A): decisions

> The sections down to "Blocked" describe the round-3 sky take as first built. **"Final: refinements"** at the end describes
> what `redesign3/final` changed on top of it. Where the two disagree (the desktop panel, the veil, the animated grain),
> the final section wins.

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
Nothing was blocked in the sky take. For the final pass, see "Blocked (final)" below.

---

# Final: refinements (`redesign3/final`)

Jason has seen round 3 and said "I like the look so far!". So this pass keeps sky's look and works through the
R3_CRITIQUE fix list, plus its grafts: edge's band-top inner pages and reading rhythm, and margin's opaque reading
surface. The home is still the photo with the name, one line and the plain lowercase links in the open sky, the hiker
and the ridge uncovered, one screen, no scroll.

## What changed and why

| # | Critique item | Change |
| --- | --- | --- |
| 1 | The veil reads as a blotch | **Desktop and every wide crop: no veil at all.** The ink was deepened a step (`#121a18` to `#0b1210`, still tinted to the photo's green) so the bare left sky clears 4.5:1 on its worst pixel. **Portrait (tall crop):** the veil now hugs the caption (2-3rem past the text, not 8-9rem) at 0.22/0.16 alpha (was 0.38/0.30). That alone was not enough (390x844 measured 3.49), so I took the critique's fallback: on portrait screens the caption moves **down into the lighter haze just above where the ridge meets the left edge** (`bottom: calc(39% + 2.75rem)`), and the links run in two lines. Raw contrast for the ink there is 4.8-5.9:1, against 3-4:1 at the top. It now reads as a caption written above the hiker. |
| 2 | Name and links too timid | Name `clamp(2rem, 1.4rem + 1.6vw, 3rem)` (43px at 1440, 48px at 1920), line 1.2rem, home links 1rem at 1.6 line-height. Top-left as before. |
| 3 | No resting link affordance | Every nav link has a 1px underline at 35% ink, 0.2em offset, going to full ink on hover and focus. |
| 4 | The frosted desktop half-panel | Gone, `backdrop-filter` and all. **One layout at every width:** the photo is a band across the top (`clamp(10rem, 26vh, 16rem)`; phones `clamp(12.5rem, 30svh, 15rem)` to make room for two lines of links). Its offset is computed in CSS so the hiker stands about two-thirds down the band at any width: `object-position: 62% clamp(band - 66.67vw, 0.66*band - 50.67vw, 0)` (tall crop: `150vw` / `106.5vw`). Measured: 0.63 at 1440 and 1920, 0.66 at 390, 0.60 at 768. The name and links sit in the band's sky at the home caption's left edge. It is still the same `<img>` as the home, so moving between pages never reloads the photo. |
| 5 | Reading rhythm (edge graft) + opaque surface (margin graft) | The sheet is opaque `#e2e5db`, no alpha and no blur. One centred column, `min(38rem, 100%)`, with a 1.1875rem body at 1.6, titles `clamp(1.875rem, ..., 2.25rem)` with `text-wrap: balance`, and italic meta (post dates, list meta). Newsreader throughout. |
| 6 | Mobile nav wrap orphaned "linkedin meet" | On phones, and on any portrait screen, the links are on two lines on purpose: `writing now places work vaisi`, then `linkedin meet`, left-aligned, in both the band head and the phone home. On landscape and desktop they stay on one row. |
| 7 | Grey flash while the photo loads | The page and the photo's box are the sampled sky `#7f8b80` from the first byte (inline `<style>` in `index.html`, and `theme-color`). The home caption now waits for the photo: it fades in only once `data-ready` is set, on `load` or `error`, or after a 2.5s fallback so words never stay hidden on a slow line. Ink on the bare placeholder is 5.33:1. |
| 8 | Loud figures in posts | Post photos sit flat and straight inside the measure: no tilt, no cream mat, no drop shadow, and a 1px `#c9ccbf` border. The overlapping tilted clusters in "Losing" become plain side-by-side pairs, and captions drop below a photo when there's no room beside it. The blue "Policy Summary" chart gets the same hairline border with square corners. `Frame` and the cluster wrappers in `blogPosts.jsx` got class names (`post-frame`, `post-cluster`) so the CSS can do this without rewriting the posts. |
| 9 | Grain animates at 10 steps a second | The grain is static: the same SVG noise tile at 0.16 overlay, with no animation. The only motion left is the photo's fade-in, then the caption's. |
| 10 | Re-verify | See "Verification" below. |

Smaller things:
- `scripts/measure-sky.js` now reads the band head (`.band-head`), understands the band's pixel-length object-position, and drops
  the old panel branch, since the sheet is opaque and checked by tokens. `hiker()` reports `inBand`, how far down the band he stands.
- The old "panel" vocabulary is gone from the code (`.panel` became `.band-head`, `.sheet` and `.column`).

## Contrast (final), with numbers
Method as before. `(await import('/scripts/measure-sky.js')).measure()` redraws the photo exactly as cropped, composites
any veil, and darkens every pixel by the grain's worst step. It then takes the WCAG ratio of the ink against **every
pixel under every text run**. "Min" is the single worst pixel, and "p5" is the value that 95% of the pixels behind the
text beat.

| Viewport | Page | Crop | Veil | Worst run | Min | p5 |
| --- | --- | --- | --- | --- | --- | --- |
| 390x844 | home | tall-1140 | 0.22 hug | vaisi | **4.52** | 4.77 |
| 768x1024 | home | tall-1140 | 0.22 hug | vaisi | **5.07** | 5.50 |
| 844x390 | home | wide | none | meet | **4.54** | 4.76 |
| 1280x720 | home | wide-1920 | none | Jason Chin | **4.65** | 5.13 |
| 1440x900 | home | wide-1920 | none | Jason Chin | **4.59** | 5.00 |
| 1920x1080 | home | wide-1920 | none | Jason Chin | **4.71** | 5.17 |
| 2560x1080 | home | wide-1920 | none | Jason Chin | **5.04** | 5.52 |
| 390x844 | band head (/now) | tall | none | vaisi | **4.66** | 4.81 |
| 768x1024 | band head (/experience) | tall | none | vaisi | **5.22** | 5.52 |
| 1440x900 | band head (/blog) | wide | none | linkedin | **5.41** | 5.64 |
| 1920x1080 | band head (/now) | wide | none | meet | **5.65** | 5.85 |

Every run of text on the photo is at least 4.5:1 on its worst pixel at every viewport, including the name, which as
large text would only need 3:1.

On the sheet (`#e2e5db`, opaque): ink 14.86, text 12.90, link 8.44, muted 6.50. Muted on the surface tint (`#ebede5`)
is 7.01. Ink on the loading placeholder (`#7f8b80`) is 5.33.

Two fixes the numbers forced:
- At 768x1024 the one-row band head reached the darker teal on the right ("meet" 4.47), so the head stacks on every
  portrait screen, not only below 40rem.
- On phones, the link gaps went from 0.95rem to 0.8rem so "vaisi" clears the darker right side (4.48 to 4.66 in the band,
  4.47 to 4.52 on the home).

## Verification
- `npm run build` passes.
- I checked in the in-app browser, in my own tab, at 1440x900, 1920x1080, 768x1024 and 390x844, plus 1280x720, 844x390 and
  2560x1080 for the home. At each of the four main sizes I walked every route: `/`, `/blog`, three listed posts,
  `/blog/alice` (opens, and is not in the list), `/now`, `/now/bonus`, `/places`, `/map`, `/experience`, `/vaisi` and a 404.
  - No console errors on any route.
  - No horizontal overflow on any route.
  - The home's scroll height equals the viewport (no scroll) at every size.
  - The hiker is never within 12px of any text.
  - Footnote anchors resolve.
- The server is stopped and the tab is closed.

## Open questions for Jason
1. **Phone home placement.** On portrait screens the caption now sits low, just above the ridge, instead of in the top
   corner. That was the only way to pass 4.5:1 without a visible veil. Do you like it as "a caption above the hiker", or
   would you rather have it back in the corner with a slightly stronger haze?
2. **The name's size.** It's a step up (43px at 1440). Is that confident enough, or do you want it bigger still, like
   edge's title card?
3. **The band height on desktop** is about a quarter of the screen. Is that enough photo on inner pages, or would you
   want a taller band on posts?
4. **Grain.** It's now completely still. Do you want a very slow shimmer (about 3 steps a second) instead?
5. **"about".** The intro paragraph still lives at the top of writing. Should it get an eighth word?

## Known issues
- In the hidden in-app pane, transitions are throttled, so several captures show the band mid-fade, as flat sky. That's
  the placeholder working, not a crop bug. Once loaded, the ridge and hiker are in the band at every size.
- The home caption at 1440x900 ends at about 45% of the height, not the top third. The seven stacked 1rem links need
  that room, and the ridge is far below it.
- Two figure rows in "Losing" (the shoes/mayor pair and the Bores signs) wrap into stacked rows at the 38rem measure.
  They're calm, but not the side-by-side composition the post originally had.
- The 8px MF DOOM link inside one caption in "Losing" is left as Jason wrote it (tiny on purpose).
- `npm install` had to run with `--ignore-scripts`: esbuild's postinstall crashed in this sandbox (exit 0xC0000142). The
  win32 binary package installs on its own, and dev and build both work.

## Blocked (final)
Nothing was blocked. The esbuild postinstall crash above was worked around, not denied.
