import React, { useEffect } from 'react';

/* Minimal full-image overlay. images: string[] (already the URLs to show), index, onClose,
   onStep(dir). Escape closes; arrow keys step. Builders: restyle or replace freely. */
export default function Lightbox({ images, index, alt = '', onClose, onStep }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onStep?.(1);
      if (e.key === 'ArrowLeft') onStep?.(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onStep]);

  if (index == null || !images[index]) return null;
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={alt || 'Photo'} onClick={onClose}>
      <img src={images[index]} alt={alt} onClick={(e) => e.stopPropagation()} />
      <button type="button" onClick={onClose} autoFocus>Close</button>
    </div>
  );
}
