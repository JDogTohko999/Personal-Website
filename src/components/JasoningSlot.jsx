import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';

/* Horizontal slot machine for the "Jason-ing" picker.

   Each spin builds a fresh reel: a lead-in pad, the word that is currently
   showing (so the strip stays continuous across spins), a rush of words, the
   landing target, then a trailing pad. The reel snaps to the start word with
   no transition, then animates to the target — decelerating onto it rather
   than scrolling at a constant rate.

   The reel is one shuffled pass over the whole list, so no word appears twice
   in a single spin. Spin length is therefore set by how many words exist
   rather than by a fixed slot count.

   Landing targets are chosen separately from the reel order: see nextTarget.

   Widths vary per word ("pointing" vs "jim carey-ing"), so centring is
   measured from live rects rather than assuming a fixed step. */

const LEAD = 1;          // words parked left of the start word
const TAIL = 2;          // words parked right of the landing word
const SPIN_MS = 2000;
const AUTO_SPIN_DELAY_MS = 1000;
const EASE = 'cubic-bezier(.16, .68, .26, 1)';

let uid = 0;
const row = (item) => ({ key: `r${uid++}`, item });

const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const JasoningSlot = ({ items, openers = [], onLand }) => {
  const viewportRef = useRef(null);
  const reelRef = useRef(null);
  const spinningRef = useRef(false);
  const lastLanded = useRef(null);
  const landingBag = useRef([]);
  const spinCount = useRef(0);

  const [reel, setReel] = useState([]);
  const [startIdx, setStartIdx] = useState(0);
  const [targetIdx, setTargetIdx] = useState(0);
  const [spinId, setSpinId] = useState(0);
  const [landedIdx, setLandedIdx] = useState(-1);
  const [isSpinning, setIsSpinning] = useState(false);

  // Which word this spin settles on.
  //
  // First spin of a visit is drawn from `openers` — the handful worth showing
  // a stranger. Every spin after that comes from a shuffle bag: a shuffled
  // copy of the full list, drained one word at a time, so every word is landed
  // on once before any repeats. The bag is refilled when empty, rotated if the
  // refill would repeat the word just landed on.
  const nextTarget = useCallback(() => {
    if (spinCount.current === 0) {
      const pool = items.filter((i) => openers.includes(i.label));
      const from = pool.length ? pool : items;
      const chosen = from[Math.floor(Math.random() * from.length)];
      // Seed the bag without the opener so it is not landed on twice running.
      landingBag.current = shuffle(items.filter((i) => i !== chosen));
      return chosen;
    }
    if (landingBag.current.length === 0) {
      const refill = shuffle(items);
      if (refill.length > 1 && refill[0] === lastLanded.current) refill.push(refill.shift());
      landingBag.current = refill;
    }
    return landingBag.current.shift();
  }, [items, openers]);

  const buildSpin = useCallback(() => {
    const target = nextTarget();
    if (!target) return;
    const current = lastLanded.current;

    // One pass over everything else, so no word is seen twice in a spin.
    const others = shuffle(items.filter((i) => i !== target && i !== current));
    const lead = others.slice(0, LEAD);
    const tail = others.slice(LEAD, LEAD + TAIL);
    const middle = others.slice(LEAD + TAIL);

    // Whatever is showing is parked at the start so the strip stays continuous.
    const seq = current
      ? [...lead, current, ...middle, target, ...tail]
      : [...lead, ...middle, target, ...tail];

    const sIdx = current ? lead.length : 0;
    const tIdx = seq.indexOf(target);
    if (tIdx <= sIdx) return; // too few words to spin

    setReel(seq.map((item) => row(item)));
    setStartIdx(sIdx);
    setTargetIdx(tIdx);
    setLandedIdx(-1);
    setIsSpinning(true);
    setSpinId((n) => n + 1);
    spinCount.current += 1;
  }, [items, nextTarget]);

  // Auto-spin once on load, after a short pause so the page settles first.
  // Also wait for fonts: if a word's width changes mid-flight the measured
  // landing point is wrong and the reel settles off centre.
  useEffect(() => {
    let cancelled = false;
    const go = async () => {
      const pause = new Promise((resolve) => setTimeout(resolve, AUTO_SPIN_DELAY_MS));
      if (document.fonts?.ready) {
        try { await document.fonts.ready; } catch { /* measure anyway */ }
      }
      await pause;
      // Skip if the visitor already spun by hand during the pause.
      if (!cancelled && spinCount.current === 0) buildSpin();
    };
    go();
    return () => { cancelled = true; };
  }, [buildSpin]);

  useLayoutEffect(() => {
    if (!spinId || !reelRef.current || !viewportRef.current) return undefined;
    const reelEl = reelRef.current;

    const centerOn = (idx, animate) => {
      const rowEl = reelEl.children[idx];
      if (!rowEl) return;
      // Both rects carry the reel's current transform identically, so the
      // difference is the untransformed offset — no rounding drift.
      const reelRect = reelEl.getBoundingClientRect();
      const rowRect = rowEl.getBoundingClientRect();
      const vpRect = viewportRef.current.getBoundingClientRect();
      const tx = vpRect.width / 2 - ((rowRect.left - reelRect.left) + rowRect.width / 2);
      reelEl.style.transition = animate ? `transform ${SPIN_MS}ms ${EASE}` : 'none';
      reelEl.style.transform = `translateX(${tx}px)`;
    };

    spinningRef.current = true;
    reelEl.style.willChange = 'transform';
    centerOn(startIdx, false);
    void reelEl.offsetWidth; // flush the snap before animating away from it
    centerOn(targetIdx, true);

    const onEnd = () => {
      spinningRef.current = false;
      reelEl.style.willChange = '';
      setIsSpinning(false);
      setLandedIdx(targetIdx);
      const item = reel[targetIdx]?.item;
      if (item) {
        lastLanded.current = item;
        onLand?.(item);
      }
    };

    reelEl.addEventListener('transitionend', onEnd, { once: true });
    return () => reelEl.removeEventListener('transitionend', onEnd);
    // Re-runs per spin; the indices are set together with spinId.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinId]);

  const spin = () => {
    if (!spinningRef.current) buildSpin();
  };

  return (
    <div className="w-48 md:w-64">
      <div
        ref={viewportRef}
        className="relative h-7 overflow-hidden"
        style={{
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 25%, black 75%, transparent)',
          maskImage:
            'linear-gradient(to right, transparent, black 25%, black 75%, transparent)',
        }}
      >
        <div ref={reelRef} className="flex h-full w-max items-center gap-6">
          {reel.map(({ key, item }, i) => (
            <span
              key={key}
              className={`whitespace-nowrap text-sm transition-colors duration-300 ${
                i === landedIdx ? 'text-portfolio-gold' : 'text-portfolio-muted'
              }`}
            >
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-center gap-2">
        <p className="text-sm font-medium text-portfolio-text">Jason-ing</p>
        <button
          type="button"
          onClick={spin}
          disabled={isSpinning}
          aria-label="Spin for another picture"
          className="flex h-7 w-7 items-center justify-center rounded-full border border-portfolio-gold/60 text-portfolio-gold transition-all duration-300 hover:border-portfolio-gold hover:rotate-[-60deg] active:rotate-[-180deg] active:scale-95 disabled:opacity-40"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default JasoningSlot;
