import { useRef, useState, type ReactNode, type MouseEvent } from 'react';
import { motion, useSpring } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/cn';
import { useDeviceTier, useMotionAllowed } from '../../lib/useDeviceTier';

/* -------------------------------------------------------------------------
   useMagnetic — pulls an element toward the cursor while it is nearby.
   This is the "button follows the pointer" effect.
   ------------------------------------------------------------------------- */
function useMagnetic(strength = 0.35) {
  const ref = useRef<HTMLDivElement>(null);
  const tier = useDeviceTier();
  const allowed = useMotionAllowed(tier);
  const active = allowed && tier.canHover && !tier.isTouch;

  const x = useSpring(0, { stiffness: 220, damping: 18, mass: 0.35 });
  const y = useSpring(0, { stiffness: 220, damping: 18, mass: 0.35 });

  const onMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!active || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return { ref, x, y, active, onMove, onLeave };
}

interface ButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  magnetic?: boolean;
  /** Colour scheme: gold fill (default) or ink fill. */
  tone?: 'gold' | 'ink' | 'outline';
}

// Fill and text colour are kept apart. `cn()` is a plain joiner rather than a
// tailwind-merge, so emitting two conflicting colour utilities would leave the
// winner down to stylesheet order.
const FILL: Record<NonNullable<ButtonProps['tone']>, string> = {
  gold: 'bg-gold',
  ink: 'bg-ink',
  outline: 'bg-transparent border border-paper/50',
};

const TEXT: Record<NonNullable<ButtonProps['tone']>, { rest: string; hover: string }> = {
  gold: { rest: 'text-ink', hover: 'text-paper' },
  ink: { rest: 'text-paper', hover: 'text-ink' },
  outline: { rest: 'text-paper', hover: 'text-ink' },
};

/* -------------------------------------------------------------------------
   InteractiveHoverButton — a small dot expands to flood the button while the
   label slides across and an arrow enters from the right.
   ------------------------------------------------------------------------- */
export function InteractiveHoverButton({
  children,
  className = '',
  onClick,
  magnetic = true,
  tone = 'gold',
}: ButtonProps) {
  const { ref, x, y, active, onMove, onLeave } = useMagnetic(0.3);
  const [hovered, setHovered] = useState(false);

  // The flood is always the opposite of the resting fill, so the label stays
  // legible the whole way through.
  const fill = FILL[tone];
  const flood = tone === 'gold' ? 'bg-ink' : 'bg-gold';

  return (
    <motion.div
      ref={ref}
      style={active ? { x, y } : undefined}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        onLeave();
      }}
      className="inline-block"
    >
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'group relative inline-flex items-center justify-center gap-3 overflow-hidden px-7 py-4',
          'text-xs font-semibold tracking-[0.16em] uppercase transition-colors duration-500',
          fill,
          hovered ? TEXT[tone].hover : TEXT[tone].rest,
          className
        )}
      >
        {/* The dot that floods the face. Geometry is inline so it cannot lose a
            specificity race with the resting classes. */}
        <span
          aria-hidden="true"
          className={cn(
            'absolute top-1/2 -translate-y-1/2 rounded-full transition-all duration-500 ease-out',
            flood
          )}
          style={
            hovered
              ? { left: '-15%', width: '130%', height: '420%' }
              : { left: '0.75rem', width: '0.5rem', height: '0.5rem' }
          }
        />
        <span className="relative z-10 flex items-center gap-3">
          <span className="transition-transform duration-500 group-hover:-translate-x-1">
            {children}
          </span>
          <ArrowRight
            size={15}
            className="translate-x-3 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100"
          />
        </span>
      </button>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------
   ShimmerButton — a band of light sweeps across the face on a slow loop.
   ------------------------------------------------------------------------- */
export function ShimmerButton({
  children,
  className = '',
  onClick,
  magnetic = true,
}: ButtonProps) {
  const { ref, x, y, active, onMove, onLeave } = useMagnetic(0.25);

  return (
    <motion.div
      ref={ref}
      style={active ? { x, y } : undefined}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="inline-block"
    >
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'group relative inline-flex items-center justify-center overflow-hidden',
          'bg-ink px-7 py-4 text-xs font-semibold tracking-[0.16em] uppercase text-paper',
          'transition-transform duration-300 hover:scale-[1.02] active:scale-[0.99]',
          className
        )}
      >
        {/* Gold hairline ring that lights up on hover */}
        <span
          aria-hidden="true"
          className="absolute inset-0 border border-gold/0 transition-colors duration-500 group-hover:border-gold/60"
        />
        {/* Sweeping highlight */}
        <span
          aria-hidden="true"
          className="shimmer-sweep pointer-events-none absolute inset-0"
        />
        <span className="relative z-10">{children}</span>
      </button>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------
   MagneticLink — anchor/nav variant: follows the pointer, no flood.
   ------------------------------------------------------------------------- */
export function MagneticLink({
  children,
  className = '',
  onClick,
  strength = 0.2,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number;
}) {
  const { ref, x, y, active, onMove, onLeave } = useMagnetic(strength);

  return (
    <motion.div
      ref={ref}
      style={active ? { x, y } : undefined}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="inline-block"
    >
      <button type="button" onClick={onClick} className={className}>
        {children}
      </button>
    </motion.div>
  );
}
