import React from 'react';
import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts.jsx';
import useTitle from '../lib/useTitle.js';

// Unlisted posts still open at /blog/:id but are never listed.
export const listedPosts = blogPosts.filter((p) => !p.unlisted);

export default function Blog() {
  useTitle('Writing');
  return (
    <>
      <h1>Writing</h1>
      <ul className="plain-list">
        {listedPosts.map((p) => (
          <li key={p.id} style={{ marginBottom: '1.25rem' }}>
            <Link to={`/blog/${p.id}`}>{p.title}</Link>
            <div className="muted small">
              {p.date}
              {p.tags.length > 0 && ` · ${p.tags.join(', ')}`}
            </div>
            <div>{p.summary}</div>
          </li>
        ))}
      </ul>
    </>
  );
}
