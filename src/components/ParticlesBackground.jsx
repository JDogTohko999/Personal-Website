import React, { useState, useEffect, useMemo, useCallback, useRef, memo } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useParticles } from '../context/ParticlesContext';

// Memoized so a re-render of the background (settings changing, theme toggling)
// never hands <Particles> a fresh props object — that would tear down and
// rebuild the canvas, wiping every particle currently on screen.
const MemoizedParticles = memo(Particles);

// Particles added per click — mirrors interactivity.modes.push.quantity below.
const PUSH_QUANTITY = 4;
// Spamming threshold: more than this many particles created within one second.
const SPAM_PARTICLES_PER_SECOND = 12;
const RECORD_MESSAGE = 'record is 5k, set by elias k';
// How long the record message lingers before it fades back out.
const RECORD_VISIBLE_MS = 3000;
const RECORD_FADE_MS = 500;

// Fades a note in just above the cursor once someone starts spam-clicking
// particles into existence. Separate component so its state churn never
// reaches the <Particles> canvas.
const RecordHint = ({ enabled }) => {
  const [hint, setHint] = useState(null);
  const [visible, setVisible] = useState(false);
  const clickTimesRef = useRef([]);
  const timersRef = useRef([]);
  const frameRef = useRef(null);
  // Latch: the note fires once per burst of spamming, not once per click.
  const armedRef = useRef(true);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const clearTimers = () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };

    const handleClick = (event) => {
      const now = Date.now();
      const recent = clickTimesRef.current.filter((t) => now - t < 1000);
      const wasSpamming = recent.length * PUSH_QUANTITY > SPAM_PARTICLES_PER_SECOND;
      recent.push(now);
      clickTimesRef.current = recent;

      // Clicking has dropped back under the threshold, so the burst is over and
      // the next one may show the note again.
      if (!wasSpamming) {
        armedRef.current = true;
      }

      if (!armedRef.current || recent.length * PUSH_QUANTITY <= SPAM_PARTICLES_PER_SECOND) {
        return;
      }
      // Fires only on the click that starts a burst; it then stays quiet until
      // the spamming stops, so the note always fades after RECORD_VISIBLE_MS.
      armedRef.current = false;

      // Keep the note on screen even when the cursor is near an edge.
      const x = Math.min(Math.max(event.clientX, 150), window.innerWidth - 150);
      const y = Math.max(event.clientY, 60);

      clearTimers();
      setHint({ x, y });
      // Next frame, so the element mounts at opacity 0 and then transitions in.
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        setVisible(true);
      });
      timersRef.current.push(
        setTimeout(() => setVisible(false), RECORD_VISIBLE_MS),
        setTimeout(() => setHint(null), RECORD_VISIBLE_MS + RECORD_FADE_MS)
      );
    };

    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
      clearTimers();
    };
  }, [enabled]);

  if (!enabled || !hint) return null;

  return (
    <div
      className={`fixed z-40 pointer-events-none -translate-x-1/2 -translate-y-full text-center text-xs font-medium text-portfolio-muted transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ left: hint.x, top: hint.y - 18 }}
    >
      {RECORD_MESSAGE}
    </div>
  );
};

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
      <span className="text-portfolio-muted/70">· click to create more</span>
    </div>
  );
};

const ParticlesBackground = () => {
  const [init, setInit] = useState(false);
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
          settings.enabled ? 'opacity-100' : 'opacity-0 pointer-events-none'
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
      <RecordHint enabled={settings.enabled} />
    </>
  );
};

export default ParticlesBackground;
