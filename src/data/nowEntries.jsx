import React, { useState, useEffect } from 'react';

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

export const nowEntry = {
  date: '1:53am, 11/15/2026',
  content: (
    <>
      <p>
        I'm currently sitting with Shubs and Aidan at AIST/MAIA Workshop 2. I'm starting to internalize the recent METR report and its implications. It sucks that we're forced to put so much faith in METR due to Anthropic redacting almost all of the load-bearing evidence in the report, but largely I trust METR. Thus my timelines have drastically shortened.
      </p>
      <p className="pt-2">
        I'll be writing and posting something in a week or two on my timelines and approach to all of this because I'll probably want to start talking to my friends and family about this.
      </p>
      <p className="pt-2 font-semibold text-portfolio-text">For those curious about wtf I'm talking about, these are the best resources:</p>
      <ul className="list-disc list-outside pl-5 space-y-2">
        <li>
          <a
            href="https://metr.org/blog/2026-11-05-anthropic-ai-rd-acceleration-assessment/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-portfolio-gold hover:underline"
          >
            The METR report
          </a>
        </li>
        <li>
          <a
            href="https://substack.com/home/post/p-223816733"
            target="_blank"
            rel="noopener noreferrer"
            className="text-portfolio-gold hover:underline"
          >
            Ajeya's post
          </a>
          {' '}(short and understandable)
        </li>
        <li>
          <a
            href="https://blog.aifutures.org/p/q35-timelines-update-looks-like-the"
            target="_blank"
            rel="noopener noreferrer"
            className="text-portfolio-gold hover:underline"
          >
            AI Futures Project timelines update
          </a>
        </li>
        <li>
          <a
            href="https://www.youtube.com/watch?v=1NHPDzpfR6Y"
            target="_blank"
            rel="noopener noreferrer"
            className="text-portfolio-gold hover:underline"
          >
            Dwarkesh Video
          </a>
        </li>
      </ul>
      <p className="pt-2 font-semibold text-portfolio-text">In other, non-AI safety, less depressing news (:</p>
      <ul className="list-disc list-outside pl-5 space-y-2">
        <li>
          I recently moved into my new place in Central.
        </li>
        <li>
          I'm hoping the Facebook Marketplace gods bless me with a reasonably priced, nicely colored, light, single speed bike so I can stop walking around Cambridge.
        </li>
        <li>
          I've also decided to start fixing my sleep schedule by waking up at 8am every day. Inspired by Roman,{' '}
          <a
            href="https://blog.dewierwan.com/p/sleep"
            target="_blank"
            rel="noopener noreferrer"
            className="text-portfolio-gold hover:underline"
          >
            Dewi
          </a>
          , and any... most normal people.
        </li>
      </ul>
    </>
  ),
};
