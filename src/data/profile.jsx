import React from 'react';
import { Link } from 'react-router-dom';

export const profile = {
  name: 'Jason Chin',
  tagline: "AI Safety | UVA '26",
  location: 'Boston',
  headshot: '/jasoning/jason_headshot_grad.png',
  oneLiner: "I'm trying to make AI go well.",
  intro: (
    <>
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
      I was quite bullish on{' '}
      <a
        href="https://kairos-project.org/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-portfolio-gold hover:underline"
      >
        strengthening
      </a>{' '}
      and{' '}
      <a
        href="https://aisafetyseeding.org/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-portfolio-gold hover:underline"
      >
        growing
      </a>{' '}
      the early-career talent ecosystem.{' '}
      <Link to="/now" className="text-portfolio-gold hover:underline">
        Now
      </Link>{' '}
      I'm less sure.
    </>
  ),
};

export const links = {
  linkedin: 'https://www.linkedin.com/in/jasonchin9/',
  github: 'https://github.com/JDogTohko999',
  substack: 'https://substack.com/@jdogtohko999',
  admonymous: 'https://www.admonymous.co/jason-chin',
  savvycal: 'https://savvycal.com/jasonchin098/meet-with-jason',
};
