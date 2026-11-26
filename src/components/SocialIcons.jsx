import React from 'react';
import { links } from '../data/profile.jsx';

/*
  A quiet row of small icons for Jason's accounts (he asked for symbols instead of the words
  "linkedin" and "substack"). Each is a 24x24 inline SVG drawn in currentColor, so it takes the
  link colour of wherever it sits (rust over the photo, clay-brown on the sheet).
*/
const ext = { target: '_blank', rel: 'noopener noreferrer' };

const ICONS = {
  linkedin: (
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  ),
  substack: (
    <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
  ),
  x: (
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932zM17.61 20.644h2.039L6.486 3.24H4.298z" />
  ),
  instagram: (
    <>
      <rect x="2.25" y="2.25" width="19.5" height="19.5" rx="5.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="12" cy="12" r="4.6" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="17.6" cy="6.4" r="1.45" />
    </>
  ),
  spotify: (
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  ),
};

export const ACCOUNTS = [
  { id: 'linkedin', label: 'LinkedIn', href: links.linkedin },
  { id: 'substack', label: 'Substack', href: links.substack },
  { id: 'x', label: 'X (Twitter)', href: 'https://x.com/JasonChin098' },
  { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/jasonchin999/' },
  { id: 'spotify', label: 'Spotify', href: 'https://open.spotify.com/user/jdog152nj?si=2e6a32bd30434630' },
];

export default function SocialIcons({ as: Tag = 'ul', className = '' }) {
  return (
    <Tag className={`socials ${className}`.trim()}>
      {ACCOUNTS.map((a) => (
        <li key={a.id}>
          <a href={a.href} {...ext} aria-label={`${a.label} (opens in a new tab)`} title={a.label}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true" focusable="false">
              {ICONS[a.id]}
            </svg>
          </a>
        </li>
      ))}
    </Tag>
  );
}
