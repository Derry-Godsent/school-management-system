import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useDeviceTier, useMotionAllowed } from '../../lib/useDeviceTier';
import { useReveal } from '../../lib/useReveal';

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
 * Reveal3D: content rotates up into place on a perspective plane as it scrolls
 * into view.
 *
 * This is the effect that carries the impression on phones. It is driven purely
 * by scroll position and `transform`, so it needs no cursor, no gyroscope and no
 * WebGL, and it stays smooth while the user flicks through on a mid-range
 * Android.
 *
 * Two rules keep it honest:
 *
 *  - It only ever runs on `useReveal`, which will not hide anything it has not
 *    measured, and which has three independent ways to bring the content back.
 *    Text can never be left invisible waiting for a callback.
 *  - The rotation is applied to a single block of content, never to a whole
 *    section. A perspective rotation displaces the far edge of an element in Z,
 *    and the size change that causes is proportional to the element's height: on
 *    a 2400px section a 10 degree tilt distorts the top edge by around 20 per
 *    cent. On a 300px block the same angle is under 4 per cent, which reads as
 *    depth rather than damage.
 */
export function Reveal3D({
  children,
  className = '',
  rotate = 10,
  axis = 'x',
  y = 34,
  delay = 0,
  duration = 0.8,
}: Reveal3DProps) {
  const tier = useDeviceTier();
  const allowed = useMotionAllowed(tier);
  const { ref, state } = useReveal(allowed);

  // `hidden` is only ever true when the hook has positively measured this block
  // to be below the fold. Every other state renders it visible.
  const hidden = state === 'hidden';

  const from = {
    opacity: 0,
    y,
    rotateX: axis === 'x' ? rotate : 0,
    rotateY: axis === 'y' ? rotate : 0,
  };
  const to = { opacity: 1, y: 0, rotateX: 0, rotateY: 0 };

  // The DOM shape never changes: one wrapper, one motion child. Switching
  // element types between states would remount the children and reset any state
  // they hold, such as the typed headline partway through a word.
  return (
    <div ref={ref} className={className} style={{ perspective: 1200 }}>
      <motion.div
        initial={false}
        animate={hidden ? from : to}
        transition={
          hidden
            ? { duration: 0 }
            : {
                duration: tier.lowPower ? duration * 0.7 : duration,
                delay,
                ease: [0.22, 1, 0.36, 1],
              }
        }
      >
        {children}
      </motion.div>
    </div>
  );
}

export default Reveal3D;
