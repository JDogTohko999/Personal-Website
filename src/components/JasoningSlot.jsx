import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { RotateCcw, Lock } from 'lucide-react';

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

   After it settles, the two words either side of centre become clickable, so
   a visitor can walk along the reel one word at a time instead of spinning
   again. That is capped at MAX_NUDGES steps, after which the strip locks and
   points them at the spin button — otherwise they could stroll the whole list
   and the reel stops being a reel. The pads are sized to cover the cap so a
   walk in either direction never runs out of words.

   Widths vary per word ("pointing" vs "jim carey-ing"), so centring is
   measured from live rects rather than assuming a fixed step. */

const MAX_NUDGES = 3;    // steps allowed after a spin before the strip locks
const LEAD = MAX_NUDGES; // words parked left of the start word
const TAIL = MAX_NUDGES; // words parked right of the landing word
const SPIN_MS = 2000;
const NUDGE_MS = 420;
const AUTO_SPIN_DELAY_MS = 1000;
const EASE = 'cubic-bezier(.16, .68, .26, 1)';
const NUDGE_EASE = 'cubic-bezier(.22, .61, .36, 1)';

const LockNote = () => (
  <p className="mt-1 flex items-center justify-center gap-1 text-xs text-portfolio-gold">
    <Lock className="h-3 w-3 flex-shrink-0" />
    that&apos;s your three, respin
  </p>
);

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

const JasoningSlot = ({ items, openers = [], onLand, footer = null, autoSpinDelayMs = AUTO_SPIN_DELAY_MS }) => {
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
  const [centerIdx, setCenterIdx] = useState(-1);
  const [nudges, setNudges] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const locked = nudges >= MAX_NUDGES;

  // Slide the reel so the word at `idx` sits in the middle of the viewport.
  // Both rects carry the reel's current transform identically, so their
  // difference is the untransformed offset — no rounding drift.
  const centerOn = useCallback((idx, ms, ease) => {
    const reelEl = reelRef.current;
    const vp = viewportRef.current;
    if (!reelEl || !vp) return;
    const rowEl = reelEl.children[idx];
    if (!rowEl) return;
    const reelRect = reelEl.getBoundingClientRect();
    const rowRect = rowEl.getBoundingClientRect();
    const vpRect = vp.getBoundingClientRect();
    const tx = vpRect.width / 2 - ((rowRect.left - reelRect.left) + rowRect.width / 2);
    reelEl.style.transition = ms ? `transform ${ms}ms ${ease}` : 'none';
    reelEl.style.transform = `translateX(${tx}px)`;
  }, []);

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
    setCenterIdx(-1);
    setNudges(0);
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
      const pause = new Promise((resolve) => setTimeout(resolve, autoSpinDelayMs));
      if (document.fonts?.ready) {
        try { await document.fonts.ready; } catch { /* measure anyway */ }
      }
      await pause;
      // Skip if the visitor already spun by hand during the pause.
      if (!cancelled && spinCount.current === 0) buildSpin();
    };
    go();
    return () => { cancelled = true; };
  }, [buildSpin, autoSpinDelayMs]);

  useLayoutEffect(() => {
    if (!spinId || !reelRef.current || !viewportRef.current) return undefined;
    const reelEl = reelRef.current;

    spinningRef.current = true;
    reelEl.style.willChange = 'transform';
    centerOn(startIdx, 0);
    void reelEl.offsetWidth; // flush the snap before animating away from it
    centerOn(targetIdx, SPIN_MS, EASE);

    const onEnd = () => {
      spinningRef.current = false;
      reelEl.style.willChange = '';
      setIsSpinning(false);
      setCenterIdx(targetIdx);
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

  // Step one word left (-1) or right (+1) from centre.
  const nudge = (dir) => {
    if (spinningRef.current || locked || centerIdx < 0) return;
    const next = centerIdx + dir;
    if (next < 0 || next >= reel.length) return;
    const item = reel[next].item;
    setCenterIdx(next);
    setNudges((n) => n + 1);
    lastLanded.current = item;
    onLand?.(item);
    centerOn(next, NUDGE_MS, NUDGE_EASE);
  };

  const spin = () => {
    if (!spinningRef.current) buildSpin();
  };

  const settled = centerIdx >= 0 && !isSpinning;

  return (
    <div className="w-48 md:w-64">
      <div
        ref={viewportRef}
        className={`relative h-7 overflow-hidden ${locked ? 'animate-lockshake' : ''}`}
        style={{
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 25%, black 75%, transparent)',
          maskImage:
            'linear-gradient(to right, transparent, black 25%, black 75%, transparent)',
        }}
      >
        <div ref={reelRef} className="flex h-full w-max items-center gap-6">
          {reel.map(({ key, item }, i) => {
            const offset = settled ? i - centerIdx : null;
            const isCentre = offset === 0;
            const canNudge = settled && !locked && Math.abs(offset) === 1;
            const cls = [
              'whitespace-nowrap text-sm transition-all duration-300',
              isCentre ? 'text-portfolio-gold' : 'text-portfolio-muted',
              canNudge ? 'cursor-pointer hover:text-portfolio-gold hover:underline underline-offset-4' : '',
              // Once locked, the neighbours stop inviting a click.
              locked && Math.abs(offset) === 1 ? 'opacity-40' : '',
            ].join(' ');

            return canNudge ? (
              <button
                key={key}
                type="button"
                onClick={() => nudge(offset)}
                aria-label={`Step to ${item.label}`}
                className={cls}
              >
                {item.label}
              </button>
            ) : (
              <span key={key} className={cls}>{item.label}</span>
            );
          })}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-center gap-2">
        <p className="text-sm font-medium text-portfolio-text">Jason-ing</p>
        <button
          type="button"
          onClick={spin}
          disabled={isSpinning}
          aria-label="Spin for another picture"
          className={`flex h-8 w-8 items-center justify-center rounded-full bg-portfolio-gold text-portfolio-on-gold shadow-[0_2px_6px_rgba(0,0,0,.35)] transition-all duration-300 hover:rotate-[-60deg] hover:shadow-[0_4px_10px_rgba(0,0,0,.45)] hover:brightness-110 active:rotate-[-180deg] active:scale-95 active:shadow-[0_1px_3px_rgba(0,0,0,.4)] disabled:opacity-40 disabled:shadow-none ${
            locked ? 'ring-2 ring-portfolio-gold/40 ring-offset-2 ring-offset-transparent' : ''
          }`}
        >
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>
      </div>

      {/* The note collapses to nothing until the cap is hit, so `footer` sits
          straight under the label and is only pushed down when it opens. */}
      <div
        className={`grid transition-all duration-300 ease-out ${
          locked ? 'grid-rows-[1fr] opacity-100' : 'pointer-events-none grid-rows-[0fr] opacity-0'
        }`}
        aria-live="polite"
      >
        <div className="overflow-hidden"><LockNote /></div>
      </div>

      <div className="flex justify-center">{footer}</div>

      {/* An invisible twin of the note, collapsing in the opposite direction.
          The two always sum to one note's height, so this column never changes
          size — without it the hero row re-centres and lifts the portrait. */}
      <div
        aria-hidden="true"
        className={`grid transition-all duration-300 ease-out ${
          locked ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'
        }`}
      >
        <div className="invisible overflow-hidden"><LockNote /></div>
      </div>
    </div>
  );
};

export default JasoningSlot;
