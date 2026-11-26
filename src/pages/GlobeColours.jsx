import React from 'react';
import TourGlobe from '../components/TourGlobe.jsx';
import useTitle from '../lib/useTitle.js';

/*
  Review page (not in the nav): the Travels globe in a few colourings, starting from what /travels
  uses now, with the green that fills visited countries moved to a city glow instead (glow mode:
  --globe-glow). Each variant just overrides the globe's CSS colour tokens on a wrapper.
  ?v=G1 shows one variant; the globe holds still on home (reduced motion) so they compare.
*/
const NOW = { ocean: '#eef0e9', land: '#cfd4c6', border: '#eef0e9', bucket: '#d8d0b4', pin: '#4a4626' };

export const GLOBE_COLOURS = [
  {
    id: 'G0', name: 'Now (green fills visited countries)',
    vars: { ...NOW, visited: '#8e9a87' },
    roles: [['ocean', 'mist', NOW.ocean], ['land', 'pale sage grey', NOW.land], ['visited countries', 'sage green', '#8e9a87'], ['pins', 'dark olive', NOW.pin], ['bucket list', 'sand', NOW.bucket]],
  },
  {
    id: 'G1', name: 'Same green, as a city glow',
    vars: { ...NOW, glow: '#8e9a87' },
    roles: [['ocean', 'mist', NOW.ocean], ['land', 'pale sage grey', NOW.land], ['city glow', 'sage green', '#8e9a87'], ['pins', 'dark olive', NOW.pin], ['bucket list', 'sand', NOW.bucket]],
  },
  {
    id: 'G2', name: 'Deeper green glow',
    vars: { ...NOW, glow: '#5f7656' },
    roles: [['ocean', 'mist', NOW.ocean], ['land', 'pale sage grey', NOW.land], ['city glow', 'fern green', '#5f7656'], ['pins', 'dark olive', NOW.pin], ['bucket list', 'sand', NOW.bucket]],
  },
  {
    id: 'G3', name: 'Green glow on warm oat land',
    vars: { ocean: '#eef0e9', land: '#ded5bf', border: '#eef0e9', bucket: '#c4b6c9', pin: '#3f3a22', glow: '#6c8160' },
    roles: [['ocean', 'mist', '#eef0e9'], ['land', 'oat', '#ded5bf'], ['city glow', 'sage green (deeper)', '#6c8160'], ['pins', 'dark olive', '#3f3a22'], ['bucket list', 'heather', '#c4b6c9']],
  },
  {
    id: 'G4', name: 'Green glow, ochre bucket list',
    vars: { ...NOW, bucket: '#d8b56e', glow: '#6c8160' },
    roles: [['ocean', 'mist', NOW.ocean], ['land', 'pale sage grey', NOW.land], ['city glow', 'sage green (deeper)', '#6c8160'], ['pins', 'dark olive', NOW.pin], ['bucket list', 'ochre', '#d8b56e']],
  },
  {
    id: 'G5', name: 'Green glow, blue-grey sea',
    vars: { ocean: '#d6e0e3', land: '#e6e2d3', border: '#d6e0e3', bucket: '#c9bccb', pin: '#3f3a22', glow: '#6c8160' },
    roles: [['ocean', 'blue-grey', '#d6e0e3'], ['land', 'linen', '#e6e2d3'], ['city glow', 'sage green (deeper)', '#6c8160'], ['pins', 'dark olive', '#3f3a22'], ['bucket list', 'heather', '#c9bccb']],
  },
];

const toStyle = (v) => Object.fromEntries(Object.entries(v).map(([k, val]) => [`--globe-${k}`, val]));

export default function GlobeColours() {
  useTitle('Globe colours');
  const only = new URLSearchParams(window.location.search).get('v');
  const list = only ? GLOBE_COLOURS.filter((m) => m.id === only) : GLOBE_COLOURS;
  return (
    <>
      <h1 className="page-title">Globe colours</h1>
      {list.map((m) => (
        <section key={m.id} className="map-variant" style={toStyle({ frame: m.vars.ocean, ...m.vars })}>
          <h2 className="section-title">{m.id}. {m.name}</h2>
          <TourGlobe
            aspect="4 / 3"
            showControls={false}
            classNames={{ frame: 'globe-frame' }}
            reducedMotion
            zoomIn={1.5}
            showCaption={false}
          />
          <ul className="map-key">
            {m.roles.map(([role, name, hex]) => (
              <li key={role}>
                <span className="map-swatch" style={{ background: hex }} />
                <span><strong>{role}</strong>: {name} <span className="muted">{hex}</span></span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
