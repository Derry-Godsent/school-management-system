import { useRef, type ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';
import { useDeviceTier, useMotionAllowed } from '../../lib/useDeviceTier';

interface Reveal3DProps {
  children: ReactNode;
  className?: string;
  /** Degrees of rotation on the given axis at the start of the animation. */
  rotate?: number;
  /** Which axis the plane rotates around as it arrives. */
  axis?: 'x' | 'y';
  /** Vertical travel in px. */
  y?: number;
  delay?: number;
  duration?: number;
}

/**
 * Reveal3D: content rotates up into place on a perspective plane as it
 * scrolls into view.
 *
 * This is the effect that carries the impression on phones: it is driven purely
 * by scroll position and `transform`, so it needs no cursor, no gyroscope and
 * no WebGL, and it stays smooth while the user flicks through on a mid-range
 * Android.
 */
export function Reveal3D({
  children,
  className = '',
  rotate = 16,
  axis = 'x',
  y = 48,
  delay = 0,
  duration = 0.85,
}: Reveal3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const tier = useDeviceTier();
  const allowed = useMotionAllowed(tier);
  const inView = useInView(ref, { once: true, margin: '-12% 0px -12% 0px' });

  if (!allowed) {
    return <div className={className}>{children}</div>;
  }

  const hidden = {
    opacity: 0,
    y,
    rotateX: axis === 'x' ? rotate : 0,
    rotateY: axis === 'y' ? rotate : 0,
  };

  return (
    <div ref={ref} className={className} style={{ perspective: 1200 }}>
      <motion.div
        initial={hidden}
        animate={inView ? { opacity: 1, y: 0, rotateX: 0, rotateY: 0 } : hidden}
        transition={{
          duration: tier.lowPower ? duration * 0.6 : duration,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default Reveal3D;
