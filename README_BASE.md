# redesign2/base: the shared foundation for round 2

Branch from this. It is a clean, plain React + Vite app with every route wired to the real
data, six named palettes (plus three extras), web-sized images, and the touring globe.

**Base v2 (2026-11-24), after Jason's review of trail and hearth:** the globe now sits in a
framed rectangle and drifts continuously between places (no holds), drawing is much cheaper,
and there are six earthy palettes a visitor can switch between. See "Merging base v2" below. The styling is deliberately
minimal: restyle or replace the pages, but keep the data wiring and the contracts below.

```
npm install
npx vite --port <your port> --strictPort
npm run build
```

## What's here

| Path | What it is |
| --- | --- |
| `src/App.jsx` | Routes: `/`, `/blog`, `/blog/:id`, `/now`, `/now/bonus`, `/map` (lazy), `/vaisi`, `/experience`, `*` (404). |
| `src/components/Layout.jsx` | Reference shell: nav of plain words, LinkedIn, Schedule a meeting, a quiet theme switch. |
| `src/pages/*.jsx` | One plain page per route: `Home`, `Blog`, `BlogPost`, `Now`, `MapPage`, `Vaisi`, `Experience`, `NotFound`. |
| `src/theme/themes.css` | Six palettes + three extras as CSS custom properties, plus the legacy `--portfolio-*` mapping. |
| `src/theme/useTheme.js` | `ThemeProvider`, `useTheme()`, `palettes`, plain `setTheme()`/`cycle()`; the no-flash scripts live in `index.html`. |
| `src/theme/PaletteSwitcher.jsx` | Minimal reference switcher: round swatches in an accessible radiogroup. |
| `src/components/TourGlobe.jsx` | The touring globe (API below). |
| `src/components/tourMotion.js` | The globe's camera path (pure functions: legs, van Wijk zoom, blending). |
| `scripts/check-contrast.mjs` | Parses `themes.css`, prints every text pair's contrast, fails below 4.5:1. |
| `src/components/webImage.js` | `full()`, `thumb()`, `tiny()`, `srcSet()` for web-sized photo copies. |
| `src/components/Lightbox.jsx` | Minimal full-image overlay (Esc closes, arrows step). |
| `src/lib/geo.js` | `stats`, `countryName`, `placesByCountry`, `splitOverseas`, `categoryOf`, `loadWorld`. |
| `src/lib/useTitle.js` | `useTitle('Now')` sets "Now · Jason Chin". |
| `src/data/*` | Content modules (unchanged except `places.js`: home pin + tour). |
| `scripts/make-web-images.py` | Regenerates `public/web/{full,thumb,tiny}/` and `src/components/webImages.json`. |

Removed from the old site: particles, fun mode, the old theme switcher, leaderboard, easter eggs,
framer-motion, lucide-react, react-simple-maps, d3-scale, tsparticles. Add back what you need.
Tailwind stays because the content modules use its classes.

Page notes:
- **Blog**: unlisted posts (`unlisted: true`) open at `/blog/:id` but are never listed, and
  prev/next skip them. Footnotes are plain `#fnN`/`#refN` anchors and work as-is.
- **Now**: `/now/bonus` opens `<details id="now-bonus">` and scrolls to it (old logic kept). The
  current `nowEntry` has no bonus; give it a `bonus` field (JSX) and the page renders the details.
- **Home** shows: profile intro (verbatim), links, "Now: updated <date>", Jason-ing (prev/next),
  latest 3 listed posts, Debate (photos + links) and Eagle Scout.

## Themes (palettes)

Set by `<html data-theme="...">`. Six named palettes, built from the sampled values in
R2_BRIEF_COMMON.md (text colours deepened or lifted only as far as 4.5:1 needs):

| id | ground / text / accent | |
| --- | --- | --- |
| `japandi` | cream `#f9ead5` / walnut `#522111` / moss `#4e5230` | light, default. **Changed in v2**: text was soft black, links terracotta |
| `clay` | seed puff `#f6ebe3` / deep clay `#3b2a26` / clay `#745851` | light |
| `moss` | pale olive `#ecebdc` / moss-black `#2c2f20` / fresh bark `#575e45` | light |
| `sand` | sand `#efe4d6` / `#3a2c22` / terracotta `#8b3f22` (taupe accent-2) | light |
| `herb` | sage `#d6d4c6` / deep brown `#311209` / walnut `#522111`, moss links | light, mid-tone |
| `walnut` | deep brown `#2b1b13` / beige `#ecd3a8` / terracotta `#dc8c5f` | dark |

