import { Link } from 'react-router-dom';
import {
  ArrowRight, Bell, CalendarCheck, ClipboardList, GraduationCap, Radio, TrendingUp, Users, Wallet,
} from 'lucide-react';
import { formatCurrency, school } from '../../../data';
import { formatLongDate } from '../../../data/portal';
import {
  DEMO_TODAY, activity, admissionQueue, allNotices, attendanceToday, can, classSummary, feePosition,
  readyToPublish, rollSize, tasksFor, termWeeks, modules, type ModuleId,
} from '../../../data/admin';
import { useStaffAuth } from '../AuthContext';
import {
  Avatar, Badge, Button, Card, CardHead, CardPad, Kpi, LiveBadge, Meter, PageHead, Row, SectionLabel,
} from '../ui';

/**
 * Overview.
 *
 * One question: what does this person need to know before they touch anything?
 * It is answered in the same order for every role, and the contents change with
 * the role rather than the layout, so a bursar and a head teacher can point at
 * the same part of the screen even though the numbers differ.
 *
 * The green band at the top is the whole product in one sentence: this console
 * is not a private office system, it is what the parents are holding.
 */

const TASK_ICON: Record<string, typeof Bell> = {
  communications: Bell,
  academics: GraduationCap,
  admissions: ClipboardList,
  attendance: CalendarCheck,
  finance: Wallet,
  students: Users,
};

