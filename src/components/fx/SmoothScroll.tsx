import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { useDeviceTier, useMotionAllowed } from '../../lib/useDeviceTier';
import { registerSmoothScroll, resetLockedScroll } from '../../lib/pageLock';

/**
 * SmoothScroll: momentum scrolling for the whole document.
 *
 * Deliberately does NOT hijack touch. `syncTouch: false` leaves native iOS and
 * Android inertia untouched, which is both faster and far more familiar on a
 * phone; only wheel scrolling is smoothed. On low-power devices and for
 * reduced-motion users the whole thing stays out of the way.
 */
export function SmoothScroll() {
  const tier = useDeviceTier();
  const allowed = useMotionAllowed(tier);
  const { pathname } = useLocation();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!allowed) return;

    const lenis = new Lenis({
      duration: 1.05,
      // easeOutExpo: the standard "premium site" deceleration curve.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });

    lenisRef.current = lenis;
    // Overlays need to stop this instance, not just hide the page overflow.
    registerSmoothScroll(lenis);

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      registerSmoothScroll(null);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [allowed]);

  // Reset scroll on navigation, and make sure Lenis agrees with the new page.
  useEffect(() => {
    resetLockedScroll();
    lenisRef.current?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default SmoothScroll;
