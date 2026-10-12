// ============================================================================
// MOTION CONFIGURATION
// Centralized animation system for the School Digital Ecosystem.
// All motion values, variants, and hooks live here for consistency.
// ============================================================================

import { useEffect, useState, useRef, useCallback } from 'react';
import { useScroll, useTransform, useMotionValue, useSpring, MotionValue, useAnimationFrame, animate } from 'framer-motion';
import type { Variants, Transition } from 'framer-motion';

// ---------------------------------------------------------------------------
// REDUCED MOTION DETECTION
// ---------------------------------------------------------------------------
export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mql.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}

// ---------------------------------------------------------------------------
// TOUCH DEVICE DETECTION
// ---------------------------------------------------------------------------
export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  return isTouch;
}

// ---------------------------------------------------------------------------
// SCROLL PROGRESS HOOK
// Returns a MotionValue from 0 to 1 representing overall page scroll progress.
// ---------------------------------------------------------------------------
export function useScrollProgress(): MotionValue<number> {
  const { scrollYProgress } = useScroll();
  return scrollYProgress;
}

// ---------------------------------------------------------------------------
// ELEMENT SCROLL PROGRESS
// Returns scroll progress relative to a specific element's position in viewport.
// ---------------------------------------------------------------------------
export function useElementScrollProgress(
  ref: React.RefObject<HTMLElement>,
  offset: [string, string] = ['start end', 'end start']
) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as any,
  });
  return scrollYProgress;
}

// ---------------------------------------------------------------------------
// PARALLAX HOOK
// Returns a transform value for parallax effects based on scroll.
// ---------------------------------------------------------------------------
export function useParallax(
  ref: React.RefObject<HTMLElement>,
  distance: number = 100
): MotionValue<number> {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  return useTransform(scrollYProgress, [0, 1], [-distance, distance]);
}

// ---------------------------------------------------------------------------
// FADE IN ON SCROLL HOOK
// Returns opacity MotionValue that fades in as element enters viewport.
// ---------------------------------------------------------------------------
export function useFadeInOnScroll(
  ref: React.RefObject<HTMLElement>,
  range: [number, number] = [0, 0.3]
): MotionValue<number> {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start start'],
  });
  return useTransform(scrollYProgress, range, [0, 1]);
}

// ---------------------------------------------------------------------------
// COUNTER ANIMATION HOOK
// Animates a number from 0 to target when element is in view.
// ---------------------------------------------------------------------------
export function useCountUp(
  target: number,
  duration: number = 2,
  startOnView: boolean = true
): MotionValue<number> {
  const count = useMotionValue(0);
  const spring = useSpring(count, { damping: 20, stiffness: 100 });

  useEffect(() => {
    if (startOnView) {
      const timer = setTimeout(() => {
        spring.set(target);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      spring.set(target);
    }
  }, [target, spring, startOnView]);

  return spring;
}

// ---------------------------------------------------------------------------
// INTERSECTION OBSERVER HOOK
// Returns whether an element is in the viewport.
// ---------------------------------------------------------------------------
export function useInView(
  ref: React.RefObject<HTMLElement>,
  options: IntersectionObserverInit = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.unobserve(el);
      }
    }, options);

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, options.threshold, options.rootMargin]);

  return inView;
}

// ---------------------------------------------------------------------------
// MOUSE POSITION HOOK
// Tracks mouse position for magnetic/cursor effects.
// ---------------------------------------------------------------------------
export function useMousePosition() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, [x, y]);

  return { x, y };
}

// ---------------------------------------------------------------------------
// EASING CURVES
// ---------------------------------------------------------------------------
export const easings = {
  // Standard easings
  smooth: [0.25, 0.1, 0.25, 1] as const,
  smoothOut: [0.25, 0.1, 0.25, 1] as const,
  smoothIn: [0.42, 0, 0.58, 1] as const,
  
  // Expressive easings
  dramatic: [0.76, 0, 0.24, 1] as const,
  dramaticOut: [0.33, 1, 0.68, 1] as const,
  dramaticIn: [0.32, 0, 0.67, 0] as const,
  
  // Snappy
  snappy: [0.5, 0, 0, 1] as const,
  snappyOut: [0, 0.5, 0, 1] as const,
  
  // Gentle
  gentle: [0.4, 0, 0.2, 1] as const,
  gentleOut: [0.0, 0, 0.2, 1] as const,
  
  // Bounce-like (spring alternative)
  bounce: [0.68, -0.55, 0.265, 1.55] as const,
} as const;

// ---------------------------------------------------------------------------
// TRANSITION PRESETS
// ---------------------------------------------------------------------------
export const transitions = {
  // Page transitions
  page: {
    duration: 0.6,
    ease: easings.dramaticOut as unknown as number[],
  } satisfies Transition,
  
  // Section reveals
  section: {
    duration: 0.8,
    ease: easings.smooth as unknown as number[],
  } satisfies Transition,
  
  // Stagger children
  staggerContainer: {
    staggerChildren: 0.1,
    delayChildren: 0.1,
  } satisfies Transition,
  
  // Quick micro-interaction
  micro: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 30,
  } satisfies Transition,
  
  // Slow cinematic
  cinematic: {
    duration: 1.2,
    ease: easings.dramatic as unknown as number[],
  } satisfies Transition,
} as const;

// ---------------------------------------------------------------------------
// BASE VARIANTS
// Reusable framer-motion variants for common animation patterns.
// ---------------------------------------------------------------------------

// Fade in from below
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.section,
  },
};

// Fade in from above
export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.section,
  },
};

// Fade in from left
export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.section,
  },
};

// Fade in from right
export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.section,
  },
};

// Scale in
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.section,
  },
};

// Stagger container (use on parent)
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitions.staggerContainer,
  },
};

// Stagger item (use on children)
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easings.smooth as unknown as number[],
    },
  },
};

// Page transition variants
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: transitions.page,
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.3, ease: easings.snappy as unknown as number[] },
  },
};

// Clip reveal (for text/image masks)
export const clipReveal: Variants = {
  hidden: { clipPath: 'inset(0 100% 0 0)' },
  visible: {
    clipPath: 'inset(0 0% 0 0)',
    transition: {
      duration: 0.8,
      ease: easings.dramaticOut as unknown as number[],
    },
  },
};

// ---------------------------------------------------------------------------
// DURATION CONSTANTS
// ---------------------------------------------------------------------------
export const durations = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
  cinematic: 1.0,
  dramatic: 1.4,
} as const;

// ---------------------------------------------------------------------------
// DELAY HELPERS
// ---------------------------------------------------------------------------
export function staggerDelay(index: number, base: number = 0.1): number {
  return index * base;
}

// ---------------------------------------------------------------------------
// ACCESSIBILITY: Check if animations should be disabled
// ---------------------------------------------------------------------------
export function shouldReduceMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
