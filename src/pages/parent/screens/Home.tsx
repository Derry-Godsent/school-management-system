import { Link } from 'react-router-dom';
import {
  ArrowRight, Bell, CalendarCheck, CheckCircle2, Clock, Mail, MapPin, Phone, Users, Wallet, XCircle,
} from 'lucide-react';
import { school } from '../../../data';
import { formatCurrency, getGrade } from '../../../data';
import { formatDate, noticesFor, pendingWork } from '../../../data/portal';
import { useWard } from '../PortalShell';
import { Avatar, Badge, Callout, Eyebrow, SectionHead, Stat, gradeNote } from '../ui';

/**
 * Home: the screen a parent opens.
 *
 * Ordered by what a parent actually wants to know, not by what the school wants
 * to publish. The child first, then how the term is going, then the two things
 * that need attention, then the day ahead, then the money and the notices.
 */
export function HomeScreen() {
  const {
    guardian, child, profile, klass, average, standing, fees, attendance, best, weakest, roster,
  } = useWard();

  if (!child || !profile || !klass) return null;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const grade = getGrade(average);
  const due = pendingWork(child.id);
  const latest = noticesFor(profile.classId).slice(0, 2);
  const presentToday = klass.presentToday;

  return (
    <div className="space-y-10">
      {/* ------------------------------------------------------------ who */}
      <section>
        <p className="text-[0.8125rem] text-ink-mute">{greeting},</p>
        <h1 className="mt-0.5 font-display text-2xl text-ink sm:text-3xl">{guardian?.name}</h1>

        <div className="mt-5 flex items-start gap-4 bg-paper px-4 py-5 sm:px-5">
          <Avatar name={child.name} size="xl" tone="orange" />
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-xl text-ink sm:text-2xl">{child.name}</h2>
            <p className="mt-1 text-[0.875rem] text-ink-mute">
              {child.className} · {child.house} House · {child.studentId}
            </p>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-mute">
              {child.gender}, born {formatDate(child.dob)} · {child.programme}
            </p>
            <div className="mt-4 space-y-2 border-t border-rule pt-3">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <span className="text-[0.8125rem] text-ink-mute">Form teacher</span>
                <span className="text-[0.875rem] font-medium text-ink">{klass.formTeacher.name}</span>
                <a
                  href={`tel:${klass.formTeacher.phone.replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-gold-deep"
                >
                  <Phone size={13} aria-hidden="true" /> Call
                </a>
                <a
                  href={`mailto:${klass.formTeacher.email}`}
                  className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-gold-deep"
                >
                  <Mail size={13} aria-hidden="true" /> Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------- how the term is going */}
      <section>
        <SectionHead eyebrow="This term" title="Where your child stands" note="Second Term, 2025/2026. Read from the marks as the teachers enter them." />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="Term average" value={average.toFixed(1)} note={gradeNote(average)} tone="green" />
          <Stat
            label="Position in class"
            value={`${standing.rank} of ${standing.size}`}
            note={standing.rank <= 3 ? 'Among the top three' : 'Out of the whole class'}
            tone="purple"
          />
          <Stat label="Attendance" value={`${attendance}%`} note={`${profile.attendance.daysOpen} days school opened`} tone="orange" />
          <Stat
            label="Fees balance"
            value={fees.balance === 0 ? 'All clear' : formatCurrency(fees.balance)}
            note={fees.balance === 0 ? 'Nothing owing this term' : `Due ${formatDate(profile.fees.nextDue.date)}`}
            tone={fees.balance === 0 ? 'plain' : 'yellow'}
          />
        </div>
      </section>

      {/* ------------------------------------------------- what to celebrate, what to fix */}
      <section className="grid gap-4 sm:grid-cols-2">
        {best ? (
          <Callout tone="green" title="Best performing subject">
            <p className="font-display text-xl text-ink">
              {best.subject} <span className="text-green-deep">{best.score}</span>
            </p>
            <p className="mt-1.5 text-[0.875rem] leading-relaxed text-ink-mute">
              {best.position === 1
                ? `Top of the class in this subject. Taught by ${best.teacher}.`
                : `Position ${best.position} in the class, against a class average of ${best.classAverage}. Taught by ${best.teacher}.`}
            </p>
          </Callout>
        ) : null}
        {weakest && weakest.subject !== best?.subject ? (
          <Callout tone="orange" title="Needs attention">
            <p className="font-display text-xl text-ink">
              {weakest.subject} <span className="text-gold-deep">{weakest.score}</span>
            </p>
            <p className="mt-1.5 text-[0.875rem] leading-relaxed text-ink-mute">
              Position {weakest.position} in the class, against a class average of {weakest.classAverage}.
              Taught by {weakest.teacher}.{' '}
              {weakest.score < weakest.classAverage
                ? 'This is below the class average, so it is worth a word with the teacher.'
                : 'Still above the class average, so there is no cause for alarm.'}
            </p>
          </Callout>
        ) : null}
      </section>

      {/* ------------------------------------------------- today at school */}
      <section>
        <SectionHead
          eyebrow="Today at school"
          title={`${klass.name} timetable`}
          note={`${klass.room}. ${presentToday} of ${roster.length} pupils are in school today.`}
        />
        <ol className="bg-paper">
          {klass.todayLessons.map(lesson => (
            <li key={lesson.time} className="flex items-start gap-4 border-b border-rule px-4 py-3 last:border-b-0">
              <span className="w-12 shrink-0 font-display text-[0.9375rem] text-gold-deep">{lesson.time}</span>
              <span className="min-w-0">
                <span className="block text-[0.875rem] font-medium text-ink">{lesson.subject}</span>
                <span className="block text-[0.8125rem] text-ink-mute">
                  {lesson.teacher} · {lesson.room}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* ------------------------------------------------- attendance strip */}
      <section className="bg-paper px-4 py-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Eyebrow tone="orange">Attendance</Eyebrow>
            <p className="mt-2 font-display text-2xl text-ink">
              {attendance}% <span className="text-[0.9375rem] font-normal text-ink-mute">this term</span>
            </p>
          </div>
          <Link
            to="/parent/attendance"
            className="inline-flex items-center gap-2 text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-gold-deep"
          >
            Full record <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {profile.attendance.recent.slice(-8).map(day => {
            const look =
              day.status === 'present'
                ? { cls: 'bg-tint-green text-green-deep', mark: <CheckCircle2 size={14} aria-hidden="true" /> }
                : day.status === 'late'
                  ? { cls: 'bg-tint-yellow text-yellow-deep', mark: <Clock size={14} aria-hidden="true" /> }
                  : { cls: 'bg-ink text-yellow', mark: <XCircle size={14} aria-hidden="true" /> };
            return (
              <span key={day.date} className={`flex items-center gap-1.5 px-2 py-1 text-[0.6875rem] font-medium ${look.cls}`}>
                {look.mark}
                {formatDate(day.date).replace(/^[A-Za-z]+,?\s/, '')}
              </span>
            );
          })}
        </div>
        <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink-mute">
          Present {profile.attendance.present} days, late {profile.attendance.late}, absent {profile.attendance.absent}.
        </p>
      </section>

      {/* ------------------------------------------------- work due, and the class */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="bg-paper px-4 py-5">
          <Eyebrow tone="purple">Work due</Eyebrow>
          {due.length ? (
            <ul className="mt-3 space-y-3">
              {due.map(work => (
                <li key={work.title} className="border-b border-rule pb-3 last:border-b-0 last:pb-0">
                  <p className="text-[0.875rem] font-medium text-ink">{work.title}</p>
                  <p className="mt-0.5 text-[0.8125rem] text-ink-mute">
                    {work.subject} · {work.type} · out of {work.outOf} · due {formatDate(work.date)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-[0.875rem] text-ink-mute">Nothing outstanding.</p>
          )}
          <Link
            to="/parent/results"
            className="mt-4 inline-flex items-center gap-2 text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-purple-deep"
          >
            All marks and work <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>

        <div className="bg-paper px-4 py-5">
          <Eyebrow tone="green">The class</Eyebrow>
          <p className="mt-2 font-display text-xl text-ink">
            {klass.name} <span className="text-[0.9375rem] font-normal text-ink-mute">{roster.length} pupils</span>
          </p>
          <p className="mt-1.5 text-[0.875rem] leading-relaxed text-ink-mute">
            Form teacher {klass.formTeacher.name}. Class attendance this term is {klass.termAttendance}%.
          </p>
          <div className="mt-3 flex items-center gap-2">
            {roster
              .filter(entry => entry.badge && entry.rank <= 6)
              .slice(0, 4)
              .map(entry => (
                <Avatar key={entry.id} name={entry.name} size="sm" />
              ))}
            <span className="text-[0.8125rem] text-ink-mute">
              {roster.filter(entry => entry.badge).length} pupils hold a duty in the class
            </span>
          </div>
          <Link
            to="/parent/class"
            className="mt-4 inline-flex items-center gap-2 text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-green-deep"
          >
            See the class list <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* ------------------------------------------------- notices */}
      <section>
        <SectionHead
          eyebrow="From the school"
          title="Latest notices"
          action={
            <Link
              to="/parent/announcements"
              className="inline-flex items-center gap-2 text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-gold-deep"
            >
              All notices <ArrowRight size={14} aria-hidden="true" />
            </Link>
          }
        />
        <ul className="space-y-3">
          {latest.map(notice => (
            <li key={notice.id} className="bg-paper px-4 py-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={notice.audience === 'Fees' ? 'yellow' : notice.audience === 'Class' ? 'green' : 'orange'}>
                  {notice.audience}
                </Badge>
                {notice.pinned ? <Badge tone="purple">Pinned</Badge> : null}
                <span className="text-[0.75rem] text-ink-mute">{formatDate(notice.date)}</span>
              </div>
              <p className="mt-2 font-display text-[1.0625rem] text-ink">{notice.title}</p>
              <p className="mt-1.5 line-clamp-2 text-[0.875rem] leading-relaxed text-ink-mute">{notice.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------------- the school itself */}
      <section className="bg-ink px-4 py-5 sm:px-5">
        <Eyebrow tone="yellow">The school</Eyebrow>
        <p className="mt-2 font-display text-xl text-paper">{school.name}</p>
        <p className="mt-1.5 text-[0.875rem] leading-relaxed text-paper">{school.motto}</p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          <a
            href={`tel:${school.phone.replace(/\s/g, '')}`}
            className="inline-flex items-center gap-2 text-[0.875rem] font-medium text-paper"
          >
            <Phone size={15} aria-hidden="true" /> {school.phone}
          </a>
          <a href={`mailto:${school.email}`} className="inline-flex items-center gap-2 text-[0.875rem] font-medium text-paper">
            <Mail size={15} aria-hidden="true" /> {school.email}
          </a>
          <span className="inline-flex items-center gap-2 text-[0.875rem] text-paper">
            <MapPin size={15} aria-hidden="true" /> {school.address}
          </span>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/" className="bg-gold px-4 py-2.5 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-ink">
            School website
          </Link>
          <Link
            to="/parent/class"
            className="inline-flex items-center gap-2 border border-paper px-4 py-2.5 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-paper"
          >
            <Users size={14} aria-hidden="true" /> Class list
          </Link>
          <Link
            to="/parent/attendance"
            className="inline-flex items-center gap-2 border border-paper px-4 py-2.5 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-paper"
          >
            <CalendarCheck size={14} aria-hidden="true" /> Attendance
          </Link>
          <Link
            to="/parent/fees"
            className="inline-flex items-center gap-2 border border-paper px-4 py-2.5 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-paper"
          >
            <Wallet size={14} aria-hidden="true" /> Fees
          </Link>
          <Link
            to="/parent/announcements"
            className="inline-flex items-center gap-2 border border-paper px-4 py-2.5 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-paper"
          >
            <Bell size={14} aria-hidden="true" /> Notices
          </Link>
        </div>
      </section>

      {/* The form teacher's remark, which is the one thing a parent reads twice. */}
      <section>
        <SectionHead eyebrow="From the form teacher" title="This term's remark" />
        <blockquote className="border-l-4 border-gold-deep bg-paper px-4 py-4">
          <p className="text-[0.9375rem] leading-relaxed text-ink">{profile.remark.form}</p>
          <footer className="mt-3 text-[0.8125rem] text-ink-mute">
            {klass.formTeacher.name}, form teacher of {klass.name}
          </footer>
        </blockquote>
        <div className="mt-4 bg-paper px-4 py-4">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-ink-mute">
            Term by term
          </p>
          <ol className="mt-3 space-y-2.5">
            {profile.reports.map(report => (
              <li key={report.term} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-rule pb-2.5 last:border-b-0 last:pb-0">
                <span className="text-[0.875rem] text-ink">{report.term}</span>
                <span className="text-[0.875rem] font-medium text-ink">
                  {report.average.toFixed(1)} average, {report.position} of {report.size}
                </span>
              </li>
            ))}
          </ol>
        </div>
        <blockquote className="mt-4 border-l-4 border-purple-deep bg-paper px-4 py-4">
          <p className="text-[0.9375rem] leading-relaxed text-ink">{profile.remark.head}</p>
          <footer className="mt-3 text-[0.8125rem] text-ink-mute">The head teacher</footer>
        </blockquote>
      </section>
    </div>
  );
}

export default HomeScreen;
