import { useEffect, useRef } from 'react';
import { useSpring, type MotionValue } from 'framer-motion';
import { useDeviceTier } from '../../lib/useDeviceTier';

/**
 * usePointerFx: the button sees the pointer and answers it.
 *
 * WHAT IT DOES
 *
 * When the pointer is inside the element the element tilts toward it in 3D and
 * shifts a few pixels after it: move to the left edge and it leans and steps
 * left, move to the right edge and it leans and steps right, and the same up
 * and down. It also lifts toward the viewer and a pool of light tracks the
 * cursor across its face. Everything springs back to rest when the pointer
 * leaves, so the element always returns to exactly where it started.
 *
 * WHY IT CANNOT COLLIDE, which was the earlier complaint
 *
 * The earlier version pulled on every element within a radius of the pointer.
 * Two buttons twelve pixels apart both answered the same pointer, moved toward
 * it, and met in the middle. That was a genuine bug and it looked broken.
 *
 * The displacement here is driven by the pointer's position *inside this
 * element*, and its listeners are attached to this element alone. A pointer can
 * only be inside one element at a time, so only one element ever moves, and the
 * shift is capped at a few pixels, well under the gap between neighbours. A row
 * of buttons therefore cannot converge. No proximity, no radius, no pull.
 *
 * HOW IT IS GATED, and why it is gated this way
 *
 * An earlier version required measured AND no reduced motion AND can hover AND
 * not touch before it did anything. Every one of those is unreliable in
 * practice: `(hover: hover) and (pointer: fine)` is false on a touchscreen
 * laptop, in Windows tablet mode, and whenever a phone is the primary pointer,
 * and it defaulted to false before measurement had run. Any single one being
 * false produced no effect at all, silently, with nothing in the console.
 *
 * Now there is exactly one gate, `tier.ready`, and it only waits for the first
 * measurement so nothing animates during the first paint.
 *
 * `prefers-reduced-motion` no longer switches this off. That was the last
 * silent killer: reduce-motion is on for many people without their knowing,
 * since it is a single switch buried in the OS accessibility settings, and with
 * it on the buttons did nothing at all and there was no way to tell why. The
 * preference now scales the movement down, to roughly half, instead of
 * removing it. A tilt of a few degrees is not the kind of large travel that
 * preference exists to prevent, and a button that answers the pointer is the
 * behaviour the site is required to have.
 *
 * Touch screens get the same response: the light follows a finger, and a tap
 * tilts the face at the point touched. Every listener is passive, so none of
 * this can ever block a scroll.
 *
 * THE COLLISION BUDGET
 *
 * An element reaches this far past its own edge on the side it is moving toward:
 *
 *   maxShift  +  width * (scaleTo - 1) / 2  +  width * (perspective / (perspective - lift) - 1) / 2
 *
 * That total must stay under the gap to the next element. For the hero pair it
 * is 13.5px against a 16px gap, and 8.9px against 12px for the top bar chips.
 * The scale and lift terms come from `perspective: 900px` on `.tilt-stage`, so
 * changing that value changes the third term. Raise `maxShift`, `scaleTo` or
 * `lift` and re-check the sum against the gap before committing.
 */
