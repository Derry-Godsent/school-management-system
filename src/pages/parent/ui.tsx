import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { X, type LucideIcon } from 'lucide-react';
import { useScrollLock } from '../../components/fx';
import { getGrade } from '../../data';

/**
 * The card kit the portal is built from.
 *
 * This is a phone app, so the page is a stack of cards rather than a run of
 * paragraphs. The point of a card is that it separates one idea from the next,
 * which is what stops a long page reading as a wall of text.
 *
 * The cards are deliberately not all the same shape. A screen mixes:
 *
 *   numbers    solid colour tiles, big figure, one label. The most colour.
 *   the lead   one dark card, for the thing that matters most on the screen.
 *   groups     a light card with a coloured bar, holding a short list.
 *   details    a plain card, for reading rather than scanning.
 *   attention  a card with a coloured edge, for what needs doing.
 *
 * Corners are slightly rounded here, unlike the marketing site, because that is
 * what a phone app looks like. Colour carries meaning consistently across every
 * screen: green for attendance, purple for grades, yellow for money, orange for
 * notices, so a parent learns the scheme once.
 */

export type Tone = 'orange' | 'green' | 'purple' | 'yellow' | 'ink' | 'plain';

interface ToneSet {
  /** Bright fill, for a tile that has to shout. Text on it is ink or paper. */
  strong: string;
  /** Text colour that belongs on the strong fill. */
  onStrong: string;
  /** Pale fill, for a quiet card. */
  tint: string;
  /** Deep accent, for text and edges on a pale card. */
  deep: string;
  /** The bright colour itself, for bars and meters. */
  bright: string;
}

const TONE: Record<Tone, ToneSet> = {
  orange: {
    strong: 'bg-gold',
    onStrong: 'text-ink',
    tint: 'bg-tint-orange',
    deep: 'text-gold-deep',
    bright: 'bg-gold',
  },
  green: {
    strong: 'bg-green',
    onStrong: 'text-ink',
    tint: 'bg-tint-green',
    deep: 'text-green-deep',
    bright: 'bg-green',
  },
  purple: {
    strong: 'bg-purple',
    onStrong: 'text-paper',
    tint: 'bg-tint-purple',
    deep: 'text-purple-deep',
    bright: 'bg-purple',
  },
  yellow: {
    strong: 'bg-yellow',
    onStrong: 'text-ink',
    tint: 'bg-tint-yellow',
    deep: 'text-yellow-deep',
    bright: 'bg-yellow',
  },
  ink: {
    strong: 'bg-ink',
    onStrong: 'text-paper',
    tint: 'bg-ink',
    deep: 'text-paper',
    bright: 'bg-ink',
  },
  plain: {
    strong: 'bg-paper',
    onStrong: 'text-ink',
    tint: 'bg-paper',
    deep: 'text-ink-mute',
    bright: 'bg-ink-mute',
  },
};

export const tones = TONE;

/** The colour a domain always uses, so a parent learns it once. */
export const domainTone = {
  attendance: 'green',
  grades: 'purple',
  fees: 'yellow',
  notices: 'orange',
  class: 'green',
  account: 'orange',
} as const satisfies Record<string, Tone>;

