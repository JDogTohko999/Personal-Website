import React, { useEffect } from 'react';
import useTitle from '../lib/useTitle.js';

/*
  Review page (dev server only): the same bit of About me set in a few fonts, at the sheet's
  new 18px size, so Jason can pick one. ?f=<id> shows one. Fonts come from Google Fonts.
*/
export const FONTS = [
  { id: 'newsreader', name: 'Newsreader (current)', family: "'Newsreader'", q: 'Newsreader:ital,opsz,wght@0,6..72,300..600;1,6..72,300..600', note: 'warm newspaper serif' },
  { id: 'ebgaramond', name: 'EB Garamond', family: "'EB Garamond'", q: 'EB+Garamond:ital,wght@0,400..600;1,400..600', note: 'classic, bookish' },
  { id: 'lora', name: 'Lora', family: "'Lora'", q: 'Lora:ital,wght@0,400..600;1,400..600', note: 'soft, sturdy, very readable' },
  { id: 'sourceserif', name: 'Source Serif 4', family: "'Source Serif 4'", q: 'Source+Serif+4:ital,opsz,wght@0,8..60,300..600;1,8..60,300..600', note: 'clean, modern serif' },
  { id: 'spectral', name: 'Spectral', family: "'Spectral'", q: 'Spectral:ital,wght@0,300;0,400;0,500;1,400', note: 'light, refined, made for screens' },
  { id: 'fraunces', name: 'Fraunces', family: "'Fraunces'", q: 'Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..600', note: 'soft old-style, a bit of character' },
  { id: 'cormorant', name: 'Cormorant Garamond', family: "'Cormorant Garamond'", q: 'Cormorant+Garamond:ital,wght@0,400..600;1,400..600', note: 'elegant, high contrast, small' },
  { id: 'inter', name: 'Inter (sans)', family: "'Inter'", q: 'Inter:ital,opsz,wght@0,14..32,300..600;1,14..32,300..600', note: 'neutral sans-serif, for contrast' },
];

export default function FontChoices() {
  useTitle('Font choices');
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?${FONTS.map((f) => `family=${f.q}`).join('&')}&display=swap`;
    document.head.appendChild(link);
    return () => link.remove();
  }, []);
  const only = new URLSearchParams(window.location.search).get('f');
  const list = only ? FONTS.filter((f) => f.id === only) : FONTS;
  return (
    <>
      <h1 className="page-title">Font choices</h1>
      {list.map((f) => (
        <section key={f.id} className="font-sample" style={{ fontFamily: `${f.family}, Georgia, serif` }}>
          <p className="font-sample-name">{f.name} <span>{f.note}</span></p>
          <h2 className="font-sample-title">About me</h2>
          <p>Hi, welcome to my corner of the internet! Here&rsquo;s a little about me:</p>
          <p>
            I&rsquo;m a recent grad trying to do my part in making AI go well. Currently, I&rsquo;m working on{' '}
            <a href="#x" onClick={(e) => e.preventDefault()}>AI safety field-building</a> in Boston. I was quite bullish on{' '}
            <a href="#x" onClick={(e) => e.preventDefault()}>strengthening</a> the early-career talent ecosystem.
          </p>
          <p className="font-sample-meta"><em>Sep 2026 &ndash; present &middot; Cambridge Boston Alignment Initiative</em></p>
        </section>
      ))}
    </>
  );
}
