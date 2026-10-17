import { Link } from 'react-router-dom';
import {
  ArrowRight, Bell, CalendarCheck, ClipboardList, GraduationCap, Radio, Target, TrendingUp, TrendingDown,
  Users, Wallet,
} from 'lucide-react';
import { formatCurrency } from '../../../data';
import { formatLongDate } from '../../../data/portal';
import {
  DEMO_TODAY, activity, admissionQueue, allNotices, attendanceToday, can, classSummary, classesInScope,
  departmentOf, feePosition, pupilsInScope, readyToPublish, rollSize, scopeFor, tasksFor, termWeeks,
} from '../../../data/admin';
import { useStaffAuth } from '../AuthContext';
import { Bars, Donut, Ring, Sparkline, WeekStrip } from '../charts';
import {
  Avatar, Badge, Button, Card, CardHead, CardPad, Hero, Kpi, LiveBadge, Row, SectionLabel,
} from '../ui';

/**
 * Overview.
 *
 * The first screen after signing in, and the one that decides whether the
 * console feels like a system or like a spreadsheet. It is composed rather than
 * tabulated: a band that says whose console this is and what state the day is
 * in, four figures with their trends drawn beside them, then one picture of the
 * thing this person is judged on.
 *
 * And it is scoped. A form teacher's overview is their class; a subject
 * teacher's is their subject; the office sees the school. Nothing is shown at a
 * size the person cannot act on, because a figure nobody can change is noise.
 */

const TASK_ICON: Record<string, typeof Bell> = {
  communications: Bell,
  academics: GraduationCap,
  admissions: ClipboardList,
  attendance: CalendarCheck,
  finance: Wallet,
  students: Users,
};

/** The term so far, week by week. Seeded once, not randomised on render. */
const ATTENDANCE_TREND = [91, 93, 90, 95, 94, 96, 92, 97, 95, 96, 94, 96];
const COLLECTION_TREND = [18, 26, 31, 38, 44, 51, 58, 63, 69, 74, 79, 84];
const AVERAGE_TREND = [68, 69, 68, 71, 70, 72, 71, 73, 72, 74, 73, 74];

