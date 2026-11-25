import { feature } from 'topojson-client';
import { geoCentroid } from 'd3-geo';
import { geoUrl, cities, getCountryCategory } from '../data/places.js';

/*
  Derived map data (ported from the `final` direction). Everything here is computed from
  src/data/places.js, so the numbers never go stale.

    stats             { places, countries, continents }
    countryName(iso3) display name, e.g. 'ESP' -> 'Spain'
    continentOf(iso3) e.g. 'ESP' -> 'Europe'
    placesByCountry   [{ iso3, name, continent, places: city[] }], countries in first-seen order
    splitOverseas(features)  splits French Guiana off France (see below)
    DRAW_LAST         feature ids to paint after the rest (overlapped outlines)
    categoryOf(feature)      'visited' | 'goingSoon' | 'bucketList' | null, safe for split pieces
    loadWorld()       Promise<GeoJSON Feature[]> of countries, fetched once and shared
*/

// ISO_A3 -> [continent, display name] for every country with a pin.
const INFO = {
  USA: ['North America', 'United States'], CAN: ['North America', 'Canada'], MEX: ['North America', 'Mexico'],
  GTM: ['North America', 'Guatemala'], CRI: ['North America', 'Costa Rica'], JAM: ['North America', 'Jamaica'],
  DOM: ['North America', 'Dominican Republic'], ESP: ['Europe', 'Spain'], GBR: ['Europe', 'United Kingdom'],
  FRA: ['Europe', 'France'], CHE: ['Europe', 'Switzerland'], ITA: ['Europe', 'Italy'], NLD: ['Europe', 'Netherlands'],
  MAR: ['Africa', 'Morocco'],
};

export const countryName = (iso3) => INFO[iso3]?.[1] ?? iso3;
export const continentOf = (iso3) => INFO[iso3]?.[0] ?? null;

const visitedIso = [...new Set(cities.map((c) => c.countryCode[0]))];
export const stats = {
  places: cities.length,
  countries: visitedIso.length,
  continents: new Set(visitedIso.map(continentOf).filter(Boolean)).size,
};

export const placesByCountry = visitedIso.map((iso3) => ({
  iso3,
  name: countryName(iso3),
  continent: continentOf(iso3),
  places: cities.filter((c) => c.countryCode[0] === iso3),
}));

/*
  Country fills, sanity-checked against world-atlas 110m:
  - France's feature (id 250) also contains French Guiana, so the whole of France would light
    up "been there" on the coast of South America. The South American ring is split off into
    its own uncategorised shape.
  - Madagascar (450) is uncategorised, Greenland (304) is separate from Denmark, and the US
    keeps Alaska and Hawaii (same country).
  - Morocco's outline (504) runs down the Western Sahara coast to 21.4N, so a strip south of
    Morocco would light up "been there". It is cut at the border latitude (27.667N, see CUTS):
    the northern part keeps Morocco's category, the southern strip becomes an uncategorised
    shape. Western Sahara (732) is its own feature and is still painted last (DRAW_LAST).
*/
const OVERSEAS = {
  250: { id: 'GUF', name: 'French Guiana', isOverseas: (ring) => geoCentroid({ type: 'Polygon', coordinates: [ring] })[0] < -30 },
};

// Features cut along a parallel: the part south of `lat` becomes its own uncategorised shape.
const CUTS = {
  504: { id: 'MAR-S', name: 'Western Sahara coast (in Morocco’s outline)', lat: 27.667 },
};

// Sutherland-Hodgman clip of one ring against a parallel (keep north or south of lat).
function clipRing(ring, lat, north) {
  const inside = (p) => (north ? p[1] >= lat : p[1] <= lat);
  const out = [];
  for (let i = 0; i < ring.length - 1; i++) {
    const a = ring[i];
    const b = ring[i + 1];
    if (inside(a)) out.push(a);
    if (inside(a) !== inside(b)) out.push([a[0] + ((lat - a[1]) * (b[0] - a[0])) / (b[1] - a[1]), lat]);
  }
  if (out.length < 3) return null;
  out.push(out[0]);
  return out;
}
const clipPolys = (polys, lat, north) => polys
  .map((poly) => poly.map((ring) => clipRing(ring, lat, north)))
  .filter((poly) => poly[0])
  .map((poly) => poly.filter(Boolean));

export function splitOverseas(features) {
  const out = [];
  features.forEach((f) => {
    const cut = CUTS[f.id];
    if (cut && f.geometry) {
      const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
      const south = clipPolys(polys, cut.lat, false);
      out.push({ ...f, geometry: { type: 'MultiPolygon', coordinates: clipPolys(polys, cut.lat, true) } });
      if (south.length) out.push({ type: 'Feature', id: cut.id, properties: { name: cut.name }, geometry: { type: 'MultiPolygon', coordinates: south } });
      return;
    }
    const rule = OVERSEAS[f.id];
    if (!rule || f.geometry?.type !== 'MultiPolygon') {
      out.push(f);
      return;
    }
    const home = [];
    const away = [];
    f.geometry.coordinates.forEach((poly) => (rule.isOverseas(poly[0]) ? away : home).push(poly));
    out.push({ ...f, geometry: { type: 'MultiPolygon', coordinates: home } });
    if (away.length) {
      out.push({ type: 'Feature', id: rule.id, properties: { name: rule.name }, geometry: { type: 'MultiPolygon', coordinates: away } });
    }
  });
  return out;
}

// Features whose 110m outline is overlapped by a neighbour's, so they must be painted after it:
// Morocco's polygon (504) runs down to 21.4N and covers Western Sahara (732).
export const DRAW_LAST = new Set(['732']);

// Category for a (possibly split) feature. The split-off pieces have no category.
const PIECES = new Set([...Object.values(OVERSEAS), ...Object.values(CUTS)].map((r) => r.id));
export const categoryOf = (f) => (PIECES.has(f.id) ? null : getCountryCategory(f));

// The world, fetched once and shared by every map/globe on the page.
let worldPromise;
export function loadWorld() {
  if (!worldPromise) {
    worldPromise = fetch(geoUrl)
      .then((r) => {
        if (!r.ok) throw new Error(`world map: ${r.status}`);
        return r.json();
      })
      .then((topo) => splitOverseas(feature(topo, topo.objects.countries).features))
      .catch((err) => {
        worldPromise = undefined; // let a later visit retry
        throw err;
      });
  }
  return worldPromise;
}
