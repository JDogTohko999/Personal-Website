import React, { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Backdrop from './Backdrop.jsx';
import SkyNav from './SkyNav.jsx';

/*
  Two shells over one photo (the same <img>, so moving between pages never reloads it).
    home   the photo is the page; the caption sits top-left in the sky (pages/Home.jsx).
    inner  the photo shrinks to a band across the top, the ridge and the hiker two thirds of the
           way down it, with the name and the links in its sky: the home, condensed. Below it,
           an opaque haze sheet with one centred reading column. One layout at every width.
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
