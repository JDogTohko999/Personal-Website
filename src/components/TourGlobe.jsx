import React, { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import { geoCentroid, geoDistance, geoInterpolate, geoOrthographic, geoPath } from 'd3-geo';
import { cities, homePlace, tourPlaces as defaultTour } from '../data/places.js';
import { DRAW_LAST, categoryOf, loadWorld } from '../lib/geo.js';
import { copyCam, evalPlan, makePlan, nearestNext, targetIndex } from './tourMotion.js';

/**
 * TourGlobe: a calm, theme-aware canvas globe that drifts through Jason's places.
 *
 * By default the sphere sits in a framed rectangle (a camera looking at a globe): zoomed out, the
 * whole sphere fits with a margin; zoomed in, it grows past the frame and is cropped by it. The
 * camera moves continuously from place to place, never stopping: each leg zooms out, travels and
 * zooms in along one smooth path (great circle + van Wijk zoom, see ./tourMotion.js), and
 * consecutive legs overlap so the velocity never drops to zero. The caption changes as the camera
 * passes closest to each place, then fades. Colours come from the --globe-* tokens and update
 * live when data-theme changes.
 *
 * Props (all optional):
 * @param {boolean}  tour=true          Run the automatic tour.
 * @param {object[]} places=cities      Pins to draw ({ id, name, coordinates:[lon,lat], description }).
 * @param {object[]} tourPlaces         Places to drift through, in order (default: places.js `tourPlaces`).
 * @param {boolean}  frame=true         Draw inside a framed rectangle. false: the old frameless disc.
 * @param {number|string} aspect        Root aspect ratio: 4/3 framed, 1 frameless. Ignored if style sets a height.
 * @param {number}   legMs=9000         Nominal time from one place to the next (long legs take up to
 *                                      ~1.2x, short hops ~0.5x; ~7.8s on average for the default tour).
 * @param {number}   flyMs=2800         Duration of a flight to a selected place (selectedId / flyTo).
 * @param {number}   holdMs             Deprecated, no effect: the tour no longer holds at places.
 * @param {number}   zoomIn=4           Zoom near a place (1 = whole globe fits).
 * @param {number}   maxZoom=8          Upper limit for wheel / pinch / +/- zoom.
 * @param {boolean}  interactive=true   Drag to spin (with inertia), click pins, keys, buttons.
 * @param {boolean}  zoomable=false     Wheel, pinch and +/- zoom.
 * @param {boolean}  showCaption=true   Built-in caption (name + description of the latest place).
 * @param {boolean}  showControls=true  Built-in prev / pause / next text buttons.
 * @param {function} renderCaption      (place, { moving, auto }) => node, replaces the built-in caption.
 *                                      moving: the caption should fade; auto: the automatic drift
 *                                      (not the visitor) brought this place. Don't make an
 *                                      auto-updating caption aria-live; announce only !auto changes.
 * @param {function} onStop             (place, { auto }) as the camera passes closest to a place,
 *                                      or arrives at one the visitor asked for (auto: false).
 *                                      (Name kept from the version that stopped.)
 * @param {function} onPick             (place) when a pin is clicked/tapped (not on drags).
 * @param {number}   selectedId         Fly to this place and stay; null resumes the tour.
 * @param {number}   homeId             Pin drawn as home (default: the `home: true` place).
 * @param {boolean}  reducedMotion      Override prefers-reduced-motion (true/false); default follows it.
 * @param {string}   className          Root element class.
 * @param {object}   classNames         Slots { frame, caption, captionTitle, captionText, controls,
 *                                      button, fallback }. A provided slot drops that part's
 *                                      built-in inline style (for `frame`: the border, tint and
 *                                      radius), so you can restyle it fully.
 * @param {object}   style              Root inline style (e.g. { height: 480, aspectRatio: 'auto' }).
 * @param {string}   ariaLabel          Accessible name (a default describing the tour is used).
 *
 * Ref handle: { flyTo(idOrPlace), next(), prev(), pause(), play() }.
 *
 * Behaviour: hovering eases the drift down to a slow crawl (HOVER_RATE) and back up when the
 * pointer leaves, but a flight the visitor asked for (pin, prev/next, flyTo, selection) always
 * runs at full speed; dragging takes over (with inertia) and, a moment after it settles, the tour
 * resumes from the current view towards the nearest next place; prev/next retarget the drift
 * (animated, blended from the current motion); arrow keys step when focused; it stops while the
 * tab is hidden or the globe is off screen. Under reduced motion nothing moves on its own: a
 * static framed view of home with its caption, and prev/next jump without animation.
 * Touch: touch-action is pan-y and touch/pen drags spin east-west only, so the page still
 * scrolls. Screen readers: the visual caption is not a live region; a hidden polite live region
 * announces only places the visitor asked for, and the description lists the whole tour.
 *
 * Fast: world rings are pre-converted to 3D unit vectors once; each frame rotates them with one
 * 3x3 basis (no per-point trig), culls back-facing and off-frame countries by bounding cap, and
 * only countries crossing the horizon go through d3's clipping path. Gradients are cached per
 * theme, colours are read only on theme change, and one rAF loop drives everything.
 */

const CATS = ['base', 'bucketList', 'goingSoon', 'visited'];
const TOKENS = {
  ocean: '--globe-ocean', base: '--globe-land', visited: '--globe-visited', goingSoon: '--globe-going',
  bucketList: '--globe-bucket', border: '--globe-border', pin: '--globe-pin', home: '--globe-pin-home',
  halo: '--globe-halo', limb: '--globe-limb',
};
const FALLBACK = {
  ocean: '#fefae1', base: '#e8c998', visited: '#c29665', goingSoon: '#8b8a5a', bucketList: '#d9b28f',
  border: '#f9ead5', pin: '#752c13', home: '#4e5230', halo: 'rgba(0,0,0,0.08)', limb: 'rgba(0,0,0,0.07)',
};
const MAX_TILT = 75;
const HOVER_RATE = 0.12;       // hover: ease down to 12% speed (a crawl), not a stop
const RATE_TAU = 450;          // ms time constant for easing the speed up/down
const HOVER_RESUME_MS = 1200;
const MANUAL_RESUME_MS = 2500; // after a drag has settled
const INTRO_MS = 400;
const FADE_AFTER = 0.6;        // caption fades this fraction of legMs after passing a place
const MAX_SEG = Math.PI / 180; // densify world edges to <= 1 degree (great-circle, like d3)
const D2R = Math.PI / 180;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

const motionQuery = () =>
  typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

// ---- world preprocessing (once per loaded world, shared by every globe on the page) ----
const prepared = new WeakMap();
const toXYZ = (lon, lat, out, i) => {
  const l = lon * D2R; const p = lat * D2R; const c = Math.cos(p);
  out[i] = c * Math.cos(l); out[i + 1] = c * Math.sin(l); out[i + 2] = Math.sin(p);
};
function prepareWorld(features) {
  if (prepared.has(features)) return prepared.get(features);
  const items = features.map((f) => {
    const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
    const c = geoCentroid(f);
    let rad = 0;
    const rings = [];
    polys.forEach((poly) => poly.forEach((ring) => {
      const pts = [];
      for (let i = 0; i < ring.length; i++) {
        const p = ring[i];
        rad = Math.max(rad, geoDistance(c, p));
        if (i > 0) {
          const q = ring[i - 1];
          const n = Math.ceil(geoDistance(q, p) / MAX_SEG);
          if (n > 1) { const ip = geoInterpolate(q, p); for (let j = 1; j < n; j++) pts.push(ip(j / n)); }
        }
        pts.push(p);
      }
      const xyz = new Float64Array(pts.length * 3);
      pts.forEach((p, i) => toXYZ(p[0], p[1], xyz, i * 3));
      rings.push(xyz);
    }));
    const cv = new Float64Array(3);
    toXYZ(c[0], c[1], cv, 0);
    return { f, rings, cv, rad, cat: categoryOf(f) || 'base' };
  });
  // Paint order: by category, then the overlaps in DRAW_LAST (Western Sahara over Morocco).
  const rank = (it) => (DRAW_LAST.has(it.f.id) ? CATS.length : CATS.indexOf(it.cat));
  items.sort((a, b) => rank(a) - rank(b));
  prepared.set(features, items);
  return items;
}

// Graticule (every 20 degrees) as 3D polylines, clipped at the horizon when drawn.
const GRATICULE = (() => {
  const lines = [];
  for (let lon = -180; lon < 180; lon += 20) {
    const a = new Float64Array(65 * 3);
    for (let i = 0; i <= 64; i++) toXYZ(lon, -80 + (160 * i) / 64, a, i * 3);
    lines.push(a);
  }
  for (let lat = -80; lat <= 80; lat += 20) {
    const a = new Float64Array(145 * 3);
    for (let i = 0; i <= 144; i++) toXYZ(-180 + (360 * i) / 144, lat, a, i * 3);
    lines.push(a);
  }
  return lines;
})();

const TourGlobe = forwardRef(function TourGlobe(
  {
    tour = true,
    places = cities,
    tourPlaces = defaultTour,
    frame = true,
    aspect,
    legMs = 9000,
    flyMs = 2800,
    holdMs, // eslint-disable-line no-unused-vars -- deprecated, no effect
    zoomIn = 4,
    maxZoom = 8,
    interactive = true,
    zoomable = false,
    showCaption = true,
    showControls = true,
    renderCaption,
    onStop,
    onPick,
    selectedId = null,
    homeId = homePlace?.id,
    reducedMotion,
    className = '',
    classNames = {},
    style,
    ariaLabel,
  },
  ref,
) {
  const wrapRef = useRef(null);
  const baseRef = useRef(null);
  const topRef = useRef(null);
  const descId = useId();
  const [cap, setCap] = useState({ place: null, moving: true, auto: true });
  const [announce, setAnnounce] = useState('');
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState(false);

  const propsRef = useRef({});
  propsRef.current = { tour, places, tourPlaces, legMs, flyMs, zoomIn, maxZoom, interactive, zoomable, onStop, onPick, homeId, frame };

  const home = places.find((p) => p.id === homeId) || tourPlaces[0] || places[0];

  // Everything the render loop touches lives in one mutable object.
  const s = useRef(null);
  if (!s.current) {
    const reduced = reducedMotion ?? !!motionQuery()?.matches;
    const first = tourPlaces[0] || home;
    s.current = {
      reduced,
      // Reduced: sit on home, zoomed in. Otherwise start zoomed out, a little east of the first place.
      cam: reduced && home
        ? { lon: home.coordinates[0], lat: home.coordinates[1], k: zoomIn }
        : { lon: (first?.coordinates[0] ?? 0) + 35, lat: 15, k: 1 },
      drawn: { lon: NaN, lat: NaN, k: NaN },
      clock: 0, rate: 1, plan: null, started: false, introAt: 0, capFadeAt: 0, capPlace: null, boostUntil: -1,
      vel: [0, 0], drag: null, pinch: null, pointers: new Map(),
      hovering: false, manual: false, resumeAt: 0, userPaused: false, pinned: null,
      hover: null, screen: [], screenN: 0, world: null, pinVecs: null, colors: FALLBACK, grad: null,
      size: { w: 0, h: 0, dpr: 1 }, dirty: true, pinsDirty: true, visible: true,
    };
  }
  const st = s.current;

  // ---- tour control (plain functions over `st`; React state only for caption/paused) ----
  // A place is reached (passed, or arrived at). `user`: the visitor asked for it (pick, prev/next,
  // flyTo, selection). Only those are announced to screen readers; the automatic drift is not.
  const passed = (place, user = false) => {
    st.capPlace = place;
    st.pinsDirty = true;
    setCap({ place, moving: false, auto: !user });
    if (user) setAnnounce(`${place.name}. ${place.description || ''}`);
    propsRef.current.onStop?.(place, { auto: !user });
  };

  const jump = (place, user = true) => {
    st.plan = null;
    st.cam = { lon: place.coordinates[0], lat: place.coordinates[1], k: Math.max(st.cam.k, propsRef.current.zoomIn) };
    st.dirty = true;
    passed(place, user);
  };

  // Head for `place` from wherever the camera is now, blending out of the current motion.
  // user: the visitor asked for this flight, so it runs at full speed even while hovered.
  const startPlan = (place, idx, terminal, user = true) => {
    if (!place) return;
    if (st.reduced) { jump(place, user); return; }
    const p = propsRef.current;
    const moving = st.plan && !st.plan.done && st.rate > 0.05 && !st.manual;
    const nextIdx = idx >= 0 ? undefined : nearestNext(p.tourPlaces, place.coordinates[0], place.coordinates[1]);
    st.plan = makePlan({
      cam: st.cam, first: place, firstIdx: idx, nextIdx, tour: p.tourPlaces, terminal, t0: st.clock,
      legMs: p.legMs, flyMs: p.flyMs, zoomIn: p.zoomIn,
      from: moving ? st.plan : null, blendMs: Math.min(2000, 0.3 * p.legMs),
    });
    if (user) { st.plan.legs[0].user = true; st.boostUntil = st.plan.legs[0].passAt; }
    st.manual = false;
    st.vel = [0, 0];
    if (terminal) setCap((c) => (c.place ? { ...c, moving: true } : c));
  };

  const currentIndex = () => {
    const list = propsRef.current.tourPlaces;
    const t = st.plan ? targetIndex(st.plan) : -1;
    if (t >= 0 && !st.plan.terminal) return { idx: t, ahead: true };
    const n = nearestNext(list, st.cam.lon, st.cam.lat, 0); // nearest
    const onIt = geoDistance([st.cam.lon, st.cam.lat], list[n].coordinates) < 0.08;
    return { idx: n, ahead: !onIt };
  };

  const step = (dir) => {
    const list = propsRef.current.tourPlaces;
    if (!list.length) return;
    const { idx, ahead } = currentIndex();
    // "next" from a place we're heading for skips past it; from a place we're on, goes to the one after.
    const i = ((ahead ? idx + (dir > 0 ? 1 : -1) : idx + dir) + list.length) % list.length;
    st.pinned = null;
    startPlan(list[i], i, st.userPaused);
  };

  const flyToPlace = (place, terminal) => {
    if (!place) return;
    startPlan(place, propsRef.current.tourPlaces.indexOf(place), terminal);
  };

  const setUserPaused = (v) => {
    st.userPaused = v;
    setPaused(v);
    if (!v && st.plan?.terminal && !st.pinned) st.plan = null; // resume the tour from here
  };

  useImperativeHandle(ref, () => ({
    flyTo(idOrPlace) {
      const place = typeof idOrPlace === 'object' ? idOrPlace : propsRef.current.places.find((p) => p.id === idOrPlace);
      flyToPlace(place, false);
    },
    next: () => step(1),
    prev: () => step(-1),
    pause: () => setUserPaused(true),
    play: () => setUserPaused(false),
  }));

  // Selection: fly there and stay until cleared; clearing resumes the tour after a beat.
  useEffect(() => {
    const place = selectedId == null ? null : propsRef.current.places.find((p) => p.id === selectedId);
    if (place) {
      st.pinned = place;
      flyToPlace(place, true);
    } else if (st.pinned) {
      st.pinned = null;
      if (st.plan?.terminal) st.plan = null;
      st.resumeAt = performance.now() + HOVER_RESUME_MS;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  useEffect(() => { if (reducedMotion != null) st.reduced = reducedMotion; st.pinsDirty = true; }, [reducedMotion, st]);
  useEffect(() => {
    st.pinVecs = new Float64Array(places.length * 3);
    places.forEach((p, i) => toXYZ(p.coordinates[0], p.coordinates[1], st.pinVecs, i * 3));
    st.screen = places.map(() => ({ pin: null, x: 0, y: 0 }));
    st.pinsDirty = true;
  }, [places, homeId, st]);
  useEffect(() => { st.dirty = true; }, [frame, st]);

  // Under reduced motion, show home's caption straight away.
  useEffect(() => {
    if (st.reduced && home && !st.pinned) passed(home, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    const base = baseRef.current;
    const top = topRef.current;
    const bctx = base.getContext('2d');
    const tctx = top.getContext('2d');
    const projection = geoOrthographic().clipAngle(90).precision(0.5);
    const path = geoPath(projection, bctx);
    let raf = 0;
    let last = performance.now();
    let alive = true;
    st.introAt = last + INTRO_MS;

    loadWorld()
      .then((features) => {
        if (!alive) return;
        st.world = prepareWorld(features);
        st.dirty = true;
      })
      .catch(() => alive && setFailed(true));

    const readColors = () => {
      const cs = getComputedStyle(wrap);
      const c = {};
      Object.entries(TOKENS).forEach(([k, v]) => { c[k] = cs.getPropertyValue(v).trim() || FALLBACK[k]; });
      c.font = cs.fontFamily || 'serif';
      // Gradients on a unit circle at the origin, drawn under a scale transform: built once per theme.
      const halo = bctx.createRadialGradient(0, 0, 0.98, 0, 0, 1.08);
      halo.addColorStop(0, c.halo);
      halo.addColorStop(1, 'rgba(0,0,0,0)');
      const limb = bctx.createRadialGradient(0, 0, 0.7, 0, 0, 1);
      limb.addColorStop(0, 'rgba(0,0,0,0)');
      limb.addColorStop(1, c.limb);
      st.grad = { halo, limb };
      st.colors = c;
      st.dirty = true;
    };
    readColors();
    const mo = new MutationObserver(readColors);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class', 'style'] });

    const resize = () => {
      const { width, height } = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      st.size = { w: width, h: height, dpr };
      [base, top].forEach((cv) => { cv.width = Math.round(width * dpr); cv.height = Math.round(height * dpr); });
      st.dirty = true;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    const io = new IntersectionObserver(([e]) => { st.visible = e.isIntersecting; });
    io.observe(wrap);

    const mq = motionQuery();
    const onMq = () => { if (reducedMotion == null) { st.reduced = mq.matches; if (st.reduced) { st.plan = null; st.vel = [0, 0]; } } };
    mq?.addEventListener?.('change', onMq);

    // Sphere radius at zoom 1: framed, it fits the shorter side with a margin.
    const radius = () => {
      const m = Math.min(st.size.w, st.size.h);
      return Math.max(10, propsRef.current.frame ? m / 2 - Math.max(14, m * 0.08) : m / 2 - 10);
    };

    // The view basis: centre C, east E, north N (unit vectors). Screen = c + r * (v.E, -v.N).
    const V = { cx: 0, cy: 0, r: 1, Ex: 0, Ey: 0, Nx: 0, Ny: 0, Nz: 0, Cx: 0, Cy: 0, Cz: 0 };
    const setView = () => {
      const { w, h } = st.size;
      const lon = st.cam.lon * D2R;
      const lat = clamp(st.cam.lat, -MAX_TILT, MAX_TILT) * D2R;
      const sl = Math.sin(lon); const cl = Math.cos(lon); const sp = Math.sin(lat); const cp = Math.cos(lat);
      V.cx = w / 2; V.cy = h / 2; V.r = radius() * st.cam.k;
      V.Ex = -sl; V.Ey = cl;
      V.Nx = -sp * cl; V.Ny = -sp * sl; V.Nz = cp;
      V.Cx = cp * cl; V.Cy = cp * sl; V.Cz = sp;
      projection.translate([V.cx, V.cy]).scale(V.r).rotate([-st.cam.lon, -clamp(st.cam.lat, -MAX_TILT, MAX_TILT), 0]);
    };

    // A ring entirely on the near side: rotate and project straight onto the canvas path.
    const ringFront = (ctx, xyz) => {
      const { cx, cy, r, Ex, Ey, Nx, Ny, Nz } = V;
      const n = xyz.length;
      let px = cx + r * (xyz[0] * Ex + xyz[1] * Ey);
      let py = cy - r * (xyz[0] * Nx + xyz[1] * Ny + xyz[2] * Nz);
      ctx.moveTo(px, py);
      for (let i = 3; i < n; i += 3) {
        const x = cx + r * (xyz[i] * Ex + xyz[i + 1] * Ey);
        const y = cy - r * (xyz[i] * Nx + xyz[i + 1] * Ny + xyz[i + 2] * Nz);
        if (Math.abs(x - px) + Math.abs(y - py) > 0.6 || i === n - 3) { ctx.lineTo(x, y); px = x; py = y; }
      }
      ctx.closePath();
    };

    // A polyline clipped at the horizon (graticule).
    const lineClipped = (ctx, xyz) => {
      const { cx, cy, r, Ex, Ey, Nx, Ny, Nz, Cx, Cy, Cz } = V;
      let pd = -1; let px = 0; let py = 0; let pz = 0;
      for (let i = 0; i < xyz.length; i += 3) {
        const x = xyz[i]; const y = xyz[i + 1]; const z = xyz[i + 2];
        const d = x * Cx + y * Cy + z * Cz;
        if (d >= 0) {
          if (i === 0) ctx.moveTo(cx + r * (x * Ex + y * Ey), cy - r * (x * Nx + y * Ny + z * Nz));
          else if (pd < 0) {
            const t = pd / (pd - d); const ix = px + t * (x - px); const iy = py + t * (y - py); const iz = pz + t * (z - pz);
            ctx.moveTo(cx + r * (ix * Ex + iy * Ey), cy - r * (ix * Nx + iy * Ny + iz * Nz));
          }
          ctx.lineTo(cx + r * (x * Ex + y * Ey), cy - r * (x * Nx + y * Ny + z * Nz));
        } else if (pd >= 0 && i > 0) {
          const t = pd / (pd - d); const ix = px + t * (x - px); const iy = py + t * (y - py); const iz = pz + t * (z - pz);
          ctx.lineTo(cx + r * (ix * Ex + iy * Ey), cy - r * (ix * Nx + iy * Ny + iz * Nz));
        }
        pd = d; px = x; py = y; pz = z;
      }
    };

    const drawMap = () => {
      const { w, h, dpr } = st.size;
      const { cx, cy, r } = V;
      const C = st.colors;
      const ctx = bctx;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const halfDiag = Math.hypot(w, h) / 2;
      const edgeVisible = r * 0.7 < halfDiag;

      // Soft halo and a flat ocean (gradients are unit-sized, so scale them to the disc).
      if (edgeVisible) {
        ctx.setTransform(dpr * r, 0, 0, dpr * r, dpr * cx, dpr * cy);
        ctx.fillStyle = st.grad.halo;
        ctx.fillRect(-1.1, -1.1, 2.2, 2.2);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      ctx.fillStyle = C.ocean;
      ctx.beginPath();
      if (r > halfDiag) ctx.rect(0, 0, w, h); else ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      for (let i = 0; i < GRATICULE.length; i++) lineClipped(ctx, GRATICULE[i]);
      ctx.globalAlpha = 0.45;
      ctx.lineWidth = 0.6;
      ctx.strokeStyle = C.base;
      ctx.stroke();
      ctx.globalAlpha = 1;

      if (st.world) {
        // Each country is filled and stroked on its own path (never merged, so no stray island
        // fills). Countries wholly behind the globe or outside the frame are skipped; those
        // wholly in front take the fast path; only those crossing the horizon use d3's clipper.
        const view = Math.asin(Math.min(1, halfDiag / r)) + 0.02;
        const front = Math.PI / 2 - 0.004;
        ctx.lineJoin = 'round';
        ctx.lineWidth = clamp(0.5 + st.cam.k * 0.12, 0.5, 1.2);
        ctx.strokeStyle = C.border;
        const { Cx, Cy, Cz } = V;
        const world = st.world;
        for (let i = 0; i < world.length; i++) {
          const it = world[i];
          const ang = Math.acos(clamp(it.cv[0] * Cx + it.cv[1] * Cy + it.cv[2] * Cz, -1, 1));
          if (ang - it.rad > view) continue;
          ctx.beginPath();
          if (ang + it.rad < front) {
            for (let j = 0; j < it.rings.length; j++) ringFront(ctx, it.rings[j]);
          } else {
            path(it.f);
          }
          ctx.fillStyle = C[it.cat];
          ctx.fill();
          ctx.stroke();
        }
      }

      // A subtle limb shade so the disc reads as a sphere. No specular highlight.
      if (edgeVisible) {
        ctx.setTransform(dpr * r, 0, 0, dpr * r, dpr * cx, dpr * cy);
        ctx.fillStyle = st.grad.limb;
        ctx.beginPath();
        ctx.arc(0, 0, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };

    const drawPins = () => {
      const { w, h, dpr } = st.size;
      const p = propsRef.current;
      const C = st.colors;
      const ctx = tctx;
      const { cx, cy, r, Ex, Ey, Nx, Ny, Nz, Cx, Cy, Cz } = V;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const scale = clamp(0.9 + (st.cam.k - 1) * 0.1, 0.9, 1.5);
      const current = st.pinned || st.capPlace;
      const pv = st.pinVecs;
      if (!pv) return;
      let n = 0;
      let label = null;
      const minDepth = Math.sin(0.03); // hide pins right at the horizon
      for (let i = 0; i < p.places.length; i++) {
        const x3 = pv[i * 3]; const y3 = pv[i * 3 + 1]; const z3 = pv[i * 3 + 2];
        const depth = x3 * Cx + y3 * Cy + z3 * Cz;
        if (depth < minDepth) continue;
        const x = cx + r * (x3 * Ex + y3 * Ey);
        const y = cy - r * (x3 * Nx + y3 * Ny + z3 * Nz);
        if (x < -20 || y < -20 || x > w + 20 || y > h + 20) continue;
        const pin = p.places[i];
        const isHome = pin.id === p.homeId;
        const isCur = current && pin.id === current.id;
        const isHover = st.hover && st.hover.id === pin.id;
        const pr = (isHome ? 4.6 : 3.3) * scale * (isHover ? 1.3 : 1);
        const sp = st.screen[n++];
        sp.pin = pin; sp.x = x; sp.y = y;
        ctx.globalAlpha = clamp((Math.PI / 2 - Math.acos(depth)) / 0.3, 0.3, 1);
        ctx.beginPath();
        ctx.arc(x, y, pr + 1.6, 0, Math.PI * 2);
        ctx.fillStyle = C.ocean;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, pr, 0, Math.PI * 2);
        ctx.fillStyle = isHome ? C.home : C.pin;
        ctx.fill();
        if (isCur) {
          ctx.beginPath();
          ctx.arc(x, y, pr + 5, 0, Math.PI * 2);
          ctx.lineWidth = 1.3;
          ctx.strokeStyle = isHome ? C.home : C.pin;
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
        if (isHover) label = { text: pin.name, x, y: y - pr };
      }
      st.screenN = n;
      if (label) {
        ctx.font = `600 13px ${C.font}`;
        const tw = ctx.measureText(label.text).width + 14;
        const bx = clamp(label.x - tw / 2, 4, w - tw - 4);
        const by = label.y - 30 < 4 ? label.y + 16 : label.y - 30;
        ctx.fillStyle = C.ocean;
        ctx.globalAlpha = 0.92;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(bx, by, tw, 22, 4); else ctx.rect(bx, by, tw, 22);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = C.pin;
        ctx.textBaseline = 'middle';
        ctx.fillText(label.text, bx + 7, by + 11.5);
      }
    };

    // Passing a place: caption it now, fade it a while later (a selection's caption stays).
    const onPass = (leg) => {
      passed(leg.place, !!leg.user);
      st.capFadeAt = st.plan && !st.plan.terminal ? st.clock + FADE_AFTER * propsRef.current.legMs : 0;
    };
    const render = () => {
      const c = st.cam; const d = st.drawn;
      if (c.lon !== d.lon || c.lat !== d.lat || c.k !== d.k) { st.dirty = true; copyCam(c, d); }
      if (!st.dirty && !st.pinsDirty) return false;
      setView();
      if (st.dirty) { drawMap(); st.dirty = false; }
      drawPins();
      st.pinsDirty = false;
      return true;
    };

    // Dev-only frame statistics: draw time and frame interval, last 600 drawn frames.
    const DEV = !!import.meta.env?.DEV;
    const stats = DEV ? { draw: new Float32Array(600), gap: new Float32Array(600), i: 0, n: 0, lastDraw: 0 } : null;
    const summary = (arr, n) => {
      const a = Array.from(arr.slice(0, n)).filter((v) => v > 0).sort((x, y) => x - y);
      if (!a.length) return { avg: 0, p95: 0, max: 0 };
      return { avg: +(a.reduce((x, y) => x + y, 0) / a.length).toFixed(2), p95: +a[Math.floor(a.length * 0.95)].toFixed(2), max: +a[a.length - 1].toFixed(2) };
    };
    let overlay = null;
    if (DEV && /[?&]globe-stats\b/.test(window.location.search)) {
      overlay = document.createElement('div');
      Object.assign(overlay.style, { position: 'absolute', top: '6px', right: '8px', font: '11px/1.3 monospace', color: 'var(--muted)', pointerEvents: 'none', whiteSpace: 'pre', textAlign: 'right' });
      wrap.appendChild(overlay);
    }

    const tick = (now) => {
      const raw = now - last;
      last = now;
      if (!st.visible || document.hidden || !st.size.w || !st.size.h) return;
      const dt = clamp(raw, 0, 60);                 // physics (inertia, speed easing)
      const tdt = raw > 200 ? 1000 / 60 : raw;       // tour clock: a long gap never jumps the camera
      const p = propsRef.current;

      if (st.drag || st.pinch) {
        // the visitor is steering
      } else if (Math.abs(st.vel[0]) + Math.abs(st.vel[1]) > 0.002) {
        st.cam.lon -= st.vel[0] * dt;
        st.cam.lat = clamp(st.cam.lat - st.vel[1] * dt, -MAX_TILT, MAX_TILT);
        st.vel[0] *= 0.95 ** (dt / 16.7);
        st.vel[1] *= 0.95 ** (dt / 16.7);
        st.resumeAt = now + MANUAL_RESUME_MS;
      } else if (st.manual && now >= st.resumeAt) {
        st.manual = false;
        st.plan = null;
      }

      // Speed: eases down to a crawl on hover, to a standstill when paused, back up after.
      // A flight the visitor asked for always runs at full speed, hovered or not.
      const boost = !!st.plan && st.clock < st.boostUntil;
      const target = st.hovering && !boost ? HOVER_RATE : st.userPaused && !st.plan?.terminal ? 0 : 1;
      st.rate += (target - st.rate) * (1 - Math.exp(-dt / (boost ? 120 : RATE_TAU)));

      const steering = st.reduced || st.manual || st.drag || st.pinch;
      if (!steering) {
        if (!st.plan && p.tour && !st.pinned && !st.userPaused && p.tourPlaces.length && now >= st.resumeAt && now >= st.introAt) {
          // The first plan starts at the first place; later ones (after a drag, a selection, a
          // pause) head for the nearest next place from wherever the camera is.
          const i = st.started ? nearestNext(p.tourPlaces, st.cam.lon, st.cam.lat) : 0;
          st.started = true;
          startPlan(p.tourPlaces[i], i, false, false);
        }
        if (st.plan && !st.plan.done) {
          st.clock += tdt * st.rate;
          evalPlan(st.plan, st.clock, st.cam, onPass);
          if (st.capFadeAt && st.clock >= st.capFadeAt) {
            st.capFadeAt = 0;
            setCap((c) => (c.place ? { ...c, moving: true } : c));
          }
        }
      }

      const t0 = DEV ? performance.now() : 0;
      if (render() && DEV) {
        const t1 = performance.now();
        stats.draw[stats.i] = t1 - t0;
        stats.gap[stats.i] = stats.lastDraw && now - stats.lastDraw < 250 ? now - stats.lastDraw : 0;
        stats.lastDraw = now;
        stats.i = (stats.i + 1) % 600;
        stats.n = Math.min(600, stats.n + 1);
        if (overlay && stats.i % 30 === 0) {
          const d = summary(stats.draw, stats.n); const g = summary(stats.gap, stats.n);
          overlay.textContent = `draw ${d.avg} / p95 ${d.p95} ms\nframe ${g.avg} / p95 ${g.p95} ms`;
        }
      }
    };
    const frameLoop = (now) => {
      raf = requestAnimationFrame(frameLoop);
      tick(now);
    };
    raf = requestAnimationFrame(frameLoop);

    if (DEV) {
      wrap.__tourGlobe = st; // inspect from devtools: $0.__tourGlobe
      wrap.__tourGlobeTick = (ms = 1000 / 60) => { last = performance.now() - ms; tick(performance.now()); };
      wrap.__tourGlobeStats = () => ({ frames: stats.n, draw: summary(stats.draw, stats.n), frame: summary(stats.gap, stats.n) });
      // Time the whole per-frame work (tour step + draw) n times, synchronously, at 60fps steps.
      wrap.__tourGlobeBench = (n = 600) => {
        const times = new Float32Array(n);
        for (let i = 0; i < n; i++) {
          const a = performance.now();
          last = a - 1000 / 60;
          st.dirty = true;
          tick(a);
          times[i] = performance.now() - a;
        }
        return summary(times, n);
      };
    }

    // ---- pointer, wheel and keys ----
    const local = (e) => {
      const rect = top.getBoundingClientRect();
      return [e.clientX - rect.left, e.clientY - rect.top];
    };
    const hit = (x, y, reach) => {
      let best = null;
      let bestD = reach;
      for (let i = 0; i < st.screenN; i++) {
        const sp = st.screen[i];
        const d = Math.hypot(sp.x - x, sp.y - y);
        if (d < bestD) { best = sp.pin; bestD = d; }
      }
      return best;
    };
    const onGlobe = (x, y) => propsRef.current.frame
      || Math.hypot(x - st.size.w / 2, y - st.size.h / 2) <= radius() * st.cam.k + 6;
    const takeOver = () => {
      st.manual = true;
      st.plan = null;
      st.capFadeAt = 0;
      st.resumeAt = performance.now() + MANUAL_RESUME_MS;
      setCap((c) => (c.place ? { ...c, moving: true } : c));
    };

    const down = (e) => {
      if (!propsRef.current.interactive || (e.pointerType === 'mouse' && e.button !== 0)) return;
      const [x, y] = local(e);
      if (!onGlobe(x, y)) return;
      try { top.setPointerCapture(e.pointerId); } catch { /* pointer already gone */ }
      st.pointers.set(e.pointerId, [e.clientX, e.clientY]);
      st.vel = [0, 0];
      const now = performance.now();
      if (st.pointers.size === 2 && propsRef.current.zoomable) {
        const [a, b] = [...st.pointers.values()];
        st.pinch = { d0: Math.hypot(a[0] - b[0], a[1] - b[1]) || 1, k0: st.cam.k };
        st.drag = null;
        takeOver();
      } else if (st.pointers.size === 1) {
        // Touch and pen drag only spin east-west, so a vertical swipe still scrolls the page.
        const flat = e.pointerType !== 'mouse';
        st.drag = { x0: e.clientX, y0: e.clientY, lon0: st.cam.lon, lat0: st.cam.lat, moved: false, lx: e.clientX, ly: e.clientY, lt: now, flat };
        top.style.cursor = 'grabbing';
      }
    };

    const move = (e) => {
      if (st.pointers.has(e.pointerId)) st.pointers.set(e.pointerId, [e.clientX, e.clientY]);
      const p = propsRef.current;
      if (st.pinch && st.pointers.size >= 2) {
        const [a, b] = [...st.pointers.values()];
        st.cam.k = clamp(st.pinch.k0 * (Math.hypot(a[0] - b[0], a[1] - b[1]) / st.pinch.d0), 1, p.maxZoom);
        return;
      }
      if (st.drag) {
        const dx = e.clientX - st.drag.x0;
        const dy = e.clientY - st.drag.y0;
        if (!st.drag.moved && Math.hypot(dx, dy) > 5) { st.drag.moved = true; takeOver(); }
        if (!st.drag.moved) return;
        const k = 180 / (Math.PI * radius() * st.cam.k); // degrees per pixel at the centre
        st.cam.lon = st.drag.lon0 - dx * k;
        if (!st.drag.flat) st.cam.lat = clamp(st.drag.lat0 + dy * k, -MAX_TILT, MAX_TILT);
        const now = performance.now();
        const dtm = Math.max(now - st.drag.lt, 1);
        st.vel = [st.vel[0] * 0.5 + (((e.clientX - st.drag.lx) * k) / dtm) * 0.5, st.drag.flat ? 0 : st.vel[1] * 0.5 + ((-(e.clientY - st.drag.ly) * k) / dtm) * 0.5];
        Object.assign(st.drag, { lx: e.clientX, ly: e.clientY, lt: now });
        st.hover = null;
        return;
      }
      if (e.pointerType === 'mouse' && p.interactive) {
        const [x, y] = local(e);
        const h = hit(x, y, 14);
        if ((h && h.id) !== (st.hover && st.hover.id)) { st.hover = h; st.pinsDirty = true; }
        top.style.cursor = h ? 'pointer' : onGlobe(x, y) ? 'grab' : 'default';
      }
    };

    const up = (e) => {
      const had = st.pointers.delete(e.pointerId);
      try { top.releasePointerCapture(e.pointerId); } catch { /* not captured */ }
      if (st.pinch) { if (st.pointers.size < 2) st.pinch = null; return; }
      if (!st.drag || !had) return;
      const drag = st.drag;
      st.drag = null;
      top.style.cursor = 'grab';
      const now = performance.now();
      if (!drag.moved) {
        st.vel = [0, 0];
        const [x, y] = local(e);
        const pin = hit(x, y, e.pointerType === 'mouse' ? 14 : 24);
        if (pin) propsRef.current.onPick?.(pin);
        return;
      }
      // A flick keeps going; a drag that stopped before release doesn't.
      if (st.reduced || now - drag.lt > 90) st.vel = [0, 0];
      else st.vel = st.vel.map((v) => clamp(v, -0.6, 0.6));
      st.resumeAt = now + MANUAL_RESUME_MS;
    };

    const cancel = (e) => {
      st.pointers.delete(e.pointerId);
      st.drag = null;
      st.pinch = null;
      st.vel = [0, 0];
    };

    const enter = (e) => { if (e.pointerType === 'mouse') st.hovering = true; };
    const leave = (e) => {
      if (e.pointerType !== 'mouse') return;
      st.hovering = false;
      if (st.hover) { st.hover = null; st.pinsDirty = true; }
    };

    const wheel = (e) => {
      const p = propsRef.current;
      if (!p.zoomable || !p.interactive) return;
      const [x, y] = local(e);
      if (!onGlobe(x, y)) return;
      e.preventDefault();
      takeOver();
      st.cam.k = clamp(st.cam.k * Math.exp(-e.deltaY * 0.0015), 1, p.maxZoom);
    };

    const key = (e) => {
      const p = propsRef.current;
      if (!p.interactive || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
      else if (p.zoomable && (e.key === '+' || e.key === '=' || e.key === '-' || e.key === '_')) {
        takeOver();
        st.cam.k = clamp(st.cam.k * (e.key === '+' || e.key === '=' ? 1.3 : 1 / 1.3), 1, p.maxZoom);
      } else return;
      e.preventDefault();
    };

    top.addEventListener('pointerdown', down);
    top.addEventListener('pointermove', move);
    top.addEventListener('pointerup', up);
    top.addEventListener('pointercancel', cancel);
    top.addEventListener('wheel', wheel, { passive: false });
    wrap.addEventListener('pointerenter', enter);
    wrap.addEventListener('pointerleave', leave);
    wrap.addEventListener('keydown', key);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      mq?.removeEventListener?.('change', onMq);
      overlay?.remove();
      top.removeEventListener('pointerdown', down);
      top.removeEventListener('pointermove', move);
      top.removeEventListener('pointerup', up);
      top.removeEventListener('pointercancel', cancel);
      top.removeEventListener('wheel', wheel);
      wrap.removeEventListener('pointerenter', enter);
      wrap.removeEventListener('pointerleave', leave);
      wrap.removeEventListener('keydown', key);
    };
    // The loop reads live props through propsRef, so it is set up once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cn = classNames;
  const place = cap.place;
  const label = ariaLabel
    || `Globe of the ${places.length} places Jason has been${tour ? `, drifting between ${tourPlaces.length} of them` : ''}.`;
  const btn = cn.button ? undefined : { background: 'none', border: 0, padding: '0.15rem 0.3rem', font: 'inherit', color: 'var(--link)', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '0.18em' };
  const frameStyle = frame && !cn.frame
    ? { border: '1px solid var(--rule)', background: 'var(--globe-frame, var(--surface))', borderRadius: 6, overflow: 'hidden' }
    : null;

  return (
    <div
      ref={wrapRef}
      className={[className, frame && cn.frame].filter(Boolean).join(' ') || undefined}
      data-frame={frame || undefined}
      style={{ position: 'relative', width: '100%', aspectRatio: String(aspect ?? (frame ? 4 / 3 : 1)), ...frameStyle, ...style }}
    >
      <canvas ref={baseRef} aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', pointerEvents: 'none' }} />
      <canvas
        ref={topRef}
        role="img"
        tabIndex={interactive ? 0 : -1}
        aria-label={label}
        aria-describedby={descId}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block',
          cursor: interactive ? 'grab' : 'default', pointerEvents: interactive ? 'auto' : 'none',
          touchAction: 'pan-y', outlineOffset: -2, // never trap page scroll on phones; pinch still zooms
        }}
      />
      <p id={descId} style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', margin: 0 }}>
        {tour && tourPlaces.length > 0 && `The globe drifts through: ${tourPlaces.map((t) => t.name).join(', ')}. `}
        {interactive && 'Left and right arrow keys step through the places. Drag to spin. '}
        {zoomable && 'Plus and minus zoom. '}
        All places are also listed in text on the map page.
      </p>

      <p aria-live="polite" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', margin: 0 }}>
        {announce}
      </p>

      {showCaption && place && (renderCaption ? renderCaption(place, { moving: cap.moving, auto: cap.auto }) : (
        <div
          className={cn.caption}
          data-moving={cap.moving || undefined}
          style={cn.caption ? undefined : {
            position: 'absolute', left: 12, bottom: showControls ? 44 : 12, maxWidth: 'min(26rem, calc(100% - 24px))',
            padding: '0.55rem 0.75rem', background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--rule)',
            borderRadius: 4, fontSize: '0.9rem', lineHeight: 1.45, opacity: cap.moving ? 0 : 1,
            transition: cap.moving ? 'opacity 1200ms ease' : 'opacity 500ms ease',
          }}
        >
          <strong className={cn.captionTitle} style={cn.captionTitle ? undefined : { display: 'block' }}>{place.name}</strong>
          <span className={cn.captionText} style={cn.captionText ? undefined : { color: 'var(--muted)' }}>{place.description}</span>
        </div>
      ))}

      {showControls && interactive && tourPlaces.length > 1 && (
        <div className={cn.controls} style={cn.controls ? undefined : { position: 'absolute', left: 8, bottom: 8, fontSize: '0.85rem', display: 'flex', gap: '0.25rem' }}>
          <button type="button" className={cn.button} style={btn} onClick={() => step(-1)} aria-label="Previous place">prev</button>
          {tour && !st.reduced && (
            <button type="button" className={cn.button} style={btn} aria-pressed={paused} onClick={() => setUserPaused(!paused)}>
              {paused ? 'play' : 'pause'}
            </button>
          )}
          <button type="button" className={cn.button} style={btn} onClick={() => step(1)} aria-label="Next place">next</button>
        </div>
      )}

      {failed && (
        <p className={cn.fallback} style={cn.fallback ? undefined : { position: 'absolute', top: 8, left: 12, margin: 0, fontSize: '0.8rem', color: 'var(--muted)' }}>
          The country outlines didn’t load; the places are still here.
        </p>
      )}
    </div>
  );
});

export default TourGlobe;
