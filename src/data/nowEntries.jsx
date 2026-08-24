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
        From previous now: <span className="italic">11:58pm, 7/23/2026</span>
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
  date: '2:31pm, 8/24/2026',
  content: (
    <>
      <p>
        Currently in a beautiful UC Berkeley{' '}
        <ImageLink images="/UCBerkLib.jpg">library</ImageLink>
        . Attended OASIS and EAGxBerkeley this past week, and{' '}
        <ImageLink images={['/SF_hike1.JPG', '/SF_hike2.jpg', '/SF_hike3.jpg']}>saw</ImageLink>
        {' '}a few pockets of the bay. 98% prob I'll be in Boston by the end of the month starting a new position.
      </p>
      <div className="my-4 w-full max-w-[380px] mx-auto">
        <img
          src="/fatebook_position.png"
          alt="My forecast: Will I have accepted and started a full-time, paid position? — 65%"
          className="w-full h-auto rounded-lg border border-portfolio-border"
        />
        <p className="mt-2 text-center text-sm italic text-portfolio-muted">
          Wish I had forecasted for each month and not just eoy
        </p>
      </div>
      <p className="pt-2 font-semibold text-portfolio-text">Top of mind:</p>
      <ul className="list-disc list-outside pl-5 space-y-2">
        <li>Prepping for Boston.</li>
        <li>
          Rapid AIS upskilling. Reading foundational texts, logging disagreements, and discussing with friends. I've been postponing this forever, might need to{' '}
          <a
            href="https://usefulfictions.substack.com/p/tying-yourself-to-the-mast"
            target="_blank"
            rel="noopener noreferrer"
            className="text-portfolio-gold hover:underline"
          >
            'tie myself to the mast'
          </a>
          .
        </li>
        <li>
          Mentoring 3{' '}
          <a
            href="https://pathfinder.kairos-project.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-portfolio-gold hover:underline"
          >
            Pathfinder
          </a>
          {' '}fellows.
        </li>
        <li>
          Advising{' '}
          <a
            href="https://vaisi.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-portfolio-gold hover:underline"
          >
            VAISI
          </a>
          .
        </li>
      </ul>
      <p className="pt-2 font-semibold text-portfolio-text">Backburner</p>
      <ul className="list-disc list-outside pl-5 space-y-2">
        <li>
          The{' '}
          <a
            href="https://aisafetyseeding.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-portfolio-gold hover:underline"
          >
            AI Safety Seeding Initiative
          </a>
          {' '}with{' '}
          <a
            href="https://thomasrodskog.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-portfolio-gold hover:underline"
          >
            Thomas
          </a>
          {' '}et al. Our primary sprint ended in early August, and the experience has taught me much! Chiefly, that I overestimated the number of groups in which we counterfactually produced clearly good outcomes. We will continue the project in a less "sprinty" capacity for at least the next month or two.
        </li>
        <li>
          Transforming this website into something I'm actually proud of. Feels like every week I come across someone else's dope ass website, most recently {' '}
          <a
            href="https://andyqhan.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-portfolio-gold hover:underline"
          >
            Andy Han
          </a>
          {' '}and{' '}
          <a
            href="https://maltech.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-portfolio-gold hover:underline"
          >
            Malcolm Krolick
          </a>
          .
        </li>
        <li>
          Writing. I've been super inspired by{' '}
          <a
            href="https://elianadu.substack.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-portfolio-gold hover:underline"
          >
            Eliana Du's awesome substack
          </a>
          . First post will be about how I stumbled into EA/AIS and where I'm at now, exactly one year in.
        </li>
        <li>
          Learning about the Israel-Palestine conflict. Watching some of my favorite documentarians (Channel 5 and Louis Theroux) cover it has caused an initial sympathy for Palestine. The content I've seen focused on Israeli settlers, so it's hard not conclude they're being oppressive. Now, I'm trying to learn more about the conflict and it's history – quite the daunting task :)
        </li>
        <li>
          Making sense of some epistemologies like critical rationalism and bayesianism, strong/weak longtermism, and the 'culty' elements of EA and AIS. Mostly spurred by my recent hours of engagement with the content of the{' '}
          <a
            href="https://www.incrementspodcast.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-portfolio-gold hover:underline"
          >
            Increments Podcast
          </a>
          .
        </li>
      </ul>

      <VideoBonus />

      <details className="group mt-4 pt-4 border-t border-portfolio-border">
        <summary className="cursor-pointer list-none text-sm font-medium text-portfolio-muted hover:text-portfolio-gold transition-colors flex items-center gap-1">
          <span className="inline-block transition-transform group-open:rotate-90">▸</span>
          Bonus 2
        </summary>
        <p className="mt-3 italic text-portfolio-muted">Shoutout the Boomsticks</p>
        <div className="mt-3 w-full max-w-[640px] mx-auto flex flex-col sm:flex-row gap-3">
          <img
            src="/Boomsticks_AFC.jpg"
            alt="The Boomsticks"
            className="w-full sm:w-1/2 h-auto rounded-lg border border-portfolio-border object-cover"
          />
          <img
            src="/boomsticks_beach_outside_grad.JPG"
            alt="The Boomsticks at the beach"
            className="w-full sm:w-1/2 h-auto rounded-lg border border-portfolio-border object-cover"
          />
        </div>
      </details>
    </>
  ),
};
