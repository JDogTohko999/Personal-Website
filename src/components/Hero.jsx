import React, { useState } from 'react';
import { Linkedin, BookOpen, CalendarDays, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { nowEntry } from '../data/nowEntries';
import JasoningSlot from './JasoningSlot';

const HEADSHOT = '/jason_headshot_grad.png';

// The first spin of a visit always settles on one of these.
const OPENERS = ['stalling', 'sacking', 'hanging', 'smiling'];

// Whichever of these the reel lands on fills the circle above. The headshot is
// in the list too, so the reel can always come back to it.
const JASONINGS = [
  { label: 'smiling', src: HEADSHOT },
  // Space in the filename must stay percent-encoded in the URL.
  { label: 'field rushing', src: '/field%20rushing.jpg' },
  { label: 'sacking', src: '/sacking.jpg' },
  { label: 'stalling', src: '/stalling.JPG' },
  { label: 'jim carey-ing', src: '/jim-careying.JPG' },
  { label: 'napoleoning', src: '/napoleoning.JPG' },
  { label: 'pointing', src: '/pointing.jpg' },
  { label: 'hanging', src: '/hanging.jpg' },
  { label: 'speaking', src: '/speaking.jpg' },
  { label: 'canvassing', src: '/canvassing_bores.mp4', type: 'video' },
  { label: 'blocking', src: '/blocking.JPG' },
  { label: 'protesting', src: '/protesting.JPG' },
  { label: 'ranking', src: '/ranking.PNG' },
  { label: 'chilling', src: '/chilling.jpg' },
  { label: 'LDOCing', src: '/LDOCing.jpg' },
  { label: 'hooping', src: '/hooping.jpg' },
  { label: 'G-splitting', src: '/G-splitting.jpg' },
  { label: 'climbing', src: '/climbing.jpg' },
  { label: 'winning', src: '/winning.jpg' },
  // Space and '!' in these filenames stay percent-encoded in the URL.
  { label: 'troublemaking', src: '/trouble%20making.jpg' },
  { label: 'snowing!', src: '/snowing%21.jpg' },
];

const Hero = () => {
  const [active, setActive] = useState(null);

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center pt-16 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-shrink-0"
        >
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-portfolio-gold overflow-hidden shadow-2xl relative">
            {active?.type === 'video' ? (
              <video
                key={active.src}
                src={active.src}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                aria-label={`Jason ${active.label}`}
              />
            ) : (
              <img
                src={active ? active.src : HEADSHOT}
                alt={active ? `Jason ${active.label}` : 'Jason Chin'}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="mt-4">
            <JasoningSlot items={JASONINGS} openers={OPENERS} onLand={setActive} />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center md:text-left flex-1"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-portfolio-text mb-4">
            <span className="text-portfolio-gold">Hi, I'm Jason Chin</span>
          </h1>
          <h2 className="text-xl md:text-2xl text-portfolio-muted mb-6">
            AI Safety | UVA '26
          </h2>
          <p className="text-lg text-portfolio-muted mb-4 leading-relaxed max-w-2xl">
            I'm trying to make AI go well.
          </p>
          <p className="text-lg text-portfolio-muted mb-8 leading-relaxed max-w-2xl">
            I graduated in May and am now{' '}
            <a
              href="https://80000hours.org/ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-portfolio-gold hover:underline"
            >
              AI safety
            </a>{' '}
            <a
              href="https://80000hours.org/career-reviews/ai-safety-fieldbuilding/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-portfolio-gold hover:underline"
            >
              field-building
            </a>{' '}
            in Boston.
            <br />
            I'm especially bullish on strengthening and{' '}
            <a
              href="https://aisafetyseeding.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-portfolio-gold hover:underline"
            >
               growing
            </a>{' '}
            the early-career talent ecosystem. Huge fan of the work being done at{' '}
            <a
              href="https://kairos-project.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-portfolio-gold hover:underline"
            >
              Kairos
            </a>
            .
          </p>
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="inline-flex flex-col items-stretch gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative group flex">
                  <Link
                    to="/now"
                    className="w-full px-6 py-3 bg-portfolio-gold text-portfolio-bg font-bold rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center shadow-lg hover:shadow-gold/20"
                  >
                    <Clock className="w-5 h-5 mr-2" />
                    Now
                  </Link>
                  <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-portfolio-text px-3 py-1.5 text-xs font-medium text-portfolio-bg opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                    Last updated {nowEntry.date}
                    <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-portfolio-text" />
                  </div>
                </div>
                <Link
                  to="/blog"
                  className="px-6 py-3 border border-portfolio-gold text-portfolio-gold font-bold rounded-lg hover:bg-portfolio-gold/10 transition-all flex items-center justify-center"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Blog
                </Link>
                <a
                  href="https://www.linkedin.com/in/jasonchin9/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 border border-portfolio-gold text-portfolio-gold font-bold rounded-lg hover:bg-portfolio-gold/10 transition-all flex items-center justify-center"
                >
                  <Linkedin className="w-5 h-5 mr-2" />
                  LinkedIn
                </a>
              </div>
              <a
                href="https://savvycal.com/jasonchin098/meet-with-jason"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-6 py-3 border border-portfolio-gold text-portfolio-gold font-bold rounded-lg hover:bg-portfolio-gold/10 transition-all flex items-center justify-center"
              >
                <CalendarDays className="w-5 h-5 mr-2" />
                Schedule a Meeting
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
