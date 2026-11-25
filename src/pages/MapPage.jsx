import React from 'react';
import { cities } from '../data/places.js';
import useTitle from '../lib/useTitle.js';

// Placeholder until TourGlobe lands.
export default function MapPage() {
  useTitle('Map');
  return (
    <>
      <h1>Places</h1>
      <ul className="plain-list">
        {cities.map((c) => (
          <li key={c.id}><strong>{c.name}</strong>: {c.description}</li>
        ))}
      </ul>
    </>
  );
}
