import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Check, ChevronDown, Clock, Mail, Phone, ShieldCheck, UserRound,
} from 'lucide-react';
import { departments, school } from '../../data';

// Single source of truth for the class list offered at admission.
const APPLICABLE_CLASSES = departments.flatMap(dept => dept.levels);

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Submit application',
    desc: 'Fill in the form on this page. It takes about four minutes.',
  },
  {
    step: '02',
    title: 'Assessment',
    desc: 'Your child takes a short assessment so we can place them in the right class.',
  },
  {
    step: '03',
    title: 'Interview',
    desc: 'A brief meeting with you and your child to talk about expectations.',
  },
  {
    step: '04',
    title: 'Enrolment',
    desc: 'On acceptance, complete the enrolment papers and the first fee payment.',
  },
];

const REQUIREMENTS = [
  'Birth certificate or passport of the child',
  'Previous school report, if there is one',
  'Two passport photographs of the child',
  'Parent or guardian identification',
  'Immunisation records, for Early Years',
];

const IMPORTANT_DATES = [
  { label: 'Applications open', date: 'January 2026' },
  { label: 'Assessment period', date: 'February to March 2026' },
  { label: 'Offers released', date: 'April 2026' },
  { label: 'Enrolment deadline', date: 'June 2026' },
  { label: 'School opens', date: 'September 2026' },
];

interface FormState {
  childName: string;
  dob: string;
  applyingFor: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  notes: string;
}

type Field = keyof FormState;

const EMPTY: FormState = {
  childName: '',
  dob: '',
  applyingFor: '',
  parentName: '',
  parentPhone: '',
  parentEmail: '',
  notes: '',
};

const REQUIRED: Field[] = ['childName', 'dob', 'applyingFor', 'parentName', 'parentPhone'];

const LABELS: Record<Field, string> = {
  childName: 'Child\u2019s full name',
  dob: 'Date of birth',
  applyingFor: 'Class applying for',
  parentName: 'Your full name',
  parentPhone: 'Phone number',
  parentEmail: 'Email address',
  notes: 'Anything we should know',
};

/**
 * A labelled field.
 *
 * Declared at module scope on purpose. A component created inside the page body
 * is a new type on every render, so React unmounts the input and builds another
 * one, and the caret is lost halfway through a word. That is the kind of fault
 * that makes a form feel broken without looking broken.
 */
function Field({
  id,
  label,
  optional,
  hint,
  error,
  children,
}: {
  id: Field;
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-[0.8125rem] font-medium text-ink">
          {label}
          {!optional ? <span className="ml-1 text-gold-deep" aria-hidden="true">*</span> : null}
        </span>
        {optional ? <span className="text-[0.6875rem] text-ink-mute">Optional</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-[0.8125rem] leading-relaxed text-gold-deep">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-[0.75rem] leading-relaxed text-ink-mute">{hint}</p>
      ) : null}
    </div>
  );
}

/**
 * The admissions page.
 *
 * The form used to sit under three sections of reading, which meant a parent
 * who had already decided to apply had to scroll past everything to find it,
 * and then fill in thin fields with no idea of how far along they were.
 *
 * Now the page leads with the decision and then with the form. A short band
 * says who this is for, a single button takes you straight to the form, and
 * the form itself sits beside the things you need to know rather than under
 * them: what to bring, when things happen, and who to call. The page keeps the
 * site's rule of tone rather than cards, so the form is separated by ground
 * and hairline rules, not by a floating box.
 *
 * Filling it in is guided: a progress line counts the required fields as they
 * are answered, each field says what it wants, mistakes are explained in words
 * beside the field they belong to, and the first thing wrong is focused for
 * you. No red is used anywhere, in keeping with the rest of the site.
 */
