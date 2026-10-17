import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronRight, type LucideIcon } from 'lucide-react';
import { useScrollLock } from '../../components/fx';
import { getGrade } from '../../data';

/**
 * The portal's card kit, built the way mobile apps are built.
 *
 * The rules this file follows, taken from how real apps are put together:
 *
 *   The ground is soft. Every card is white, sits on a pale grey ground, and has
 *   generous rounded corners and a very light shadow. That is what makes a card
 *   read as raised. Nothing here is a heavy colour block, and nothing is black:
 *   a large dark surface is the single thing that makes an app look wrong.
 *
 *   Colour arrives in small doses. A tinted rounded square holding a coloured
 *   icon, a coloured chip, a progress bar, a number. One saturated card per
 *   screen at most, and only when something has to shout, such as a fee balance.
 *
 *   Every number is a figure first and a word second. Values are large and set
 *   in tabular figures so they line up; labels are small, quiet and above or
 *   below them.
 *
 *   Anything tappable is at least 44 pixels tall and has a visible response on
 *   press, because that is the minimum a thumb can reliably hit.
 *
 * The colours keep their meaning from screen to screen: green is attendance,
 * purple is grades, yellow is money, orange is notices.
 */

export type Tone = 'orange' | 'green' | 'purple' | 'yellow' | 'ink' | 'plain';

interface ToneSet {
  /** The pale ground of a chip or a tinted card. */
  tint: string;
  /** The deep accent that is readable on that tint and on white. */
  deep: string;
  /** The saturated colour, for a fill that carries ink or paper text. */
  solid: string;
  /** Text colour that belongs on the solid fill. */
  onSolid: string;
  /** The saturated colour as a utility, for bars and rings. */
  bar: string;
  /** The ring colour for a coloured circle. */
  ring: string;
}

const TONE: Record<Tone, ToneSet> = {
  orange: {
    tint: 'bg-tint-orange',
    deep: 'text-gold-deep',
    solid: 'bg-gold',
    onSolid: 'text-ink',
    bar: 'bg-gold',
    ring: 'border-gold',
  },
  green: {
    tint: 'bg-tint-green',
    deep: 'text-green-deep',
    solid: 'bg-green',
    onSolid: 'text-ink',
    bar: 'bg-green',
    ring: 'border-green',
  },
  purple: {
    tint: 'bg-tint-purple',
    deep: 'text-purple-deep',
    solid: 'bg-purple',
    onSolid: 'text-paper',
    bar: 'bg-purple',
    ring: 'border-purple',
  },
  yellow: {
    tint: 'bg-tint-yellow',
    deep: 'text-yellow-deep',
    solid: 'bg-yellow',
    onSolid: 'text-ink',
    bar: 'bg-yellow',
    ring: 'border-yellow',
  },
  ink: {
    tint: 'bg-canvas-deep',
    deep: 'text-ink',
    solid: 'bg-canvas-deep',
    onSolid: 'text-ink',
    bar: 'bg-canvas-deep',
    ring: 'border-rule',
  },
  plain: {
    tint: 'bg-canvas-deep',
    deep: 'text-ink-mute',
    solid: 'bg-canvas-deep',
    onSolid: 'text-ink',
    bar: 'bg-canvas-deep',
    ring: 'border-rule',
  },
};

export const tones = TONE;