Extra palettes, kept exactly as they were so trail and hearth don't change: `japandi-night`
(dark), `earth` (light), `earth-dusk` (dark). They are offered only when `allowed` names them.

| Token | Use |
| --- | --- |
| `--bg` | page background |
| `--surface` | slightly raised area (captions, asides); use sparingly |
| `--text` | body text |
| `--muted` | secondary text: dates, captions, labels (safe for text) |
| `--faint` | decoration only (hairlines, dots); not for text |
| `--accent` | primary accent (active nav, labels, focus ring); safe for text |
| `--accent-2` | secondary accent; safe for text |
| `--rule` | hairline rules and borders (also the globe frame's border) |
| `--link`, `--link-hover` | inline links |
| `--globe-ocean`, `--globe-land`, `--globe-visited`, `--globe-going`, `--globe-bucket` | globe fills |
| `--globe-border` | country borders (thin, usually the page bg) |
| `--globe-pin`, `--globe-pin-home` | pins |
| `--globe-halo` | soft halo around the disc |
| `--globe-limb` | limb shade inside the edge |
| `--globe-frame` | **new**: the framed card's tint (a step off `--bg`; the ocean stays the lightest) |

Every palette defines every token. Legacy tokens (used inside blog bodies, the now entry,
profile, vaisi via Tailwind classes like `text-portfolio-gold`) are mapped once on `:root` (the
same element as `data-theme`, so every palette gets them): `--portfolio-bg → --bg`,
`-text → --text`, `-gold → --link`, `-muted → --muted`, `-card → --surface`,
`-card-text → --text`, `-border → --rule`, `-green → --accent-2`, `-on-gold → --bg`. Don't
redefine them per page; change the semantic tokens instead.

### Contrast

`node scripts/check-contrast.mjs` parses `themes.css`, checks every palette defines every token
and that the JS swatches match the CSS, prints each pair, and exits 1 if any ratio is below 4.5
(`--min 7` for a stricter run). Current output:

```
WCAG 2.1 contrast ratios in src/theme/themes.css (threshold 4.5:1)

palette       text/bg text/surface muted/bg muted/surface link/bg link/surface link-hover/bg accent/bg accent-2/bg min   
japandi       11.21   12.61        5.29     5.95          6.90    7.76         14.54         6.90      8.35        5.29  
clay          11.59   12.57        5.55     6.02          6.63    7.19         11.59         5.50      5.13        5.13  
moss          11.39   12.39        5.71     6.21          6.79    7.38         6.18          5.65      6.18        5.65  
sand          10.71   11.99        5.48     6.14          5.91    6.62         10.56         5.91      5.51        5.48  
herb          11.54   13.11        6.28     7.14          7.10    8.07         8.89          8.89      6.89        6.28  
walnut        11.39   10.07        6.18     5.47          7.63    6.75         15.74         6.27      6.71        5.47  
japandi-night 13.60   13.28        6.01     5.87          10.14   9.90         15.29         10.14     6.52        5.87  
earth         11.17   12.11        5.50     5.96          5.97    6.47         5.50          4.83      5.50        4.83  
earth-dusk    12.44   10.83        7.21     6.28          7.39    6.43         12.44         5.62      4.92        4.92  

All 9 palettes pass: every pair is at least 4.5:1.
```

Lowest pair per palette: japandi 5.29, clay 5.13, moss 5.65, sand 5.48, herb 6.28, walnut 5.47
(extras: japandi-night 5.87, earth 4.83, earth-dusk 4.92).

### useTheme and switching palettes

```jsx
import { ThemeProvider, useTheme, palettes, setTheme, cycle } from './theme/useTheme.js';
import PaletteSwitcher from './theme/PaletteSwitcher.jsx';

<ThemeProvider defaultTheme="japandi">…</ThemeProvider>            // offers the six palettes
<ThemeProvider allowed={['earth', 'earth-dusk']}>…</ThemeProvider> // or any subset, extras included

const { theme, setTheme, themes, cycle } = useTheme();
// themes: [{ id, name, label, dark, swatch: [bg, text, accent] }], filtered by `allowed`.
// cycle() moves to the next theme; cycle(['japandi', 'walnut']) cycles a subset;
// onClick={cycle} still works (the event is ignored).

palettes      // the six: { id, name: 'Clay', label: 'clay', dark, swatch: ['#f6ebe3', '#3b2a26', '#745851'] }
setTheme(id)  // plain functions too, usable outside React; they go through the mounted provider
cycle()

<PaletteSwitcher />                                    // round swatches + the current label
<PaletteSwitcher ids={['japandi', 'clay', 'walnut']} showName={false} label="Colours" />
```

`PaletteSwitcher` is a `radiogroup` of `radio` buttons named "Clay palette" etc., with roving
focus: Tab reaches the checked swatch; arrows and Home/End move and select. Each swatch is the
palette's bg with a text-coloured ring and an accent dot. Restyle it with `className` (it then
drops its inline styles and exposes `--swatch-bg/-text/-accent`), or build your own from
`palettes`. The base's own nav still shows the plain word list (`theme: japandi · clay · …`);
the switcher isn't mounted in base (that would conflict with hearth's Layout), so each
direction chooses where it goes.

