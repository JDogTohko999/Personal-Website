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
    keeps Alaska and Hawaii (same country). Western Sahara (732) is its own feature but
    Morocco's outline overlaps it, hence DRAW_LAST below.
*/
const OVERSEAS = {
  250: { id: 'GUF', name: 'French Guiana', isOverseas: (ring) => geoCentroid({ type: 'Polygon', coordinates: [ring] })[0] < -30 },
};

export function splitOverseas(features) {
  const out = [];
  features.forEach((f) => {
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
export const categoryOf = (f) => (Object.values(OVERSEAS).some((r) => r.id === f.id) ? null : getCountryCategory(f));

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
