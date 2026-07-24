import React from 'react';

export const nowEntry = {
  date: '11:58pm, 7/23/2026',
  content: (
    <>
      <p>
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
      
      <p>
        Anyways... I'm on week 3/4 in Cville. I'll be in NH for a week-long family reunion at the start of August, then ~70% chance I head to Berkeley for the EAGx and other AI safety related happenings.
      </p>
      <p className="pt-2 font-semibold text-portfolio-text">Top of mind:</p>
      <ul className="list-disc list-outside pl-5 space-y-2">
        <li>
          Sprinting with{' '}
          <a
            href="https://thomasrodskog.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-portfolio-gold hover:underline"
          >
            Thomas Rodskog
          </a>
          {' '}and the rest of the{' '}
          <a
            href="https://aisafetyseeding.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-portfolio-gold hover:underline"
          >
            AI Safety Seeding Initiative
          </a>
          {' '}team. This project has grown way bigger than I anticipated 2 months ago. Spending +40hr/wk.
        </li>
      </ul>
      <p className="pt-2 font-semibold text-portfolio-text">On the backburner</p>
      <ul className="list-disc list-outside pl-5 space-y-2">
        <li>
          Helping coordinate an event for The{' '}
          <a
            href="https://docs.google.com/document/d/1v2LjcFjHKsBRGR46_F6BbZk0wZlY-EQW-LLFs1i1xP8/edit?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer"
            className="text-portfolio-gold hover:underline"
          >
            Confluence Initiative
          </a>
          .
        </li>
        <li>
          Helping prep{' '}
          <a
            href="https://vaisi.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-portfolio-gold hover:underline"
          >
            VAISI
          </a>
          {' '}for the fall sem, and writing a VAISI retrospective.
        </li>
        <li>Rebuying the things that were in my backpack.</li>
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
          Learning about the Israel-Palestine conflict. Watching some of my favorite reporters (Channel 5 and Louis Theroux) cover has caused an initial sympathy for Palestine. Now, I'm trying to learn more about the conflict and it's history.
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
    </>
  ),
};
