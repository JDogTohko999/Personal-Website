import React from 'react';
import { Note } from '../components/HoverNote.jsx';
import useTitle from '../lib/useTitle.js';

/* Review page (dev server only): colours for the hover-note highlight, on the sage sheet. */
export const HIGHLIGHTS = [
  { id: 'clay', name: 'Clay (current)', bg: 'color-mix(in srgb, var(--link) 15%, transparent)', hover: 'color-mix(in srgb, var(--link) 27%, transparent)' },
  { id: 'moss', name: 'Moss green', bg: 'rgba(78, 90, 48, 0.17)', hover: 'rgba(78, 90, 48, 0.3)' },
  { id: 'honey', name: 'Honey / ochre', bg: 'rgba(214, 166, 64, 0.32)', hover: 'rgba(214, 166, 64, 0.5)' },
  { id: 'blue', name: 'Dusty blue', bg: 'rgba(96, 132, 156, 0.22)', hover: 'rgba(96, 132, 156, 0.36)' },
  { id: 'heather', name: 'Heather', bg: 'rgba(150, 118, 166, 0.24)', hover: 'rgba(150, 118, 166, 0.38)' },
  { id: 'cream', name: 'Cream (lighter than the page)', bg: 'rgba(254, 250, 225, 0.7)', hover: 'rgba(254, 250, 225, 0.95)' },
  { id: 'terracotta', name: 'Terracotta', bg: 'rgba(180, 87, 47, 0.2)', hover: 'rgba(180, 87, 47, 0.33)' },
  { id: 'marker', name: 'Honey marker (lower half only)', bg: 'linear-gradient(transparent 55%, rgba(214, 166, 64, 0.45) 55%)', hover: 'linear-gradient(transparent 30%, rgba(214, 166, 64, 0.5) 30%)' },
];

export default function HighlightChoices() {
  useTitle('Highlight choices');
  return (
    <>
      <h1 className="page-title">Highlight choices</h1>
      {HIGHLIGHTS.map((h) => (
        <section key={h.id} className="font-sample" style={{ '--note-bg': h.bg, '--note-bg-hover': h.hover }}>
          <p className="font-sample-name">{h.name}</p>
          <p>
            As I was reading, annoyed by the frequent <Note text="(the note pops up here)">oversimplifications</Note>, I suddenly stopped. It should have been{' '}
            <Note text="(the note pops up here)">caught before publishing</Note>. Compare a{' '}
            <a href="#x" onClick={(e) => e.preventDefault()}>normal link</a> and{' '}
            <strong className="font-bold px-1 rounded" style={{ backgroundColor: 'rgba(244, 204, 103, 0.25)' }}>your yellow highlight</strong>.
          </p>
        </section>
      ))}
    </>
  );
}
