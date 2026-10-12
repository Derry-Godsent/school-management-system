import { useRef } from 'react';
import { motion, useInView, Variant } from 'framer-motion';
import { useReducedMotion } from '../../lib/motion';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  staggerChildren?: boolean;
  staggerDelay?: number;
}

/**
 * ScrollReveal - Generic wrapper that fades and slides children in when they enter viewport.
 * Supports multiple directions and staggered children.
 * Gracefully degrades to static content if reduced motion is preferred.
 */
export function ScrollReveal({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = 30,
  once = true,
  staggerChildren = false,
  staggerDelay = 0.1,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: '-50px' });
  const prefersReducedMotion = useReducedMotion();

  // Calculate initial position based on direction
  const getInitialPosition = (): { x: number; y: number } => {
    switch (direction) {
      case 'up':
        return { x: 0, y: distance };
      case 'down':
        return { x: 0, y: -distance };
      case 'left':
        return { x: distance, y: 0 };
      case 'right':
        return { x: -distance, y: 0 };
      case 'none':
      default:
        return { x: 0, y: 0 };
    }
  };

  const initialPos = getInitialPosition();

  // If reduced motion, render static content
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  // Container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: staggerChildren
        ? {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          }
        : {
            delay,
            duration,
            ease: [0.25, 0.1, 0.25, 1],
          },
    },
  };

  // Item variants (for self or children)
  const itemVariants = {
    hidden: {
      opacity: 0,
      x: initialPos.x,
      y: initialPos.y,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  if (staggerChildren) {
    return (
      <motion.div
        ref={ref}
        className={className}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={itemVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {children}
    </motion.div>
  );
}

/**
 * ScrollRevealChild - Use as direct children of ScrollReveal with staggerChildren=true.
 * Inherits stagger timing from parent.
 */
export function ScrollRevealChild({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  const variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}
