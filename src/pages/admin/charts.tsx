import { useId } from 'react';

/**
 * The console's charts.
 *
 * Hand drawn as SVG rather than pulled from a charting library, for two
 * reasons: the bundle is already large, and every chart here has to obey the
 * same rules as the rest of the product. No dark surfaces, no dimmed labels,
 * colour that carries meaning, and figures that are tabular so a column of them
 * lines up.
 *
 * All of them are decorative in the accessible sense: each chart is labelled
 * with its own summary, and the numbers beside it are real text, so a screen
 * reader gets the figure rather than a picture of one.
 */

export type ChartTone = 'orange' | 'green' | 'purple' | 'yellow';

const STROKE: Record<ChartTone, string> = {
  orange: 'stroke-[#f97316]',
  green: 'stroke-[#16a34a]',
  purple: 'stroke-[#7c3aed]',
  yellow: 'stroke-[#facc15]',
};

const FILL: Record<ChartTone, string> = {
  orange: '#f97316',
  green: '#16a34a',
  purple: '#7c3aed',
  yellow: '#facc15',
};

/** A small area chart, for a figure that moves over the term. */
export function Sparkline({
  values,
  tone = 'orange',
  height = 40,
  label,
}: {
  values: number[];
  tone?: ChartTone;
  height?: number;
  label: string;
}) {
  const id = useId().replace(/:/g, '');
  const width = 120;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const span = max - min || 1;
  const step = values.length > 1 ? width / (values.length - 1) : width;

  const points = values.map((value, index) => {
    const x = index * step;
    const y = height - 4 - ((value - min) / span) * (height - 10);
    return { x, y };
  });

  // A gentle curve between points reads as a trend rather than a heartbeat.
  const line = points
    .map((point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`;
      const previous = points[index - 1];
      const midX = (previous.x + point.x) / 2;
      return `C ${midX} ${previous.y}, ${midX} ${point.y}, ${point.x} ${point.y}`;
    })
    .join(' ');

  const area = `${line} L ${width} ${height} L 0 ${height} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-full w-full"
      preserveAspectRatio="none"
      role="img"
      aria-label={label}
    >
      <defs>
        <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={FILL[tone]} stopOpacity="0.28" />
          <stop offset="100%" stopColor={FILL[tone]} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#spark-${id})`} />
      <path d={line} fill="none" strokeWidth="2" strokeLinecap="round" className={STROKE[tone]} />
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="2.6" fill={FILL[tone]} />
    </svg>
  );
}

/** A ring, for a single share of a whole. */
export function Ring({
  value,
  max = 100,
  tone = 'green',
  size = 84,
  caption,
  captionNote,
}: {
  value: number;
  max?: number;
  tone?: ChartTone;
  size?: number;
  caption?: string;
  captionNote?: string;
}) {
  const radius = size / 2 - 6;
  const circumference = 2 * Math.PI * radius;
  const share = Math.max(0, Math.min(1, value / max));
  const dash = circumference * share;

  return (
    <div className="flex items-center gap-3">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${caption ?? 'Share'}: ${value}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth="7"
          className="stroke-[#e9edf2]"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth="7"
          strokeLinecap="round"
          stroke={FILL[tone]}
          strokeDasharray={`${dash} ${circumference - dash}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          className="fill-ink text-[0.9rem] font-semibold"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {Math.round(share * 100)}%
        </text>
      </svg>
      {caption ? (
        <div className="min-w-0">
          <p className="text-[0.8125rem] font-medium leading-snug text-ink">{caption}</p>
          {captionNote ? <p className="mt-0.5 text-[0.75rem] text-ink-mute">{captionNote}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

/** Vertical bars, for comparing a handful of classes or categories. */
export function Bars({
  data,
  tone = 'green',
  height = 110,
  suffix = '',
}: {
  data: { label: string; value: number; max?: number }[];
  tone?: ChartTone;
  height?: number;
  suffix?: string;
}) {
  const top = Math.max(...data.map(item => item.max ?? item.value), 1);

  return (
    <div className="flex items-end gap-3" style={{ height }}>
      {data.map(item => {
        const percent = Math.round((item.value / (item.max ?? top)) * 100);
        return (
          <div key={item.label} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1.5">
            <span className="text-[0.6875rem] font-semibold tabular-nums text-ink">
              {item.value}
              {suffix}
            </span>
            <div
              className="w-full max-w-[2.75rem] rounded-t-xl bg-canvas-deep"
              style={{ height: height - 34 }}
            >
              <div
                className="mt-auto w-full rounded-t-xl"
                style={{ height: `${Math.max(6, percent)}%`, background: FILL[tone], marginTop: 'auto' }}
              />
            </div>
            <span className="w-full truncate text-center text-[0.625rem] text-ink-mute">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/** A horizontal comparison bar, used where labels are long. */
export function BarRow({
  label,
  value,
  max,
  tone = 'orange',
  trailing,
}: {
  label: string;
  value: number;
  max: number;
  tone?: ChartTone;
  trailing?: string;
}) {
  const percent = Math.round((value / (max || 1)) * 100);
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="min-w-0 truncate text-[0.8125rem] text-ink">{label}</span>
        <span className="shrink-0 text-[0.75rem] font-medium tabular-nums text-ink-mute">
          {trailing ?? `${percent}%`}
        </span>
      </div>
      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-canvas-deep">
        <div className="h-full rounded-full" style={{ width: `${percent}%`, background: FILL[tone] }} />
      </div>
    </div>
  );
}

/**
 * A twelve week strip of attendance, one tile per week. Read at a glance for
 * "is this class steady or is something slipping", which a percentage cannot
 * tell you on its own.
 */
export function WeekStrip({ values, tone = 'green' }: { values: number[]; tone?: ChartTone }) {
  return (
    <div className="flex items-end gap-1">
      {values.map((value, index) => {
        const height = 10 + Math.round((value / 100) * 26);
        return (
          <span
            key={index}
            title={`Week ${index + 1}: ${value}%`}
            className="w-full max-w-[0.85rem] rounded-t-[3px]"
            style={{ height, background: FILL[tone], opacity: 0.45 + (value / 100) * 0.55 }}
          />
        );
      })}
    </div>
  );
}

/** A donut split across categories, with the legend beside it. */
export function Donut({
  parts,
  size = 116,
}: {
  parts: { label: string; value: number; tone: ChartTone }[];
  size?: number;
}) {
  const total = parts.reduce((sum, part) => sum + part.value, 0) || 1;
  const radius = size / 2 - 8;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Share by category">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth="10" className="stroke-[#e9edf2]" />
        {parts.map(part => {
          const dash = (part.value / total) * circumference;
          const circle = (
            <circle
              key={part.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              strokeWidth="10"
              stroke={FILL[part.tone]}
              strokeDasharray={`${Math.max(0, dash - 2)} ${circumference}`}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          );
          offset += dash;
          return circle;
        })}
      </svg>
      <ul className="min-w-0 flex-1 space-y-1.5">
        {parts.map(part => (
          <li key={part.label} className="flex items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: FILL[part.tone] }} aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate text-[0.75rem] text-ink">{part.label}</span>
            <span className="shrink-0 text-[0.75rem] font-medium tabular-nums text-ink-mute">
              {Math.round((part.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
