import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { useScrollLock } from '../../components/fx';
import { getGrade } from '../../data';

/**
 * The pieces the portal is built from.
 *
 * Everything here is sized for a phone first, because the portal is meant to be
 * an app in a parent's hand, and then allowed to breathe on a wider screen.
 *
 * There are no floating rounded cards with drop shadows anywhere in the portal.
 * The school's own design language, flat colour blocks and hairline rules, is
 * carried through, which also keeps a large page calm rather than making it a
 * stack of boxes.
 */

export type Tone = 'orange' | 'green' | 'purple' | 'yellow' | 'ink' | 'plain';

const TONE: Record<Tone, { block: string; text: string; fill: string; line: string }> = {
  orange: { block: 'bg-tint-orange', text: 'text-gold-deep', fill: 'bg-gold', line: 'border-gold-deep' },
  green: { block: 'bg-tint-green', text: 'text-green-deep', fill: 'bg-green', line: 'border-green-deep' },
  purple: { block: 'bg-tint-purple', text: 'text-purple-deep', fill: 'bg-purple', line: 'border-purple-deep' },
  yellow: { block: 'bg-tint-yellow', text: 'text-yellow-deep', fill: 'bg-yellow', line: 'border-yellow-deep' },
  ink: { block: 'bg-ink', text: 'text-paper', fill: 'bg-ink', line: 'border-ink' },
  plain: { block: 'bg-paper', text: 'text-ink', fill: 'bg-ink-mute', line: 'border-rule' },
};

export const toneOf = (tone: Tone) => TONE[tone];

/** Four hues cycled by position, so a list of people is never one flat colour. */
const AVATAR_TONES: Tone[] = ['orange', 'green', 'purple', 'yellow'];

