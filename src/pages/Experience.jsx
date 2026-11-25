import React, { useState } from 'react';
import { experiences, linkedinUrl } from '../data/experience.jsx';
import useTitle from '../lib/useTitle.js';

// Highlights (with `short`) first; "Show everything" reveals the rest and full descriptions.
const KIND_LABEL = { work: 'Work', education: 'Education', volunteer: 'Volunteering' };

export default function Experience() {
  useTitle('Experience');
  const [all, setAll] = useState(false);
  const shown = all ? experiences : experiences.filter((e) => e.highlight);
  const kinds = [...new Set(shown.map((e) => e.kind))];
  return (
    <>
      <h1>Experience</h1>
      <p>
        <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">Full history on LinkedIn</a>
      </p>
      {kinds.map((kind) => (
        <section key={kind}>
          <h2>{KIND_LABEL[kind] || kind}</h2>
          <ul className="plain-list">
            {shown.filter((e) => e.kind === kind).map((e) => (
              <li key={e.id} style={{ marginBottom: '1rem' }}>
                <div>
                  <strong>{e.role}</strong>,{' '}
                  {e.link ? <a href={e.link} target="_blank" rel="noopener noreferrer">{e.company}</a> : e.company}
                </div>
                <div className="muted small">{e.period}</div>
                <div>{all ? e.description : e.short}</div>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <button type="button" className="text-button" aria-expanded={all} onClick={() => setAll((v) => !v)}>
        {all ? 'Show highlights only' : `Show everything (${experiences.length})`}
      </button>
    </>
  );
}
