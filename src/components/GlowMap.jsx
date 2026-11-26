import React, { useEffect, useMemo, useState } from 'react';
import { geoEqualEarth, geoPath } from 'd3-geo';
import { cities } from '../data/places.js';
import { categoryOf, loadWorld } from '../lib/geo.js';

/*
  The live site's map idea (src/components/WorldMap.jsx on main), redrawn without react-simple-maps:
  a flat Equal Earth world where every visited country keeps the plain land colour and each city
  you've been to glows softly *inside its own country* (a radial gradient clipped to the
  country's outline). Going-soon and bucket-list countries get their own fills, and every city
  has a small dot on top.

  palette = { ocean, land, border, glow, dot, dotRing, going, bucket, visited? }
  (visited, if set, fills the countries he has been to; otherwise they keep the land colour)
*/
const W = 960;
const H = 470;
const GLOW_R = 34;

const numericOf = (c) => c.countryCode[1] || c.countryCode[0];

export default function GlowMap({ palette, id = 'glowmap', className = '', onPick }) {
  const [world, setWorld] = useState(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let live = true;
    loadWorld().then((w) => { if (live) setWorld(w); }).catch(() => { if (live) setFailed(true); });
    return () => { live = false; };
  }, []);

  const { path, project, shapes } = useMemo(() => {
    if (!world) return {};
    const land = world.filter((f) => f.id !== '010'); // no Antarctica: more room for the rest
    const projection = geoEqualEarth().fitExtent([[12, 10], [W - 12, H - 10]], { type: 'FeatureCollection', features: land });
    const p = geoPath(projection);
    return {
      path: p,
      project: projection,
      shapes: land.map((f, k) => ({ key: `${f.id}-${k}`, f, d: p(f), cat: categoryOf(f) })),
    };
  }, [world]);

  const fillFor = (cat) => (
    cat === 'goingSoon' ? palette.going
      : cat === 'bucketList' ? palette.bucket
        : cat === 'visited' && palette.visited ? palette.visited
          : palette.land
  );

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={`glowmap ${className}`.trim()}
      role="img"
      aria-label="World map: the countries and cities Jason has been to glow; bucket list countries are shaded."
      style={{ background: palette.ocean, display: 'block', width: '100%', height: 'auto' }}
    >
      {failed && <text x={W / 2} y={H / 2} textAnchor="middle" fill={palette.dot} fontSize="16">The map couldn&rsquo;t load.</text>}
      {shapes && (
        <>
          <defs>
            <radialGradient id={`${id}-glow`}>
              <stop offset="0%" stopColor={palette.glow} stopOpacity="0.9" />
              <stop offset="30%" stopColor={palette.glow} stopOpacity="0.6" />
              <stop offset="62%" stopColor={palette.glow} stopOpacity="0.22" />
              <stop offset="100%" stopColor={palette.glow} stopOpacity="0" />
            </radialGradient>
            {shapes.filter((s) => s.cat === 'visited').map((s) => (
              <clipPath key={s.key} id={`${id}-clip-${s.key}`}><path d={s.d} /></clipPath>
            ))}
          </defs>
          <g stroke={palette.border} strokeWidth="0.6" strokeLinejoin="round">
            {shapes.map((s) => <path key={s.key} d={s.d} fill={fillFor(s.cat)} />)}
          </g>
          {/* The glow: each city's halo, clipped to its own country. */}
          {shapes.filter((s) => s.cat === 'visited').map((s) => {
            const here = cities.filter((c) => numericOf(c) === s.f.id || c.countryCode[0] === s.f.properties?.ISO_A3);
            return (
              <g key={`g-${s.key}`} clipPath={`url(#${id}-clip-${s.key})`}>
                {here.map((c) => {
                  const [x, y] = project(c.coordinates);
                  return <circle key={c.id} cx={x} cy={y} r={GLOW_R} fill={`url(#${id}-glow)`} />;
                })}
              </g>
            );
          })}
          {/* City dots on top. */}
          {cities.map((c) => {
            const [x, y] = project(c.coordinates);
            return (
              <g key={c.id} style={{ cursor: onPick ? 'pointer' : 'default' }} onClick={onPick ? () => onPick(c) : undefined}>
                <title>{c.name}</title>
                <circle cx={x} cy={y} r="3.4" fill={palette.dot} stroke={palette.dotRing} strokeWidth="1.1" />
              </g>
            );
          })}
        </>
      )}
    </svg>
  );
}
