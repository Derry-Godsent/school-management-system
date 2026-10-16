import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { cn } from '../../lib/cn';
import { useDeviceTier, useMotionAllowed } from '../../lib/useDeviceTier';

interface Point {
  x: number;
  y: number;
}

interface AnimatedBeamProps {
  containerRef: RefObject<HTMLElement | null>;
  fromRef: RefObject<HTMLElement | null>;
  toRef: RefObject<HTMLElement | null>;
  /** Bow of the curve. Negative bows one way, positive the other. */
  curvature?: number;
  endYOffset?: number;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  /** Stroke colour of the travelling pulse. */
  gradientFrom?: string;
  gradientTo?: string;
}

/**
 * AnimatedBeam: draws a curve between two elements and sends a pulse along it.
 *
 * Positions are measured from the DOM rather than hard-coded, and re-measured
 * on resize, so the diagram survives any layout change. The pulse itself is an
 * SVG circle animated along the same path via SMIL, which avoids depending on
 * `offset-path` support.
 */
export function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  endYOffset = 0,
  reverse = false,
  duration = 3,
  delay = 0,
  gradientFrom = '#e85d04',
  gradientTo = '#fdeee2',
}: AnimatedBeamProps) {
  const tier = useDeviceTier();
  const allowed = useMotionAllowed(tier);
  const idRef = useRef(`beam-${Math.random().toString(36).slice(2, 9)}`);

  const [from, setFrom] = useState<Point>({ x: 0, y: 0 });
  const [to, setTo] = useState<Point>({ x: 0, y: 0 });

  const measure = useCallback(() => {
    const container = containerRef.current;
    const fromEl = fromRef.current;
    const toEl = toRef.current;
    if (!container || !fromEl || !toEl) return;

    const box = container.getBoundingClientRect();
    const a = fromEl.getBoundingClientRect();
    const b = toEl.getBoundingClientRect();

    setFrom({
      x: a.left - box.left + a.width / 2,
      y: a.top - box.top + a.height / 2,
    });
    setTo({
      x: b.left - box.left + b.width / 2,
      y: b.top - box.top + b.height / 2 + endYOffset,
    });
  }, [containerRef, fromRef, toRef, endYOffset]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    window.addEventListener('resize', measure);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [containerRef, measure]);

  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2 + curvature;
  const path = `M ${from.x},${from.y} Q ${midX},${midY} ${to.x},${to.y}`;

  if (from.x === 0 && from.y === 0 && to.x === 0 && to.y === 0) return null;

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      fill="none"
    >
      <defs>
        <linearGradient id={idRef.current} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={gradientFrom} />
          <stop offset="100%" stopColor={gradientTo} />
        </linearGradient>
      </defs>

      {/* The track */}
      <path d={path} stroke="#e8e6e1" strokeWidth="1.5" strokeDasharray="5 5" />

      {/* The lit run, revealed progressively */}
      <path
        d={path}
        stroke={`url(#${idRef.current})`}
        strokeWidth="1.5"
        strokeLinecap="round"
        className="beam-draw"
        style={{ animationDelay: `${delay}s` }}
      />

      {allowed && (
        <circle r="4" fill={gradientFrom}>
          <animateMotion
            dur={`${duration}s`}
            begin={`${delay}s`}
            repeatCount="indefinite"
            path={path}
            keyPoints={reverse ? '1;0' : '0;1'}
            keyTimes="0;1"
            calcMode="linear"
          />
        </circle>
      )}
    </svg>
  );
}

/** A labelled node used at either end of a beam. */
export function BeamNode({
  children,
  label,
  className,
  nodeRef,
  emphasis = false,
  delay = 0,
}: {
  children?: React.ReactNode;
  label?: string;
  className?: string;
  nodeRef?: RefObject<HTMLDivElement | null>;
  emphasis?: boolean;
  delay?: number;
}) {
  const tier = useDeviceTier();
  const allowed = useMotionAllowed(tier);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        ref={nodeRef as React.RefObject<HTMLDivElement>}
        className={cn(
          'relative z-10 flex items-center justify-center border-2 border-ink',
          emphasis ? 'size-16 bg-gold' : 'size-12 bg-cream',
          allowed ? 'animate-node-float' : '',
          className
        )}
        style={allowed ? { animationDelay: `${delay}s` } : undefined}
      >
        {children}
      </div>
      {label ? (
        <span className="text-[0.625rem] font-medium uppercase tracking-[0.14em] text-ink-mute">
          {label}
        </span>
      ) : null}
    </div>
  );
}

export default AnimatedBeam;