Stored in `localStorage['jc-theme']`. `index.html` has two tiny no-flash scripts: the original
(japandi and the extras) and a second block for `clay`, `moss`, `sand`, `herb`, `walnut`. The
second is separate so directions that edited the first list merge cleanly; trim either list to
the ids you offer. Keep them in sync with `THEMES` in `useTheme.js`.

## Web-sized images

```js
import { full, thumb, tiny, srcSet } from '../components/webImage.js';
<img src={thumb(src)} />              // 640px copy, for anything shown at <= ~320 CSS px
<img src={tiny(src)} />               // 200px copy, for little thumbnails
lightbox(full(src))                   // 1800px copy of the camera originals (VAISI photos are 16 MB)
```

Pass the data-file path as-is (percent-encoded is fine). Each helper falls back to the next size
up and finally to the original. Covered: `public/jasoning`, `public/vaisi`, `public/achievements`
(debate photos), `public/map` (SF photos). Videos are not processed. After adding photos, run
`python scripts/make-web-images.py` (needs Pillow).

## TourGlobe

```jsx
const TourGlobe = React.lazy(() => import('../components/TourGlobe.jsx'));
<Suspense fallback={null}>
  <TourGlobe onPick={(p) => …} />                                          // framed 4:3 card, drifting
  <TourGlobe aspect={16 / 9} legMs={8000} />
  <TourGlobe frame={false} style={{ height: 480, aspectRatio: 'auto' }} />  // the old frameless disc
</Suspense>
```

| Prop | Default | |
| --- | --- | --- |
| `frame` | `true` | **new.** The sphere sits in a calm framed card: 1px `--rule` border, `--globe-frame` tint, radius 6, no shadow. Zoomed out the whole sphere fits with a margin; zoomed in it grows past the frame and is cropped, like a camera. `false` = the old frameless disc |
| `aspect` | `4/3` framed, `1` frameless | **new.** Root aspect ratio (number or CSS string). A `style` with a height and `aspectRatio: 'auto'` overrides it |
| `legMs` | `9000` | **new.** Nominal time from one place to the next. Long legs take up to 1.2x, short hops 0.5x; the default tour averages ~7.8s per leg |
| `holdMs` | | **deprecated, no effect.** The tour no longer holds |
| `flyMs` | `2800` | now: duration of a flight to a selection (`selectedId`, `flyTo`), scaled like legs |
| `tour` | `true` | run the automatic tour |
| `places` | all `cities` | pins `{ id, name, coordinates: [lon, lat], description }` |
| `tourPlaces` | `tourPlaces` from places.js | places to drift through, in order |
| `zoomIn` | `4` | zoom near a place (1 = whole globe fits) |
| `maxZoom` | `8` | limit for wheel/pinch/+/- |
| `interactive` | `true` | drag (inertia), click pins, keys, buttons |
| `zoomable` | `false` | wheel, pinch, +/- |
| `showCaption` | `true` | built-in caption: name + description |
| `showControls` | `true` | built-in prev / pause / next text buttons |
| `renderCaption` | | `(place, { moving, auto }) => node` replaces the built-in caption. `moving`: time to fade; `auto`: the drift (not the visitor) brought this place |
| `onStop` | | `(place, { auto })` as the camera passes closest to a place, or arrives at one the visitor asked for (`auto: false`) |
| `onPick` | | `(place)` when a pin is clicked (not on drags) |
| `selectedId` | `null` | fly to this place and stay; back to `null` resumes the tour |
| `homeId` | the `home: true` place | pin drawn as home |
| `reducedMotion` | follows the media query | force `true`/`false` |
| `className`, `style` | | root (`position: relative`) |
| `classNames` | `{}` | slots `frame` (new), `caption`, `captionTitle`, `captionText`, `controls`, `button`, `fallback`. A provided slot drops that part's inline style; `frame` drops the border, tint and radius and adds the class to the root |
| `ariaLabel` | describes the tour | accessible name |

