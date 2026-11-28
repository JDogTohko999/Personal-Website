import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/*
  Hover notes: a word (or a footnote number) that shows a little pop-up with more on hover.
  The idea is from arunim.fyi (Quartz's link previews); this is a light version for the posts.

    <Note text="the extra info, can include <em>markup</em>">the word</Note>
    <FootnoteRef n={1} />   a [1] that previews <Footnote n={1}> on hover and still jumps to it

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

function Box({ id, boxProps, children, html, container }) {
  return createPortal(
    <span className="hover-note-box" role="tooltip" id={id} {...boxProps}>
      {html != null ? <span dangerouslySetInnerHTML={{ __html: html }} /> : children}
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
      <button
        type="button"
        className="hover-note"
        aria-describedby={open ? id : undefined}
        aria-expanded={open}
        onClick={(e) => { if (e.nativeEvent.pointerType !== 'mouse') setOpen((v) => !v); }}
        {...triggerProps}
      >
        {children}
      </button>
      {open && <Box id={id} boxProps={boxProps} container={container}>{text}</Box>}
    </>
  );
}

function footnoteHtml(n) {
  const fn = typeof document !== 'undefined' && document.getElementById(`fn${n}`);
  if (!fn) return '';
  const copy = fn.cloneNode(true);
  copy.querySelector(`a[href="#ref${n}"]`)?.remove(); // drop the [n] back-link
  copy.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
  return copy.innerHTML.trim();
}

// A footnote number that previews its footnote. Clicking with a mouse still jumps to the
// footnote at the bottom; a tap on a phone opens the preview instead.
export function FootnoteRef({ n, className = '' }) {
  const id = useId();
  const { open, setOpen, triggerProps, boxProps, container } = useHoverPopup();
  // Read the footnote off the page while rendering, so the box exists in the same commit as
  // `open` and can be placed straight away.
  const html = open ? footnoteHtml(n) : '';
  return (
    <>
      <a
        href={`#fn${n}`}
        id={`ref${n}`}
        className={`footnote-ref ${className}`.trim()}
        aria-describedby={open ? id : undefined}
        onClick={(e) => {
          if (e.nativeEvent.pointerType && e.nativeEvent.pointerType !== 'mouse') {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
        {...triggerProps}
      >
        [{n}]
      </a>
      {open && html && <Box id={id} boxProps={boxProps} html={html} container={container} />}
    </>
  );
}
