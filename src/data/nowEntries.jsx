import React from 'react';

export const nowEntry = {
  date: '11:49pm, 8/6/2026',
  content: (
    <>
      <p>
        I'm currently sitting in bed at our annual family reunion in NH. Sharing a room w{' '}
        <a
          href="https://www.instagram.com/2cardtito/?hl=en"
          target="_blank"
          rel="noopener noreferrer"
          className="text-portfolio-gold hover:underline"
        >
          2cardtito
        </a>
        . We fly back to SC in 2 days. Then, I'll be in SF (Berkeley) from the 17th–28th, hopefully at the EAGx and around Constellation/Mox.
      </p>
      <p className="pt-2 font-semibold text-portfolio-text">Top of mind:</p>
      <ul className="list-disc list-outside pl-5 space-y-2">
        <li>
          Mainly working on the{' '}
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
          {' '}et al. Our "sprint" phase has finished and I'm pretty happy with the results so far! We've counterfactually seeded 10 groups and had some influence on some 20 others. I'll be writing up a progress report in a few days.
        </li>
        <li>
          Thinking about the question "what is the role of government?" which was posed to me by my thoughtful uncle. More concretely, how should something like social media be governed? I hope to gain clarity on this – the US relies on informed citizens.
        </li>
        <li>Soon to start applying to some fulltime roles.</li>
      </ul>
      <p className="pt-2 font-semibold text-portfolio-text">Backburner</p>
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
