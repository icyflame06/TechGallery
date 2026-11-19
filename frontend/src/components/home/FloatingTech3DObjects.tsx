import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export const FloatingTech3DObjects: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isReduced, setIsReduced] = useState(false);
  const [activeChip, setActiveChip] = useState(false);

  // Mouse parallax motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120, mass: 0.2 };
  const rotateX = useSpring(mouseY, springConfig);
  const rotateY = useSpring(mouseX, springConfig);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsReduced(true);
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (isReduced) return;
      const { innerWidth, innerHeight } = window;
      // Normalized between -1 and 1
      const normX = (e.clientX / innerWidth - 0.5) * 2;
      const normY = (e.clientY / innerHeight - 0.5) * 2;

      // Rotation range: up to 14 degrees
      mouseX.set(normX * 14);
      mouseY.set(-normY * 12);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isReduced, mouseX, mouseY]);

  if (isReduced) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="floating-tech-container"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        perspective: 1200,
        overflow: 'hidden',
        zIndex: 2,
      }}
      aria-hidden="true"
    >
      {/* 3D Parallax Stage */}
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          rotateX,
          rotateY,
        }}
      >
        {/* Dynamic Connection Lines Between Tech Nodes */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          <line
            x1="76%"
            y1="22%"
            x2="88%"
            y2="46%"
            stroke="var(--line)"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
          <line
            x1="88%"
            y1="46%"
            x2="72%"
            y2="76%"
            stroke="var(--line)"
            strokeWidth="1"
            strokeDasharray="3 5"
          />
          {/* Animated Energy Flow Along Connection */}
          <line
            x1="76%"
            y1="22%"
            x2="88%"
            y2="46%"
            stroke="var(--lime)"
            strokeWidth="1.2"
            strokeDasharray="12 120"
            className="pulse-flow-line"
          />
        </svg>

        {/* ------------------------------------------------------------------
            OBJECT 1: High-Performance Quantum Microprocessor (CPU Package)
            Floating on the right upper-middle region
           ------------------------------------------------------------------ */}
        <div
          className="tech-3d-object chip-object"
          onMouseEnter={() => setActiveChip(true)}
          onMouseLeave={() => setActiveChip(false)}
          style={{
            position: 'absolute',
            right: '8%',
            top: '24%',
            width: '240px',
            height: '240px',
            transformStyle: 'preserve-3d',
            transform: 'translateZ(65px) rotateX(24deg) rotateY(-28deg) rotateZ(12deg)',
            pointerEvents: 'auto',
            cursor: 'pointer',
          }}
        >
          {/* Outer Substrate PCB Layer */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: '#1A1E1C',
              border: '1px solid var(--line)',
              borderRadius: '6px',
              boxShadow: activeChip
                ? '0 30px 60px -12px rgba(0, 0, 0, 0.9), 0 0 25px rgba(205, 255, 43, 0.25)'
                : '0 25px 50px -12px rgba(0, 0, 0, 0.85), 0 0 15px rgba(0, 0, 0, 0.5)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Corner Gold Alignment Notches */}
            <div style={{ position: 'absolute', top: 6, left: 6, width: 8, height: 8, borderLeft: '2px solid var(--lime)', borderTop: '2px solid var(--lime)' }} />
            <div style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRight: '2px solid var(--lime)', borderTop: '2px solid var(--lime)' }} />
            <div style={{ position: 'absolute', bottom: 6, left: 6, width: 8, height: 8, borderLeft: '2px solid var(--lime)', borderBottom: '2px solid var(--lime)' }} />
            <div style={{ position: 'absolute', bottom: 6, right: 6, width: 8, height: 8, borderRight: '2px solid var(--lime)', borderBottom: '2px solid var(--lime)' }} />

            {/* Perimeter Microchip Contact Pins */}
            <div className="chip-pins-top" />
            <div className="chip-pins-bottom" />
            <div className="chip-pins-left" />
            <div className="chip-pins-right" />
          </div>

          {/* Elevated Silicon Core (Heat Spreader) */}
          <div
            style={{
              position: 'absolute',
              inset: '30px',
              background: '#141716',
              border: '1px solid ' + (activeChip ? 'var(--lime)' : 'var(--line)'),
              borderRadius: '4px',
              transform: 'translateZ(24px)',
              transformStyle: 'preserve-3d',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px',
              boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.08), 0 12px 24px rgba(0, 0, 0, 0.7)',
              transition: 'border-color 0.25s',
            }}
          >
            {/* Silicon Die Grid */}
            <div
              style={{
                position: 'absolute',
                inset: '8px',
                backgroundImage: 'radial-gradient(var(--line) 1px, transparent 1px)',
                backgroundSize: '10px 10px',
                opacity: 0.7,
              }}
            />

            {/* Center Core Chip Logo */}
            <div
              style={{
                width: '32px',
                height: '32px',
                background: 'var(--card)',
                border: '1px solid var(--lime)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 2,
                boxShadow: '0 0 12px rgba(205, 255, 43, 0.2)',
              }}
            >
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  background: 'var(--lime)',
                  borderRadius: '1px',
                  animation: 'pulse 2s infinite',
                }}
              />
            </div>

            {/* Engraved Typography */}
            <span
              className="mono"
              style={{
                fontSize: '0.68rem',
                color: 'var(--ink)',
                fontWeight: 700,
                letterSpacing: '0.12em',
                marginTop: '10px',
                zIndex: 2,
              }}
            >
              TG-2027 // ARCH-X
            </span>
            <span
              className="mono"
              style={{
                fontSize: '0.55rem',
                color: activeChip ? 'var(--lime)' : 'var(--mute)',
                letterSpacing: '0.08em',
                zIndex: 2,
                transition: 'color 0.2s',
              }}
            >
              QPU // 3nm LATTICE
            </span>
          </div>

          {/* Interactive Floating HUD Telemetry Badge */}
          <div
            className="mono"
            style={{
              position: 'absolute',
              top: '-32px',
              left: '50%',
              transform: 'translateX(-50%) translateZ(45px)',
              background: 'var(--card)',
              border: '1px solid var(--line)',
              padding: '3px 10px',
              borderRadius: '2px',
              fontSize: '0.62rem',
              color: 'var(--lime)',
              letterSpacing: '0.08em',
              whiteSpace: 'nowrap',
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.6)',
              opacity: activeChip ? 1 : 0.75,
              transition: 'all 0.25s',
            }}
          >
            SYS.NODE // ONLINE [4.8 GHz]
          </div>
        </div>

        {/* ------------------------------------------------------------------
            OBJECT 2: Revolving Holographic Gyro / Robotic Servo Ring
            Floating upper right
           ------------------------------------------------------------------ */}
        <div
          className="tech-3d-object gyro-object"
          style={{
            position: 'absolute',
            right: '25%',
            top: '12%',
            width: '140px',
            height: '140px',
            transformStyle: 'preserve-3d',
            transform: 'translateZ(45px) rotateX(45deg) rotateY(-20deg)',
          }}
        >
          {/* Outer Gimbal Ring */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '1.5px dashed var(--line)',
              animation: 'spin 24s linear infinite',
            }}
          />
          {/* Inner Fast Ring */}
          <div
            style={{
              position: 'absolute',
              inset: '16px',
              borderRadius: '50%',
              border: '1px solid var(--line)',
              borderTopColor: 'var(--lime)',
              borderBottomColor: 'var(--lime)',
              animation: 'spin 12s linear infinite reverse',
            }}
          />
          {/* Center Precision Bearing */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: 'var(--card)',
              border: '1.5px solid var(--lime)',
              boxShadow: '0 0 10px rgba(205, 255, 43, 0.4)',
            }}
          />
          <span
            className="mono"
            style={{
              position: 'absolute',
              bottom: '-18px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '0.55rem',
              color: 'var(--mute)',
              letterSpacing: '0.1em',
              whiteSpace: 'nowrap',
            }}
          >
            ACTUATOR // G-01
          </span>
        </div>

        {/* ------------------------------------------------------------------
            OBJECT 3: Micro Circuit PCB Board with Capacitors & Routing
            Floating lower right
           ------------------------------------------------------------------ */}
        <div
          className="tech-3d-object pcb-object"
          style={{
            position: 'absolute',
            right: '18%',
            top: '64%',
            width: '160px',
            height: '110px',
            transformStyle: 'preserve-3d',
            transform: 'translateZ(30px) rotateX(-20deg) rotateY(32deg) rotateZ(-8deg)',
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderRadius: '4px',
            padding: '10px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.75)',
          }}
        >
          {/* SMD Capacitors and Integrated Resistors */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
            <div style={{ width: '14px', height: '8px', background: '#3A3F3C', border: '1px solid var(--line)' }} />
            <div style={{ width: '14px', height: '8px', background: '#3A3F3C', border: '1px solid var(--line)' }} />
            <div style={{ width: '22px', height: '8px', background: '#252926', border: '1px solid var(--lime)' }} />
          </div>

          {/* Etched Traces */}
          <svg width="100%" height="45" style={{ display: 'block' }}>
            <path d="M10 10H60L80 30H130" stroke="var(--line)" strokeWidth="1.2" fill="none" />
            <path d="M10 24H50L65 38H120" stroke="var(--line)" strokeWidth="1" fill="none" />
            <circle cx="130" cy="30" r="3" fill="var(--lime)" />
            <circle cx="120" cy="38" r="2.5" fill="var(--line)" />
          </svg>

          <div
            className="mono"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.52rem',
              color: 'var(--mute)',
              marginTop: '4px',
            }}
          >
            <span>BUS-04</span>
            <span style={{ color: 'var(--lime)' }}>IO-LINK</span>
          </div>
        </div>

        {/* ------------------------------------------------------------------
            OBJECT 4: Floating Hexagonal Tech Coordinates Lattice
           ------------------------------------------------------------------ */}
        <div
          className="tech-3d-object hex-lattice"
          style={{
            position: 'absolute',
            right: '34%',
            top: '48%',
            transformStyle: 'preserve-3d',
            transform: 'translateZ(50px) rotateX(15deg) rotateY(-15deg)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(26, 30, 28, 0.85)',
              backdropFilter: 'blur(8px)',
              border: '1px solid var(--line)',
              padding: '4px 10px',
              borderRadius: '2px',
            }}
          >
            <span
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: 'var(--lime)',
                boxShadow: '0 0 6px var(--lime)',
              }}
            />
            <span className="mono" style={{ fontSize: '0.62rem', color: 'var(--ink)' }}>
              EXPO GRID // 23.0338°N 72.5463°E
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
