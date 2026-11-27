import React, { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { experiences, linkedinUrl } from '../data/experience.jsx';
import { achievements } from '../data/achievements.jsx';
import * as vaisi from '../data/vaisi.jsx';
import Photos from '../components/Photos.jsx';
import WorkRow, { ExperienceRow } from '../components/WorkRow.jsx';
import { thumb } from '../components/webImage.js';
import { span, years } from '../lib/dates.js';
import useTitle from '../lib/useTitle.js';

/*
  Involvements (ported from Jason's tuned trail version, src/trail/WorkList.jsx + Work.jsx):
  the highlighted roles, then "other things I've done" (the debate, Eagle Scout, and every
  role that isn't a highlight), already unfolded on this page. The VAISI row opens to the site
  itself (a homepage screenshot linking to vaisi.org), two photos, and "my VAISI highlights".
*/
const ext = { target: '_blank', rel: 'noopener noreferrer' };
const VAISI_ID = 1;
const VAISI_PHOTOS = [vaisi.imageSets.panel.images[0], vaisi.imageSets.fellowship.images[0]];
const host = (url) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

function VaisiRow({ e }) {
  return (
    <WorkRow date={span(e.period)} title={e.role} org={e.company} orgUrl={e.orgUrl}>
      <a href={e.link} {...ext} className="vaisi-site" aria-label="vaisi.org (opens in a new tab)">
        <img src="/vaisi/vaisi_homepage.jpg" alt="The VAISI website's homepage" loading="lazy" />
      </a>
      <p className="work-meta"><a href={e.link} {...ext}>{host(e.link)}</a></p>
      <Link to="/vaisi" className="vaisi-strip" aria-label="My VAISI highlights">
        {VAISI_PHOTOS.map((src) => <img key={src} src={thumb(src)} alt="" loading="lazy" />)}
      </Link>
      <p className="work-meta"><Link to="/vaisi">my VAISI highlights</Link></p>
    </WorkRow>
  );
}

const Role = ({ e }) => (e.id === VAISI_ID ? <VaisiRow e={e} /> : <ExperienceRow e={e} />);

// Start of a period ("Nov 2025 – Feb 2026", "Sep 2018 - Jun 2022") as a sortable month number.
const MON = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const startOf = (period) => {
  const m = /([A-Za-z]{3})[a-z]*\.?\s+(\d{4})/.exec(String(period || ''));
  return m ? +m[2] * 12 + MON.indexOf(m[1].toLowerCase()) : 0;
};

function OtherThings({ id }) {
  const debate = achievements.find((a) => a.photos);
  const scout = achievements.find((a) => a !== debate);
  // Everything here, newest first by when it started (Jason: "chronological").
  const rows = [
    {
      start: startOf(debate.date),
      key: 'debate',
      el: (
        <WorkRow key="debate" date={years(debate.date)} title={debate.title.replace(' — ', ', ')} org={debate.organization} orgUrl={debate.orgUrl}>
          {debate.description.split(/\n+/).map((para, i) => <p key={i}>{para.trim()}</p>)}
          <Photos images={debate.photos} alt="Martin Skeptical Debate" />
          <p className="work-meta">
            {debate.links.map((l, i) => (
              <React.Fragment key={l.href}>
                {i > 0 && ' · '}
                <a href={l.href} {...ext}>{l.label}</a>
              </React.Fragment>
            ))}
          </p>
        </WorkRow>
      ),
    },
    {
      start: startOf(scout.date),
      key: 'scout',
      el: (
        <WorkRow key="scout" date={scout.date} title={scout.title} org={scout.organization}>
          <p><em>{scout.palms}</em></p>
          <p>{scout.description}</p>
        </WorkRow>
      ),
    },
    ...experiences.filter((e) => !e.highlight).map((e) => ({ start: startOf(e.period), key: e.id, el: <Role key={e.id} e={e} /> })),
  ].sort((a, b) => b.start - a.start);
  return (
    <ul className="plain work" id={id}>
      {rows.map((r) => r.el)}
    </ul>
  );
}

export default function Experience() {
  useTitle('Involvements');
  const [open, setOpen] = useState(true);
  const othersId = useId();
  return (
    <>
      <h1 className="page-title">Involvements</h1>
      <p className="page-lede">
        My <a href={linkedinUrl} {...ext}>LinkedIn</a> with a little zhuzh
      </p>
      <ul className="plain work">
        {experiences.filter((e) => e.highlight).map((e) => <Role key={e.id} e={e} />)}
      </ul>
      <p className="work-foot">
        <button type="button" className="word" aria-expanded={open} aria-controls={othersId} onClick={() => setOpen((v) => !v)}>
          {open ? 'hide other things' : "other things I've done"}
        </button>
        <span className="muted"> · </span>
        <a href={linkedinUrl} {...ext}>LinkedIn</a>
      </p>
      {open && (
        <section>
          <h2 className="section-title">Other things I&rsquo;ve done</h2>
          <OtherThings id={othersId} />
        </section>
      )}
    </>
  );
}

