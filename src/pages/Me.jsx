import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import Jasoning from '../components/Jasoning.jsx';
import useTitle from '../lib/useTitle.js';

/* About me (/about, alias /me). Jason's own words (Nov 2026): a hello ("my corner of the internet"), the AI safety bit, and a
   list of non-AI-safety things he enjoys, with Jason-ing beside it. "sacking" spins Jason-ing
   onto the sacking photo. No visible page title; the h1 is for screen readers only. */
const ext = { target: '_blank', rel: 'noopener noreferrer' };
const A = ({ href, children }) => <a href={href} {...ext}>{children}</a>;
const GAMES = ['krillion.io', 'maptap.gg', 'eraly.io', 'dailyorbs.com'];

export default function Me() {
  useTitle('About me');
  const jas = useRef(null);
  return (
    <>
      <h1 className="visually-hidden">About me</h1>
      <div className="about">
        <div className="about-text">
          <p className="about-hello">Hi, welcome to my corner of the internet! Here&rsquo;s a little about me:</p>
          <p>
            I&rsquo;m a recent grad trying to do my part in making AI go well. Currently, I&rsquo;m working on{' '}
            <A href="https://80000hours.org/ai/">AI safety</A>{' '}
            <A href="https://80000hours.org/career-reviews/ai-safety-fieldbuilding/">field-building</A> in Boston.
            I was quite bullish on <A href="https://kairos-project.org/">strengthening</A> and{' '}
            <A href="https://aisafetyseeding.org/">growing</A> the early-career talent ecosystem.{' '}
            <Link to="/now">Now</Link> I&rsquo;m a bit less sure.
          </p>
          <p>Here are some non-AI safety things I enjoy in no particular order:</p>
          <ul className="enjoy">
            <li>
              <A href="https://www.last.fm/user/JDogTohko999/listening-report/year">music</A> and{' '}
              <A href="https://letterboxd.com/JDogTohko999/">movies</A>
            </li>
            <li>
              <details className="enjoy-more">
                <summary>daily games</summary>
                <ul>
                  {GAMES.map((g) => <li key={g}><A href={`https://${g}`}>{g}</A></li>)}
                </ul>
              </details>
            </li>
            <li>
              <button type="button" className="word enjoy-spin" onClick={() => jas.current?.spinTo('sacking')}>
                sacking
              </button>
            </li>
            <li>hiking, backpacking, camping, etc (being in the backcountry)</li>
            <li>slop bowls</li>
            <li>obtaining books wayyy faster than I read them</li>
            <li>single speed bikes</li>
          </ul>
        </div>
        <Jasoning ref={jas} />
      </div>
    </>
  );
}
