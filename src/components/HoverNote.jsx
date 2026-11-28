import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/*
  Hover notes: a highlighted word that shows a little pop-up with more on hover (in place of
  footnotes). The idea is from arunim.fyi (Quartz's link previews), without Quartz.

    <Note text={<>the extra info, can include <em>markup</em></>}>the word</Note>

  Mouse: opens after a short pause on hover and stays open while the pointer is on the word or
  the box. Touch: a tap opens it, a tap anywhere else closes it. Keyboard: focus opens it,
  Escape or moving focus away closes it. The box is placed under the word, or above it when
  there is no room below, and kept inside the window.
*/
const OPEN_MS = 120;
const CLOSE_MS = 180;
const GAP = 8;
const EDGE = 12;

function useHoverPopup() {
  const [open, setOpen] = useState(false);
  const timer = useRef(null);
  const trigger = useRef(null);
  const box = useRef(null);
  const [pos, setPos] = useState(null);

  const later = (fn, ms) => { clearTimeout(timer.current); timer.current = setTimeout(fn, ms); };
  const show = useCallback(() => later(() => setOpen(true), OPEN_MS), []);
  const hide = useCallback(() => later(() => setOpen(false), CLOSE_MS), []);
  const stay = useCallback(() => clearTimeout(timer.current), []);
  useEffect(() => () => clearTimeout(timer.current), []);

  const place = useCallback(() => {
    const t = trigger.current?.getBoundingClientRect();
    const b = box.current;
    if (!t || !b) return;
    const w = b.offsetWidth;
    const h = b.offsetHeight;
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    let left = t.left + t.width / 2 - w / 2;
    left = Math.max(EDGE, Math.min(left, vw - w - EDGE));
    const below = t.bottom + GAP;
    const above = t.top - GAP - h;
    const top = below + h <= vh - EDGE || above < EDGE ? below : above;
    setPos({ left, top });
  }, []);

  useLayoutEffect(() => {
    if (!open) { setPos(null); return undefined; }
    place();
    const onKey = (e) => { if (e.key === 'Escape') { setOpen(false); trigger.current?.focus(); } };
    const onDown = (e) => {
      if (trigger.current?.contains(e.target) || box.current?.contains(e.target)) return;
      setOpen(false);
    };
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [open, place]);

  // Mouse hovers; touch and pen get a tap instead (no hover to speak of).
  const triggerProps = {
    ref: trigger,
    onPointerEnter: (e) => { if (e.pointerType === 'mouse') show(); },
    onPointerLeave: (e) => { if (e.pointerType === 'mouse') hide(); },
    onFocus: () => setOpen(true),
    onBlur: (e) => { if (!box.current?.contains(e.relatedTarget)) hide(); },
  };
  const boxProps = {
    ref: box,
    onPointerEnter: stay,
    onPointerLeave: (e) => { if (e.pointerType === 'mouse') hide(); },
    style: pos ? { left: pos.left, top: pos.top } : { left: -9999, top: 0, visibility: 'hidden' },
  };
  // Mount inside the sheet so the box takes the current look's colours (they live on .sheet).
  const container = () => trigger.current?.closest('.sheet') || document.body;
  return { open, setOpen, triggerProps, boxProps, container };
}

function Box({ id, boxProps, children, container }) {
  return createPortal(
    <span className="hover-note-box" role="tooltip" id={id} {...boxProps}>
      {children}
    </span>,
    container(),
  );
}

// A word with a note. `text` is what pops up (a string or JSX).
export function Note({ text, children }) {
  const id = useId();
  const { open, setOpen, triggerProps, boxProps, container } = useHoverPopup();
  return (
    <>
      {/* A span, not a <button>: buttons can't wrap across lines, and a note can be a phrase. */}
      <span
        role="button"
        tabIndex={0}
        className="hover-note"
        aria-describedby={open ? id : undefined}
        aria-expanded={open}
        onClick={(e) => { if (e.nativeEvent.pointerType !== 'mouse') setOpen((v) => !v); }}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen((v) => !v); } }}
        {...triggerProps}
      >
        {children}
      </span>
      {open && <Box id={id} boxProps={boxProps} container={container}>{text}</Box>}
    </>
  );
}
