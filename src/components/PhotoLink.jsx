import React, { useCallback, useState } from 'react';
import Lightbox from './Lightbox.jsx';
import { full } from './webImage.js';

/* Words that open photos in the lightbox instead of going anywhere, e.g. "3x IM Co-ed Volleyball
   Champs" opens the Boomsticks photos. Looks like a link (it's a button underneath). */
export default function PhotoLink({ images, alt, alts, children }) {
  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d) => setOpen((n) => (n + d + images.length) % images.length), [images.length]);
  return (
    <>
      <button type="button" className="photo-link" onClick={() => setOpen(0)} aria-haspopup="dialog">
        {children}
      </button>
      {open != null && (
        <Lightbox images={images.map(full)} index={open} alt={alt} alts={alts} onClose={close} onStep={step} />
      )}
    </>
  );
}
