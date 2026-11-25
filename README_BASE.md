# redesign2/base: the shared foundation for round 2

Branch from this. It is a clean, plain React + Vite app with every route wired to the real
data, four themes, web-sized images, and the touring globe. The styling is deliberately
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
| `src/theme/themes.css` | The four themes as CSS custom properties, plus the legacy `--portfolio-*` mapping. |
| `src/theme/useTheme.js` | `ThemeProvider` + `useTheme()`; the no-flash script lives in `index.html`. |
| `src/components/TourGlobe.jsx` | The touring globe (API below). |
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

## Themes

Set by `<html data-theme="...">`: `japandi` (light, default), `japandi-night` (dark), `earth`
(light), `earth-dusk` (dark). Palettes and contrast ratios are documented at the top of
`themes.css`; every text pair is at least 4.5:1.

| Token | Use |
| --- | --- |
| `--bg` | page background |
| `--surface` | slightly raised area (captions, asides); use sparingly |
| `--text` | body text |
| `--muted` | secondary text: dates, captions, labels (safe for text) |
| `--faint` | decoration only (hairlines, dots); not for text |
| `--accent` | primary accent (active nav, focus ring) |
| `--accent-2` | secondary accent |
| `--rule` | hairline rules and borders |
| `--link`, `--link-hover` | inline links |
| `--globe-ocean`, `--globe-land`, `--globe-visited`, `--globe-going`, `--globe-bucket` | globe fills |
| `--globe-border` | country borders (thin, usually the page bg) |
| `--globe-pin`, `--globe-pin-home` | pins |
| `--globe-halo` | soft halo around the disc |
| `--globe-limb` (optional) | limb shade inside the edge; defaults to `rgba(0,0,0,0.07)` |

Legacy tokens (used inside blog bodies, the now entry, profile, vaisi via Tailwind classes like
`text-portfolio-gold`) are mapped: `--portfolio-bg → --bg`, `-text → --text`, `-gold → --link`,
`-muted → --muted`, `-card → --surface`, `-card-text → --text`, `-border → --rule`,
`-green → --accent-2`, `-on-gold → --bg`. Don't redefine them per page; change the semantic
tokens instead.

### useTheme

```jsx
<ThemeProvider defaultTheme="japandi" allowed={['japandi', 'japandi-night']}>…</ThemeProvider>
const { theme, setTheme, themes, cycle } = useTheme();
// themes: [{ id, label, dark }] (filtered by `allowed`); cycle() moves to the next one.
// A quiet "dark" link: <button onClick={cycle}>{themes.find(t => t.id === theme).dark ? 'light' : 'dark'}</button>
```

Stored in `localStorage['jc-theme']`. If you add or rename a theme, update the id list in the
inline script in `index.html` too. You can tune token values for your direction (contrast
permitting), but keep the token names.

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
  <TourGlobe style={{ height: 480, aspectRatio: 'auto' }} onPick={(p) => …} />
