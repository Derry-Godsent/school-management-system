import { Link } from 'react-router-dom';
import { ArrowRight, Bell, CheckCircle2, Clock, Phone, Users, XCircle } from 'lucide-react';
import { school, formatCurrency, getGrade } from '../../../data';
import { formatDate, noticesFor, pendingWork } from '../../../data/portal';
import { useWard } from '../PortalShell';
import { Avatar, Card, CardBody, CardHead, Chip, IconBadge, Led, Row, StatTile, gradeNote } from '../ui';

export function HomeScreen() {
  const {
    guardian, child, profile, klass, average, standing, fees, attendance, best, weakest, roster,
  } = useWard();

  if (!child || !profile || !klass) return null;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const due = pendingWork(child.id);
  const latest = noticesFor(profile.classId).slice(0, 2);
  const grade = getGrade(average);
  const lastEight = profile.attendance.recent.slice(-8);

  return (
    <div className="space-y-4">
      {/* The greeting is one line. The child gets a card, because the child is
          what the whole screen is about. */}
      <p className="px-1 text-[0.8125rem] text-ink-mute">
        {greeting}, {guardian?.name.split(' ').slice(-1)[0]}
      </p>

      {/* ---------------------------------------------------- the child, dark */}
      <Card shape="dark">
        <CardBody>
          <div className="flex items-center gap-4">
            <Avatar name={child.name} size="lg" tone="orange" />
            <div className="min-w-0 flex-1">
              <h1 className="truncate font-display text-xl text-paper sm:text-2xl">{child.name}</h1>
              <p className="mt-1 text-[0.8125rem] text-paper">
                {child.className} · {child.house} House
              </p>
            </div>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-yellow">
              <span className="font-display text-lg font-bold text-ink">{standing.rank}</span>
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-paper pt-4">
            <span className="text-[0.75rem] uppercase tracking-[0.12em] text-yellow">Form teacher</span>
            <span className="text-[0.875rem] font-medium text-paper">{klass.formTeacher.name}</span>
            <a
              href={`tel:${klass.formTeacher.phone.replace(/\s/g, '')}`}
              className="ml-auto inline-flex items-center gap-1.5 bg-yellow px-3 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-ink"
            >
              <Phone size={13} aria-hidden="true" /> Call
            </a>
          </div>
        </CardBody>
      </Card>

      {/* ---------------------------------------------------- four coloured numbers */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Average" value={average.toFixed(1)} note={grade.remark} tone="purple" />
        <StatTile label="Position" value={`${standing.rank}/${standing.size}`} note="In the class" tone="green" />
        <StatTile label="Attendance" value={`${attendance}%`} note={`${profile.attendance.daysOpen} days open`} tone="orange" />
        <StatTile
          label="Fees"
          value={fees.balance === 0 ? 'Clear' : formatCurrency(fees.balance).replace('GHS ', '')}
          note={fees.balance === 0 ? 'Nothing owing' : `Due ${formatDate(profile.fees.nextDue.date)}`}
          tone={fees.balance === 0 ? 'plain' : 'yellow'}
        />
      </div>

      {/* ---------------------------------------------------- best and weakest */}
      <div className="grid gap-4 sm:grid-cols-2">
        {best ? (
          <Card tone="green" shape="left">
            <CardBody tight>
              <p className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-green-deep">Best subject</p>
              <p className="mt-1.5 font-display text-xl text-ink">
                {best.subject} <span className="text-green-deep">{best.score}</span>
              </p>
              <p className="mt-1 text-[0.8125rem] text-ink-mute">
                Position {best.position} · class average {best.classAverage}
              </p>
            </CardBody>
          </Card>
        ) : null}
        {weakest && weakest.subject !== best?.subject ? (
          <Card tone="orange" shape="left">
            <CardBody tight>
              <p className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-gold-deep">Work on this</p>
              <p className="mt-1.5 font-display text-xl text-ink">
                {weakest.subject} <span className="text-gold-deep">{weakest.score}</span>
              </p>
              <p className="mt-1 text-[0.8125rem] text-ink-mute">
                Position {weakest.position} · class average {weakest.classAverage}
              </p>
            </CardBody>
          </Card>
        ) : null}
      </div>

      {/* ---------------------------------------------------- attendance strip */}
      <Card shape="top" tone="green">
        <CardBody>
          <CardHead
            eyebrow="Attendance"
            title={`${attendance}% this term`}
            action={
              <Link
                to="/parent/attendance"
                className="inline-flex items-center gap-1.5 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-green-deep"
              >
                All <ArrowRight size={13} aria-hidden="true" />
              </Link>
            }
          />
          <div className="flex flex-wrap gap-1.5">
            {lastEight.map(day => {
              const look =
                day.status === 'present'
                  ? { cls: 'bg-green text-ink', icon: <CheckCircle2 size={13} aria-hidden="true" /> }
                  : day.status === 'late'
                    ? { cls: 'bg-yellow text-ink', icon: <Clock size={13} aria-hidden="true" /> }
                    : { cls: 'bg-ink text-yellow', icon: <XCircle size={13} aria-hidden="true" /> };
              return (
                <span
                  key={day.date}
                  className={`flex items-center gap-1 rounded-md px-2 py-1 text-[0.6875rem] font-medium ${look.cls}`}
                >
                  {look.icon}
                  {formatDate(day.date).replace(/^[A-Za-z]+,?\s/, '')}
                </span>
              );
            })}
          </div>
          <p className="mt-3 text-[0.8125rem] text-ink-mute">
            {profile.attendance.present} present · {profile.attendance.late} late · {profile.attendance.absent} absent
          </p>
        </CardBody>
      </Card>

      {/* ---------------------------------------------------- today, and what is due */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card shape="top">
          <CardBody>
            <CardHead
              eyebrow="Today"
              title={klass.name}
              action={<span className="text-[0.75rem] text-ink-mute">{klass.presentToday} of {roster.length} in</span>}
            />
            <ol className="space-y-2.5">
              {klass.todayLessons.map(lesson => (
                <li key={lesson.time} className="flex items-center gap-3">
                  <span className="flex h-9 w-11 shrink-0 items-center justify-center rounded-lg bg-cream font-display text-[0.8125rem] text-gold-deep">
                    {lesson.time}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[0.875rem] font-medium text-ink">{lesson.subject}</span>
                    <span className="block truncate text-[0.75rem] text-ink-mute">{lesson.teacher}</span>
                  </span>
                </li>
              ))}
            </ol>
          </CardBody>
        </Card>

        <Card shape="top" tone="purple">
          <CardBody>
            <CardHead
              eyebrow="Work due"
              title={due.length ? `${due.length} pieces coming up` : 'Nothing outstanding'}
              action={
                <Link
                  to="/parent/results"
                  className="inline-flex items-center gap-1.5 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-purple-deep"
                >
                  Grades <ArrowRight size={13} aria-hidden="true" />
                </Link>
              }
            />
            {due.length ? (
              <ul className="space-y-2.5">
                {due.map(work => (
                  <li key={work.title} className="flex items-start justify-between gap-3">
                    <span className="min-w-0">
                      <span className="block truncate text-[0.875rem] font-medium text-ink">{work.title}</span>
                      <span className="block text-[0.75rem] text-ink-mute">{work.subject}</span>
                    </span>
                    <Chip tone="purple">{formatDate(work.date)}</Chip>
                  </li>
                ))}
              </ul>
            ) : (
              <Led>Every piece has been handed in.</Led>
            )}
          </CardBody>
        </Card>
      </div>

      {/* ---------------------------------------------------- the class, in one card */}
      <Card shape="top" tone="green">
        <CardBody>
          <CardHead
            eyebrow="The class"
            title={`${klass.name} · ${roster.length} pupils`}
            action={
              <Link
                to="/parent/class"
                className="inline-flex items-center gap-2 rounded-lg bg-green px-3 py-2 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-ink"
              >
                <Users size={14} aria-hidden="true" /> Class list
              </Link>
            }
          />
          <div className="flex items-center gap-2.5">
            <span className="flex -space-x-2">
              {roster.slice(0, 5).map(entry => (
                <span key={entry.id} className="ring-2 ring-paper">
                  <Avatar name={entry.name} size="sm" />
                </span>
              ))}
            </span>
            <p className="text-[0.8125rem] text-ink-mute">
              {roster.filter(entry => entry.badge).length} pupils hold a class duty
            </p>
          </div>
        </CardBody>
      </Card>

      {/* ---------------------------------------------------- notices */}
      <Card shape="top">
        <CardBody>
          <CardHead
            eyebrow="From the school"
            title="Latest notices"
            action={
              <Link
                to="/parent/announcements"
                className="inline-flex items-center gap-1.5 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-gold-deep"
              >
                All <ArrowRight size={13} aria-hidden="true" />
              </Link>
            }
          />
          <ul className="space-y-3">
            {latest.map(notice => (
              <li key={notice.id} className="flex gap-3">
                <span className="mt-0.5">
                  <IconBadge icon={Bell} tone={notice.audience === 'Fees' ? 'yellow' : notice.audience === 'Class' ? 'green' : 'orange'} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.875rem] font-medium text-ink">{notice.title}</span>
                  <span className="mt-0.5 block text-[0.75rem] text-ink-mute">
                    {notice.audience} · {formatDate(notice.date)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      {/* ---------------------------------------------------- the teacher, in their words */}
      <Card shape="left" tone="orange">
        <CardBody>
          <CardHead eyebrow="Form teacher's remark" />
          <p className="text-[0.9375rem] leading-relaxed text-ink">{profile.remark.form}</p>
          <p className="mt-3 text-[0.75rem] text-ink-mute">{klass.formTeacher.name}</p>
        </CardBody>
      </Card>

      {/* One quiet card at the end: the school, and the way back to the site. */}
      <Card shape="bare">
        <CardBody>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a href={`tel:${school.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-ink">
              <Phone size={13} aria-hidden="true" /> School office
            </a>
            <Link to="/" className="text-[0.8125rem] font-medium text-ink">
              School website
            </Link>
            <Link to="/parent/profile" className="ml-auto text-[0.8125rem] font-medium text-gold-deep">
              Account
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default HomeScreen;
