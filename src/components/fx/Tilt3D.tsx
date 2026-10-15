import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { useDeviceTier, useMotionAllowed } from '../../lib/useDeviceTier';

interface Tilt3DProps {
  children: ReactNode;
  className?: string;
  /** Maximum rotation in degrees at the extremes. */
  max?: number;
  /** Scale applied while the pointer is over the element. */
  scale?: number;
  /** Vertical drift, in px, as the element crosses the viewport. */
  scrollDrift?: number;
}

/**
 * Tilt3D — gives a plane real perspective depth.
 *
 * Two input paths so it is alive on every device:
 *  - Fine pointer: the plane follows the cursor.
 *  - Touch: the plane leans with scroll position, since there is no cursor and
 *    gyroscope access needs a permission prompt we should not ambush people with.
 *
 * Both paths animate only `transform`, and the whole thing is skipped for
 * reduced-motion users and weak devices.
 */
export function Tilt3D({
  children,
  className = '',
  max = 10,
  scale = 1.02,
  scrollDrift = 0,
}: Tilt3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const tier = useDeviceTier();
  const allowed = useMotionAllowed(tier);

  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);

  const spring = { stiffness: 140, damping: 18, mass: 0.4 };
  const smoothX = useSpring(pointerX, spring);
  const smoothY = useSpring(pointerY, spring);

  // Scroll-linked lean, used on touch where there is no cursor to follow.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const scrollLean = useTransform(scrollYProgress, [0, 1], [max * 0.6, -max * 0.6]);
  const drift = useTransform(scrollYProgress, [0, 1], [scrollDrift, -scrollDrift]);

  const rotateY = useTransform(smoothX, [0, 1], [-max, max]);
  const rotateX = useTransform(smoothY, [0, 1], [max, -max]);

  const usePointer = allowed && tier.canHover && !tier.isTouch;

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!usePointer || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width);
    pointerY.set((event.clientY - rect.top) / rect.height);
  };

  const handlePointerLeave = () => {
    pointerX.set(0.5);
    pointerY.set(0.5);
  };

  // Reduced motion / low power: render the children plainly.
  if (!allowed) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={className}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ perspective: 1000 }}
    >
      <motion.div
        style={{
          transformStyle: 'preserve-3d',
          rotateX: usePointer ? rotateX : scrollLean,
          rotateY: usePointer ? rotateY : 0,
          y: usePointer ? 0 : drift,
          scale: 1,
        }}
        whileHover={usePointer ? { scale } : undefined}
        transition={{ type: 'spring', ...spring }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default Tilt3D;
