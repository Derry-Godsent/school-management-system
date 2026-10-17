import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle, ArrowLeft, ArrowRight, BookOpen, Building2, ClipboardList, Eye, EyeOff,
  GraduationCap, Lock, Mail, ShieldCheck, Users, Wallet, type LucideIcon,
} from 'lucide-react';
import { school } from '../../data';
import {
  DEMO_TODAY, admissionQueue, attendanceToday, feePosition, readyToPublish, roles, rollSize,
  type Role,
} from '../../data/admin';
import { useStaffAuth } from './AuthContext';
import { LightRays, TypingAnimation } from '../../components/magic';
import { formatLongDate } from '../../data/portal';

/**
 * The door to the staff console.
 *
 * The school is the one signing in here, not a visitor, so the screen is built
 * to look like the inside of the operation rather than a marketing page: the
 * same photograph and light as the public site on the left, and on the right a
 * plain white working surface with the form on it.
 *
 * The role picker is the point of the screen. A director, a bursar and a class
 * teacher do not see the same console, and a pitch should be able to show that
 * in one press rather than in a slide. Choosing a role fills the sign in with
 * that person's account, and the line under it says what they are allowed to do.
 */

const ROLE_ICON: Record<string, LucideIcon> = {
  director: Building2,
  head: GraduationCap,
  admin: ClipboardList,
  finance: Wallet,
  form: Users,
  subject: BookOpen,
};

const presentToday = attendanceToday.reduce((total, klass) => total + klass.presentToday, 0);