export function OverviewScreen() {
  const { auth } = useStaffAuth();
  if (!auth) return null;

  const role = auth.role;
  const tasks = tasksFor(role).filter(task => can(role, task.module, 'view'));
  const watched = (['finance', 'attendance', 'students', 'academics'] as ModuleId[]).filter(id => can(role, id));
  const visibleActivity = activity.filter(item => can(role, item.module)).slice(0, 5);
  const day = new Date(`${DEMO_TODAY}T09:00:00`);
  const greeting = day.getHours() < 12 ? 'Good morning' : 'Good afternoon';
  const noticesWaiting = allNotices.filter(notice => can(role, 'communications')).length;

  return (
    <div className="space-y-5">
      <PageHead
        title={`${greeting}, ${auth.name.split(' ').slice(-1)[0]}`}
        sub={`${formatLongDate(DEMO_TODAY)} · ${termWeeks.term}, week ${termWeeks.week} of ${termWeeks.of}`}
        actions={<LiveBadge label="Live to the app" />}
      />

      {/* ---------------------------------------------------------------- */}
      {/* What this console is connected to.                                */}
      {/* ---------------------------------------------------------------- */}
      <Card tone="green">
        <CardPad>
          <div className="flex flex-wrap items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-paper">
              <Radio size={19} className="text-green-deep" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-[0.9375rem] font-semibold text-ink">
                Everything saved here reaches the parent app the same minute
              </h2>
              <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink">
                {rollSize} families hold this school in their pocket. A mark entered in period two
                is on a parent&apos;s phone before lunch, with no message sent and no paper carried home.
              </p>
            </div>
            <Link
              to="/parent"
              className="inline-flex min-h-[2.5rem] shrink-0 items-center gap-1.5 rounded-full bg-paper px-4 text-[0.75rem] font-semibold text-green-deep"
            >
              See what they see
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </CardPad>
      </Card>

      {/* ---------------------------------------------------------------- */}
      {/* The four figures for this role.                                   */}
      {/* ---------------------------------------------------------------- */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {watched.map(id => {
          if (id === 'finance') {
            return (
              <Kpi
                key={id}
                icon={Wallet}
                tone="yellow"
                label="Fees collected"
                value={feePosition.rate}
                suffix="%"
                note={`${formatCurrency(feePosition.outstanding)} still owed`}
                to="/admin/finance"
              />
            );
          }
          if (id === 'attendance') {
            const present = attendanceToday.reduce((total, klass) => total + klass.presentToday, 0);
            return (
              <Kpi
                key={id}
                icon={CalendarCheck}
                tone="green"
                label="In school today"
                value={present}
                note={`of ${rollSize} on roll`}
                to="/admin/attendance"
              />
            );
          }
          if (id === 'students') {
            return (
              <Kpi
                key={id}
                icon={Users}
                tone="purple"
                label="Pupils on roll"
                value={rollSize}
                note={`${classSummary.length} classes in this demo`}
                to="/admin/students"
              />
            );
          }
          return (
            <Kpi
              key={id}
              icon={GraduationCap}
              tone="orange"
              label="Results waiting"
              value={readyToPublish.length}
              note="Marked, not yet published"
              to="/admin/academics"
            />
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="space-y-4">
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
                  Nothing is waiting on you. The school is up to date.
                </li>
              ) : null}
            </ul>
          </Card>

          {/* ------------------------------------------------------------ */}
          {/* What changed, and who it reached.                             */}
          {/* ------------------------------------------------------------ */}
          <Card>
            <CardHead
              title="What just changed"
              sub="Every row reached a phone"
              icon={Radio}
              tone="green"
              action={<LiveBadge label="Live" />}
            />
            <ul>
              {visibleActivity.map(item => (
                <li key={item.id} className="flex items-center gap-3 border-t border-rule px-4 py-3 first:border-0 sm:px-5">
                  <Avatar name={item.who} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.8125rem] text-ink">
                      <span className="font-semibold">{item.who.split(' ').slice(-1)[0]}</span> {item.what}
                    </p>
                    <p className="mt-0.5 text-[0.6875rem] text-ink-mute">{item.when}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-tint-green px-2.5 py-1 text-[0.6875rem] font-semibold text-green-deep">
                    {item.reached} {item.reached === 1 ? 'family' : 'families'}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="space-y-4">
          {/* ------------------------------------------------------------ */}
          {/* Classes, at a glance.                                         */}
          {/* ------------------------------------------------------------ */}
          {can(role, 'classes') || can(role, 'attendance') ? (
            <Card>
              <CardHead title="The classes" sub="Today" icon={Users} tone="purple" action={<Link to="/admin/classes" className="-my-3 inline-flex min-h-[2.5rem] items-center text-[0.75rem] font-semibold text-purple-deep">All</Link>} />
              <div className="space-y-3 px-4 pb-4 sm:px-5">
                {attendanceToday.map(klass => (
                  <div key={klass.id}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-[0.8125rem] font-medium text-ink">{klass.name}</span>
                      <span className="text-[0.75rem] tabular-nums text-ink-mute">
                        {klass.presentToday} of {klass.pupils}
                      </span>
                    </div>
                    <div className="mt-1.5">
                      <Meter value={klass.presentToday} max={klass.pupils} tone="green" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : null}

          {/* ------------------------------------------------------------ */}
          {/* Money, for the people allowed to see it.                      */}
          {/* ------------------------------------------------------------ */}
          {can(role, 'finance') ? (
            <Card>
              <CardHead title="Fees this term" icon={TrendingUp} tone="yellow" action={<Link to="/admin/finance" className="-my-3 inline-flex min-h-[2.5rem] items-center text-[0.75rem] font-semibold text-yellow-deep">Open</Link>} />
              <CardPad className="pt-0">
                <p className="text-[1.75rem] font-semibold leading-none tabular-nums text-ink">
                  {formatCurrency(feePosition.collected)}
                </p>
                <p className="mt-1 text-[0.75rem] text-ink-mute">
                  of {formatCurrency(feePosition.billed)} billed this term
                </p>
                <div className="mt-3">
                  <Meter value={feePosition.rate} tone="yellow" />
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-canvas px-3 py-2">
                    <dt className="text-[0.625rem] uppercase tracking-[0.08em] text-ink-mute">Cleared</dt>
                    <dd className="mt-0.5 text-[1rem] font-semibold tabular-nums text-green-deep">{feePosition.cleared}</dd>
                  </div>
                  <div className="rounded-xl bg-canvas px-3 py-2">
                    <dt className="text-[0.625rem] uppercase tracking-[0.08em] text-ink-mute">Still owing</dt>
                    <dd className="mt-0.5 text-[1rem] font-semibold tabular-nums text-gold-deep">{feePosition.arrears}</dd>
                  </div>
                </dl>
              </CardPad>
            </Card>
          ) : null}

          {/* ------------------------------------------------------------ */}
          {/* Admissions, for the office.                                   */}
          {/* ------------------------------------------------------------ */}
          {can(role, 'admissions') ? (
            <Card>
              <CardHead title="Admissions" sub={`${admissionQueue.length} in the queue`} icon={ClipboardList} tone="green" action={<Link to="/admin/admissions" className="-my-3 inline-flex min-h-[2.5rem] items-center text-[0.75rem] font-semibold text-green-deep">Open</Link>} />
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

          {/* ------------------------------------------------------------ */}
          {/* Notices.                                                      */}
          {/* ------------------------------------------------------------ */}
          {can(role, 'communications') ? (
            <Card>
              <CardHead
                title="Notices"
                sub={`${noticesWaiting} sent this term`}
                icon={Bell}
                tone="orange"
                action={<Button to="/admin/communications" tone="plain">Compose</Button>}
              />
              <ul>
                {allNotices.slice(0, 2).map(notice => (
                  <li key={notice.id} className="border-t border-rule first:border-0 px-4 py-3 sm:px-5">
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

      <SectionLabel>Where you can go</SectionLabel>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {modules
          .filter(module => module.id !== 'overview' && can(role, module.id))
          .map(module => (
            <Link
              key={module.id}
              to={`/admin/${module.id}`}
              className="flex min-h-[4.25rem] flex-col justify-between rounded-2xl bg-paper px-4 py-3 shadow-[0_1px_3px_rgba(17,17,17,0.06)]"
            >
              <span className="text-[0.8125rem] font-semibold text-ink">{module.label}</span>
              <span className="text-[0.6875rem] leading-snug text-ink-mute">{module.short}</span>
            </Link>
          ))}
      </div>

      <p className="pb-2 pt-2 text-[0.75rem] text-ink-mute">
        {school.name} · {school.address}
      </p>
    </div>
  );
}

export default OverviewScreen;
