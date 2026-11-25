import React, { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import { geoCentroid, geoDistance, geoGraticule, geoInterpolate, geoOrthographic, geoPath } from 'd3-geo';
import { cities, homePlace, tourPlaces as defaultTour } from '../data/places.js';
import { DRAW_LAST, categoryOf, loadWorld } from '../lib/geo.js';

/**
 * TourGlobe: a calm, theme-aware canvas globe that tours Jason's places.
 *
 * It starts zoomed out, flies along the great circle to each tour stop while zooming in, holds
 * with a caption, zooms back out on the way to the next stop, and loops. Colours come from the
 * --globe-* CSS tokens (src/theme/themes.css) and update live when data-theme changes.
 *
 * Props (all optional):
 * @param {boolean}  tour=true          Run the automatic tour.
 * @param {object[]} places=cities      Pins to draw ({ id, name, coordinates:[lon,lat], description }).
 * @param {object[]} tourPlaces         Stops in order (default: places.js `tourPlaces`).
 * @param {number}   holdMs=3500        Time held at each stop.
 * @param {number}   flyMs=2800         Duration of a long leg (short hops are quicker).
 * @param {number}   zoomIn=4           Zoom factor at a stop (1 = whole globe fits).
 * @param {number}   maxZoom=8          Upper limit for wheel / pinch / +/- zoom.
 * @param {boolean}  interactive=true   Drag to spin (with inertia), click pins, keys, buttons.
 * @param {boolean}  zoomable=false     Wheel, pinch and +/- zoom.
 * @param {boolean}  showCaption=true   Built-in caption (name + description of the current stop).
 * @param {boolean}  showControls=true  Built-in prev / pause / next text buttons.
 * @param {function} renderCaption      (place, { moving }) => node, replaces the built-in caption.
 * @param {function} onStop             (place) when the globe arrives at a stop or selection.
 * @param {function} onPick             (place) when a pin is clicked/tapped (not on drags).
 * @param {number}   selectedId         Fly to this place and hold there; null resumes the tour.
 * @param {number}   homeId             Pin drawn as home (default: the `home: true` place).
 * @param {boolean}  reducedMotion      Override prefers-reduced-motion (true/false); default follows it.
 * @param {string}   className          Root element class. The root is position:relative and
 *                                      defaults to a square; give it a size (height) to change that.
 * @param {object}   classNames         Slots { caption, captionTitle, captionText, controls,
 *                                      button, fallback }. A provided slot drops that part's
 *                                      built-in inline style, so you can restyle it fully.
 * @param {object}   style              Root inline style.
 * @param {string}   ariaLabel          Accessible name (a default describing the tour is used).
 *
 * Ref handle: { flyTo(idOrPlace), next(), prev(), pause(), play() }.
 *
 * Behaviour: hover pauses (resumes ~1.5s after leaving); pointer-down/drag takes over and the
 * tour resumes ~4s after release from the nearest stop; arrow keys step when focused; the tour
 * stops while the tab is hidden or the globe is off screen. Under reduced motion nothing moves
 * on its own: a static view of home with the caption, and prev/next jump without animation.
 *
 * Cheap to run: the map canvas redraws only when the view changes, pins live on a second canvas,
 * and nothing runs while hidden or holding still. Lazy-load it: React.lazy(() => import(...)).
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
const HOVER_RESUME_MS = 1500;
const MANUAL_RESUME_MS = 4000;
const INTRO_MS = 700;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const rotFor = ([lon, lat]) => [-lon, clamp(-lat, -MAX_TILT, MAX_TILT), 0];

const motionQuery = () =>
  typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

const TourGlobe = forwardRef(function TourGlobe(
  {
    tour = true,
    places = cities,
    tourPlaces = defaultTour,
    holdMs = 3500,
    flyMs = 2800,
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
  const [cap, setCap] = useState({ place: null, moving: true });
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState(false);

  const propsRef = useRef({});
  propsRef.current = { tour, places, tourPlaces, holdMs, flyMs, zoomIn, maxZoom, interactive, zoomable, onStop, onPick, homeId };

  const home = places.find((p) => p.id === homeId) || tourPlaces[0] || places[0];
  const start = home ? home.coordinates : [0, 20];

  // Everything the render loop touches lives in one mutable object.
  const s = useRef(null);
  if (!s.current) {
    const mq = motionQuery();
    const reduced = reducedMotion ?? !!mq?.matches;
    s.current = {
      reduced,
      // Reduced: sit on home, zoomed in. Otherwise start zoomed out, a little east of stop 1.
      rot: reduced ? rotFor(start) : rotFor([((tourPlaces[0] || home)?.coordinates[0] ?? 0) + 55, 18]),
      zoom: reduced ? zoomIn : 1,
      vel: [0, 0], drag: null, pinch: null, pointers: new Map(),
      leg: null, hold: null, started: false, intro: 0,
      hovering: false, manual: false, resumeAt: 0, userPaused: false, pinned: null,
      hover: null, screen: [], world: null, colors: FALLBACK,
      size: { w: 0, h: 0, dpr: 1 }, viewDirty: true, pinsDirty: true, visible: true,
      index: Math.max(0, tourPlaces.indexOf(home)),
    };
  }
  const st = s.current;

  // ---- tour helpers (plain functions over `st`; React state only for caption/paused) ----
  const curPlace = () => st.leg?.place || st.hold?.place || null;

  const arrive = (place) => {
    st.hold = { place, el: 0 };
    setCap({ place, moving: false });
    propsRef.current.onStop?.(place);
  };

  const jump = (place) => {
    st.leg = null;
    st.rot = rotFor(place.coordinates);
    st.zoom = Math.max(st.zoom, propsRef.current.zoomIn);
    st.viewDirty = true;
    arrive(place);
  };

  const legTo = (place) => {
    if (!place) return;
    if (st.reduced) { jump(place); return; }
    const p = propsRef.current;
    const from = [-st.rot[0], -st.rot[1]];
    const dist = geoDistance(from, place.coordinates);
    const k0 = st.zoom;
    const k1 = p.zoomIn;
    const kMid = Math.max(1, p.zoomIn / (1 + 3 * dist)); // long legs zoom further out
    st.leg = {
      place, t: 0,
      interp: geoInterpolate(from, place.coordinates),
      L0: Math.log(k0), L1: Math.log(k1),
      dip: Math.max(0, Math.min(Math.log(k0), Math.log(k1)) - Math.log(kMid)),
      dur: p.flyMs * clamp(0.45 + dist / 1.6, 0.45, 1.15),
    };
    st.hold = null;
    st.vel = [0, 0];
    setCap({ place, moving: true });
  };

  const nearestIndex = () => {
    const c = [-st.rot[0], -st.rot[1]];
    let best = 0;
    let bestD = Infinity;
    propsRef.current.tourPlaces.forEach((pl, i) => {
      const d = geoDistance(c, pl.coordinates);
      if (d < bestD) { bestD = d; best = i; }
    });
    return best;
  };

  const step = (dir) => {
    const list = propsRef.current.tourPlaces;
    if (!list.length) return;
    const cur = curPlace();
    const at = cur ? list.indexOf(cur) : -1;
    st.index = ((at >= 0 ? at : st.index) + dir + list.length) % list.length;
    st.manual = false;
    st.pinned = null;
    st.started = true;
    legTo(list[st.index]);
  };

  const focusPlace = (place) => {
    if (!place) return;
    const i = propsRef.current.tourPlaces.indexOf(place);
    if (i >= 0) st.index = i;
    st.started = true;
    st.manual = false;
    legTo(place);
  };

  useImperativeHandle(ref, () => ({
    flyTo(idOrPlace) {
      const place = typeof idOrPlace === 'object' ? idOrPlace : propsRef.current.places.find((p) => p.id === idOrPlace);
      focusPlace(place);
    },
    next: () => step(1),
    prev: () => step(-1),
    pause: () => { st.userPaused = true; setPaused(true); },
    play: () => { st.userPaused = false; setPaused(false); },
  }));

  // Selection: fly there and hold until cleared; clearing resumes the tour after a beat.
  useEffect(() => {
    const place = selectedId == null ? null : propsRef.current.places.find((p) => p.id === selectedId);
    if (place) {
      st.pinned = place;
      focusPlace(place);
    } else if (st.pinned) {
      st.pinned = null;
      st.resumeAt = performance.now() + HOVER_RESUME_MS;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  useEffect(() => { if (reducedMotion != null) st.reduced = reducedMotion; st.pinsDirty = true; }, [reducedMotion, st]);
  useEffect(() => { st.pinsDirty = true; }, [places, homeId, st]);

  // Under reduced motion, show home's caption straight away.
  useEffect(() => {
    if (st.reduced && home && !st.hold) arrive(home);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    const base = baseRef.current;
    const top = topRef.current;
    const bctx = base.getContext('2d');
    const tctx = top.getContext('2d');
    const projection = geoOrthographic().clipAngle(90).precision(0.4);
    const path = geoPath(projection, bctx);
    const graticule = geoGraticule().step([20, 20])();
    let raf = 0;
    let last = performance.now();
    let alive = true;
    if (import.meta.env?.DEV) wrap.__tourGlobe = st; // inspect from devtools: $0.__tourGlobe

    loadWorld()
      .then((features) => {
        if (!alive) return;
        const items = [];
        features.forEach((f) => {
          // Per feature, never merged. Keep a bounding cap (centre + angular radius) for culling.
          const c = geoCentroid(f);
          let rad = 0;
          const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
          polys.forEach((poly) => poly.forEach((ring) => ring.forEach((pt) => { rad = Math.max(rad, geoDistance(c, pt)); })));
          items.push({ f, c, rad, cat: categoryOf(f) || 'base' });
        });
        // Paint order: by category, then the overlaps in DRAW_LAST (Western Sahara over Morocco).
        const rank = (it) => (DRAW_LAST.has(it.f.id) ? CATS.length : CATS.indexOf(it.cat));
        st.world = items.sort((a, b) => rank(a) - rank(b));
        st.viewDirty = true;
      })
      .catch(() => alive && setFailed(true));

    const readColors = () => {
      const cs = getComputedStyle(wrap);
      const c = {};
      Object.entries(TOKENS).forEach(([k, v]) => { c[k] = cs.getPropertyValue(v).trim() || FALLBACK[k]; });
      c.font = cs.fontFamily || 'serif';
      st.colors = c;
      st.viewDirty = true;
    };
    readColors();
    const mo = new MutationObserver(readColors);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class', 'style'] });

    const resize = () => {
      const { width, height } = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      st.size = { w: width, h: height, dpr };
      [base, top].forEach((cv) => { cv.width = Math.round(width * dpr); cv.height = Math.round(height * dpr); });
      st.viewDirty = true;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    const io = new IntersectionObserver(([e]) => { st.visible = e.isIntersecting; });
    io.observe(wrap);

    const mq = motionQuery();
    const onMq = () => { if (reducedMotion == null) { st.reduced = mq.matches; if (st.reduced) { st.leg = null; st.vel = [0, 0]; } } };
    mq?.addEventListener?.('change', onMq);

    const radius = () => Math.max(10, Math.min(st.size.w, st.size.h) / 2 - 10);
    const place = () => {
      const { w, h } = st.size;
      const r = radius() * st.zoom;
      projection.translate([w / 2, h / 2]).scale(r).rotate(st.rot);
      return { cx: w / 2, cy: h / 2, r };
    };

    const drawMap = () => {
      const { w, h, dpr } = st.size;
      const { cx, cy, r } = place();
      const C = st.colors;
      const ctx = bctx;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // Soft halo, then a flat ocean.
      const halo = ctx.createRadialGradient(cx, cy, r * 0.98, cx, cy, r * 1.08);
      halo.addColorStop(0, C.halo);
      halo.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, w, h);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = C.ocean;
      ctx.fill();

      ctx.beginPath();
      path(graticule);
      ctx.globalAlpha = 0.45;
      ctx.lineWidth = 0.6;
      ctx.strokeStyle = C.base;
      ctx.stroke();
      ctx.globalAlpha = 1;

      if (st.world) {
        // Each country is filled and stroked on its own path (no merged shapes, so no stray
        // island fills). Countries outside the visible cap are skipped, which is most of them
        // when zoomed in to a stop.
        const centre = [-st.rot[0], -st.rot[1]];
        const view = Math.asin(Math.min(1, Math.hypot(w, h) / 2 / r)) + 0.02;
        ctx.lineJoin = 'round';
        ctx.lineWidth = clamp(0.5 + st.zoom * 0.12, 0.5, 1.2);
        ctx.strokeStyle = C.border;
        st.world.forEach(({ f, c, rad, cat }) => {
          if (geoDistance(c, centre) - rad > view) return;
          ctx.beginPath();
          path(f);
          ctx.fillStyle = C[cat];
          ctx.fill();
          ctx.stroke();
        });
      }

      // A subtle limb shade so the disc reads as a sphere. No specular highlight.
      const limb = ctx.createRadialGradient(cx, cy, r * 0.7, cx, cy, r);
      limb.addColorStop(0, 'rgba(0,0,0,0)');
      limb.addColorStop(1, C.limb);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = limb;
      ctx.fill();
    };

    const drawPins = () => {
      const { w, h, dpr } = st.size;
      const p = propsRef.current;
      const C = st.colors;
      const ctx = tctx;
      place();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const centre = [-st.rot[0], -st.rot[1]];
      const scale = clamp(0.9 + (st.zoom - 1) * 0.1, 0.9, 1.5);
      const current = st.pinned || curPlace();
      st.screen = [];
      let label = null;
      p.places.forEach((pin) => {
        const d = geoDistance(pin.coordinates, centre);
        if (d > Math.PI / 2 - 0.03) return;
        const pt = projection(pin.coordinates);
        if (!pt) return;
        const [x, y] = pt;
        const isHome = pin.id === p.homeId;
        const isCur = current && pin.id === current.id;
        const isHover = st.hover && st.hover.id === pin.id;
        const pr = (isHome ? 4.6 : 3.3) * scale * (isHover ? 1.3 : 1);
        st.screen.push({ pin, x, y });
        ctx.globalAlpha = clamp((Math.PI / 2 - d) / 0.3, 0.3, 1);
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
      });
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

    const tick = (now) => {
      const dt = clamp(now - last, 0, 60); // physics (inertia)
      // Tour clock: real time, so a throttled tab (background pane, low-power) keeps its pace.
      // Hidden tabs return below, so this never jumps after a tab switch.
      const tdt = clamp(now - last, 0, 1000);
      last = now;
      if (!st.visible || document.hidden || !st.size.w || !st.size.h) return;
      const p = propsRef.current;

      if (st.drag || st.pinch) {
        // the visitor is steering
      } else if (Math.abs(st.vel[0]) + Math.abs(st.vel[1]) > 0.002) {
        st.rot = [st.rot[0] + st.vel[0] * dt, clamp(st.rot[1] + st.vel[1] * dt, -MAX_TILT, MAX_TILT), 0];
        st.vel = st.vel.map((v) => v * 0.95 ** (dt / 16.7));
        st.resumeAt = now + MANUAL_RESUME_MS;
        st.viewDirty = true;
      } else if (st.manual && now >= st.resumeAt) {
        st.manual = false;
      }

      const running = p.tour && !st.reduced && !st.hovering && !st.manual && !st.userPaused
        && !st.drag && !st.pinch && now >= st.resumeAt && p.tourPlaces.length > 0;
      // A selection still gets its flight in; it just doesn't move on afterwards.
      const flying = st.leg && !st.hovering && !st.manual && !st.drag && !st.reduced && now >= st.resumeAt;

      if (st.leg && (running || flying)) {
        const L = st.leg;
        L.t += tdt;
        const t = clamp(L.t / L.dur, 0, 1);
        const e = ease(t);
        st.rot = rotFor(L.interp(e));
        st.zoom = Math.exp((1 - e) * L.L0 + e * L.L1 - L.dip * Math.sin(Math.PI * t));
        st.viewDirty = true;
        if (t >= 1) { st.leg = null; arrive(L.place); }
      } else if (running && !st.pinned) {
        if (!st.started) {
          st.intro += tdt;
          if (st.intro >= INTRO_MS) { st.started = true; st.index = 0; legTo(p.tourPlaces[0]); }
        } else if (st.hold) {
          st.hold.el += tdt;
          if (st.hold.el >= p.holdMs) {
            const i = p.tourPlaces.indexOf(st.hold.place);
            st.index = i >= 0 ? (i + 1) % p.tourPlaces.length : nearestIndex();
            legTo(p.tourPlaces[st.index]);
          }
        } else {
          st.index = nearestIndex(); // after a drag: pick up from the closest stop
          legTo(p.tourPlaces[st.index]);
        }
      }

      if (st.viewDirty) { drawMap(); st.viewDirty = false; st.pinsDirty = true; }
      if (st.pinsDirty) { drawPins(); st.pinsDirty = false; }
    };
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      tick(now);
    };
    raf = requestAnimationFrame(frame);
    if (import.meta.env?.DEV) wrap.__tourGlobeTick = () => tick(performance.now()); // drive it when rAF is throttled

    // ---- pointer, wheel and keys ----
    const local = (e) => {
      const rect = top.getBoundingClientRect();
      return [e.clientX - rect.left, e.clientY - rect.top];
    };
    const hit = (x, y, reach) => {
      let best = null;
      let bestD = reach;
      st.screen.forEach((sp) => {
        const d = Math.hypot(sp.x - x, sp.y - y);
        if (d < bestD) { best = sp.pin; bestD = d; }
      });
      return best;
    };
    const onGlobe = (x, y) => Math.hypot(x - st.size.w / 2, y - st.size.h / 2) <= radius() * st.zoom + 6;
    const takeOver = () => {
      st.manual = true;
      st.leg = null;
      st.hold = null;
      st.resumeAt = performance.now() + MANUAL_RESUME_MS;
      setCap((c) => (c.place ? { ...c, moving: true } : c));
    };

    const down = (e) => {
      if (!propsRef.current.interactive || (e.pointerType === 'mouse' && e.button !== 0)) return;
      const [x, y] = local(e);
      if (!onGlobe(x, y)) return;
      top.setPointerCapture?.(e.pointerId);
      st.pointers.set(e.pointerId, [e.clientX, e.clientY]);
      st.vel = [0, 0];
      const now = performance.now();
      if (st.pointers.size === 2 && propsRef.current.zoomable) {
        const [a, b] = [...st.pointers.values()];
        st.pinch = { d0: Math.hypot(a[0] - b[0], a[1] - b[1]) || 1, k0: st.zoom };
        st.drag = null;
        takeOver();
      } else if (st.pointers.size === 1) {
        st.drag = { x0: e.clientX, y0: e.clientY, rot0: [...st.rot], t0: now, moved: false, lx: e.clientX, ly: e.clientY, lt: now };
        top.style.cursor = 'grabbing';
      }
    };

    const move = (e) => {
      if (st.pointers.has(e.pointerId)) st.pointers.set(e.pointerId, [e.clientX, e.clientY]);
      const p = propsRef.current;
      if (st.pinch && st.pointers.size >= 2) {
        const [a, b] = [...st.pointers.values()];
        st.zoom = clamp(st.pinch.k0 * (Math.hypot(a[0] - b[0], a[1] - b[1]) / st.pinch.d0), 1, p.maxZoom);
        st.viewDirty = true;
        return;
      }
      if (st.drag) {
        const dx = e.clientX - st.drag.x0;
        const dy = e.clientY - st.drag.y0;
        if (!st.drag.moved && Math.hypot(dx, dy) > 5) { st.drag.moved = true; takeOver(); }
        if (!st.drag.moved) return;
        const k = 180 / (Math.PI * radius() * st.zoom); // degrees per pixel at the centre
        st.rot = [st.drag.rot0[0] + dx * k, clamp(st.drag.rot0[1] - dy * k, -MAX_TILT, MAX_TILT), 0];
        const now = performance.now();
        const dtm = Math.max(now - st.drag.lt, 1);
        st.vel = [st.vel[0] * 0.5 + (((e.clientX - st.drag.lx) * k) / dtm) * 0.5, st.vel[1] * 0.5 + ((-(e.clientY - st.drag.ly) * k) / dtm) * 0.5];
        Object.assign(st.drag, { lx: e.clientX, ly: e.clientY, lt: now });
        st.hover = null;
        st.viewDirty = true;
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
      top.releasePointerCapture?.(e.pointerId);
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
      st.resumeAt = Math.max(st.resumeAt, performance.now() + HOVER_RESUME_MS);
      if (st.hover) { st.hover = null; st.pinsDirty = true; }
    };

    const wheel = (e) => {
      const p = propsRef.current;
      if (!p.zoomable || !p.interactive) return;
      const [x, y] = local(e);
      if (!onGlobe(x, y)) return;
      e.preventDefault();
      takeOver();
      st.zoom = clamp(st.zoom * Math.exp(-e.deltaY * 0.0015), 1, p.maxZoom);
      st.viewDirty = true;
    };

    const key = (e) => {
      const p = propsRef.current;
      if (!p.interactive || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
      else if (p.zoomable && (e.key === '+' || e.key === '=' || e.key === '-' || e.key === '_')) {
        takeOver();
        st.zoom = clamp(st.zoom * (e.key === '+' || e.key === '=' ? 1.3 : 1 / 1.3), 1, p.maxZoom);
        st.viewDirty = true;
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
    || `Globe of the ${places.length} places Jason has been${tour ? `, touring ${tourPlaces.length} of them` : ''}.`;
  const btn = cn.button ? undefined : { background: 'none', border: 0, padding: '0.15rem 0.3rem', font: 'inherit', color: 'var(--link)', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '0.18em' };

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', ...style }}
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
          touchAction: zoomable ? 'none' : 'pan-y', outlineOffset: -2,
        }}
      />
      <p id={descId} style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', margin: 0 }}>
        {tour && tourPlaces.length > 0 && `Tour stops: ${tourPlaces.map((t) => t.name).join(', ')}. `}
        {interactive && 'Left and right arrow keys step through the stops. Drag to spin. '}
        {zoomable && 'Plus and minus zoom. '}
        All places are also listed in text on the map page.
      </p>

      {showCaption && place && (renderCaption ? renderCaption(place, { moving: cap.moving }) : (
        <div
          aria-live="polite"
          className={cn.caption}
          data-moving={cap.moving || undefined}
          style={cn.caption ? undefined : {
            position: 'absolute', left: 12, bottom: showControls ? 44 : 12, maxWidth: 'min(26rem, calc(100% - 24px))',
            padding: '0.55rem 0.75rem', background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--rule)',
            borderRadius: 4, fontSize: '0.9rem', lineHeight: 1.45, opacity: cap.moving ? 0.55 : 1, transition: 'opacity 400ms ease',
          }}
        >
          <strong className={cn.captionTitle} style={cn.captionTitle ? undefined : { display: 'block' }}>{place.name}</strong>
          <span className={cn.captionText} style={cn.captionText ? undefined : { color: 'var(--muted)' }}>{place.description}</span>
        </div>
      ))}

      {showControls && interactive && tourPlaces.length > 1 && (
        <div className={cn.controls} style={cn.controls ? undefined : { position: 'absolute', left: 8, bottom: 8, fontSize: '0.85rem', display: 'flex', gap: '0.25rem' }}>
          <button type="button" className={cn.button} style={btn} onClick={() => step(-1)} aria-label="Previous stop">prev</button>
          {tour && !st.reduced && (
            <button
              type="button" className={cn.button} style={btn} aria-pressed={paused}
              onClick={() => { st.userPaused = !paused; setPaused(!paused); }}
            >
              {paused ? 'play' : 'pause'}
            </button>
          )}
          <button type="button" className={cn.button} style={btn} onClick={() => step(1)} aria-label="Next stop">next</button>
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
