import { geoDistance, geoInterpolate } from 'd3-geo';

/*
  The camera path for TourGlobe's continuous tour. Pure functions, no DOM, so it can be tested
  in Node (see the "Smoothness" notes in README_BASE.md).

  A camera is { lon, lat, k } (degrees; k = zoom, 1 = whole globe fits). A *plan* is an endless
  chain of legs through the tour places (or a single "terminal" leg to a selected place).

  Each leg is one smooth path from where it starts to a place, zoomed in to `zoomIn`:
    - rotation: d3.geoInterpolate along the great circle;
    - zoom: van Wijk & Nuij's "smooth and efficient zooming and panning" (the path behind
      d3.interpolateZoom), with u = arc length on the unit sphere and w = 2 / k. It pans where it
      is zoomed out, so zoom-out depth grows with the angular distance. Very short hops are
      treated as at least D_FLOOR radians for the zoom profile, so every leg breathes out a little.
    - progress along the path eases in and out (sine) over the leg's duration.
  Consecutive legs overlap by `overlap` ms and are cross-faded with a smoothstep weight: the
  outgoing leg is decelerating into the place while the next is accelerating out of it, so the
  camera rounds the corner close to the place without ever stopping, and its velocity is
  continuous (both legs and the weight are C1). "Passing" a place is the middle of the overlap.

  Retargeting (prev/next, flyTo, selection) builds a new plan from the current camera and
  cross-fades from the old plan, which keeps running underneath, over `blendMs`; again C1.
*/

export const RHO = 1.5;           // van Wijk curvature: larger zooms out further on long legs
export const D_FLOOR = 0.6;       // radians: the shortest distance used for the zoom profile
export const OVERLAP = 0.4;       // fraction of legMs that consecutive legs overlap
const MIN_K = 0.85;               // never zoom out past this while touring

const D2R = Math.PI / 180;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
export const smooth = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
const sineInOut = (t) => (1 - Math.cos(Math.PI * t)) / 2;

/** van Wijk & Nuij path from width w0 to w1 over distance d. at(p, out) sets out.u (0..1) and out.w. */
export function vanWijk(d, w0, w1, rho = RHO) {
  const rho2 = rho * rho;
  const rho4 = rho2 * rho2;
  if (d < 1e-6) {
    const S = Math.log(w1 / w0) / rho;
    return { S: Math.abs(S), at(p, out) { out.u = p; out.w = w0 * Math.exp(rho * p * S); } };
  }
  const b0 = (w1 * w1 - w0 * w0 + rho4 * d * d) / (2 * w0 * rho2 * d);
  const b1 = (w1 * w1 - w0 * w0 - rho4 * d * d) / (2 * w1 * rho2 * d);
  const r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0);
  const r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
  const S = (r1 - r0) / rho;
  const coshr0 = Math.cosh(r0);
  const sinhr0 = Math.sinh(r0);
  return {
    S,
    at(p, out) {
      const x = rho * p * S + r0;
      out.u = (w0 / (rho2 * d)) * (coshr0 * Math.tanh(x) - sinhr0);
      out.w = (w0 * coshr0) / Math.cosh(x);
    },
  };
}

const newCam = () => ({ lon: 0, lat: 0, k: 1 });
export const copyCam = (a, out) => { out.lon = a.lon; out.lat = a.lat; out.k = a.k; return out; };

/** Blend two cameras (normalised vector lerp for the centre, log-lerp for zoom). out may be a or b. */
export function mixCam(a, b, w, out) {
  if (w <= 0) return copyCam(a, out);
  if (w >= 1) return copyCam(b, out);
  const la = a.lat * D2R; const oa = a.lon * D2R;
  const lb = b.lat * D2R; const ob = b.lon * D2R;
  const ca = Math.cos(la); const cb = Math.cos(lb);
  const x = (1 - w) * ca * Math.cos(oa) + w * cb * Math.cos(ob);
  const y = (1 - w) * ca * Math.sin(oa) + w * cb * Math.sin(ob);
  const z = (1 - w) * Math.sin(la) + w * Math.sin(lb);
  const k = Math.exp((1 - w) * Math.log(a.k) + w * Math.log(b.k));
  out.lon = Math.atan2(y, x) / D2R;
  out.lat = Math.atan2(z, Math.hypot(x, y)) / D2R;
  out.k = k;
  return out;
}

