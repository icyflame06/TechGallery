import React, { useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Sparkles, Terminal, Cpu, Award, ArrowUpRight } from 'lucide-react';

interface Pillar {
  id: string;
  number: string;
  dates: string;
  tag: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  bgClass: string;
  textColor: string;
  borderColor: string;
  highlights: string[];
}

const PILLARS: Pillar[] = [
  {
    id: 'pillar-1',
    number: '01',
    dates: '18 – 19 JANUARY 2027',
    tag: 'WORKSHOPS // STAGE A',
    title: 'Hands-on Technical Masterclasses',
    description: 'An intensive two-day engineering dive with Bhavesh Workshop and Thakkar Workshop. Designed to deepen practical systems architecture, hands-on labs, and emerging tech stacks.',
    icon: <Terminal size={28} />,
    bgClass: 'pastel-blue-card',
    textColor: '#1B3C68',
    borderColor: 'rgba(27,60,104,0.18)',
    highlights: ['Campus Auditorium / Main Lab A', 'College ID Mandatory', 'Full Completion Certificates'],
  },
  {
    id: 'pillar-2',
    number: '02',
    dates: '20 & 23 JANUARY 2027',
    tag: 'HACKATHONS // 24H CODE SPRINT',
    title: 'The Overnight Code Sprints',
    description: 'Rapid prototyping at scale. 24 hours of non-stop coding, problem-solving, and algorithmic challenges across Bhavesh Hackathon and Thakkar Hackathon.',
    icon: <Cpu size={28} />,
    bgClass: 'pastel-peach-card',
    textColor: '#6A3414',
    borderColor: 'rgba(106,52,20,0.18)',
    highlights: ['2 to 4 Student Teams', 'Central Computing Lab', 'Overnight Hardware Access'],
  },
  {
    id: 'pillar-3',
    number: '03',
    dates: '21 – 22 JANUARY 2027',
    tag: 'EXPO // OPEN TO ALL COLLEGES',
    title: 'The Flagship Tech Showcase Arena',
    description: 'Two days of public exhibition welcoming students from all colleges nationwide. Innovators demonstrate live working hardware robotics, IoT rigs, and AI applications to visiting industry juries.',
    icon: <Sparkles size={28} />,
    bgClass: 'plate',
    textColor: '#0C0E12',
    borderColor: '#0C0E12',
    highlights: ['Open Nationally', 'Hardware & Software Tracks', 'Industry Feedback & Awards'],
  },
  {
    id: 'pillar-4',
    number: '04',
    dates: '24 JANUARY 2027',
    tag: 'GRAND FINALE // AI SUMMIT',
    title: 'Community AI Summit & Award Ceremony',
    description: 'Demystifying AI for parents, families, and guardians, followed by the official announcement of hackathon winners and the festival grand finale celebration.',
    icon: <Award size={28} />,
    bgClass: 'pastel-lavender-card',
    textColor: '#372464',
    borderColor: 'rgba(55,36,100,0.18)',
    highlights: ['Family Friendly', 'Hackathon Results Announcement', 'Closing Festival Keynote'],
  },
];

interface PinnedExhibitionJourneyProps {
  onSelectRegister?: (eventId: string) => void;
}

export const PinnedExhibitionJourney: React.FC<PinnedExhibitionJourneyProps> = ({ onSelectRegister }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const stage = Math.min(PILLARS.length - 1, Math.floor(latest * PILLARS.length));
    setActiveStage(stage);
  });

  return (
    <section ref={containerRef} className="s" style={{ position: 'relative' }}>
      <div className="wrap">
        <div className="journey-grid">
          {/* Left Column: Sticky Editorial Storyboard Header */}
          <div
            style={{
              position: 'sticky',
              top: '120px',
              paddingBottom: '40px',
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span style={{ fontSize: '1.2rem', color: '#0C0E12' }}>✻</span>
              <span className="mono" style={{ fontWeight: 600 }}>
                STORYLINE // 02
              </span>
            </div>

            <h2 style={{ marginBottom: '20px', letterSpacing: '-0.04em' }}>
              THE 7-DAY ARCHITECTURE
            </h2>

            <p style={{ fontSize: '1.15rem', color: 'var(--ink-secondary)', lineHeight: 1.5, marginBottom: '32px', maxWidth: '36ch' }}>
              From initial masterclass deep dives to overnight code sprints and an international-standard showcase arena.
            </p>

            {/* Interactive Stage Progress Bar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {PILLARS.map((p, idx) => (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 14px',
                    borderRadius: '999px',
                    background: activeStage === idx ? 'var(--electric-lime)' : 'transparent',
                    border: activeStage === idx ? '1px solid #0C0E12' : '1px solid transparent',
                    color: '#0C0E12',
                    fontFamily: 'var(--m)',
                    fontSize: '0.8rem',
                    fontWeight: activeStage === idx ? 700 : 500,
                    transition: 'all 0.25s ease',
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: activeStage === idx ? '#0C0E12' : 'rgba(12,14,18,0.2)',
                    }}
                  />
                  <span>
                    PHASE {p.number} — {p.dates}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '36px' }}>
              <a href="#schedule" className="btn btn-black" style={{ padding: '0.75rem 1.4rem' }}>
                <span>View Full Timetable</span>
                <ArrowUpRight size={15} />
              </a>
            </div>
          </div>

          {/* Right Column: Scrolling Cards with Scale & Polish */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {PILLARS.map((pillar, index) => (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  background: pillar.id === 'pillar-3' ? 'var(--electric-lime)' : undefined,
                  borderColor: pillar.id === 'pillar-3' ? '#0C0E12' : pillar.borderColor,
                }}
                className={`plate ${pillar.id !== 'pillar-3' ? pillar.bgClass : ''}`}
              >
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div>
                    <span
                      style={{
                        fontFamily: 'var(--m)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: pillar.textColor,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {pillar.tag}
                    </span>
                    <div style={{ fontFamily: 'var(--m)', fontSize: '0.85rem', fontWeight: 600, color: pillar.textColor, opacity: 0.8, marginTop: '2px' }}>
                      {pillar.dates}
                    </div>
                  </div>

                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '16px',
                      background: 'rgba(255, 255, 255, 0.7)',
                      border: `1px solid ${pillar.borderColor}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: pillar.textColor,
                    }}
                  >
                    {pillar.icon}
                  </div>
                </div>

                {/* Big Number & Title */}
                <div style={{ fontFamily: 'var(--h)', fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800, color: pillar.textColor, lineHeight: 1, marginBottom: '14px' }}>
                  {pillar.title}
                </div>

                {/* Description */}
                <p style={{ color: pillar.textColor, opacity: 0.88, fontSize: '1.05rem', lineHeight: 1.55, marginBottom: '24px' }}>
                  {pillar.description}
                </p>

                {/* Highlights Pills */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {pillar.highlights.map((h, i) => (
                    <span
                      key={i}
                      style={{
                        padding: '6px 12px',
                        background: 'rgba(255, 255, 255, 0.85)',
                        border: `1px solid ${pillar.borderColor}`,
                        borderRadius: '999px',
                        fontFamily: 'var(--m)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: pillar.textColor,
                      }}
                    >
                      • {h}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .journey-grid {
            grid-template-columns: 1fr !important;
          }
          .journey-grid > div:first-child {
            position: relative !important;
            top: 0 !important;
          }
        }
      `}</style>
    </section>
  );
};
