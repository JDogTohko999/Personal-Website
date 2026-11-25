import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts.jsx';
import { listedPosts } from './Blog.jsx';
import NotFound from './NotFound.jsx';
import useTitle from '../lib/useTitle.js';

export default function BlogPost() {
  const { id } = useParams();
  const post = blogPosts.find((p) => p.id === id);
  useTitle(post ? post.title : 'Not found');
  if (!post) return <NotFound />;

  // Prev/next walk the listed posts only (newest first), so unlisted posts stay hidden.
  const i = listedPosts.indexOf(post);
  const newer = i > 0 ? listedPosts[i - 1] : null;
  const older = i >= 0 && i < listedPosts.length - 1 ? listedPosts[i + 1] : null;

  return (
    <article className="prose-body">
      <p className="small"><Link to="/blog">← All writing</Link></p>
      <h1>{post.title}</h1>
      <p className="muted small">
        {post.date}
        {post.lastEdited && ` · last edited ${post.lastEdited}`}
        {post.tags.length > 0 && ` · ${post.tags.join(', ')}`}
      </p>
      <hr />
      {/* Post bodies use Tailwind classes + legacy portfolio-* colours (mapped in themes.css).
          Footnotes are plain #fnN / #refN anchors, so they work as normal in-page links. */}
      <div className="text-portfolio-muted">
        <post.Content />
      </div>
      {(newer || older) && (
        <>
          <hr />
          <p className="small" style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
            <span>{older && <>← <Link to={`/blog/${older.id}`}>{older.title}</Link></>}</span>
            <span>{newer && <><Link to={`/blog/${newer.id}`}>{newer.title}</Link> →</>}</span>
          </p>
        </>
      )}
    </article>
  );
}