/** One input style, so every field in the form is the same shape. */
const fieldClass = (field: Field, errors: Partial<Record<Field, string>>) =>
  `w-full min-h-[3.25rem] rounded-xl border bg-paper px-4 text-[0.9375rem] text-ink placeholder:text-ink-mute transition-colors focus:outline-none focus:ring-2 focus:ring-gold/25 ${
    errors[field] ? 'border-gold-deep' : 'border-rule focus:border-gold-deep'
  }`;

export default function AdmissionsPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const answered = REQUIRED.filter(field => form[field].trim().length > 0).length;
  const progress = Math.round((answered / REQUIRED.length) * 100);

  // The navigation and the hero both send people here by anchor.
  useEffect(() => {
    if (window.location.hash === '#apply') {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const set = (field: Field) => (value: string) => {
    setForm(current => ({ ...current, [field]: value }));
    if (errors[field]) setErrors(current => ({ ...current, [field]: undefined }));
  };

  const validate = (): Partial<Record<Field, string>> => {
    const next: Partial<Record<Field, string>> = {};
    if (!form.childName.trim()) next.childName = 'Please write the child\u2019s name as it should appear on the register.';
    if (!form.dob) next.dob = 'A date of birth tells us which class a child belongs in.';
    if (!form.applyingFor) next.applyingFor = 'Choose the class you are applying for.';
    if (!form.parentName.trim()) next.parentName = 'Please write the name of the parent or guardian applying.';
    if (!form.parentPhone.trim()) {
      next.parentPhone = 'We need a number to reach you on when there is a decision.';
    } else if (form.parentPhone.replace(/\D/g, '').length < 9) {
      next.parentPhone = 'That does not look like a full phone number. Include the network code.';
    }
    if (form.parentEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.parentEmail.trim())) {
      next.parentEmail = 'That email address is missing something. Check it, or leave it empty.';
    }
    return next;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    const first = (Object.keys(found) as Field[])[0];
    if (first) {
      document.getElementById(first)?.focus();
      return;
    }
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ------------------------------------------------------------------ */
  /* The field itself, so every input behaves the same way               */
  /* ------------------------------------------------------------------ */
  if (submitted) {
    return (
      <div className="min-h-screen bg-cream pb-24 pt-24">
        <div className="mx-auto max-w-xl px-4 sm:px-6">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold">
            <Check size={26} className="text-ink" aria-hidden="true" />
          </span>
          <span className="mt-6 block text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-gold-deep">
            Application received
          </span>
          <h1 className="mt-3 font-display text-3xl leading-tight text-ink sm:text-4xl">
            Thank you. We have {form.childName.split(' ')[0]}&apos;s application.
          </h1>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-mute">
            Someone from the admissions office will call {form.parentPhone} within five working
            days. If you would rather speak to us first, the office is open on {school.phone}.
          </p>

          <dl className="mt-8 divide-y divide-rule border-y border-rule">
            {[
              { term: 'Child', note: form.childName },
              { term: 'Applied for', note: form.applyingFor },
              { term: 'Parent', note: form.parentName },
              { term: 'Next step', note: 'A short assessment, booked by phone' },
            ].map(item => (
              <div key={item.term} className="flex flex-wrap items-baseline justify-between gap-3 py-3.5">
                <dt className="text-[0.8125rem] text-ink-mute">{item.term}</dt>
                <dd className="text-[0.875rem] font-medium text-ink">{item.note}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/"
              className="inline-flex min-h-[3rem] items-center gap-2 bg-gold px-6 text-[0.875rem] font-semibold text-ink"
            >
              Back to the school <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex min-h-[3rem] items-center gap-2 text-[0.875rem] font-medium text-ink underline decoration-rule underline-offset-4"
            >
              Contact the office
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ------------------------------------------------------------------
          The decision, and the way straight to the form.
         ------------------------------------------------------------------ */}
      <section className="relative overflow-hidden bg-cream pb-14 pt-16">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold opacity-[0.10]"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <div className="max-w-2xl">
              <span className="text-sm font-medium uppercase tracking-wide text-gold-deep">Admissions</span>
              <h1 className="mt-3 font-display text-4xl leading-[1.05] text-ink sm:text-5xl lg:text-[3.6rem]">
                Join our school family
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-ink-mute">
                We welcome applications from families who share our commitment to academic
                excellence and character development.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <a
                  href="#apply"
                  className="inline-flex min-h-[3.25rem] items-center gap-2 bg-gold px-7 text-[0.9375rem] font-semibold text-ink transition-transform active:scale-[0.99]"
                >
                  Start an application <ArrowRight size={17} aria-hidden="true" />
                </a>
                <a
                  href={`tel:${school.phone.replace(/\s/g, '')}`}
                  className="inline-flex min-h-[3.25rem] items-center gap-2 text-[0.9375rem] font-medium text-ink underline decoration-rule underline-offset-4"
                >
                  <Phone size={16} className="text-gold-deep" aria-hidden="true" />
                  Or call {school.phone}
                </a>
              </div>
            </div>

            {/* Three facts that answer the questions people ask before they
                start typing anything. */}
            <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 lg:gap-0 lg:divide-y lg:divide-rule lg:border-y lg:border-rule">
              {[
                { icon: Clock, term: 'About four minutes', note: 'Seven fields, and only five are required' },
                { icon: ShieldCheck, term: 'Nothing to pay', note: 'The application itself is free' },
                { icon: UserRound, term: 'A reply in five days', note: 'By phone, from the admissions office' },
              ].map(({ icon: Icon, term, note }) => (
                <li key={term} className="flex items-start gap-3 lg:py-3.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paper">
                    <Icon size={16} className="text-gold-deep" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-[0.875rem] font-semibold text-ink">{term}</span>
                    <span className="mt-0.5 block text-[0.8125rem] leading-snug text-ink-mute">{note}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          The form, and beside it everything you might want to check first.
         ------------------------------------------------------------------ */}
      <section id="apply" ref={formRef} className="scroll-mt-24 bg-paper py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
            {/* Left: what to have ready, when things happen, who to ring. */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <h2 className="font-display text-2xl text-ink">Before you start</h2>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-mute">
                None of this is needed to send the form. It saves a second call if you have it to
                hand.
              </p>

              <ul className="mt-5 space-y-2.5">
                {REQUIREMENTS.map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/15">
                      <Check size={12} className="text-gold-deep" aria-hidden="true" />
                    </span>
                    <span className="text-[0.875rem] leading-snug text-ink-mute">{item}</span>
                  </li>
                ))}
              </ul>

              <h3 className="mt-8 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-ink-mute">
                Dates for this intake
              </h3>
              <dl className="mt-3 divide-y divide-rule border-y border-rule">
                {IMPORTANT_DATES.map(item => (
                  <div key={item.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 py-2.5">
                    <dt className="text-[0.8125rem] text-ink-mute">{item.label}</dt>
                    <dd className="text-[0.8125rem] font-medium text-ink">{item.date}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 border-l-2 border-gold pl-4">
                <p className="text-[0.875rem] leading-relaxed text-ink">
                  Would rather talk to somebody?
                </p>
                <a
                  href={`tel:${school.phone.replace(/\s/g, '')}`}
                  className="mt-1.5 inline-flex items-center gap-2 text-[0.875rem] font-medium text-gold-deep underline decoration-gold-deep/40 underline-offset-4"
                >
                  <Phone size={15} aria-hidden="true" /> {school.phone}
                </a>
              </div>
            </div>

            {/* Right: the form. */}
            <div>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl text-ink sm:text-[1.9rem]">Application form</h2>
                  <p className="mt-1.5 text-[0.875rem] text-ink-mute">
                    Fields marked <span className="font-semibold text-gold-deep">*</span> are needed.
                    Everything else can wait.
                  </p>
                </div>
                <p className="text-[0.8125rem] font-medium tabular-nums text-ink">
                  {answered} of {REQUIRED.length} answered
                </p>
              </div>

              {/* The progress line answers "how much more of this is there". */}
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-canvas-deep">
                <div
                  className="h-full rounded-full bg-gold transition-[width] duration-500"
                  style={{ width: `${Math.max(progress, 3)}%` }}
                  role="progressbar"
                  aria-valuenow={answered}
                  aria-valuemin={0}
                  aria-valuemax={REQUIRED.length}
                  aria-label="Required fields answered"
                />
              </div>

              <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-8">
                {/* ---------------------------------------------------- child */}
                <fieldset className="space-y-5">
                  <legend className="mb-4 flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold text-[0.75rem] font-semibold text-ink">
                      1
                    </span>
                    <span className="text-[0.9375rem] font-semibold text-ink">The child</span>
                  </legend>

                  <Field
                    id="childName"
                    label={LABELS.childName}
                    error={errors.childName}
                    hint="As it should appear on the school register."
                  >
                    <input
                      id="childName"
                      name="childName"
                      type="text"
                      autoComplete="name"
                      value={form.childName}
                      onChange={event => set('childName')(event.target.value)}
                      className={fieldClass('childName', errors)}
                      placeholder="e.g. Kwame Mensah"
                      aria-invalid={!!errors.childName}
                      aria-describedby={errors.childName ? 'childName-error' : undefined}
                    />
                  </Field>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field id="dob" label={LABELS.dob} error={errors.dob} hint="Used to place the child in the right year group.">
                      <input
                        id="dob"
                        name="dob"
                        type="date"
                        max={new Date().toISOString().slice(0, 10)}
                        value={form.dob}
                        onChange={event => set('dob')(event.target.value)}
                        className={fieldClass('dob', errors)}
                        aria-invalid={!!errors.dob}
                        aria-describedby={errors.dob ? 'dob-error' : undefined}
                      />
                    </Field>

                    <Field id="applyingFor" label={LABELS.applyingFor} error={errors.applyingFor}>
                      <span className="relative block">
                        <select
                          id="applyingFor"
                          name="applyingFor"
                          value={form.applyingFor}
                          onChange={event => set('applyingFor')(event.target.value)}
                          className={`${fieldClass('applyingFor', errors)} appearance-none pr-11`}
                          aria-invalid={!!errors.applyingFor}
                          aria-describedby={errors.applyingFor ? 'applyingFor-error' : undefined}
                        >
                          <option value="">Choose a class</option>
                          {APPLICABLE_CLASSES.map(name => (
                            <option key={name} value={name}>
                              {name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={16}
                          aria-hidden="true"
                          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-mute"
                        />
                      </span>
                    </Field>
                  </div>
                </fieldset>

                <hr className="border-rule" />

                {/* -------------------------------------------------- guardian */}
                <fieldset className="space-y-5">
                  <legend className="mb-4 flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold text-[0.75rem] font-semibold text-ink">
                      2
                    </span>
                    <span className="text-[0.9375rem] font-semibold text-ink">You</span>
                  </legend>

                  <Field id="parentName" label={LABELS.parentName} error={errors.parentName}>
                    <input
                      id="parentName"
                      name="parentName"
                      type="text"
                      autoComplete="name"
                      value={form.parentName}
                      onChange={event => set('parentName')(event.target.value)}
                      className={fieldClass('parentName', errors)}
                      placeholder="Parent or guardian name"
                      aria-invalid={!!errors.parentName}
                      aria-describedby={errors.parentName ? 'parentName-error' : undefined}
                    />
                  </Field>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      id="parentPhone"
                      label={LABELS.parentPhone}
                      error={errors.parentPhone}
                      hint="The number we call when there is a decision."
                    >
                      <span className="relative block">
                        <Phone
                          size={16}
                          aria-hidden="true"
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gold-deep"
                        />
                        <input
                          id="parentPhone"
                          name="parentPhone"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          value={form.parentPhone}
                          onChange={event => set('parentPhone')(event.target.value)}
                          className={`${fieldClass('parentPhone', errors)} pl-11`}
                          placeholder="+233 24 123 4567"
                          aria-invalid={!!errors.parentPhone}
                          aria-describedby={errors.parentPhone ? 'parentPhone-error' : undefined}
                        />
                      </span>
                    </Field>

                    <Field
                      id="parentEmail"
                      label={LABELS.parentEmail}
                      optional
                      error={errors.parentEmail}
                      hint="For the written confirmation, if you would like one."
                    >
                      <span className="relative block">
                        <Mail
                          size={16}
                          aria-hidden="true"
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gold-deep"
                        />
                        <input
                          id="parentEmail"
                          name="parentEmail"
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          value={form.parentEmail}
                          onChange={event => set('parentEmail')(event.target.value)}
                          className={`${fieldClass('parentEmail', errors)} pl-11`}
                          placeholder="you@example.com"
                          aria-invalid={!!errors.parentEmail}
                          aria-describedby={errors.parentEmail ? 'parentEmail-error' : undefined}
                        />
                      </span>
                    </Field>
                  </div>
                </fieldset>

                <hr className="border-rule" />

                {/* ----------------------------------------------------- notes */}
                <fieldset className="space-y-5">
                  <legend className="mb-4 flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-canvas-deep text-[0.75rem] font-semibold text-ink">
                      3
                    </span>
                    <span className="text-[0.9375rem] font-semibold text-ink">
                      Anything else
                      <span className="ml-2 text-[0.75rem] font-normal text-ink-mute">Optional</span>
                    </span>
                  </legend>

                  <Field
                    id="notes"
                    label={LABELS.notes}
                    optional
                    hint="A sibling at the school, a bus route, a learning need, a question."
                  >
                    <textarea
                      id="notes"
                      name="notes"
                      rows={4}
                      value={form.notes}
                      onChange={event => set('notes')(event.target.value)}
                      className={`${fieldClass('notes', errors)} resize-y py-3.5`}
                      placeholder="Tell us anything that would help us place your child well."
                    />
                  </Field>
                </fieldset>

                {/* ----------------------------------------------------- submit */}
                <div className="border-t border-rule pt-6">
                  <button
                    type="submit"
                    className="inline-flex min-h-[3.25rem] w-full items-center justify-center gap-2 bg-gold px-8 text-[0.9375rem] font-semibold text-ink transition-transform active:scale-[0.99] sm:w-auto"
                  >
                    Send the application <ArrowRight size={17} aria-hidden="true" />
                  </button>
                  <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink-mute">
                    The application is free and does not commit you to a place. We reply within five
                    working days.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          What happens after this page.
         ------------------------------------------------------------------ */}
      <section className="bg-cream py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl text-ink sm:text-3xl">What happens after you send it</h2>
          <ol className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {PROCESS_STEPS.map((item, index) => (
              <li key={item.step} className="relative">
                <span className="font-display text-[2.5rem] leading-none text-gold-deep/70">{item.step}</span>
                <h3 className="mt-3 text-[1rem] font-semibold text-ink">{item.title}</h3>
                <p className="mt-1.5 text-[0.875rem] leading-relaxed text-ink-mute">{item.desc}</p>
                {index < PROCESS_STEPS.length - 1 ? (
                  <span aria-hidden="true" className="mt-5 block h-px w-full bg-rule lg:w-[75%]" />
                ) : null}
              </li>
            ))}
          </ol>

          <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-rule pt-8">
            <p className="text-[0.875rem] text-ink-mute">
              Ready when you are. It takes about four minutes.
            </p>
            <a
              href="#apply"
              className="inline-flex min-h-[2.75rem] items-center gap-2 text-[0.875rem] font-semibold text-gold-deep"
            >
              Go to the form <ArrowRight size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
