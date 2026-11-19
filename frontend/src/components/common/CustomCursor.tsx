import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  // Smooth spring configuration for the trailing ring
  const springConfig = { damping: 20, stiffness: 250, mass: 0.2 };
  const cursorX = useSpring(-100, springConfig);
  const cursorY = useSpring(-100, springConfig);

  useEffect(() => {
    // Disable on touch screens or small devices
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    // Detect clickable element hovering
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.closest('a') ||
          target.closest('button') ||
          target.closest('input') ||
          target.closest('select') ||
          target.closest('.plate') ||
          target.closest('summary') ||
          target.closest('[role="button"]') ||
          target.closest('[role="tab"]'))
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    window.addEventListener('mouseover', onMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('mouseover', onMouseOver);
    };
  }, [cursorX, cursorY, isVisible]);

  if (isTouch || !isVisible) return null;

  return (
    <>
      {/* 1. Leading Laser Dot */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: '#00E5FF',
          boxShadow: '0 0 10px #00E5FF, 0 0 20px #00E5FF',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: `translate3d(${mousePosition.x - 3}px, ${mousePosition.y - 3}px, 0)`,
          transition: 'opacity 0.2s',
        }}
      />

      {/* 2. Trailing Magnetic Spring Ring */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovered ? '54px' : '32px',
          height: isHovered ? '54px' : '32px',
          borderRadius: '50%',
          border: '1.5px solid rgba(0, 229, 255, 0.55)',
          backgroundColor: isHovered ? 'rgba(0, 229, 255, 0.08)' : 'transparent',
          boxShadow: isHovered
            ? '0 0 20px rgba(0, 229, 255, 0.4), inset 0 0 10px rgba(65, 105, 255, 0.3)'
            : '0 0 8px rgba(65, 105, 255, 0.2)',
          pointerEvents: 'none',
          zIndex: 9998,
          x: cursorX,
          y: cursorY,
          translateX: isHovered ? '-27px' : '-16px',
          translateY: isHovered ? '-27px' : '-16px',
          transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s, border-color 0.2s',
        }}
      />
    </>
  );
};
