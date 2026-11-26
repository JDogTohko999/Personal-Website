import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Me from './pages/Me.jsx';
import Blog from './pages/Blog.jsx';
import BlogPost from './pages/BlogPost.jsx';
import Now from './pages/Now.jsx';
import Vaisi from './pages/Vaisi.jsx';
import Experience from './pages/Experience.jsx';
import NotFound from './pages/NotFound.jsx';

// The map page pulls in d3-geo + topojson; keep it out of the main bundle.
const MapPage = lazy(() => import('./pages/MapPage.jsx'));
const MapPalettes = import.meta.env.DEV ? lazy(() => import('./pages/MapPalettes.jsx')) : null;
const GlobeColours = import.meta.env.DEV ? lazy(() => import('./pages/GlobeColours.jsx')) : null;

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        {/* "about me" is the nav word; /me stays as an alias. */}
        <Route path="/about" element={<Me />} />
        <Route path="/me" element={<Me />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/now" element={<Now />} />
        <Route path="/now/bonus" element={<Now />} />
        {/* "travels" is the nav word (/travels); /places and /map stay as aliases. */}
        {['/travels', '/places', '/map'].map((path) => (
          <Route
            key={path}
            path={path}
            element={
              <Suspense fallback={<p className="quiet">Loading the globe…</p>}>
                <MapPage />
              </Suspense>
            }
          />
        ))}
        {/* Review page for the map colours (not in the nav). */}
        {/* Colour review pages: dev server only, not on the live site. */}
        {import.meta.env.DEV && <Route path="/map-colours" element={<Suspense fallback={null}><MapPalettes /></Suspense>} />}
        {import.meta.env.DEV && <Route path="/globe-colours" element={<Suspense fallback={null}><GlobeColours /></Suspense>} />}
        <Route path="/vaisi" element={<Vaisi />} />
        {/* "involvements" is the nav word; /experience stays as an alias for old links. */}
        <Route path="/involvements" element={<Experience />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
