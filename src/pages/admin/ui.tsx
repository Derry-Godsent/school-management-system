import { useEffect, useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Sparkline, type ChartTone } from './charts';
import { CheckCircle2, ChevronRight, X, type LucideIcon } from 'lucide-react';
import { useScrollLock } from '../../components/fx';

/**
 * The console's kit.
 *
 * The parent app is a phone app, so its kit is built around big friendly cards
 * meant to be read with one thumb. The console is the other side of the same
 * school: it is read at a desk, it holds tables of forty pupils, and it is used
 * all day, so the same colours are arranged more tightly. White surfaces on the
 * pale ground, a left rail instead of a tab bar, hairline rows instead of tall
 * cards, and colour used for meaning only.
 *
 * The rules that carry over from the app: nothing dark, no dimmed text, 44
 * pixels minimum for anything tappable, and a number is always a tabular figure
 * so columns line up.
 */

export type Tone = 'orange' | 'green' | 'purple' | 'yellow' | 'plain';

export const TONE: Record<Tone, { tint: string; deep: string; fill: string; onFill: string; bar: string }> = {
  orange: { tint: 'bg-tint-orange', deep: 'text-gold-deep', fill: 'bg-gold', onFill: 'text-ink', bar: 'bg-gold' },
  green: { tint: 'bg-tint-green', deep: 'text-green-deep', fill: 'bg-green', onFill: 'text-ink', bar: 'bg-green' },
  purple: { tint: 'bg-tint-purple', deep: 'text-purple-deep', fill: 'bg-purple', onFill: 'text-paper', bar: 'bg-purple' },
  yellow: { tint: 'bg-tint-yellow', deep: 'text-yellow-deep', fill: 'bg-yellow', onFill: 'text-ink', bar: 'bg-yellow' },
  plain: { tint: 'bg-canvas-deep', deep: 'text-ink-mute', fill: 'bg-canvas-deep', onFill: 'text-ink', bar: 'bg-canvas-deep' },
};

/* -------------------------------------------------------------------------- */
/* Surfaces                                                                    */
/* -------------------------------------------------------------------------- */

export function Card({
  children,
  className = '',
  tone,
}: {
  children: ReactNode;
  className?: string;
  /** A soft tint, used to separate one card from the rest of the stack. */
  tone?: Tone;
}) {
  const ground = tone ? TONE[tone].tint : 'bg-paper';
  return (
    <section className={`rounded-2xl border border-white ${ground} shadow-[0_1px_3px_rgba(17,17,17,0.06),0_1px_2px_rgba(17,17,17,0.04)] ${className}`}>
      {children}
    </section>
  );
}

export function CardPad({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`px-4 py-4 sm:px-5 ${className}`}>{children}</div>;
}