Ref handle: `flyTo(idOrPlace)`, `next()`, `prev()`, `pause()`, `play()`.

**Motion.** The camera drifts continuously through the tour places in order and never stops at
one. Each leg is a single path (`tourMotion.js`): `d3.geoInterpolate` along the great circle for
the rotation, and van Wijk & Nuij's smooth zoom (the path behind `d3.interpolateZoom`, with
u = arc length and w = 2/zoom, ρ = 1.5) so it zooms out further on longer legs (to ~1.5 for
Marrakesh → Kingston, ~2.4 for short hops; very short hops are treated as 0.6 rad so every leg
breathes out a little). Progress eases in and out over the leg, and consecutive legs overlap by
0.4 × `legMs` and are cross-faded with a smoothstep weight, so the camera rounds each place (peak
zoom ~3.5) with continuous velocity. In a Node simulation of the default tour the perceived
speed never reaches zero (slowest ~0.025 vs a median of 0.23 globe-widths/s, at the apex of the
Cambridge → Wyckoff hop) and changes by at most 0.006 per frame.

- **Caption:** changes as the camera passes closest to each place (the middle of the overlap),
  stays ~0.6 × `legMs`, then fades out (the built-in caption goes to opacity 0).
- **Hover:** the drift eases down to a crawl (12% speed, ~0.45s time constant) and back up when
  the pointer leaves. A crawl rather than a pause keeps the "never stops" feel and has no jolt;
  pins move slowly enough to click. Flights the visitor asks for (pin, prev/next, `flyTo`,
  selection) always run at full speed, hovered or not.
- **Drag** takes over (inertia as before; touch/pen drags spin east-west only). 2.5s after it
  settles, the tour resumes from the current view towards the nearest next place, from rest,
  with no jump.
- **Prev/next** retarget the drift: a new leg from the current camera, cross-faded from the old
  motion over ~2s. "next" from a place you're heading for skips past it.
- **Pause** eases to a standstill; prev/next while paused fly and stop there; play resumes.
- Stops while the tab is hidden or the globe is off screen; a long gap never jumps the camera.
- **Reduced motion** (`prefers-reduced-motion`, or `?motion=reduce` on /map): a static framed
  view of home with its caption; prev/next jump without animation.
- **Screen readers:** the visual caption is not a live region (it changes every ~8s). A hidden
  polite live region announces only places the visitor asked for, and the description lists
  every tour place. If you render your own caption, do the same using `auto`.
- **Touch:** `touch-action: pan-y` always, so the page scrolls over the globe on phones; pinch
  still zooms when `zoomable`.

Colours come from the `--globe-*` tokens, read once per `data-theme` change (MutationObserver),
never per frame. Countries are drawn per feature (no `topojson.merge`), French Guiana is split
off France, and Morocco's outline is cut at the Western Sahara border (27.667N) so the coastal
strip no longer lights up. If the world outlines can't be fetched, a quiet note shows.

### Smoothness and frame times

- World rings are converted once (shared across globes) to 3D unit vectors, densified to ≤1°
  along great circles. Each frame builds one rotation basis; a ring wholly on the near side is
  projected with 5 multiplies per point straight onto the canvas path (sub-0.6px steps skipped).