/** Index of the tour place to head for from a view: the nearest, or the one after it if we're on it. */
export function nearestNext(tour, lon, lat, onIt = 0.08) {
  let best = 0;
  let bestD = Infinity;
  const c = [lon, lat];
  for (let i = 0; i < tour.length; i++) {
    const d = geoDistance(c, tour[i].coordinates);
    if (d < bestD) { bestD = d; best = i; }
  }
  return bestD < onIt ? (best + 1) % tour.length : best;
}

function makeLeg(plan, from, k0, place, idx, T) {
  const to = place.coordinates;
  const d = geoDistance(from, to);
  const vw = vanWijk(Math.max(d, D_FLOOR), 2 / k0, 2 / plan.zoomIn);
  const base = plan.terminal ? plan.flyMs : plan.legMs;
  const I = base * clamp(0.35 + (0.65 * vw.S) / plan.sref, 0.5, 1.2);
  const O = plan.terminal ? 0 : plan.overlap;
  return {
    place, idx, T, I, D: I + O,
    passAt: plan.terminal ? T + I : T + I + O / 2,
    passed: false,
    interp: geoInterpolate(from, to),
    vw,
  };
}

function addNext(plan, last) {
  const n = plan.tour.length;
  const idx = plan.nextIdx;
  plan.nextIdx = (idx + 1) % n;
  const leg = makeLeg(plan, last.place.coordinates, plan.zoomIn, plan.tour[idx], idx, last.T + last.I);
  plan.legs.push(leg);
  return leg;
}

const uw = { u: 0, w: 1 };
function evalLeg(L, t, out) {
  const p = sineInOut(clamp((t - L.T) / L.D, 0, 1));
  L.vw.at(p, uw);
  const ll = L.interp(clamp(uw.u, 0, 1));
  out.lon = ll[0];
  out.lat = ll[1];
  out.k = Math.max(MIN_K, 2 / uw.w);
  return out;
}

/**
 * A new plan from camera `cam` to `first` (a place), then on through `tour` in order from
 * `nextIdx`. terminal: stop at `first` (a selection). from: a plan to cross-fade out of.
 */
export function makePlan({ cam, first, firstIdx = -1, nextIdx, tour, terminal = false, t0, legMs, flyMs, zoomIn, from = null, blendMs = 0 }) {
  const w = 2 / zoomIn;
  const plan = {
    tour, terminal: terminal || tour.length < 2, legMs, flyMs, zoomIn,
    overlap: OVERLAP * legMs,
    sref: vanWijk(1, w, w).S, // a 1-radian leg, for scaling durations
    nextIdx: nextIdx ?? (firstIdx >= 0 ? (firstIdx + 1) % Math.max(1, tour.length) : 0),
    legs: [],
    done: false,
    from: from && blendMs > 0 ? { plan: from, t0, dur: blendMs } : null,
    sA: newCam(), sB: newCam(), sF: newCam(), // scratch, per plan (evalPlan recurses into `from`)
  };
  plan.legs.push(makeLeg(plan, [cam.lon, cam.lat], cam.k, first, firstIdx, t0));
  return plan;
}

/** Camera at tour-time t into out. onPass(leg) fires once per leg as the camera passes its place. */
export function evalPlan(plan, t, out, onPass) {
  const { legs } = plan;
  if (!plan.terminal) {
    let last = legs[legs.length - 1];
    while (t >= last.T + last.I) last = addNext(plan, last);
  }
  if (onPass) {
    for (let i = 0; i < legs.length; i++) {
      const L = legs[i];
      if (!L.passed && t >= L.passAt) { L.passed = true; onPass(L); }
    }
  }
  while (legs.length > 1 && t > legs[0].T + legs[0].D) legs.shift();

  const a = legs[0];
  const b = legs[1];
  if (b && t >= b.T) {
    evalLeg(a, t, plan.sA);
    evalLeg(b, t, plan.sB);
    mixCam(plan.sA, plan.sB, smooth((t - b.T) / plan.overlap), out);
  } else {
    evalLeg(a, t, out);
  }
  if (plan.terminal && t >= a.T + a.D) plan.done = !plan.from;

  if (plan.from) {
    const f = plan.from;
    const w = smooth((t - f.t0) / f.dur);
    if (w >= 1) plan.from = null;
    else mixCam(evalPlan(f.plan, t, plan.sF, null), out, w, out);
  }
  return out;
}

/** Tour index the plan is heading for (the first place not yet passed), or -1. */
export function targetIndex(plan) {
  const L = plan.legs.find((l) => !l.passed);
  return L ? L.idx : -1;
}
