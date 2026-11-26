import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { links } from '../data/profile.jsx';

/*
  The tiny lowercase links, the same words on every page, in Jason's order:
  about me, now, involvements, writing, then (after a small gap) meet. The account icons sit
  directly under the name instead (SocialIcons, in Home and the inner header).
  (Places and VAISI still have pages at /places and /vaisi; they're just not in the nav.)
*/
export const PAGES = [
  ['/about', 'about me'],
  ['/now', 'now'],
  ['/involvements', 'involvements'],
  ['/blog', 'writing'],
];
const MEET = [links.savvycal, 'meet', 'Meet: book a time with Jason on SavvyCal (opens in a new tab)'];

export default function SkyNav({ className = '' }) {
  const { pathname } = useLocation();
  const isCurrent = (to) =>
    to === '/involvements'
      ? pathname === '/involvements' || pathname === '/experience'
      : to === '/about'
        ? pathname === '/about' || pathname === '/me'
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
        <li><a href={MEET[0]} target="_blank" rel="noopener noreferrer" aria-label={MEET[2]}>{MEET[1]}</a></li>
      </ul>
    </nav>
  );
}
