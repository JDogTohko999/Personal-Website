import React, { createContext, useContext, useState } from 'react';

const ParticlesContext = createContext();

export const useParticles = () => {
  const context = useContext(ParticlesContext);
  if (!context) {
    throw new Error('useParticles must be used within a ParticlesProvider');
  }
  return context;
};

export const ParticlesProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    // Interaction mode: 'repulse' or 'attract'
    interactionMode: 'repulse',

    // Particle settings
    particleCount: 60,
    particleSize: 4,
    particleSpeed: 1.5,

    // Line settings
    linesEnabled: true,
    lineDistance: 130,
    lineOpacity: 0.4,

    // Interaction strength
    interactionDistance: 120,

    // Movement
    randomMovement: false,
    bounce: false,
  });

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleInteractionMode = () => {
    setSettings(prev => ({
      ...prev,
      interactionMode: prev.interactionMode === 'repulse' ? 'attract' : 'repulse'
    }));
  };

  return (
    <ParticlesContext.Provider value={{ settings, updateSetting, toggleInteractionMode }}>
      {children}
    </ParticlesContext.Provider>
  );
};
