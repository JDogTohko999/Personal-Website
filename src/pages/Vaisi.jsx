import React from 'react';
import * as vaisi from '../data/vaisi.jsx';
import Photos from '../components/Photos.jsx';
import { thumb } from '../components/webImage.js';
import useTitle from '../lib/useTitle.js';

export default function Vaisi() {
  useTitle('VAISI');
  const sets = Object.values(vaisi.imageSets);
  return (
    <>
      <img className="vaisi-logo" src={vaisi.logo} alt="" width="56" height="56" />
      <h1 className="page-title">{vaisi.name}</h1>
      <p className="page-lede">
        {vaisi.role}, {vaisi.period}.{' '}
        <a href={vaisi.url} target="_blank" rel="noopener noreferrer">vaisi.org</a>
      </p>
      <h2 className="section-title">{vaisi.story.heading}</h2>
      {vaisi.story.paragraphs.map((p, i) => <p key={i}>{p}</p>)}

      {sets.map((set) => (
        <section key={set.altText}>
          <h3 className="section-title">{set.label}</h3>
          <Photos images={set.images} alt={set.altText} />
        </section>
      ))}

      <h3 className="section-title">{vaisi.textImage.label}</h3>
      <img className="vaisi-text" src={thumb(vaisi.textImage.src)} alt={vaisi.textImage.alt} loading="lazy" />
    </>
  );
}
