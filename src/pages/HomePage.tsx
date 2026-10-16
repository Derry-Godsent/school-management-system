import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { MessagesSection } from '../components/sections/MessagesSection';
import { Hero3D } from '../components/sections/Hero3D';
import { Ecosystem } from '../components/sections/Ecosystem';
import { Reveal3D, DepthImage, SectionEdge } from '../components/fx';
import {
  Highlighter,
  InteractiveHoverButton,
  AnimatedGauge,
  PixelImage,
  DiaTextReveal,
} from '../components/magic';
import { useCountUp } from '../lib/useCountUp';
import {
  school,
  news,
  schoolStats,
  termDates,
  upcomingEvents,
  leadershipMessages,
} from '../data';

const SLIDES = [
  {
    image: '/images/hero-campus.jpg',
    eyebrow: 'Established 2008',
    title: 'Maple Grove International School',
    text: 'Nurturing Excellence. Building Character. Transforming Futures.',
    to: '/about',
    cta: 'Our Story',
  },
  {
    image: '/images/classroom.jpg',
    eyebrow: 'Our Vision',
    title: "Kumasi's institution for holistic education",
    text: 'Blending Ghanaian values with global standards, from Pre-School through Junior High School.',
    to: '/academics',
    cta: 'Our Academics',
  },
  {
    image: '/images/campus-life.jpg',
    eyebrow: 'Campus Life',
    title: 'Where character is built',
    text: 'Cultural festivals, house sports, the cadet corps and clubs. Learning that reaches past the classroom.',
    to: '/campus-life',
    cta: 'Explore Campus',
  },
];

function StatValue({ value, suffix }: { value: number; suffix?: string }) {
  const { ref, display } = useCountUp(value);
  return (
    <span ref={ref} className="font-display text-4xl sm:text-5xl font-bold text-paper">
      {display}
      {suffix}
    </span>
  );
}

