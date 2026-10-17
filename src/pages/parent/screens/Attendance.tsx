import { CalendarCheck, CheckCircle2, Clock, Phone, TrendingUp, XCircle } from 'lucide-react';
import { formatDate } from '../../../data/portal';
import { useWard } from '../PortalShell';
import { Card, CardPad, Chip, IconChip, Meter, ScreenTitle, StatCard } from '../ui';

const DAY_LOOK = {
  present: { tint: 'bg-tint-green', ink: 'text-green-deep', label: 'Present' },
  late: { tint: 'bg-tint-yellow', ink: 'text-yellow-deep', label: 'Late' },
  absent: { tint: 'bg-tint-orange', ink: 'text-gold-deep', label: 'Absent' },
} as const;

export function AttendanceScreen() {
  const { child, profile, klass, roster, attendance } = useWard();

  if (!child || !profile || !klass) return null;

  const record = profile.attendance;
  const absent = record.recent.filter(day => day.status === 'absent');
  const late = record.recent.filter(day => day.status === 'late');
  const ahead = attendance >= klass.termAttendance;

  return (
    <div className="space-y-5">
      <ScreenTitle title="Attendance" sub={`${child.name} · ${klass.name} · this term`} />

      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <StatCard icon={CalendarCheck} label="Rate" value={`${attendance}%`} note={`of ${record.daysOpen} days`} tone="green" />
        <StatCard icon={CheckCircle2} label="Present" value={record.present} note={`${record.late} arrived late`} tone="orange" />
        <StatCard
          icon={XCircle}
          label="Absent"
          value={record.absent}
          note={record.absent === 0 ? 'Not a day missed' : 'See below'}
          tone={record.absent > 2 ? 'yellow' : 'plain'}
        />
        <StatCard icon={TrendingUp} label="Class rate" value={`${klass.termAttendance}%`} note={klass.name} tone="purple" />
      </div>

      {/* Against the class. */}
      <Card>
        <CardPad>
          <div className="mb-3 flex items-center gap-2.5">
            <IconChip icon={TrendingUp} tone="green" size="sm" />
            <h2 className="text-[0.9375rem] font-semibold text-ink">
              {ahead ? 'Above the class average' : 'Below the class average'}
            </h2>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-[0.8125rem] font-medium text-ink">{child.name.split(' ')[0]}</span>
                <span className="text-[1.0625rem] font-semibold tabular-nums text-ink">{attendance}%</span>
              </div>
              <div className="mt-1.5">
                <Meter value={attendance} tone="green" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-[0.8125rem] text-ink-mute">Class average</span>
                <span className="text-[1.0625rem] font-semibold tabular-nums text-ink-mute">{klass.termAttendance}%</span>
              </div>
              <div className="mt-1.5">
                <Meter value={klass.termAttendance} tone="plain" />
              </div>
            </div>
          </div>
        </CardPad>
      </Card>

      {/* The day by day record, as soft tiles. */}
      <Card>
        <CardPad>
          <div className="mb-3 flex items-center gap-2.5">
            <IconChip icon={CalendarCheck} tone="green" size="sm" />
            <h2 className="text-[0.9375rem] font-semibold text-ink">Last twelve school days</h2>
          </div>
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {[...record.recent].reverse().map(day => {
              const look = DAY_LOOK[day.status];
              return (
                <li key={day.date} className={`rounded-2xl px-3 py-2.5 ${look.tint}`}>
                  <p className={`text-[0.6875rem] font-semibold ${look.ink}`}>
                    {formatDate(day.date).replace(/^[A-Za-z]{3},?\s/, '')}
                  </p>
                  <p className={`mt-1 text-[0.75rem] font-medium ${look.ink}`}>{look.label}</p>
                </li>
              );
            })}
          </ul>
        </CardPad>
      </Card>

      {/* Only shown when there is something to put right. */}
      {absent.length ? (
        <Card variant="tint" tone="orange">
          <CardPad>
            <div className="flex items-center gap-2.5">
              <IconChip icon={XCircle} tone="orange" size="sm" />
              <h2 className="text-[0.9375rem] font-semibold text-ink">{absent.length} days missed</h2>
            </div>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {absent.map(day => (
                <li key={day.date}>
                  <Chip tone="orange">{formatDate(day.date)}</Chip>
                </li>
              ))}
            </ul>
            <a
              href={`tel:${klass.formTeacher.phone.replace(/\s/g, '')}`}
              className="mt-3 inline-flex min-h-[2.5rem] items-center gap-2 rounded-full bg-gold px-4 text-[0.75rem] font-semibold text-ink"
            >
              <Phone size={14} aria-hidden="true" /> Correct the register
            </a>
          </CardPad>
        </Card>
      ) : null}

      {late.length ? (
        <Card variant="tint" tone="yellow">
          <CardPad>
            <div className="flex items-center gap-2.5">
              <IconChip icon={Clock} tone="yellow" size="sm" />
              <h2 className="text-[0.9375rem] font-semibold text-ink">{late.length} late arrivals</h2>
            </div>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {late.map(day => (
                <li key={day.date}>
                  <Chip tone="yellow">{formatDate(day.date)}</Chip>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[0.8125rem] text-ink-mute">
              The register closes at 7:45, so a late arrival misses the first lesson.
            </p>
          </CardPad>
        </Card>
      ) : null}

      {!absent.length && !late.length ? (
        <Card variant="tint" tone="green">
          <CardPad>
            <div className="flex items-center gap-2.5">
              <IconChip icon={CheckCircle2} tone="green" size="sm" />
              <h2 className="text-[0.9375rem] font-semibold text-ink">Full attendance</h2>
            </div>
            <p className="mt-2 text-[0.8125rem] text-ink">No days missed and no late arrivals this term.</p>
          </CardPad>
        </Card>
      ) : null}

      <Card>
        <CardPad>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <IconChip icon={CalendarCheck} tone="purple" size="sm" />
              <h2 className="text-[0.9375rem] font-semibold text-ink">
                {klass.presentToday} of {roster.length} in school today
              </h2>
            </div>
          </div>
          <Meter value={klass.presentToday} max={roster.length} tone="purple" />
          <p className="mt-3 text-[0.8125rem] text-ink-mute">
            Totals only. Which pupil was away is the school&apos;s business.
          </p>
        </CardPad>
      </Card>
    </div>
  );
}

export default AttendanceScreen;
