import { cn } from '../../lib/cn';

/**
 * SectionEdge: the hairline between two sections.
 *
 * This started life as an angled band up to 80px tall carrying the colour of
 * the section above. Eight of those added roughly 560px of flat colour to the
 * page, which read as large empty gaps rather than as design. It is now the
 * width of a rule, so the boundary between two sections is deliberate but the
 * page gains no height. Sections are still told apart by their background and
 * by depth, never by a card.
 */
export function SectionEdge({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('relative h-[2px] w-full overflow-hidden bg-gold/25', className)}
    >
      <span className="absolute inset-y-0 left-0 w-24 bg-gold" />
    </div>
  );
}

export default SectionEdge;
