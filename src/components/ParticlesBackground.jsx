import React, { useState, useEffect, useMemo } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { useTheme } from '../context/ThemeContext';
import { useParticles } from '../context/ParticlesContext';

const ParticlesBackground = () => {
  const [init, setInit] = useState(false);
  const { theme } = useTheme();
  const { settings } = useParticles();

  // Get particle color based on current theme
  const getParticleColor = (currentTheme) => {
    const colors = {
      default: '#f4cc67',   // Saffron gold
      newspaper: '#000000', // Black
      forest: '#556B2F',    // Moss green
      uva: '#E57200',       // Orange
    };
    return colors[currentTheme] || colors.default;
  };

  // Initialize tsparticles engine once
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particleColor = getParticleColor(theme);

  const options = useMemo(() => ({
    fullScreen: {
      enable: true,
      zIndex: -1
    },
    fpsLimit: 120,
    particles: {
      number: {
        value: settings.particleCount,
        density: {
          enable: true,
          width: 800,
          height: 800
        }
      },
      color: {
        value: particleColor
      },
      shape: {
        type: 'circle'
      },
      opacity: {
        value: { min: 0.1, max: 0.5 },
        animation: {
          enable: true,
          speed: 1,
          sync: false
        }
      },
      size: {
        value: { min: 1, max: settings.particleSize },
        animation: {
          enable: true,
          speed: 2,
          sync: false
        }
      },
      links: {
        enable: settings.linesEnabled,
        distance: settings.lineDistance,
        color: particleColor,
        opacity: settings.lineOpacity,
        width: 1
      },
      move: {
        enable: true,
        speed: settings.particleSpeed,
        direction: 'none',
        random: settings.randomMovement,
        straight: false,
        outModes: {
          default: settings.bounce ? 'bounce' : 'out'
        }
      }
    },
    interactivity: {
      detectsOn: 'window',
      events: {
        onHover: {
          enable: true,
          mode: settings.interactionMode === 'attract' ? 'attract' : 'repulse'
        },
        onClick: {
          enable: true,
          mode: 'push'
        },
        resize: {
          enable: true
        }
      },
      modes: {
        attract: {
          distance: settings.interactionDistance,
          duration: 0.4,
          speed: 3
        },
        repulse: {
          distance: settings.interactionDistance,
          duration: 0.4
        },
        push: {
          quantity: 4
        }
      }
    },
    detectRetina: true
  }), [theme, settings, particleColor]);

  if (!init) {
    return null;
  }

  return (
    <div
      className={`transition-opacity duration-700 ${
        settings.enabled ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <Particles
        id="tsparticles"
        options={options}
      />
    </div>
  );
};

export default ParticlesBackground;
