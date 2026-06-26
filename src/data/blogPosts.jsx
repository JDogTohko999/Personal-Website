import React from 'react';

const Ref = ({ n }) => (
  <a href={`#fn${n}`} id={`ref${n}`} className="text-portfolio-gold hover:opacity-70 transition-opacity font-semibold ml-0.5 text-xs align-super">[{n}]</a>
);

const Footnote = ({ n, children }) => (
  <p id={`fn${n}`} className="scroll-mt-24">
    <a href={`#ref${n}`} className="text-portfolio-gold hover:opacity-70 transition-opacity font-semibold mr-1">[{n}]</a>
    {children}
  </p>
);

const Figure = ({ src, alt, caption, className = '' }) => (
  <figure className={`my-6 mx-auto max-w-[80%] ${className}`}>
    <img
      src={src}
      alt={alt || ''}
      className="w-full rounded-lg border border-portfolio-border shadow-md"
      onError={(e) => { e.currentTarget.style.display = 'none'; }}
    />
    {caption && (
      <figcaption className="text-xs italic text-portfolio-muted/80 mt-2 text-center">
        {caption}
      </figcaption>
    )}
  </figure>
);

const BoresBackpackContent = () => (
  <div>
    <p className="mb-5">
      The past 10 days here in NYC have been a whirlwind. I came to canvass for{' '}
      <a href="https://www.alexbores.nyc/" target="_blank" rel="noopener noreferrer" className="text-portfolio-gold underline underline-offset-2 hover:opacity-80">Alex Bores</a>
      {' '}in the NY-12 primary, and to see friends and family.
    </p>

    <Figure
      src="/canvassing_hours.png"
      alt="Canvassing hours log"
      caption="My feet started hurting on the 20th, bought new shoes which helped a bit."
    />

    <Figure
      src="/rip_reeboks.png"
      alt="Worn out Reeboks"
      caption="RIP carpet reeboks, served me well these past few yrs."
    />

    <Figure
      src="/curtisssss_SLIWAAAAA.png"
      alt="Curtis Sliwa"
      caption="Ran into the real mayor, he gave me his business card lol."
    />

    <Figure
      src="/indian_joint.JPG"
      alt="Hole in the wall Indian restaurant"
      caption='Found a hole-in-the-wall Indian joint. Based on the cleanliness of the kitchen and serving area, the fact that I had the lightest skin tone in there, that nobody was speaking English, and things were cheap, I knew it was either going to absolutely slap or give me food poisoning. I got lucky — slap it did :)'
    />

    <figure className="my-6 mx-auto max-w-[80%]">
      <div className="grid grid-cols-2 gap-2">
        <img src="/flatiron1.jpg" alt="Flatiron, edit 1" className="w-full rounded-lg border border-portfolio-border shadow-md" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        <img src="/flatiron2.jpg" alt="Flatiron, edit 2" className="w-full rounded-lg border border-portfolio-border shadow-md" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
      </div>
      <figcaption className="text-xs italic text-portfolio-muted/80 mt-2 text-center">
        Pic I took of Flatiron. Just spent 10min playing with post processing settings, I've never done that before but it was fun making 6 versions of that photo. Weird how the color messes with my perception of the shapes/angles.
      </figcaption>
    </figure>

    <figure className="my-6 mx-auto max-w-[80%]">
      <div className="grid grid-cols-2 gap-2">
        <img src="/anti_bores.jpg" alt="Anti-Bores sign" className="w-full rounded-lg border border-portfolio-border shadow-md" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        <img src="/anti_bores2.jpg" alt="Anti-Bores sign 2" className="w-full rounded-lg border border-portfolio-border shadow-md" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        <img src="/pro_bores.jpg" alt="Pro-Bores sign" className="w-full rounded-lg border border-portfolio-border shadow-md" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        <img src="/pro_bores2.jpg" alt="Pro-Bores sign 2" className="w-full rounded-lg border border-portfolio-border shadow-md" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
      </div>
      <figcaption className="text-xs italic text-portfolio-muted/80 mt-2 text-center">
        <div>"Looks like it's gonna be a great day today"</div>
        <div className="text-[8px] italic mt-1">
          <a href="https://genius.com/Mf-doom-great-day-lyrics" target="_blank" rel="noopener noreferrer" className="text-portfolio-gold hover:underline">
            "DOOM, are you pondering what I'm pondering"
          </a>
        </div>
      </figcaption>
    </figure>

    <Figure
      src="/judy.jpg"
      alt="Judy"
      caption="Her shirt says 'Life Goal: Pet All The Dogs'. She was awesome. Hobbled onto the scene, barely knew anything about Micah, and sat down after 20m bc her back hurt. Cheerful throughout."
    />

    <figure className="my-6 mx-auto max-w-[80%]">
      <video
        src="/canvassing_bores.mp4"
        controls
        playsInline
        className="w-full rounded-lg border border-portfolio-border shadow-md mb-2"
      />
      <div className="grid grid-cols-2 gap-2">
        <img src="/AlexBores.png" alt="Alex Bores" className="w-full rounded-lg border border-portfolio-border shadow-md" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        <img src="/AlexBores2.png" alt="Alex Bores 2" className="w-full rounded-lg border border-portfolio-border shadow-md" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
      </div>
      <figcaption className="text-xs italic text-portfolio-muted/80 mt-2 text-center">
        My Monday morning of canvassing. Got to meet Alex himself!
      </figcaption>
    </figure>

    <h2 className="text-xl font-bold text-portfolio-text mt-14 mb-3">June 23rd</h2>

    <p className="mb-5">
      Woke up at 4am, got to my pollsite, PS87, at 5:50am, and put down my backpack by our table of things to go tape up some flyers. Came back 40min later to find nobody by our table and that my backpack was gone. I liked that backpack. Luckily had nothing especially valuable in it, but damn. I got over it pretty quick though. Met a bunch of cool people, namely two fellow Bores fellows, Jack and Tobias, and two Lasher volunteers, Benji and some older guy that was kind, level-headed, and well-read. All of them were very sharp and knowledgeable about Bores, Lasher, and NYC politics.
    </p>
    <p className="mb-5">
      I also had a super interesting kerfuffle with perhaps the most disagreeable and irrational person I've met in the past few years.
    </p>
    <p className="mb-5">
      It was on and off drizzling and my umbrella and rain jacket were in my backpack.
    </p>
    <p className="mb-5">
      We stayed out there until 9pm. My feet were struggling, but my body never actually got tired.
    </p>

    <Figure
      src="/kalshi_bores.png"
      alt="Kalshi odds for Bores"
      caption="Jack and I watched it go from 25% to 1% in just a few minutes after 9pm when the results were just starting to come out. Rough stuff."
    />

    <p className="mb-5">
      Oddly enough, losing the election felt a lot like losing my backpack. I realized it, thought about what I had put into it, thought about the implications, acquiesced for 20 seconds, then moved on.
    </p>
    <p className="mb-5">
      Of course, there was no melancholic "after party" for the loss of my backpack, but parallels can't always be perfect.
    </p>

    <h2 className="text-xl font-bold text-portfolio-text mt-14 mb-3">In other news</h2>
    <p className="mb-5">
      I'm going to try to track all of the content/media I consume, inspired by{' '}
      <a
        href="https://substack.com/home/post/p-186570918"
        target="_blank"
        rel="noopener noreferrer"
        className="text-portfolio-gold underline underline-offset-2 hover:opacity-80"
      >
        Nixon Hanna
      </a>
      . Hopefully making this public will reduce my doom youtubing. I'll do weekly batches.
    </p>
    <p className="mb-3">Today (6/25) I watched:</p>
    <ul className="list-disc list-outside pl-5 space-y-2 mb-5">
      <li>You should, unfortunately, be worried about Sam Altman — AI in Context</li>
      <li>Palestine — Channel 5 with Andrew Callaghan.</li>
      <li>Palestine part 2/4 (yes I did just pay $50 for a year of Channel 5 Patreon).</li>
      <li>45min of Louis Theroux Interview — Channel 5 (Patreon).</li>
      <li>20min long Louis Theroux <em>Weird Weekends</em> compilation.</li>
      <li>25min of movie clips from <em>Parasite</em>.</li>
      <li>15min of clips from <em>The Bear</em>.</li>
    </ul>
  </div>
);

