import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Vaisi from './components/Vaisi';
import Projects from './components/Projects';
import Achievements from './components/Achievements';
import WorldMap from './components/WorldMap';
import Footer from './components/Footer';
import ParticlesBackground from './components/ParticlesBackground';
import ParticlesControls from './components/ParticlesControls';
import EasterEgg from './components/EasterEgg';
import ArtisticAccents from './components/ArtisticAccents';
import Blog from './components/Blog';
import BlogPost from './components/BlogPost';
import Now from './components/Now';
import { useFunMode } from './context/FunModeContext';

// Particles are a mouse toy, so only show them when the main input is a mouse or
// trackpad. This keys off how the visitor points, not screen width, so phones
// and tablets are excluded but a narrow desktop window is not.
const POINTER_QUERY = '(hover: hover) and (pointer: fine)';

const useHasMouse = () => {
  const [hasMouse, setHasMouse] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(POINTER_QUERY).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(POINTER_QUERY);
    const onChange = (e) => setHasMouse(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return hasMouse;
};

function HomePage() {
  const hasMouse = useHasMouse();
  const { funMode } = useFunMode();

  return (
    <div className="min-h-screen flex flex-col font-sans select-none">
      <EasterEgg />
      {/* Fun-mode extras fade in when turned on and out when turned off. */}
      <AnimatePresence>
        {hasMouse && funMode && (
          <motion.div
            key="fun-extras"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            // Everything in here positions itself (the canvas is fullScreen,
            // the controls and counter are fixed), so this wrapper must never
            // take part in layout. Without h-0 the canvas is briefly in flow
            // before tsParticles makes it fixed, which inserts height above
            // the whole page; Chrome's scroll anchoring compensates by pushing
            // scrollTop down and never takes it back once the height vanishes,
            // so turning fun mode on jumped you down the page.
            className="h-0"
            style={{ overflowAnchor: 'none' }}
          >
            <ParticlesBackground />
            <ParticlesControls />
          </motion.div>
        )}
      </AnimatePresence>
      <ArtisticAccents />
      <div className="relative z-10">
        <Navbar />
        <main className="flex-grow">
          <Hero />
          <Experience />
          <Vaisi />
          <Projects />
          <Achievements />
          <WorldMap />
        </main>
        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:id" element={<BlogPost />} />
      <Route path="/now" element={<Now />} />
    </Routes>
  );
}

export default App;
