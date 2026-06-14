import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const nowData = {
  date: 'June 2026',
  bullets: [
    'Add your first bullet here.',
    'Add another bullet here.',
  ],
};

const NowModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="bg-portfolio-card border border-portfolio-border rounded-2xl shadow-2xl w-full max-w-md p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-portfolio-muted hover:text-portfolio-gold transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-portfolio-card-text mb-1">Now</h2>
            <p className="text-xs text-portfolio-muted mb-1">
              What I&apos;m focused on right now.{' '}
              <a
                href="https://nownownow.com/about"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-portfolio-gold"
              >
                What&apos;s this?
              </a>
            </p>
            <p className="text-sm text-portfolio-gold font-medium mb-4">{nowData.date}</p>
            <div className="w-12 h-0.5 bg-portfolio-gold rounded-full mb-4"></div>

            <ul className="list-disc list-outside pl-5 space-y-2 text-portfolio-muted text-sm leading-relaxed">
              {nowData.bullets.map((bullet, i) => (
                <li key={i}>{bullet}</li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NowModal;
