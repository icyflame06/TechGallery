import React from 'react';

interface TechnicalSeparatorProps {
  label?: string;
  code?: string;
}

export const TechnicalSeparator: React.FC<TechnicalSeparatorProps> = ({
  label = 'SYS // TELEMETRY',
  code = 'TG.2027 // NOMINAL',
}) => {
  return (
    <div
      className="tech-separator"
      style={{
        width: '100%',
        maxWidth: '1360px',
        margin: '0 auto',
        padding: '0 var(--pad)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '40px',
        userSelect: 'none',
      }}
      aria-hidden="true"
    >
      <div
        style={{
          position: 'absolute',
          left: 'var(--pad)',
          right: 'var(--pad)',
          top: '50%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(43, 48, 45, 0.6) 20%, rgba(205, 255, 43, 0.35) 50%, rgba(43, 48, 45, 0.6) 80%, transparent)',
        }}
      />
      
      {/* Center Circuit Flow Pulse Node */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '2px 12px',
          background: 'var(--bg)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--r)',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
          zIndex: 2,
        }}
      >
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'var(--lime)',
            boxShadow: '0 0 6px var(--lime)',
            display: 'inline-block',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        />
        <span
          className="mono"
          style={{
            fontSize: '0.68rem',
            color: 'var(--lime)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </span>
      </div>

      <span
        className="mono"
        style={{
          fontSize: '0.65rem',
          color: 'var(--mute)',
          background: 'var(--bg)',
          paddingRight: '8px',
          zIndex: 2,
        }}
      >
        LOC // 23.0338°N 72.5463°E
      </span>

      <span
        className="mono"
        style={{
          fontSize: '0.65rem',
          color: 'var(--mute)',
          background: 'var(--bg)',
          paddingLeft: '8px',
          zIndex: 2,
        }}
      >
        {code}
      </span>
    </div>
  );
};
