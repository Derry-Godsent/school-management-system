import { cn } from '../../lib/cn';

type Token = 'ink' | 'paper' | 'cream' | 'gold' | 'gold-pale' | 'ink-soft';

const HEX: Record<Token, string> = {
  ink: '#101010',
  'ink-soft': '#1c1c1c',
  paper: '#ffffff',
  cream: '#faf8f3',
  gold: '#c9a227',
  'gold-pale': '#f3ead2',
};

/**
 * SectionEdge: the angled join between two sections.
 *
 * Sections on this site are told apart by their background and their angle
 * rather than by cards. This draws the boundary as a single diagonal with a
 * gold hairline along it, echoing the ribbon in the crest. The strip keeps the
 * colour of the section above it and cuts the colour of the section below up
 * through it, so the two meet on a slope instead of a hard horizontal line.
 */
export function SectionEdge({
  from = 'paper',
  to = 'ink',
  direction = 'right',
  /** Gold hairline along the diagonal. */
  rule = true,
  className = '',
}: {
  from?: Token;
  to?: Token;
  direction?: 'right' | 'left';
  rule?: boolean;
  className?: string;
}) {
  // `right` rises from bottom-left to top-right, `left` falls the other way.
  const points = direction === 'right' ? '0,100 100,0 100,100' : '0,0 100,100 0,100';
  const line = direction === 'right' ? { x1: 0, y1: 100, x2: 100, y2: 0 } : { x1: 0, y1: 0, x2: 100, y2: 100 };

  return (
    <div
      aria-hidden="true"
      className={cn('relative h-14 w-full sm:h-20', className)}
      style={{ background: HEX[from] }}
    >
      <svg
        className="block h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        focusable="false"
      >
        <polygon points={points} fill={HEX[to]} />
        {rule ? (
          <line
            {...line}
            stroke="#c9a227"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            opacity="0.85"
          />
        ) : null}
      </svg>
    </div>
  );
}

export default SectionEdge;
