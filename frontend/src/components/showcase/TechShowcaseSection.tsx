import React, { useState } from 'react';
import { ProjectRecord } from '../../types';
import { LetterReveal } from '../common/LetterReveal';
import { InfiniteCardsMarquee } from '../common/InfiniteCardsMarquee';
import { SpotlightCard } from '../common/SpotlightCard';

interface TechShowcaseSectionProps {
  projects: ProjectRecord[];
  onOpenSubmission?: () => void;
}

interface StaticPlacard {
  id: string;
  type: 'hw' | 'sw';
  code: string;
  category: string;
  title: string;
  description: string;
  by: string;
  svg: React.ReactNode;
}

const STATIC_PLATES: StaticPlacard[] = [
  {
    id: 'p1',
    type: 'hw',
    code: 'TG-H01',
    category: 'Hardware',
    title: 'Soil Sense',
    description: 'A low-cost sensor mesh that tells small farms when and where to water.',
    by: 'Electronics Society',
    svg: (
      <svg viewBox="0 0 300 170" aria-hidden="true">
        <path d="M30 130H110V70H190V40H270" />
        <circle cx="110" cy="70" r="6" className="f" />
        <circle cx="270" cy="40" r="6" />
      </svg>
    ),
  },
  {
    id: 'p2',
    type: 'sw',
    code: 'TG-S01',
    category: 'Software',
    title: 'Notebook Lens',
    description: 'Turns photographed handwritten notes into searchable, linked study cards.',
    by: 'Computer Science, Year 3',
    svg: (
      <svg viewBox="0 0 300 170" aria-hidden="true">
        <path d="M110 55L70 85L110 115M190 55L230 85L190 115" />
        <rect x="132" y="70" width="36" height="30" className="f" />
      </svg>
    ),
  },
  {
    id: 'p3',
    type: 'hw',
    code: 'TG-H02',
    category: 'Hardware',
    title: 'Arm 5',
    description: 'A five-axis desktop robotic arm, 3D printed and driven by open firmware.',
    by: 'Robotics Club',
    svg: (
      <svg viewBox="0 0 300 170" aria-hidden="true">
        <rect x="90" y="40" width="120" height="90" />
        <path d="M90 70H210M120 40V130" />
        <circle cx="165" cy="100" r="10" className="f" />
      </svg>
    ),
  },
  {
    id: 'p4',
    type: 'sw',
    code: 'TG-S02',
    category: 'Software',
    title: 'Campus Graph',
    description: 'A map of lab equipment and free hours so students stop hunting for a bench.',
    by: 'Information Technology',
    svg: (
      <svg viewBox="0 0 300 170" aria-hidden="true">
        <circle cx="150" cy="85" r="8" className="f" />
        <circle cx="80" cy="50" r="5" />
        <circle cx="220" cy="55" r="5" />
        <circle cx="90" cy="125" r="5" />
        <circle cx="215" cy="120" r="5" />
        <path d="M150 85L80 50M150 85L220 55M150 85L90 125M150 85L215 120" />
      </svg>
    ),
  },
  {
    id: 'p5',
    type: 'hw',
    code: 'TG-H03',
    category: 'Hardware',
    title: 'Pulse Band',
    description: 'A wearable that tracks heart rate variability and flags fatigue during study.',
    by: 'Biomedical Engineering',
    svg: (
      <svg viewBox="0 0 300 170" aria-hidden="true">
        <path d="M60 120Q110 30 150 85T240 50" />
        <rect x="138" y="73" width="24" height="24" className="f" />
      </svg>
    ),
  },
  {
    id: 'p6',
    type: 'sw',
    code: 'TG-S03',
    category: 'Software',
    title: 'Open Viva',
    description: 'A practice tool that asks follow-up questions the way a real examiner would.',
    by: 'AI & Data Science',
    svg: (
      <svg viewBox="0 0 300 170" aria-hidden="true">
        <rect x="70" y="45" width="160" height="80" />
        <path d="M70 65H230M90 85H150M90 100H190" />
        <rect x="170" y="80" width="40" height="10" className="f" />
      </svg>
    ),
  },
];