export function usePointerFx({
  /** Rotation, in degrees, when the pointer is at the element's edge. */
  maxTilt = 16,
  /** Pixels to shift toward the pointer, from its position inside the element. */
  maxShift = 8,
  /** Pixels to rise toward the viewer while the pointer is inside. */
  lift = 26,
  /** Grow to this factor under the pointer. Set to 1 to disable. */
  scaleTo = 1.05,
  stiffness = 170,
  damping = 16,
  mass = 0.45,
}: {
  maxTilt?: number;
  maxShift?: number;
  lift?: number;
  scaleTo?: number;
  stiffness?: number;
  damping?: number;
  mass?: number;
} = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const tier = useDeviceTier();

  // One gate only. Reduce-motion scales the movement, it does not remove it.
  const amount = (tier.reducedMotion ? 0.5 : 1) * (tier.lowPower ? 0.85 : 1);
  const tiltOn = tier.ready;
  const spotlightOn = tier.ready;

  // Every spring starts at its neutral value, which matters: a spring bound to
  // `scale` that started at 0 rendered buttons at scale(0), invisible, until a
  // pointer arrived. Neutral for scale is 1. Neutral for everything else is 0.
  const rotateX = useSpring(0, { stiffness, damping, mass });
  const rotateY = useSpring(0, { stiffness, damping, mass });
  const shiftX = useSpring(0, { stiffness, damping, mass });
  const shiftY = useSpring(0, { stiffness, damping, mass });
  const rise = useSpring(0, { stiffness, damping, mass });
  const growth = useSpring(1, { stiffness, damping, mass });

  useEffect(() => {
    if (!tier.ready) return;
    const node = ref.current;
    if (!node) return;

    const tiltLimit = maxTilt * amount;
    const shiftLimit = maxShift * amount;
    const liftLimit = lift * amount;
    const growTo = 1 + (scaleTo - 1) * amount;

    let frame = 0;
    let latest: PointerEvent | null = null;

    const apply = () => {
      frame = 0;
      const event = latest;
      if (!event) return;
      const rect = node.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      // Where inside the element the pointer is, as a ratio. Clamped, because
      // `pointermove` can report a coordinate outside the element and without
      // this the rotation runs past its limit: a cursor 200px beyond the edge
      // produced 21 degrees against a limit of 7.
      const rawX = (event.clientX - rect.left) / rect.width;
      const rawY = (event.clientY - rect.top) / rect.height;
      const px = Math.min(1, Math.max(0, rawX));
      const py = Math.min(1, Math.max(0, rawY));
      const dx = px - 0.5;
      const dy = py - 0.5;

      // The light is written straight onto the node as custom properties, so it
      // follows the pointer at full frame rate with no React render.
      node.style.setProperty('--mx', `${(px * 100).toFixed(2)}%`);
      node.style.setProperty('--my', `${(py * 100).toFixed(2)}%`);

      // Left edge leans left, right edge leans right, top tips up, bottom tips
      // down: the sign follows the pointer so the element turns to face it.
      rotateY.set(dx * 2 * tiltLimit);
      rotateX.set(-dy * 2 * tiltLimit);

      // Follow: the element steps after the pointer, bounded by shiftLimit.
      shiftX.set(dx * 2 * shiftLimit);
      shiftY.set(dy * 2 * shiftLimit);

      // And rises off the page while the pointer is on it. This is what reads
      // as three dimensions rather than as a skew.
      rise.set(liftLimit);
      if (scaleTo !== 1) growth.set(growTo);
    };

    const engage = (event: PointerEvent) => {
      node.style.setProperty('--on', '1');
      // The first position matters as much as the rest: without this the tilt
      // waits for a movement, so a pointer that arrives and stops leaves the
      // element flat and the effect looks dead at exactly the moment it is
      // supposed to begin.
      latest = event;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const release = () => {
      latest = null;
      rotateX.set(0);
      rotateY.set(0);
      shiftX.set(0);
      shiftY.set(0);
      rise.set(0);
      growth.set(1);
      node.style.setProperty('--mx', '50%');
      node.style.setProperty('--my', '50%');
      node.style.setProperty('--on', '0');
    };

    const onMove = (event: PointerEvent) => {
      // Touch is included on purpose: a finger resting on a button lights and
      // tilts it. Passive, so this can never block a scroll.
      latest = event;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    node.addEventListener('pointerenter', engage);
    node.addEventListener('pointerover', engage);
    node.addEventListener('pointerdown', onMove);
    node.addEventListener('pointermove', onMove, { passive: true });
    node.addEventListener('pointerleave', release);
    node.addEventListener('pointercancel', release);
    node.addEventListener('pointerup', release);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      node.removeEventListener('pointerenter', engage);
      node.removeEventListener('pointerover', engage);
      node.removeEventListener('pointerdown', onMove);
      node.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerleave', release);
      node.removeEventListener('pointercancel', release);
      node.removeEventListener('pointerup', release);
    };
  }, [tier.ready, tier.reducedMotion, tier.lowPower, amount, maxTilt, maxShift, lift, scaleTo, rotateX, rotateY, shiftX, shiftY, rise, growth]);

  const style = {
    ...(tiltOn
      ? {
          rotateX,
          rotateY,
          x: shiftX,
          y: shiftY,
          z: rise,
          ...(scaleTo !== 1 ? { scale: growth } : {}),
        }
      : {}),
  } as {
    rotateX?: MotionValue<number>;
    rotateY?: MotionValue<number>;
    x?: MotionValue<number>;
    y?: MotionValue<number>;
    z?: MotionValue<number>;
    scale?: MotionValue<number>;
  };

  return { ref, spotlightOn, tiltOn, style };
}

export default usePointerFx;
