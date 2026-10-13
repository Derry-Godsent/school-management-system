import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useReducedMotion } from '../../lib/motion';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  speed?: number; // -1 to 1, where negative = moves up, positive = moves down
  direction?: 'vertical' | 'horizontal';
}

/**
 * ParallaxImage - Image wrapper that translates on scroll for parallax effect.
 * Uses GPU-composited transform property for smooth performance.
 * Gracefully degrades to static image if reduced motion is preferred.
 */
export function ParallaxImage({
  src,
  alt,
  className = '',
  speed = 0.3,
  direction = 'vertical',
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Calculate transform range based on speed
  const range = speed * 100; // Convert to pixels
  const transformValue = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'vertical' ? [-range, range] : [0, 0]
  );

  const horizontalValue = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'horizontal' ? [-range, range] : [0, 0]
  );

  // If reduced motion, render static image
  if (prefersReducedMotion) {
    return (
      <div className={`overflow-hidden ${className}`}>
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover will-change-transform"
        style={{
          y: transformValue,
          x: horizontalValue,
        }}
      />
    </div>
  );
}
