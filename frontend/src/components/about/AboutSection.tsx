import React from 'react';
import { LetterReveal } from '../common/LetterReveal';

export const AboutSection: React.FC = () => {
  return (
    <section className="s" id="about">
      <div className="wrap">
        <div className="about">
          <span className="mono">About</span>
          <div>
            <LetterReveal
              as="p"
              className="lead"
              text="A week where students build, show and test technology in front of the people who will use it."
            />
            <div className="cols">
              <p>
                Tech Gallery is our annual exhibition of student work. Think of it as a gallery rather than a contest: every project gets a placard, a place to stand, and a visitor who can ask questions.
              </p>
              <p>
                Workshops teach you something new, hackathons push you to make something fast, and the showcase puts finished hardware and software on display.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Interactive Technical Metrics Strip */}
        <div className="stats">
          <div className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
            <span className="mono" style={{ fontSize: '0.62rem', color: 'var(--lime)', letterSpacing: '0.1em' }}>
              TELEMETRY // 01
            </span>
            <b style={{ marginTop: '4px' }}>7</b>
            <span className="mono">days on campus</span>
          </div>
          <div className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
            <span className="mono" style={{ fontSize: '0.62rem', color: 'var(--lime)', letterSpacing: '0.1em' }}>
              CURRICULUM // 02
            </span>
            <b style={{ marginTop: '4px' }}>24</b>
            <span className="mono">workshops and talks</span>
          </div>
          <div className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
            <span className="mono" style={{ fontSize: '0.62rem', color: 'var(--lime)', letterSpacing: '0.1em' }}>
              EXHIBITS // 03
            </span>
            <b style={{ marginTop: '4px' }}>60+</b>
            <span className="mono">projects on display</span>
          </div>
          <div className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
            <span className="mono" style={{ fontSize: '0.62rem', color: 'var(--lime)', letterSpacing: '0.1em' }}>
              SPRINT // 04
            </span>
            <b style={{ marginTop: '4px' }}>36h</b>
            <span className="mono">hackathon window</span>
          </div>
        </div>

        {/* Key Official Rules Strip */}
        <div
          style={{
            marginTop: '2.5rem',
            padding: '1.2rem 1.4rem',
            border: '1px solid var(--line)',
            background: 'var(--card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
          className="mono"
        >
          <span>
            <strong style={{ color: 'var(--ink)' }}>ELIGIBILITY DIRECTIVE:</strong> Bhavesh &amp; Thakkar workshops/hackathons are exclusive to our college students. Tech Showcase is open to all colleges.
          </span>
          <span style={{ color: 'var(--accent-text)' }}>
            18–24 JAN 2027
          </span>
        </div>
      </div>
    </section>
  );
};
