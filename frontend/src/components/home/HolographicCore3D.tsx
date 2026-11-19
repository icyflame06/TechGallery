import React, { useRef, useEffect, useState } from 'react';

export const HolographicCore3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = 460);
    let height = (canvas.height = 460);

    let angleX = 0;
    let angleY = 0;
    let targetAngleX = 0;
    let targetAngleY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left - rect.width / 2;
      const mouseY = e.clientY - rect.top - rect.height / 2;
      targetAngleY = (mouseX / rect.width) * 1.5;
      targetAngleX = (-mouseY / rect.height) * 1.5;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Generate 3D Vertices for a Dual-Frequency Geodesic Core
    const vertices: { x: number; y: number; z: number }[] = [];
    const phi = (1 + Math.sqrt(5)) / 2;
    const r = 90;

    // Standard Icosahedron base nodes
    const baseNodes = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
    ];

    baseNodes.forEach(([x, y, z]) => {
      const len = Math.sqrt(x * x + y * y + z * z);
      vertices.push({
        x: (x / len) * r,
        y: (y / len) * r,
        z: (z / len) * r
      });
    });

    // Connecting edge pairs
    const edges: [number, number][] = [];
    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        const dx = vertices[i].x - vertices[j].x;
        const dy = vertices[i].y - vertices[j].y;
        const dz = vertices[i].z - vertices[j].z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 115) {
          edges.push([i, j]);
        }
      }
    }

    // Outer revolving orbital rings
    const ringRadius = 155;
    const ringPointsCount = 64;

    let time = 0;

    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      angleX += (targetAngleX - angleX) * 0.08;
      angleY += (targetAngleY - angleY) * 0.08;

      const autoRotY = time * 0.45 + angleY;
      const autoRotX = Math.sin(time * 0.3) * 0.25 + angleX;

      const cosY = Math.cos(autoRotY);
      const sinY = Math.sin(autoRotY);
      const cosX = Math.cos(autoRotX);
      const sinX = Math.sin(autoRotX);

      const centerX = width / 2;
      const centerY = height / 2;

      // 1. Draw Ambient Central Plasma Glow
      const glowGrad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, 140);
      glowGrad.addColorStop(0, 'rgba(0, 229, 255, 0.45)');
      glowGrad.addColorStop(0.35, 'rgba(65, 105, 255, 0.25)');
      glowGrad.addColorStop(0.7, 'rgba(155, 92, 255, 0.12)');
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Project & Draw Rotating Outer Holographic Orbital Ring
      ctx.beginPath();
      for (let i = 0; i <= ringPointsCount; i++) {
        const theta = (i / ringPointsCount) * Math.PI * 2 + time * 0.6;
        const rx = Math.cos(theta) * ringRadius;
        const ry = Math.sin(theta) * (ringRadius * 0.35);
        const rz = Math.sin(theta) * (ringRadius * 0.65);

        // Rotate
        const x1 = rx * cosY - rz * sinY;
        const z1 = rx * sinY + rz * cosY;
        const y1 = ry * cosX - z1 * sinX;
        const z2 = ry * sinX + z1 * cosX;

        const scale = 360 / (360 + z2);
        const px = centerX + x1 * scale;
        const py = centerY + y1 * scale;

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.55)';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#00E5FF';
      ctx.shadowBlur = 12;
      ctx.stroke();

      // Second Counter-Rotating Purple Accent Ring
      ctx.beginPath();
      for (let i = 0; i <= ringPointsCount; i++) {
        const theta = (i / ringPointsCount) * Math.PI * 2 - time * 0.5;
        const rx = Math.cos(theta) * (ringRadius * 0.85);
        const ry = Math.sin(theta) * (ringRadius * 0.85);
        const rz = 0;

        const rotTilt = 0.8;
        const y0 = ry * Math.cos(rotTilt) - rz * Math.sin(rotTilt);
        const z0 = ry * Math.sin(rotTilt) + rz * Math.cos(rotTilt);

        const x1 = rx * cosY - z0 * sinY;
        const z1 = rx * sinY + z0 * cosY;
        const y1 = y0 * cosX - z1 * sinX;
        const z2 = y0 * sinX + z1 * cosX;

        const scale = 360 / (360 + z2);
        const px = centerX + x1 * scale;
        const py = centerY + y1 * scale;

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = 'rgba(155, 92, 255, 0.5)';
      ctx.lineWidth = 1.2;
      ctx.shadowColor = '#9B5CFF';
      ctx.shadowBlur = 10;
      ctx.stroke();

      // 3. Project Core 3D Vertices
      const projected = vertices.map((v) => {
        // Rotation around Y
        const x1 = v.x * cosY - v.z * sinY;
        const z1 = v.x * sinY + v.z * cosY;

        // Rotation around X
        const y1 = v.y * cosX - z1 * sinX;
        const z2 = v.y * sinX + z1 * cosX;

        // Perspective scale
        const scale = 360 / (360 + z2);
        return {
          x: centerX + x1 * scale,
          y: centerY + y1 * scale,
          z: z2,
          scale,
        };
      });

      // 4. Draw Core Wireframe Edges
      edges.forEach(([i, j]) => {
        const p1 = projected[i];
        const p2 = projected[j];
        const depthAlpha = Math.max(0.15, Math.min(0.9, (p1.z + p2.z + 180) / 360));

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(0, 229, 255, ${depthAlpha * 0.75})`;
        ctx.lineWidth = 1.2;
        ctx.shadowColor = '#00E5FF';
        ctx.shadowBlur = 8;
        ctx.stroke();
      });

      // 5. Draw Glowing Core Vertices Nodes
      projected.forEach((p) => {
        const nodeAlpha = Math.max(0.25, Math.min(1, (p.z + 120) / 240));
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5 * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(248, 250, 255, ${nodeAlpha})`;
        ctx.shadowColor = '#00E5FF';
        ctx.shadowBlur = 12;
        ctx.fill();
      });

      // 6. Draw Orbiting Photon Packets
      const packetCount = 3;
      for (let k = 0; k < packetCount; k++) {
        const packetTheta = time * 1.8 + (k * Math.PI * 2) / packetCount;
        const prx = Math.cos(packetTheta) * ringRadius;
        const pry = Math.sin(packetTheta) * (ringRadius * 0.35);
        const prz = Math.sin(packetTheta) * (ringRadius * 0.65);

        const x1 = prx * cosY - prz * sinY;
        const z1 = prx * sinY + prz * cosY;
        const y1 = pry * cosX - z1 * sinX;
        const z2 = pry * sinX + z1 * cosX;

        const scale = 360 / (360 + z2);
        const px = centerX + x1 * scale;
        const py = centerY + y1 * scale;

        ctx.beginPath();
        ctx.arc(px, py, 4.5 * scale, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#00E5FF';
        ctx.shadowBlur = 16;
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      className="holographic-core-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        width: '460px',
        height: '460px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        pointerEvents: 'auto',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          filter: isHovered ? 'brightness(1.15)' : 'none',
          transition: 'filter 0.3s',
        }}
      />

      {/* Floating Cybernetic Telemetry Labels */}
      <div
        className="mono"
        style={{
          position: 'absolute',
          top: '20px',
          right: '10px',
          padding: '4px 10px',
          background: 'rgba(17, 24, 39, 0.75)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 229, 255, 0.3)',
          borderRadius: '4px',
          fontSize: '0.68rem',
          color: 'var(--neon-cyan)',
          letterSpacing: '0.08em',
          boxShadow: '0 0 15px rgba(0, 229, 255, 0.2)',
        }}
      >
        CORE // Q-NEURAL 2030
      </div>

      <div
        className="mono"
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '12px',
          padding: '4px 10px',
          background: 'rgba(17, 24, 39, 0.75)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(155, 92, 255, 0.35)',
          borderRadius: '4px',
          fontSize: '0.65rem',
          color: 'var(--purple-accent)',
          letterSpacing: '0.08em',
          boxShadow: '0 0 15px rgba(155, 92, 255, 0.2)',
        }}
      >
        BANDWIDTH // 12.8 TB/s
      </div>
    </div>
  );
};
