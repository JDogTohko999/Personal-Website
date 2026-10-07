/* Sticky "this session got help from the console" flag.

   Nothing here can stop a determined person — it is their browser, their
   devtools, their machine. The goal is narrower: make the lazy path (open
   inspector, retype the number, screenshot) produce a screenshot that says so.

   The flag lives in a module closure rather than on window or in React state,
   so there is no obvious handle to flip from a console. It is mirrored into
   sessionStorage so a reload in the same tab keeps the mark — and since a
   reload also wipes the particle count back to the default, clearing the
   evidence costs the score that made it worth faking. Closing the tab clears
   it, so nobody is branded beyond the visit. */

const KEY = 'pc-assisted';

let flagged = (() => {
  try {
    return sessionStorage.getItem(KEY) === '1';
  } catch {
    return false; // private mode / storage disabled
  }
})();

export const isFlagged = () => flagged;

export const flagAssisted = () => {
  if (flagged) return;
  flagged = true;
  try {
    sessionStorage.setItem(KEY, '1');
  } catch {
    /* in-memory flag still holds for this page */
  }
};

/* A click pushes 4 particles and the counter polls every 400ms, so honest play
   tops out around 30 per poll even from a frantic clicker. The count slider
   can legitimately jump by its full 10->200 range in one tick, so the bar sits
   well above that: 300 per poll is 750/second, or ~190 clicks a second. */
export const MAX_PLAUSIBLE_DELTA = 300;

/* Particles are re-seeded by density on resize, which can add a batch in one
   tick through no fault of the visitor. Detection pauses briefly afterwards. */
export const RESIZE_GRACE_MS = 1200;
