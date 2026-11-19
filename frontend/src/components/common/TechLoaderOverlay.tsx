import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const TechLoaderOverlay: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(12);

  useEffect(() => {
    // If reduced motion is preferred, close immediately
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setLoading(false);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 350);
          return 100;
        }
        return prev + Math.floor(Math.random() * 22 + 14);
      });
    }, 70);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: '#070912',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
          }}
        >
          {/* Ambient Plasma Glow */}
          <div
            style={{
              position: 'absolute',
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0, 229, 255, 0.2) 0%, rgba(65, 105, 255, 0.1) 50%, transparent 70%)',
              filter: 'blur(40px)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.2rem',
              maxWidth: '360px',
              width: '90%',
            }}
          >
            {/* Glowing Logo Node */}
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #00E5FF 0%, #4169FF 100%)',
                boxShadow: '0 0 30px rgba(0, 229, 255, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: '#070912',
                  borderRadius: '2px',
                }}
              />
            </div>

            <div style={{ textAlign: 'center' }}>
              <span
                className="mono"
                style={{
                  fontSize: '0.8rem',
                  letterSpacing: '0.18em',
                  color: 'var(--ink)',
                  fontWeight: 700,
                  display: 'block',
                }}
              >
                TECH GALLERY 2027
              </span>
              <span
                className="mono"
                style={{
                  fontSize: '0.68rem',
                  letterSpacing: '0.1em',
                  color: 'var(--neon-cyan)',
                  marginTop: '4px',
                  display: 'block',
                }}
              >
                INITIALIZING QUANTUM EXHIBITION // {Math.min(100, progress)}%
              </span>
            </div>

            {/* Futuristic Progress Track */}
            <div
              style={{
                width: '100%',
                height: '3px',
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '999px',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <motion.div
                style={{
                  height: '100%',
                  width: `${Math.min(100, progress)}%`,
                  background: 'linear-gradient(90deg, #00E5FF, #4169FF, #9B5CFF)',
                  boxShadow: '0 0 12px #00E5FF',
                  borderRadius: '999px',
                }}
                transition={{ ease: 'easeOut', duration: 0.1 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
