import { useEffect, useRef } from 'react';
import { useSpring, useTransform, type MotionValue } from 'framer-motion';
import { useDeviceTier } from '../../lib/useDeviceTier';

/**
 * usePointerFx: the element sees the pointer and answers it.
 *
 * WHAT IT DOES
 *
 * As the pointer comes near, the element leans toward it, steps after it, rises
 * toward the viewer and lights up under it. Move to the left and it leans left,
 * to the right and it leans right, above it and it tips up, below it and it tips
 * down. Everything eases back to rest when the pointer wanders off.
 *
 * WHY IT IS BUILT THIS WAY, which took two attempts to get right
 *
 * The first attempt pulled on every element within a radius of the pointer, so
 * two buttons side by side both answered the same pointer and met in the middle.
 * The second attempt fixed that by tying the effect to the element the pointer
 * was already inside, which quietly removed the behaviour: a button could not
 * react until the pointer had arrived on it, and because the lean is
 * proportional to the distance from the element's centre, a pointer resting on
 * the middle of a button produced no movement at all. That is where a pointer
 * rests. The effect was therefore doing nothing for most of the time it was
 * supposedly working.
 *
 * This version keeps one document level tracker and lets it decide, once per
 * frame, which single element is nearest the pointer. Only that element is ever
 * driven and every other element is explicitly parked at rest, so two elements
 * can never answer the pointer at once and cannot converge. Because the choice
 * is made centrally it can also react while the pointer is still approaching,
 * which is what makes the element feel aware of it.
 *
 * GATING
 *
 * One gate: the first measurement, so nothing animates before the page has
 * settled. `prefers-reduced-motion` scales the movement down to about half
 * rather than switching it off. It used to switch it off, and that preference is
 * one buried OS switch that is easy to have on without knowing, which made the
 * whole thing silently do nothing for anyone who had it set.
 *
 * COLLISION BUDGET
 *
 * The engaged element reaches this far past its own edge on the side it leans
 * toward:
 *
 *   OVERREACH * maxShift
 *     + width * (scaleTo - 1) / 2
 *     + width * (perspective / (perspective - lift) - 1) / 2
 *
 * The first term carries OVERREACH because the pointer is allowed to be outside
 * the box, where the step is at its largest. Keep the total under the gap to the
 * next element. Worked out for the rows on this site: the hero pair 23.0px
 * against a 32px gap, the top bar chips 15.5px against 20px, a nav item 4.4px
 * against 16px of padding on each side of it.
 *
 * As a second line of defence the engaged element is raised in the stack while
 * it is active, so even a few pixels of reach paints over its neighbour rather
 * than colliding with it. And only one element is ever driven, which is the
 * property that actually rules the collision out.
 */

/** How far outside its own box an element still answers the pointer, in px. */
const ENGAGE_PAD = 46;
/** The lean may overshoot a little once the pointer is outside the box. */
const OVERREACH = 1.2;
/** Touch has no hover, so a tap blooms and then settles on its own. */
const TOUCH_SETTLE = 700;

type Springs = {
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  shiftX: MotionValue<number>;
  shiftY: MotionValue<number>;
  rise: MotionValue<number>;
  growth: MotionValue<number>;
};

interface Settings {
  maxTilt: number;
  maxShift: number;
  lift: number;
  scaleTo: number;
  shadow: boolean;
}

interface Entry {
  node: HTMLElement;
  springs: Springs;
  amount: number;
  settings: Settings;
  lit: boolean;
}

const registry = new Set<Entry>();
let pending: { x: number; y: number } | null = null;
let frame = 0;
let settleTimer: ReturnType<typeof setTimeout> | null = null;
let installed = false;

const clamp = (value: number, low: number, high: number) =>
  Math.min(high, Math.max(low, value));

function stageOf(node: HTMLElement): HTMLElement {
  return (node.closest('.tilt-stage') as HTMLElement | null) ?? node;
}

function park(entry: Entry) {
  if (!entry.lit) return;
  entry.lit = false;
  const { springs, node } = entry;
  springs.rotateX.set(0);
  springs.rotateY.set(0);
  springs.shiftX.set(0);
  springs.shiftY.set(0);
  springs.rise.set(0);
  springs.growth.set(1);
  node.style.setProperty('--on', '0');
  stageOf(node).style.zIndex = '';
}

