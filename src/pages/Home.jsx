import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { profile, links } from '../data/profile.jsx';
import { blogPosts } from '../data/blogPosts.jsx';
import { nowEntry } from '../data/nowEntries.jsx';
import { JASONINGS, OPENERS } from '../data/jasonings.js';
import { achievements } from '../data/achievements.jsx';
import useTitle from '../lib/useTitle.js';

// Reference home: every piece of home-page data, plainly. Builders restyle or replace this.
const listedPosts = blogPosts.filter((p) => !p.unlisted);

function Jasoning() {
  // Start on one of the openers, then step through the whole list.
  const [i, setI] = useState(() => {
    const pick = OPENERS[Math.floor(Math.random() * OPENERS.length)];
    return Math.max(0, JASONINGS.findIndex((j) => j.label === pick));
  });
  const item = JASONINGS[i];
  const step = (d) => setI((n) => (n + d + JASONINGS.length) % JASONINGS.length);
  const box = { width: 280, height: 280, objectFit: 'cover', display: 'block' };
  return (
    <figure style={{ margin: '1.5rem 0' }}>
      {item.type === 'video' ? (
        <video src={item.src} muted loop autoPlay playsInline style={box} />
      ) : (
        <img src={item.src} alt={`Jason ${item.label}`} width="280" height="280" style={box} />
      )}
      <figcaption aria-live="polite">
        Jason, {item.label}{' '}
        <span className="small">
          <button type="button" className="text-button" onClick={() => step(-1)} aria-label="Previous photo">prev</button>
          {' / '}
          <button type="button" className="text-button" onClick={() => step(1)} aria-label="Next photo">next</button>
        </span>
      </figcaption>
    </figure>
  );
}

export default function Home() {
  useTitle('');
  const debate = achievements.find((a) => a.photos);
  const others = achievements.filter((a) => a !== debate);
  return (
    <>
      <h1>{profile.name}</h1>
      <p className="muted">{profile.oneLiner}</p>
      <p>{profile.intro}</p>
      <p className="small">
        <a href={links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        {' · '}
        <a href={links.savvycal} target="_blank" rel="noopener noreferrer">Schedule a meeting</a>
        {' · '}
        <a href={links.substack} target="_blank" rel="noopener noreferrer">Substack</a>
        {' · '}
        <a href={links.github} target="_blank" rel="noopener noreferrer">GitHub</a>
        {' · '}
        <a href={links.admonymous} target="_blank" rel="noopener noreferrer">Anonymous feedback</a>
      </p>
      <p className="small">
        <Link to="/now">Now</Link>: updated {nowEntry.date}
      </p>

      <Jasoning />

      <h2>Writing</h2>
      <ul className="plain-list">
        {listedPosts.slice(0, 3).map((p) => (
          <li key={p.id}>
            <Link to={`/blog/${p.id}`}>{p.title}</Link> <span className="muted small">· {p.date}</span>
          </li>
        ))}
      </ul>
      <p className="small"><Link to="/blog">All writing</Link></p>

      <h2>Achievements</h2>
      {debate && (
        <div>
          <h3>{debate.title}</h3>
          <p className="muted small">{debate.organization} · {debate.date}</p>
          <p style={{ whiteSpace: 'pre-line' }}>{debate.description}</p>
          <div className="thumbs">
            {debate.photos.map((src) => <img key={src} src={src} alt="" loading="lazy" />)}
          </div>
          <p className="small">
            {debate.links.map((l, i) => (
              <React.Fragment key={l.href}>
                {i > 0 && ' · '}
                <a href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
              </React.Fragment>
            ))}
          </p>
        </div>
      )}
      {others.map((a) => (
        <div key={a.id}>
          <h3>{a.title}</h3>
          <p className="muted small">{a.organization}</p>
          <p>{a.description}</p>
        </div>
      ))}
    </>
  );
}
