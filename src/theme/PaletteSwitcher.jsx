import React, { useRef } from 'react';
import { useTheme } from './useTheme.js';

/*
  Minimal reference palette switcher: a row of small round swatches, one per theme the
  ThemeProvider offers (the six palettes by default), followed by the current palette's name.

    <PaletteSwitcher />                          // all of the provider's themes
    <PaletteSwitcher ids={['japandi', 'walnut']} label="Colours" showName={false} />

  Accessibility: a radiogroup of radios with roving focus. Tab reaches the checked swatch;
  arrow keys (and Home/End) move and select, as in the WAI-ARIA radio-group pattern.
  Each swatch is named ("Clay palette") and shows its bg, with a text-coloured ring and an
  accent dot. Styling is inline and small; pass className to restyle (class names:
  .palette-switcher, .palette-swatch, .palette-name) or build your own from `palettes`.
*/
export default function PaletteSwitcher({ ids, label = 'Palette', showName = true, className = '', size = 18 }) {
  const { theme, setTheme, themes } = useTheme();
  const list = ids ? themes.filter((t) => ids.includes(t.id)) : themes;
  const refs = useRef([]);
  const current = list.find((t) => t.id === theme);
  const styled = !className;

  const move = (i) => {
    const n = (i + list.length) % list.length;
    setTheme(list[n].id);
    refs.current[n]?.focus();
  };
  const onKey = (e, i) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (step) move(i + step);
    else if (e.key === 'Home') move(0);
    else if (e.key === 'End') move(list.length - 1);
    else return;
    e.preventDefault();
  };

  return (
    <span
      className={`palette-switcher ${className}`.trim()}
      style={styled ? { display: 'inline-flex', alignItems: 'center', gap: 6 } : undefined}
    >
      <span role="radiogroup" aria-label={label} style={styled ? { display: 'inline-flex', gap: 6 } : undefined}>
        {list.map((t, i) => {
          const checked = t.id === theme;
          const [bg, text, accent] = t.swatch;
          return (
            <button
              key={t.id}
              ref={(el) => { refs.current[i] = el; }}
              type="button"
              role="radio"
              aria-checked={checked}
              aria-label={`${t.name} palette`}
              title={t.name}
              tabIndex={checked || (!current && i === 0) ? 0 : -1}
              className="palette-swatch"
              data-palette={t.id}
              onClick={() => setTheme(t.id)}
              onKeyDown={(e) => onKey(e, i)}
              style={styled ? {
                width: size, height: size, padding: 0, borderRadius: '50%', cursor: 'pointer',
                background: `radial-gradient(circle, ${accent} 0 26%, ${bg} 29%)`,
                border: `1.5px solid ${text}`,
                boxShadow: checked ? '0 0 0 2px var(--bg), 0 0 0 3.5px var(--text)' : 'none',
              } : { '--swatch-bg': bg, '--swatch-text': text, '--swatch-accent': accent }}
            />
          );
        })}
      </span>
      {showName && current && (
        <span className="palette-name" aria-hidden="true" style={styled ? { color: 'var(--muted)', fontSize: '0.85em' } : undefined}>
          {current.label}
        </span>
      )}
    </span>
  );
}
