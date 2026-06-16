import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, X, ChevronLeft, ChevronRight } from 'lucide-react';

const imageSets = {
  panel: {
    altText: 'Moderated Panel with Prof. Korinek, Danks, and Evans',
    label: (
      <>
        Moderated Panel with Prof.{' '}
        <a href="https://www.korinek.com/" target="_blank" rel="noopener noreferrer" className="text-portfolio-gold hover:underline" onClick={(e) => e.stopPropagation()}>Korinek</a>,{' '}
        <a href="https://www.daviddanks.org/" target="_blank" rel="noopener noreferrer" className="text-portfolio-gold hover:underline" onClick={(e) => e.stopPropagation()}>Danks</a>, and{' '}
        <a href="https://www.cs.virginia.edu/~evans/" target="_blank" rel="noopener noreferrer" className="text-portfolio-gold hover:underline" onClick={(e) => e.stopPropagation()}>Evans</a>
      </>
    ),
    cover: '/panel_audience.JPG',
    images: [
      '/panel_audience.JPG',
      '/panel_chat.JPG',
      '/panel_further_right.JPG',
      '/panel_right.JPG',
    ],
  },
  fellowship: {
    altText: 'AI Governance Fellowship',
    label: 'AI Governance Fellowship',
    cover: '/fellows_on_steps.JPG',
    images: [
      '/fellows_on_steps.JPG',
      '/fellows_standing.JPG',
    ],
  },
};

const bullets = [
  'Coordinated and led weekly meetings, speaker events, competitions, and advertising.',
  "Designed and facilitated VAISI's inaugural 12-week AI Governance Fellowship.",
  'Maintained relations with relevant professors, professionals, and student groups.',
  'Fellowship and organizer recruiting pipeline design and execution.',
  (
    <>
      Growth strategy resulting in organizing team <strong className="text-portfolio-text">2 → 12</strong> and membership <strong className="text-portfolio-text">0 → 185+</strong>.
    </>
  ),
  (
    <>
      Co-developed club{' '}
      <a
        href="https://vaisi.org/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-portfolio-gold underline hover:text-portfolio-text transition-colors"
      >
        website
      </a>
      .
    </>
  ),
  'Wrote constitution — recently accepted as an official CIO.',
];

const Vaisi = () => {
  const [activeSet, setActiveSet] = useState(null);
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    if (!activeSet) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') setActiveSet(null);
      if (e.key === 'ArrowRight') setImgIndex((i) => (i + 1) % imageSets[activeSet].images.length);
      if (e.key === 'ArrowLeft') setImgIndex((i) => (i - 1 + imageSets[activeSet].images.length) % imageSets[activeSet].images.length);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeSet]);

  const openSet = (key) => {
    setImgIndex(0);
    setActiveSet(key);
  };

  return (
    <section id="vaisi" className="py-20 bg-portfolio-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-portfolio-text mb-4">VAISI</h2>
          <div className="w-20 h-1 bg-portfolio-gold mx-auto rounded-full"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.25 }}
          className="bg-gradient-to-r from-portfolio-green to-portfolio-bg border border-portfolio-gold/30 rounded-2xl p-8 md:p-10 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-portfolio-gold/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 md:flex items-start justify-between gap-8">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-portfolio-text mb-1">Virginia AI Security Initiative</h3>
              <p className="text-portfolio-gold font-medium mb-5">Co-founder & President [Aug '25 - May '26]</p>

              <ul className="list-disc list-outside pl-5 space-y-2 text-portfolio-muted leading-relaxed mb-6">
                {bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center gap-6">
                <a
                  href="/membership_over_time.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-portfolio-muted hover:text-portfolio-gold transition-colors group text-sm"
                >
                  GroupMe membership plots (fastest growing club at UVA??)
                  <ArrowUpRight className="ml-1 w-3 h-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
              </div>
            </div>

            <div className="mt-10 md:mt-0 md:w-80 flex-shrink-0 text-center">
              <h4 className="text-lg font-bold text-portfolio-text mb-4">A few highlights:</h4>
              <div className="flex gap-4 mb-5">
                {Object.entries(imageSets).map(([key, set]) => (
                  <button
                    key={key}
                    onClick={() => openSet(key)}
                    className="group flex-1 flex flex-col items-center focus:outline-none"
                  >
                    <div className="w-full aspect-square rounded-lg overflow-hidden border border-portfolio-gold/30 bg-portfolio-bg/50 group-hover:border-portfolio-gold transition-all shadow-md group-hover:shadow-gold/20">
                      <img
                        src={set.cover}
                        alt={set.altText}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    </div>
                    <span className="mt-2 text-xs text-portfolio-muted group-hover:text-portfolio-gold transition-colors text-center">
                      {set.label}
                    </span>
                  </button>
                ))}
              </div>
              <h4 className="text-base font-bold text-portfolio-text mb-2">VAISI lives on!</h4>
              <p className="text-sm text-portfolio-muted leading-relaxed">
                Through some combination of luck and skill, I managed to meet and secure{' '}
                <a href="https://www.sethlifland.com/" target="_blank" rel="noopener noreferrer" className="text-portfolio-gold hover:underline">Seth</a>,{' '}
                <a href="https://www.linkedin.com/in/nia-m-a50406379/" target="_blank" rel="noopener noreferrer" className="text-portfolio-gold hover:underline">Nia</a>,{' '}
                <a href="https://shubhrangshu.com/" target="_blank" rel="noopener noreferrer" className="text-portfolio-gold hover:underline">Shubs</a>, and a{' '}
                <a href="https://vaisi.org/about" target="_blank" rel="noopener noreferrer" className="text-portfolio-gold hover:underline">handful</a>{' '}
                of incredible students who are now organizing VAISI. I intend to be an active advisor for the near future.
              </p>
            </div>

          </div>
        </motion.div>

        <AnimatePresence>
          {activeSet && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
              onClick={() => setActiveSet(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative max-w-4xl max-h-[90vh] w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setActiveSet(null)}
                  className="absolute -top-10 right-0 text-white/80 hover:text-portfolio-gold transition-colors"
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>
                <img
                  src={imageSets[activeSet].images[imgIndex]}
                  alt={imageSets[activeSet].altText}
                  className="w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                />
                {imageSets[activeSet].images.length > 1 && (
                  <>
                    <button
                      onClick={() => setImgIndex((i) => (i - 1 + imageSets[activeSet].images.length) % imageSets[activeSet].images.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-portfolio-gold/80 text-white p-2 rounded-full transition-colors"
                      aria-label="Previous"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => setImgIndex((i) => (i + 1) % imageSets[activeSet].images.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-portfolio-gold/80 text-white p-2 rounded-full transition-colors"
                      aria-label="Next"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                      {imgIndex + 1} / {imageSets[activeSet].images.length}
                    </div>
                  </>
                )}
                <p className="text-white text-center mt-3 font-medium">{imageSets[activeSet].label}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Vaisi;
