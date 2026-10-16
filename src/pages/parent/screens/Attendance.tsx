import { CheckCircle2, Clock, Phone, XCircle } from 'lucide-react';
import { formatDate, formatLongDate } from '../../../data/portal';
import { useWard } from '../PortalShell';
import { Card, CardBody, CardHead, Chip, Meter, Row, StatTile } from '../ui';

export function AttendanceScreen() {
  const { child, profile, klass, roster, attendance } = useWard();

  if (!child || !profile || !klass) return null;

  const record = profile.attendance;
  const absent = record.recent.filter(day => day.status === 'absent');
  const late = record.recent.filter(day => day.status === 'late');
  const ahead = attendance >= klass.termAttendance;

  return (
    <div className="space-y-4">
      <div className="px-1">
        <h1 className="font-display text-2xl text-ink">Attendance</h1>
        <p className="mt-1 text-[0.8125rem] text-ink-mute">
          {child.name} · {klass.name} · this term
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Rate" value={`${attendance}%`} note={`of ${record.daysOpen} days`} tone="green" />
        <StatTile label="Present" value={record.present} note={`${record.late} arrived late`} tone="orange" />
        <StatTile
          label="Absent"
          value={record.absent}
          note={record.absent === 0 ? 'Not a day missed' : 'See below'}
          tone={record.absent > 2 ? 'yellow' : 'plain'}
        />
        <StatTile label="Class rate" value={`${klass.termAttendance}%`} note={klass.name} tone="purple" />
      </div>

      {/* Against the class, as one card with two meters. */}
      <Card shape="top" tone="green">
        <CardBody>
          <CardHead eyebrow="Against the class" title={ahead ? 'Above the class average' : 'Below the class average'} />
          <div className="space-y-3">
            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-[0.875rem] font-medium text-ink">{child.name.split(' ')[0]}</span>
                <span className="font-display text-lg text-ink">{attendance}%</span>
              </div>
              <div className="mt-1.5">
                <Meter value={attendance} tone="green" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-[0.875rem] text-ink-mute">Class average</span>
                <span className="font-display text-lg text-ink-mute">{klass.termAttendance}%</span>
              </div>
              <div className="mt-1.5">
                <Meter value={klass.termAttendance} tone="plain" />
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* The day by day record, as coloured tiles. */}
      <Card shape="top">
        <CardBody>
          <CardHead eyebrow="The record" title="Last twelve school days" />
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {[...record.recent].reverse().map(day => {
              const look =
                day.status === 'present'
                  ? { bg: 'bg-green', text: 'text-ink', icon: <CheckCircle2 size={15} aria-hidden="true" />, word: 'Present' }
                  : day.status === 'late'
                    ? { bg: 'bg-yellow', text: 'text-ink', icon: <Clock size={15} aria-hidden="true" />, word: 'Late' }
                    : { bg: 'bg-ink', text: 'text-yellow', icon: <XCircle size={15} aria-hidden="true" />, word: 'Absent' };
              return (
                <li key={day.date} className={`rounded-xl ${look.bg} px-3 py-2.5`}>
                  <p className={`text-[0.625rem] font-semibold uppercase tracking-[0.1em] ${look.text}`}>
                    {formatDate(day.date)}
                  </p>
                  <p className={`mt-1.5 flex items-center gap-1.5 text-[0.75rem] font-medium ${look.text}`}>
                    {look.icon}
                    {look.word}
                  </p>
                </li>
              );
            })}
          </ul>
        </CardBody>
      </Card>

      {/* What to do about it, only when there is something to do. */}
      {absent.length || late.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {absent.length ? (
            <Card shape="left" tone="orange">
              <CardBody tight>
                <CardHead eyebrow={`${absent.length} days missed`} />
                <ul className="flex flex-wrap gap-1.5">
                  {absent.map(day => (
                    <li key={day.date}>
                      <Chip tone="orange">{formatDate(day.date)}</Chip>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-[0.8125rem] text-ink-mute">
                  In school on any of these days? Tell the form teacher to correct the register.
                </p>
              </CardBody>
            </Card>
          ) : null}
          {late.length ? (
            <Card shape="left" tone="yellow">
              <CardBody tight>
                <CardHead eyebrow={`${late.length} late arrivals`} />
                <ul className="flex flex-wrap gap-1.5">
                  {late.map(day => (
                    <li key={day.date}>
                      <Chip tone="yellow">{formatDate(day.date)}</Chip>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-[0.8125rem] text-ink-mute">
                  The register closes at 7:45. A pupil who arrives later misses the first lesson.
                </p>
              </CardBody>
            </Card>
          ) : null}
        </div>
      ) : (
        <Card tone="green" shape="left">
          <CardBody tight>
            <CardHead eyebrow="Full attendance" />
            <p className="text-[0.875rem] text-ink">No days missed and no late arrivals this term.</p>
          </CardBody>
        </Card>
      )}

      {/* The class total, and the way to fix a mistake. */}
      <Card shape="top" tone="purple">
        <CardBody>
          <CardHead eyebrow="Class today" title={`${klass.presentToday} of ${roster.length} in school`} />
          <Meter value={klass.presentToday} max={roster.length} tone="purple" />
          <dl className="mt-3">
            <Row label="Class attendance this term">{klass.termAttendance}%</Row>
            <Row label="Form teacher">{klass.formTeacher.name}</Row>
          </dl>
          <p className="mt-3 text-[0.8125rem] text-ink-mute">
            Only totals are shown. Which pupil was away is the school's business.
          </p>
          <a
            href={`tel:${klass.formTeacher.phone.replace(/\s/g, '')}`}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-ink px-3.5 py-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-paper"
          >
            <Phone size={13} aria-hidden="true" /> Correct the record
          </a>
          {absent.length ? (
            <p className="mt-2 text-[0.75rem] text-ink-mute">Last missed: {formatLongDate(absent[absent.length - 1].date)}</p>
          ) : null}
        </CardBody>
      </Card>
    </div>
  );
}

export default AttendanceScreen;
