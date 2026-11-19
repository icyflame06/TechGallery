import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export interface LetterRevealProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  stagger?: number;
  duration?: number;
  yOffset?: number;
  blurAmount?: number;
  once?: boolean;
  amount?: number | 'some' | 'all';
  mode?: 'letter' | 'word';
}

const EASING: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const LetterReveal: React.FC<LetterRevealProps> = ({
  text,
  as: Component = 'span',
  className = '',
  style = {},
  delay = 0.05,
  stagger = 0.028,
  duration = 0.85,
  yOffset = 25,
  blurAmount = 8,
  once = true,
  amount = 0.25,
  mode = 'letter',
}) => {
  const shouldReduceMotion = useReducedMotion();

  // If user requested reduced motion, render immediately and statically
  if (shouldReduceMotion) {
    return (
      <Component className={className} style={style}>
        {text}
      </Component>
    );
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: mode === 'word' ? stagger * 2.5 : stagger,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: yOffset,
      filter: `blur(${blurAmount}px)`,
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration,
        ease: EASING,
      },
    },
  };

  // Split into words
  const words = text.split(' ');

  return (
    <Component className={className} style={style} aria-label={text}>
      {/* Screen-reader friendly hidden text */}
      <span className="sr-only" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
        {text}
      </span>

      <motion.span
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount }}
        variants={containerVariants}
        aria-hidden="true"
        style={{ display: 'inline' }}
      >
        {mode === 'word' ? (
          words.map((word, wordIndex) => (
            <motion.span
              key={`word-${wordIndex}`}
              variants={itemVariants}
              style={{
                display: 'inline-block',
                willChange: 'transform, opacity, filter',
                marginRight: wordIndex < words.length - 1 ? '0.28em' : 0,
              }}
            >
              {word}
            </motion.span>
          ))
        ) : (
          words.map((word, wordIndex) => (
            <span
              key={`w-${wordIndex}`}
              style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
            >
              {word.split('').map((char, charIndex) => (
                <motion.span
                  key={`c-${wordIndex}-${charIndex}`}
                  variants={itemVariants}
                  style={{
                    display: 'inline-block',
                    willChange: 'transform, opacity, filter',
                  }}
                >
                  {char}
                </motion.span>
              ))}
              {wordIndex < words.length - 1 && (
                <span style={{ display: 'inline-block' }}>&nbsp;</span>
              )}
            </span>
          ))
        )}
      </motion.span>
    </Component>
  );
};
