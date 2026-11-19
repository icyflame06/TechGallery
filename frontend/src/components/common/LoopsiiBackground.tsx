import React from 'react';

export const LoopsiiBackground: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        backgroundColor: '#FBFBFA',
      }}
      aria-hidden="true"
    >
      {/* Delicate Editorial Dot Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(12, 14, 18, 0.07) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          opacity: 0.7,
        }}
      />

      {/* Subtle Corner Editorial Crosshairs */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.15,
        }}
      >
        <line x1="40" y1="20" x2="40" y2="60" stroke="#0C0E12" strokeWidth="1" />
        <line x1="20" y1="40" x2="60" y2="40" stroke="#0C0E12" strokeWidth="1" />

        <line x1="calc(100% - 40px)" y1="20" x2="calc(100% - 40px)" y2="60" stroke="#0C0E12" strokeWidth="1" />
        <line x1="calc(100% - 60px)" y1="40" x2="calc(100% - 20px)" y2="40" stroke="#0C0E12" strokeWidth="1" />
      </svg>
    </div>
  );
};