export function CardHead({
  title,
  sub,
  action,
  icon: Icon,
  tone = 'orange',
}: {
  title: ReactNode;
  sub?: ReactNode;
  action?: ReactNode;
  icon?: LucideIcon;
  tone?: Tone;
}) {
  return (
    <div className="flex items-start justify-between gap-3 px-4 pb-3 pt-4 sm:px-5">
      <div className="flex min-w-0 items-center gap-2.5">
        {Icon ? (
          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${TONE[tone].tint}`}>
            <Icon size={16} className={TONE[tone].deep} aria-hidden="true" />
          </span>
        ) : null}
        <div className="min-w-0">
          <h2 className="truncate text-[0.9375rem] font-semibold text-ink">{title}</h2>
          {sub ? <p className="mt-0.5 truncate text-[0.75rem] text-ink-mute">{sub}</p> : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/**
 * The band at the top of a working screen.
 *
 * A console is read for hours, so the top of each screen has to say what this
 * page is and what state it is in without being read word by word. A soft
 * gradient in the department's colour, the title set large, the live state
 * beside it, and the actions on the right where the eye finishes.
 */
export function Hero({
  eyebrow,
  title,
  sub,
  tone = 'orange',
  actions,
  children,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  sub?: ReactNode;
  tone?: Tone;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  const wash: Record<Tone, string> = {
    orange: 'from-[#fff7ed] via-[#fffaf3] to-white',
    green: 'from-[#ecfdf5] via-[#f6fefb] to-white',
    purple: 'from-[#f5f3ff] via-[#faf8ff] to-white',
    yellow: 'from-[#fefce8] via-[#fffdf2] to-white',
    plain: 'from-[#f3f5f8] via-[#f8fafc] to-white',
  };
  const dot: Record<Tone, string> = {
    orange: 'bg-gold', green: 'bg-green', purple: 'bg-purple', yellow: 'bg-yellow', plain: 'bg-canvas-deep',
  };

  return (
    <section className={`relative overflow-hidden rounded-3xl border border-white bg-gradient-to-br ${wash[tone]} px-5 py-5 shadow-[0_1px_3px_rgba(17,17,17,0.05)] sm:px-7 sm:py-6`}>
      {/* Two soft shapes give the band depth without tinting the words. */}
      <span aria-hidden="true" className={`pointer-events-none absolute -right-10 -top-16 h-44 w-44 rounded-full ${dot[tone]} opacity-[0.10]`} />
      <span aria-hidden="true" className={`pointer-events-none absolute -bottom-20 right-24 h-32 w-32 rounded-full ${dot[tone]} opacity-[0.07]`} />

      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="mb-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-ink-mute">{eyebrow}</p>
          ) : null}
          <h1 className="text-[1.5rem] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[1.9rem]">{title}</h1>
          {sub ? <p className="mt-1.5 max-w-2xl text-[0.875rem] leading-relaxed text-ink-mute">{sub}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>

      {children ? <div className="relative mt-5">{children}</div> : null}
    </section>
  );
}

/**
 * The band at the top of a screen that has not been given a bespoke hero.
 *
 * It exists so the console does not alternate between a designed screen and a
 * heading with a rule under it. Every screen opens the same way, with the same
 * weight of type and the same soft ground, and the differences between screens
 * live in what they contain rather than in how they are framed.
 */
export function PageHead({
  title,
  sub,
  actions,
  eyebrow,
  tone = 'orange',
}: {
  title: string;
  sub?: ReactNode;
  actions?: ReactNode;
  eyebrow?: ReactNode;
  tone?: Tone;
}) {
  return (
    <div className="mb-5">
      <Hero eyebrow={eyebrow} title={title} sub={sub} actions={actions} tone={tone} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Small parts                                                                 */
/* -------------------------------------------------------------------------- */

export function Badge({
  children,
  tone = 'plain',
  icon: Icon,
}: {
  children: ReactNode;
  tone?: Tone;
  icon?: LucideIcon;
}) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold ${TONE[tone].tint} ${TONE[tone].deep}`}>
      {Icon ? <Icon size={11} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

/** The one badge the whole product is built around: this reached the app. */
export function LiveBadge({ label = 'Live to the app' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-tint-green px-2.5 py-1 text-[0.6875rem] font-semibold text-green-deep">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full motion-safe:animate-ping rounded-full bg-green" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green" />
      </span>
      {label}
    </span>
  );
}

export function Kpi({
  label,
  value,
  suffix,
  note,
  icon: Icon,
  tone = 'orange',
  delta,
  to,
  spark,
  className = '',
}: {
  label: string;
  value: ReactNode;
  suffix?: string;
  note?: ReactNode;
  icon: LucideIcon;
  tone?: Tone;
  delta?: { value: string; up: boolean };
  to?: string;
  /** A short series, drawn under the figure as a trend. */
  spark?: number[];
  className?: string;
}) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-2">
        <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${TONE[tone].tint}`}>
          <Icon size={16} className={TONE[tone].deep} aria-hidden="true" />
        </span>
        {delta ? (
          <span className={`rounded-full px-2 py-0.5 text-[0.6875rem] font-semibold ${delta.up ? 'bg-tint-green text-green-deep' : 'bg-tint-orange text-gold-deep'}`}>
            {delta.up ? '+' : ''}
            {delta.value}
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-ink-mute">{label}</p>
      <p className="mt-1 text-[1.75rem] font-semibold leading-none tabular-nums text-ink">
        {value}
        {suffix ? <span className="ml-0.5 text-[1rem] text-ink-mute">{suffix}</span> : null}
      </p>
      {note ? <p className="mt-2 text-[0.75rem] leading-snug text-ink-mute">{note}</p> : null}
      {spark && spark.length > 1 ? (
        <div className="mt-2.5 h-8">
          <Sparkline values={spark} tone={(tone === 'plain' ? 'orange' : tone) as ChartTone} label={`${label} trend`} height={32} />
        </div>
      ) : null}
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className={`block rounded-2xl bg-paper px-4 py-3.5 shadow-[0_1px_3px_rgba(17,17,17,0.06),0_1px_2px_rgba(17,17,17,0.04)] transition-transform active:scale-[0.99] ${className}`}
      >
        {body}
      </Link>
    );
  }
  return (
    <div className={`rounded-2xl bg-paper px-4 py-3.5 shadow-[0_1px_3px_rgba(17,17,17,0.06),0_1px_2px_rgba(17,17,17,0.04)] ${className}`}>
      {body}
    </div>
  );
}

export function Meter({ value, max = 100, tone = 'orange' }: { value: number; max?: number; tone?: Tone }) {
  const percent = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-canvas-deep" role="presentation">
      <div className={`h-full rounded-full ${TONE[tone].bar}`} style={{ width: `${percent}%` }} />
    </div>
  );
}

export function Avatar({ name, size = 'md', tone }: { name: string; size?: 'sm' | 'md' | 'lg'; tone?: Tone }) {
  const initials = name
    .replace(/^(Mr\.|Mrs\.|Madam|Dr\.)\s*/i, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('');
  const box = size === 'sm' ? 'h-8 w-8 text-[0.6875rem]' : size === 'lg' ? 'h-14 w-14 text-[1.0625rem]' : 'h-10 w-10 text-[0.8125rem]';
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${box} ${
        tone ? `${TONE[tone].tint} ${TONE[tone].deep}` : 'bg-canvas-deep text-ink'
      }`}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Controls                                                                    */
/* -------------------------------------------------------------------------- */

export function Button({
  children,
  onClick,
  tone = 'orange',
  type = 'button',
  icon: Icon,
  to,
  disabled,
  full,
}: {
  children: ReactNode;
  onClick?: () => void;
  tone?: Tone;
  type?: 'button' | 'submit';
  icon?: LucideIcon;
  to?: string;
  disabled?: boolean;
  full?: boolean;
}) {
  const look =
    tone === 'plain'
      ? 'bg-canvas text-ink'
      : tone === 'purple'
        ? 'bg-purple text-paper'
        : tone === 'green'
          ? 'bg-green text-ink'
          : tone === 'yellow'
            ? 'bg-yellow text-ink'
            : 'bg-gold text-ink';
  const shared = `inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded-full px-4 text-[0.8125rem] font-semibold transition-transform active:scale-[0.98] ${
    disabled ? 'bg-canvas text-ink-mute' : look
  } ${full ? 'w-full' : ''}`;

  if (to) {
    return (
      <Link to={to} className={shared}>
        {Icon ? <Icon size={15} aria-hidden="true" /> : null}
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={shared}>
      {Icon ? <Icon size={15} aria-hidden="true" /> : null}
      {children}
    </button>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly T[];
  value: T;
  onChange: (next: T) => void;
  label: string;
}) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1" role="group" aria-label={label}>
      {options.map(option => {
        const on = option === value;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={on}
            className={`inline-flex min-h-[2.5rem] shrink-0 items-center rounded-full px-3.5 text-[0.8125rem] font-medium transition-colors ${
              on ? 'bg-gold text-ink' : 'bg-paper text-ink-mute shadow-[0_1px_2px_rgba(17,17,17,0.05)]'
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export function SearchField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder: string;
}) {
  return (
    <label className="flex min-h-[2.75rem] w-full items-center gap-2 rounded-full bg-paper px-4 shadow-[0_1px_2px_rgba(17,17,17,0.05)] sm:max-w-xs">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-ink-mute" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <span className="sr-only">{placeholder}</span>
      <input
        type="search"
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-[0.875rem] text-ink placeholder:text-ink-mute focus:outline-none"
      />
    </label>
  );
}

/* -------------------------------------------------------------------------- */
/* Tables                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * A table that behaves like a table on a desk and like a list on a phone.
 * The header row is hidden below the tablet breakpoint, and each cell carries
 * its own label there, so nothing is read as an unlabelled number.
 */
export function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead className="sticky top-0 z-10 hidden bg-paper/95 backdrop-blur-sm md:table-header-group">
          <tr>
            {head.map(column => (
              <th
                key={column}
                scope="col"
                className="border-b border-rule px-4 py-2.5 text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-ink-mute first:pl-5 last:pr-5"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Tr({ children }: { children: ReactNode }) {
  return <tr className="border-b border-rule transition-colors last:border-0 hover:bg-canvas/70">{children}</tr>;
}

export function Td({
  children,
  label,
  align = 'left',
  strong,
}: {
  children: ReactNode;
  /** Shown in place of the column header on a phone. */
  label?: string;
  align?: 'left' | 'right';
  strong?: boolean;
}) {
  return (
    <td className={`px-4 py-3 align-middle first:pl-5 last:pr-5 ${align === 'right' ? 'text-right' : ''}`}>
      {label ? (
        <span className="mr-2 inline text-[0.6875rem] uppercase tracking-[0.06em] text-ink-mute md:hidden">{label}</span>
      ) : null}
      <span className={`text-[0.8125rem] ${strong ? 'font-semibold text-ink' : 'text-ink'}`}>{children}</span>
    </td>
  );
}

/* -------------------------------------------------------------------------- */
/* Rows and lists                                                              */
/* -------------------------------------------------------------------------- */

export function Row({
  icon: Icon,
  tone = 'orange',
  title,
  sub,
  trailing,
  onClick,
  to,
}: {
  icon?: LucideIcon;
  tone?: Tone;
  title: ReactNode;
  sub?: ReactNode;
  trailing?: ReactNode;
  onClick?: () => void;
  to?: string;
}) {
  const inner = (
    <>
      {Icon ? (
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${TONE[tone].tint}`}>
          <Icon size={16} className={TONE[tone].deep} aria-hidden="true" />
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[0.875rem] font-medium text-ink">{title}</span>
        {sub ? <span className="mt-0.5 block truncate text-[0.75rem] text-ink-mute">{sub}</span> : null}
      </span>
      {trailing ? <span className="shrink-0">{trailing}</span> : null}
      {onClick || to ? <ChevronRight size={16} className="shrink-0 text-ink-mute" aria-hidden="true" /> : null}
    </>
  );
  const className = 'flex min-h-[3.25rem] w-full items-center gap-3 px-4 py-2.5 text-left active:bg-canvas sm:px-5';
  if (to) {
    return (
      <Link to={to} className={className}>
        {inner}
      </Link>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {inner}
      </button>
    );
  }
  return <div className={className}>{inner}</div>;
}

/* -------------------------------------------------------------------------- */
/* Drawer                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * A drawer that comes in from the right on a desk and rises from the bottom on
 * a phone, which is where the thumb already is.
 */
export function Drawer({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  wide?: boolean;
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
    <div className="fixed inset-0 z-[80] flex items-end justify-center md:items-stretch md:justify-end" role="dialog" aria-modal="true" data-lenis-prevent>
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-ink/40" />
      <div
        className={`relative z-10 flex h-[100dvh] max-h-[88dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-paper md:h-full md:max-h-none md:rounded-none ${
          wide ? 'md:w-[38rem]' : 'md:w-[30rem]'
        }`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-rule px-5 py-4">
          <div className="min-w-0 text-[1rem] font-semibold text-ink">{title}</div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-mute active:bg-canvas"
          >
            <X size={18} />
          </button>
        </div>
        <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">{children}</div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* The record reached the app                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Every write in the console ends with this, because the promise of the whole
 * product is that the office is not typing into a private system. The line of
 * copy is the argument: this many families can see it, now.
 */
export function SavedNote({
  families,
  what,
  onReset,
  extra,
}: {
  families: number;
  what: string;
  onReset: () => void;
  /** A way onward, such as opening the app to see the change. */
  extra?: ReactNode;
}) {
  const timer = useRef<number | null>(null);
  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  return (
    <div className="flex items-start gap-3 rounded-2xl bg-tint-green px-4 py-3.5">
      <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-green-deep" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-[0.875rem] font-semibold text-green-deep">Saved, and live</p>
        <p className="mt-0.5 text-[0.8125rem] leading-relaxed text-ink">
          {what} {families === 1 ? 'One family can' : `${families} families can`} see it in the parent app now.
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              onReset();
              if (timer.current) window.clearTimeout(timer.current);
            }}
            className="inline-flex min-h-[2.25rem] items-center rounded-full bg-paper px-3 text-[0.75rem] font-semibold text-ink"
          >
            Done
          </button>
          {extra}
        </div>
      </div>
    </div>
  );
}

export function EmptyNote({ children }: { children: ReactNode }) {
  return <p className="px-4 py-6 text-center text-[0.8125rem] text-ink-mute sm:px-5">{children}</p>;
}

/** A quiet section label, used between groups of cards. */
export function SectionLabel({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="mb-2.5 mt-6 flex items-center justify-between gap-3 first:mt-0">
      <h2 className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-ink-mute">{children}</h2>
      {right}
    </div>
  );
}
