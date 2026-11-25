import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/*
  A photo, larger, over the page.
    images: string[]   the URLs to show
    index, onClose, onStep(dir)
    alt: string        what the set is ("Bay"); each photo is announced as "Bay, photo 2 of 3"
    alts: string[]     optional per-photo descriptions, used instead when given

  It is a modal dialog: Escape closes and the arrow keys step. While it is open the page behind
  is inert and Tab stays inside it; on closing, focus goes back to whatever opened it.
*/
const FOCUSABLE = 'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

export default function Lightbox({ images, index, alt = '', alts, onClose, onStep }) {
  const dialog = useRef(null);
  const closeButton = useRef(null);

  useEffect(() => {
    // Remember the opener first, then move focus in (autoFocus would run before this effect and
    // make the close button look like the opener).
    const opener = document.activeElement;
    const root = document.getElementById('root');
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden'; // the page behind stays where it was
    root?.setAttribute('inert', '');
    closeButton.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = overflow;
      root?.removeAttribute('inert');
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowRight') onStep?.(1);
      else if (e.key === 'ArrowLeft') onStep?.(-1);
      else if (e.key === 'Tab') {
        // Keep Tab inside the dialog (for browsers without `inert`, and so it wraps).
        const stops = [...(dialog.current?.querySelectorAll(FOCUSABLE) || [])];
        if (!stops.length) return;
        const first = stops[0];
        const last = stops[stops.length - 1];
        const at = document.activeElement;
        if (!dialog.current.contains(at)) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && at === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && at === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onStep]);

  if (index == null || !images[index]) return null;
  const many = images.length > 1 && onStep;
  const stop = (e) => e.stopPropagation();
  const described = alts?.[index] || (images.length > 1 ? `${alt}, photo ${index + 1} of ${images.length}` : alt);

  return createPortal(
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={alt || 'Photo'} ref={dialog} onClick={onClose}>
      <div className="lightbox-bar" onClick={stop}>
        <span>{alt}</span>
        <button type="button" className="word" ref={closeButton} onClick={onClose}>close</button>
      </div>
      <img src={images[index]} alt={described} onClick={stop} />
      <div className="lightbox-bar" onClick={stop}>
        {many ? (
          <>
            <span>
              <button type="button" className="word" onClick={() => onStep(-1)}>previous</button>
              <button type="button" className="word" onClick={() => onStep(1)}>next</button>
            </span>
            <span aria-live="polite">{index + 1} of {images.length}</span>
          </>
        ) : <span />}
      </div>
    </div>,
    document.body,
  );
}
