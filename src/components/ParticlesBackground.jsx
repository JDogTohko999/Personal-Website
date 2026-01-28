import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useParticles } from '../context/ParticlesContext';

const ParticlesBackground = () => {
  const containerRef = useRef(null);
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

  useEffect(() => {
    let mounted = true;

    const initParticles = () => {
      if (!mounted || !containerRef.current) return;

      // Destroy existing instance first
      if (window.pJSDom && window.pJSDom.length > 0) {
        try {
          window.pJSDom[0].pJS.fn.vendors.destroypJS();
          window.pJSDom = [];
        } catch (e) {
          window.pJSDom = [];
        }
      }

      const particleColor = getParticleColor(theme);

      window.particlesJS('particles-js', {
        particles: {
          number: {
            value: settings.particleCount,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: particleColor
          },
          shape: {
            type: 'circle',
            stroke: {
              width: 0,
              color: '#000000'
            }
          },
          opacity: {
            value: 0.5,
            random: true,
            anim: {
              enable: true,
              speed: 1,
              opacity_min: 0.1,
              sync: false
            }
          },
          size: {
            value: settings.particleSize,
            random: true,
            anim: {
              enable: true,
              speed: 2,
              size_min: 0.1,
              sync: false
            }
          },
          line_linked: {
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
            out_mode: settings.bounce ? 'bounce' : 'out',
            bounce: settings.bounce,
            attract: {
              enable: settings.interactionMode === 'attract',
              rotateX: 600,
              rotateY: 1200
            }
          }
        },
        interactivity: {
          detect_on: 'window',
          events: {
            onhover: {
              enable: true,
              mode: settings.interactionMode === 'attract' ? 'grab' : 'repulse'
            },
            onclick: {
              enable: true,
              mode: 'push'
            },
            resize: true
          },
          modes: {
            grab: {
              distance: settings.interactionDistance,
              line_linked: {
                opacity: 0.8
              }
            },
            repulse: {
              distance: settings.interactionDistance,
              duration: 0.4
            },
            push: {
              particles_nb: 4
            },
            remove: {
              particles_nb: 2
            },
            bubble: {
              distance: settings.interactionDistance,
              size: settings.particleSize * 2,
              duration: 2,
              opacity: 0.8,
              speed: 3
            }
          }
        },
        retina_detect: true
      });
    };

    // Check if particlesJS is already loaded, otherwise wait for it
    if (window.particlesJS) {
      initParticles();
    } else {
      // Poll for particles.js to be available (from CDN)
      const checkInterval = setInterval(() => {
        if (window.particlesJS) {
          clearInterval(checkInterval);
          initParticles();
        }
      }, 100);

      return () => {
        mounted = false;
        clearInterval(checkInterval);
      };
    }

    // Cleanup on unmount
    return () => {
      mounted = false;
      if (window.pJSDom && window.pJSDom.length > 0) {
        try {
          window.pJSDom[0].pJS.fn.vendors.destroypJS();
          window.pJSDom = [];
        } catch (e) {
          window.pJSDom = [];
        }
      }
    };
  }, [theme, settings]); // Re-initialize when theme or settings change

  return (
    <div
      id="particles-js"
      ref={containerRef}
      className="fixed inset-0 z-0"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
      }}
    />
  );
};

export default ParticlesBackground;
