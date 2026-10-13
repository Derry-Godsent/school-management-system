import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useReducedMotion, staggerDelay } from '../../lib/motion';

interface TextRevealProps {
  children: string;
  as?: 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  className?: string;
  delay?: number;
  staggerDuration?: number;
  mode?: 'word' | 'line';
}

/**
 * TextReveal - Reveals text word-by-word or line-by-line using staggered animation.
 * Gracefully degrades to static text if reduced motion is preferred.
 */
export function TextReveal({
  children,
  as: Component = 'div',
  className = '',
  delay = 0,
  staggerDuration = 0.08,
  mode = 'word',
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const prefersReducedMotion = useReducedMotion();

  // Split text into words or lines
  const items = mode === 'word' 
    ? children.split(' ')
    : children.split('\n').filter(line => line.trim());

  // If reduced motion, render static text
  if (prefersReducedMotion) {
    const MotionComponent = motion[Component as keyof typeof motion] as any;
    return (
      <MotionComponent className={className}>
        {children}
      </MotionComponent>
    );
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: delay,
        staggerChildren: staggerDuration,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      y: '100%',
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const MotionComponent = motion[Component as keyof typeof motion] as any;

  return (
    <MotionComponent
      ref={ref}
      className={`overflow-hidden ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {items.map((item, index) => (
        <motion.span
          key={index}
          className="inline-block"
          variants={itemVariants}
          style={{ marginRight: mode === 'word' ? '0.25em' : 0 }}
        >
          {item}
          {mode === 'word' && index < items.length - 1 && '\u00A0'}
        </motion.span>
      ))}
    </MotionComponent>
  );
}