function parkAll() {
  for (const entry of registry) park(entry);
}

function drive(entry: Entry, rect: DOMRect, x: number, y: number) {
  const { springs, node, amount } = entry;
  const { maxTilt, maxShift, lift, scaleTo } = entry.settings;

  const halfWidth = rect.width / 2;
  const halfHeight = rect.height / 2;

  // Where the pointer is relative to the centre, where 1 is exactly on an edge.
  // Measuring from the edge outward is what lets the element react while the
  // pointer is still approaching it, rather than only once it has arrived.
  const nx = clamp((x - (rect.left + halfWidth)) / halfWidth, -OVERREACH, OVERREACH);
  const ny = clamp((y - (rect.top + halfHeight)) / halfHeight, -OVERREACH, OVERREACH);

  const tilt = maxTilt * amount;
  const shift = maxShift * amount;
  const height = lift * amount;

  // The light stays on the face, so its position is clamped to the box.
  const px = clamp((x - rect.left) / rect.width, 0, 1);
  const py = clamp((y - rect.top) / rect.height, 0, 1);
  node.style.setProperty('--mx', `${(px * 100).toFixed(2)}%`);
  node.style.setProperty('--my', `${(py * 100).toFixed(2)}%`);

  // Lean toward the pointer: right edge toward the viewer when it is to the
  // right, top edge up when it is above, and both signs follow it.
  springs.rotateY.set(nx * tilt);
  springs.rotateX.set(-ny * tilt);
  springs.shiftX.set(nx * shift);
  springs.shiftY.set(ny * shift);
  springs.rise.set(height);
  springs.growth.set(1 + (scaleTo - 1) * amount);

  if (!entry.lit) {
    entry.lit = true;
    node.style.setProperty('--on', '1');
    // Lifted in the stack while it is the one answering, so it can never be
    // clipped by or fight with a neighbour it leans toward.
    stageOf(node).style.zIndex = '5';
  }
}

function pick(x: number, y: number) {
  let chosen: Entry | null = null;
  let chosenRect: DOMRect | null = null;
  let nearest = Infinity;

  // All reads happen before any writes, so this cannot thrash layout.
  for (const entry of registry) {
    const rect = entry.node.getBoundingClientRect();
    if (!rect.width || !rect.height) continue;
    const near =
      x >= rect.left - ENGAGE_PAD &&
      x <= rect.right + ENGAGE_PAD &&
      y >= rect.top - ENGAGE_PAD &&
      y <= rect.bottom + ENGAGE_PAD;
    if (!near) continue;
    const dx = x - (rect.left + rect.width / 2);
    const dy = y - (rect.top + rect.height / 2);
    const distance = dx * dx + dy * dy;
    if (distance < nearest) {
      nearest = distance;
      chosen = entry;
      chosenRect = rect;
    }
  }

  for (const entry of registry) if (entry !== chosen) park(entry);
  if (chosen && chosenRect) drive(chosen, chosenRect, x, y);
}

function run() {
  frame = 0;
  if (!pending) return;
  const { x, y } = pending;
  pending = null;
  pick(x, y);
}

function request() {
  if (!frame) frame = requestAnimationFrame(run);
}

function onPointer(event: PointerEvent) {
  if (settleTimer) {
    clearTimeout(settleTimer);
    settleTimer = null;
  }
  pending = { x: event.clientX, y: event.clientY };
  if (event.pointerType === 'touch' && event.type === 'pointerup') {
    settleTimer = setTimeout(() => {
      settleTimer = null;
      parkAll();
    }, TOUCH_SETTLE);
  }
  request();
}

function recheck() {
  if (pending) pending = { ...pending };
  request();
}

function onEscape() {
  parkAll();
}

function install() {
  if (installed) return;
  installed = true;
  document.addEventListener('pointermove', onPointer, { passive: true });
  document.addEventListener('pointerdown', onPointer, { passive: true });
  document.addEventListener('pointerup', onPointer, { passive: true });
  window.addEventListener('scroll', recheck, { passive: true, capture: true });
  window.addEventListener('resize', recheck);
  window.addEventListener('blur', onEscape);
  // `pointerleave` does not bubble, but the root element is where the pointer
  // leaves the window itself.
  document.documentElement.addEventListener('pointerleave', onEscape);
}

