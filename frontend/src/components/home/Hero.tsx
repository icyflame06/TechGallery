import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDown } from 'lucide-react';
import { LetterReveal } from '../common/LetterReveal';
import { FloatingTech3DObjects } from './FloatingTech3DObjects';
import { HolographicCore3D } from './HolographicCore3D';
import { MagneticButton } from '../common/MagneticButton';

interface HeroProps {
  onOpenSubmission?: () => void;
}

export const Hero: React.FC<HeroProps> = () => {
  const [daysLeft, setDaysLeft] = useState<number>(0);
  const [timeDetails, setTimeDetails] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const target = new Date(2027, 0, 18, 9, 0, 0).getTime();
    const update = () => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff > 0) {
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setDaysLeft(d);
        setTimeDetails({ d, h, m, s });
      }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero" id="top">
      {/* Animated Subtle Moving Technical Grid Background */}
      <div className="animated-tech-grid" aria-hidden="true" />

      {/* 3D Floating Technology-Inspired Objects Layer */}
      <FloatingTech3DObjects />

      {/* Exact SVG Circuit with Circuit Flow Animation */}
      <svg
        className="circuit"
        viewBox="0 0 1440 760"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <path id="flow-p1" d="M0 240H320L360 280H640" />
        <path id="flow-p2" d="M1440 120H1160L1120 160H980V320" />
        <path id="flow-p3" d="M1440 560H1200L1160 600H900" />
        <path id="flow-p4" d="M0 640H240V700" />
        <path id="flow-lit" className="lit" pathLength="1" d="M0 400H240L280 440H560V520H800" />

        {/* Dynamic Energy Packet Nodes Traveling Along Paths */}
        <circle r="3" fill="var(--lime)" opacity="0.85">
          <animateMotion
            path="M0 240H320L360 280H640"
            dur="6s"
            repeatCount="indefinite"
          />
        </circle>
        <circle r="3" fill="var(--lime)" opacity="0.85">
          <animateMotion
            path="M1440 120H1160L1120 160H980V320"
            dur="7.5s"
            repeatCount="indefinite"
          />
        </circle>
        <circle r="3" fill="var(--lime)" opacity="0.85">
          <animateMotion
            path="M1440 560H1200L1160 600H900"
            dur="8s"
            repeatCount="indefinite"
          />
        </circle>
        <circle r="3.5" fill="var(--lime)" opacity="0.95">
          <animateMotion
            path="M0 400H240L280 440H560V520H800"
            dur="5s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Terminal Circuit Nodes */}
        <circle cx="640" cy="280" r="5" />
        <circle cx="980" cy="320" r="5" />
        <circle cx="900" cy="600" r="5" />
        <circle cx="240" cy="700" r="5" />
        <circle className="dot" cx="800" cy="520" r="7" />
      </svg>

      <div className="wrap">
        {/* Metarow with Telemetry Badge */}
        <div className="metarow mono">
          <span className="telemetry-badge">
            <span className="pulse-dot" />
            ANNUAL TECHNOLOGY EXHIBITION // LIVE 2027
          </span>
          <span style={{ color: 'var(--mute)' }}>
            LJCCA MAIN CAMPUS · VASTRAPUR, AHMEDABAD
          </span>
          <span id="count" className="telemetry-badge" style={{ borderColor: 'var(--line)', color: 'var(--lime)' }}>
            {daysLeft > 0 ? `OPENS IN ${daysLeft} DAYS` : 'NOW HAPPENING'}
          </span>
        </div>

        {/* Title & 3D Holographic Core Presentation Strip */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
          <h1 className="title" aria-label="Tech Gallery 2027" style={{ zIndex: 3 }}>
            <span className="l1">
              <LetterReveal text="TECH" as="span" delay={0.1} />
              <span className="yr" style={{ display: 'block' }}>2027</span>
            </span>
            <LetterReveal text="GALLERY" as="span" delay={0.25} />
          </h1>

          {/* Central 3D Holographic Core */}
          <div className="hero-hologram-slot" style={{ zIndex: 2 }}>
            <HolographicCore3D />
          </div>
        </div>

        {/* Foot with Tagline, When & Action CTA buttons */}
        <div className="foot">
          <LetterReveal
            as="p"
            className="tag"
            text="Where Ideas Meet Innovation"
            delay={0.45}
          />

          <div className="when">
            <div>
              <span className="mono" style={{ color: 'var(--lime)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Dates &amp; Venue
              </span>
              <br />
              <strong>18–24 January 2027</strong>
            </div>
            <div className="mono" style={{ textAlign: 'right' }}>
              <span style={{ color: 'var(--lime)' }}>07 DAYS</span>
              <br />
              03 TRACKS
            </div>

            <div className="cta">
              <MagneticButton href="#register" className="btn fill">
                Register now
                <ArrowUpRight className="arrow-icon" size={17} />
              </MagneticButton>
              <MagneticButton href="#schedule" className="btn">
                View schedule
                <ArrowDown className="arrow-icon" size={17} />
              </MagneticButton>
            </div>
          </div>
        </div>

        {/* Minimalist Live Digital Countdown Row */}
        <div
          style={{
            marginTop: '2.5rem',
            paddingTop: '1.2rem',
            borderTop: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
          className="mono"
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="pulse-dot" />
            T-MINUS TO KICKOFF // 18 JAN 2027 09:00 IST
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', letterSpacing: '0.04em' }}>
            <span className="countdown-box">
              <strong style={{ color: 'var(--ink)', fontSize: '1rem' }}>{timeDetails.d}</strong>
              <small style={{ color: 'var(--mute)', fontSize: '0.7rem' }}>D</small>
            </span>
            <span className="countdown-box">
              <strong style={{ color: 'var(--ink)', fontSize: '1rem' }}>{timeDetails.h}</strong>
              <small style={{ color: 'var(--mute)', fontSize: '0.7rem' }}>H</small>
            </span>
            <span className="countdown-box">
              <strong style={{ color: 'var(--ink)', fontSize: '1rem' }}>{timeDetails.m}</strong>
              <small style={{ color: 'var(--mute)', fontSize: '0.7rem' }}>M</small>
            </span>
            <span className="countdown-box" style={{ borderColor: 'rgba(205, 255, 43, 0.4)', boxShadow: '0 0 12px rgba(205, 255, 43, 0.15)' }}>
              <strong style={{ color: 'var(--lime)', fontSize: '1rem' }}>{timeDetails.s}</strong>
              <small style={{ color: 'var(--lime)', fontSize: '0.7rem' }}>S</small>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
