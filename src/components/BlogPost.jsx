import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { blogPosts } from '../data/blogPosts.jsx';

const BlogPost = () => {
  const { id } = useParams();
  const post = blogPosts.find((p) => p.id === id);

  if (!post) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen bg-portfolio-bg pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/blog" className="inline-flex items-center text-portfolio-muted hover:text-portfolio-gold transition-colors mb-10 group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          All posts
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-portfolio-text mb-3">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-portfolio-muted">{post.date}</span>
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs font-medium text-portfolio-gold bg-portfolio-gold/10 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          {post.lastEdited && (
            <p className="text-xs text-portfolio-muted italic mb-4">Last edited: {post.lastEdited}</p>
          )}
          <div className="w-full h-px bg-portfolio-border mb-8"></div>
          <div className="prose prose-invert max-w-none text-portfolio-muted leading-relaxed">
            <post.Content />
          </div>
        </motion.article>
      </div>
    </div>
  );
};

export default BlogPost;
