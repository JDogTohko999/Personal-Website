import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';

const VAISI_URL = 'https://www.vaisi.org/';
// The live site is laid out at this desktop size, then scaled down to fit the
// card, so the preview looks like the real homepage instead of its mobile view.
const PREVIEW_WIDTH = 1440;
const PREVIEW_HEIGHT = 810;

// Live, scaled-down view of vaisi.org. The frame ignores the mouse so the whole
// preview acts as one link to the real site. The saved screenshot sits behind
// it and shows while the live page loads.
const SitePreview = () => {
  const boxRef = useRef(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return undefined;
    const fit = () => setScale(box.clientWidth / PREVIEW_WIDTH);
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  return (
    <a
      href={VAISI_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Visit vaisi.org"
      className="group block rounded-lg overflow-hidden border-2 border-portfolio-gold/40 hover:border-portfolio-gold shadow-xl hover:shadow-gold/20 transition-all"
    >
      <div className="flex items-center gap-1.5 px-3 py-2 bg-portfolio-card border-b border-portfolio-gold/30">
        <span className="w-2.5 h-2.5 rounded-full bg-portfolio-gold/50" />
        <span className="w-2.5 h-2.5 rounded-full bg-portfolio-gold/30" />
        <span className="w-2.5 h-2.5 rounded-full bg-portfolio-gold/20" />
        <span className="ml-2 text-xs text-portfolio-muted group-hover:text-portfolio-gold transition-colors">vaisi.org</span>
        <ArrowUpRight className="ml-auto w-3.5 h-3.5 text-portfolio-muted group-hover:text-portfolio-gold transition-colors" />
      </div>
      <div
        ref={boxRef}
        className="relative w-full overflow-hidden bg-white"
        style={{
          aspectRatio: `${PREVIEW_WIDTH} / ${PREVIEW_HEIGHT}`,
          backgroundImage: 'url(/vaisi_homepage.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'top',
        }}
      >
        {scale > 0 && (
          <iframe
            src={VAISI_URL}
            title="Live preview of vaisi.org"
            loading="lazy"
            tabIndex={-1}
            aria-hidden="true"
            className="absolute top-0 left-0 border-0 pointer-events-none origin-top-left"
            style={{
              width: PREVIEW_WIDTH,
              height: PREVIEW_HEIGHT,
              transform: `scale(${scale})`,
            }}
          />
        )}
      </div>
    </a>
  );
};

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

// "The text that started it all": a small card that pops up just above the
// link, rather than a full-screen viewer. Closes on a second click, a click
// anywhere else, or Escape.
const TextPopover = () => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <span ref={wrapRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`inline-flex items-center transition-colors group text-sm ${
          open ? 'text-portfolio-gold' : 'text-portfolio-muted hover:text-portfolio-gold'
        }`}
      >
        The text that started it all
        <ArrowUpRight className="ml-1 w-3 h-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.span
            initial={{ opacity: 0, x: '-50%', y: 6, scale: 0.97 }}
            animate={{ opacity: 1, x: '-50%', y: 0, scale: 1 }}
            exit={{ opacity: 0, x: '-50%', y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 z-50 mb-3 block w-56 sm:w-64 origin-bottom"
          >
            <span className="block rounded-lg border-2 border-portfolio-gold/60 bg-portfolio-card p-1.5 shadow-2xl">
              <img
                src="/vaisi_jason_andrew_text.jpg"
                alt="The text message that started VAISI"
                className="block w-full max-h-[45vh] object-contain rounded"
              />
            </span>
            {/* Little pointer down to the link. */}
            <span className="absolute left-1/2 top-full -translate-x-1/2 border-8 border-transparent border-t-portfolio-gold/60" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
};

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

          <div className="relative z-10">
            <div className="flex flex-col items-center gap-5 mb-10 text-center">
              <a
                href="https://vaisi.org/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="VAISI website"
                className="flex-shrink-0 w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-white border-4 border-portfolio-gold/60 hover:border-portfolio-gold shadow-lg hover:shadow-gold/20 hover:scale-105 transition-all"
              >
                {/* Wide wordmark: contained so the full name fits across the circle. */}
                <img
                  src="/new_vaisi_logo.jpg"
                  alt="VAISI logo"
                  className="w-full h-full object-contain scale-110"
                />
              </a>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-portfolio-text mb-1">Virginia AI Security Initiative</h3>
                <p className="text-portfolio-gold font-medium">Co-founder & President [Aug '25 - May '26]</p>
              </div>
            </div>

            {/* Preview and highlights share one row; the preview sets the height
                and the highlight cards stretch to match it. */}
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-stretch mb-10">
              <SitePreview />

              <div className="grid grid-cols-2 gap-4 sm:gap-6 h-64 md:h-auto">
                {Object.entries(imageSets).map(([key, set]) => (
                  <div key={key} className="relative h-full">
                    {/* Offset cards peeking out from behind say "there's more than one photo here". */}
                    <div className="absolute inset-0 rounded-lg border border-portfolio-gold/30 bg-portfolio-card/60 translate-x-2 -translate-y-2 rotate-2" />
                    <div className="absolute inset-0 rounded-lg border border-portfolio-gold/40 bg-portfolio-card/80 translate-x-1 -translate-y-1 rotate-1" />
                    <button
                      type="button"
                      onClick={() => openSet(key)}
                      aria-label={`View ${set.images.length} photos: ${set.altText}`}
                      className="group absolute inset-0 rounded-lg overflow-hidden border-2 border-portfolio-gold/40 hover:border-portfolio-gold shadow-lg hover:shadow-gold/20 transition-all focus:outline-none focus-visible:border-portfolio-gold"
                    >
                      <img
                        src={set.cover}
                        alt={set.altText}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                      <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                        <Camera className="w-3 h-3" />
                        {set.images.length} photos
                      </span>
                      <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="rounded-full bg-portfolio-gold px-3 py-1.5 text-xs font-bold text-portfolio-bg shadow-lg">
                          Click to view
                        </span>
                      </span>
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-2 pt-8 pb-2 text-xs font-medium text-white text-center leading-snug">
                        {set.label}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="max-w-3xl mx-auto text-center">
              <h4 className="text-lg font-bold text-portfolio-text mb-3">VAISI lives on!</h4>
              <p className="text-portfolio-muted leading-relaxed mb-3">
                Through some combination of luck and skill, I managed to find{' '}
                <a href="https://www.sethlifland.com/" target="_blank" rel="noopener noreferrer" className="text-portfolio-gold hover:underline">Seth</a>,{' '}
                <a href="https://www.linkedin.com/in/nia-m-a50406379/" target="_blank" rel="noopener noreferrer" className="text-portfolio-gold hover:underline">Nia</a>,{' '}
                <a href="https://shubhrangshu.com/" target="_blank" rel="noopener noreferrer" className="text-portfolio-gold hover:underline">Shubs</a>, and a{' '}
                <a href="https://vaisi.org/about" target="_blank" rel="noopener noreferrer" className="text-portfolio-gold hover:underline">handful</a>{' '}
                of incredible students who are now organizing VAISI.
              </p>
              <p className="text-portfolio-muted leading-relaxed mb-6">
                I intend to be an active advisor for the foreseeable future.
              </p>
              <TextPopover />
              {/* Hidden for now; the plots page is still in public/.
              <a
                href="/membership_over_time.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-portfolio-muted hover:text-portfolio-gold transition-colors group text-sm"
              >
                GroupMe membership plots (fastest growing club at UVA??)
                <ArrowUpRight className="ml-1 w-3 h-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
              */}
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
