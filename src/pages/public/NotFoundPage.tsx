import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * NotFoundPage: shown for any URL that does not match a route.
 *
 * This replaces a catch-all that rendered the homepage. That was worse than a
 * 404: a link pointing at a page that does not exist gave no sign it was broken,
 * it simply appeared to have taken you to the school's front page. A visible
 * "page not found" is a smaller annoyance and an honest one.
 */
export default function NotFoundPage() {
  const destinations = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/academics', label: 'Academics' },
    { to: '/admissions', label: 'Admissions' },
    { to: '/campus-life', label: 'Campus Life' },
    { to: '/news', label: 'News' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <section className="bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <span className="eyebrow">Error 404</span>
        <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
          We could not find that page
        </h1>
        <p className="mt-6 leading-relaxed text-ink-mute">
          The link may be out of date, or the address may have a typo in it. Everything on the
          site is listed below.
        </p>

        <ul className="mt-10">
          {destinations.map(item => (
            <li key={item.to}>
              <Link
                to={item.to}
                className="group flex items-center justify-between py-4 font-display text-lg text-ink transition-colors hover:text-gold-deep"
              >
                {item.label}
                <ArrowRight
                  size={16}
                  className="text-gold-deep transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