- Countries are culled by a bounding cap: wholly behind the globe or outside the frame, skipped;
  only countries crossing the horizon go through d3's clipping `geoPath`.
- The graticule is pre-built and clipped at the horizon by hand; pins use precomputed vectors.
- Halo and limb gradients are built once per theme on a unit circle and drawn under a scale
  transform; nothing calls `getComputedStyle` per frame; hit-test objects are reused.
- One rAF loop per globe; canvases are DPR-aware, capped at 2; the map redraws only when the
  camera moved.

Measured at 1440×900 on `/map` (globe 704×640 CSS px, DPR 1) over 75s of touring (9 legs), in
headless Chrome 158 with `--disable-background-timer-throttling --disable-renderer-backgrounding
--disable-backgrounding-occluded-windows` (the in-app browser pane was hidden, which throttles
rAF), using the dev-only frame stats:

| | average | p95 |
| --- | --- | --- |
| frame interval | **16.72 ms** | **16.8 ms** (steady 60fps; a few isolated 33ms frames) |
| draw time per frame (map + pins) | **1.9 ms** | **3.9 ms** (worst 10s window: 6.2 ms) |

In the in-app browser (hidden pane, timed synchronously with `__tourGlobeBench`): 1.95 ms
average / 3.5 ms p95 while touring; the fully zoomed-out view (k = 1, the most countries) is
4.7 ms average / 6.6 ms p95.

Dev-only tools: `?globe-stats` on any page shows an overlay (draw and frame averages/p95);
`canvasParent.__tourGlobeStats()` returns them; `__tourGlobeBench(n)` times n frames of tour +
draw synchronously; `__tourGlobeTick(ms)` advances one frame (useful when the pane throttles
rAF); `__tourGlobe` is the internal state.

## Editing the tour

Open `src/data/places.js`. Every place with `tour: <number>` is a stop, visited in number
order; `tour: true` stops go after the numbered ones. Delete the line (or set `tour: false`) to
drop a stop. The caption shows the place's `name` and `description`. Current tour (8 stops):
Cambridge / Boston (home) → Wyckoff → London → València → Marrakesh → Kingston →
Antigua & Atitlán → the Bay → back to Cambridge.

## The /map page

`/map` is a plain reference: the touring globe (zoomable), a detail block for the selected
place, and every place grouped by country. Clicking a place in the list or on the globe sets
`?place=<id>`, flies there and shows its description; the Bay shows the SF photos (thumbs, full
image on click). `?motion=reduce` forces the reduced-motion path for checking. (Its intro line
still says "hover to pause"; the globe now slows to a crawl. Left as is so hearth's rewritten
MapPage merges cleanly.)

## Changes after the first commit

The first commit (`2c9d3cd`) is what the direction builders branched from. Later commits are
additive. The only edits to files that existed then: `Home.jsx` and `Vaisi.jsx` now use
`thumb()`/`full()` for photos, `MapPage.jsx` went from a placeholder list to the TourGlobe
page, and `index.css` gained three `.prose-body` rules that keep post-body images inside a
390px screen (some posts have fixed pixel widths). No token names, routes, page file names, or
the `useTheme` API changed. Pull these into your branch with `git merge redesign2/base` if you
branched early; conflicts are unlikely unless you edited the same reference pages.
Base v2's changes (palettes, the framed drifting globe, the QA fixes) are summarised under
"Merging base v2" below.

## Merging base v2 into trail and hearth

`git merge-tree` of `redesign2/base` into `redesign2/trail` and into `redesign2/hearth`: **both
clean, no conflicts.** Trial merges in temporary worktrees also build (`vite build` passes); the
temp worktrees were removed and neither branch was touched. Base v2 only edits files the
directions didn't change (`themes.css`, `useTheme.js`, `TourGlobe.jsx`, `geo.js`), adds new files,
adds a separate block to `index.html`, and changes one line of `Layout.jsx` that hearth kept.

What each direction will see after merging, and may want to adjust:
- **Both:** the globe becomes a framed 4:3 card. trail (`.t-globe-frame > div`) and hearth
  (`.globe-slot`) clip the globe root to a round lens inside a square box, which now crops the
  card oddly. Either drop the round-lens rule and the square `aspect-ratio` (Jason asked for the
  rectangle), or pass `frame={false}` to keep the disc. Tint and border come from
  `--globe-frame` and `--rule`, or restyle via `classNames.frame`.
