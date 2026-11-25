import React from 'react';
import { profile } from '../data/profile.jsx';
import SkyNav from '../components/SkyNav.jsx';
import useTitle from '../lib/useTitle.js';

/*
  The home page is the photograph. In the open sky, top-left, a caption: the name, one line,
  and the tiny lowercase links. Nothing else. The hiker and the ridge stay untouched.
  The intro paragraph and Jason-ing live at the top of /blog; work and achievements on /experience.
*/
export default function Home() {
  useTitle('');
  return (
    <main id="content" className="home">
      <div className="caption">
        <h1 className="caption-name">{profile.name}</h1>
        <p className="caption-line">{profile.oneLiner}</p>
        <SkyNav withDate className="sky-nav-stack" />
      </div>
    </main>
  );
}
