import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/*
  Theme choice: stored in localStorage, applied as <html data-theme="...">.

    <ThemeProvider defaultTheme="japandi" allowed={['japandi', 'japandi-night']}> ... </ThemeProvider>
    const { theme, setTheme, themes, cycle } = useTheme();

  - themes: [{ id, label, dark }] limited to `allowed` (a direction can ship just two).
  - cycle(): next theme in `themes`, wrapping. A quiet "dark"/"light" text toggle is cycle()
    over two themes.
  - index.html has a tiny inline script that applies the stored theme before React loads, so
    there is no flash of the wrong theme. Keep STORAGE_KEY and the id list in sync with it.
*/

export const STORAGE_KEY = 'jc-theme';

export const THEMES = [
  { id: 'japandi', label: 'Japandi', dark: false },
  { id: 'japandi-night', label: 'Japandi night', dark: true },
  { id: 'earth', label: 'Earth', dark: false },
  { id: 'earth-dusk', label: 'Earth dusk', dark: true },
];

const ThemeContext = createContext(null);

const read = () => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

export function ThemeProvider({ children, defaultTheme = 'japandi', allowed }) {
  const themes = useMemo(
    () => (allowed ? THEMES.filter((t) => allowed.includes(t.id)) : THEMES),
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
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* private mode: the choice just won't persist */
    }
  }, [theme]);

  const setTheme = useCallback((id) => { if (valid(id)) setThemeState(id); }, [valid]);
  const cycle = useCallback(() => {
    setThemeState((cur) => {
      const i = themes.findIndex((t) => t.id === cur);
      return themes[(i + 1) % themes.length].id;
    });
  }, [themes]);

  const value = useMemo(() => ({ theme, setTheme, themes, cycle }), [theme, setTheme, themes, cycle]);
  return createElement(ThemeContext.Provider, { value }, children);
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