function initials(name: string): string {
  const parts = name.replace(/^(Mr\.|Mrs\.|Madam|Master|Miss)\s+/i, '').split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function toneForName(name: string): Tone {
  let sum = 0;
  for (let index = 0; index < name.length; index += 1) sum += name.charCodeAt(index);
  return AVATAR_TONES[sum % AVATAR_TONES.length];
}

export function Avatar({
  name,
  size = 'md',
  tone,
  square = false,
}: {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  tone?: Tone;
  square?: boolean;
}) {
  const chosen = tone ?? toneForName(name);
  const palette = TONE[chosen];
  // Purple and ink fills need light text; the bright fills need dark text.
  const text = chosen === 'purple' || chosen === 'ink' ? 'text-paper' : 'text-ink';
  const box = {
    sm: 'h-8 w-8 text-[0.6875rem]',
    md: 'h-11 w-11 text-sm',
    lg: 'h-14 w-14 text-base',
    xl: 'h-20 w-20 text-xl',
  }[size];
  return (
    <span
      aria-hidden="true"
      className={`inline-flex ${box} shrink-0 items-center justify-center font-semibold ${palette.fill} ${text} ${
        square ? '' : ''
      }`}
    >
      {initials(name)}
    </span>
  );
}

export function Eyebrow({ children, tone = 'orange' }: { children: ReactNode; tone?: Tone }) {
  return <span className={`eyebrow eyebrow--${tone === 'plain' ? 'orange' : tone}`}>{children}</span>;
}

export function SectionHead({
  eyebrow,
  title,
  note,
  action,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  note?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h2 className="mt-2 font-display text-xl text-ink sm:text-2xl">{title}</h2>
        {note ? <p className="mt-1.5 max-w-2xl text-[0.875rem] leading-relaxed text-ink-mute">{note}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Stat({
  label,
  value,
  note,
  tone = 'plain',
}: {
  label: string;
  value: ReactNode;
  note?: ReactNode;
  tone?: Tone;
}) {
  const palette = TONE[tone];
  return (
    <div className={`${palette.block} px-4 py-3.5`}>
      <p className={`text-[0.625rem] font-semibold uppercase tracking-[0.16em] ${palette.text}`}>{label}</p>
      <p className="mt-1.5 font-display text-2xl leading-none text-ink sm:text-[1.75rem]">{value}</p>
      {note ? <p className="mt-1.5 text-[0.75rem] leading-snug text-ink-mute">{note}</p> : null}
    </div>
  );
}

export function Meter({ value, max = 100, tone = 'orange' }: { value: number; max?: number; tone?: Tone }) {
  const percent = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  return (
    <span className="block h-1.5 w-full bg-rule" role="presentation">
      <span className={`block h-full ${TONE[tone].fill}`} style={{ width: `${percent}%` }} />
    </span>
  );
}

export function Badge({ children, tone = 'plain' }: { children: ReactNode; tone?: Tone }) {
  const palette = TONE[tone];
  return (
    <span className={`inline-block px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.12em] ${palette.block} ${palette.text}`}>
      {children}
    </span>
  );
}

/** The remark that belongs to a score, read from the school's grading scale. */
export function gradeNote(score: number): string {
  const grade = getGrade(score);
  return `Grade ${grade.grade}, ${grade.remark}`;
}

export function scoreTone(score: number): Tone {
  if (score >= 80) return 'green';
  if (score >= 70) return 'orange';
  if (score >= 60) return 'yellow';
  return 'purple';
}

/** How a score moved against the same subject last term. */
export function Delta({ from, to }: { from: number; to: number }) {
  const change = to - from;
  if (change === 0) return <span className="text-[0.75rem] text-ink-mute">No change</span>;
  const up = change > 0;
  return (
    <span className={`text-[0.75rem] font-medium ${up ? 'text-green-deep' : 'text-gold-deep'}`}>
      {up ? 'Up' : 'Down'} {Math.abs(change)}
    </span>
  );
}

export function Callout({
  tone = 'orange',
  title,
  children,
}: {
  tone?: Tone;
  title: ReactNode;
  children?: ReactNode;
}) {
  const palette = TONE[tone];
  return (
    <div className={`${palette.block} border-l-4 ${palette.line} px-4 py-3.5`}>
      <p className={`text-[0.6875rem] font-semibold uppercase tracking-[0.16em] ${palette.text}`}>{title}</p>
      {children ? <div className="mt-2 text-[0.875rem] leading-relaxed text-ink">{children}</div> : null}
    </div>
  );
}

/** A label and a value on one line, the workhorse of every list in the portal. */
export function Field({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-rule py-2.5 last:border-b-0">
      <dt className="text-[0.8125rem] text-ink-mute">{label}</dt>
      <dd className="text-[0.875rem] font-medium text-ink">{children}</dd>
    </div>
  );
}

export function LinkButton({
  children,
  onClick,
  tone = 'orange',
}: {
  children: ReactNode;
  onClick: () => void;
  tone?: Tone;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-[0.8125rem] font-semibold uppercase tracking-[0.12em] ${TONE[tone].text} transition-colors hover:underline hover:underline-offset-4`}
    >
      {children}
    </button>
  );
}

/**
 * A panel that slides up from the bottom of a phone, and sits in the middle of a
 * wide screen. Used for a pupil's profile and for the account menu.
 */
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
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-ink/70"
      />
      {/* max-h keeps the panel scrollable on a short phone rather than running
          off the top of the screen. */}
      <div className="relative z-10 max-h-[86vh] w-full overflow-y-auto bg-paper px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 shadow-2xl sm:max-w-lg sm:px-7 sm:py-7">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0 font-display text-lg text-ink">{title}</div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 -mt-1 shrink-0 p-2 text-ink-mute transition-colors hover:bg-cream hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/** A row that behaves like a link, used for every tappable list in the portal. */
export function TapRow({
  children,
  onClick,
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 border-b border-rule px-1 py-3 text-left transition-colors last:border-b-0 hover:bg-cream ${className}`}
    >
      {children}
    </button>
  );
}

export function EmptyNote({ children }: { children: ReactNode }) {
  return <p className="bg-cream px-4 py-4 text-[0.875rem] leading-relaxed text-ink-mute">{children}</p>;
}
