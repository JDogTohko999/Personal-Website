import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const nowData = {
  date: '2:17am, 6/14/26',
};

const NowContent = () => (
  <div className="text-portfolio-muted text-sm leading-relaxed space-y-3">
    <p>
      I got into NYC during the game and was on the subway frantically reloading my phone as the Knicks won. City went crazy. I rooted for both the Knicks and Spurs (I like Wemby a lot) throughout the playoffs, but ended up rooting for Spurs... rough. Glad Knicks won tho, Spurs will be great for years to come.
    </p>
    <p>
      Anyways...
    </p>
    <p>
      I'll be in NYC for 2 weeks canvassing for Alex Bores and seeing friends and family.
    </p>
    <p>
      I'm also working on my{' '}
      <a
        href="https://docs.google.com/document/d/1H4GSOgFZQwTMONCAVTI3E6abM2rv0tP-ovegX-7POBU/edit?usp=sharing"
        target="_blank"
        rel="noopener noreferrer"
        className="text-portfolio-gold hover:underline"
      >
        Bootloader Initiative
      </a>
      , helping prep{' '}
      <a
        href="https://vaisi.org/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-portfolio-gold hover:underline"
      >
        VAISI
      </a>
      {' '}for the fall sem, and writing a VAISI retrospective.
    </p>
    <p>
      To read, I brought with me <em>Nature and Selected Essays</em> and <em>Siddhartha</em>.
    </p>
    <p>
      Recently I've been thinking about the work of Ernest Becker and Sheldon Solomon. I want to continue thinking through the validity and implications of death anxiety and TMT.
    </p>
    <p>
      I tentatively plan to be in Charlottesville for the month of July.
    </p>
    <p>
      I also hope to massively change my website in the coming weeks. I want to make it something I'm proud of... rn I'm not a huge fan of it.
    </p>
  </div>
);

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
            className="bg-portfolio-card border border-portfolio-border rounded-2xl shadow-2xl w-full max-w-lg p-6 relative max-h-[85vh] overflow-y-auto"
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
              {' '}
              <a
                href="https://nownownow.com/about"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-portfolio-gold"
              >
                What&apos;s a now page?
              </a>
            </p>
            <p className="text-sm text-portfolio-gold font-medium mb-4">{nowData.date}</p>
            <div className="w-12 h-0.5 bg-portfolio-gold rounded-full mb-4"></div>

            <NowContent />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NowModal;
