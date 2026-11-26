import React from 'react';
import { profile } from '../data/profile.jsx';
import SkyNav from '../components/SkyNav.jsx';
import SocialIcons from '../components/SocialIcons.jsx';
import useTitle from '../lib/useTitle.js';

/*
  The home page is the photograph. In the open sky, top-left, a caption: the name and the tiny
  lowercase links, with small account icons right under the name. Nothing else (Jason dropped
  the one-liner). The hiker and the ridge stay
  untouched. The intro and Jason-ing live on /about; work and achievements on /involvements.
*/
export default function Home() {
  useTitle('');
  return (
    <main id="content" className="home">
      <div className="caption veil">
        <h1 className="caption-name">{profile.name}</h1>
        <SocialIcons className="socials--name" />
        <SkyNav className="sky-nav-stack" />
      </div>
    </main>
  );
}
