import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/*
  Theme (palette) choice: stored in localStorage, applied as <html data-theme="...">.

    <ThemeProvider defaultTheme="japandi" allowed={['japandi', 'walnut']}> ... </ThemeProvider>
    const { theme, setTheme, themes, cycle } = useTheme();

  - themes: [{ id, name, label, dark, swatch }] limited to `allowed`. Without `allowed` it is the
    six named `palettes`; the three extra palettes (japandi-night, earth, earth-dusk) are offered
    only when `allowed` names them.
  - cycle(): next theme in `themes`, wrapping. cycle(['japandi', 'walnut']) cycles a subset.
    A quiet "dark"/"light" text toggle is cycle() over two themes.
  - setTheme(id) and cycle() are also exported as plain functions, for code outside React (they
    talk to the mounted provider, or set the attribute directly if there is none).
  - `palettes` (below) carries everything a switcher needs: id, name, a short label and swatch
    colours [bg, text, accent]. See ./PaletteSwitcher.jsx for a minimal reference switcher.
  - index.html has a tiny inline script that applies the stored theme before React loads, so
    there is no flash of the wrong theme. Keep STORAGE_KEY and the id lists in sync with it.
  - Swatch colours must match themes.css; `node scripts/check-contrast.mjs` checks that.
*/

export const STORAGE_KEY = 'jc-theme';

// swatch: [--bg, --text, --accent], copied from themes.css.
export const THEMES = [
  { id: 'japandi', name: 'Japandi', label: 'japandi', dark: false, swatch: ['#f9ead5', '#522111', '#4e5230'] },
  { id: 'clay', name: 'Clay', label: 'clay', dark: false, swatch: ['#f6ebe3', '#3b2a26', '#745851'] },
  { id: 'moss', name: 'Moss', label: 'moss', dark: false, swatch: ['#ecebdc', '#2c2f20', '#575e45'] },
  { id: 'sand', name: 'Sand', label: 'sand', dark: false, swatch: ['#efe4d6', '#3a2c22', '#8b3f22'] },
  { id: 'herb', name: 'Herb', label: 'herb', dark: false, swatch: ['#d6d4c6', '#311209', '#522111'] },
  { id: 'walnut', name: 'Walnut', label: 'walnut', dark: true, swatch: ['#2b1b13', '#ecd3a8', '#dc8c5f'] },
  // Extra palettes from the first base (trail and hearth use these); only offered via `allowed`.
  { id: 'japandi-night', name: 'Japandi night', label: 'japandi night', dark: true, extra: true, swatch: ['#272018', '#f9ead5', '#e8c998'] },
  { id: 'earth', name: 'Earth', label: 'earth', dark: false, extra: true, swatch: ['#f6ebe3', '#3a2e2a', '#636a51'] },
  { id: 'earth-dusk', name: 'Earth dusk', label: 'earth dusk', dark: true, extra: true, swatch: ['#2a2923', '#f6ebe3', '#b59d7e'] },
];

/** The six named palettes, in switcher order. */
export const palettes = THEMES.filter((t) => !t.extra);

const ThemeContext = createContext(null);
let mounted = null; // the provider's { setTheme, cycle }, for the plain exported functions

const read = () => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};
const store = (id) => {
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    /* private mode: the choice just won't persist */
  }
};

export function ThemeProvider({ children, defaultTheme = 'japandi', allowed }) {
  const themes = useMemo(
    () => (allowed ? THEMES.filter((t) => allowed.includes(t.id)) : palettes),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allowed && allowed.join()],
  );
  const valid = useCallback((id) => themes.some((t) => t.id === id), [themes]);

  const [theme, setThemeState] = useState(() => {
    const stored = read();
    if (stored && valid(stored)) return stored;
    const attr = typeof document !== 'undefined' && document.documentElement.dataset.theme;
    return attr && valid(attr) ? attr : defaultTheme;
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    store(theme);
  }, [theme]);

  const pick = useCallback((id) => { if (valid(id)) setThemeState(id); }, [valid]);
  // `ids` is optional; onClick={cycle} passes an event, which is ignored.
  const next = useCallback((ids) => {
    const list = Array.isArray(ids) ? ids.filter(valid) : themes.map((t) => t.id);
    if (!list.length) return;
    setThemeState((cur) => list[(list.indexOf(cur) + 1) % list.length]);
  }, [themes, valid]);

  useEffect(() => {
    const api = { setTheme: pick, cycle: next };
    mounted = api;
    return () => { if (mounted === api) mounted = null; };
  }, [pick, next]);

  const value = useMemo(() => ({ theme, setTheme: pick, themes, cycle: next }), [theme, pick, themes, next]);
  return createElement(ThemeContext.Provider, { value }, children);
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}

/** Set the palette from anywhere. Goes through the mounted provider (and its `allowed`). */
export function setTheme(id) {
  if (mounted) { mounted.setTheme(id); return; }
  if (!THEMES.some((t) => t.id === id) || typeof document === 'undefined') return;
  document.documentElement.dataset.theme = id;
  store(id);
}

/** Move to the next palette (of `ids`, or of the provider's themes / the six palettes). */
export function cycle(ids) {
  if (mounted) { mounted.cycle(ids); return; }
  if (typeof document === 'undefined') return;
  const list = Array.isArray(ids) ? ids : palettes.map((t) => t.id);
  setTheme(list[(list.indexOf(document.documentElement.dataset.theme) + 1) % list.length]);
}
