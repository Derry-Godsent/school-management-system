import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/cn';
import { useChase } from './useChase';

interface ButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  /** Set false to opt this button out of the pointer chase. */
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
 * InteractiveHoverButton: a dot that floods the face, on a button that follows
 * the pointer.
 *
 * The chase starts before the hover does. As the cursor closes to within about
 * 110px the button leans toward it, and the springs are soft enough that it
 * trails the cursor rather than snapping under it.
 */
export function InteractiveHoverButton({
  children,
  className = '',
  onClick,
  magnetic = true,
  tone = 'gold',
  size = 'md',
}: ButtonProps) {
  const { ref, style, active } = useChase({
    strength: magnetic ? 0.42 : 0,
    radius: magnetic ? 110 : 0,
  });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      style={active ? style : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="inline-block"
    >
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'group relative inline-flex items-center justify-center gap-3 overflow-hidden',
          'font-semibold tracking-[0.16em] uppercase transition-colors duration-500',
          SIZE[size],
          FILL[tone],
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
            FLOOD[tone]
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

/**
 * ShimmerButton: a band of light sweeping across the face on a slow loop, over
 * the same pointer chase.
 */
export function ShimmerButton({
  children,
  className = '',
  onClick,
  magnetic = true,
  size = 'md',
}: ButtonProps) {
  const { ref, style, active } = useChase({
    strength: magnetic ? 0.34 : 0,
    radius: magnetic ? 110 : 0,
  });

  return (
    <motion.div
      ref={ref}
      style={active ? style : undefined}
      className="inline-block"
    >
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'group relative inline-flex items-center justify-center overflow-hidden',
          'bg-ink font-semibold tracking-[0.16em] uppercase text-paper',
          SIZE[size],
          'transition-transform duration-300 hover:scale-[1.02] active:scale-[0.99]',
          className
        )}
      >
        {/* Gold hairline ring that lights up as the pointer arrives */}
        <span
          aria-hidden="true"
          className="absolute inset-0 border border-gold/0 transition-colors duration-500 group-hover:border-gold/60"
        />
        <span aria-hidden="true" className="shimmer-sweep pointer-events-none absolute inset-0" />
        <span className="relative z-10">{children}</span>
      </button>
    </motion.div>
  );
}

/**
 * MagneticNavLink: the nav variant. Deliberately restrained so the menu never
 * shifts around, then the label slides up to reveal a gold copy of itself. The
 * current page keeps a permanent gold marker underneath.
 */
export function MagneticNavLink({
  children,
  to,
  active = false,
  className = '',
}: {
  children: ReactNode;
  to: string;
  active?: boolean;
  className?: string;
}) {
  const { ref, style, active: chaseOn } = useChase({ strength: 0.3, radius: 42 });

  return (
    <motion.span
      ref={ref}
      style={chaseOn ? style : undefined}
      // `group` lives out here so the marker below the link animates with the
      // same hover that slides the label.
      className={cn('group relative inline-block', className)}
    >
      <Link
        to={to}
        aria-current={active ? 'page' : undefined}
        className="relative block overflow-hidden py-1 text-sm"
      >
        {/* Two stacked copies: the resting one slides up and out, the gold one
            rises from below to take its place. */}
        <span
          className={cn(
            'block transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full',
            active ? 'font-medium text-gold-deep' : 'text-ink-mute'
          )}
        >
          {children}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 block translate-y-full py-1 text-gold-deep transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0"
        >
          {children}
        </span>
      </Link>

      {/* Marker: a short gold rule that grows from the left on hover, and stays
          put for the current page. */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute -bottom-0.5 left-0 h-[2px] bg-gold transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
          active ? 'w-full' : 'w-0 group-hover:w-full'
        )}
      />
    </motion.span>
  );
}

export default InteractiveHoverButton;
