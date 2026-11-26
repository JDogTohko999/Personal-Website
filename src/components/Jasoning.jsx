import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { JASONINGS, OPENERS } from '../data/jasonings.js';
import { thumb } from './webImage.js';

/*
  Jason-ing (ported from Jason's tuned trail version, src/trail/Jasoning.jsx on redesign2/final-trail):
    [photo]
    Jason-ing
    … stalling  cheesing  hanging …      a slot reel of the -ing words
    ←  spin  →
  Tapping the photo or "spin" spins the reel like the live site's slot machine: one shuffled pass over
  every word (~2s), decelerating onto the landing word; the photo changes when it lands.
    ← / →          slide one word along the reel (~420ms): the buttons, or the arrow keys. Only
                   once per spin (Jason): after one step both arrows lock until the next spin.
  The word itself isn't clickable (no list of all of them): you spin and step to see more.
  It spins once by itself about a second after the page opens. The first spin lands on one of the
  openers; after that every word lands once before any repeats. The canvassing clip plays as a
  real muted, looping video.
*/
const N = JASONINGS.length;
const SPIN_MS = 2000;
const NUDGE_MS = 420;
const AUTO_SPIN_MS = 1000;
const EASE = 'cubic-bezier(.16, .68, .26, 1)';
const NUDGE_EASE = 'cubic-bezier(.22, .61, .36, 1)';
const PAD = 2; // words parked either side so the reel never shows empty space

const shuffle = (arr) => {
  const a = arr.slice();
  for (let k = a.length - 1; k > 0; k--) {
    const r = Math.floor(Math.random() * (k + 1));
    [a[k], a[r]] = [a[r], a[k]];
  }
  return a;
};
const around = (i) => [...Array(PAD * 2 + 1)].map((_, k) => (i - PAD + k + N * 2) % N);
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function startIndex() {
  const pick = OPENERS[Math.floor(Math.random() * OPENERS.length)];
  return Math.max(0, JASONINGS.findIndex((j) => j.label === pick));
}

// Leave arrow keys alone when they belong to something else: fields, the globe, a dialog, the list.
function keyIsFree(e) {
  if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return false;
  const t = e.target;
  if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT|VIDEO)$/.test(t.tagName))) return false;
  if (t?.closest?.('[data-globe], [role="dialog"], [role="radiogroup"]')) return false;
  return !document.querySelector('.lightbox');
}