export const TechShowcaseSection: React.FC<TechShowcaseSectionProps> = ({
  projects,
  onOpenSubmission,
}) => {
  const [filter, setFilter] = useState<'all' | 'hw' | 'sw'>('all');

  const filteredStatic = STATIC_PLATES.filter((p) => {
    if (filter === 'all') return true;
    return p.type === filter;
  });

  const filteredDynamic = projects.filter((p) => {
    if (filter === 'all') return true;
    const cat = p.category.toLowerCase();
    if (filter === 'hw') return cat.includes('hardware');
    if (filter === 'sw') return cat.includes('software');
    return true;
  });

  const renderPlateCard = (plate: StaticPlacard, uniqueKey?: string) => (
    <SpotlightCard key={uniqueKey || plate.id} className="plate" data-t={plate.type}>
      <div className="art">
        {/* Technical Scanner Effect Line */}
        <div className="scanner-line" aria-hidden="true" />
        <div className="tech-badge-overlay mono">
          <span>{plate.code}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span className="pulse-dot" style={{ width: '4px', height: '4px' }} />
            {plate.type === 'hw' ? 'HW // SCAN' : 'SW // SCAN'}
          </span>
        </div>
        {plate.svg}
      </div>
      <div className="pb">
        <div className="top mono">
          <span className="code-tag">{plate.code}</span>
          <span className="cat-pill">{plate.category}</span>
        </div>
        <h3>{plate.title}</h3>
        <p>{plate.description}</p>
        <div className="by mono">{plate.by}</div>
      </div>
    </SpotlightCard>
  );

  const renderDynamicCard = (project: ProjectRecord, idx: number, uniqueKey?: string) => {
    const isHw = project.category.toLowerCase().includes('hardware');
    const code = `TG-${isHw ? 'H' : 'S'}${String(idx + 10).padStart(2, '0')}`;
    return (
      <SpotlightCard key={uniqueKey || project.id} className="plate" data-t={isHw ? 'hw' : 'sw'}>
        <div className="art">
          {/* Technical Scanner Effect Line */}
          <div className="scanner-line" aria-hidden="true" />
          <div className="tech-badge-overlay mono">
            <span>{code}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <span className="pulse-dot" style={{ width: '4px', height: '4px' }} />
              {isHw ? 'HW // SCAN' : 'SW // SCAN'}
            </span>
          </div>
          <svg viewBox="0 0 300 170" aria-hidden="true">
            <rect x="50" y="50" width="200" height="70" />
            <circle cx="150" cy="85" r="12" className="f" />
            <path d="M50 85H138M162 85H250" />
          </svg>
        </div>
        <div className="pb">
          <div className="top mono">
            <span className="code-tag">{code}</span>
            <span className="cat-pill">{project.category}</span>
          </div>
          <h3>{project.project_name}</h3>
          <p>{project.description}</p>
          <div className="by mono">
            {project.student_name} · {project.college_name}
          </div>
        </div>
      </SpotlightCard>
    );
  };

  // Dedicated Rows for Two-Row Infinite Marquee
  const hwCards = [
    ...STATIC_PLATES.filter((p) => p.type === 'hw').map((plate) => renderPlateCard(plate, `hw-${plate.id}`)),
    ...projects
      .filter((p) => p.category.toLowerCase().includes('hardware'))
      .map((proj, idx) => renderDynamicCard(proj, idx, `hw-dyn-${proj.id}`)),
  ];

  const swCards = [
    ...STATIC_PLATES.filter((p) => p.type === 'sw').map((plate) => renderPlateCard(plate, `sw-${plate.id}`)),
    ...projects
      .filter((p) => !p.category.toLowerCase().includes('hardware'))
      .map((proj, idx) => renderDynamicCard(proj, idx, `sw-dyn-${proj.id}`)),
  ];

  return (
    <section className="s" id="showcase">
      <div className="wrap">
        <div className="sh">
          <span className="mono">Tech showcase</span>
          <LetterReveal as="h2" text="On display this year." />
        </div>

        {/* Action Header Strip */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.6rem',
          }}
        >
          {/* Exact Filter Chips */}
          <div className="filters" role="group" aria-label="Filter projects" style={{ marginBottom: 0 }}>
            <button
              className="chip"
              aria-pressed={filter === 'all'}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className="chip"
              aria-pressed={filter === 'hw'}
              onClick={() => setFilter('hw')}
            >
              Hardware
            </button>
            <button
              className="chip"
              aria-pressed={filter === 'sw'}
              onClick={() => setFilter('sw')}
            >
              Software
            </button>
          </div>

          <a
            href="#register"
            className="btn"
            style={{ padding: '0.55rem 1.1rem', fontSize: '0.9rem' }}
          >
            Exhibit your project →
          </a>
        </div>

        {/* Official Banner Note */}
        <p className="mono" style={{ marginBottom: '1.5rem', color: 'var(--ink)' }}>
          “Students from all colleges are welcome to exhibit their hardware and software projects. Register below with a Project Showcasing pass to unlock your project submission upon admin review.”
        </p>

        {/* Card Collections: 2-Row Infinite Marquee on 'All' / Filtered Grid on Specific Selection */}
        {filter === 'all' ? (
          <InfiniteCardsMarquee
            row1Cards={hwCards}
            row2Cards={swCards}
            speedSeconds={40}
          />
        ) : (
          <div className="plates">
            {filteredStatic.map((plate) => renderPlateCard(plate))}
            {filteredDynamic.map((project, idx) => renderDynamicCard(project, idx))}
          </div>
        )}

        {/* Disciplines Specification Breakdown */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginTop: '3.5rem',
            paddingTop: '2.5rem',
            borderTop: '1px solid var(--line)',
          }}
        >
          <div style={{ background: 'var(--card)', padding: '1.5rem', border: '1px solid var(--line)' }}>
            <h4 style={{ margin: '0 0 0.8rem', fontFamily: 'var(--h)', fontSize: '1.15rem' }}>
              Hardware Showcase
            </h4>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--mute)', fontSize: '0.9rem', lineHeight: '1.7' }}>
              <li>Robotics</li>
              <li>IoT (Internet of Things)</li>
              <li>ESP32 and Arduino projects</li>
              <li>Smart Home Automation</li>
              <li>Embedded Systems</li>
              <li>Electronic Prototypes</li>
              <li>Innovative Hardware Products</li>
            </ul>
          </div>

          <div style={{ background: 'var(--card)', padding: '1.5rem', border: '1px solid var(--line)' }}>
            <h4 style={{ margin: '0 0 0.8rem', fontFamily: 'var(--h)', fontSize: '1.15rem' }}>
              Software Showcase
            </h4>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--mute)', fontSize: '0.9rem', lineHeight: '1.7' }}>
              <li>Artificial Intelligence</li>
              <li>Machine Learning</li>
              <li>Web Applications</li>
              <li>Android Applications</li>
              <li>AI Assistants</li>
              <li>SaaS Products</li>
              <li>Desktop Applications &amp; Automation Software</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
