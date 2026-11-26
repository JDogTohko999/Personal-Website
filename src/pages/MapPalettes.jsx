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
  // Round 2 (A-G "none that great"): wider Japandi range: sage, ochre, dusty blue, indigo,
  // charcoal, and one where visited countries get their own fill.
  {
    id: 'H', name: 'Linen, terracotta & dusty blue',
    palette: { ocean: '#F1EBDD', land: '#DDD3BE', border: '#F1EBDD', glow: '#B4572F', dot: '#272018', dotRing: '#F1EBDD', going: '#6B7040', bucket: '#8FA0AE' },
    roles: [['ocean', 'linen', '#F1EBDD'], ['land', 'stone', '#DDD3BE'], ['city glow', 'terracotta', '#B4572F'], ['city dots', 'soft black', '#272018'], ['going soon', 'olive', '#6B7040'], ['bucket list', 'dusty blue', '#8FA0AE']],
  },
  {
    id: 'I', name: 'Sage sea',
    palette: { ocean: '#D5DECF', land: '#FBF6E6', border: '#D5DECF', glow: '#A8492A', dot: '#3A2418', dotRing: '#FBF6E6', going: '#6B7040', bucket: '#D9B77A' },
    roles: [['ocean', 'pale sage', '#D5DECF'], ['land', 'rice paper', '#FBF6E6'], ['city glow', 'rust', '#A8492A'], ['city dots', 'walnut', '#3A2418'], ['going soon', 'olive', '#6B7040'], ['bucket list', 'ochre beige', '#D9B77A']],
  },
  {
    id: 'J', name: 'Been-there countries filled',
    palette: { ocean: '#FEFAE1', land: '#D8D2C2', visited: '#EBCB9C', border: '#FEFAE1', glow: '#B4572F', dot: '#272018', dotRing: '#FEFAE1', going: '#6B7040', bucket: '#9AA9B5' },
    roles: [['ocean', 'soft white', '#FEFAE1'], ['land', 'stone', '#D8D2C2'], ['been there', 'beige', '#EBCB9C'], ['city glow', 'terracotta', '#B4572F'], ['city dots', 'soft black', '#272018'], ['going soon', 'olive', '#6B7040'], ['bucket list', 'dusty blue', '#9AA9B5']],
  },
  {
    id: 'K', name: 'Charcoal & ochre',
    palette: { ocean: '#23201B', land: '#3A352D', border: '#23201B', glow: '#D9A441', dot: '#FEFAE1', dotRing: '#23201B', going: '#8FA585', bucket: '#A8492A' },
    roles: [['ocean', 'charcoal', '#23201B'], ['land', 'smoke', '#3A352D'], ['city glow', 'ochre', '#D9A441'], ['city dots', 'soft white', '#FEFAE1'], ['going soon', 'sage', '#8FA585'], ['bucket list', 'rust', '#A8492A']],
  },
  {
    id: 'L', name: 'Sumi ink wash',
    palette: { ocean: '#F6F2E9', land: '#CFC8B8', border: '#F6F2E9', glow: '#272018', dot: '#B4572F', dotRing: '#F6F2E9', going: '#6B7040', bucket: '#A9B6BE' },
    roles: [['ocean', 'washi', '#F6F2E9'], ['land', 'clay grey', '#CFC8B8'], ['city glow', 'ink', '#272018'], ['city dots', 'terracotta', '#B4572F'], ['going soon', 'olive', '#6B7040'], ['bucket list', 'mist blue', '#A9B6BE']],
  },
  {
    id: 'M', name: 'Indigo sea & rust',
    palette: { ocean: '#2F3B4A', land: '#E9E1CC', border: '#2F3B4A', glow: '#B4572F', dot: '#272018', dotRing: '#E9E1CC', going: '#7A7D4A', bucket: '#C9A04A' },
    roles: [['ocean', 'muted indigo', '#2F3B4A'], ['land', 'oat', '#E9E1CC'], ['city glow', 'rust', '#B4572F'], ['city dots', 'soft black', '#272018'], ['going soon', 'olive', '#7A7D4A'], ['bucket list', 'ochre', '#C9A04A']],
  },
  // Round 3: earth colours, as Jason asked: blue ocean, earthy green land, ochre glow, light
  // earthy purple bucket list. Going soon is gone (Armenia is on the bucket list now).
  {
    id: 'N', name: 'Earth: soft',
    palette: { ocean: '#9DB4C0', land: '#A9B28C', border: '#D9DCC6', glow: '#D39B35', dot: '#2B2416', dotRing: '#F3EDD9', going: '#B9A6BC', bucket: '#B9A6BC' },
    roles: [['ocean', 'dusty blue', '#9DB4C0'], ['land', 'sage green', '#A9B28C'], ['city glow', 'ochre', '#D39B35'], ['city dots', 'soft black', '#2B2416'], ['bucket list', 'heather', '#B9A6BC']],
  },
  {
    id: 'O', name: 'Earth: deep',
    palette: { ocean: '#56788E', land: '#76845A', border: '#9AA67F', glow: '#E2A73F', dot: '#2B2416', dotRing: '#F3EDD9', going: '#A893AC', bucket: '#A893AC' },
    roles: [['ocean', 'slate blue', '#56788E'], ['land', 'fern green', '#76845A'], ['city glow', 'ochre', '#E2A73F'], ['city dots', 'soft black', '#2B2416'], ['bucket list', 'dusty mauve', '#A893AC']],
  },
  {
    id: 'P', name: 'Earth: pale atlas',
    palette: { ocean: '#BCCFD8', land: '#C5CBA6', border: '#EEF0E2', glow: '#C78A2C', dot: '#3A2418', dotRing: '#F6F1E1', going: '#CDBFD0', bucket: '#CDBFD0' },
    roles: [['ocean', 'pale sky blue', '#BCCFD8'], ['land', 'pale olive green', '#C5CBA6'], ['city glow', 'deep ochre', '#C78A2C'], ['city dots', 'walnut', '#3A2418'], ['bucket list', 'lavender grey', '#CDBFD0']],
  },
  {
    id: 'Q', name: 'Earth: olive & steel',
    palette: { ocean: '#6E8FA3', land: '#8D9762', border: '#B3B98F', glow: '#E0AD48', dot: '#2B2416', dotRing: '#F3EDD9', going: '#B29DB5', bucket: '#B29DB5' },
    roles: [['ocean', 'steel blue', '#6E8FA3'], ['land', 'olive green', '#8D9762'], ['city glow', 'golden ochre', '#E0AD48'], ['city dots', 'soft black', '#2B2416'], ['bucket list', 'dusty lilac', '#B29DB5']],
  },
  // Round 4: salvaging A. Beige sea, natural land, moss bucket list; the glow tried in a light
  // green, a light blue and a light purple.
  ...[
    ['A1', 'green', 'light sage green', '#C4E0A8'],
    ['A2', 'blue', 'light sky blue', '#B4D8EC'],
    ['A3', 'purple', 'light lavender', '#D6C0EC'],
  ].map(([id, short, name, glow]) => ({
    id, name: `Beige sea, natural land, ${short} glow`,
    palette: { ocean: '#E8C998', land: '#C29665', border: '#E8C998', glow, dot: '#522111', dotRing: '#E8C998', going: '#4E5230', bucket: '#4E5230' },
    roles: [['ocean', 'beige', '#E8C998'], ['land', 'natural', '#C29665'], ['city glow', name, glow], ['city dots', 'walnut', '#522111'], ['bucket list', 'moss', '#4E5230']],
  })),
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
