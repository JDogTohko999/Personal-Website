import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { blogPosts } from '../data/blogPosts.jsx';

const Blog = () => {
  return (
    <div className="min-h-screen bg-portfolio-bg pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center text-portfolio-muted hover:text-portfolio-gold transition-colors mb-10 group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-portfolio-text mb-2">Blog</h1>
          <div className="w-16 h-1 bg-portfolio-gold rounded-full mb-12"></div>

          <div className="flex flex-col gap-6">
            {blogPosts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="group bg-portfolio-card border border-portfolio-border rounded-xl p-6 hover:border-portfolio-gold/30 hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-portfolio-card-text group-hover:text-portfolio-gold transition-colors mb-2">
                      {post.title}
                    </h2>
                    <p className="text-portfolio-muted text-sm mb-3">{post.summary}</p>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-xs font-medium text-portfolio-gold bg-portfolio-gold/10 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <span className="text-xs text-portfolio-muted">{post.date}</span>
                    <div className="mt-4">
                      <ArrowRight className="w-4 h-4 text-portfolio-muted group-hover:text-portfolio-gold group-hover:translate-x-1 transition-all ml-auto" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Blog;
