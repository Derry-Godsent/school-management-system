import { useEffect, useRef } from 'react';
import { useSpring, type MotionValue } from 'framer-motion';
import { useDeviceTier, useMotionAllowed } from '../../lib/useDeviceTier';

/**
 * usePointerFx: makes an element tilt in 3D toward the pointer, with a
 * spotlight that tracks the cursor across its face.
 *
 * This is the "object that watches the cursor" effect. It works by rotating the
 * element on two axes and moving a radial highlight to wherever the pointer is,
 * using spring physics so the movement trails the cursor rather than snapping
 * to it.
 *
 * It deliberately does NOT translate the element. Positional movement is what
 * made two buttons drift into each other before: the hero pair sit 12px apart,
 * so any shared translation risked them touching. Rotation moves the element's
 * projected corners by a couple of pixels at most and leaves its layout box
 * exactly where it was, so buttons can never converge no matter what the cursor
 * does. The wow comes from the tilt and the light, not from things sliding
 * around.
 *
 * Two extra details that make it feel responsive rather than laggy:
 *
 *  - The spotlight is written straight onto the node as a CSS custom property,
 *    so it tracks the cursor at full frame rate without re-rendering React.
 *  - The tilt only runs while the pointer is over the element. A listener on
 *    every button that ran all the time would mean a measurement per frame per
 *    button, which is how a scroll starts stuttering on a phone.
 *
 * Pointer devices only. Touch has no cursor, and a finger would fight the
 * scroll.
 */
export function usePointerFx({
  /** Maximum rotation, in degrees, at the element's edge. */
  maxTilt = 8,
  /** Also lift the element slightly toward the viewer, in px of translateZ. */
  lift = 0,
  stiffness = 180,
  damping = 18,
  mass = 0.4,
}: {
  maxTilt?: number;
  lift?: number;
  stiffness?: number;
  damping?: number;
  mass?: number;
} = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const tier = useDeviceTier();
  const allowed = useMotionAllowed(tier);
  const active = allowed && tier.canHover && !tier.isTouch;

  const rotateX = useSpring(0, { stiffness, damping, mass });
  const rotateY = useSpring(0, { stiffness, damping, mass });
  const translateZ = useSpring(0, { stiffness, damping, mass });

  useEffect(() => {
    if (!active) return;
    const node = ref.current;
    if (!node) return;

    let frame = 0;
    let latest: PointerEvent | null = null;

    const apply = () => {
      frame = 0;
      const event = latest;
      if (!event) return;
      const rect = node.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      // Clamped to the box. `pointermove` can report a coordinate outside the
      // element, and without this the rotation would run past maxTilt: a cursor
      // 200px beyond the edge produced a 21 degree tilt for a limit of 7, which
      // looks like a glitch rather than an effect.
      const rawX = (event.clientX - rect.left) / rect.width;
      const rawY = (event.clientY - rect.top) / rect.height;
      const px = Math.min(1, Math.max(0, rawX));
      const py = Math.min(1, Math.max(0, rawY));

      // Spotlight position, as a percentage of the element's box. Written
      // directly to the node so it costs no React work.
      node.style.setProperty('--mx', `${(px * 100).toFixed(2)}%`);
      node.style.setProperty('--my', `${(py * 100).toFixed(2)}%`);

      // Centre is neutral; the edges reach the maximum tilt.
      rotateY.set((px - 0.5) * 2 * maxTilt);
      rotateX.set(-(py - 0.5) * 2 * maxTilt);
      if (lift) translateZ.set(lift);
    };

    const settle = () => {
      rotateX.set(0);
      rotateY.set(0);
      translateZ.set(0);
      node.style.setProperty('--mx', '50%');
      node.style.setProperty('--my', '50%');
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      latest = event;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    node.addEventListener('pointerenter', onMove);
    node.addEventListener('pointermove', onMove, { passive: true });
    node.addEventListener('pointerleave', settle);
    node.addEventListener('blur', settle);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      node.removeEventListener('pointerenter', onMove);
      node.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerleave', settle);
      node.removeEventListener('blur', settle);
    };
  }, [active, maxTilt, lift, rotateX, rotateY, translateZ]);

  const style = {
    rotateX,
    rotateY,
    ...(lift ? { translateZ } : {}),
  } as {
    rotateX: MotionValue<number>;
    rotateY: MotionValue<number>;
    translateZ?: MotionValue<number>;
  };

  return { ref, active, style };
}

export default usePointerFx;