- **Both:** captions now come every ~7–9s with no hold. `onStop` still fires, now as the camera
  passes each place; its second argument `{ auto }` says whether the visitor asked for it. Your
  own captions are `aria-live`; keep them quiet for `auto` updates (see Screen readers).
- **Both:** your pause/prev/next controls still work through the ref.
- **hearth:** `japandi` now has walnut text and moss links (Jason's v2 palette); keep
  `japandi-night` as the dark pair, or offer the six palettes with `PaletteSwitcher`. The second
  no-flash block in `index.html` lists the new ids; trim it if you don't offer them.
- **trail:** `earth` and `earth-dusk` are unchanged. trail's own `Shell.jsx` has the same
  scroll-to-top effect as base's Layout; give it the `/now/bonus` exception too. TourGlobe now
  sets `touch-action: pan-y` itself.

## Verification

`npm run build` passes; `node scripts/check-contrast.mjs` passes (output above).

In the in-app browser (own tab on port 5187; the pane was hidden, so rAF was throttled and the
loop was driven with `__tourGlobeTick()` at 60Hz where timing mattered):
- `/map` at 1440×900 and 375 wide: framed card with hairline border and tint; zoomed out the
  whole sphere fits with a margin; zoomed in it is cropped by the frame.
- 75s of touring: captions changed at each place in order (Cambridge, Wyckoff, London, València,
  Marrakesh, Kingston, Antigua, the Bay, Cambridge…) every 7.3–9.3s; the camera never stopped
  (minimum per-frame movement above zero); peak zoom ~3.5 at each place.
- Hover: rate eased 1 → 0.17 in 1s and back to 0.95 after leaving; a pick under hover flew at
  full speed and arrived; the live region announced only that pick, not the auto captions.
- Drag (real mouse and synthetic pointer events): took over with inertia, resumed 2.5s later
  from the same view with no jump, accelerating smoothly towards the nearest next place. A touch
  drag moved longitude only.
- Next: the retarget blended (per-frame speed changed smoothly); a pin click set `?place=`; the
  selection flew and stayed; "Back to the tour" resumed.
- `?motion=reduce`: static, caption on home, next jumped with no animation.
- All six palettes recoloured the page, the frame tint and the globe live; the choice persisted
  across a reload (second no-flash block). `PaletteSwitcher` (mounted temporarily for the test,
  not committed): radios named, roving tabindex, ArrowRight wrapped walnut → japandi, Home worked.
- `/now/bonus` keeps its scroll position (Layout no longer scrolls to top there); other routes
  still start at the top. The Western Sahara strip is no longer filled as visited.
- No console errors from the current code.
- Base Home has no globe (it never had one), so the globe checks were on `/map`; Home was
  checked for palettes only.

## Known issues

- The 110m world file is coarse at high zoom (small islands vanish, coastlines are blocky).
  Swapping `geoUrl` to the 50m file sharpens it at ~4x the download.
- Morocco's cut is a Sutherland–Hodgman clip along a parallel in lon/lat; fine at this scale.
- The zoomed-out frame (k = 1) is the most expensive (~4.7 ms); the tour rarely goes below
  k ≈ 1.5. Untested on a slow phone.
- The camera slows (but doesn't stop) as it rounds each place and at the apex of very short hops
  (Cambridge → Wyckoff is 320 km); that is the zoom turning round. Raise `legMs` for calmer,
  lower for brisker. ρ, the overlap and the short-hop floor are constants in `tourMotion.js`.
- After a drag the tour restarts from rest (not with the drag's leftover velocity), so there is
  a gentle acceleration rather than a jump.
- TourGlobe is ~930 lines plus ~190 in `tourMotion.js`, mostly JSDoc, drawing and pointer handling.
- The /map detail block sits under the globe; on a short screen you scroll to see the photos.
- `tour: true` places are ordered after numbered ones; mixing both is allowed but numbers are
  clearer.

## Blocked

Nothing was blocked. (ESLint has no config in this repo, so lint wasn't run; the build is the check.)
