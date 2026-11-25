import React, { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Backdrop from './Backdrop.jsx';
import LookSwitcher from './LookSwitcher.jsx';
import SkyNav from './SkyNav.jsx';

/*
  Two shells over one photo (the same <img>, so moving between pages never reloads it).
    home   the photo is the page; the caption sits top-left in the sky (pages/Home.jsx).
    inner  the photo stays full screen behind the page (as on the home); the name and links sit in
           its sky, and an opaque haze sheet with one reading column scrolls over it (hung from
           the left on wide screens so the hiker stays in view; centred below 1100px).
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
      <LookSwitcher />
      {home ? (
        <Outlet />
      ) : (
        <>
          <header className="band-head veil">
            <Link to="/" className="band-name">Jason Chin</Link>
            <SkyNav className="sky-nav-inline" />
          </header>
          <div className="sheet">
            <main id="content" className="column" tabIndex={-1}>
              <Outlet />
            </main>
          </div>
        </>
      )}
    </>
  );
}
