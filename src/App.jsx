import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Experience from './components/Experience';
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

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <EasterEgg />
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:id" element={<BlogPost />} />
    </Routes>
  );
}

export default App;
