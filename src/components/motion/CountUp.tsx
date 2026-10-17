import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useReducedMotion } from '../../lib/motion';

interface CountUpProps {
  value: number;
  duration?: number;
  delay?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

/**
 * CountUp - Animated number counter that triggers when element enters viewport.
 * Uses spring physics for smooth animation.
 * Gracefully degrades to static number if reduced motion is preferred.
 */
export function CountUp({
  value,
  duration = 2,
  delay = 0,
  className = '',
  prefix = '',
  suffix = '',
  decimals = 0,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [isInView, setIsInView] = useState(false);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => 
    decimals > 0 ? latest.toFixed(decimals) : Math.round(latest).toLocaleString()
  );
  const prefersReducedMotion = useReducedMotion();

  // Intersection Observer to detect when element enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  // Animate when in view
  useEffect(() => {
    if (isInView) {
      if (prefersReducedMotion) {
        count.set(value);
      } else {
        const timer = setTimeout(() => {
          const controls = animate(count, value, {
            duration,
            ease: 'easeOut',
          });
          return () => controls.stop();
        }, delay * 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [isInView, value, duration, delay, count, prefersReducedMotion]);

  // If reduced motion, render static number
  if (prefersReducedMotion) {
    return (
      <span className={className}>
        {prefix}
        {decimals > 0 ? value.toFixed(decimals) : value.toLocaleString()}
        {suffix}
      </span>
    );
  }

  return (
    <motion.span ref={ref} className={className}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </motion.span>
  );
}
