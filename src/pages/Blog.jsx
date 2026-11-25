import React from 'react';
import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts.jsx';
import { isoDate, shortDate } from '../lib/dates.js';
import useTitle from '../lib/useTitle.js';

// Unlisted posts still open at /blog/:id but are never listed.
export const listedPosts = blogPosts.filter((p) => !p.unlisted);

/* Writing: the posts, newest first. (The bio and Jason-ing moved to /me.) */
export default function Blog() {
  useTitle('Writing');
  return (
    <>
      <h1 className="page-title">Writing</h1>
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
