import React from 'react';
import { Link } from 'react-router-dom';
import useTitle from '../lib/useTitle.js';

export default function NotFound() {
  useTitle('Not found');
  return (
    <>
      <h1>Not found</h1>
      <p>
        There is nothing at this address. <Link to="/">Go home</Link>, or try{' '}
        <Link to="/blog">the writing</Link>.
      </p>
    </>
  );
}
