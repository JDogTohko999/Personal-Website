import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Inline text link that opens one or more images in a lightbox overlay.
const ImageLink = ({ children, images }) => {
  const list = Array.isArray(images) ? images : [images];
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + list.length) % list.length);
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % list.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, list.length]);

  const prev = (e) => { e.stopPropagation(); setIndex((i) => (i - 1 + list.length) % list.length); };
  const next = (e) => { e.stopPropagation(); setIndex((i) => (i + 1) % list.length); };

  return (
    <>
      <button
        type="button"
        onClick={() => { setIndex(0); setOpen(true); }}
        className="text-portfolio-gold hover:underline cursor-pointer align-baseline"
      >
        {children}
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setOpen(false)}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setOpen(false)}
              className="absolute -top-9 right-0 text-white/70 hover:text-white text-2xl leading-none"
              aria-label="Close"
            >
              ✕
            </button>
            <img
              src={list[index]}
              alt=""
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
            {list.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-9 h-9 flex items-center justify-center text-xl"
                  aria-label="Previous"
                >
                  ‹
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-9 h-9 flex items-center justify-center text-xl"
                  aria-label="Next"
                >
                  ›
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                  {list.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setIndex(i); }}
                      className={`w-2 h-2 rounded-full transition-colors ${i === index ? 'bg-portfolio-gold' : 'bg-white/40'}`}
                      aria-label={`Go to image ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

// Bonus 1 is its own component so the YouTube iframe mounts only once the
// <details> is opened. Loading it while hidden inside a collapsed <details>
// makes the player initialize at zero size and serve a low-res (blurry)
// stream; deferring the mount lets it load sharp at full size.
const VideoBonus = () => {
  const [loaded, setLoaded] = useState(false);

  return (
    <details
      className="group mt-6 pt-4 border-t border-portfolio-border"
      onToggle={(e) => { if (e.currentTarget.open) setLoaded(true); }}
    >
      <summary className="cursor-pointer list-none text-sm font-medium text-portfolio-muted hover:text-portfolio-gold transition-colors flex items-center gap-1">
        <span className="inline-block transition-transform group-open:rotate-90">▸</span>
        Bonus 1
      </summary>
      <p className="mt-3 text-sm text-portfolio-muted">
        from past now (7/23/26)
      </p>
      <p className="mt-2">
        Just found my new favorite 10s yt clip. First time I've actually laughed out loud from a video in a while.
      </p>
      <div className="my-4 w-full max-w-[420px] mx-auto">
        <div className="relative w-full overflow-hidden rounded-lg border border-portfolio-border" style={{ paddingTop: '56.25%' }}>
          {loaded && (
            <iframe
              className="absolute inset-0 h-full w-full"
              src="https://www.youtube.com/embed/4K9RDZg4y7o?si=DuCWe_mBPR7MEFQl&start=3355"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          )}
        </div>
        <p className="mt-2 text-center text-sm italic text-portfolio-muted">somehow perfectly at 55:55 🤯</p>
      </div>
    </details>
  );
};

export const nowEntry = {
  date: '1:03am, 10/7/2026',
  content: (
    <>
      <p>
        Currently in the MAIA office about to head home. In the coming days I'll fly down to SC and drive back up to Boston, stopping at UVA's YAR along the way. Excited to see friends and family!
      </p>
      <p className="pt-2 font-semibold text-portfolio-text">Top of mind:</p>
      <ul className="list-disc list-outside pl-5 space-y-2">
        <li>
          Between the many hours I spend on MAIA and the fact that I'm still living in Airbnb + suitcase mode, I've inadvertently been pushing off figuring out what work-life balance means for someone who cares about impact.
        </li>
        <li>
          I worry that my exploit:explore ratio is too exploity, and that I'm getting lulled into a local min. Fortunately, I think being around Roman will mitigate this risk to some extent.
        </li>
        <li>
          What am I going to do with my car in Cambridge... should I even bother bringing it? My bike too?
        </li>
      </ul>
      <p className="pt-2 font-semibold text-portfolio-text">Backburner</p>
      <ul className="list-disc list-outside pl-5 space-y-2">
        <li>
          I should probably try and meet more ppl outside of MIT. I've also considered writing a date me doc, but idk if I'm that ratty.
        </li>
        <li>
          Looking for{' '}
          <a
            href="https://www.henrikkarlsson.xyz/p/looking-for-alice"
            target="_blank"
            rel="noopener noreferrer"
            className="text-portfolio-gold hover:underline"
          >
            Alice
          </a>
          <Link
            to="/blog/alice"
            className="text-portfolio-gold hover:underline"
          >
            .
          </Link>
        </li>
        <li>
          Writing. I really have to make my first substack post. Gotta{' '}
          <a
            href="https://usefulfictions.substack.com/p/tying-yourself-to-the-mast"
            target="_blank"
            rel="noopener noreferrer"
            className="text-portfolio-gold hover:underline"
          >
            tie myself to the mast
          </a>
          . Shoutout{' '}
          <a
            href="https://romansattic.substack.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-portfolio-gold hover:underline"
          >
            Roman
          </a>
          {' '}and{' '}
          <a
            href="https://elianadu.substack.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-portfolio-gold hover:underline"
          >
            Eliana
          </a>
          {' '}for their blogs. Let me{' '}
          <Link
            to="/blog/passed"
            className="text-portfolio-gold hover:underline"
          >
            post
          </Link>
          {' '}something to my blog rn so I can start overcoming the fear of publishing.
        </li>
      </ul>

      <VideoBonus />

      <details className="group mt-4 pt-4 border-t border-portfolio-border">
        <summary className="cursor-pointer list-none text-sm font-medium text-portfolio-muted hover:text-portfolio-gold transition-colors flex items-center gap-1">
          <span className="inline-block transition-transform group-open:rotate-90">▸</span>
          Bonus 2
        </summary>
        <p className="mt-3 text-sm text-portfolio-muted">
          From previous now: <span className="italic">2:31pm, 8/24/2026</span>
        </p>
        <p className="mt-3 italic text-portfolio-muted">Shoutout the Boomsticks</p>
        <div className="mt-3 w-full max-w-[640px] mx-auto flex flex-col sm:flex-row gap-3">
          <img
            src="/now/Boomsticks_AFC.jpg"
            alt="The Boomsticks"
            className="w-full sm:w-1/2 h-auto rounded-lg border border-portfolio-border object-cover"
          />
          <img
            src="/now/boomsticks_beach_outside_grad.JPG"
            alt="The Boomsticks at the beach"
            className="w-full sm:w-1/2 h-auto rounded-lg border border-portfolio-border object-cover"
          />
        </div>
      </details>
    </>
  ),
};
