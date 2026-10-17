import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  ArrowRightLeft, BookOpen, Building2, CalendarCheck, ClipboardList, FileBarChart2, GraduationCap,
  LayoutGrid, LogOut, Mail, Menu, Settings, ShieldCheck, UserCog, Users, Wallet, type LucideIcon,
} from 'lucide-react';
import { school } from '../../data';
import {
  can, departmentOf, modules, roles, scopeFor, staffRoster, termWeeks,
  type ModuleId, type RoleId,
} from '../../data/admin';
import { useCloseAbove } from '../../lib/useCloseAbove';
import { HistoryControls } from '../../components/layout/HistoryControls';
import { useStaffAuth } from './AuthContext';
import { LoginScreen } from './LoginScreen';
import { Avatar, Badge, Drawer, LiveBadge } from './ui';

/**
 * The console shell.
 *
 * The frame is built once and the working area changes inside it. What sits in
 * the frame is decided by the department the signed in person belongs to, not
 * by a fixed menu: a bursar and a subject teacher do not see the same console
 * with different items greyed out, they see two different consoles, each
 * organised around the work that person actually does.
 *
 * Two rules hold everywhere:
 *
 *  - A module a person cannot open is not drawn at all. The navigation is
 *    filtered through the permission table the screens check, so a hidden
 *    module is also an unreachable one.
 *  - The assignment is shown, not implied. The rail says "JHS 2, one class" for
 *    the form teacher and "Mathematics, JHS 2" for the subject teacher, because
 *    that scope is what every number on every screen is computed from.
 */

const MODULE_ICON: Record<ModuleId, LucideIcon> = {
  overview: LayoutGrid,
  admissions: ClipboardList,
  students: Users,
  staff: UserCog,
  classes: BookOpen,
  attendance: CalendarCheck,
  academics: GraduationCap,
  finance: Wallet,
  communications: Mail,
  reports: FileBarChart2,
  access: ShieldCheck,
  settings: Settings,
};

const ROLE_MARK: Record<RoleId, LucideIcon> = {
  director: Building2,
  head: GraduationCap,
  admin: ClipboardList,
  finance: Wallet,
  form: Users,
  subject: BookOpen,
};

/**
 * The menu, written per department.
 *
 * Order matters more than completeness: the first group is the work this
 * person does every day, and the second is what they consult. A form teacher
 * opens the register before they open a report, and the menu says so.
 */
function navGroupsFor(role: RoleId): { title: string; items: ModuleId[] }[] {
  const allowed = (ids: ModuleId[]) => ids.filter(id => can(role, id));

  if (role === 'director') {
    return [
      { title: 'The school', items: allowed(['overview', 'students', 'staff', 'classes', 'attendance', 'reports']) },
      { title: 'Admissions and office', items: allowed(['admissions', 'communications', 'access', 'settings']) },
      { title: 'Money and results', items: allowed(['finance', 'academics']) },
    ];
  }
  if (role === 'head') {
    return [
      { title: 'Academic', items: allowed(['overview', 'academics', 'classes', 'attendance']) },
      { title: 'People', items: allowed(['students', 'staff', 'reports']) },
      { title: 'The school', items: allowed(['communications']) },
    ];
  }
  if (role === 'form') {
    return [
      { title: 'Your class', items: allowed(['overview', 'attendance', 'classes']) },
      { title: 'Their work', items: allowed(['academics', 'students']) },
      { title: 'At home', items: allowed(['communications']) },
    ];
  }
  if (role === 'subject') {
    return [
      { title: 'Your subject', items: allowed(['overview', 'academics']) },
      { title: 'Their records', items: allowed(['students']) },
      { title: 'At home', items: allowed(['communications']) },
    ];
  }
  if (role === 'admin') {
    return [
      { title: 'The office', items: allowed(['overview', 'admissions', 'students']) },
      { title: 'The school', items: allowed(['staff', 'classes', 'attendance', 'communications']) },
      { title: 'Oversight', items: allowed(['reports', 'settings']) },
    ];
  }
  return [
    { title: 'The bursary', items: allowed(['overview', 'finance']) },
    { title: 'Families', items: allowed(['students', 'communications']) },
    { title: 'Oversight', items: allowed(['reports']) },
  ];
}

