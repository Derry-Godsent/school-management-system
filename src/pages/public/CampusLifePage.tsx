import { campusLifeEvents, campusLifeProgrammes } from '../../data';
import { Reveal3D, DepthImage } from '../../components/fx';

export default function CampusLifePage() {
  return (
    <div>
      {/* Page header */}
      <section className="pt-16 pb-14 bg-cream border-b border-rule">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="eyebrow">Campus Life</span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink mt-6">
              Life at Maple Grove
            </h1>
            <p className="text-lg text-ink-mute mt-6 leading-relaxed">
              Education does not stop at the classroom door. Throughout the year our students
              mark cultural days, compete in house sports, exhibit their science work, and serve
              in the cadet corps, and much of who they become is formed in those hours.
            </p>
          </div>
        </div>
      </section>

      {/* Event galleries */}
      <section className="py-20 bg-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {campusLifeEvents.map(event => (
            <article key={event.id}>
              <div className="flex flex-wrap items-end justify-between gap-4 pb-6 border-b border-rule">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                  {event.title}
                </h2>
                <span className="text-[0.6875rem] tracking-[0.18em] uppercase text-gold-deep">
                  {event.month}
                </span>
              </div>

              <p className="mt-6 max-w-3xl text-ink-mute leading-relaxed">{event.description}</p>

              <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {event.images.map((image, i) => (
                  <Reveal3D
                    key={`${event.id}-${i}`}
                    delay={i * 0.1}
                    y={44}
                    rotate={i === 1 ? 18 : 12}
                    axis={i === 1 ? 'x' : 'y'}
                  >
                    <figure className="group overflow-hidden bg-ink/5">
                      <DepthImage src={image.src} alt={image.alt} aspect="4/3" rotate={5} />
                      <figcaption className="sr-only">{image.alt}</figcaption>
                    </figure>
                  </Reveal3D>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Co-curricular */}
      <section className="bg-ink py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <span className="eyebrow">Clubs &amp; Co-Curricular</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-paper mt-6">
              Programmes our students take part in
            </h2>
          </div>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-12">
            {campusLifeProgrammes.map(item => (
              <li
                key={item}
                className="flex items-center gap-4 py-5 border-b border-paper/15 text-paper/85"
              >
                <span className="w-1.5 h-1.5 bg-gold shrink-0" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
