import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Blog from './pages/Blog.jsx';
import BlogPost from './pages/BlogPost.jsx';
import Now from './pages/Now.jsx';
import Vaisi from './pages/Vaisi.jsx';
import Experience from './pages/Experience.jsx';
import NotFound from './pages/NotFound.jsx';

// The map page pulls in d3-geo + topojson; keep it out of the main bundle.
const MapPage = lazy(() => import('./pages/MapPage.jsx'));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/now" element={<Now />} />
        <Route path="/now/bonus" element={<Now />} />
        {/* /places is the page's name in the nav; /map stays as an alias for old links. */}
        {['/places', '/map'].map((path) => (
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
        <Route path="/vaisi" element={<Vaisi />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