export default function Jasoning() {
  const [i, setI] = useState(startIndex);
  // One arrow step per spin: true once a step has been taken, reset by the next spin.
  const [stepped, setStepped] = useState(false);
  const [reel, setReel] = useState(() => around(i));
  const [center, setCenter] = useState(PAD);
  const [motion, setMotion] = useState(null); // { id, from, to, ms, ease }
  const bag = useRef([]);
  const spins = useRef(0);
  const spinning = motion != null;
  const item = JASONINGS[i];

  const spinOnce = useCallback(() => {
    if (spinning) return;
    let target;
    if (spins.current === 0) {
      const pool = OPENERS.map((l) => JASONINGS.findIndex((x) => x.label === l)).filter((n) => n >= 0 && n !== i);
      target = pool.length ? pool[Math.floor(Math.random() * pool.length)] : (i + 1) % N;
      bag.current = shuffle([...Array(N).keys()].filter((n) => n !== target));
    } else {
      if (!bag.current.length) bag.current = shuffle([...Array(N).keys()].filter((n) => n !== i));
      target = bag.current.shift();
      if (target === i) target = bag.current.shift() ?? (i + 1) % N;
    }
    spins.current += 1;
    setStepped(false);
    const others = shuffle([...Array(N).keys()].filter((n) => n !== i && n !== target));
    const seq = [...others.slice(0, PAD), i, ...others.slice(PAD * 2), target, ...others.slice(PAD, PAD * 2)];
    setReel(seq);
    setMotion({ id: Date.now(), from: PAD, to: seq.length - 1 - PAD, ms: SPIN_MS, ease: EASE });
  }, [spinning, i]);

  const step = useCallback((d) => {
    if (spinning || stepped) return;
    setStepped(true);
    let seq = reel;
    let from = center;
    const near = (k) => new Set(seq.slice(Math.max(0, k - PAD - 1), k + PAD + 2));
    if (from + d > seq.length - 1 - PAD) {
      const avoid = near(seq.length - 1);
      seq = [...seq, ...shuffle([...Array(N).keys()].filter((n) => !avoid.has(n))).slice(0, PAD)];
    }
    if (from + d < PAD) {
      const avoid = near(0);
      const add = shuffle([...Array(N).keys()].filter((n) => !avoid.has(n))).slice(0, PAD);
      seq = [...add, ...seq];
      from += add.length;
    }
    setReel(seq);
    setMotion({ id: Date.now(), from, to: from + d, ms: NUDGE_MS, ease: NUDGE_EASE });
  }, [spinning, stepped, reel, center]);

  const land = useCallback(() => {
    setMotion((m) => {
      if (m) { setCenter(m.to); setI(reel[m.to]); }
      return null;
    });
  }, [reel]);

  // Spin once on arrival, after a short pause, as the live site does.
  const spinRef = useRef(spinOnce);
  spinRef.current = spinOnce;
  useEffect(() => {
    if (reduceMotion()) return undefined;
    const t = setTimeout(() => { if (spins.current === 0) spinRef.current?.(); }, AUTO_SPIN_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (!keyIsFree(e)) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step]);

  // Warm the neighbouring photos so a nudge feels instant.
  useEffect(() => {
    [reel[center - 1], reel[center + 1]].forEach((n) => {
      const x = JASONINGS[n];
      if (x && x.type !== 'video') new Image().src = thumb(x.src);
    });
  }, [reel, center]);

  return (
    <figure className="jasoning">
      <button
        type="button"
        className={`jasoning-frame${spinning ? ' is-spinning' : ''}`}
        onClick={spinOnce}
        aria-label={`Photo: Jason ${item.label}. Spin for another.`}
      >
        {item.type === 'video' ? (
          <video key={item.src} src={item.src} muted loop autoPlay playsInline aria-hidden="true" />
        ) : (
          <img key={item.src} src={thumb(item.src)} alt="" style={item.pos ? { objectPosition: item.pos } : undefined} />
        )}
      </button>
      <figcaption className="jasoning-caption">
        <span className="jasoning-label" aria-live="polite">
          Jason-ing<span className="visually-hidden">: {spinning ? 'spinning' : item.label}</span>
        </span>
        <Reel reel={reel} center={center} motion={motion} land={land} />
        <span className="jasoning-steps">
          <button type="button" className="word" onClick={() => step(-1)} disabled={spinning || stepped} aria-label="Previous photo" title={stepped ? 'Spin again to step' : undefined}>←</button>
          <button type="button" className="word" onClick={spinOnce} disabled={spinning}>spin</button>
          <button type="button" className="word" onClick={() => step(1)} disabled={spinning || stepped} aria-label="Next photo" title={stepped ? 'Spin again to step' : undefined}>→</button>
        </span>
      </figcaption>
    </figure>
  );
}

// The slot reel. Word widths vary, so centring is measured from live rects.
function Reel({ reel, center, motion, land }) {
  const vpRef = useRef(null);
  const stripRef = useRef(null);
  const centerOn = (idx, ms, ease = EASE) => {
    const r = stripRef.current;
    const el = r?.children[idx];
    if (!el) return;
    const rr = r.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    const tx = vpRef.current.getBoundingClientRect().width / 2 - ((er.left - rr.left) + er.width / 2);
    r.style.transition = ms ? `transform ${ms}ms ${ease}` : 'none';
    r.style.transform = `translateX(${tx}px)`;
  };
  // At rest: snap to the centred word (and again once fonts settle, since widths change).
  useLayoutEffect(() => {
    if (motion) return undefined;
    centerOn(center, 0);
    let live = true;
    document.fonts?.ready?.then(() => { if (live) centerOn(center, 0); });
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reel, center, motion]);
  // Moving: snap to the start word, then slide (decelerating) onto the landing word.
  useLayoutEffect(() => {
    if (!motion) return undefined;
    const r = stripRef.current;
    centerOn(motion.from, 0);
    void r.offsetWidth;
    if (reduceMotion()) { centerOn(motion.to, 0); land(); return undefined; }
    centerOn(motion.to, motion.ms, motion.ease);
    const done = (e) => { if (e.target === r && e.propertyName === 'transform') land(); };
    r.addEventListener('transitionend', done);
    const t = setTimeout(land, motion.ms + 400); // in case transitionend never fires (hidden tab)
    return () => { r.removeEventListener('transitionend', done); clearTimeout(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [motion?.id]);
  return (
    <span className="jasoning-reel" ref={vpRef}>
      <span className="jasoning-strip" ref={stripRef}>
        {reel.map((n, k) => {
          const label = JASONINGS[n].label;
          const isCenter = !motion && k === center;
          return (
            <span key={`${k}-${n}`} className={`jasoning-word${isCenter ? ' is-center' : ''}`} aria-hidden="true">{label}</span>
          );
        })}
      </span>
    </span>
  );
}
