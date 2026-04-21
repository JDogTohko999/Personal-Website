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

const BoresAIDividendContent = () => (
  <div>

    {/* TLDR */}
    <div className="border-l-2 border-portfolio-gold/50 pl-4 mb-10">
      <p className="text-sm font-semibold text-portfolio-gold mb-1">TLDR</p>
      <p className="text-sm">
        The sentence <em>"AI usage is measured in tokens, or units of computation."</em> is inaccurate — tokens are not units of computation.
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
      I've recently been thinking about optimal AI-related tax policies, so I was super excited when I found out about this. As I was reading, annoyed by the frequent oversimplifications<Ref n={1} />, I suddenly stopped — <em>that can't be right...</em> I must have misread that. Wait, but surely ", or" implies that they're defining the previous word. I checked with my CS roommate as he brushed his teeth: "read this, does anything feel off about it?" He agreed.
    </p>

    <p className="mb-5">
      This sentence: <em>"AI usage is measured in tokens, or units of computation."</em>
    </p>

    <img src="/AI_Dividend_A_Token_Tax.png" alt="AI Dividend Token Tax section" className="my-6 rounded-lg border border-portfolio-border max-w-2xl mx-auto block" />

    <p className="mb-5 mt-8">
      This sentence incorrectly defines tokens.{' '}
      <strong className="font-bold text-portfolio-text px-1 rounded" style={{ backgroundColor: 'rgba(244, 204, 103, 0.25)' }}>Tokens are not units of computation.</strong>{' '}
      I had to triple-check my understanding of what a token is, then reconfirmed with Claude and yet another CS friend. Equating them is simply incorrect — this isn't pedantic, the distinction is meaningful and should have been caught before publishing<Ref n={2} />. That said, this probably reflects common industry shorthand where tokens are a proxy for computational cost in billing.
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
        I wish briefs like this were longer, or at least had some appendix, methodologies, or further supporting research. I want to know exactly <em>how</em> these will be executed on. The suggestions sound interesting, but implementation specifications matter so much. Ahh, are early signs that I'm going to be a policy wonk? Thinking about what is optimal to tax is extremely complex, and it felt unsatisfying to see how unnuanced the "tax tokens" section was. I know it's a 3-page brief, so they're not really supposed to go into the details. Is this how all policy people feel about briefs?
      </Footnote>
      <Footnote n={2}>
        I'm a campaign fellow and a genuine supporter of Alex Bores, and one of my deeply held priors is that his AI policy work would be technically grounded. That's probably why this caught me off guard, and why I felt a tinge of disappointment when finding this. It's a small thing, but I guess it's the kind of thing I wouldn't expect from him. I assume Alex read this before it went out (it's only 3 pages), but there is a chance he did not. I'm not really sure how these things go!
      </Footnote>
    </div>

  </div>
);

export const blogPosts = [
  {
    id: 'bores-ai-dividend-inaccuracy',
    title: "A Small Correction to Bores' AI Dividend Brief",
    date: 'April 21, 2026',
    lastEdited: 'April 21, 2026, 4:07 AM',
    tags: ['AI', 'Alex Bores', 'Nitpicking'],
    summary: 'Noting a small inaccuracy in the AI Dividend brief from Alex Bores — tokens are not units of computation.',
    Content: BoresAIDividendContent,
  },
];
