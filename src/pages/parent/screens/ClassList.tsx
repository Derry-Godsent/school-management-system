import { useMemo, useState } from 'react';
import { Mail, Phone, Search, Users } from 'lucide-react';
import { classInfo, type RosterEntry } from '../../../data/portal';
import { useWard } from '../PortalShell';
import { Avatar, Badge, Eyebrow, Meter, SectionHead, Sheet, Stat } from '../ui';

/**
 * The class.
 *
 * A parent who knows who is in their child's class knows far more about the
 * child's day: who the prefect is, who sits with them, who is good at what. So
 * every pupil is listed with the duty they hold and one line about them, and
 * tapping a name opens that line in full.
 *
 * What is deliberately NOT here: any other child's marks, averages or position.
 * The class standing is on the family's own pages, about their own child. A
 * parent has no business reading another family's results, and a school
 * pitching this to parents should be able to say so plainly.
 */
export function ClassListScreen() {
  const { child, profile, klass, roster } = useWard();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<RosterEntry | null>(null);

  if (!child || !profile || !klass) return null;

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return roster;
    return roster.filter(entry => entry.name.toLowerCase().includes(needle));
  }, [query, roster]);

  const withDuty = roster.filter(entry => entry.badge).length;
  const wards = roster.filter(entry => entry.ward);

  return (
    <div className="space-y-8">
      <section>
        <Eyebrow>The class</Eyebrow>
        <h1 className="mt-2 font-display text-2xl text-ink sm:text-3xl">
          {klass.name} · {klass.room}
        </h1>
        <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-mute">
          {roster.length} pupils, taught by {klass.subjectTeachers.length} subject teachers and led by{' '}
          {klass.formTeacher.name}.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Pupils in the class" value={roster.length} note={`${withDuty} hold a duty`} />
        <Stat label="In school today" value={`${klass.presentToday} of ${roster.length}`} note={`${Math.round((klass.presentToday / roster.length) * 100)}% present`} tone="green" />
        <Stat label="Class attendance" value={`${klass.termAttendance}%`} note="This term" tone="purple" />
        <Stat label="Form teacher" value={klass.formTeacher.name.replace(/^(Mr\.|Madam)\s+/, '')} note={klass.room} tone="orange" />
      </section>

      {/* Who to talk to about what. The one piece of practical information a
          parent needs from this screen. */}
      <section className="bg-paper px-4 py-5">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-ink-mute">
          Who to reach
        </p>
        <div className="mt-3 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-3">
            <div>
              <p className="text-[0.875rem] font-medium text-ink">{klass.formTeacher.name}</p>
              <p className="text-[0.8125rem] text-ink-mute">Form teacher, anything at all</p>
            </div>
            <div className="flex items-center gap-3">
              <a href={`tel:${klass.formTeacher.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-gold-deep">
                <Phone size={14} aria-hidden="true" /> Call
              </a>
              <a href={`mailto:${klass.formTeacher.email}`} className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-gold-deep">
                <Mail size={14} aria-hidden="true" /> Email
              </a>
            </div>
          </div>
          <div>
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-ink-mute">
              Subject teachers
            </p>
            <ul className="mt-2 grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {klass.subjectTeachers.map(teacher => (
                <li key={teacher.subject ?? teacher.name} className="flex items-baseline justify-between gap-3 border-b border-rule pb-2">
                  <span className="min-w-0">
                    <span className="block text-[0.875rem] text-ink">{teacher.name}</span>
                    <span className="block text-[0.75rem] text-ink-mute">{teacher.subject}</span>
                  </span>
                  <a
                    href={`tel:${teacher.phone.replace(/\s/g, '')}`}
                    className="shrink-0 text-[0.8125rem] font-medium text-gold-deep"
                  >
                    Call
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- the list */}
      <section>
        <SectionHead
          eyebrow="Class list"
          title="Everyone in the class"
          note="Tap a name to read a line about them. Duties are the ones the class voted for at the start of the year."
        />

        <label className="mb-4 flex items-center gap-2 border border-rule bg-paper px-3 py-2.5">
          <Search size={16} className="shrink-0 text-ink-mute" aria-hidden="true" />
          <span className="sr-only">Search the class list</span>
          <input
            type="search"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search for a pupil"
            className="w-full bg-transparent text-[0.875rem] text-ink placeholder:text-ink-mute focus:outline-none"
          />
        </label>

        {shown.length ? (
          <ul className="bg-paper">
            {shown.map(entry => (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => setOpen(entry)}
                  className="flex w-full items-center gap-3.5 border-b border-rule px-4 py-3.5 text-left transition-colors last:border-b-0 hover:bg-cream"
                >
                  <Avatar name={entry.name} tone={entry.ward ? 'orange' : undefined} />
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-[0.9375rem] font-medium text-ink">{entry.name}</span>
                      {entry.ward ? <Badge tone="orange">Your child</Badge> : null}
                    </span>
                    <span className="mt-1 block text-[0.8125rem] text-ink-mute">
                      {entry.badge ? entry.badge : 'No class duty'} · strongest in {entry.best}
                    </span>
                  </span>
                  <span className="shrink-0 font-display text-lg text-ink-mute">{entry.rank}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="bg-paper px-4 py-5 text-[0.9375rem] text-ink-mute">
            Nobody in this class matches "{query}". Check the spelling and try again.
          </p>
        )}
        <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink-mute">
          The number beside each name is their place in the class register, not their position in the
          class. Marks are private, and this list shows only duties and strengths.
        </p>
      </section>

      {/* ------------------------------------------------------------- class attendance */}
      <section className="bg-paper px-4 py-5">
        <Eyebrow tone="green">In school today</Eyebrow>
        <p className="mt-2 font-display text-2xl text-ink">
          {klass.presentToday} of {roster.length} present
        </p>
        <div className="mt-3">
          <Meter value={klass.presentToday} max={roster.length} tone="green" />
        </div>
        <p className="mt-3 flex items-start gap-2 text-[0.8125rem] leading-relaxed text-ink-mute">
          <Users size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
          {wards.length > 1
            ? 'Both of your children are in this class, and both are marked in the list.'
            : 'School attendance is shown as a total, never pupil by pupil, so no family is put on display.'}
        </p>
      </section>

      {/* ------------------------------------------------------------- one pupil */}
      <Sheet open={!!open} onClose={() => setOpen(null)} title={open?.name ?? ''}>
        {open ? (
          <div>
            <div className="flex items-center gap-4">
              <Avatar name={open.name} size="lg" tone={open.ward ? 'orange' : undefined} />
              <div>
                {open.badge ? <Badge tone="purple">{open.badge}</Badge> : <Badge tone="plain">Pupil</Badge>}
                <p className="mt-2 text-[0.875rem] text-ink-mute">
                  {klass.name} · place {open.rank} in the register
                </p>
              </div>
            </div>

            {open.ward ? (
              <p className="mt-4 bg-tint-orange px-4 py-3 text-[0.875rem] leading-relaxed text-ink">
                This is your own child. Their marks, attendance and fees have their own pages in this
                portal.
              </p>
            ) : null}

            <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink">
              {open.about || `${open.name} is in ${klass.name}. Strongest in ${open.best}.`}
            </p>

            <dl className="mt-5 border-t border-rule">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 py-2.5">
                <dt className="text-[0.8125rem] text-ink-mute">Strongest subject</dt>
                <dd className="text-[0.875rem] font-medium text-ink">{open.best}</dd>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 py-2.5">
                <dt className="text-[0.8125rem] text-ink-mute">Class duty</dt>
                <dd className="text-[0.875rem] font-medium text-ink">{open.badge ?? 'None this term'}</dd>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 py-2.5">
                <dt className="text-[0.8125rem] text-ink-mute">Class</dt>
                <dd className="text-[0.875rem] font-medium text-ink">
                  {(classInfo[profile.classId] ?? klass).name}
                </dd>
              </div>
            </dl>

            <p className="mt-4 text-[0.8125rem] leading-relaxed text-ink-mute">
              Anything you want to pass on to this family, the form teacher will carry for you.
            </p>
            <a
              href={`tel:${klass.formTeacher.phone.replace(/\s/g, '')}`}
              className="mt-3 inline-flex items-center gap-2 bg-ink px-4 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-paper"
            >
              <Phone size={14} aria-hidden="true" />
              Ask {klass.formTeacher.name.split(' ').slice(-1)[0]}
            </a>
          </div>
        ) : null}
      </Sheet>
    </div>
  );
}

export default ClassListScreen;