function StatsBand() {
  return (
    <section className="bg-ink border-t-4 border-gold">
      <Reveal3D y={30} rotate={8}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-2 lg:grid-cols-4 divide-y divide-paper/10 lg:divide-y-0">
          {schoolStats.map((stat, i) => (
            <div
              key={stat.label}
              className={`py-10 lg:py-14 lg:px-8 ${
                i > 0 ? 'lg:border-l lg:border-paper/10' : ''
              } ${i % 2 === 1 ? 'border-l border-paper/10 pl-6 lg:pl-8' : 'pr-6 lg:pr-8'}`}
            >
              <dd>
                <StatValue value={stat.value} suffix={stat.suffix} />
              </dd>
              <dt className="mt-3 text-[0.6875rem] tracking-[0.2em] uppercase text-gold">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
      </Reveal3D>
    </section>
  );
}

function WelcomeBand() {
  const navigate = useNavigate();
  const director = leadershipMessages[0];

  return (
    <section className="bg-paper py-20 sm:py-28">
      <SectionEdge />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <figure className="lg:col-span-5 relative">
            <Reveal3D axis="y" rotate={10}>
              <DepthImage
                src={director.image}
                alt={`${director.name}, ${director.role}`}
                aspect="4/5"
                rotate={5}
              />
            </Reveal3D>
            <div className="absolute -bottom-6 -right-0 lg:-right-10 bg-gold text-ink px-6 py-5 max-w-[16rem]">
              <p className="font-display text-sm leading-snug">{director.name}</p>
              <p className="text-[0.625rem] tracking-[0.16em] uppercase mt-1">{director.role}</p>
            </div>
          </figure>

          <div className="lg:col-span-7">
            <Reveal3D y={40} delay={0.1}>
            <span className="eyebrow">Welcome</span>
            <h2 className="mt-6 font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink leading-tight">
              Welcome to <Highlighter color="#e85d04">{school.name}</Highlighter>
            </h2>
            <div className="mt-8 space-y-5 text-ink-mute leading-relaxed">
              <p className="dropcap text-ink/85">
                On behalf of our school community, I welcome you. For seventeen years we have
                been educating the children of Kumasi. Not merely to pass examinations, but to
                think clearly, act honourably, and carry themselves with confidence into a world
                that will ask a great deal of them.
              </p>
              <p>
                We are a deliberately mid-sized school. That is a choice, not an accident: it
                means every pupil is known, every teacher is accountable, and no child is
                permitted to become invisible.
              </p>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <InteractiveHoverButton tone="gold" onClick={() => navigate('/about')}>
                Read Our Story
              </InteractiveHoverButton>
              <Link
                to="/admissions"
                className="line-draw inline-flex items-center gap-3 px-7 py-4 border border-ink/20 text-ink font-semibold text-xs tracking-[0.16em] uppercase hover:border-gold hover:text-gold-deep transition-colors"
              >
                Admissions
              </Link>
            </div>
            </Reveal3D>
          </div>
        </div>
      </div>
    </section>
  );
}

function NewsBand() {
  const [lead, ...rest] = [...news].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const recent = rest.slice(0, 3);

  return (
    <section className="bg-cream py-20 sm:py-28">
      <SectionEdge />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal3D y={36}>
        <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
          <div>
            <span className="eyebrow">Latest</span>
            <h2 className="mt-6 font-display text-3xl sm:text-4xl font-bold text-ink">
              News &amp; Updates
            </h2>
          </div>
          <Link
            to="/news"
            className="line-draw text-sm font-medium text-ink-mute hover:text-ink inline-flex items-center gap-2"
          >
            All news
            <ArrowRight size={14} />
          </Link>
        </div>
        </Reveal3D>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Lead story */}
          <article className="lg:col-span-7">
            <Link to="/news" className="group block">
              <div className="aspect-[16/10] overflow-hidden bg-ink/5">
                <img
                  src="/images/classroom.jpg"
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                />
              </div>
              <div className="mt-7">
                <div className="flex items-center gap-4">
                  <span className="text-[0.6875rem] font-semibold tracking-[0.18em] uppercase text-gold-deep">
                    {lead.category}
                  </span>
                  <span className="text-xs text-ink-mute/70">
                    {new Date(lead.date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-2xl sm:text-3xl font-bold text-ink leading-snug group-hover:text-gold-deep transition-colors">
                  {lead.title}
                </h3>
                <p className="mt-4 text-ink-mute leading-relaxed">{lead.excerpt}</p>
              </div>
            </Link>
          </article>

          {/* Secondary list, hairlines, not cards */}
          <div className="lg:col-span-5">
            <div className="divide-y divide-rule border-t border-rule">
              {recent.map(item => (
                <Link key={item.id} to="/news" className="group block py-7">
                  <div className="flex items-center gap-4">
                    <span className="text-[0.6875rem] font-semibold tracking-[0.18em] uppercase text-gold-deep">
                      {item.category}
                    </span>
                    <span className="text-xs text-ink-mute/70">
                      {new Date(item.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>
                  <h4 className="mt-3 font-display text-lg font-semibold text-ink leading-snug group-hover:text-gold-deep transition-colors">
                    {item.title}
                  </h4>
                  <p className="mt-2 text-sm text-ink-mute leading-relaxed">{item.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CampusStrip() {
  const navigate = useNavigate();
  const images = [
    { src: '/images/campus-life.jpg', alt: 'Cultural day celebrations and drumming' },
    { src: '/images/classroom.jpg', alt: 'A lesson in progress' },
    { src: '/images/hero-campus.jpg', alt: 'The school campus at golden hour' },
  ];

  return (
    <section className="bg-paper py-20 sm:py-28">
      <SectionEdge />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal3D y={36}>
        <div className="max-w-2xl mb-14">
          <span className="eyebrow">Campus Life</span>
          <h2 className="mt-6 font-display text-3xl sm:text-4xl font-bold text-ink">
            A school day worth remembering
          </h2>
          <p className="mt-6 text-ink-mute leading-relaxed">
            Cultural festivals and drumming, house sports, science exhibitions, reading week and
            the cadet corps. Our co-curricular programme is not an afterthought. It is where
            much of a child&apos;s character is formed.
          </p>
        </div>
        </Reveal3D>

        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
          {images.map((image, i) => (
            <Reveal3D
              key={image.alt}
              delay={i * 0.12}
              rotate={i === 1 ? 22 : 14}
              axis={i === 1 ? 'x' : 'y'}
              y={i === 1 ? 70 : 40}
            >
              {/* Alternating tilt direction so the row reads as a receding wall
                  rather than three copies of the same plane. */}
              <DepthImage
                src={image.src}
                alt={image.alt}
                aspect="4/5"
                rotate={i === 1 ? 9 : 5}
              />
            </Reveal3D>
          ))}
        </div>

        <div className="mt-12">
          <InteractiveHoverButton tone="ink" onClick={() => navigate('/campus-life')}>
            Explore Campus Life
          </InteractiveHoverButton>
        </div>
      </div>
    </section>
  );
}

function UpdatesBand() {
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <section className="bg-cream py-20 sm:py-28">
      <SectionEdge />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal3D y={36}>
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20">
          {/* Updates */}
          <div>
            <span className="eyebrow">Updates</span>
            <h2 className="mt-6 font-display text-3xl font-bold text-ink mb-10">
              What&apos;s coming up
            </h2>
            <ul className="divide-y divide-rule border-t border-rule">
              {upcomingEvents.map(event => (
                <li key={event.id} className="flex items-center gap-6 py-5">
                  <Calendar size={16} className="text-gold shrink-0" aria-hidden="true" />
                  <span className="flex-1 text-ink">{event.title}</span>
                  <span className="text-sm text-ink-mute">{formatDate(event.date)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Term dates */}
          <div>
            <span className="eyebrow">Academic Calendar</span>
            <h2 className="mt-6 font-display text-3xl font-bold text-ink mb-10">
              Term dates 2026/2027
            </h2>
            <div className="space-y-6">
              {termDates.map(term => (
                <div key={term.term} className="border-l-2 border-gold pl-6">
                  <h3 className="font-display text-lg font-semibold text-ink">{term.term}</h3>
                  <dl className="mt-3 space-y-1 text-sm text-ink-mute">
                    <div className="flex gap-2">
                      <dt className="w-16 shrink-0">Opens</dt>
                      <dd className="text-ink">{term.opens}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="w-16 shrink-0">Closes</dt>
                      <dd className="text-ink">{term.closes}</dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
          </div>
        </div>
        </Reveal3D>
      </div>
    </section>
  );
}

function VisitBand() {
  const navigate = useNavigate();
  return (
    <section className="bg-ink text-paper/80">
      <SectionEdge />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Clock size={20} className="text-gold mb-4" aria-hidden="true" />
            <h3 className="font-body text-xs tracking-[0.2em] uppercase text-paper mb-3">
              School Hours
            </h3>
            <p className="text-sm leading-relaxed">
              Monday to Friday
              <br />
              6:30am to 3:30pm
            </p>
          </div>
          <div>
            <Phone size={20} className="text-gold mb-4" aria-hidden="true" />
            <h3 className="font-body text-xs tracking-[0.2em] uppercase text-paper mb-3">
              Telephone
            </h3>
            <p className="text-sm leading-relaxed">
              <a href={`tel:${school.phone.replace(/\s/g, '')}`} className="hover:text-gold">
                {school.phone}
              </a>
              <br />
              <a href={`tel:${school.phoneAlt.replace(/\s/g, '')}`} className="hover:text-gold">
                {school.phoneAlt}
              </a>
            </p>
          </div>
          <div>
            <Mail size={20} className="text-gold mb-4" aria-hidden="true" />
            <h3 className="font-body text-xs tracking-[0.2em] uppercase text-paper mb-3">
              Email
            </h3>
            <p className="text-sm leading-relaxed">
              <a href={`mailto:${school.email}`} className="hover:text-gold">
                {school.email}
              </a>
            </p>
          </div>
          <div>
            <MapPin size={20} className="text-gold mb-4" aria-hidden="true" />
            <h3 className="font-body text-xs tracking-[0.2em] uppercase text-paper mb-3">
              Address
            </h3>
            <p className="text-sm leading-relaxed">{school.address}</p>
          </div>
        </div>

        <div className="mt-14 pt-10 border-t border-paper/15 flex flex-wrap items-center justify-between gap-6">
          <p className="font-display text-2xl sm:text-3xl text-paper">
            Come and see the school for yourself.
          </p>
          <InteractiveHoverButton tone="gold" onClick={() => navigate('/contact')}>
            Book a Visit
          </InteractiveHoverButton>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero3D />
      <StatsBand />
      <WelcomeBand />
      <MessagesSection />
      <NewsBand />
      <CampusStrip />
      <Ecosystem />
      <UpdatesBand />
      <VisitBand />
    </>
  );
}
