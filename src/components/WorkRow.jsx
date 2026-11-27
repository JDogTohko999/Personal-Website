import React, { useId, useState } from 'react';
import { span, years } from '../lib/dates.js';

/*
  One line of the work history (borrowed from hearth, which grafted it from trail): a quiet
  date column, then the role with the organisation muted beneath it. The role is a real button
  that opens the entry in place.

    <WorkRow date="2026 – now" title="Co-director" org="AI Safety Seeding Initiative"
             summary="one line, always visible (optional)">
      what opens: the full description, links, photos
    </WorkRow>

  With no children there is nothing to open, and the role is plain text. defaultOpen starts
  the row open (the debate entry, whose photos shouldn't hide).
*/
export default function WorkRow({ date, title, org, orgUrl, summary, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const canOpen = !!children;
  return (
    <li className="work-row" data-open={open || undefined}>
      <span className="work-date">{date}</span>
      <div className="work-main">
        <h3 className="work-role">
          {canOpen ? (
            <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((v) => !v)}>
              {title}
              <span className="work-mark" aria-hidden="true">{open ? '–' : '+'}</span>
            </button>
          ) : title}
        </h3>
        <p className="work-org">{orgUrl ? <a href={orgUrl} target="_blank" rel="noopener noreferrer">{org}</a> : org}</p>
        {summary && !open && <p className="work-text">{summary}</p>}
        {canOpen && (
          <div id={id} className="work-more" hidden={!open}>
            {children}
          </div>
        )}
      </div>
    </li>
  );
}

const host = (url) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '').split('/')[0];

// "Sep 2026 – present", with "present" in italic (the one mark of what is current).
function When({ text }) {
  const [a, b] = text.split(' – ');
  if (!b || !/present|now/i.test(b)) return text;
  return <>{a} – <em>{b.toLowerCase()}</em></>;
}

/* An entry from src/data/experience.jsx as a row.
   condensed (home): the role and the organisation only; it opens to the one-line version.
   Otherwise (Work page): the one-line version shows, and the row opens to the full description.
   Either way the organisation's own link is inside what opens, so a closed row has no underline
   at all. An entry with nothing more to say and no link doesn't open. */
export function ExperienceRow({ e, condensed = false }) {
  const more = e.description && e.description !== e.short ? e.description : null;
  const period = span(e.period);
  const opens = condensed || more || e.link;
  return (
    <WorkRow
      date={<When text={condensed ? years(e.period) : period} />}
      title={e.role}
      org={e.company}
      orgUrl={e.orgUrl}
      summary={condensed ? undefined : e.short}
    >
      {opens && (
        <>
          <p>{condensed ? e.short : more || e.short}</p>
          {(condensed || e.link) && (
            <p className="work-meta">
              {condensed && <>{period.replace('Present', 'present')}{e.link && ', '}</>}
              {e.link && <a href={e.link} target="_blank" rel="noopener noreferrer">{host(e.link)}</a>}
            </p>
          )}
        </>
      )}
    </WorkRow>
  );
}
