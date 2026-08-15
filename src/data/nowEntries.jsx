import React from 'react';

export const nowEntry = {
  date: '6:17pm, 8/15/2026',
  content: (
    <>
      <p>
        Currently at home in SC. Will be in SF from the 17th–28th, attending EAGxSF, meeting people, and seeing the area for the first time!
      </p>
      <p className="pt-2 font-semibold text-portfolio-text">Top of mind:</p>
      <ul className="list-disc list-outside pl-5 space-y-2">
        <li>
          Main project: the{' '}
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
          {' '}et al. The primary sprint ended in early August, and the experience has taught me much! Chiefly, that I overestimated the number of groups in which we counterfactually produced clearly good outcomes. We will continue the project in a less "sprinty" capacity for at least the next month or two.
        </li>
        <li>Becoming a better candidate for roles I desire and actually applying to those roles.</li>
        <li>
          <a
            href="https://pathfinder.kairos-project.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-portfolio-gold hover:underline"
          >
            Pathfinder
          </a>
          {' '}mentor.
        </li>
        <li>
          <a
            href="https://vaisi.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-portfolio-gold hover:underline"
          >
            VAISI
          </a>
          {' '}advisor.
        </li>
      </ul>
      <p className="pt-2 font-semibold text-portfolio-text">Backburner</p>
      <ul className="list-disc list-outside pl-5 space-y-2">
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

      <p className="pt-6 italic text-portfolio-muted">Shoutout the Boomsticks</p>

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

      <div className="mt-6 pt-4 border-t border-portfolio-border">
        <p className="text-sm text-portfolio-muted">
          Bonus from previous now: <span className="italic">11:58pm, 7/23/2026</span>
        </p>
        <p className="mt-2">
          Just found my new favorite 10s yt clip. First time I've actually laughed out loud from a video in a while.
        </p>
        <div className="my-4 w-full max-w-[420px] mx-auto">
          <div className="relative w-full overflow-hidden rounded-lg border border-portfolio-border" style={{ paddingTop: '56.25%' }}>
            <iframe
              className="absolute inset-0 h-full w-full"
              src="https://www.youtube.com/embed/4K9RDZg4y7o?si=DuCWe_mBPR7MEFQl&start=3355"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
          <p className="mt-2 text-center text-sm italic text-portfolio-muted">somehow perfectly at 55:55 🤯</p>
        </div>
      </div>
    </>
  ),
};
