import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const LoopsiiLoader: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check if previously loaded in this browser session
    const hasLoaded = sessionStorage.getItem('tg27_loopsii_loaded');
    if (hasLoaded) {
      setIsVisible(false);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
            sessionStorage.setItem('tg27_loopsii_loaded', 'true');
          }, 400);
          return 100;
        }
        const increment = Math.floor(Math.random() * 14) + 6;
        return Math.min(100, prev + increment);
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="loopsii-loader"
          initial={{ y: 0 }}
          exit={{ y: '-100%', transition: { duration: 0.85, ease: [0.85, 0, 0.15, 1] } }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: '#FBFBFA',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 'clamp(24px, 5vw, 56px)',
            color: '#0C0E12',
            pointerEvents: 'auto',
          }}
        >
          {/* Top Metadata Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '3px',
                  backgroundColor: '#D4FF00',
                  border: '1px solid #0C0E12',
                  display: 'inline-block',
                }}
              />
              <span style={{ fontFamily: 'var(--m)', fontSize: '0.8rem', letterSpacing: '0.04em', fontWeight: 600 }}>
                TECH GALLERY 2027 // EXHIBITION
              </span>
            </div>

            <span style={{ fontFamily: 'var(--m)', fontSize: '0.8rem', color: '#646B79' }}>
              LJCCA • AHMEDABAD • 18–24 JAN
            </span>
          </div>

          {/* Center Geometric Visual + Typography */}
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
            {/* Rotating Geometric Asterisk */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
              style={{
                width: '72px',
                height: '72px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3.6rem',
                color: '#0C0E12',
                lineHeight: 1,
              }}
            >
              ✻
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{
                fontSize: 'clamp(2.5rem, 8vw, 6rem)',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                lineHeight: 0.95,
                margin: 0,
              }}
            >
              WHERE IDEAS MEET INNOVATION
            </motion.h1>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span
                style={{
                  background: '#D4FF00',
                  color: '#0C0E12',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  border: '1px solid #0C0E12',
                  fontFamily: 'var(--m)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                LIVE ACCESS
              </span>
              <span style={{ fontFamily: 'var(--m)', fontSize: '0.8rem', color: '#646B79' }}>
                CREATIVE TECHNOLOGY PLATFORM
              </span>
            </div>
          </div>

          {/* Bottom Kinetic Progress Counter */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div
                style={{
                  width: 'clamp(140px, 20vw, 240px)',
                  height: '4px',
                  background: 'rgba(12, 14, 18, 0.08)',
                  borderRadius: '999px',
                  overflow: 'hidden',
                  marginBottom: '8px',
                }}
              >
                <motion.div
                  style={{
                    height: '100%',
                    background: '#0C0E12',
                    width: `${progress}%`,
                    borderRadius: '999px',
                  }}
                />
              </div>
              <span style={{ fontFamily: 'var(--m)', fontSize: '0.75rem', color: '#646B79' }}>
                INITIALIZING ASSETS // {progress}%
              </span>
            </div>

            <div
              style={{
                fontFamily: 'var(--h)',
                fontSize: 'clamp(3rem, 8vw, 6rem)',
                fontWeight: 800,
                lineHeight: 0.85,
                letterSpacing: '-0.04em',
              }}
            >
              {String(progress).padStart(2, '0')}%
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
