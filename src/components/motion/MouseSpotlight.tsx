import { useEffect, useRef } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';
import { useReducedMotion } from '../../lib/motion';

/**
 * MouseSpotlight - A soft radial gradient that follows the cursor across the page.
 * Creates a subtle "everything follows the mouse" effect.
 */
export function MouseSpotlight() {
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const prefersReducedMotion = useReducedMotion();

  const springX = useSpring(mouseX, { stiffness: 100, damping: 30, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30, mass: 0.5 });

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div
      className="fixed inset-0 z-[2] pointer-events-none"
      style={{
        background: `radial-gradient(600px circle at var(--x) var(--y), rgba(232, 93, 4, 0.04), transparent 60%)`,
      }}
    >
      <div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(232, 93, 4, 0.06) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          left: 0,
          top: 0,
        }}
      />
    </div>
  );
}

/**
 * MouseSpotlightCSS - CSS-based version using CSS custom properties.
 * More performant than JS-driven approach.
 */
export function MouseSpotlightCSS() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        containerRef.current.style.setProperty('--x', `${e.clientX}px`);
        containerRef.current.style.setProperty('--y', `${e.clientY}px`);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[2] pointer-events-none"
      style={{
        background: 'radial-gradient(800px circle at var(--x, -200px) var(--y, -200px), rgba(232, 93, 4, 0.045), transparent 60%)',
      }}
    />
  );
}
