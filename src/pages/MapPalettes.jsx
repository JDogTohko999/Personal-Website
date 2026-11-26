import React from 'react';
import GlowMap from '../components/GlowMap.jsx';
import useTitle from '../lib/useTitle.js';

/*
  Review page (not in the nav): four Japandi colourings of the live site's glow map, so Jason can
  pick one for Travels. Each lists which Japandi colour does which job.
  Japandi (sampled from his palette image): soft white #FEFAE1, beige #E8C998, natural #C29665,
  warm taupe #936D49, moss #4E5230, soft black #272018, terracotta #752C13, walnut #522111,
  deep brown #311209.
*/
export const MAP_PALETTES = [
  {
    id: 'A', name: 'Cream & terracotta',
    palette: { ocean: '#FEFAE1', land: '#E8C998', border: '#FEFAE1', glow: '#752C13', dot: '#522111', dotRing: '#FEFAE1', going: '#4E5230', bucket: '#C29665' },
    roles: [['ocean', 'soft white', '#FEFAE1'], ['land', 'beige', '#E8C998'], ['city glow', 'terracotta', '#752C13'], ['city dots', 'walnut', '#522111'], ['going soon', 'moss', '#4E5230'], ['bucket list', 'natural', '#C29665']],
  },
  {
    id: 'B', name: 'Moss on natural',
    palette: { ocean: '#FEFAE1', land: '#C29665', border: '#FEFAE1', glow: '#4E5230', dot: '#272018', dotRing: '#FEFAE1', going: '#752C13', bucket: '#E8C998' },
    roles: [['ocean', 'soft white', '#FEFAE1'], ['land', 'natural', '#C29665'], ['city glow', 'moss', '#4E5230'], ['city dots', 'soft black', '#272018'], ['going soon', 'terracotta', '#752C13'], ['bucket list', 'beige', '#E8C998']],
  },
  {
    id: 'C', name: 'Walnut night (closest to the live site)',
    palette: { ocean: '#311209', land: '#522111', border: '#311209', glow: '#E8C998', dot: '#FEFAE1', dotRing: '#311209', going: '#C29665', bucket: '#936D49' },
    roles: [['ocean', 'deep brown', '#311209'], ['land', 'walnut', '#522111'], ['city glow', 'beige', '#E8C998'], ['city dots', 'soft white', '#FEFAE1'], ['going soon', 'natural', '#C29665'], ['bucket list', 'warm taupe', '#936D49']],
  },
  {
    id: 'D', name: 'Sunlit taupe',
    palette: { ocean: '#FEFAE1', land: '#936D49', border: '#FEFAE1', glow: '#E8C998', dot: '#272018', dotRing: '#FEFAE1', going: '#4E5230', bucket: '#752C13' },
    roles: [['ocean', 'soft white', '#FEFAE1'], ['land', 'warm taupe', '#936D49'], ['city glow', 'beige', '#E8C998'], ['city dots', 'soft black', '#272018'], ['going soon', 'moss', '#4E5230'], ['bucket list', 'terracotta', '#752C13']],
  },
  // Terracotta and olive (Jason asked for these). Olive #8C8A5A and the lighter terracotta #B4572F
  // are tints of the palette's moss and terracotta, which are too dark to glow on olive.
  {
    id: 'E', name: 'Olive & terracotta',
    palette: { ocean: '#FEFAE1', land: '#8C8A5A', border: '#FEFAE1', glow: '#B4572F', dot: '#272018', dotRing: '#FEFAE1', going: '#4E5230', bucket: '#E8C998' },
    roles: [['ocean', 'soft white', '#FEFAE1'], ['land', 'olive', '#8C8A5A'], ['city glow', 'terracotta (lighter)', '#B4572F'], ['city dots', 'soft black', '#272018'], ['going soon', 'moss (deep olive)', '#4E5230'], ['bucket list', 'beige', '#E8C998']],
  },
  {
    id: 'F', name: 'Olive night, terracotta glow',
    palette: { ocean: '#2E311C', land: '#4E5230', border: '#2E311C', glow: '#C4693F', dot: '#FEFAE1', dotRing: '#2E311C', going: '#C29665', bucket: '#936D49' },
    roles: [['ocean', 'dark olive', '#2E311C'], ['land', 'moss / olive', '#4E5230'], ['city glow', 'terracotta (bright)', '#C4693F'], ['city dots', 'soft white', '#FEFAE1'], ['going soon', 'natural', '#C29665'], ['bucket list', 'warm taupe', '#936D49']],
  },
  {
    id: 'G', name: 'Terracotta land, olive glow',
    palette: { ocean: '#FEFAE1', land: '#C98A68', border: '#FEFAE1', glow: '#4E5230', dot: '#272018', dotRing: '#FEFAE1', going: '#752C13', bucket: '#E8C998' },
    roles: [['ocean', 'soft white', '#FEFAE1'], ['land', 'terracotta (light)', '#C98A68'], ['city glow', 'moss / olive', '#4E5230'], ['city dots', 'soft black', '#272018'], ['going soon', 'terracotta', '#752C13'], ['bucket list', 'beige', '#E8C998']],
  },
];

export default function MapPalettes() {
  useTitle('Map colours');
  const only = new URLSearchParams(window.location.search).get('v');
  const list = only ? MAP_PALETTES.filter((m) => m.id === only) : MAP_PALETTES;
  return (
    <>
      <h1 className="page-title">Map colours</h1>
      {list.map((m) => (
        <section key={m.id} className="map-variant">
          <h2 className="section-title">{m.id}. {m.name}</h2>
          <GlowMap palette={m.palette} id={`map-${m.id}`} />
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
