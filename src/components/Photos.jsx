import React, { useCallback, useState } from 'react';
import Lightbox from './Lightbox.jsx';
import { full, thumb } from './webImage.js';

/* A quiet row of small photos; each opens larger (Lightbox: Esc, arrows, focus kept inside).
   images: original paths from the data files. alt names the set; alts (optional) names each. */
export default function Photos({ images, alt, alts }) {
  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d) => setOpen((n) => (n + d + images.length) % images.length), [images.length]);
  return (
    <>
      <div className="photos">
        {images.map((src, n) => (
          <button
            key={src}
            type="button"
            onClick={() => setOpen(n)}
            aria-label={`${alts?.[n] || `${alt}, photo ${n + 1} of ${images.length}`}. Open larger.`}
          >
            <img src={thumb(src)} alt="" loading="lazy" />
          </button>
        ))}
      </div>
      {open != null && (
        <Lightbox images={images.map(full)} index={open} alt={alt} alts={alts} onClose={close} onStep={step} />
      )}
    </>
  );
}
