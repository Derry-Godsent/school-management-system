import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export type RevealState = 'idle' | 'hidden' | 'shown';

/** A box we cannot measure tells us nothing, so it must not be treated as hidden. */
function measurable(rect: DOMRect): boolean {
  return rect.width > 0 || rect.height > 0;
}

/**
 * useReveal: decides whether an element may start hidden, and then guarantees it
 * becomes visible.
 *
 * The previous implementation started every revealed block at `opacity: 0` and
 * waited for an IntersectionObserver callback to bring it in. If that callback
 * never arrived, the content stayed invisible for good, which is how most of the
 * text on the page disappeared.
 *
 * This hook makes that impossible by construction:
 *
 *  1. The state starts as `idle`, which callers must render as visible. Nothing
 *     is hidden before a real measurement says it can be.
 *  2. Hiding only happens for elements positively measured to be below the fold,
 *     and the measurement runs in a layout effect so the hidden state is applied
 *     before the first paint. No flash of text appearing and vanishing.
 *  3. A box of zero width and height is treated as unmeasurable and shown. An
 *     element that reports `0x0` is usually collapsed or not yet laid out, and
 *     guessing "off-screen" for it is how content goes missing.
 *  4. Once hidden, three independent mechanisms try to reveal it: an
 *     IntersectionObserver, a getBoundingClientRect check on scroll and resize,
 *     and a timeout. Any one of them wins, and the rect check depends on nothing
 *     beyond the element existing.
 *  5. Once shown, it stays shown. A later re-measure can never re-hide content
 *     the reader has already seen.
 */
export function useReveal(enabled: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<RevealState>('idle');

  useLayoutEffect(() => {
    if (!enabled) return;

    const node = ref.current;
    if (!node) return;

    const viewport = window.innerHeight || 0;
    if (viewport === 0) return;

    const rect = node.getBoundingClientRect();
    if (!measurable(rect)) return;

    const onScreen = rect.top < viewport * 0.9 && rect.bottom > 0;

    // Functional update, so a block the reader has already seen is never
    // pushed back into the hidden state by a re-measure.
    setState(prev => (prev === 'shown' || onScreen ? 'shown' : 'hidden'));
  }, [enabled]);

  useEffect(() => {
    if (state !== 'hidden') return;

    const node = ref.current;
    if (!node) {
      setState('shown');
      return;
    }

    let frame = 0;
    let done = false;

    const show = () => {
      if (done) return;
      done = true;
      setState('shown');
    };

    // Mechanism one: the observer, which is cheap and precise.
    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        entries => {
          if (entries.some(entry => entry.isIntersecting)) show();
        },
        { rootMargin: '0px 0px -8% 0px' }
      );
      observer.observe(node);
    }

    // Mechanism two: a direct rect check on scroll, which cannot silently fail.
    const check = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      if (!measurable(rect)) {
        show();
        return;
      }
      const viewport = window.innerHeight || 0;
      if (viewport > 0 && rect.top < viewport * 0.92 && rect.bottom > 0) show();
      else frame = requestAnimationFrame(check);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();

    // Mechanism three: an absolute backstop, so content can never be stranded.
    const failsafe = window.setTimeout(show, 3000);

    return () => {
      done = true;
      if (frame) cancelAnimationFrame(frame);
      if (observer) observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      clearTimeout(failsafe);
    };
  }, [state]);

  return { ref, state, hidden: state === 'hidden' };
}

export default useReveal;
