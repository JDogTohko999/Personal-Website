import React, { useState } from 'react';
import { JASONINGS, OPENERS } from '../data/jasonings.js';
import { thumb } from './webImage.js';

/* Jason-ing, small and quiet: one square photo of Jason doing something, and a word to see
   another. It starts on one of the openers. Lives beside the intro at the top of /blog. */
export default function Jasoning() {
  const [i, setI] = useState(() => {
    const pick = OPENERS[Math.floor(Math.random() * OPENERS.length)];
    return Math.max(0, JASONINGS.findIndex((j) => j.label === pick));
  });
  const item = JASONINGS[i];
  const next = () => setI((n) => (n + 1) % JASONINGS.length);
  return (
    <figure className="jasoning">
      <button type="button" className="jasoning-frame" onClick={next} aria-label={`Jason ${item.label}. Show another photo.`}>
        {item.type === 'video' ? (
          <video src={item.src} muted loop autoPlay playsInline aria-hidden="true" />
        ) : (
          <img src={thumb(item.src)} alt="" width="104" height="104" />
        )}
      </button>
      <figcaption aria-live="polite">Jason, {item.label}</figcaption>
    </figure>
  );
}
