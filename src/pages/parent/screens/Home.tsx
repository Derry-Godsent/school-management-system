import { Link } from 'react-router-dom';
import {
  ArrowRight, Bell, CalendarCheck, CheckCircle2, Clock, GraduationCap, Phone, TrendingUp, Users,
  Wallet, XCircle,
} from 'lucide-react';
import { formatCurrency, getGrade } from '../../../data';
import { formatDate, noticesFor, pendingWork } from '../../../data/portal';
import { asParentNotice, useLive } from '../../../data/live';
import { useWard } from '../PortalShell';
import {
  ActionTile, Avatar, Card, CardPad, Chip, IconChip, Meter, Row, Rule, ScreenTitle, StatCard, gradeNote,
} from '../ui';

/**
 * Home: an app home screen, not a report.
 *
 * The order is the order a parent wants things: who this is about, then the
 * shortcuts to everywhere else, then the four figures, then what to celebrate,
 * then what is due, then the day, then the notices.
 *
 * Every card is white on the soft ground and every colour arrives in a small
 * dose: a tinted icon, a chip, a bar.
 */
export function HomeScreen() {
  const {
    guardian, child, profile, klass, average, standing, fees, attendance, best, weakest, roster,
  } = useWard();

  if (!child || !profile || !klass) return null;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const due = pendingWork(child.id);
  const { sent } = useLive();
  const latest = [
    ...sent.map(asParentNotice).filter(notice => !notice.classId || notice.classId === profile.classId),
    ...noticesFor(profile.classId),
  ].slice(0, 2);
  const grade = getGrade(average);
  const lastEight = profile.attendance.recent.slice(-8);
  const nextLesson = klass.todayLessons[0];

  return (
    <div className="space-y-5">
      <ScreenTitle
        title={`${greeting}, ${guardian?.name.split(' ').slice(-1)[0]}`}
        sub={`${child.name} is in ${klass.name} with ${klass.formTeacher.name.split(' ').slice(-1)[0]}`}
      />

      {/* ------------------------------------------------- the child, one soft card */}
      <Card variant="tint" tone="orange">
        <CardPad>
          <div className="flex items-center gap-3.5">
            <Avatar name={child.name} size="md" tone="orange" />
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-[1.0625rem] font-semibold text-ink">{child.name}</h2>
              <p className="mt-0.5 truncate text-[0.8125rem] text-ink-mute">
                {child.className} · {child.house} House
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-center rounded-2xl bg-paper px-3 py-2">
              <span className="text-[1.25rem] font-semibold leading-none tabular-nums text-gold-deep">
                {average.toFixed(1)}
              </span>
              <span className="mt-1 text-[0.625rem] font-medium uppercase tracking-[0.08em] text-ink-mute">
                Average
              </span>
            </div>
          </div>

          <div className="mt-3.5 flex flex-wrap gap-2">
            <Chip tone="green" icon={TrendingUp}>
              {standing.rank} of {standing.size} in class
            </Chip>
            <Chip tone="plain">{grade.remark}</Chip>
          </div>
        </CardPad>
      </Card>

      {/* ------------------------------------------------- the shortcut grid */}
      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
        <ActionTile to="/parent/results" icon={GraduationCap} label="Grades" tone="purple" />
        <ActionTile to="/parent/attendance" icon={CalendarCheck} label="Attendance" tone="green" />
        <ActionTile to="/parent/fees" icon={Wallet} label="Fees" tone="yellow" />
        <ActionTile to="/parent/class" icon={Users} label="Class" tone="green" />
        <ActionTile to="/parent/announcements" icon={Bell} label="Notices" tone="orange" badge={latest.length} />
        <ActionTile to="/parent/profile" icon={Phone} label="Contact" tone="plain" />
      </div>

      {/* ------------------------------------------------- the four figures */}
      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <StatCard icon={GraduationCap} label="Average" value={average.toFixed(1)} note={gradeNote(average)} tone="purple" />
        <StatCard icon={TrendingUp} label="Position" value={`${standing.rank}/${standing.size}`} note="In the class" tone="green" />
        <StatCard icon={CalendarCheck} label="Attendance" value={`${attendance}%`} note={`${profile.attendance.daysOpen} days open`} tone="orange" />
        <StatCard
          icon={Wallet}
          label="Balance"
          value={fees.balance === 0 ? '0' : formatCurrency(fees.balance).replace('GHS ', '')}
          note={fees.balance === 0 ? 'Fees all clear' : `Due ${formatDate(profile.fees.nextDue.date)}`}
          tone="yellow"
        />
      </div>

      {/* ------------------------------------------------- best and to work on */}
      <div className="grid gap-3 sm:grid-cols-2">
        {best ? (
          <Card>
            <CardPad>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Chip tone="green">Best subject</Chip>
                  <p className="mt-2 truncate text-[0.9375rem] font-medium text-ink">{best.subject}</p>
                  <p className="mt-0.5 text-[0.75rem] text-ink-mute">
                    Position {best.position} · class {best.classAverage}
                  </p>
                </div>
                <span className="shrink-0 text-[1.75rem] font-semibold leading-none tabular-nums text-green-deep">
                  {best.score}
                </span>
              </div>
              <div className="mt-3">
                <Meter value={best.score} tone="green" />
              </div>
            </CardPad>
          </Card>
        ) : null}

        {weakest && weakest.subject !== best?.subject ? (
          <Card>
            <CardPad>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Chip tone="orange">Needs work</Chip>
                  <p className="mt-2 truncate text-[0.9375rem] font-medium text-ink">{weakest.subject}</p>
                  <p className="mt-0.5 text-[0.75rem] text-ink-mute">
                    Position {weakest.position} · class {weakest.classAverage}
                  </p>
                </div>
                <span className="shrink-0 text-[1.75rem] font-semibold leading-none tabular-nums text-gold-deep">
                  {weakest.score}
                </span>
              </div>
              <div className="mt-3">
                <Meter value={weakest.score} tone="orange" />
              </div>
            </CardPad>
          </Card>
        ) : null}
      </div>

      {/* ------------------------------------------------- today */}
      <Card>
        <CardPad>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <IconChip icon={Clock} tone="orange" size="sm" />
              <h2 className="text-[0.9375rem] font-semibold text-ink">Today</h2>
            </div>
            <span className="text-[0.75rem] text-ink-mute">
              {klass.presentToday} of {roster.length} in school
            </span>
          </div>
          {nextLesson ? (
            <div className="rounded-2xl bg-tint-orange px-3.5 py-3">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-gold-deep">
                Next up · {nextLesson.time}
              </p>
              <p className="mt-1 text-[0.9375rem] font-medium text-ink">{nextLesson.subject}</p>
              <p className="mt-0.5 text-[0.75rem] text-ink-mute">
                {nextLesson.teacher} · {nextLesson.room}
              </p>
            </div>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-2">
            {klass.todayLessons.slice(1).map(lesson => (
              <Chip key={lesson.time} tone="plain">
                {lesson.time} {lesson.subject}
              </Chip>
            ))}
          </div>
        </CardPad>
      </Card>

      {/* ------------------------------------------------- what is due */}
      <Card>
        <CardPad>
          <div className="mb-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <IconChip icon={GraduationCap} tone="purple" size="sm" />
              <h2 className="text-[0.9375rem] font-semibold text-ink">
                {due.length ? `${due.length} pieces due` : 'Nothing due'}
              </h2>
            </div>
            <Link to="/parent/results" className="-my-3.5 inline-flex min-h-[2.75rem] items-center text-[0.75rem] font-semibold text-purple-deep">
              Grades
            </Link>
          </div>
          {due.length ? (
            <div className="-mx-4 mt-1">
              {due.map((work, index) => (
                <div key={work.title}>
                  {index > 0 ? <Rule /> : null}
                  <Row
                    icon={Clock}
                    tone="purple"
                    title={work.title}
                    sub={`${work.subject} · out of ${work.outOf}`}
                    trailing={<Chip tone="purple">{formatDate(work.date)}</Chip>}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[0.8125rem] text-ink-mute">Every piece has been handed in.</p>
          )}
        </CardPad>
      </Card>

      {/* ------------------------------------------------- attendance strip */}
      <Card>
        <CardPad>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <IconChip icon={CalendarCheck} tone="green" size="sm" />
              <h2 className="text-[0.9375rem] font-semibold text-ink">Attendance</h2>
            </div>
            <Link to="/parent/attendance" className="-my-3.5 inline-flex min-h-[2.75rem] items-center text-[0.75rem] font-semibold text-green-deep">
              All
            </Link>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {lastEight.map(day => {
              const look =
                day.status === 'present'
                  ? { cls: 'bg-tint-green text-green-deep', icon: <CheckCircle2 size={12} aria-hidden="true" /> }
                  : day.status === 'late'
                    ? { cls: 'bg-tint-yellow text-yellow-deep', icon: <Clock size={12} aria-hidden="true" /> }
                    : { cls: 'bg-tint-orange text-gold-deep', icon: <XCircle size={12} aria-hidden="true" /> };
              const [, dayNumber] = formatDate(day.date).split(', ');
              return (
                <span
                  key={day.date}
                  className={`flex items-center gap-1 rounded-full px-2 py-1 text-[0.6875rem] font-medium ${look.cls}`}
                >
                  {look.icon}
                  {dayNumber ?? day.date}
                </span>
              );
            })}
          </div>
          <p className="mt-3 text-[0.75rem] text-ink-mute">
            {profile.attendance.present} present · {profile.attendance.late} late · {profile.attendance.absent} absent
          </p>
        </CardPad>
      </Card>

      {/* ------------------------------------------------- the class */}
      <Card>
        <CardPad>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <IconChip icon={Users} tone="green" size="sm" />
              <h2 className="text-[0.9375rem] font-semibold text-ink">
                {klass.name} · {roster.length} pupils
              </h2>
            </div>
            <Link to="/parent/class" className="-my-3.5 inline-flex min-h-[2.75rem] items-center text-[0.75rem] font-semibold text-green-deep">
              Class list
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex -space-x-2">
              {roster.slice(0, 5).map(entry => (
                <span key={entry.id} className="rounded-full ring-2 ring-paper">
                  <Avatar name={entry.name} size="sm" />
                </span>
              ))}
            </span>
            <p className="text-[0.75rem] text-ink-mute">
              {roster.filter(entry => entry.badge).length} hold a duty, from class prefect to sports captain
            </p>
          </div>
        </CardPad>
      </Card>

      {/* ------------------------------------------------- notices */}
      <Card>
        <CardPad>
          <div className="mb-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <IconChip icon={Bell} tone="orange" size="sm" />
              <h2 className="text-[0.9375rem] font-semibold text-ink">Latest notices</h2>
            </div>
            <Link to="/parent/announcements" className="-my-3.5 inline-flex min-h-[2.75rem] items-center gap-1 text-[0.75rem] font-semibold text-gold-deep">
              All <ArrowRight size={12} aria-hidden="true" />
            </Link>
          </div>
          <div className="-mx-4 mt-1">
            {latest.map((notice, index) => (
              <div key={notice.id}>
                {index > 0 ? <Rule /> : null}
                <Row
                  icon={Bell}
                  tone={notice.audience === 'Fees' ? 'yellow' : notice.audience === 'Class' ? 'green' : 'orange'}
                  title={notice.title}
                  sub={`${notice.audience} · ${formatDate(notice.date)}`}
                  to="/parent/announcements"
                />
              </div>
            ))}
          </div>
        </CardPad>
      </Card>

      {/* ------------------------------------------------- the teacher speaking */}
      <Card>
        <CardPad>
          <div className="flex items-center gap-2.5">
            <Avatar name={klass.formTeacher.name} size="sm" tone="orange" />
            <div className="min-w-0">
              <p className="truncate text-[0.875rem] font-medium text-ink">{klass.formTeacher.name}</p>
              <p className="text-[0.6875rem] text-ink-mute">Form teacher&apos;s remark</p>
            </div>
          </div>
          <p className="mt-3 text-[0.875rem] leading-relaxed text-ink">{profile.remark.form}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={`tel:${klass.formTeacher.phone.replace(/\s/g, '')}`}
              className="inline-flex min-h-[2.5rem] items-center gap-2 rounded-full bg-gold px-4 text-[0.75rem] font-semibold text-ink"
            >
              <Phone size={14} aria-hidden="true" /> Call the teacher
            </a>
          </div>
        </CardPad>
      </Card>
    </div>
  );
}

export default HomeScreen;
