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

// Cream photo frame ("polaroid"). Pass rotate for the tilted cluster photos.
const Frame = ({ children, rotate = 0, pad = 8, shadow = '0 10px 24px rgba(0,0,0,.45)', style = {} }) => (
  <div
    style={{
      background: '#f5f3ec',
      padding: pad,
      borderRadius: 2,
      boxShadow: shadow,
      transform: `rotate(${rotate}deg)`,
      ...style,
    }}
  >
    {children}
  </div>
);

// Caption that sits beside a photo.
const Cap = ({ children, align = 'left' }) => (
  <figcaption
    className="text-portfolio-muted"
    style={{ flex: 1, fontSize: 15, fontStyle: 'italic', lineHeight: 1.7, textAlign: align }}
  >
    {children}
  </figcaption>
);

const BoresBackpackContent = () => (
  <div>
    <p className="mb-7">
      The past 10 days here in NYC have been a whirlwind. I came to canvass for{' '}
      <a href="https://www.alexbores.nyc/" target="_blank" rel="noopener noreferrer" className="text-portfolio-gold underline underline-offset-2 hover:opacity-80">Alex Bores</a>
      {' '}in the NY-12 primary, and to see friends and family. Here are some things that happened.
    </p>

    {/* canvassing hours — straight, large */}
    <figure style={{ display: 'flex', gap: 30, alignItems: 'center', margin: '0 0 48px' }}>
      <Frame pad={9} shadow="0 12px 28px rgba(0,0,0,.45)">
        <img src="/canvassing_hours.png" alt="Canvassing hours log" style={{ display: 'block', width: 430 }} />
      </Frame>
      <Cap>My feet started hurting on the 20th, bought new shoes which helped a bit.</Cap>
    </figure>

    {/* reeboks + curtis — same row, captions on the outer sides */}
    <figure style={{ display: 'flex', gap: 22, alignItems: 'center', margin: '0 0 50px' }}>
      <Cap align="right">RIP carpet reeboks, served me well these past few yrs.</Cap>
      <Frame><img src="/rip_reeboks.png" alt="Worn out Reeboks" style={{ display: 'block', width: 225 }} /></Frame>
      <Frame><img src="/curtisssss_SLIWAAAAA.png" alt="Curtis Sliwa" style={{ display: 'block', width: 225 }} /></Frame>
      <Cap>Ran into the real mayor, he gave me his business card lol.</Cap>
    </figure>

    {/* indian joint — straight */}
    <figure style={{ display: 'flex', flexDirection: 'row-reverse', gap: 30, alignItems: 'center', margin: '0 0 44px' }}>
      <Frame><img src="/indian_joint.JPG" alt="Hole in the wall Indian restaurant" style={{ display: 'block', width: 210 }} /></Frame>
      <Cap>
        Found a hole-in-the-wall Indian joint. Based on the cleanliness of the kitchen and serving area, the fact that I had the lightest skin tone in there, that nobody was speaking English, and things were cheap, I knew it was either going to absolutely slap or give me food poisoning. I got lucky — slap it did :)
      </Cap>
    </figure>

    {/* flatiron — 4 photos, slight overlap, tilted */}
    <figure style={{ display: 'flex', gap: 30, alignItems: 'center', margin: '0 0 60px' }}>
      <div style={{ flex: 'none', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, width: 290 }}>
        <img src="/flatiron1.jpg" alt="Flatiron 1" style={{ display: 'block', width: '100%' }} />
        <img src="/flatiron2.jpg" alt="Flatiron 2" style={{ display: 'block', width: '100%' }} />
        <img src="/flatiron3.jpg" alt="Flatiron 3" style={{ display: 'block', width: '100%' }} />
        <img src="/flatiron4.jpg" alt="Flatiron 4" style={{ display: 'block', width: '100%' }} />
      </div>
      <Cap>
        Took a pic of Flatiron. Post processed it a few times for fun. Top two are cool, bottoms not so much.
      </Cap>
    </figure>

    {/* bores signs — anti on the left, pro on the right, caption between */}
    <figure style={{ display: 'flex', gap: 18, alignItems: 'center', margin: '0 0 60px' }}>
      <div style={{ flex: 'none', position: 'relative', width: 250, height: 215 }}>
        <Frame pad={6} rotate={-5} shadow="0 8px 20px rgba(0,0,0,.45)" style={{ position: 'absolute', left: 0, top: 0, zIndex: 2 }}><img src="/anti_bores.jpg" alt="Anti-Bores sign" style={{ display: 'block', width: 138 }} /></Frame>
        <Frame pad={6} rotate={3} shadow="0 8px 20px rgba(0,0,0,.45)" style={{ position: 'absolute', left: 115, top: 38, zIndex: 1 }}><img src="/anti_bores2.jpg" alt="Anti-Bores sign 2" style={{ display: 'block', width: 138 }} /></Frame>
      </div>
      <figcaption className="text-portfolio-muted" style={{ flex: 1, fontSize: 22, fontStyle: 'italic', lineHeight: 1.7, textAlign: 'center' }}>
        "Looks like it's gonna be a great day today"<br />
        <a href="https://genius.com/Mf-doom-great-day-lyrics" target="_blank" rel="noopener noreferrer" className="text-portfolio-gold" style={{ fontSize: 8, textDecoration: 'none' }}>"DOOM, are you pondering what I'm pondering"</a>
      </figcaption>
      <div style={{ flex: 'none', position: 'relative', width: 250, height: 215 }}>
        <Frame pad={6} rotate={4} shadow="0 8px 20px rgba(0,0,0,.45)" style={{ position: 'absolute', right: 0, top: 0, zIndex: 2 }}><img src="/pro_bores.jpg" alt="Pro-Bores sign" style={{ display: 'block', width: 138 }} /></Frame>
        <Frame pad={6} rotate={-4} shadow="0 8px 20px rgba(0,0,0,.45)" style={{ position: 'absolute', right: 115, top: 38, zIndex: 1 }}><img src="/pro_bores2.jpg" alt="Pro-Bores sign 2" style={{ display: 'block', width: 138 }} /></Frame>
      </div>
    </figure>

  {/* judy — straight, large */}
  <figure style={{ display: 'flex', flexDirection: 'row', gap: 30, alignItems: 'center', margin: '0 0 44px' }}>
    <Cap>
      Meet Judy. She's showing off her shirt that says 'Life Goal: Pet All The Dogs'. She was awesome. She came for an hour or so as a Lasher volunteer, though I'm not sure she really knew much at all about him. A good example of the type of older folks that are so consistent in their civic duties. Met at least 3 people on their way to vote that walked at something like .5mph.
    </Cap>
    <Frame pad={9} shadow="0 12px 28px rgba(0,0,0,.45)">
      <img src="/judy.jpg" alt="Judy" style={{ display: 'block', width: 300 }} />
    </Frame>
  </figure>

  {/* monday canvassing — video on the left, photos slightly overlapping on the right */}
  <figure style={{ display: 'flex', gap: 22, alignItems: 'center', margin: '0 0 60px' }}>
    <Frame pad={9} shadow="0 12px 28px rgba(0,0,0,.45)">
      <video 
        src="/canvassing_bores.mp4" 
        autoPlay 
        loop 
        muted 
        controls
        playsInline 
        style={{ display: 'block', width: 215 }} 
      />
    </Frame>
    <figcaption className="text-portfolio-muted" style={{ flex: 1, fontSize: 15, fontStyle: 'italic', lineHeight: 1.7, textAlign: 'center' }}>
      My Monday morning canvassing. Got to meet Alex himself!
    </figcaption>
    <div style={{ flex: 'none', position: 'relative', width: 265, height: 330 }}>
      <Frame pad={6} rotate={4} shadow="0 8px 20px rgba(0,0,0,.45)" style={{ position: 'absolute', left: 0, top: 0, zIndex: 1 }}>
        <img src="/AlexBores.png" alt="Alex Bores" style={{ display: 'block', width: 125 }} />
      </Frame>
      <Frame pad={6} rotate={-3} shadow="0 8px 20px rgba(0,0,0,.45)" style={{ position: 'absolute', left: 122, top: 42, zIndex: 2 }}>
        <img src="/AlexBores2.png" alt="Alex Bores 2" style={{ display: 'block', width: 155 }} />
      </Frame>
    </div>
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

    {/* kalshi — straight */}
    <figure style={{ display: 'flex', flexDirection: 'row-reverse', gap: 30, alignItems: 'center', margin: '0 0 44px' }}>
      <Frame><img src="/kalshi_bores.png" alt="Kalshi odds for Bores" style={{ display: 'block', width: 500 }} /></Frame>
      <Cap>Jack and I watched it go from 25% to 1% in just a few minutes after 9pm when the results were just starting to come out. Rough stuff.</Cap>
    </figure>

    <p className="mb-5">
      Oddly enough, losing the election felt a lot like losing my backpack. When the realization was made I thought about the implications and what I'd put into it. I acquiesced for 20 seconds, then moved on.
    </p>
    <p className="mb-5">
      Of course, there was no melancholic "after party" for the loss of my backpack, but parallels can't always be perfect.
    </p>

    <h2 className="text-xl font-bold text-portfolio-text mt-14 mb-3">In other news</h2>
    <p className="mb-5">
      I'm going to try to track all of the content/media I consume, inspired by{' '}
      <a href="https://substack.com/home/post/p-186570918" target="_blank" rel="noopener noreferrer" className="text-portfolio-gold underline underline-offset-2 hover:opacity-80">Nixon Hanna</a>
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
