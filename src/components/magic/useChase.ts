import { useEffect, useRef } from 'react';
import { useSpring, type MotionValue } from 'framer-motion';
import { useDeviceTier, useMotionAllowed } from '../../lib/useDeviceTier';

/**
 * useChase: makes an element follow the pointer.
 *
 * The element does not wait to be hovered. As soon as the pointer comes within
 * `radius` pixels of its edge it leans toward the cursor, and it keeps leaning
 * further the closer the pointer gets. The springs are deliberately soft so the
 * movement trails the cursor rather than snapping to it, which is what makes it
 * read as chasing instead of dragging.
 *
 * Only runs for devices with a real pointer. Touch has no hover, and tracking a
 * finger would fight the scroll.
 */
export function useChase({
  strength = 0.45,
  radius = 90,
  tilt = 0,
  stiffness = 150,
  damping = 15,
  mass = 0.4,
}: {
  /** How far it follows, as a fraction of the pointer's offset from centre. */
  strength?: number;
  /** Pixels beyond the element's edge that still attract. */
  radius?: number;
  /** Degrees of rotation toward the pointer. Needs a perspective parent. */
  tilt?: number;
  stiffness?: number;
  damping?: number;
  mass?: number;
} = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const tier = useDeviceTier();
  const allowed = useMotionAllowed(tier);
  const active = allowed && tier.canHover && !tier.isTouch;

  const x = useSpring(0, { stiffness, damping, mass });
  const y = useSpring(0, { stiffness, damping, mass });
  const rotateX = useSpring(0, { stiffness: stiffness * 0.8, damping, mass });
  const rotateY = useSpring(0, { stiffness: stiffness * 0.8, damping, mass });

  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    let latest: PointerEvent | null = null;

    const settle = () => {
      frame = 0;
      const event = latest;
      const node = ref.current;
      if (!event || !node) return;

      const rect = node.getBoundingClientRect();

      // The element is already translated by these springs, so its measured
      // rect moves with it. Subtract the current offset to recover where it
      // would sit at rest, otherwise the element chases its own tail.
      const centreX = rect.left - x.get() + rect.width / 2;
      const centreY = rect.top - y.get() + rect.height / 2;

      const dx = event.clientX - centreX;
      const dy = event.clientY - centreY;

      const reachX = rect.width / 2 + radius;
      const reachY = rect.height / 2 + radius;

      if (Math.abs(dx) < reachX && Math.abs(dy) < reachY) {
        x.set(dx * strength);
        y.set(dy * strength);
        if (tilt) {
          rotateY.set((dx / reachX) * tilt);
          rotateX.set(-(dy / reachY) * tilt);
        }
      } else {
        x.set(0);
        y.set(0);
        rotateX.set(0);
        rotateY.set(0);
      }
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      latest = event;
      // One measurement per frame, however fast the pointer is reporting.
      if (!frame) frame = requestAnimationFrame(settle);
    };

    const release = () => {
      x.set(0);
      y.set(0);
      rotateX.set(0);
      rotateY.set(0);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('blur', release);
    // Returning from another tab or a resize leaves stale coordinates behind.
    window.addEventListener('resize', release);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('blur', release);
      window.removeEventListener('resize', release);
    };
  }, [active, strength, radius, tilt, x, y, rotateX, rotateY]);

  return {
    ref,
    active,
    style: active
      ? ({
          x,
          y,
          ...(tilt ? { rotateX, rotateY } : {}),
        } as { x: MotionValue<number>; y: MotionValue<number> })
      : undefined,
    /** For consumers that want to animate something else off the same motion. */
    swing: { x, y },
  };
}

export default useChase;
