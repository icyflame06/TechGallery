import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { FAQItem } from '../../types';
import { LetterReveal } from '../common/LetterReveal';

interface FAQSectionProps {
  faqs: FAQItem[];
}

const DEFAULT_FAQS = [
  {
    id: 'f1',
    question: 'Who can attend Tech Gallery?',
    answer:
      'Tech Gallery 2027 welcomes students, educators, tech enthusiasts, and parents. While certain internal workshops and hackathons are exclusive to our college students, the Tech Showcase and exhibition floor are open to all colleges and the public.',
  },
  {
    id: 'f2',
    question: 'Can external college students participate?',
    answer:
      'Yes! External college students can participate exclusively in the Tech Showcase by submitting and exhibiting their hardware or software projects. External students are not eligible for internal workshops or hackathons.',
  },
  {
    id: 'f3',
    question: 'Who can participate in hackathons?',
    answer:
      'Both the Bhavesh Hackathon (20 January) and Thakkar Hackathon (23 January) are strictly exclusive to students of our college. External students are not eligible for either hackathon.',
  },
  {
    id: 'f4',
    question: 'Can students submit hardware projects?',
    answer:
      'Yes! The Hardware Showcase welcomes robotics, IoT, ESP32 and Arduino creations, smart home automation, embedded systems, electronic prototypes, and innovative hardware products.',
  },
  {
    id: 'f5',
    question: 'Can students submit software projects?',
    answer:
      'Yes! The Software Showcase welcomes artificial intelligence, machine learning, web applications, Android apps, AI assistants, SaaS products, desktop tools, and automation software.',
  },
  {
    id: 'f6',
    question: 'How do I register?',
    answer:
      'Use the registration section on this site to select your pass, enter your details, and reserve your place. A unique Registration ID will be issued immediately upon confirmation.',
  },
  {
    id: 'f7',
    question: 'Is there a registration fee?',
    answer:
      'Festival access and student pass tiers are configured directly by the college organising committee. Visitor passes to open exhibition tracks are completely free.',
  },
  {
    id: 'f8',
    question: 'Will participation certificates be provided?',
    answer:
      'Yes. Official certificates of participation and exhibition recognition will be awarded to all verified attendees, workshop attendees, hackathon teams, and showcase exhibitors.',
  },
  {
    id: 'f9',
    question: 'What should I bring to a workshop?',
    answer:
      'A charged laptop and your valid student identity card. Development boards, kits, and components are provided in the designated labs.',
  },
];

export const FAQSection: React.FC<FAQSectionProps> = ({ faqs }) => {
  const displayFaqs = faqs && faqs.length > 0 ? faqs : DEFAULT_FAQS;
  const [openId, setOpenId] = useState<string | null>(displayFaqs[0]?.id || 'f1');

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="s" id="faq">
      <div className="wrap">
        <div className="sh">
          <span className="mono">FAQ</span>
          <LetterReveal as="h2" text="Good to know." />
        </div>

        <div className="faq" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {displayFaqs.map((faq, idx) => {
            const currentId = faq.id || `faq-${idx}`;
            const isOpen = openId === currentId;
            return (
              <div
                key={currentId}
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--r)',
                  transition: 'border-color 0.2s',
                  borderColor: isOpen ? 'var(--lime)' : 'var(--line)',
                  overflow: 'hidden',
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(currentId)}
                  style={{
                    width: '100%',
                    padding: '1.2rem 1.4rem',
                    background: 'none',
                    border: 'none',
                    color: 'var(--ink)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'var(--h)',
                    fontSize: '1.15rem',
                    fontWeight: 700,
                  }}
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <span
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: isOpen ? 'var(--lime)' : 'rgba(255, 255, 255, 0.05)',
                      color: isOpen ? 'var(--limeink)' : 'var(--mute)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.25s',
                    }}
                  >
                    {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div
                        style={{
                          padding: '0 1.4rem 1.3rem',
                          color: 'var(--mute)',
                          fontSize: '0.98rem',
                          lineHeight: '1.65',
                          borderTop: '1px solid rgba(255, 255, 255, 0.04)',
                          paddingTop: '0.9rem',
                        }}
                      >
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
