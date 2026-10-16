import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { useDeviceTier, useMotionAllowed } from '../../lib/useDeviceTier';

/* -------------------------------------------------------------------------
   Highlighter, a marker stroke that draws itself in behind, or under, text.

   The stroke is an SVG path sized to the text box, revealed with a
   stroke-dashoffset animation once the words are on screen.
   ------------------------------------------------------------------------- */
export function Highlighter({
  children,
  action = 'highlight',
  color = '#e85d04',
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  action?: 'highlight' | 'underline';
  color?: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);
  const tier = useDeviceTier();
  const allowed = useMotionAllowed(tier);

  useEffect(() => {
    const node = ref.current;
    if (!node || !allowed) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [allowed]);

  const isUnderline = action === 'underline';

  return (
    <span ref={ref} className={cn('relative inline-block', className)}>
      <span className="relative z-10">{children}</span>
      {allowed ? (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute left-0 w-full"
          style={
            isUnderline
              ? { bottom: '-0.18em', height: '0.3em' }
              : { top: '-0.02em', height: '1.12em' }
          }
          viewBox="0 0 100 12"
          preserveAspectRatio="none"
        >
          <path
            d={
              isUnderline
                ? 'M1,8 Q25,3 50,7 T99,5'
                : 'M1,7 Q25,2 50,6 T99,4 L99,10 Q75,12 50,11 T1,10 Z'
            }
            fill={isUnderline ? 'none' : color}
            stroke={isUnderline ? color : 'none'}
            strokeWidth={isUnderline ? 1.6 : 0}
            strokeLinecap="round"
            opacity={isUnderline ? 1 : 0.28}
            style={{
              strokeDasharray: 200,
              strokeDashoffset: inView ? 0 : 200,
              transition: `stroke-dashoffset 900ms cubic-bezier(0.22,1,0.36,1) ${delay}s, opacity 400ms ease ${delay}s`,
              opacity: inView ? (isUnderline ? 1 : 0.28) : 0,
            }}
          />
        </svg>
      ) : null}
    </span>
  );
}

/* -------------------------------------------------------------------------
   DiaTextReveal, cycles phrases through a masked sweep, so one word swaps
   into the next like a projector changing slide.
   ------------------------------------------------------------------------- */
export function DiaTextReveal({
  text,
  className = '',
  repeatDelay = 1800,
  interval = 2200,
}: {
  text: string[];
  className?: string;
  repeatDelay?: number;
  interval?: number;
}) {
  const tier = useDeviceTier();
  const allowed = useMotionAllowed(tier);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!allowed || text.length < 2) return;

    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex(prev => (prev + 1) % text.length);
        setVisible(true);
      }, 420);
    }, interval + repeatDelay);

    return () => clearInterval(cycle);
  }, [allowed, text.length, interval, repeatDelay]);

  return (
    <span className={cn('relative inline-block align-baseline', className)}>
      <span
        className="inline-block transition-[clip-path,opacity,transform] duration-500 ease-out"
        style={{
          clipPath: visible ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(0.35em)',
        }}
      >
        {text[index]}
      </span>
    </span>
  );
}

/* -------------------------------------------------------------------------
   PixelImage, the photograph assembles from a grid of tiles on scroll-in.
   ------------------------------------------------------------------------- */
export function PixelImage({
  src,
  alt,
  rows = 4,
  cols = 6,
  className = '',
  aspect = '4/3',
  grayscale = true,
}: {
  src: string;
  alt: string;
  rows?: number;
  cols?: number;
  className?: string;
  aspect?: string;
  grayscale?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [assembled, setAssembled] = useState(false);
  const tier = useDeviceTier();
  const allowed = useMotionAllowed(tier);

  useEffect(() => {
    const node = ref.current;
    if (!node || !allowed) {
      setAssembled(true);
      return;
    }
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) {
          setAssembled(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [allowed]);

  // Reduced motion / low power: a plain image, no tiles at all.
  if (!allowed) {
    return (
      <div className={className} style={{ aspectRatio: aspect }}>
        <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
      </div>
    );
  }

  const tiles = Array.from({ length: rows * cols }, (_, i) => ({
    row: Math.floor(i / cols),
    col: i % cols,
  }));

  return (
    <div
      ref={ref}
      className={cn('relative overflow-hidden bg-ink', className)}
      style={{ aspectRatio: aspect }}
      role="img"
      aria-label={alt}
    >
      {tiles.map(tile => {
        const x = (tile.col / (cols - 1)) * 100;
        const y = (tile.row / (rows - 1)) * 100;
        // Diagonal stagger reads more like an assembly than a sweep.
        const order = tile.row + tile.col;
        const maxOrder = rows + cols - 2;

        return (
          <span
            key={`${tile.row}-${tile.col}`}
            className="absolute"
            style={{
              left: `${(tile.col / cols) * 100}%`,
              top: `${(tile.row / rows) * 100}%`,
              width: `${100 / cols + 0.35}%`,
              height: `${100 / rows + 0.35}%`,
              backgroundImage: `url(${src})`,
              backgroundSize: `${cols * 100}% ${rows * 100}%`,
              backgroundPosition: `${x}% ${y}%`,
              filter: grayscale ? 'grayscale(1)' : undefined,
              opacity: assembled ? 1 : 0,
              transform: assembled ? 'translateZ(0) scale(1)' : 'scale(0.82)',
              transition: `opacity 520ms ease ${(order / maxOrder) * 0.5}s, transform 620ms cubic-bezier(0.22,1,0.36,1) ${(order / maxOrder) * 0.5}s, filter 700ms ease ${(order / maxOrder) * 0.5}s`,
            }}
          />
        );
      })}
    </div>
  );
}
