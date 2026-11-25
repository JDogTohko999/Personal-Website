import React, { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Backdrop from './Backdrop.jsx';
import SkyNav from './SkyNav.jsx';

/*
  Two shells over one photo.
    home   the photo is the page; the caption sits top-left in the sky (pages/Home.jsx).
    inner  the photo recedes: a sky-tinted reading panel down the left (desktop), or the photo as
           a short band with the panel below it (under 960px). Same tiny lowercase nav.
*/
export default function Layout() {
  const { pathname, hash } = useLocation();
  const home = pathname === '/';

  // New page: start at the top (unless the URL points at an anchor, e.g. a footnote).
  useEffect(() => {
    if (!hash && pathname !== '/now/bonus') window.scrollTo(0, 0); // /now/bonus scrolls itself to #now-bonus
  }, [pathname, hash]);

  useEffect(() => {
    document.documentElement.dataset.page = home ? 'home' : 'inner';
  }, [home]);

  return (
    <>
      <a className="skip" href="#content">Skip to content</a>
      <Backdrop mode={home ? 'home' : 'inner'} />
      {home ? (
        <Outlet />
      ) : (
        <div className="panel">
          <header className="panel-head">
            <Link to="/" className="panel-name">Jason Chin</Link>
            <SkyNav className="sky-nav-inline" />
          </header>
          <main id="content" className="panel-main" tabIndex={-1}>
            <Outlet />
          </main>
        </div>
      )}
    </>
  );
}