function initials(name: string): string {
  const parts = name.replace(/^(Mr\.|Mrs\.|Madam|Master|Miss)\s+/i, '').split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const AVATAR_TONES: Tone[] = ['orange', 'green', 'purple', 'yellow'];

function toneForName(name: string): Tone {
  let sum = 0;
  for (let index = 0; index < name.length; index += 1) sum += name.charCodeAt(index);
  return AVATAR_TONES[sum % AVATAR_TONES.length];
}

/* -------------------------------------------------------------------------- */
/* Cards                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Card.
 *
 * `solid`  a pale block of colour, flat, no border.
 * `top`    a light card with a bright bar across the top, the workhorse.
 * `left`   a light card with a bright edge down the side, for a note.
 * `dark`   the one card per screen that carries the most weight.
 * `bare`   a light card with a hairline edge and nothing else.
 */
export function Card({
  children,
  tone = 'plain',
  shape = 'top',
  className = '',
}: {
  children: ReactNode;
  tone?: Tone;
  shape?: 'solid' | 'top' | 'left' | 'dark' | 'bare';
  className?: string;
}) {
  const palette = TONE[shape === 'dark' ? 'ink' : tone];
  const skin = {
    solid: `${palette.tint} rounded-xl`,
    top: `bg-paper rounded-xl shadow-[0_1px_2px_rgba(17,17,17,0.05)]`,
    left: `${palette.tint} rounded-xl border-l-4 ${edgeOf(tone)}`,
    dark: `bg-ink rounded-xl`,
    bare: `bg-paper rounded-xl border border-rule`,
  }[shape];

  return (
    <section className={`relative overflow-hidden ${skin} ${className}`}>
      {shape === 'top' ? <span className={`absolute inset-x-0 top-0 h-1 ${palette.bright}`} aria-hidden="true" /> : null}
      {children}
    </section>
  );
}

function edgeOf(tone: Tone): string {
  return {
    orange: 'border-gold-deep',
    green: 'border-green-deep',
    purple: 'border-purple-deep',
    yellow: 'border-yellow-deep',
    ink: 'border-ink',
    plain: 'border-rule',
  }[tone];
}

/** The standard inside of a card: padding, and a heading row. */
export function CardBody({
  children,
  className = '',
  tight = false,
}: {
  children: ReactNode;
  className?: string;
  tight?: boolean;
}) {
  return <div className={`${tight ? 'p-4' : 'p-5'} ${className}`}>{children}</div>;
}

export function CardHead({
  eyebrow,
  title,
  action,
  dark = false,
}: {
  eyebrow?: ReactNode;
  title?: ReactNode;
  action?: ReactNode;
  dark?: boolean;
}) {
  return (
    <div className="mb-3.5 flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        {eyebrow ? (
          <p className={`text-[0.625rem] font-semibold uppercase tracking-[0.16em] ${dark ? 'text-yellow' : 'text-ink-mute'}`}>
            {eyebrow}
          </p>
        ) : null}
        {title ? (
          <h2 className={`mt-1 font-display text-lg leading-snug ${dark ? 'text-paper' : 'text-ink'}`}>{title}</h2>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/**
 * StatTile: a solid block of colour with one number on it.
 *
 * These carry the colour on a screen. Four of them in a row, in four different
 * colours, is what makes the app feel alive rather than grey.
 */
export function StatTile({
  label,
  value,
  note,
  tone = 'plain',
  size = 'md',
}: {
  label: string;
  value: ReactNode;
  note?: ReactNode;
  tone?: Tone;
  size?: 'sm' | 'md' | 'lg';
}) {
  const palette = TONE[tone];
  const strong = tone !== 'plain';
  const figure = { sm: 'text-xl', md: 'text-2xl', lg: 'text-[2rem]' }[size];

  return (
    <div className={`rounded-xl ${strong ? palette.strong : 'bg-paper border border-rule'} px-4 py-3.5`}>
      <p
        className={`text-[0.625rem] font-semibold uppercase tracking-[0.14em] ${
          strong ? palette.onStrong : 'text-ink-mute'
        }`}
      >
        {label}
      </p>
      <p className={`mt-1.5 font-display leading-none ${figure} ${strong ? palette.onStrong : 'text-ink'}`}>{value}</p>
      {note ? (
        <p className={`mt-2 text-[0.75rem] leading-snug ${strong ? palette.onStrong : 'text-ink-mute'}`}>{note}</p>
      ) : null}
    </div>
  );
}

export function Chip({
  children,
  tone = 'plain',
  solid = false,
}: {
  children: ReactNode;
  tone?: Tone;
  solid?: boolean;
}) {
  const palette = TONE[tone];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.1em] ${
        solid ? `${palette.strong} ${palette.onStrong}` : `${palette.tint} ${palette.deep}`
      }`}
    >
      {children}
    </span>
  );
}

export function Avatar({
  name,
  size = 'md',
  tone,
}: {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  tone?: Tone;
}) {
  const chosen = tone ?? toneForName(name);
  const palette = TONE[chosen];
  const box = {
    sm: 'h-8 w-8 text-[0.6875rem]',
    md: 'h-11 w-11 text-sm',
    lg: 'h-14 w-14 text-base',
    xl: 'h-20 w-20 text-xl',
  }[size];
  return (
    <span
      aria-hidden="true"
      className={`inline-flex ${box} shrink-0 items-center justify-center rounded-full font-semibold ${palette.strong} ${palette.onStrong}`}
    >
      {initials(name)}
    </span>
  );
}

/** A labelled row inside a card. Kept to one line wherever possible. */
export function Row({
  label,
  children,
  tone,
}: {
  label: ReactNode;
  children: ReactNode;
  tone?: Tone;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 border-b border-rule py-2.5 last:border-b-0">
      <dt className="text-[0.8125rem] text-ink-mute">{label}</dt>
      <dd className={`text-[0.875rem] font-medium ${tone ? TONE[tone].deep : 'text-ink'}`}>{children}</dd>
    </div>
  );
}

export function Meter({ value, max = 100, tone = 'orange' }: { value: number; max?: number; tone?: Tone }) {
  const percent = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  return (
    <span className="block h-2 w-full overflow-hidden rounded-full bg-rule" role="presentation">
      <span className={`block h-full rounded-full ${TONE[tone].bright}`} style={{ width: `${percent}%` }} />
    </span>
  );
}

/** A small coloured square holding an icon, used on top of a card. */
export function IconBadge({ icon: Icon, tone = 'orange' }: { icon: LucideIcon; tone?: Tone }) {
  const palette = TONE[tone];
  return (
    <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${palette.strong} ${palette.onStrong}`}>
      <Icon size={17} aria-hidden="true" />
    </span>
  );
}

