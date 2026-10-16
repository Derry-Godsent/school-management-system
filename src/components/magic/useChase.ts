import { useEffect, useRef } from 'react';
import { useSpring, type MotionValue } from 'framer-motion';
import { useDeviceTier, useMotionAllowed } from '../../lib/useDeviceTier';

/**
 * useChase: makes an element follow the pointer while the pointer is on it.
 *
 * The element leans toward the cursor and eases back when the cursor leaves.
 * Soft springs make the movement trail the pointer rather than snap to it, which
 * is what reads as chasing rather than dragging.
 *
 * Crucially the attraction is confined to the element's own box, plus a small
 * grace margin. An earlier version pulled from up to 110px away, which meant
 * hovering the gap between two buttons dragged both of them, and hovering one
 * 28px-wide nav link moved its four neighbours. Everything appeared to move as
 * one object. Restricting the pull to the box under the cursor keeps exactly one
 * element responding at a time, so the motion reads as deliberate.
 *
 * Only runs for devices with a real pointer. Touch has no hover, and tracking a
 * finger would fight the scroll.
 */
export function useChase({
  /** Fraction of the pointer's offset from the element's centre that it follows. */
  strength = 0.18,
  enabled = true,
  /** Pixels of leeway outside the element's box. Kept under half the smallest gap. */
  grace = 2,
  /**
   * Ceiling on displacement, in px.
   *
   * This is the safety limit that keeps neighbours apart. Two elements can each
   * move `max` toward the other, so `2 * max` must stay below the smallest gap
   * between any two elements that chase. The hero's two buttons sit 12px apart,
   * so anything above 5 risks them touching. Kept at 4.
   */
  max = 4,
  /** Degrees of rotation toward the pointer. Needs a perspective parent. */
  tilt = 0,
  stiffness = 170,
  damping = 16,
  mass = 0.4,
}: {
  strength?: number;
  grace?: number;
  max?: number;
  tilt?: number;
  /** Set false to attach no listener and never move the element at all. */
  enabled?: boolean;
  stiffness?: number;
  damping?: number;
  mass?: number;
} = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const tier = useDeviceTier();
  const allowed = useMotionAllowed(tier);
  const active = enabled && allowed && tier.canHover && !tier.isTouch;

  const x = useSpring(0, { stiffness, damping, mass });
  const y = useSpring(0, { stiffness, damping, mass });
  const rotateX = useSpring(0, { stiffness: stiffness * 0.8, damping, mass });
  const rotateY = useSpring(0, { stiffness: stiffness * 0.8, damping, mass });

  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;

    const clamp = (value: number) => Math.max(-max, Math.min(max, value));

    let frame = 0;
    let latest: PointerEvent | null = null;

    const settle = () => {
      frame = 0;
      const event = latest;
      const node = ref.current;
      if (!event || !node) return;

      const rect = node.getBoundingClientRect();

      // The element is already translated by these springs, so its measured box
      // moves with it. Subtract the current offset to recover where it sits at
      // rest, otherwise the element chases its own tail.
      const left = rect.left - x.get();
      const top = rect.top - y.get();
      const { width, height } = rect;

      const inside =
        event.clientX >= left - grace &&
        event.clientX <= left + width + grace &&
        event.clientY >= top - grace &&
        event.clientY <= top + height + grace;

      if (!inside) {
        x.set(0);
        y.set(0);
        rotateX.set(0);
        rotateY.set(0);
        return;
      }

      const dx = event.clientX - (left + width / 2);
      const dy = event.clientY - (top + height / 2);

      x.set(clamp(dx * strength));
      y.set(clamp(dy * strength));

      if (tilt) {
        rotateY.set(clamp((dx / (width / 2)) * tilt) / 3);
        rotateX.set(clamp(-(dy / (height / 2)) * tilt) / 3);
      }
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      latest = event;
      // One measurement per frame, however fast the pointer reports.
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
    // A resize or a return from another tab leaves stale coordinates behind.
    window.addEventListener('resize', release);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('blur', release);
      window.removeEventListener('resize', release);
    };
  }, [active, strength, grace, max, tilt, x, y, rotateX, rotateY]);

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
  };
}

export default useChase;