</Suspense>
```

| Prop | Default | |
| --- | --- | --- |
| `tour` | `true` | run the automatic tour |
| `places` | all `cities` | pins `{ id, name, coordinates: [lon, lat], description }` |
| `tourPlaces` | `tourPlaces` from places.js | stops, in order |
| `holdMs` | `3500` | hold at each stop |
| `flyMs` | `2800` | a long leg's duration (short hops are quicker, ~0.45x) |
| `zoomIn` | `4` | zoom at a stop (1 = whole globe fits) |
| `maxZoom` | `8` | limit for wheel/pinch/+/- |
| `interactive` | `true` | drag (inertia), click pins, keys, buttons |
| `zoomable` | `false` | wheel, pinch, +/- |
| `showCaption` | `true` | built-in caption: name + description |
| `showControls` | `true` | built-in prev / pause / next text buttons |
| `renderCaption` | | `(place, { moving }) => node` replaces the built-in caption |
| `onStop` | | `(place)` on arrival at a stop or selection |
| `onPick` | | `(place)` when a pin is clicked (not on drags) |
| `selectedId` | `null` | fly to this place and hold; back to `null` resumes the tour |
| `homeId` | the `home: true` place | pin drawn as home |
| `reducedMotion` | follows the media query | force `true`/`false` |
| `className`, `style` | | root; it is `position: relative` and a square by default. Give it a height (and `aspectRatio: 'auto'`) to change that |
| `classNames` | `{}` | slots `caption`, `captionTitle`, `captionText`, `controls`, `button`, `fallback`. A provided slot drops that part's inline style, so your CSS has full control |
| `ariaLabel` | describes the tour | accessible name |

Ref handle: `flyTo(idOrPlace)`, `next()`, `prev()`, `pause()`, `play()`.

Behaviour: it starts zoomed out, flies along the great circle to stop 1 while zooming in, holds
`holdMs` with the caption, then zooms out (further for long legs) while turning toward the next
stop, and loops. Hover pauses; it resumes 1.5s after the pointer leaves. Pressing or dragging takes
over (with inertia); 4s after release it resumes from the nearest stop. Left/right arrows step when
it has focus. It stops while the tab is hidden or the globe is off screen. Under reduced motion,
nothing moves on its own: it shows home with its caption, and prev/next jump without animation.
Colours come from the `--globe-*` tokens and update live on a `data-theme` change. Countries are
drawn per feature (no `topojson.merge`, so no stray Madagascar fill), and French Guiana is split
off France. If the world outlines can't be fetched, a quiet note shows and the pins still draw.

In dev builds, `canvasParent.__tourGlobe` exposes the internal state and `__tourGlobeTick()`
advances one frame (useful when the browser throttles `requestAnimationFrame`).

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
image on click). `?motion=reduce` forces the reduced-motion path for checking.

## Changes after the first commit

The first commit (`2c9d3cd`) is what the direction builders branched from. Later commits are
additive. The only edits to files that existed then: `Home.jsx` and `Vaisi.jsx` now use
`thumb()`/`full()` for photos, `MapPage.jsx` went from a placeholder list to the TourGlobe
page, and `index.css` gained three `.prose-body` rules that keep post-body images inside a
390px screen (some posts have fixed pixel widths). No token names, routes, page file names, or
the `useTheme` API changed. Pull these into your branch with `git merge redesign2/base` if you
branched early; conflicts are unlikely unless you edited the same reference pages.

## Verification (done in the in-app browser)

`npm run build` passes. On `/map`: two full tour cycles logged (fly, zoom in, hold 3.5s,
zoom out, correct captions, loop back to Cambridge); hover pauses and resumes ~1.5s after
leaving; a drag takes over with inertia and the tour resumes from the nearest stop ~4s later;
clicking a pin selects it (`?place=`), the Bay shows the SF thumbs and the lightbox; "Back to
the tour" resumes; arrow keys step; all four themes recolour the globe live; `?motion=reduce`
is static on home and prev/next jump; no console errors; no Madagascar or French Guiana
artefacts; 390px has no horizontal scroll on any route; footnote links work.

The pane was hidden during testing, so the browser throttled `requestAnimationFrame`; timing
was checked by driving the loop with the dev-only `__tourGlobeTick()` at ~60Hz. Worth one look
in a normal visible tab for smoothness.

## Known issues

- The 110m world file is coarse at high zoom (small islands vanish, coastlines are blocky).
  Swapping `geoUrl` to the 50m file sharpens it at ~4x the download.
- In world-atlas 110m, Morocco's outline reaches down along the Western Sahara coast, so a
  strip south of Morocco shows as "visited". Western Sahara's own feature is painted on top
  (`DRAW_LAST` in `lib/geo.js`), but the coastal strip belongs to Morocco's polygon.
- A full redraw at zoom 1 is the expensive frame (~180 country paths); zoomed in, culling
  skips most countries. Fine on a laptop; untested on a slow phone.
- TourGlobe is ~720 lines (the brief hoped for ~600), mostly the JSDoc and pointer handling.
- The /map detail block sits under the globe; on a short screen you scroll to see the photos.
- `tour: true` places are ordered after numbered ones; mixing both is allowed but numbers are
  clearer.

## Blocked

Nothing was blocked.
