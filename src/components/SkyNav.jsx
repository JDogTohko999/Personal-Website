import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { links } from '../data/profile.jsx';

/*
  The tiny lowercase links, the same words on every page, in Jason's order:
  now, involvements, writing, then (after a small gap) linkedin, substack and meet.
  (Places and VAISI still have pages at /places and /vaisi; they're just not in the nav.)
*/
export const PAGES = [
  ['/now', 'now'],
  ['/involvements', 'involvements'],
  ['/blog', 'writing'],
];
const OUT = [
  [links.linkedin, 'linkedin', 'LinkedIn (opens in a new tab)'],
  [links.substack, 'substack', 'Substack (opens in a new tab)'],
  [links.savvycal, 'meet', 'Meet: book a time with Jason on SavvyCal (opens in a new tab)'],
];

export default function SkyNav({ className = '' }) {
  const { pathname } = useLocation();
  const isCurrent = (to) =>
    to === '/involvements'
      ? pathname === '/involvements' || pathname === '/experience'
      : pathname === to || pathname.startsWith(`${to}/`);
  return (
    <nav className={`sky-nav ${className}`} aria-label="Main">
      <ul className="sky-nav-pages">
        {PAGES.map(([to, label]) => (
          <li key={to}>
            <NavLink to={to} aria-current={isCurrent(to) ? 'page' : undefined} className={() => (isCurrent(to) ? 'is-here' : undefined)}>
              {label}
            </NavLink>
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