export function OverviewScreen() {
  const { auth } = useStaffAuth();
  if (!auth) return null;

  const role = auth.role;
  const department = departmentOf[role];
  const scope = scopeFor(role);
  const myClasses = classesInScope(role);
  const myPupils = pupilsInScope(role);
  const tasks = tasksFor(role).filter(task => can(role, task.module, 'view'));
  const hour = new Date(`${DEMO_TODAY}T09:00:00`).getHours();
  const greeting = hour < 12 ? 'Good morning' : 'Good afternoon';
  const surname = auth.name.split(' ').slice(-1)[0];

  const scopedAverage = myPupils.length
    ? Math.round((myPupils.reduce((total, pupil) => total + pupil.average, 0) / myPupils.length) * 10) / 10
    : 0;
  const presentNow = myClasses.reduce((total, klass) => total + klass.presentToday, 0);
  const scopedSize = myClasses.reduce((total, klass) => total + klass.pupils, 0);

  return (
    <div className="space-y-5">
      {/* ---------------------------------------------------------------- */}
      {/* Who this console belongs to, and what it is connected to.         */}
      {/* ---------------------------------------------------------------- */}
      <Hero
        eyebrow={`${department.name} · ${scope.label}`}
        title={`${greeting}, ${role === 'director' || role === 'head' ? auth.title.split(' ')[0] + ' ' : ''}${surname}`}
        sub={
          scope.kind === 'school'
            ? `${formatLongDate(DEMO_TODAY)}, ${termWeeks.term.toLowerCase()}, week ${termWeeks.week} of ${termWeeks.of}. Everything saved here reaches a parent's phone the same minute.`
            : `You are working on ${scope.label}. Only your pupils and your records appear here, and anything you save reaches their families at once.`
        }
        tone={department.id === 'finance' ? 'yellow' : department.id === 'academic' ? 'purple' : 'orange'}
        actions={
          <>
            <LiveBadge />
            <Button to="/parent" tone="plain" icon={ArrowRight}>
              See the parent app
            </Button>
          </>
        }
      >
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { figure: String(myPupils.length), note: scope.kind === 'school' ? 'pupils on roll' : 'pupils in your care' },
            { figure: `${presentNow}/${scopedSize}`, note: 'in school today' },
            { figure: scopedAverage.toFixed(1), note: 'average in your scope' },
            {
              figure: String(readyToPublish.length),
              note: can(role, 'academics') ? 'results waiting' : 'results this term',
            },
          ].map(stat => (
            <div key={stat.note} className="rounded-2xl bg-paper/80 px-3.5 py-3">
              <dt className="font-display text-[1.5rem] leading-none tabular-nums text-ink">{stat.figure}</dt>
              <dd className="mt-1 text-[0.6875rem] leading-snug text-ink-mute">{stat.note}</dd>
            </div>
          ))}
        </dl>
      </Hero>

      {/* ---------------------------------------------------------------- */}
      {/* Four figures, each with its trend.                                */}
      {/* ---------------------------------------------------------------- */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi
          icon={Users}
          tone="purple"
          label={scope.kind === 'school' ? 'Pupils on roll' : 'In your care'}
          value={myPupils.length}
          note={scope.kind === 'school' ? `${classSummary.length} classes` : scope.label}
          spark={AVERAGE_TREND}
          to="/admin/students"
        />
        <Kpi
          icon={CalendarCheck}
          tone="green"
          label="Attendance"
          value={Math.round((presentNow / Math.max(1, scopedSize)) * 100)}
          suffix="%"
          note={`${presentNow} of ${scopedSize} this morning`}
          spark={ATTENDANCE_TREND}
          to={can(role, 'attendance') ? '/admin/attendance' : undefined}
        />
        <Kpi
          icon={GraduationCap}
          tone="orange"
          label="Results waiting"
          value={readyToPublish.length}
          note="Marked, not yet published"
          spark={[2, 3, 3, 5, 4, 6, 5, 7, 6, 5, 4, 3]}
          to={can(role, 'academics') ? '/admin/academics' : undefined}
        />
        {can(role, 'finance') ? (
          <Kpi
            icon={Wallet}
            tone="yellow"
            label="Fees collected"
            value={feePosition.rate}
            suffix="%"
            note={`${formatCurrency(feePosition.outstanding)} still owed`}
            spark={COLLECTION_TREND}
            to="/admin/finance"
          />
        ) : (
          <Kpi
            icon={Target}
            tone="yellow"
            label="Class average"
            value={scopedAverage.toFixed(1)}
            note="Across every subject"
            spark={AVERAGE_TREND}
          />
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="space-y-4">
          {/* ------------------------------------------------------------ */}
          {/* The one picture that matters to this person.                 */}
          {/* ------------------------------------------------------------ */}
          {scope.kind === 'school' ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardHead title="Fees this term" sub="Collected against billed" icon={Wallet} tone="yellow" />
                <CardPad className="pt-0">
                  <Donut
                    parts={[
                      { label: 'Tuition', value: 158400, tone: 'orange' },
                      { label: 'Feeding', value: 47500, tone: 'green' },
                      { label: 'Transport', value: 24400, tone: 'purple' },
                      { label: 'Other', value: 31400, tone: 'yellow' },
                    ]}
                  />
                  <p className="mt-3 text-[1.5rem] font-semibold leading-none tabular-nums text-ink">
                    {formatCurrency(feePosition.collected)}
                  </p>
                  <p className="mt-1 text-[0.75rem] text-ink-mute">
                    of {formatCurrency(feePosition.billed)} billed · {feePosition.arrears} families still owing
                  </p>
                </CardPad>
              </Card>

              <Card>
                <CardHead title="Attendance by class" sub="This morning" icon={CalendarCheck} tone="green" />
                <CardPad className="pt-0">
                  <Bars
                    data={attendanceToday.map(klass => ({ label: klass.name, value: klass.presentToday, max: klass.pupils }))}
                    tone="green"
                  />
                  <div className="mt-3 space-y-1.5">
                    {attendanceToday.map(klass => (
                      <div key={klass.id} className="flex items-center justify-between gap-2 text-[0.75rem]">
                        <span className="text-ink-mute">{klass.name}</span>
                        <span className="font-medium tabular-nums text-ink">
                          {klass.presentToday} of {klass.pupils}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardPad>
              </Card>
            </div>
          ) : null}

          {scope.kind === 'class' ? (
            <Card>
              <CardHead title={`${scope.label}, this term`} sub="Your class, week by week" icon={CalendarCheck} tone="green" />
              <CardPad className="pt-0">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <Ring value={myClasses[0]?.termAttendance ?? 0} caption="Attendance this term" captionNote={`${myClasses[0]?.pupils ?? 0} pupils`} />
                  <div className="min-w-0 flex-1">
                    <p className="mb-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-ink-mute">
                      Twelve weeks
                    </p>
                    <WeekStrip values={ATTENDANCE_TREND} />
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    { label: 'Average', value: scopedAverage.toFixed(1) },
                    { label: 'Present', value: `${presentNow}/${scopedSize}` },
                    { label: 'Above 80', value: String(myPupils.filter(pupil => pupil.average >= 80).length) },
                  ].map(item => (
                    <div key={item.label} className="rounded-xl bg-canvas px-3 py-2">
                      <p className="text-[0.5625rem] uppercase tracking-[0.08em] text-ink-mute">{item.label}</p>
                      <p className="mt-0.5 text-[1rem] font-semibold tabular-nums text-ink">{item.value}</p>
                    </div>
                  ))}
                </div>
              </CardPad>
            </Card>
          ) : null}

          {scope.kind === 'subject' ? (
            <Card>
              <CardHead title={`${scope.subjects[0]?.subject} · ${scope.label.split(', ')[1]}`} sub="Your gradebook" icon={GraduationCap} tone="purple" />
              <CardPad className="pt-0">
                <div className="flex items-center gap-4">
                  <Ring value={scopedAverage} caption="Class average" captionNote="Across 24 pupils" tone="purple" />
                  <div className="min-w-0 flex-1">
                    <Sparkline values={AVERAGE_TREND} tone="purple" label="Average by week" height={44} />
                    <p className="mt-1 text-[0.6875rem] text-ink-mute">Scores have risen for four weeks running</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="mb-2 text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-ink-mute">
                    Grade spread
                  </p>
                  <Bars
                    data={[
                      { label: 'Grade 1', value: 6 },
                      { label: 'Grade 2', value: 8 },
                      { label: 'Grade 3', value: 6 },
                      { label: 'Grade 4', value: 3 },
                      { label: 'Grade 5', value: 1 },
                    ]}
                    tone="purple"
                    height={96}
                  />
                </div>
              </CardPad>
            </Card>
          ) : null}

          {/* ------------------------------------------------------------ */}
          {/* Waiting on this person.                                       */}
          {/* ------------------------------------------------------------ */}
          <Card>
            <CardHead title="Waiting on you" sub="Small things, done today" icon={ClipboardList} tone="orange" />
            <ul>
              {tasks.map(task => {
                const Icon = TASK_ICON[task.module] ?? Bell;
                return (
                  <li key={task.id} className="border-t border-rule first:border-0">
                    <Row
                      icon={Icon}
                      tone={task.tone}
                      title={task.label}
                      sub={task.detail}
                      trailing={<Badge tone={task.tone}>{task.count}</Badge>}
                      to={`/admin/${task.module}`}
                    />
                  </li>
                );
              })}
              {!tasks.length ? (
                <li className="px-5 py-6 text-center text-[0.8125rem] text-ink-mute">
                  Nothing is waiting on you. Everything in your scope is up to date.
                </li>
              ) : null}
            </ul>
          </Card>
        </div>

        <div className="space-y-4">
          {/* ------------------------------------------------------------ */}
          {/* What just changed.                                            */}
          {/* ------------------------------------------------------------ */}
          <Card>
            <CardHead title="What just changed" sub="Every row reached a phone" icon={Radio} tone="green" action={<LiveBadge label="Live" />} />
            <ul>
              {activity
                .filter(item => can(role, item.module))
                .slice(0, 4)
                .map(item => (
                  <li key={item.id} className="flex items-center gap-3 border-t border-rule px-4 py-3 first:border-0 sm:px-5">
                    <Avatar name={item.who} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[0.8125rem] text-ink">
                        <span className="font-semibold">{item.who.split(' ').slice(-1)[0]}</span> {item.what}
                      </p>
                      <p className="mt-0.5 text-[0.6875rem] text-ink-mute">{item.when}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-tint-green px-2.5 py-1 text-[0.6875rem] font-semibold text-green-deep">
                      {item.reached}
                    </span>
                  </li>
                ))}
            </ul>
          </Card>

          {/* ------------------------------------------------------------ */}
          {/* Classes, for whoever has more than one.                       */}
          {/* ------------------------------------------------------------ */}
          {myClasses.length > 1 || scope.kind === 'school' ? (
            <Card>
              <CardHead
                title="Classes"
                sub="Today, at a glance"
                icon={Users}
                tone="purple"
                action={
                  <Link to="/admin/classes" className="-my-3 inline-flex min-h-[2.5rem] items-center text-[0.75rem] font-semibold text-purple-deep">
                    All
                  </Link>
                }
              />
              <div className="space-y-3 px-4 pb-4 sm:px-5">
                {myClasses.map(klass => (
                  <div key={klass.id} className="flex items-center gap-3">
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[0.6875rem] font-bold ${
                      klass.termAttendance >= 95 ? 'bg-tint-green text-green-deep' : 'bg-tint-yellow text-yellow-deep'
                    }`}>
                      {klass.name.split(' ')[1] ?? klass.name.slice(0, 2)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[0.8125rem] font-medium text-ink">{klass.name}</p>
                      <p className="text-[0.6875rem] text-ink-mute">
                        {klass.formTeacher.name} · {klass.pupils} pupils
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[0.8125rem] font-semibold tabular-nums text-ink">{klass.presentToday}/{klass.pupils}</p>
                      <p className="text-[0.625rem] text-ink-mute">in today</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : null}

          {/* ------------------------------------------------------------ */}
          {/* The office's queues.                                          */}
          {/* ------------------------------------------------------------ */}
          {can(role, 'admissions') ? (
            <Card>
              <CardHead
                title="Admissions"
                sub={`${admissionQueue.length} in the queue`}
                icon={ClipboardList}
                tone="green"
                action={
                  <Link to="/admin/admissions" className="-my-3 inline-flex min-h-[2.5rem] items-center text-[0.75rem] font-semibold text-green-deep">
                    Open
                  </Link>
                }
              />
              <ul>
                {admissionQueue.slice(0, 3).map(application => (
                  <li key={application.id} className="border-t border-rule first:border-0">
                    <Row
                      title={application.child}
                      sub={`${application.applyingFor} · ${application.stage}`}
                      trailing={<Badge tone={application.stage === 'New' ? 'orange' : application.stage === 'Offer' ? 'green' : 'purple'}>{application.stage}</Badge>}
                      to="/admin/admissions"
                    />
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}

          {can(role, 'communications') ? (
            <Card>
              <CardHead
                title="Notices"
                sub={`${allNotices.length} sent this term`}
                icon={Bell}
                tone="orange"
                action={<Button to="/admin/communications" tone="plain">Compose</Button>}
              />
              <ul>
                {allNotices.slice(0, 2).map(notice => (
                  <li key={notice.id} className="border-t border-rule px-4 py-3 first:border-0 sm:px-5">
                    <p className="truncate text-[0.8125rem] font-medium text-ink">{notice.title}</p>
                    <p className="mt-0.5 text-[0.6875rem] text-ink-mute">
                      {notice.audience} · {notice.from}
                    </p>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Where else, which changes with the department.                    */}
      {/* ---------------------------------------------------------------- */}
      <SectionLabel
        right={
          <span className="inline-flex items-center gap-1.5 text-[0.75rem] text-ink-mute">
            <TrendingUp size={13} aria-hidden="true" /> {rollSize} pupils in the school
            <TrendingDown size={13} aria-hidden="true" /> {feePosition.arrears} families behind on fees
          </span>
        }
      >
        Your department
      </SectionLabel>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {[
          { id: 'students', label: 'Pupils', note: scope.kind === 'school' ? 'Every record' : 'Your pupils' },
          { id: 'academics', label: 'Results', note: 'Marks and publishing' },
          { id: 'attendance', label: 'Register', note: 'Today, class by class' },
          { id: 'finance', label: 'Finance', note: 'Bills and arrears' },
          { id: 'communications', label: 'Notices', note: 'What goes to the app' },
          { id: 'reports', label: 'Reports', note: 'The term in numbers' },
          { id: 'classes', label: 'Classes', note: 'Who teaches what' },
          { id: 'staff', label: 'Staff', note: 'People and access' },
        ]
          .filter(tile => can(role, tile.id as never))
          .map(tile => (
            <Link
              key={tile.id}
              to={`/admin/${tile.id}`}
              className="group flex min-h-[4.5rem] flex-col justify-between rounded-2xl bg-paper px-4 py-3 shadow-[0_1px_3px_rgba(17,17,17,0.06)] transition-transform hover:-translate-y-0.5"
            >
              <span className="text-[0.8125rem] font-semibold text-ink">{tile.label}</span>
              <span className="text-[0.6875rem] leading-snug text-ink-mute">{tile.note}</span>
            </Link>
          ))}
      </div>
    </div>
  );
}

export default OverviewScreen;
