import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { links } from '../data/profile.jsx';
import { nowEntry } from '../data/nowEntries.jsx';
import { isoDate, longDate, shortDate } from '../lib/dates.js';

/*
  The tiny lowercase links, the same words on every page:
  writing, now, places, work, vaisi, then (after a small gap) linkedin and meet.
  On the home page "now" carries its date, quietly: "now  nov 15".
*/
export const PAGES = [
  ['/blog', 'writing'],
  ['/now', 'now'],
  ['/places', 'places'],
  ['/experience', 'work'],
  ['/vaisi', 'vaisi'],
];
const OUT = [
  [links.linkedin, 'linkedin', 'LinkedIn (opens in a new tab)'],
  [links.savvycal, 'meet', 'Meet: book a time with Jason on SavvyCal (opens in a new tab)'],
];

export default function SkyNav({ withDate = false, className = '' }) {
  const { pathname } = useLocation();
  const nowDate = shortDate(nowEntry.date).toLowerCase();
  const isCurrent = (to) =>
    to === '/places' ? pathname === '/places' || pathname === '/map' : pathname === to || pathname.startsWith(`${to}/`);
  return (
    <nav className={`sky-nav ${className}`} aria-label="Main">
      <ul className="sky-nav-pages">
        {PAGES.map(([to, label]) => (
          <li key={to}>
            <NavLink to={to} aria-current={isCurrent(to) ? 'page' : undefined} className={() => (isCurrent(to) ? 'is-here' : undefined)}>
              {label}
            </NavLink>
            {withDate && to === '/now' && (
              <time className="sky-nav-when" dateTime={isoDate(nowEntry.date)} title={`Updated ${longDate(nowEntry.date)}`}>
                {nowDate}
              </time>
            )}
          </li>
        ))}
      </ul>
      <ul className="sky-nav-out">
        {OUT.map(([href, label, aria]) => (
          <li key={label}>
            <a href={href} target="_blank" rel="noopener noreferrer" aria-label={aria}>{label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
