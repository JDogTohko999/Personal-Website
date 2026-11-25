import React, { useState } from 'react';
import { experiences, linkedinUrl } from '../data/experience.jsx';
import { achievements } from '../data/achievements.jsx';
import Photos from '../components/Photos.jsx';
import WorkRow, { ExperienceRow } from '../components/WorkRow.jsx';
import { years } from '../lib/dates.js';
import useTitle from '../lib/useTitle.js';

// Work: the highlights, condensed to one line each; a role opens to the full description, and the
// word at the bottom brings in everything else. Debate and Eagle Scout close the page.
const KIND_LABEL = { work: 'Work', education: 'Education', volunteer: 'Volunteering' };

export default function Experience() {
  useTitle('Involvements');
  const [all, setAll] = useState(false);
  const shown = all ? experiences : experiences.filter((e) => e.highlight);
  const kinds = [...new Set(shown.map((e) => e.kind))];
  const debate = achievements.find((a) => a.photos);
  const others = achievements.filter((a) => a !== debate);

  return (
    <>
      <h1 className="page-title">Involvements</h1>
      <p className="page-lede">
        The short version. The full history is on{' '}
        <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn</a>.
      </p>

      {kinds.map((kind) => (
        <section key={kind}>
          <h2 className="section-title">{KIND_LABEL[kind] || kind}</h2>
          <ul className="plain work">
            {shown.filter((e) => e.kind === kind).map((e) => <ExperienceRow key={e.id} e={e} />)}
          </ul>
        </section>
      ))}

      <p style={{ marginTop: '1.25rem' }}>
        <button type="button" className="word" aria-expanded={all} onClick={() => setAll((v) => !v)}>
          {all ? 'Show the highlights only' : `Show all ${experiences.length}`}
        </button>
      </p>

      <section>
        <h2 className="section-title">Also</h2>
        <ul className="plain work">
          {debate && (
            <WorkRow date={years(debate.date)} title={debate.title} org={debate.organization} defaultOpen>
              <p style={{ whiteSpace: 'pre-line' }}>{debate.description}</p>
              <Photos images={debate.photos} alt="Martin Skeptical Debate" />
              <p className="work-meta">
                {debate.links.map((l, i) => (
                  <React.Fragment key={l.href}>
                    {i > 0 && ', '}
                    <a href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
                  </React.Fragment>
                ))}
              </p>
            </WorkRow>
          )}
          {others.map((a) => (
            <WorkRow key={a.id} date={a.date ? years(a.date) : ''} title={a.title} org={a.organization} summary={a.description} />
          ))}
        </ul>
      </section>
    </>
  );
}
