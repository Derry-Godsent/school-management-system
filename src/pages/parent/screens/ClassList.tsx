import { useMemo, useState } from 'react';
import { Award, Mail, Phone, Search, Users } from 'lucide-react';
import { type RosterEntry } from '../../../data/portal';
import { useWard } from '../PortalShell';
import { Avatar, Card, CardPad, Chip, IconChip, Meter, ScreenTitle, Sheet, StatCard } from '../ui';

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
    <div className="space-y-5">
      <ScreenTitle title={klass.name} sub={`${roster.length} pupils · ${klass.room}`} />

      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <StatCard icon={Users} label="Pupils" value={roster.length} note={`${withDuty} hold a duty`} tone="green" />
        <StatCard icon={Users} label="In today" value={klass.presentToday} note={`of ${roster.length}`} tone="orange" />
        <StatCard icon={Award} label="Duties" value={withDuty} note="Elected in September" tone="purple" />
        <StatCard icon={Users} label="Subjects" value={klass.subjectTeachers.length} note="Teachers" tone="yellow" />
      </div>

      {/* The form teacher, as the first card on the screen. */}
      <Card variant="tint" tone="green">
        <CardPad>
          <div className="flex items-center gap-3.5">
            <Avatar name={klass.formTeacher.name} size="md" tone="green" />
            <div className="min-w-0 flex-1">
              <Chip tone="green">Form teacher</Chip>
              <p className="mt-1.5 truncate text-[0.9375rem] font-semibold text-ink">{klass.formTeacher.name}</p>
            </div>
          </div>
          <div className="mt-3.5 flex flex-wrap gap-2">
            <a
              href={`tel:${klass.formTeacher.phone.replace(/\s/g, '')}`}
              className="inline-flex min-h-[2.5rem] items-center gap-2 rounded-full bg-green px-4 text-[0.75rem] font-semibold text-ink"
            >
              <Phone size={14} aria-hidden="true" /> Call
            </a>
            <a
              href={`mailto:${klass.formTeacher.email}`}
              className="inline-flex min-h-[2.5rem] items-center gap-2 rounded-full bg-paper px-4 text-[0.75rem] font-semibold text-green-deep"
            >
              <Mail size={14} aria-hidden="true" /> Email
            </a>
          </div>
        </CardPad>
      </Card>

      {/* Search, as a rounded field. */}
      <label className="flex min-h-[3rem] items-center gap-2.5 rounded-2xl bg-paper px-3.5 shadow-[0_1px_3px_rgba(17,17,17,0.06)]">
        <Search size={17} className="shrink-0 text-ink-mute" aria-hidden="true" />
        <span className="sr-only">Search the class list</span>
        <input
          type="search"
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder="Search for a pupil"
          className="w-full bg-transparent text-[0.9375rem] text-ink placeholder:text-ink-mute focus:outline-none"
        />
      </label>

      {shown.length ? (
        <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map(entry => (
            <li key={entry.id}>
              <button
                type="button"
                onClick={() => setOpen(entry)}
                className={`flex min-h-[4.5rem] w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-left shadow-[0_1px_3px_rgba(17,17,17,0.06)] transition-transform active:scale-[0.98] ${
                  entry.ward ? 'bg-tint-orange' : 'bg-paper'
                }`}
              >
                <Avatar name={entry.name} tone={entry.ward ? 'orange' : undefined} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.9375rem] font-medium text-ink">{entry.name}</span>
                  <span className="mt-0.5 block truncate text-[0.75rem] text-ink-mute">
                    {entry.badge ?? `Strongest in ${entry.best}`}
                  </span>
                </span>
                {entry.ward ? (
                  <span className="shrink-0 rounded-full bg-gold px-2 py-0.5 text-[0.625rem] font-semibold text-ink">
                    Yours
                  </span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <Card>
          <CardPad>
            <p className="text-[0.875rem] text-ink-mute">Nobody in this class matches &quot;{query}&quot;.</p>
          </CardPad>
        </Card>
      )}

      <Card>
        <CardPad>
          <div className="mb-3 flex items-center gap-2.5">
            <IconChip icon={Users} tone="purple" size="sm" />
            <h2 className="text-[0.9375rem] font-semibold text-ink">
              {klass.presentToday} of {roster.length} in school today
            </h2>
          </div>
          <Meter value={klass.presentToday} max={roster.length} tone="purple" />
          <p className="mt-3 text-[0.8125rem] text-ink-mute">
            Totals only, so no family is put on display.
          </p>
        </CardPad>
      </Card>

      <Sheet open={!!open} onClose={() => setOpen(null)} title={open?.name ?? ''}>
        {open ? (
          <div>
            <div className="flex items-center gap-3.5">
              <Avatar name={open.name} size="lg" tone={open.ward ? 'orange' : undefined} />
              <div>
                <Chip tone={open.badge ? 'purple' : 'plain'} icon={open.badge ? Award : undefined}>
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
              <p className="mt-4 rounded-2xl bg-tint-orange px-4 py-3 text-[0.875rem] leading-relaxed text-ink">
                This is your own child. Their marks, attendance and fees have their own screens.
              </p>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-2">
              <Chip tone="green">Best: {open.best}</Chip>
              <Chip tone="plain">{klass.formTeacher.name}</Chip>
            </div>

            <a
              href={`tel:${klass.formTeacher.phone.replace(/\s/g, '')}`}
              className="mt-4 inline-flex min-h-[2.75rem] items-center gap-2 rounded-full bg-gold px-4 text-[0.75rem] font-semibold text-ink"
            >
              <Phone size={14} aria-hidden="true" /> Ask the form teacher
            </a>
          </div>
        ) : null}
      </Sheet>
    </div>
  );
}

export default ClassListScreen;