/** The colour each subject of the app always uses. */
export const domainTone = {
  grades: 'purple',
  attendance: 'green',
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
/* Surfaces                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Card: the one surface everything sits on. White, rounded, barely shadowed.
 * `tint` softens the ground to a colour; `hero` is the one saturated card a
 * screen is allowed, for a figure that has to shout.
 */
export function Card({
  children,
  tone = 'plain',
  variant = 'plain',
  className = '',
  to,
}: {
  children: ReactNode;
  tone?: Tone;
  variant?: 'plain' | 'tint' | 'hero';
  className?: string;
  to?: string;
}) {
  const palette = TONE[tone];
  const skin = {
    plain: 'bg-paper shadow-[0_1px_3px_rgba(17,17,17,0.06),0_1px_2px_rgba(17,17,17,0.04)]',
    tint: `${palette.tint}`,
    hero: `${palette.solid} shadow-[0_6px_18px_rgba(17,17,17,0.10)]`,
  }[variant];

  const body = <div className={`overflow-hidden rounded-2xl ${skin} ${className}`}>{children}</div>;

  if (!to) return body;
  return (
    <Link to={to} className="block transition-transform active:scale-[0.99]">
      {body}
    </Link>
  );
}

/** The inside of a card. Roomier than a website card, because thumbs. */
export function CardPad({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

export function CardHead({
  title,
  sub,
  action,
  tone = 'plain',
  icon: Icon,
  onSolid = false,
}: {
  title?: ReactNode;
  sub?: ReactNode;
  action?: ReactNode;
  tone?: Tone;
  icon?: LucideIcon;
  onSolid?: boolean;
}) {
  return (
    <div className="mb-3 flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2.5">
        {Icon ? <IconChip icon={Icon} tone={tone} size="sm" /> : null}
        <div className="min-w-0">
          {title ? (
            <h2 className={`truncate text-[0.9375rem] font-semibold ${onSolid ? 'text-ink' : 'text-ink'}`}>{title}</h2>
          ) : null}
          {sub ? <p className={`mt-0.5 text-[0.75rem] ${onSolid ? 'text-ink' : 'text-ink-mute'}`}>{sub}</p> : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/** A coloured rounded square holding an icon. The signature of a mobile app. */
export function IconChip({
  icon: Icon,
  tone = 'orange',
  size = 'md',
  solid = false,
}: {
  icon: LucideIcon;
  tone?: Tone;
  size?: 'sm' | 'md' | 'lg';
  solid?: boolean;
}) {
  const palette = TONE[tone];
  const box = { sm: 'h-7 w-7 rounded-lg', md: 'h-10 w-10 rounded-xl', lg: 'h-12 w-12 rounded-xl' }[size];
  const glyph = { sm: 14, md: 19, lg: 23 }[size];
  return (
    <span
      className={`inline-flex ${box} shrink-0 items-center justify-center ${
        solid ? `${palette.solid} ${palette.onSolid}` : `${palette.tint} ${palette.deep}`
      }`}
    >
      <Icon size={glyph} aria-hidden="true" />
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Figures                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * StatCard: a white card with a coloured icon, a large figure and a quiet label.
 * Four of these in a row is the top of most app screens.
 */
export function StatCard({
  icon,
  label,
  value,
  note,
  tone = 'orange',
}: {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  note?: ReactNode;
  tone?: Tone;
}) {
  const palette = TONE[tone];
  return (
    <div className="rounded-2xl bg-paper p-3.5 shadow-[0_1px_3px_rgba(17,17,17,0.06),0_1px_2px_rgba(17,17,17,0.04)]">
      <IconChip icon={icon} tone={tone} size="sm" />
      <p className={`mt-2.5 text-[1.375rem] font-semibold leading-none tabular-nums ${palette.deep}`}>{value}</p>
      <p className="mt-1.5 text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-ink-mute">{label}</p>
      {note ? <p className="mt-1 text-[0.6875rem] leading-snug text-ink-mute">{note}</p> : null}
    </div>
  );
}

/** A big figure on a card, with an optional ring or bar underneath. */
export function BigFigure({
  label,
  value,
  sub,
  tone = 'orange',
  onSolid = false,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: Tone;
  onSolid?: boolean;
}) {
  const palette = TONE[tone];
  return (
    <div>
      <p className={`text-[0.6875rem] font-semibold uppercase tracking-[0.12em] ${onSolid ? 'text-ink' : palette.deep}`}>
        {label}
      </p>
      <p className={`mt-1 text-[2rem] font-semibold leading-none tabular-nums ${onSolid ? 'text-ink' : 'text-ink'}`}>
        {value}
      </p>
      {sub ? <p className={`mt-1.5 text-[0.8125rem] ${onSolid ? 'text-ink' : 'text-ink-mute'}`}>{sub}</p> : null}
    </div>
  );
}

export function Meter({ value, max = 100, tone = 'orange' }: { value: number; max?: number; tone?: Tone }) {
  const percent = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  return (
    <span className="block h-2 w-full overflow-hidden rounded-full bg-canvas-deep" role="presentation">
      <span className={`block h-full rounded-full ${TONE[tone].bar}`} style={{ width: `${percent}%` }} />
    </span>
  );
}

/** A little coloured pill. */
export function Chip({
  children,
  tone = 'plain',
  icon: Icon,
}: {
  children: ReactNode;
  tone?: Tone;
  icon?: LucideIcon;
}) {
  const palette = TONE[tone];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold ${palette.tint} ${palette.deep}`}
    >
      {Icon ? <Icon size={11} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

export function Delta({ from, to }: { from: number; to: number }) {
  const change = to - from;
  if (change === 0) return <span className="text-[0.75rem] text-ink-mute">No change</span>;
  const up = change > 0;
  return (
    <span className={`text-[0.75rem] font-semibold ${up ? 'text-green-deep' : 'text-gold-deep'}`}>
      {up ? '+' : ''}
      {change}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* People                                                                     */
/* -------------------------------------------------------------------------- */

export function Avatar({ name, size = 'md', tone }: { name: string; size?: 'sm' | 'md' | 'lg'; tone?: Tone }) {
  const palette = TONE[tone ?? toneForName(name)];
  const box = {
    sm: 'h-9 w-9 text-[0.6875rem]',
    md: 'h-12 w-12 text-sm',
    lg: 'h-16 w-16 text-lg',
  }[size];
  return (
    <span
      aria-hidden="true"
      className={`inline-flex ${box} shrink-0 items-center justify-center rounded-full font-semibold ${palette.solid} ${palette.onSolid}`}
    >
      {initials(name)}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Lists and actions                                                          */
/* -------------------------------------------------------------------------- */

/**
 * ActionTile: the grid of shortcuts at the top of an app home screen. A tinted
 * square, an icon, a two word label. This is what turns a report into an app.
 */
export function ActionTile({
  to,
  icon,
  label,
  tone = 'orange',
  badge,
}: {
  to: string;
  icon: LucideIcon;
  label: string;
  tone?: Tone;
  badge?: number;
}) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center gap-2 rounded-2xl bg-paper px-2 py-3.5 shadow-[0_1px_3px_rgba(17,17,17,0.06)] transition-transform active:scale-[0.97]"
    >
      <span className="relative">
        <IconChip icon={icon} tone={tone} size="md" />
        {badge ? (
          <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[0.625rem] font-bold text-ink">
            {badge}
          </span>
        ) : null}
      </span>
      <span className="text-[0.6875rem] font-medium text-ink">{label}</span>
    </Link>
  );
}

/**
 * Row: a list row. Tinted icon on the left, a title and a quiet subtitle, a
 * value on the right, and a chevron when it goes somewhere.
 */
export function Row({
  icon,
  tone = 'plain',
  title,
  sub,
  trailing,
  to,
  onClick,
  chevron = false,
}: {
  icon?: LucideIcon;
  tone?: Tone;
  title: ReactNode;
  sub?: ReactNode;
  trailing?: ReactNode;
  to?: string;
  onClick?: () => void;
  chevron?: boolean;
}) {
  const inner = (
    <>
      {icon ? <IconChip icon={icon} tone={tone} /> : null}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[0.9375rem] font-medium text-ink">{title}</span>
        {sub ? <span className="mt-0.5 block truncate text-[0.75rem] text-ink-mute">{sub}</span> : null}
      </span>
      {trailing ? <span className="shrink-0 text-right">{trailing}</span> : null}
      {chevron ? <ChevronRight size={17} className="shrink-0 text-ink-mute" aria-hidden="true" /> : null}
    </>
  );

  const skin = 'flex w-full min-h-[3.25rem] items-center gap-3 px-4 py-3 text-left transition-colors active:bg-canvas';

  if (to) {
    return (
      <Link to={to} className={skin}>
        {inner}
      </Link>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={skin}>
        {inner}
      </button>
    );
  }
  return <div className={skin}>{inner}</div>;
}

/** Divider between rows inside one card. */
export function Rule() {
  return <span className="ml-4 block h-px bg-canvas-deep" aria-hidden="true" />;
}

/** A pill group for filtering, the app way. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly T[];
  value: T;
  onChange: (next: T) => void;
  label?: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0"
    >
      {options.map(option => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option)}
            className={`inline-flex min-h-[2.75rem] shrink-0 items-center rounded-full px-3.5 text-[0.8125rem] font-medium transition-colors ${
              active ? 'bg-gold text-ink' : 'bg-paper text-ink-mute shadow-[0_1px_2px_rgba(17,17,17,0.05)]'
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

/** The link a card uses to send a parent on to the fuller screen. */
export function MoreLink({ to, children, tone = 'orange' }: { to: string; children: ReactNode; tone?: Tone }) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-1 text-[0.75rem] font-semibold ${TONE[tone].deep}`}
    >
      {children}
      <ChevronRight size={14} aria-hidden="true" />
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/* Panels and helpers                                                         */
/* -------------------------------------------------------------------------- */

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
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-ink/40" />
      <div className="relative z-10 max-h-[86dvh] w-full overflow-y-auto overscroll-contain rounded-t-3xl bg-paper px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 sm:max-w-lg sm:rounded-3xl sm:px-6 sm:py-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0 text-[1.0625rem] font-semibold text-ink">{title}</div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 -mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-mute transition-colors active:bg-canvas"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/** The large title at the top of a screen, the way an app opens a page. */
export function ScreenTitle({ title, sub }: { title: ReactNode; sub?: ReactNode }) {
  return (
    <div className="px-1 pt-1">
      <h1 className="text-[1.5rem] font-semibold tracking-[-0.01em] text-ink">{title}</h1>
      {sub ? <p className="mt-1 text-[0.8125rem] text-ink-mute">{sub}</p> : null}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, note }: { icon: LucideIcon; title: ReactNode; note?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-4 py-8 text-center">
      <IconChip icon={Icon} tone="plain" size="lg" />
      <p className="mt-3 text-[0.9375rem] font-medium text-ink">{title}</p>
      {note ? <p className="mt-1 text-[0.8125rem] text-ink-mute">{note}</p> : null}
    </div>
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
