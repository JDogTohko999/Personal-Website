import React from 'react';
import { profile } from '../data/profile.jsx';
import Jasoning from '../components/Jasoning.jsx';
import useTitle from '../lib/useTitle.js';

/* About me (/about, alias /me): the longer hello (profile.intro, verbatim) with Jason-ing beside it. The home page keeps
   to one line, so this is where the bio lives; it used to open the writing page. */
export default function Me() {
  useTitle('About me');
  return (
    <>
      <h1 className="page-title">About me</h1>
      <div className="about">
        <p>{profile.intro}</p>
        <Jasoning />
      </div>
    </>
  );
}
