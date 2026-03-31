import React from 'react';
import { ThemeProvider } from '../context/ThemeContext.jsx';
import { ParticlesProvider } from '../context/ParticlesContext.jsx';
import OldWebsite from './OldWebsite';

export default function OldWebsiteWrapper() {
  return (
    <ThemeProvider>
      <ParticlesProvider>
        <OldWebsite />
      </ParticlesProvider>
    </ThemeProvider>
  );
}
