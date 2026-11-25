import React, { useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { links } from '../data/profile.jsx';
import { useTheme } from '../theme/useTheme.js';

// Reference shell: a plain nav of words, the page, and a quiet theme switch.
const NAV = [
  ['/', 'Home'],
  ['/blog', 'Writing'],
  ['/now', 'Now'],
  ['/vaisi', 'VAISI'],
  ['/map', 'Map'],
  ['/experience', 'Experience'],
];

function ThemeSwitch() {
  const { theme, setTheme, themes } = useTheme();
  return (
    <span className="small muted">
      theme:{' '}
      {themes.map((t, i) => (
        <React.Fragment key={t.id}>
          {i > 0 && ' · '}
          <button
            type="button"
            className="text-button"
            aria-pressed={t.id === theme}
            style={t.id === theme ? { color: 'var(--text)', textDecoration: 'none' } : undefined}
            onClick={() => setTheme(t.id)}
          >
            {t.label.toLowerCase()}
          </button>
        </React.Fragment>
      ))}
    </span>
  );
}

export default function Layout() {
  const { pathname, hash } = useLocation();
  // New page: start at the top (unless the URL points at an anchor, e.g. a footnote).
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <div className="site">
      <nav className="site-nav" aria-label="Main">
        {NAV.map(([to, label]) => (
          <NavLink key={to} to={to} end={to === '/'}>
            {label}
          </NavLink>
        ))}
        <a href={links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href={links.savvycal} target="_blank" rel="noopener noreferrer">Schedule a meeting</a>
        <span className="spacer" />
        <ThemeSwitch />
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