function tabsFor(role: RoleId): ModuleId[] {
  const preferred: ModuleId[] = ['overview', 'attendance', 'academics', 'finance', 'students', 'communications'];
  const allowed = preferred.filter(id => can(role, id));
  return allowed.slice(0, 4);
}

export function AdminShell() {
  const { auth, logout, signInAs } = useStaffAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { pathname } = useLocation();

  useCloseAbove('(min-width: 768px)', () => setMenuOpen(false));

  if (!auth) return <LoginScreen />;

  const role = roles.find(person => person.id === auth.role);
  const department = departmentOf[auth.role];
  const scope = scopeFor(auth.role);
  const groups = navGroupsFor(auth.role);
  const permitted = modules.filter(module => can(auth.role, module.id));
  const here = permitted.find(module =>
    module.id === 'overview' ? pathname === '/admin' : pathname.startsWith(`/admin/${module.id}`)
  );
  const tabs = tabsFor(auth.role).map(id => permitted.find(module => module.id === id)).filter(Boolean);
  const me = staffRoster.find(person => person.email === auth.email);

  return (
    <div className="min-h-screen bg-canvas">
      {/* ---------------------------------------------------------------- */}
      {/* Rail, from a tablet upwards.                                     */}
      {/* ---------------------------------------------------------------- */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[16.5rem] flex-col overflow-hidden border-r border-canvas-deep bg-paper md:flex">
        <div className="flex items-center gap-2.5 px-5 pb-3 pt-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold">
            <span className="text-[0.6875rem] font-bold text-ink">MG</span>
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[0.8125rem] font-semibold text-ink">{school.name}</span>
            <span className="block text-[0.625rem] font-medium uppercase tracking-[0.14em] text-ink-mute">
              Staff console
            </span>
          </span>
        </div>

        {/* Who you are, in this role, with the scope they work in. */}
        <div className="mx-3 mb-3 rounded-2xl bg-canvas px-3 py-3">
          <div className="flex items-center gap-2.5">
            <Avatar name={auth.name} size="sm" tone={role?.tone} />
            <div className="min-w-0">
              <p className="truncate text-[0.8125rem] font-semibold leading-tight text-ink">{auth.name}</p>
              <p className="truncate text-[0.6875rem] text-ink-mute">{auth.title}</p>
            </div>
          </div>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <span className="inline-flex items-center rounded-full bg-paper px-2 py-0.5 text-[0.625rem] font-semibold text-ink">
              {department.name}
            </span>
            <span className="inline-flex items-center rounded-full bg-paper px-2 py-0.5 text-[0.625rem] font-medium text-ink-mute">
              {scope.label}
            </span>
          </div>
        </div>

        <nav data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-4" aria-label="Console">
          {groups.map(group => {
            if (!group.items.length) return null;
            return (
              <div key={group.title} className="mb-4">
                <p className="px-2 pb-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-ink-mute">
                  {group.title}
                </p>
                <ul className="space-y-0.5">
                  {group.items.map(id => {
                    const module = modules.find(entry => entry.id === id);
                    if (!module) return null;
                    const Icon = MODULE_ICON[id];
                    const to = id === 'overview' ? '/admin' : `/admin/${id}`;
                    return (
                      <li key={id}>
                        <NavLink
                          to={to}
                          end={id === 'overview'}
                          className={({ isActive }) =>
                            `group flex min-h-[2.5rem] items-center gap-2.5 rounded-xl px-2.5 text-[0.8125rem] font-medium transition-colors ${
                              isActive ? 'bg-tint-orange text-ink' : 'text-ink-mute hover:bg-canvas active:bg-canvas'
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <span className={`flex h-6 w-6 items-center justify-center rounded-lg ${isActive ? 'bg-paper' : ''}`}>
                                <Icon size={15} className={isActive ? 'text-gold-deep' : 'text-ink-mute'} aria-hidden="true" />
                              </span>
                              <span className="truncate">{module.label}</span>
                            </>
                          )}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        <div className="border-t border-canvas-deep px-3 py-3">
          <LiveBadge label="Updating parents now" />
          <button
            type="button"
            onClick={() => setAccountOpen(true)}
            className="mt-2 flex min-h-[2.75rem] w-full items-center gap-2.5 rounded-xl px-2 text-left hover:bg-canvas"
          >
            <ArrowRightLeft size={14} className="text-ink-mute" aria-hidden="true" />
            <span className="min-w-0 flex-1 text-[0.75rem] font-medium text-ink">Switch role</span>
          </button>
        </div>
      </aside>

      {/* ---------------------------------------------------------------- */}
      {/* The working area.                                                */}
      {/* ---------------------------------------------------------------- */}
      <div className="md:pl-[16.5rem]">
        <header className="sticky top-0 z-30 border-b border-canvas-deep bg-paper/95 pt-[env(safe-area-inset-top)] backdrop-blur-sm">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open the menu"
              className="flex h-11 w-11 items-center justify-center rounded-xl text-ink hover:bg-canvas md:hidden"
            >
              <Menu size={20} />
            </button>

            {/* Where you are, department first, so the frame always says which
                console this is. */}
            <div className="hidden items-center gap-2 text-[0.75rem] text-ink-mute lg:flex">
              <span className="font-semibold text-ink">{department.name}</span>
              <span aria-hidden="true">/</span>
              <span>{here?.label ?? 'Console'}</span>
            </div>

            <div className="flex min-w-0 flex-1 items-center gap-2.5 lg:hidden">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold">
                <span className="text-[0.625rem] font-bold text-ink">MG</span>
              </span>
              <div className="min-w-0">
                <p className="truncate text-[0.9375rem] font-semibold leading-tight text-ink">{here?.label ?? 'Console'}</p>
                <p className="truncate text-[0.6875rem] text-ink-mute">
                  {department.name} · {scope.label}
                </p>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <HistoryControls className="hidden sm:flex" />
              <span className="hidden lg:block">
                <LiveBadge />
              </span>
              <span className="hidden text-[0.6875rem] font-medium text-ink-mute xl:block">
                {termWeeks.term}, week {termWeeks.week} of {termWeeks.of}
              </span>
              <button
                type="button"
                onClick={() => setAccountOpen(true)}
                className="flex min-h-[2.75rem] items-center gap-2 rounded-full bg-canvas py-1 pl-1 pr-2.5 hover:bg-canvas-deep"
                aria-label="Your account and role"
              >
                <Avatar name={auth.name} size="sm" tone={role?.tone} />
                <span className="hidden max-w-[7rem] truncate text-[0.75rem] font-medium text-ink sm:block">
                  {auth.title}
                </span>
              </button>
            </div>
          </div>

          {/* On a phone the history controls need their own row, because the bar
              above is already carrying four things. */}
          <div className="flex items-center justify-between gap-3 border-t border-canvas-deep px-4 py-1.5 sm:hidden">
            <HistoryControls />
            <span className="truncate text-[0.6875rem] text-ink-mute">{me?.status ?? 'In school'}</span>
          </div>
        </header>

        <main className="px-4 pb-28 pt-4 sm:px-6 sm:pt-5 md:pb-10">
          <Outlet />
        </main>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Phone navigation.                                                */}
      {/* ---------------------------------------------------------------- */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-canvas-deep bg-paper pb-[max(0.35rem,env(safe-area-inset-bottom))] md:hidden"
        aria-label="Console sections"
      >
        <div className="mx-auto flex max-w-2xl">
          {tabs.map(module => {
            if (!module) return null;
            const Icon = MODULE_ICON[module.id];
            const to = module.id === 'overview' ? '/admin' : `/admin/${module.id}`;
            return (
              <NavLink
                key={module.id}
                to={to}
                end={module.id === 'overview'}
                className="relative flex min-h-[3.5rem] flex-1 flex-col items-center justify-center gap-1 px-1 py-1.5"
              >
                {({ isActive }) => (
                  <>
                    <span className={`flex h-7 w-11 items-center justify-center rounded-full ${isActive ? 'bg-tint-orange' : ''}`}>
                      <Icon size={19} className={isActive ? 'text-gold-deep' : 'text-ink-mute'} aria-hidden="true" />
                    </span>
                    <span className={`text-[0.625rem] font-medium ${isActive ? 'text-ink' : 'text-ink-mute'}`}>
                      {module.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex min-h-[3.5rem] flex-1 flex-col items-center justify-center gap-1 px-1 py-1.5"
          >
            <span className="flex h-7 w-11 items-center justify-center rounded-full">
              <Menu size={19} className="text-ink-mute" aria-hidden="true" />
            </span>
            <span className="text-[0.625rem] font-medium text-ink-mute">More</span>
          </button>
        </div>
      </nav>

      {/* ---------------------------------------------------------------- */}
      {/* The menu, on a phone.                                            */}
      {/* ---------------------------------------------------------------- */}
      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} title={department.name}>
        <p className="rounded-2xl bg-canvas px-4 py-3 text-[0.8125rem] text-ink">
          <span className="font-semibold">{auth.name}</span>
          <span className="mt-0.5 block text-[0.75rem] text-ink-mute">
            {auth.title} · {scope.label}
          </span>
        </p>
        <nav className="mt-3" aria-label="All console sections">
          {groups.map(group =>
            group.items.length ? (
              <div key={group.title} className="mb-3">
                <p className="px-3 pb-1 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-ink-mute">
                  {group.title}
                </p>
                {group.items.map(id => {
                  const module = modules.find(entry => entry.id === id);
                  if (!module) return null;
                  const Icon = MODULE_ICON[id];
                  const to = id === 'overview' ? '/admin' : `/admin/${id}`;
                  return (
                    <NavLink
                      key={id}
                      to={to}
                      end={id === 'overview'}
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex min-h-[3rem] items-center gap-3 rounded-xl px-3 text-[0.875rem] font-medium ${
                          isActive ? 'bg-tint-orange text-ink' : 'text-ink'
                        }`
                      }
                    >
                      <Icon size={17} className="text-ink-mute" aria-hidden="true" />
                      {module.label}
                      <span className="ml-auto text-[0.6875rem] text-ink-mute">{module.short}</span>
                    </NavLink>
                  );
                })}
              </div>
            ) : null
          )}
        </nav>
        <button
          type="button"
          onClick={logout}
          className="mt-2 flex min-h-[3rem] w-full items-center gap-3 rounded-xl bg-canvas px-3 text-[0.875rem] font-medium text-ink"
        >
          <LogOut size={17} className="text-ink-mute" aria-hidden="true" />
          Sign out
        </button>
      </Drawer>

      {/* ---------------------------------------------------------------- */}
      {/* Account and role.                                                */}
      {/* ---------------------------------------------------------------- */}
      <Drawer open={accountOpen} onClose={() => setAccountOpen(false)} title="Your account">
        <div className="flex items-center gap-3">
          <Avatar name={auth.name} size="lg" tone={role?.tone} />
          <div className="min-w-0">
            <p className="truncate text-[1rem] font-semibold text-ink">{auth.name}</p>
            <p className="truncate text-[0.8125rem] text-ink-mute">{auth.email}</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              <Badge tone={role?.tone}>{auth.title}</Badge>
              <Badge tone="plain">{department.name}</Badge>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-canvas px-4 py-3">
          <p className="text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-ink-mute">Your assignment</p>
          <p className="mt-1 text-[0.875rem] font-medium text-ink">{scope.label}</p>
          <p className="mt-0.5 text-[0.75rem] text-ink-mute">{scope.detail}</p>
        </div>

        <p className="mt-4 text-[0.8125rem] leading-relaxed text-ink-mute">{department.remit}.</p>

        <p className="mt-5 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-ink-mute">
          View the console as
        </p>
        <ul className="mt-2 space-y-1.5">
          {roles.map(person => {
            const Icon = ROLE_MARK[person.id];
            const on = person.id === auth.role;
            return (
              <li key={person.id}>
                <button
                  type="button"
                  onClick={() => {
                    signInAs(person);
                    setAccountOpen(false);
                  }}
                  className={`flex min-h-[3.25rem] w-full items-center gap-3 rounded-2xl px-3 text-left ${
                    on ? 'bg-tint-orange' : 'bg-canvas'
                  }`}
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-paper ${on ? 'text-gold-deep' : 'text-ink-mute'}`}>
                    <Icon size={16} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.8125rem] font-semibold text-ink">{person.title}</span>
                    <span className="block truncate text-[0.6875rem] text-ink-mute">{person.name}</span>
                  </span>
                  {on ? <Badge tone="green">Now</Badge> : null}
                </button>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={logout}
          className="mt-5 flex min-h-[3rem] w-full items-center justify-center gap-2 rounded-full bg-gold px-4 text-[0.875rem] font-semibold text-ink"
        >
          <LogOut size={16} aria-hidden="true" />
          Sign out
        </button>
      </Drawer>
    </div>
  );
}

export { AdminShell as default };
