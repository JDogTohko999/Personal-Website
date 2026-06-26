import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { nowEntry } from '../data/nowEntries.jsx';

const Now = () => {
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
          <h1 className="text-4xl font-bold text-portfolio-text mb-2">Now</h1>
          <p className="text-sm text-portfolio-muted mb-2">
            This is a{' '}
            <a
              href="https://nownownow.com/about"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-portfolio-gold"
            >
              now
            </a>
            {' '}page. You should make one too!
          </p>
          <div className="w-16 h-1 bg-portfolio-gold rounded-full mb-12"></div>

          <motion.article
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-portfolio-card border border-portfolio-border rounded-xl p-6"
          >
            <h2 className="text-portfolio-gold font-medium mb-4">{nowEntry.date}</h2>
            <div className="text-portfolio-muted leading-relaxed space-y-3">
              {nowEntry.content}
            </div>
          </motion.article>
        </motion.div>
      </div>
    </div>
  );
};

export default Now;
