import React, { useState, useRef, useEffect } from 'react';
import { Settings, X, GripHorizontal } from 'lucide-react';
import { useParticles } from '../context/ParticlesContext';

const ParticlesControls = () => {
  const { settings, updateSetting, toggleInteractionMode } = useParticles();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 }); // Distance from bottom-right
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  // Handle drag start
  const handleMouseDown = (e) => {
    if (e.target.closest('.drag-handle')) {
      setIsDragging(true);
      const rect = dragRef.current.getBoundingClientRect();
      offsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      e.preventDefault();
    }
  };

  // Handle drag move
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const newX = window.innerWidth - e.clientX - (dragRef.current.offsetWidth - offsetRef.current.x);
      const newY = window.innerHeight - e.clientY - (dragRef.current.offsetHeight - offsetRef.current.y);

      setPosition({
        x: Math.max(0, Math.min(newX, window.innerWidth - 100)),
        y: Math.max(0, Math.min(newY, window.innerHeight - 100))
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const SliderControl = ({ label, value, min, max, step = 1, onChange }) => (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span>{label}</span>
        <span className="text-portfolio-gold">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-portfolio-border rounded-lg appearance-none cursor-pointer accent-portfolio-gold"
      />
    </div>
  );

  const ToggleControl = ({ label, checked, onChange }) => (
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`w-10 h-5 rounded-full transition-colors relative ${
          checked ? 'bg-portfolio-gold' : 'bg-portfolio-border'
        }`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div
      ref={dragRef}
      className="fixed z-50 select-none"
      style={{
        right: position.x,
        bottom: position.y,
        cursor: isDragging ? 'grabbing' : 'auto'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Main Control Panel */}
      <div className="bg-portfolio-card/95 backdrop-blur-sm border border-portfolio-border rounded-xl shadow-2xl overflow-hidden min-w-[200px]">
        {/* Drag Handle */}
        <div className="drag-handle flex items-center justify-center py-1.5 bg-portfolio-border/30 cursor-grab active:cursor-grabbing">
          <GripHorizontal className="w-4 h-4 text-portfolio-muted" />
        </div>

        {/* Interaction Mode Toggle */}
        <div className="p-3 border-b border-portfolio-border">
          <div className="text-xs text-portfolio-muted mb-2 text-center">Cursor Mode</div>
          <div className="flex rounded-lg overflow-hidden border border-portfolio-border">
            <button
              onClick={() => updateSetting('interactionMode', 'repulse')}
              className={`flex-1 py-2 px-3 text-xs font-medium transition-colors ${
                settings.interactionMode === 'repulse'
                  ? 'bg-portfolio-gold text-portfolio-bg'
                  : 'bg-transparent text-portfolio-text hover:bg-portfolio-border/50'
              }`}
            >
              Repel
            </button>
            <button
              onClick={() => updateSetting('interactionMode', 'attract')}
              className={`flex-1 py-2 px-3 text-xs font-medium transition-colors ${
                settings.interactionMode === 'attract'
                  ? 'bg-portfolio-gold text-portfolio-bg'
                  : 'bg-transparent text-portfolio-text hover:bg-portfolio-border/50'
              }`}
            >
              Attract
            </button>
          </div>
        </div>

        {/* Settings Toggle Button */}
        <button
          onClick={() => setSettingsOpen(!settingsOpen)}
          className="w-full py-2 px-3 flex items-center justify-center gap-2 text-xs text-portfolio-muted hover:text-portfolio-text hover:bg-portfolio-border/30 transition-colors"
        >
          {settingsOpen ? (
            <>
              <X className="w-3 h-3" />
              Close Settings
            </>
          ) : (
            <>
              <Settings className="w-3 h-3" />
              More Settings
            </>
          )}
        </button>

        {/* Expanded Settings Panel */}
        {settingsOpen && (
          <div className="p-3 border-t border-portfolio-border max-h-[300px] overflow-y-auto">
            <div className="text-xs text-portfolio-muted mb-3 font-medium">Particles</div>

            <SliderControl
              label="Count"
              value={settings.particleCount}
              min={10}
              max={200}
              onChange={(v) => updateSetting('particleCount', v)}
            />

            <SliderControl
              label="Size"
              value={settings.particleSize}
              min={1}
              max={10}
              onChange={(v) => updateSetting('particleSize', v)}
            />

            <SliderControl
              label="Speed"
              value={settings.particleSpeed}
              min={0.5}
              max={10}
              step={0.5}
              onChange={(v) => updateSetting('particleSpeed', v)}
            />

            <div className="text-xs text-portfolio-muted mb-3 mt-4 font-medium">Connections</div>

            <ToggleControl
              label="Show Lines"
              checked={settings.linesEnabled}
              onChange={(v) => updateSetting('linesEnabled', v)}
            />

            {settings.linesEnabled && (
              <>
                <SliderControl
                  label="Line Distance"
                  value={settings.lineDistance}
                  min={50}
                  max={300}
                  onChange={(v) => updateSetting('lineDistance', v)}
                />

                <SliderControl
                  label="Line Opacity"
                  value={settings.lineOpacity}
                  min={0.1}
                  max={1}
                  step={0.1}
                  onChange={(v) => updateSetting('lineOpacity', v)}
                />
              </>
            )}

            <div className="text-xs text-portfolio-muted mb-3 mt-4 font-medium">Interaction</div>

            <SliderControl
              label="Cursor Range"
              value={settings.interactionDistance}
              min={50}
              max={400}
              onChange={(v) => updateSetting('interactionDistance', v)}
            />

            <div className="text-xs text-portfolio-muted mb-3 mt-4 font-medium">Behavior</div>

            <ToggleControl
              label="Random Direction"
              checked={settings.randomMovement}
              onChange={(v) => updateSetting('randomMovement', v)}
            />

            <ToggleControl
              label="Bounce on Edges"
              checked={settings.bounce}
              onChange={(v) => updateSetting('bounce', v)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticlesControls;
