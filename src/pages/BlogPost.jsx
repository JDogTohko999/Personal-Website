import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts.jsx';
import { listedPosts } from './Blog.jsx';
import NotFound from './NotFound.jsx';
import { isoDate, longDate } from '../lib/dates.js';
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
      <header className="post-head">
        <p className="post-back"><Link to="/blog">all writing</Link></p>
        <h1 className="page-title">{post.title}</h1>
        <p className="quiet">
          <time dateTime={isoDate(post.date)}>{longDate(post.date)}</time>
          {post.lastEdited && <>, edited {longDate(post.lastEdited)}</>}
          {post.tags.length > 0 && <>. {post.tags.join(', ')}</>}
        </p>
      </header>

      {/* Post bodies use Tailwind classes + legacy portfolio-* colours (mapped to the sky tokens).
          Footnotes are plain #fnN / #refN anchors, so they work as normal in-page links. */}
      <div className="text-portfolio-muted">
        <post.Content />
      </div>

      {(newer || older) && (
        <>
          <hr />
          <nav className="post-foot" aria-label="More writing">
            <span>{older && <><em>earlier</em><Link to={`/blog/${older.id}`}>{older.title}</Link></>}</span>
            <span>{newer && <><em>later</em><Link to={`/blog/${newer.id}`}>{newer.title}</Link></>}</span>
          </nav>
        </>
      )}
    </article>
  );
}
