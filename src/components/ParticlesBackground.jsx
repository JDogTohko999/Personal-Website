import React, { useState, useEffect, useMemo, useCallback, useRef, memo } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useParticles } from '../context/ParticlesContext';
import Leaderboard from './Leaderboard';

// Memoized so a re-render of the background (settings changing, theme toggling)
// never hands <Particles> a fresh props object — that would tear down and
// rebuild the canvas, wiping every particle currently on screen.
const MemoizedParticles = memo(Particles);

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
    /* Bottom-left corner: leaderboard stacked on the particle counter. It
       grows upward when opened, since the stack is pinned to the bottom. */
    <div className="fixed bottom-7 left-7 z-40 pointer-events-none flex flex-col items-start gap-2">
      <Leaderboard />
      <div className="flex items-center gap-1.5 rounded-full border border-portfolio-border bg-portfolio-card/80 px-3 py-1.5 text-xs font-medium text-portfolio-muted shadow-lg backdrop-blur">
        <Sparkles className="w-3.5 h-3.5 text-portfolio-gold" />
        <span className="tabular-nums text-portfolio-text">{count}</span>
        particles
        <span className="text-portfolio-muted/70">· click to create more</span>
      </div>
    </div>
  );
};

const ParticlesBackground = () => {
  const [init, setInit] = useState(false);
  // False until the first canvas has particles, so it fades in rather than
  // popping in after the engine finishes loading.
  const [ready, setReady] = useState(false);
  const { theme } = useTheme();
  const { settings, resetNonce, containerRef } = useParticles();

  const hoverMode = settings.interactionMode === 'attract' ? 'attract' : 'repulse';
  // Read inside the options memo so a genuine reload starts in the current mode
  // without the mode itself being a reason to rebuild the canvas.
  const hoverModeRef = useRef(hoverMode);
  hoverModeRef.current = hoverMode;

  // Capture the live tsparticles container so the overlay can read the count.
  const particlesLoaded = useCallback(async (loadedContainer) => {
    containerRef.current = loadedContainer ?? null;
    // Next frame, so the canvas paints once at opacity 0 before transitioning.
    requestAnimationFrame(() => setReady(true));
  }, [containerRef]);

  // Switching attract/repel is applied straight to the running container. The
  // interactors read this value every frame, so the change takes effect
  // immediately and the existing particles are left untouched.
  useEffect(() => {
    const onHover = containerRef.current?.actualOptions?.interactivity?.events?.onHover;
    if (onHover) {
      onHover.mode = hoverMode;
    }
  }, [hoverMode, containerRef]);

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
          mode: hoverModeRef.current
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
    // interactionMode is deliberately absent: it is applied live above instead
    // of rebuilding the canvas, which would reset the particle count.
  }), [
    particleColor,
    settings.particleCount,
    settings.particleSize,
    settings.particleSpeed,
    settings.linesEnabled,
    settings.lineDistance,
    settings.lineOpacity,
    settings.interactionDistance,
    settings.randomMovement,
    settings.bounce
  ]);

  if (!init) {
    return null;
  }

  return (
    <>
      <div
        className={`transition-opacity duration-700 ${
          settings.enabled && ready ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <MemoizedParticles
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
