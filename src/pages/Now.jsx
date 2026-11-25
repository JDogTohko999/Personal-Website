import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { nowEntry } from '../data/nowEntries.jsx';
import useTitle from '../lib/useTitle.js';

/* /now and /now/bonus. The bonus logic is kept from the old Now.jsx: on /now/bonus, open
   <details id="now-bonus"> and scroll to it. The current nowEntry has no bonus section; if one
   comes back, give nowEntry a `bonus` (JSX) field, or put a <details id="now-bonus"> inside
   `content`, and this page wires it up. */
export default function Now() {
  useTitle('Now');
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== '/now/bonus') return;
    const bonus = document.getElementById('now-bonus');
    if (!bonus) return;
    bonus.open = true;
    bonus.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [pathname]);

  return (
    <article className="prose-body">
      <h1>Now</h1>
      <p className="muted small">
        Updated {nowEntry.date}. This is a{' '}
        <a href="https://nownownow.com/about" target="_blank" rel="noopener noreferrer">now</a> page.
        You should make one too!
      </p>
      <div className="text-portfolio-muted">{nowEntry.content}</div>
      {nowEntry.bonus && (
        <details id="now-bonus" style={{ marginTop: '2rem' }}>
          <summary>Bonus</summary>
          {nowEntry.bonus}
        </details>
      )}
    </article>
  );
}
