import { useEffect, useRef } from 'react';
import { useSpring, type MotionValue } from 'framer-motion';
import { useDeviceTier, useMotionAllowed } from '../../lib/useDeviceTier';

/**
 * usePointerFx: tilt an element toward the pointer in 3D, and run a spotlight
 * across its face wherever the cursor is.
 *
 * HOW IT IS GATED, and why it is gated this way
 *
 * An earlier version required all four of "measured", "no reduced-motion",
 * "can hover" and "not touch" before it did anything. Any one of those being
 * false silently produced no effect at all, and several of them are unreliable:
 * `(hover: hover) and (pointer: fine)` reports false on touchscreen laptops,
 * on Windows in tablet mode, and whenever a phone is the primary pointer. That
 * is a lot of ways to end up with nothing on screen.
 *
 * So the gates are now split by what each effect actually needs:
 *
 *   spotlight   needs a pointer position. Phones, tablets, laptops, reduced
 *               motion, all fine. It is a pool of light, not movement, so it is
 *               not the kind of animation that a motion preference is about.
 *   tilt        is movement, so it respects prefers-reduced-motion.
 *
 * Neither requires a hover-capable pointer any more. On a touch screen the
 * spotlight follows the finger, so tapping a button blooms light under it.
 * Listeners are passive, so nothing here can ever block a scroll.
 *
 * It never translates the element. Rotation moves the projected corners by a
 * pixel or two and leaves the layout box exactly where it was, which is what
 * guarantees a row of buttons can never drift into each other.
 */
export function usePointerFx({
  /** Maximum rotation, in degrees, when the pointer is at the element's edge. */
  maxTilt = 12,
  /** Scale to grow to under the pointer. 1 disables it. */
  scaleTo = 1,
  stiffness = 200,
  damping = 18,
  mass = 0.4,
}: {
  maxTilt?: number;
  scaleTo?: number;
  stiffness?: number;
  damping?: number;
  mass?: number;
} = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const tier = useDeviceTier();
  const motionAllowed = useMotionAllowed(tier);

  // Lighting is safe for every device. Tilt is movement, so it is not.
  const spotlightOn = tier.ready;
  const tiltOn = motionAllowed;

  // Rotation springs start at 0, which is neutral. The scale spring must NOT:
  // it is bound to `scale`, so starting it at 0 rendered every button at
  // scale(0), invisible, until a pointer happened to arrive. It starts at 1.
  const rotateX = useSpring(0, { stiffness, damping, mass });
  const rotateY = useSpring(0, { stiffness, damping, mass });
  const glow = useSpring(1, { stiffness, damping, mass });

  useEffect(() => {
    if (!spotlightOn && !tiltOn) return;
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
      // element, and without this the rotation runs past maxTilt: a cursor
      // 200px beyond the edge produced 21 degrees against a limit of 7.
      const rawX = (event.clientX - rect.left) / rect.width;
      const rawY = (event.clientY - rect.top) / rect.height;
      const px = Math.min(1, Math.max(0, rawX));
      const py = Math.min(1, Math.max(0, rawY));

      // The spotlight is written straight onto the node as custom properties,
      // so it follows the pointer at full frame rate with no React render.
      node.style.setProperty('--mx', `${(px * 100).toFixed(2)}%`);
      node.style.setProperty('--my', `${(py * 100).toFixed(2)}%`);

      if (tiltOn) {
        rotateY.set((px - 0.5) * 2 * maxTilt);
        rotateX.set(-(py - 0.5) * 2 * maxTilt);
        if (scaleTo !== 1) glow.set(scaleTo);
      }
    };

    const settle = () => {
      rotateX.set(0);
      rotateY.set(0);
      glow.set(1);
      node.style.setProperty('--mx', '50%');
      node.style.setProperty('--my', '50%');
      node.style.setProperty('--on', '0');
    };

    const enter = () => {
      node.style.setProperty('--on', '1');
    };

    const onMove = (event: PointerEvent) => {
      // Touch is included on purpose: a finger dragging or resting on a button
      // lights it. The listener is passive, so this cannot block scrolling.
      latest = event;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    node.addEventListener('pointerenter', enter);
    node.addEventListener('pointerdown', enter);
    node.addEventListener('pointerover', enter);
    node.addEventListener('pointermove', onMove, { passive: true });
    node.addEventListener('pointerleave', settle);
    node.addEventListener('pointercancel', settle);
    node.addEventListener('pointerup', settle);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      node.removeEventListener('pointerenter', enter);
      node.removeEventListener('pointerdown', enter);
      node.removeEventListener('pointerover', enter);
      node.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerleave', settle);
      node.removeEventListener('pointercancel', settle);
      node.removeEventListener('pointerup', settle);
    };
  }, [spotlightOn, tiltOn, maxTilt, scaleTo, rotateX, rotateY, glow]);

  const style = {
    ...(tiltOn
      ? {
          rotateX,
          rotateY,
          ...(scaleTo !== 1 ? { scale: glow } : {}),
        }
      : {}),
  } as {
    rotateX?: MotionValue<number>;
    rotateY?: MotionValue<number>;
    scale?: MotionValue<number>;
  };

  return { ref, spotlightOn, tiltOn, style };
}

export default usePointerFx;