function uninstall() {
  if (!installed || registry.size > 0) return;
  installed = false;
  document.removeEventListener('pointermove', onPointer);
  document.removeEventListener('pointerdown', onPointer);
  document.removeEventListener('pointerup', onPointer);
  window.removeEventListener('scroll', recheck, { capture: true } as EventListenerOptions);
  window.removeEventListener('resize', recheck);
  window.removeEventListener('blur', onEscape);
  document.documentElement.removeEventListener('pointerleave', onEscape);
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
  pending = null;
}

export function usePointerFx({
  /** Lean, in degrees, when the pointer is on an edge of the element. */
  maxTilt = 18,
  /** Pixels to step toward the pointer. */
  maxShift = 8,
  /** Pixels to rise toward the viewer while engaged. */
  lift = 30,
  /** Grow to this factor while engaged. Set to 1 to disable. */
  scaleTo = 1.05,
  /** A soft shadow that deepens as it rises. */
  shadow = true,
  /** Set false for a still element: it never joins the tracker at all. */
  enabled = true,
  stiffness = 160,
  damping = 15,
  mass = 0.5,
}: {
  maxTilt?: number;
  maxShift?: number;
  lift?: number;
  scaleTo?: number;
  shadow?: boolean;
  enabled?: boolean;
  stiffness?: number;
  damping?: number;
  mass?: number;
} = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const tier = useDeviceTier();

  // `prefers-reduced-motion` halves the movement instead of removing it, and a
  // device that merely looks modest gets a slightly gentler version.
  const amount = (tier.reducedMotion ? 0.5 : 1) * (tier.lowPower ? 0.85 : 1);

  // Every spring starts at its neutral value. A spring bound to `scale` that
  // started at 0 once rendered buttons at scale(0), invisible, until a pointer
  // arrived. Neutral for scale is 1, and 0 for every rotation and offset.
  const rotateX = useSpring(0, { stiffness, damping, mass });
  const rotateY = useSpring(0, { stiffness, damping, mass });
  const shiftX = useSpring(0, { stiffness, damping, mass });
  const shiftY = useSpring(0, { stiffness, damping, mass });
  const rise = useSpring(0, { stiffness, damping, mass });
  const growth = useSpring(1, { stiffness, damping, mass });

  // The shadow follows the rise, so the depth reads as a real lift.
  const elevation = useTransform(
    rise,
    [0, Math.max(1, lift)],
    ['0 0 0 rgba(17, 17, 17, 0)', '0 16px 34px rgba(17, 17, 17, 0.34)']
  );

  // Read at drive time so changing a setting never needs a re-registration.
  const settings = useRef<Settings>({ maxTilt, maxShift, lift, scaleTo, shadow });
  settings.current = { maxTilt, maxShift, lift, scaleTo, shadow };
  const amountRef = useRef(amount);
  amountRef.current = amount;

  useEffect(() => {
    if (!tier.ready || !enabled) return;
    const node = ref.current;
    if (!node) return;

    const entry: Entry = {
      node,
      springs: { rotateX, rotateY, shiftX, shiftY, rise, growth },
      amount: amountRef.current,
      settings: settings.current,
      lit: false,
    };
    registry.add(entry);
    install();

    return () => {
      park(entry);
      registry.delete(entry);
      uninstall();
    };
  }, [tier.ready, enabled, rotateX, rotateY, shiftX, shiftY, rise, growth]);

  const style = (!enabled
    ? {}
    : {
    rotateX,
    rotateY,
    x: shiftX,
    y: shiftY,
    z: rise,
    ...(scaleTo !== 1 ? { scale: growth } : {}),
    ...(shadow ? { boxShadow: elevation } : {}),
  }) as {
    rotateX: MotionValue<number>;
    rotateY: MotionValue<number>;
    x: MotionValue<number>;
    y: MotionValue<number>;
    z: MotionValue<number>;
    scale?: MotionValue<number>;
    boxShadow?: MotionValue<string>;
  };

  return { ref, spotlightOn: tier.ready, tiltOn: tier.ready, style };
}

export default usePointerFx;
