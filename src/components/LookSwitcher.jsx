import React, { useState } from 'react';
import { LOOKS, ZOOMS, getLook, getZoom, setLook, setZoom } from '../lib/look.js';

/*
  A small review panel, bottom-right, for flipping between the variations. It shows on the local
  dev server, or anywhere with ?review in the URL; it is not part of the design.
*/
export default function LookSwitcher() {
  const show = import.meta.env.DEV || new URLSearchParams(window.location.search).has('review');
  const [look, setL] = useState(getLook);
  const [zoom, setZ] = useState(getZoom);
  if (!show) return null;
  return (
    <div className="look-switcher" role="group" aria-label="Design variations (review only)">
      <span className="look-switcher__label">look</span>
      {LOOKS.map((l) => (
        <button
          key={l.id}
          type="button"
          title={l.note}
          aria-pressed={look === l.id}
          onClick={() => { setLook(l.id); setL(l.id); }}
        >
          {l.label}
        </button>
      ))}
      <span className="look-switcher__label">zoom</span>
      {ZOOMS.map((z) => (
        <button
          key={z.id}
          type="button"
          aria-pressed={zoom === z.id}
          onClick={() => { setZoom(z.id); setZ(z.id); }}
        >
          {z.label}
        </button>
      ))}
    </div>
  );
}
