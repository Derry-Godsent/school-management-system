import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/cn';
import { usePointerFx } from './usePointerFx';
import { useDeviceTier, useMotionAllowed } from '../../lib/useDeviceTier';

interface ButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  /** Set false to opt this button out of the pointer tilt and spotlight. */
  magnetic?: boolean;
  /** Colour scheme. */
  tone?: 'gold' | 'ink' | 'outline' | 'paper';
  /** `sm` suits the nav bar, where the bar itself is only 64px tall. */
  size?: 'md' | 'sm';
}

const SIZE: Record<NonNullable<ButtonProps['size']>, string> = {
  md: 'px-7 py-4 text-xs',
  sm: 'px-6 py-3 text-[0.6875rem]',
};

// Fill and text colour are kept apart. `cn()` is a plain joiner rather than a
// tailwind-merge, so emitting two conflicting colour utilities would leave the
// winner down to stylesheet order.
const FILL: Record<NonNullable<ButtonProps['tone']>, string> = {
  gold: 'bg-gold',
  ink: 'bg-ink',
  paper: 'bg-paper',
  outline: 'bg-transparent border border-paper/50',
};

const TEXT: Record<NonNullable<ButtonProps['tone']>, { rest: string; hover: string }> = {
  gold: { rest: 'text-ink', hover: 'text-paper' },
  ink: { rest: 'text-paper', hover: 'text-ink' },
  paper: { rest: 'text-ink', hover: 'text-paper' },
  outline: { rest: 'text-paper', hover: 'text-ink' },
};

const FLOOD: Record<NonNullable<ButtonProps['tone']>, string> = {
  gold: 'bg-ink',
  ink: 'bg-gold',
  paper: 'bg-ink',
  outline: 'bg-gold',
};

/**
 * The pool of light that follows the cursor. Sits above the fill and below the
 * label, and fades in on hover.
 */
function Spotlight({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'spotlight-layer pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100',
        className
      )}
    />
  );
}

/**
 * InteractiveHoverButton: a dot that floods the face, a light that follows the
 * cursor, and a slight tilt toward it.
 *
 * The tilt is rotation only. The button's layout box never moves, which is what
 * guarantees a row of buttons can never drift into one another.
 */
export function InteractiveHoverButton({
  children,
  className = '',
  onClick,
  magnetic = true,
  tone = 'gold',
  size = 'md',
}: ButtonProps) {
  const tier = useDeviceTier();
  const allowed = useMotionAllowed(tier);
  const { ref, active, style } = usePointerFx({ maxTilt: magnetic ? 7 : 0 });
  const [hovered, setHovered] = useState(false);

  return (
    <div className={cn('tilt-stage inline-block', className)}>
      <motion.div
        ref={ref}
        style={active ? style : undefined}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="tilt-plane inline-block"
      >
        <button
          type="button"
          onClick={onClick}
          className={cn(
            'group relative inline-flex items-center justify-center gap-3 overflow-hidden',
            'font-semibold tracking-[0.16em] uppercase transition-colors duration-500',
            SIZE[size],
            FILL[tone],
            hovered ? TEXT[tone].hover : TEXT[tone].rest
          )}
        >
          {/* The dot that floods the face. Geometry is inline so it cannot lose
              a specificity race with the resting classes. */}
          <span
            aria-hidden="true"
            className={cn(
              'absolute top-1/2 -translate-y-1/2 rounded-full transition-all duration-500 ease-out',
              FLOOD[tone]
            )}
            style={
              hovered
                ? { left: '-15%', width: '130%', height: '420%' }
                : { left: '0.75rem', width: '0.5rem', height: '0.5rem' }
            }
          />
          {allowed ? <Spotlight className="mix-blend-plus-lighter" /> : null}
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
    </div>
  );
}

/**
 * ShimmerButton: a band of light sweeping the face, over the same tilt and
 * cursor spotlight.
 */
export function ShimmerButton({
  children,
  className = '',
  onClick,
  magnetic = true,
  size = 'md',
}: ButtonProps) {
  const tier = useDeviceTier();
  const allowed = useMotionAllowed(tier);
  const { ref, active, style } = usePointerFx({ maxTilt: magnetic ? 6 : 0 });

  return (
    <div className={cn('tilt-stage inline-block', className)}>
      <motion.div ref={ref} style={active ? style : undefined} className="tilt-plane inline-block">
        <button
          type="button"
          onClick={onClick}
          className={cn(
            'group relative inline-flex items-center justify-center overflow-hidden',
            'bg-ink font-semibold tracking-[0.16em] uppercase text-paper',
            'transition-transform duration-300',
            SIZE[size]
          )}
        >
          {/* Orange hairline ring that lights up as the pointer arrives */}
          <span
            aria-hidden="true"
            className="absolute inset-0 border border-gold/0 transition-colors duration-500 group-hover:border-gold/70"
          />
          <span aria-hidden="true" className="shimmer-sweep pointer-events-none absolute inset-0" />
          {allowed ? <Spotlight className="mix-blend-plus-lighter" /> : null}
          <span className="relative z-10">{children}</span>
        </button>
      </motion.div>
    </div>
  );
}

/**
 * MagneticNavLink: a nav item whose highlight is a single element shared across
 * the whole menu.
 *
 * One `motion.span` carries the highlight, and because every item renders the
 * same `layoutId`, Framer moves it from wherever it was to wherever it now is.
 * The highlight therefore glides between links instead of cutting, which is the
 * effect that makes a menu feel alive.
 *
 * It is lit by hover when the pointer is anywhere in the menu, and falls back to
 * the current page when the pointer leaves, so the marker always has a home.
 */
export function MagneticNavLink({
  children,
  to,
  active = false,
  lit = false,
  onEnter,
  highlightId = 'nav-highlight',
}: {
  children: ReactNode;
  to: string;
  active?: boolean;
  lit?: boolean;
  onEnter?: () => void;
  highlightId?: string;
}) {
  const tier = useDeviceTier();
  const allowed = useMotionAllowed(tier);
  const { ref, active: fxOn, style } = usePointerFx({ maxTilt: 6 });
  void active;

  return (
    <span ref={ref} className="tilt-stage inline-block" onMouseEnter={onEnter}>
      <motion.span style={fxOn ? style : undefined} className="tilt-plane relative inline-block">
        {lit ? (
          <motion.span
            layoutId={highlightId}
            aria-hidden="true"
            className="absolute inset-0 bg-ink"
            transition={{ type: 'spring', stiffness: 420, damping: 34, mass: 0.7 }}
          />
        ) : null}
        <Link
          to={to}
          aria-current={active ? 'page' : undefined}
          className="relative block px-4 py-2 text-sm"
        >
          <span
            className={cn(
              'relative z-10 block transition-colors duration-300',
              lit ? 'font-medium text-paper' : 'text-ink-mute'
            )}
          >
            {children}
          </span>
        </Link>
      </motion.span>
    </span>
  );
}
