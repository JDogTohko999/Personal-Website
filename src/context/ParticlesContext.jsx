import React, { createContext, useContext, useState, useRef } from 'react';

const ParticlesContext = createContext();

// Default/starting state — used to initialize and to reset back to.
export const defaultSettings = {
  // Particles enabled
  enabled: true,

  // Interaction mode: 'repulse' or 'attract'
  interactionMode: 'repulse',

  // Particle settings
  particleCount: 40,
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
};

export const useParticles = () => {
  const context = useContext(ParticlesContext);
  if (!context) {
    throw new Error('useParticles must be used within a ParticlesProvider');
  }
  return context;
};

export const ParticlesProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  // Bumped on reset to force the particle canvas to remount to a clean state.
  const [resetNonce, setResetNonce] = useState(0);
  // Shared reference to the live tsparticles container.
  const containerRef = useRef(null);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // The canvas applies the cursor mode to the running container, so switching
  // is just a state change — the particles on screen are never rebuilt.
  const setInteractionMode = (mode) => {
    setSettings(prev => (prev.interactionMode === mode ? prev : { ...prev, interactionMode: mode }));
  };

  const toggleInteractionMode = () => {
    setInteractionMode(settings.interactionMode === 'repulse' ? 'attract' : 'repulse');
  };

  const resetSettings = () => {
    setSettings({ ...defaultSettings });
    setResetNonce(n => n + 1);
  };

  return (
    <ParticlesContext.Provider
      value={{
        settings,
        updateSetting,
        setInteractionMode,
        toggleInteractionMode,
        resetSettings,
        resetNonce,
        containerRef,
      }}
    >
      {children}
    </ParticlesContext.Provider>
  );
};
