import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useParticles } from '../context/ParticlesContext';

// Overlay UI (live counter) kept in its own component so its frequent state
// updates never re-render the <Particles> canvas.
const ParticleOverlay = ({ enabled, containerRef }) => {
  const [count, setCount] = useState(0);

  // Poll the live particle count from the shared container ref
  useEffect(() => {
    const update = () => setCount(containerRef.current?.particles?.count ?? 0);
    update();
    const interval = setInterval(update, 400);
    return () => clearInterval(interval);
  }, [containerRef]);

  if (!enabled) return null;

  return (
    /* Particle counter: bottom-left corner */
    <div className="fixed bottom-4 left-4 z-40 pointer-events-none flex items-center gap-1.5 rounded-full border border-portfolio-border bg-portfolio-card/80 px-3 py-1.5 text-xs font-medium text-portfolio-muted shadow-lg backdrop-blur">
      <Sparkles className="w-3.5 h-3.5 text-portfolio-gold" />
      <span className="tabular-nums text-portfolio-text">{count}</span>
      particles
    </div>
  );
};

const ParticlesBackground = () => {
  const [init, setInit] = useState(false);
  const { theme } = useTheme();
  const { settings, resetNonce, containerRef, pendingCountRef } = useParticles();

  // Capture the live tsparticles container so the overlay can read the count.
  // When a mode switch reloads the canvas, restore the previous particle count
  // (captured in pendingCountRef) so switching attract/repel keeps the same
  // number of particles.
  const particlesLoaded = useCallback(async (loadedContainer) => {
    containerRef.current = loadedContainer ?? null;

    const target = pendingCountRef.current;
    pendingCountRef.current = null;
    if (loadedContainer && target != null) {
      const current = loadedContainer.particles.count;
      if (target > current) {
        loadedContainer.particles.push(target - current);
      } else if (target < current) {
        loadedContainer.particles.removeQuantity(current - target);
      }
    }
  }, [containerRef, pendingCountRef]);

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
        value: { min: 0.1, max: 0.42 },
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
    <>
      <div
        className={`transition-opacity duration-700 ${
          settings.enabled ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <Particles
          key={resetNonce}
          id="tsparticles"
          options={options}
          particlesLoaded={particlesLoaded}
        />
      </div>

      <ParticleOverlay enabled={settings.enabled} containerRef={containerRef} />
    </>
  );
};

export default ParticlesBackground;
