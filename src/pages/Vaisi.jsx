import React, { useState } from 'react';
import * as vaisi from '../data/vaisi.jsx';
import Lightbox from '../components/Lightbox.jsx';
import useTitle from '../lib/useTitle.js';

export default function Vaisi() {
  useTitle('VAISI');
  const [box, setBox] = useState(null); // { images, index, alt }
  const sets = Object.values(vaisi.imageSets);
  return (
    <>
      <img src={vaisi.logo} alt="" width="72" height="72" style={{ width: 72, height: 72, objectFit: 'contain' }} />
      <h1>{vaisi.name}</h1>
      <p className="muted">
        {vaisi.role} · {vaisi.period} ·{' '}
        <a href={vaisi.url} target="_blank" rel="noopener noreferrer">vaisi.org</a>
      </p>
      <h2>{vaisi.story.heading}</h2>
      {vaisi.story.paragraphs.map((p, i) => <p key={i}>{p}</p>)}

      {sets.map((set) => (
        <section key={set.altText}>
          <h3>{set.label}</h3>
          <div className="thumbs">
            {set.images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setBox({ images: set.images, index: i, alt: set.altText })}
                aria-label={`${set.altText}, photo ${i + 1}`}
              >
                <img src={src} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </section>
      ))}

      <h3>{vaisi.textImage.label}</h3>
      <img src={vaisi.textImage.src} alt={vaisi.textImage.alt} loading="lazy" style={{ maxWidth: 280 }} />

      {box && (
        <Lightbox
          images={box.images}
          index={box.index}
          alt={box.alt}
          onClose={() => setBox(null)}
          onStep={(d) => setBox((b) => ({ ...b, index: (b.index + d + b.images.length) % b.images.length }))}
        />
      )}
    </>
  );
}
