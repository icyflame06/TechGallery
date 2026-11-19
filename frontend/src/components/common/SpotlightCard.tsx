import React, { useRef, useState, useEffect } from 'react';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  spotlightSize?: number;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor = 'rgba(205, 255, 43, 0.08)',
  spotlightSize = 360,
  style = {},
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReducedMotion(true);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPosition({ x, y });

    // Subtle 3D tilt calculation (max ~5.5deg)
    const normX = x / rect.width;
    const normY = y / rect.height;
    const tiltX = (0.5 - normY) * 6;
    const tiltY = (normX - 0.5) * 6;

    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseEnter = () => setIsHovered(true);
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    // Smooth spring back to resting state
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`spotlight-card ${className}`}
      style={{
        position: 'relative',
        transformStyle: 'preserve-3d',
        perspective: 1000,
        transform: (!reducedMotion && isHovered)
          ? `perspective(1000px) rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg) translateY(-4px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered
          ? 'transform 0.12s ease-out, border-color 0.25s ease'
          : 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease',
        ...style,
      }}
      {...props}
    >
      {/* Soft Moving Light Spotlight Effect */}
      <div
        className="spotlight-glow"
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          inset: 0,
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.25s ease',
          background: `radial-gradient(${spotlightSize}px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 75%)`,
          zIndex: 1,
        }}
        aria-hidden="true"
      />

      {/* Travelling Border Highlight */}
      <div
        className="border-highlight"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          pointerEvents: 'none',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
          background: `radial-gradient(240px circle at ${position.x}px ${position.y}px, rgba(205, 255, 43, 0.35), transparent 70%)`,
          zIndex: 2,
          mixBlendMode: 'screen',
        }}
        aria-hidden="true"
      />

      {/* Internal Content with Subtle Parallax Depth */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transform: (!reducedMotion && isHovered)
            ? `translate3d(${(tilt.y * 0.4).toFixed(1)}px, ${(tilt.x * -0.4).toFixed(1)}px, 8px)`
            : 'translate3d(0, 0, 0)',
          transition: isHovered ? 'transform 0.12s ease-out' : 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {children}
      </div>
    </div>
  );
};
