import { useMemo, useState } from 'react';
import { Mail, Phone, Search } from 'lucide-react';
import { type RosterEntry } from '../../../data/portal';
import { useWard } from '../PortalShell';
import { Avatar, Card, CardBody, CardHead, Chip, Meter, Sheet, StatTile } from '../ui';

/**
 * The class.
 *
 * Every pupil is a card, so a parent can see who is in their child's class at a
 * glance: the duty they hold and the subject they are strongest in. Tapping one
 * opens the line about them.
 *
 * Deliberately absent: any other family's marks. A parent has no business
 * reading another child's results, and the page says so.
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

  return (
    <div className="space-y-4">
      <div className="px-1">
        <h1 className="font-display text-2xl text-ink">{klass.name}</h1>
        <p className="mt-1 text-[0.8125rem] text-ink-mute">
          {roster.length} pupils · {klass.room} · {klass.formTeacher.name}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Pupils" value={roster.length} note={`${withDuty} hold a duty`} tone="green" />
        <StatTile label="In today" value={`${klass.presentToday}`} note={`of ${roster.length}`} tone="orange" />
        <StatTile label="Class rate" value={`${klass.termAttendance}%`} note="This term" tone="purple" />
        <StatTile label="Subjects" value={klass.subjectTeachers.length} note="Teachers" tone="yellow" />
      </div>

      {/* Who to reach, as one compact card. */}
      <Card shape="top" tone="green">
        <CardBody>
          <CardHead eyebrow="Who to reach" title={klass.formTeacher.name} action={<Chip tone="green">Form teacher</Chip>} />
          <div className="flex flex-wrap gap-2">
            <a
              href={`tel:${klass.formTeacher.phone.replace(/\s/g, '')}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-green px-3 py-2 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-ink"
            >
              <Phone size={13} aria-hidden="true" /> Call
            </a>
            <a
              href={`mailto:${klass.formTeacher.email}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-tint-green px-3 py-2 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-green-deep"
            >
              <Mail size={13} aria-hidden="true" /> Email
            </a>
          </div>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {klass.subjectTeachers.map(teacher => (
              <li key={teacher.subject ?? teacher.name}>
                <Chip tone="plain">{teacher.subject}</Chip>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      <label className="flex items-center gap-2 rounded-xl bg-paper px-3.5 py-3">
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
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map(entry => (
            <li key={entry.id}>
              <button
                type="button"
                onClick={() => setOpen(entry)}
                className={`w-full rounded-xl px-4 py-3.5 text-left transition-transform active:scale-[0.98] ${
                  entry.ward ? 'bg-tint-orange border-l-4 border-gold-deep' : 'bg-paper'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar name={entry.name} tone={entry.ward ? 'orange' : undefined} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.9375rem] font-medium text-ink">{entry.name}</span>
                    <span className="mt-1 block truncate text-[0.75rem] text-ink-mute">
                      {entry.badge ?? 'Classmate'}
                    </span>
                  </span>
                </div>
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  {entry.ward ? <Chip tone="orange" solid>Your child</Chip> : null}
                  <Chip tone={entry.badge ? 'purple' : 'plain'}>Best: {entry.best}</Chip>
                </div>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <Card shape="bare">
          <CardBody>
            <p className="text-[0.875rem] text-ink-mute">Nobody in this class matches "{query}".</p>
          </CardBody>
        </Card>
      )}

      <Card shape="top" tone="purple">
        <CardBody>
          <CardHead eyebrow="In school today" title={`${klass.presentToday} of ${roster.length}`} />
          <Meter value={klass.presentToday} max={roster.length} tone="purple" />
          <p className="mt-3 text-[0.8125rem] text-ink-mute">
            Totals only, so no family is put on display.
          </p>
        </CardBody>
      </Card>

      <Sheet open={!!open} onClose={() => setOpen(null)} title={open?.name ?? ''}>
        {open ? (
          <div>
            <div className="flex items-center gap-4">
              <Avatar name={open.name} size="lg" tone={open.ward ? 'orange' : undefined} />
              <div>
                <Chip tone={open.badge ? 'purple' : 'plain'} solid={!!open.badge}>
                  {open.badge ?? 'Pupil'}
                </Chip>
                <p className="mt-2 text-[0.8125rem] text-ink-mute">
                  {klass.name} · place {open.rank} in the register
                </p>
              </div>
            </div>

            <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink">
              {open.about || `${open.name} is in ${klass.name}, strongest in ${open.best}.`}
            </p>

            {open.ward ? (
              <p className="mt-4 rounded-xl bg-tint-orange px-4 py-3 text-[0.875rem] leading-relaxed text-ink">
                This is your own child. Their marks, attendance and fees have their own pages.
              </p>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-2">
              <Chip tone="green">Best: {open.best}</Chip>
              <Chip tone="plain">{klass.formTeacher.name}</Chip>
            </div>

            <a
              href={`tel:${klass.formTeacher.phone.replace(/\s/g, '')}`}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-ink px-3.5 py-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-paper"
            >
              <Phone size={13} aria-hidden="true" /> Ask the form teacher
            </a>
          </div>
        ) : null}
      </Sheet>
    </div>
  );
}

export default ClassListScreen;
