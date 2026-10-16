import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle, ArrowLeft, ArrowRight, BookOpen, CalendarDays, CreditCard,
  Eye, EyeOff, Mail, Lock, ShieldCheck,
} from 'lucide-react';
import { school } from '../../data';
import { InteractiveHoverButton, LightRays, TypingAnimation } from '../../components/magic';

/**
 * The parent portal sign in.
 *
 * This is the first thing a parent sees of the portal, so it carries the site's
 * own design language rather than being a bare form: the school photograph, the
 * scrim, the light falling from above, the display face for the heading, the
 * eyebrow rule, and the type chip that types through what the portal holds.
 *
 * It is built the other way round from a typical login. On a large screen the
 * photograph and the message take the left, with the form to the right. On a
 * phone the message is a short block at the top, because the form has to be
 * almost immediately reachable, and the three feature lines are held back until
 * there is room for them.
 *
 * Colour: no red anywhere. A failed sign in is a dark band with a bright mark,
 * which reads as needing attention without the alarm of an error colour on a
 * school page.
 */
export function LoginScreen({
  onSignIn,
}: {
  /** Returns true when the credentials belong to a parent account. */
  onSignIn: (email: string, password: string) => boolean;
}) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('parent@demo.com');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (onSignIn(email.trim(), password)) {
      navigate('/parent');
      return;
    }
    setError('That email address and password do not match a parent account. Use the demo account shown below.');
  };

  const field =
    'w-full border border-rule bg-paper py-3.5 pl-11 pr-4 text-sm text-ink placeholder:text-ink-mute ' +
    'transition-colors focus:border-gold-deep focus:outline-none focus:ring-2 focus:ring-gold/25';
  const label = 'mb-2 block text-[0.8125rem] font-medium text-ink';

  return (
    <div className="min-h-screen bg-cream lg:grid lg:grid-cols-[minmax(0,7fr)_minmax(0,6fr)]">
      {/* ------------------------------------------------------------------
          The school side. Photograph, darkened from the bottom left so the
          words sit on the darkest part of it, with the same light rays the
          homepage hero uses.
         ------------------------------------------------------------------ */}
      <section className="relative flex min-h-[20rem] items-end overflow-hidden bg-ink lg:min-h-screen">
        <img
          src="/images/campus-life.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 scrim" />
        <LightRays intensity={0.55} />

        <div className="relative z-10 w-full max-w-2xl px-6 py-9 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-gold">
              <span className="font-display text-base font-bold tracking-wide text-ink">MG</span>
            </span>
            <span className="leading-tight">
              <span className="block font-display text-lg text-paper sm:text-xl">{school.name}</span>
              <span className="mt-1 block text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-paper">
                {school.motto}
              </span>
            </span>
          </div>

          <span className="eyebrow eyebrow--on-dark mt-8 sm:mt-10">Parent Portal</span>

          {/* On a phone the panel is kept short on purpose, so the form below is
              close to the fold. The sentence explaining the portal is held back
              until there is room for it, and the form carries its own. */}
          <h1 className="mt-4 font-display text-[1.75rem] leading-[1.1] text-paper sm:mt-5 sm:text-5xl lg:text-[3.4rem]">
            Everything about your child, in one place.
          </h1>

          <p className="mt-5 hidden max-w-xl text-[0.9375rem] leading-relaxed text-paper sm:block sm:text-base">
            The school enters each record once. From then on you can open it yourself, on any
            phone, at any hour.
          </p>

          <span className="mt-6 inline-flex bg-gold px-4 py-2 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-ink sm:mt-8">
            <TypingAnimation words={['Marks', 'Attendance', 'Fees', 'Notices']} pauseDelay={2200} />
          </span>

          {/* Held back on a phone, where the form needs to come first. */}
          <dl className="mt-10 hidden max-w-xl lg:grid lg:gap-4">
            {[
              { icon: BookOpen, term: 'Marks', note: 'as the teachers enter them' },
              { icon: CalendarDays, term: 'Attendance', note: 'for every school day' },
              { icon: CreditCard, term: 'Fees', note: 'what is paid and what is still owed' },
            ].map(({ icon: Icon, term, note }) => (
              <div key={term} className="flex items-center gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-gold">
                  <Icon size={18} className="text-ink" />
                </span>
                <dt className="text-sm font-semibold uppercase tracking-[0.14em] text-paper">{term}</dt>
                <dd className="text-[0.9375rem] text-paper">{note}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          The form. A light ground, so it reads as a page of the website
          rather than a screen of some other product.
         ------------------------------------------------------------------ */}
      <section className="flex items-center justify-center px-6 py-11 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
        <div className="w-full max-w-md">
          <span className="eyebrow">Parent sign in</span>
          <h2 className="mt-4 font-display text-[1.75rem] text-ink sm:text-4xl">Open your child&apos;s record</h2>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-mute">
            Use the email address the school has on file for you. If you have not been given one,
            call the office and we will set it up for you.
          </p>

          <form onSubmit={handleSubmit} className="mt-9 space-y-6" noValidate>
            {error ? (
              <div role="alert" className="flex items-start gap-3 rounded-2xl bg-tint-orange px-4 py-3.5">
                <AlertCircle size={18} className="mt-0.5 shrink-0 text-gold-deep" aria-hidden="true" />
                <p className="text-sm leading-relaxed text-ink">{error}</p>
              </div>
            ) : null}

            <label className="block">
              <span className={label}>Email address</span>
              <span className="relative block">
                <Mail
                  size={16}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gold-deep"
                />
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className={field}
                />
              </span>
            </label>

            <label className="block">
              <span className={label}>Password</span>
              <span className="relative block">
                <Lock
                  size={16}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gold-deep"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className={field + ' pr-12'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(value => !value)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gold-deep transition-colors hover:bg-gold-pale"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </span>
            </label>

            {/* Deliberately still: a button that moves while you aim at it is a
                button people fail to press. The portal is where a parent signs
                in, so it is the last place to be clever. */}
            <InteractiveHoverButton type="submit" full tone="gold" magnetic={false} className="w-full">
              Sign in
            </InteractiveHoverButton>
          </form>

          <div className="mt-8 bg-tint-orange px-5 py-4">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-gold-deep">
              Demo account
            </p>
            <dl className="mt-3 space-y-1.5 text-sm">
              <div className="flex flex-wrap gap-x-2">
                <dt className="text-ink-mute">Email</dt>
                <dd className="font-medium text-ink">parent@demo.com</dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="text-ink-mute">Password</dt>
                <dd className="font-medium text-ink">demo123</dd>
              </div>
            </dl>
            <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink-mute">
              This is a demonstration sign in. No real records are held behind it.
            </p>
          </div>

          <p className="mt-6 text-[0.8125rem] leading-relaxed text-ink-mute">
            Trouble signing in? Call the office on{' '}
            <a
              href={`tel:${school.phone.replace(/\s/g, '')}`}
              className="font-medium text-gold-deep underline decoration-gold-deep underline-offset-4"
            >
              {school.phone}
            </a>
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-5 border-t border-rule pt-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-gold-deep"
            >
              <ArrowLeft size={15} aria-hidden="true" />
              Back to the school website
            </Link>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 text-sm font-semibold text-purple-deep"
            >
              <ShieldCheck size={16} aria-hidden="true" />
              School Admin
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LoginScreen;
