/*
  Review variations (Jason, round 3): the reading surface ("look") and a 10% photo zoom.

  Set them with the URL (?look=haze, ?zoom=110) or the little switcher (components/LookSwitcher);
  the choice is remembered in localStorage and applied as <html data-look data-zoom>, so every
  page shares it. CSS for each look lives at the end of index.css.
*/
export const LOOKS = [
  { id: 'haze', label: 'haze', note: 'sky-grey, fine grain, photo faintly through' },
  { id: 'card', label: 'card', note: 'the original light sheet' },
  { id: 'scree', label: 'scree', note: 'warm stone with a paper-fibre texture (default)' },
  { id: 'dusk', label: 'dusk', note: 'dark teal-rock with film grain, light text' },
];
export const ZOOMS = [
  { id: '100', label: 'off' },
  { id: '110', label: '10%' },
];

// v4: scree became the default (Jason, Nov 2026); the new key drops any earlier stored choice.
const KEY_LOOK = 'jc-look-v4';
// v2: zoom is off by default (Jason's call); the new key drops any stored 10% choice.
const KEY_ZOOM = 'jc-zoom-v2';
const read = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const write = (k, v) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } };

export function getLook() { return document.documentElement.dataset.look || 'scree'; }
export function getZoom() { return document.documentElement.dataset.zoom || '100'; }

export function setLook(id) {
  if (!LOOKS.some((l) => l.id === id)) return;
  document.documentElement.dataset.look = id;
  write(KEY_LOOK, id);
}
export function setZoom(id) {
  if (!ZOOMS.some((z) => z.id === id)) return;
  document.documentElement.dataset.zoom = id;
  write(KEY_ZOOM, id);
}

// Run once at startup, before React renders: URL beats storage beats default.
export function initLook() {
  const q = new URLSearchParams(window.location.search);
  setLook(q.get('look') || read(KEY_LOOK) || 'scree');
  setZoom(q.get('zoom') || read(KEY_ZOOM) || '100');
}