const BoresAIDividendContent = () => (
  <div>

    {/* TLDR */}
    <div className="border-l-2 border-portfolio-gold/50 pl-4 mb-10">
      <p className="text-sm font-semibold text-portfolio-gold mb-1">TLDR</p>
      <p className="text-sm">
        The sentence <em>"AI usage is measured in tokens, or units of computation."</em> is inaccurate — tokens are not units of computation. The conflation is technically incorrect and has meaningful policy implications.
      </p>
    </div>

    <p className="mb-5">
      Alex Bores, NY Assemblyman running for Congress in NY-12, recently released{' '}
      <a
        href="https://www.alexbores.nyc/files/Bores-Dividend_Policy.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="text-portfolio-gold underline underline-offset-2 hover:opacity-80 transition-opacity"
      >
        The AI Dividend: Preparing America for the AI Economy
      </a>
      , a brief that aims to prepare the public for the potential of rapid AI-driven job displacement via direct resource redistribution programs. Here's the summary:
    </p>

    <img src="/AI_Dividend_Policy_Summary.png" alt="AI Dividend Policy Summary" className="my-6 rounded-lg border border-portfolio-border max-w-2xl mx-auto block" />

    <p className="mb-5 mt-8">
      I've recently been thinking about optimal AI-related tax policies, so I was super excited when I found out about this. I think this is an important initiative worth exploring, and this is a great first step.
    </p>
    <p className="mb-5">
      As I was reading, annoyed by the frequent oversimplifications<Ref n={1} />, I suddenly stopped — <em>that can't be right...</em> I must have misread that. Wait, but surely ", or" implies that they're defining the previous word. I checked with my CS roommate as he brushed his teeth: "read this, does anything feel off about it?" He agreed.
    </p>

    <p className="mb-5">
      This sentence: <em>"AI usage is measured in tokens, or units of computation."</em>
    </p>

    <img src="/AI_Dividend_A_Token_Tax.png" alt="AI Dividend Token Tax section" className="my-6 rounded-lg border border-portfolio-border max-w-2xl mx-auto block" />

    <p className="mb-5 mt-8">
      This sentence incorrectly defines tokens.{' '}
      <strong className="font-bold text-portfolio-text px-1 rounded" style={{ backgroundColor: 'rgba(244, 204, 103, 0.25)' }}>Tokens are not units of computation.</strong>{' '}
      I had to triple-check my understanding of what a token is, then reconfirmed with Claude and yet another CS friend. Equating them is incorrect — this might be pedantic, but I do think the distinction is meaningful and should have been caught before publishing<Ref n={2} />. That said, this probably reflects common industry shorthand where tokens are a proxy for computational cost in billing. Tokens currently correlate quite well with computation, but this might not always be the case. New model architectures or reasoning modes could render this correlation less reliable, which is why it's important to be precise in definitions.
    </p>

    <p className="mb-5">
      Here's my proposed revision: <em>"A Token Tax. AI usage is commonly measured in tokens, the chunks of text that models process. A modest tax on token throughput would tie the funding mechanism to AI adoption, ensuring that as AI scales, so does the safety net."</em> The fix is small but it gets the definition right.
    </p>

    {/* Section: What are tokens? */}
    <h2 className="text-xl font-bold text-portfolio-text mt-14 mb-3">What are tokens?</h2>
    <p className="mb-5">
      Tokens are the small chunks of text that a language model reads and writes. When you send a message, it gets split into pieces, usually somewhere between a full word and a few characters each. "Hello world" is 2 tokens. "Tokenization" might be 1 or 2. A long technical word like "antidisestablishmentarianism" might be 5 or 6. The exact split depends on the model's tokenizer, different AI companies use different ones. What matters is that tokens measure text: how much went in, how much came out. They are a billing and accounting unit, not a measure of how hard the model worked to produce that text.
    </p>

    {/* Section: What is computation? */}
    <h2 className="text-xl font-bold text-portfolio-text mt-14 mb-3">What is computation?</h2>
    <p className="mb-5">
      Computation refers to the actual mathematical work, the billions of multiplications performed by accelerators (e.g. GPUs or TPUs) to produce a result. It is measured in FLOPs (floating-point operations). Computation is what consumes energy, time, and money. Two prompts that produce the same number of output tokens can require wildly different amounts of computation depending on model size, architecture, and how deeply the model "thinks" before responding (e.g. extended reasoning modes).
    </p>

    {/* Section: Analogy */}
    <h2 className="text-xl font-bold text-portfolio-text mt-14 mb-3">A useful analogy</h2>
    <p className="mb-5">
      Tokens are like miles on an odometer: they measure how far you traveled, i.e. how much text was processed. Computation is like the fuel burned to get there. Two trips of identical mileage can consume very different amounts of fuel depending on terrain, speed, and the vehicle. A short prompt that triggers deep reasoning burns far more "fuel" than a long prompt that gets a rote answer. Taxing tokens, then, is like taxing miles driven: often a very reasonable proxy, but a proxy nonetheless, not the thing itself.
    </p>

    <div className="w-full h-px bg-portfolio-border mt-14 mb-8"></div>

    {/* Footnotes */}
    <div className="space-y-4 text-sm text-portfolio-muted">
      <Footnote n={1}>
        I wish briefs like this were longer, or at least had some appendix, methodologies, or further supporting research. I want to know exactly <em>how</em> these will be executed on. The suggestions sound interesting, but implementation specifications matter so much. Ahh, are these early signs that I'm going to be a policy wonk? Thinking about what is optimal to tax is extremely complex, and it felt unsatisfying to see how unnuanced the "tax tokens" section was. I know it's a 3-page brief, so they're not really supposed to go into the details. Is this how all policy people feel about briefs?
      </Footnote>
      <Footnote n={2}>
        I'm a campaign fellow and a genuine supporter of Alex Bores, and one of my deeply held priors is that his AI policy work would be technically grounded. That's probably why this caught me off guard, and why I felt a tinge of disappointment when finding this. It's a small thing, and seemingly not that important. I assume Alex read this before it went out (it's only 3 pages), but there is a chance he did not. I'm not really sure how these things go!
      </Footnote>
    </div>

  </div>
);

export const blogPosts = [
  {
    id: 'bores-and-a-backpack-lost',
    title: 'Losing — A Bores and a backpack',
    date: 'June 26, 2026',
    tags: ['Alex Bores', 'NYC', 'Canvassing'],
    summary: '10 days canvassing for Alex Bores in NYC — Curtis Sliwa, a hole-in-the-wall Indian joint, Judy, and a lost backpack.',
    Content: BoresBackpackContent,
  },
  {
    id: 'bores-ai-dividend-inaccuracy',
    title: "A Small Correction to Bores' AI Dividend Brief",
    date: 'April 21, 2026, 4:07am',
    lastEdited: 'April 21, 2026, 12:02pm',
    tags: ['AI', 'Alex Bores', 'Nitpicking'],
    summary: 'Noting a small inaccuracy in the AI Dividend brief from Alex Bores — tokens are not units of computation.',
    Content: BoresAIDividendContent,
  },
];
