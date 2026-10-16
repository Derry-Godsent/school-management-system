import { CheckCircle2, Clock, Info, Phone, Users, XCircle } from 'lucide-react';
import { formatDate, formatLongDate } from '../../../data/portal';
import { useWard } from '../PortalShell';
import { Badge, Callout, Eyebrow, Meter, SectionHead, Stat } from '../ui';

/**
 * Attendance.
 *
 * The number that matters to a school is the percentage. The number that
 * matters to a parent is which days were missed and why, so both are here: the
 * rate at the top, the day by day record underneath it.
 */
export function AttendanceScreen() {
  const { child, profile, klass, roster, attendance } = useWard();

  if (!child || !profile || !klass) return null;

  const record = profile.attendance;
  const absent = record.recent.filter(day => day.status === 'absent');
  const late = record.recent.filter(day => day.status === 'late');

  return (
    <div className="space-y-10">
      <section>
        <Eyebrow>Attendance</Eyebrow>
        <h1 className="mt-2 font-display text-2xl text-ink sm:text-3xl">
          {child.name} · {klass.name}
        </h1>
        <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-mute">
          The school has opened {record.daysOpen} days this term. A pupil is counted present when they
          are in school for the day, and late when they arrive after the register is closed at 7:45.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Attendance rate" value={`${attendance}%`} note="Of the days opened" tone="green" />
        <Stat label="Days present" value={record.present} note={`${record.late} of them arrived late`} />
        <Stat label="Days absent" value={record.absent} note={record.absent === 0 ? 'Not one day missed' : 'See the days below'} tone={record.absent > 2 ? 'orange' : 'plain'} />
        <Stat label="Class rate" value={`${klass.termAttendance}%`} note={`${klass.name} this term`} tone="purple" />
      </section>

      <section className="bg-paper px-4 py-5">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-ink-mute">
          {child.name} against the class
        </p>
        <div className="mt-3 space-y-3">
          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-[0.875rem] text-ink">{child.name}</span>
              <span className="font-display text-lg text-ink">{attendance}%</span>
            </div>
            <div className="mt-1.5">
              <Meter value={attendance} tone="green" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-[0.875rem] text-ink-mute">{klass.name} class average</span>
              <span className="font-display text-lg text-ink-mute">{klass.termAttendance}%</span>
            </div>
            <div className="mt-1.5">
              <Meter value={klass.termAttendance} tone="plain" />
            </div>
          </div>
        </div>
        <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink-mute">
          {attendance >= klass.termAttendance
            ? `${child.name} is attending above the class average.`
            : `${child.name} is attending below the class average. Every missed day is a day of lessons to catch up.`}
        </p>
      </section>

      {/* ------------------------------------------------------- the day by day record */}
      <section>
        <SectionHead eyebrow="The record" title="The last twelve school days" />
        <ul className="grid grid-cols-2 gap-px bg-rule sm:grid-cols-3 lg:grid-cols-4">
          {[...record.recent].reverse().map(day => {
            const look =
              day.status === 'present'
                ? { bg: 'bg-tint-green', text: 'text-green-deep', icon: <CheckCircle2 size={16} aria-hidden="true" />, word: 'Present' }
                : day.status === 'late'
                  ? { bg: 'bg-tint-yellow', text: 'text-yellow-deep', icon: <Clock size={16} aria-hidden="true" />, word: 'Late' }
                  : { bg: 'bg-ink', text: 'text-yellow', icon: <XCircle size={16} aria-hidden="true" />, word: 'Absent' };
            return (
              <li key={day.date} className={`${look.bg} px-4 py-3.5`}>
                <p className={`text-[0.6875rem] font-semibold uppercase tracking-[0.12em] ${look.text}`}>
                  {formatDate(day.date)}
                </p>
                <p className="mt-1.5 flex items-center gap-2 text-[0.875rem] font-medium text-ink">
                  {look.icon}
                  {look.word}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ------------------------------------------------------- what to do about it */}
      <section className="grid gap-4 sm:grid-cols-2">
        {absent.length ? (
          <Callout tone="orange" title="Days missed">
            <ul className="space-y-1.5">
              {absent.map(day => (
                <li key={day.date} className="text-[0.875rem] text-ink">
                  {formatLongDate(day.date)}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-mute">
              If your child was in school on any of these days, tell the form teacher so the register
              can be corrected.
            </p>
          </Callout>
        ) : (
          <Callout tone="green" title="Full attendance">
            <p className="text-[0.875rem] leading-relaxed text-ink">
              {child.name} has not missed a day this term. Nothing needs to be corrected.
            </p>
          </Callout>
        )}

        {late.length ? (
          <Callout tone="yellow" title="Late arrivals">
            <ul className="space-y-1.5">
              {late.map(day => (
                <li key={day.date} className="text-[0.875rem] text-ink">
                  {formatLongDate(day.date)}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-mute">
              The register closes at 7:45. Pupils who arrive later lose the first lesson of the day.
            </p>
          </Callout>
        ) : null}
      </section>

      {/* ------------------------------------------------------- class attendance, today */}
      <section>
        <SectionHead
          eyebrow="Class attendance"
          title={`${klass.name} today`}
          note="How many of your child's classmates were in school today."
        />
        <div className="bg-paper px-4 py-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <p className="font-display text-3xl text-ink">
              {klass.presentToday}
              <span className="text-lg font-normal text-ink-mute"> of {roster.length} present</span>
            </p>
            <Badge tone={klass.presentToday / roster.length > 0.9 ? 'green' : 'orange'}>
              {Math.round((klass.presentToday / roster.length) * 100)}% in school
            </Badge>
          </div>
          <div className="mt-3">
            <Meter value={klass.presentToday} max={roster.length} tone="green" />
          </div>
          <p className="mt-3 flex items-start gap-2 text-[0.8125rem] leading-relaxed text-ink-mute">
            <Users size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
            Class attendance is shown as a total only. Which pupil was away is the school's business,
            not the playground's.
          </p>
        </div>
      </section>

      <section className="bg-tint-purple px-4 py-5">
        <Eyebrow tone="purple">Something not right?</Eyebrow>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink">
          If your child was in school and the record says otherwise, the form teacher can put it right
          from the school's own copy.
        </p>
        <a
          href={`tel:${klass.formTeacher.phone.replace(/\s/g, '')}`}
          className="mt-4 inline-flex items-center gap-2 bg-ink px-4 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-paper"
        >
          <Phone size={14} aria-hidden="true" />
          Call {klass.formTeacher.name}
        </a>
        <p className="mt-3 flex items-start gap-2 text-[0.8125rem] leading-relaxed text-ink-mute">
          <Info size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
          The school office keeps a paper register as well as this record. Either can be checked.
        </p>
      </section>
    </div>
  );
}

export default AttendanceScreen;
