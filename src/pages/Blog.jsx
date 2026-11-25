import React from 'react';
import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts.jsx';
import { profile } from '../data/profile.jsx';
import Jasoning from '../components/Jasoning.jsx';
import { isoDate, shortDate } from '../lib/dates.js';
import useTitle from '../lib/useTitle.js';

// Unlisted posts still open at /blog/:id but are never listed.
export const listedPosts = blogPosts.filter((p) => !p.unlisted);

/* Writing. The home page keeps to one line, so the longer hello lives here, at the top of the
   writing, with Jason-ing beside it. Then the posts, newest first. */
export default function Blog() {
  useTitle('Writing');
  return (
    <>
      <h1 className="page-title">Writing</h1>
      <div className="about">
        <p>{profile.intro}</p>
        <Jasoning />
      </div>
      <h2 className="section-title">Posts</h2>
      <ul className="plain posts">
        {listedPosts.map((p) => (
          <li key={p.id}>
            <Link className="post-link" to={`/blog/${p.id}`}>{p.title}</Link>
            <p className="post-meta">
              <time dateTime={isoDate(p.date)}>{shortDate(p.date)}</time>
              {p.tags.length > 0 && <>, {p.tags.join(', ').toLowerCase()}</>}
            </p>
            {p.summary && <p className="post-summary">{p.summary}</p>}
          </li>
        ))}
      </ul>
    </>
  );
}
