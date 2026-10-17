import { useEffect, useState } from 'react';

/**
 * Device capability snapshot used to scale effects to the hardware.
 *
 * Most school owners will open the site on a phone, so effects must be chosen
 * by capability rather than assumed. Everything here is measured on the client
 * and degrades to the safest value before measurement runs.
 */
export interface DeviceTier {
  /** Measurement has run, before this, assume the safest values. */
  ready: boolean;
  /** Coarse pointer (finger) rather than a mouse. */
  isTouch: boolean;
  /** Narrow viewport, treat as a phone. */
  isMobile: boolean;
  /** A fine pointer exists, so hover and cursor effects are meaningful. */
  canHover: boolean;
  /** The user asked the OS to reduce motion. */
  reducedMotion: boolean;
  /** Hints that expensive effects should be skipped entirely. */
  lowPower: boolean;
}

const INITIAL: DeviceTier = {
  ready: false,
  isTouch: false,
  isMobile: false,
  canHover: false,
  reducedMotion: false,
  lowPower: false,
};

/** Navigator fields that are not in the standard TS lib but are widely shipped. */
interface NavigatorHints {
  hardwareConcurrency?: number;
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
}

export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>(INITIAL);

  useEffect(() => {
    const measure = () => {
      const nav = navigator as Navigator & NavigatorHints;

      const isTouch = window.matchMedia('(pointer: coarse)').matches;
      const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      const isMobile = window.innerWidth < 768;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const cores = nav.hardwareConcurrency ?? 8;
      const memory = nav.deviceMemory ?? 8;
      const saveData = nav.connection?.saveData === true;
      const onSlowLink = /(^|-)2g$/.test(nav.connection?.effectiveType ?? '');

      setTier({
        ready: true,
        isTouch,
        isMobile,
        canHover,
        reducedMotion,
        // Any of these suggests we should do *lighter* decorative work, not
        // none. The thresholds are deliberately low: `hardwareConcurrency` is
        // capped at 4 on most iPhones and Safari never reports `deviceMemory`
        // at all, so a `<= 4` core test flags ordinary modern phones.
        lowPower: saveData || onSlowLink || cores <= 2 || memory <= 2,
      });
    };

    measure();

    const queries = [
      window.matchMedia('(pointer: coarse)'),
      window.matchMedia('(hover: hover) and (pointer: fine)'),
      window.matchMedia('(prefers-reduced-motion: reduce)'),
    ];

    for (const q of queries) q.addEventListener('change', measure);
    window.addEventListener('resize', measure);
    window.addEventListener('orientationchange', measure);

    return () => {
      for (const q of queries) q.removeEventListener('change', measure);
      window.removeEventListener('resize', measure);
      window.removeEventListener('orientationchange', measure);
    };
  }, []);

  return tier;
}

/**
 * Should decorative 3D motion run at all?
 *
 * Only an explicit accessibility preference switches it off. A device that
 * merely looks modest gets lighter effects instead, scaled by each effect from
 * `tier.lowPower` (fewer particles, a gentler plane).
 *
 * This distinction matters: folding `lowPower` into a hard stop meant every
 * animation on this site silently disabled itself on hardware reporting four
 * or fewer cores, which is most iPhones, so the motion was invisible on exactly
 * the device most of these visitors are using.
 *
 * False before measurement has run, so nothing animates on the first paint.
 */
export function useMotionAllowed(tier: DeviceTier): boolean {
  return tier.ready && !tier.reducedMotion;
}
