import { leadershipMessages } from '../../data';
import { Reveal3D, Tilt3D, DepthImage, ScrollStage, SectionEdge } from '../fx';

/**
 * MessagesSection: portraits paired with a written message from each of the
 * school's heads, including the School Prefect.
 *
 * Layout follows the Ghanaian institutional convention: alternating
 * image-and-text rows separated by hairline rules, with the portrait bleeding
 * to the edge of the grid. No cards, no shadows, no rounded boxes.
 */
export function MessagesSection() {
  return (
    <ScrollStage className="bg-cream" tilt="up" depth={0.9}>
      <section className="bg-cream">
        <SectionEdge from="paper" to="cream" direction="right" rule={false} />
        <div className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl mb-16 sm:mb-24">
          <span className="eyebrow">Message from:</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-ink mt-6 leading-tight">
            The people who lead this school
          </h2>
          <p className="text-lg text-ink-mute mt-6 leading-relaxed">
            Ours is a school run by people who teach. Each term, our leadership team writes
            directly to parents and students. They write about the work, the standard, and what we
            are asking of one another.
          </p>
        </header>

        <div className="space-y-20 sm:space-y-28">
          {leadershipMessages.map((person, index) => {
            const imageFirst = index % 2 === 0;

            return (
              <Reveal3D key={person.id} y={56} rotate={10} delay={0.05}>
              <article
                className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start"
              >
                {/* Portrait */}
                <figure
                  className={[
                    'lg:col-span-5 relative',
                    imageFirst ? 'lg:order-1' : 'lg:order-2 lg:col-start-8',
                  ].join(' ')}
                >
                  <Tilt3D max={7} scale={1.01} scrollDrift={14}>
                    <DepthImage
                      src={person.image}
                      alt={`${person.name}, ${person.role}`}
                      aspect="4/5"
                      rotate={4}
                    />
                  </Tilt3D>

                  {/* Gold ribbon nameplate, echoing the crest ribbon. */}
                  <figcaption className="relative -mt-8 ml-6 mr-6 lg:mr-0">
                    <div className="bg-ink text-paper px-6 py-4 border-l-4 border-gold">
                      <p className="font-display text-lg leading-snug">{person.name}</p>
                      <p className="text-[0.6875rem] tracking-[0.18em] uppercase text-gold mt-1">
                        {person.role}
                      </p>
                    </div>
                  </figcaption>
                </figure>

                {/* Message */}
                <div
                  className={[
                    'lg:col-span-6',
                    imageFirst ? 'lg:order-2 lg:col-start-7' : 'lg:order-1 lg:col-start-1',
                  ].join(' ')}
                >
                  <blockquote className="border-t border-rule pt-8">
                    <p className="font-display text-2xl sm:text-3xl leading-snug text-ink italic">
                      &ldquo;{person.quote}&rdquo;
                    </p>
                  </blockquote>

                  <div className="mt-8 space-y-5 text-ink-mute leading-relaxed">
                    {person.body.map((paragraph, pIndex) => (
                      <p
                        key={pIndex}
                        className={pIndex === 0 ? 'dropcap text-ink/85' : undefined}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <p className="mt-8 pt-6 border-t border-rule font-display text-sm text-ink">
                    {person.name}
                    <span className="block text-xs tracking-[0.14em] uppercase text-gold-deep mt-1">
                      {person.role}
                    </span>
                  </p>
                </div>
              </article>
              </Reveal3D>
            );
          })}
        </div>
      </div>
        </div>
      </section>
    </ScrollStage>
  );
}

export default MessagesSection;
