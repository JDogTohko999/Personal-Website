import React from 'react';
// Components will be imported here
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Achievements from './components/Achievements';
import WorldMap from './components/WorldMap';
import Footer from './components/Footer';
import ParticlesBackground from './components/ParticlesBackground';
import ParticlesControls from './components/ParticlesControls';

import ArtisticAccents from './components/ArtisticAccents';

function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <ParticlesBackground />
      <ParticlesControls />
      <ArtisticAccents />
      <div className="relative z-10">
        <Navbar />
        <main className="flex-grow">
          <Hero />
          <Experience />
          <Projects />
          <Achievements />
          <WorldMap />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
