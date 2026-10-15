import { useEffect, useRef, useState } from 'react';
import { useDeviceTier, useMotionAllowed } from '../../lib/useDeviceTier';

interface CircularProgressProps {
  /** 0–100 */
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  /** Animate from zero when scrolled into view, rather than immediately. */
  animateOnView?: boolean;
  duration?: number;
}

/**
 * AnimatedGauge — a ring that fills to `value`, counting up alongside.
 *
 * The arc is a single SVG circle driven by stroke-dashoffset, so it animates on
 * the compositor and stays smooth on a phone.
 */
export function AnimatedGauge({
  value,
  size = 168,
  strokeWidth = 6,
  label,
  sublabel,
  animateOnView = true,
  duration = 1600,
}: CircularProgressProps) {
  const tier = useDeviceTier();
  const allowed = useMotionAllowed(tier);
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(allowed ? 0 : value);
  const started = useRef(false);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    if (!allowed) {
      setProgress(value);
      return;
    }

    const run = () => {
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setProgress(value * eased);
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if (!animateOnView) {
      run();
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting && !started.current) {
          started.current = true;
          run();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [allowed, value, duration, animateOnView]);

  return (
    <div ref={ref} className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-paper/15"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#c9a227"
          strokeWidth={strokeWidth}
          strokeLinecap="butt"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: allowed ? 'none' : undefined }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-display text-3xl font-bold text-paper">
          {Math.round(progress)}
          <span className="text-xl">%</span>
        </span>
        {label ? (
          <span className="mt-1 text-[0.625rem] uppercase tracking-[0.18em] text-gold">
            {label}
          </span>
        ) : null}
        {sublabel ? (
          <span className="mt-1 max-w-[8rem] text-[0.625rem] leading-tight text-paper/60">
            {sublabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default AnimatedGauge;