export function LoginScreen() {
  const navigate = useNavigate();
  const { login, signInAs } = useStaffAuth();
  const [email, setEmail] = useState(roles[0].email);
  const [password, setPassword] = useState(roles[0].password);
  const [picked, setPicked] = useState<Role>(roles[0]);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const choose = (role: Role) => {
    setPicked(role);
    setEmail(role.email);
    setPassword(role.password);
    setError('');
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const match = login(email, password);
    if (match) {
      navigate('/admin');
      return;
    }
    setError('That email address and password do not match a staff account. Pick a role below to use its demo account.');
  };

  const field =
    'w-full rounded-2xl border border-rule bg-canvas py-3.5 pl-11 pr-4 text-sm text-ink placeholder:text-ink-mute ' +
    'transition-colors focus:border-gold-deep focus:bg-paper focus:outline-none focus:ring-2 focus:ring-gold/25';
  const label = 'mb-2 block text-[0.8125rem] font-medium text-ink';

  return (
    <div className="min-h-screen bg-cream lg:grid lg:grid-cols-[minmax(0,58fr)_minmax(0,42fr)]">
      {/* ------------------------------------------------------------------
          The school side. The photograph, held dark from the bottom so the
          words sit on the quiet part of it, with the console's live figures
          above the name of the thing being signed into.
         ------------------------------------------------------------------ */}
      <section className="relative flex min-h-[19rem] items-end overflow-hidden bg-ink lg:min-h-screen">
        <img
          src="/images/campus-life.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 scrim" />
        <LightRays intensity={0.5} />

        <div className="relative z-10 w-full max-w-2xl px-6 py-9 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-gold">
              <span className="font-display text-base font-bold tracking-wide text-ink">MG</span>
            </span>
            <span className="leading-tight">
              <span className="block font-display text-lg text-paper sm:text-xl">{school.name}</span>
              <span className="mt-1 block text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-paper">
                Staff console
              </span>
            </span>
          </div>

          <span className="eyebrow eyebrow--on-dark mt-8 block sm:mt-10">Every record, entered once</span>

          <h1 className="mt-4 font-display text-[1.75rem] leading-[1.1] text-paper sm:mt-5 sm:text-5xl lg:text-[3.2rem]">
            The school,
            <br />
            running in one place.
          </h1>

          <p className="mt-4 hidden max-w-xl text-[0.9375rem] leading-relaxed text-paper sm:block sm:text-base">
            What the office enters here reaches a parent&apos;s phone the same minute. No forms
            carried home, no queue at the bursar.
          </p>

          <span className="mt-6 inline-flex bg-gold px-4 py-2 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-ink sm:mt-8">
            <TypingAnimation
              words={['Registers', 'Marks', 'Fees', 'Notices']}
              pauseDelay={2200}
            />
          </span>

          {/* The console's own figures, so the door shows the room behind it. */}
          <dl className="mt-9 hidden max-w-xl grid-cols-3 gap-6 border-t border-paper pt-6 lg:grid">
            {[
              { figure: `${presentToday}/${rollSize}`, note: 'in school today' },
              { figure: `${feePosition.rate}%`, note: 'fees collected' },
              { figure: `${readyToPublish.length}`, note: 'results waiting' },
            ].map(item => (
              <div key={item.note}>
                <dt className="font-display text-2xl tabular-nums text-paper">{item.figure}</dt>
                <dd className="mt-1 text-[0.75rem] text-paper">{item.note}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 hidden text-[0.75rem] text-paper lg:block">
            {formatLongDate(DEMO_TODAY)} · {admissionQueue.filter(item => item.stage === 'New').length} new
            applications
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          The working side. A white sheet, so it reads as a desk rather than
          another page of the website.
         ------------------------------------------------------------------ */}
      <section className="flex items-start justify-center bg-paper px-5 py-10 sm:px-8 lg:items-center lg:px-10 lg:py-12">
        <div className="w-full max-w-md">
          <span className="eyebrow">Staff sign in</span>
          <h2 className="mt-3 font-display text-[1.625rem] leading-tight text-ink sm:text-[2rem]">
            Open the console
          </h2>
          <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-mute">
            Six roles share this system. Choose yours and sign in.
          </p>

          {/* The role picker. Two columns on a phone, three from a tablet. */}
          <fieldset className="mt-6">
            <legend className="sr-only">Choose your role</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {roles.map(role => {
                const Icon = ROLE_ICON[role.id];
                const on = picked.id === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => choose(role)}
                    aria-pressed={on}
                    className={`flex min-h-[4.25rem] flex-col items-start justify-between gap-1.5 rounded-2xl border px-3 py-2.5 text-left transition-colors ${
                      on
                        ? 'border-gold bg-tint-orange'
                        : 'border-rule bg-canvas active:bg-tint-orange'
                    }`}
                  >
                    <Icon size={17} className={on ? 'text-gold-deep' : 'text-ink-mute'} aria-hidden="true" />
                    <span className={`text-[0.75rem] font-semibold leading-tight ${on ? 'text-ink' : 'text-ink-mute'}`}>
                      {role.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* What the chosen role may do. This is the sentence that sells the system. */}
          <div className="mt-3 rounded-2xl bg-tint-green px-4 py-3">
            <p className="text-[0.75rem] font-semibold text-green-deep">{picked.name}</p>
            <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink">{picked.blurb}</p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {picked.focuses.map(focus => (
                <li key={focus} className="rounded-full bg-paper px-2.5 py-1 text-[0.6875rem] font-medium text-ink">
                  {focus}
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
            {error ? (
              <div role="alert" className="flex items-start gap-3 rounded-2xl bg-tint-orange px-4 py-3.5">
                <AlertCircle size={18} className="mt-0.5 shrink-0 text-gold-deep" aria-hidden="true" />
                <p className="text-[0.8125rem] leading-relaxed text-ink">{error}</p>
              </div>
            ) : null}

            <label className="block">
              <span className={label}>Work email</span>
              <span className="relative block">
                <Mail size={16} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gold-deep" />
                <input
                  type="email"
                  name="email"
                  autoComplete="username"
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  className={field}
                />
              </span>
            </label>

            <label className="block">
              <span className={label}>Password</span>
              <span className="relative block">
                <Lock size={16} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gold-deep" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                  className={field + ' pr-14'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(value => !value)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-1.5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-gold-deep active:bg-tint-orange"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </span>
            </label>

            {/* Deliberately still. A button that moves while you aim at it is a
                button people fail to press, and this is the way into the system. */}
            <button
              type="submit"
              className="flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-2xl bg-gold px-6 text-[0.9375rem] font-semibold text-ink transition-transform active:scale-[0.99]"
            >
              Sign in as {picked.title}
              <ArrowRight size={17} aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => {
                signInAs(picked);
                navigate('/admin');
              }}
              className="flex min-h-[3rem] w-full items-center justify-center rounded-2xl bg-canvas px-6 text-[0.8125rem] font-medium text-ink"
            >
              Enter the demo as {picked.name.split(' ').slice(-1)[0]}
            </button>
          </form>

          <p className="mt-4 rounded-2xl bg-canvas px-4 py-3 text-[0.75rem] leading-relaxed text-ink-mute">
            Demonstration accounts. The password for all six is <span className="font-semibold text-ink">demo123</span>.
            No real pupil records are held behind them.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-5">
            <Link
              to="/"
              className="inline-flex min-h-[2.75rem] items-center gap-2 text-[0.8125rem] font-medium text-ink"
            >
              <ArrowLeft size={15} aria-hidden="true" />
              School website
            </Link>
            <Link
              to="/parent"
              className="inline-flex min-h-[2.75rem] items-center gap-2 text-[0.8125rem] font-semibold text-purple-deep"
            >
              <ShieldCheck size={16} aria-hidden="true" />
              Parent app
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LoginScreen;
