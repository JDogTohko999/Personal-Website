import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronUp, Trophy } from 'lucide-react';

// Particle-count records. `proof` is either a screenshot path or a note.
const ENTRIES = [
  { name: 'anna k', score: '6,911', proof: { image: '/anna_record_proof.jpg' } },
  { name: 'elias k', score: '2.5k', proof: { note: 'I saw this in person. No screenshot. Trust.' } },
];
const SLOTS = 3;

const Leaderboard = () => {
  const [open, setOpen] = useState(false);
  // Index of the entry whose proof is showing, or null.
  const [proofIdx, setProofIdx] = useState(null);
  const wrapRef = useRef(null);

  // The proof closes on a click anywhere outside the board, or Escape.
  useEffect(() => {
    if (proofIdx === null) return undefined;
    const onPointerDown = (e) => {
      if (!wrapRef.current?.contains(e.target)) setProofIdx(null);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setProofIdx(null);
    };
    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [proofIdx]);

  const toggleBoard = () => {
    setOpen((o) => !o);
    setProofIdx(null);
  };

  const proofEntry = proofIdx !== null ? ENTRIES[proofIdx] : null;

  return (
    // Clicks here are kept from reaching the particle canvas, which would
    // otherwise add particles every time someone opens the board.
    <div
      ref={wrapRef}
      onClick={(e) => e.stopPropagation()}
      className="pointer-events-auto relative w-52"
    >
      <div className="rounded-xl border border-portfolio-gold/50 bg-portfolio-card/90 text-xs shadow-lg backdrop-blur">
        <button
          type="button"
          onClick={toggleBoard}
          aria-expanded={open}
          className="group flex w-full items-center gap-1.5 rounded-xl px-3 py-1.5 font-semibold text-portfolio-text hover:text-portfolio-gold transition-colors"
        >
          <Trophy className="w-3.5 h-3.5 text-portfolio-gold" />
          Leaderboard
          <ChevronUp
            className={`ml-auto w-3.5 h-3.5 text-portfolio-gold transition-transform duration-300 ${
              open ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Animating grid rows from 0fr to 1fr slides the list open smoothly
            without measuring its height. */}
        <div
          className="grid transition-[grid-template-rows] duration-300 ease-out"
          style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
        >
          <div className="min-h-0 overflow-hidden">
            <ol
              className={`border-t border-portfolio-border px-3 pt-1.5 pb-2 space-y-1 transition-opacity duration-300 ${
                open ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {Array.from({ length: SLOTS }, (_, i) => {
                const entry = ENTRIES[i];
                return (
                  <li key={i} className="flex items-center gap-2 h-6">
                    <span className="w-3 font-bold text-portfolio-gold tabular-nums">{i + 1}</span>
                    {entry ? (
                      <>
                        <span className="text-portfolio-text">{entry.name}</span>
                        <span className="text-portfolio-muted tabular-nums">{entry.score}</span>
                        <button
                          type="button"
                          tabIndex={open ? 0 : -1}
                          onClick={() => setProofIdx((p) => (p === i ? null : i))}
                          aria-expanded={proofIdx === i}
                          className={`ml-auto rounded px-1.5 py-0.5 text-[11px] underline underline-offset-2 transition-colors ${
                            proofIdx === i
                              ? 'bg-portfolio-gold/20 text-portfolio-gold'
                              : 'text-portfolio-muted hover:text-portfolio-gold'
                          }`}
                        >
                          proof
                        </button>
                      </>
                    ) : (
                      <span className="text-portfolio-muted/70 italic">open spot</span>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>

      {/* Proof opens beside the board (it hugs the left edge, so there is room
          to the right) and is sized to the screen, not to the small link. */}
      <AnimatePresence mode="wait">
        {proofEntry && (
          <motion.div
            key={proofIdx}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute bottom-0 left-full ml-3 z-50 rounded-lg border-2 border-portfolio-gold/60 bg-portfolio-card p-1.5 shadow-2xl"
            // The panel sits past the board's right edge, which leaves it no
            // width of its own to shrink-to-fit into; without an explicit width
            // the screenshot (capped at max-width: 100%) collapses to nothing.
            style={proofEntry.proof.image ? { width: 'min(36rem, calc(100vw - 18rem))' } : undefined}
          >
            {proofEntry.proof.image ? (
              <a
                href={proofEntry.proof.image}
                target="_blank"
                rel="noopener noreferrer"
                title="Open full size"
                className="block"
              >
                <img
                  src={proofEntry.proof.image}
                  alt={`${proofEntry.name}'s record of ${proofEntry.score} particles`}
                  className="block w-full h-auto rounded"
                />
              </a>
            ) : (
              <p className="w-52 px-2 py-1.5 text-xs text-portfolio-text leading-relaxed">
                {proofEntry.proof.note}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Leaderboard;