export function gradeNote(score: number): string {
  const grade = getGrade(score);
  return `Grade ${grade.grade} · ${grade.remark}`;
}

export function scoreTone(score: number): Tone {
  if (score >= 80) return 'green';
  if (score >= 70) return 'orange';
  if (score >= 60) return 'yellow';
  return 'purple';
}

export function Delta({ from, to, dark = false }: { from: number; to: number; dark?: boolean }) {
  const change = to - from;
  if (change === 0) return <span className={`text-[0.75rem] ${dark ? 'text-paper' : 'text-ink-mute'}`}>No change</span>;
  const up = change > 0;
  return (
    <span className={`text-[0.75rem] font-semibold ${up ? (dark ? 'text-yellow' : 'text-green-deep') : dark ? 'text-paper' : 'text-gold-deep'}`}>
      {up ? 'Up' : 'Down'} {Math.abs(change)}
    </span>
  );
}

export function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
}) {
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-ink/70" />
      <div className="relative z-10 max-h-[86vh] w-full overflow-y-auto rounded-t-2xl bg-paper px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 shadow-2xl sm:max-w-lg sm:rounded-2xl sm:px-6 sm:py-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0 font-display text-lg text-ink">{title}</div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 -mt-1 shrink-0 rounded-lg p-2 text-ink-mute transition-colors hover:bg-cream hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/** A short line of plain language under a heading. No more than a sentence. */
export function Led({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return <p className={`text-[0.875rem] leading-relaxed ${dark ? 'text-paper' : 'text-ink-mute'}`}>{children}</p>;
}

/** The link that takes a parent to the fuller screen. */
export function MoreLink({ to, children, tone = 'orange' }: { to: string; children: ReactNode; tone?: Tone }) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-1.5 text-[0.75rem] font-semibold uppercase tracking-[0.12em] ${TONE[tone].deep}`}
    >
      {children}
    </Link>
  );
}
