import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { cn } from '../../lib/cn';
import { useDeviceTier, useMotionAllowed } from '../../lib/useDeviceTier';

interface ScrollStageProps {
  children: ReactNode;
  /**
   * Goes on the outer frame, behind the plane. Pass the section's own
   * background here so the frame never shows a different colour through the
   * gap the rotation opens up.
   */
  className?: string;
  /** Multiplier on the rotation and scale. 1 is the house setting. */
  depth?: number;
  /** Which way the plane tips as it arrives. */
  tilt?: 'up' | 'down' | 'left' | 'right';
  /** Set false for sections that already move, e.g. the hero. */
  enabled?: boolean;
}

/**
 * ScrollStage: turns a section into a plane on a shared 3D stage.
 *
 * While a section is below the fold it sits tipped away from the viewer. As it
 * travels through the middle of the viewport it settles flat and full size, and
 * as it leaves it tips away again in the other direction. Because the rotation
 * is tied continuously to scroll position rather than fired once, the page
 * reads as a stack of planes moving through space instead of a column of flat
 * blocks sliding past.
 *
 * The offset window is `start end` to `end start`, so a stage fills its whole
 * travel across the viewport with movement, with a long flat hold in the middle
 * where the content is being read.
 */
export function ScrollStage({
  children,
  className = '',
  depth = 1,
  tilt = 'up',
  enabled = true,
}: ScrollStageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const tier = useDeviceTier();
  const allowed = useMotionAllowed(tier);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Smoothing the progress stops the plane from jittering on fast wheel input
  // or on the momentum tail of a trackpad flick.
  const smoothed = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.4,
  });

  // Weak devices get a gentler plane rather than none: the movement is the
  // point, so it is scaled down instead of switched off.
  const effective = depth * (tier.lowPower ? 0.55 : tier.isMobile ? 0.75 : 1);

  const horizontal = tilt === 'left' || tilt === 'right';
  const sign = tilt === 'up' || tilt === 'left' ? 1 : -1;
  const lead = 10 * effective * sign;
  const trail = -6.5 * effective * sign;

  const rotateX = useTransform(smoothed, [0, 0.32, 0.68, 1], [lead, 0, 0, trail]);
  const rotateY = useTransform(
    smoothed,
    [0, 0.32, 0.68, 1],
    horizontal ? [lead, 0, 0, trail] : [0, 0, 0, 0]
  );

  // Depth is carried by rotation plus a push along Z rather than by `scale`.
  // Scaling a full-bleed section down exposes a sliver of whatever is behind it
  // along all four edges, which on a dark section reads as a broken seam.
  const z = useTransform(
    smoothed,
    [0, 0.32, 0.68, 1],
    [-110 * effective, 0, 0, -70 * effective]
  );

  // Transforms only. A `filter` here would apply to a layer the height of the
  // whole section, which is expensive to composite on a phone for a change
  // nobody can see while the section is off-screen anyway.
  const stageStyle = {
    rotateX: horizontal ? 0 : rotateX,
    rotateY: horizontal ? rotateY : 0,
    z,
  };

  // Reduced motion or a weak device: render a plain section with no plane.
  if (!allowed || !enabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={cn('scroll-stage', className)}
      style={{ perspective: `${1200 / effective}px` }}
    >
      <motion.div style={stageStyle}>{children}</motion.div>
    </div>
  );
}

export default ScrollStage;
