import React from 'react';
import { Link } from 'react-router-dom';
import useTitle from '../lib/useTitle.js';

export default function NotFound() {
  useTitle('Not found');
  return (
    <>
      <h1 className="page-title">Nothing here</h1>
      <p>
        This address doesn&rsquo;t lead anywhere. Go back to <Link to="/">the ridge</Link>, or try{' '}
        <Link to="/blog">the writing</Link>.
      </p>
    </>
  );
}
