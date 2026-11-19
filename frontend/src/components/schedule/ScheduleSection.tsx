import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LetterReveal } from '../common/LetterReveal';

interface SessionItem {
  time: string;
  title: string;
  venue: string;
  tag: string;
}

interface DaySchedule {
  dayName: string;
  dayNumber: string;
  dateStr: string;
  sessions: SessionItem[];
}

const SCHEDULE_DATA: DaySchedule[] = [
  {
    dayName: 'Mon',
    dayNumber: '18',
    dateStr: '18 January 2027',
    sessions: [
      { time: '10:00', title: 'Opening ceremony & Festival Kickoff', venue: 'Main Atrium', tag: 'Ceremony' },
      { time: '11:30', title: 'Keynote: Hardware that ships', venue: 'Auditorium', tag: 'Talk' },
      { time: '14:00', title: 'Bhavesh Workshop (College Exclusive)', venue: 'Innovation Lab', tag: 'Workshop' },
    ],
  },
  {
    dayName: 'Tue',
    dayNumber: '19',
    dateStr: '19 January 2027',
    sessions: [
      { time: '10:00', title: 'Thakkar Workshop: Embedded Systems & Architecture', venue: 'Lab 2', tag: 'Workshop' },
      { time: '14:00', title: 'Intro to on-device Machine Learning', venue: 'Lab 4', tag: 'Workshop' },
      { time: '16:30', title: 'Open design critique and mentoring', venue: 'Studio', tag: 'Open hour' },
    ],
  },
  {
    dayName: 'Wed',
    dayNumber: '20',
    dateStr: '20 January 2027',
    sessions: [
      { time: '09:00', title: 'Bhavesh Hackathon (College Exclusive 24h sprint)', venue: 'Innovation Lab', tag: 'Hackathon' },
      { time: '13:00', title: 'Panel: open source in college and beyond', venue: 'Auditorium', tag: 'Talk' },
      { time: '15:00', title: 'PCB design basics and rapid prototyping', venue: 'Lab 2', tag: 'Workshop' },
    ],
  },
  {
    dayName: 'Thu',
    dayNumber: '21',
    dateStr: '21 January 2027',
    sessions: [
      { time: '09:00', title: 'Tech Showcase – Day 1 Setup & Opens (All Colleges)', venue: 'Main Atrium', tag: 'Showcase' },
      { time: '11:00', title: 'Prototyping in Figma & interactive micro-frontends', venue: 'Studio', tag: 'Workshop' },
      { time: '15:00', title: 'Talk: robots in the real world', venue: 'Auditorium', tag: 'Talk' },
    ],
  },
  {
    dayName: 'Fri',
    dayNumber: '22',
    dateStr: '22 January 2027',
    sessions: [
      { time: '09:00', title: 'Tech Showcase – Day 2 (All Colleges Open Exhibition)', venue: 'Main Atrium', tag: 'Showcase' },
      { time: '13:00', title: 'Showcase open to visitors & interactive voting', venue: 'Main Atrium', tag: 'Showcase' },
      { time: '17:00', title: 'Evening live hardware demos & lightning pitches', venue: 'Innovation Lab', tag: 'Demo' },
    ],
  },
  {
    dayName: 'Sat',
    dayNumber: '23',
    dateStr: '23 January 2027',
    sessions: [
      { time: '09:00', title: 'Thakkar Hackathon (College Exclusive Challenge)', venue: 'Central Lab', tag: 'Hackathon' },
      { time: '14:00', title: 'Jury walk-through and project assessments', venue: 'Main Atrium', tag: 'Judging' },
      { time: '16:00', title: 'Visitor open day and hands-on testing', venue: 'Main Atrium', tag: 'Showcase' },
    ],
  },
  {
    dayName: 'Sun',
    dayNumber: '24',
    dateStr: '24 January 2027',
    sessions: [
      { time: '10:00', title: 'AI Workshop for Parents (Special family track)', venue: 'Auditorium', tag: 'Workshop' },
      { time: '14:00', title: 'Both Hackathon Results Announced (Bhavesh & Thakkar)', venue: 'Auditorium', tag: 'Ceremony' },
      { time: '16:00', title: 'Grand awards ceremony and festival closing', venue: 'Auditorium', tag: 'Ceremony' },
    ],
  },
];

export const ScheduleSection: React.FC = () => {
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  const activeDay = SCHEDULE_DATA[activeDayIndex];

  return (
    <section className="s" id="schedule">
      <div className="wrap">
        <div className="sh">
          <span className="mono">Schedule</span>
          <LetterReveal as="h2" text="Seven days, one campus." />
        </div>

        {/* 7 Days Tab List matching Tech Gallery 2027.html */}
        <div className="days" role="tablist" aria-label="Festival days">
          {SCHEDULE_DATA.map((day, idx) => (
            <button
              key={day.dayNumber}
              className="day"
              role="tab"
              aria-selected={activeDayIndex === idx}
              onClick={() => setActiveDayIndex(idx)}
            >
              <span className="mono">{day.dayName}</span>
              <b>{day.dayNumber}</b>
            </button>
          ))}
        </div>

        {/* Sessions Panel for the active day with Animated Timeline */}
        <div className="sess" role="tabpanel" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDay.dayNumber}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              {activeDay.sessions.map((sess, idx) => (
                <motion.div
                  key={`${activeDay.dayNumber}-${idx}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="row"
                  style={{ position: 'relative' }}
                >
                  <span className="mono" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: 'var(--lime)',
                        display: 'inline-block',
                      }}
                    />
                    {sess.time}
                  </span>
                  <h3 style={{ margin: 0 }}>{sess.title}</h3>
                  <span className="mono">{sess.venue}</span>
                  <span className="tg">{sess.tag}</span>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Schedule Sub-note */}
        <div
          style={{
            marginTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
          className="mono"
        >
          <span>All tracks hosted on Main Campus · Timings in IST</span>
          <a href="#register" style={{ color: 'var(--accent-text)', textDecoration: 'underline' }}>
            Register for sessions →
          </a>
        </div>
      </div>
    </section>
  );
};

