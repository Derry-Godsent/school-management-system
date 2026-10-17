import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Bell, CalendarCheck, GraduationCap, Home, LogOut, Phone, UserCircle, Users, Wallet,
} from 'lucide-react';
import { guardians, school, students } from '../../data';
import {
  attendanceRate, bestSubject, classInfo, classRoster, feeSummary, notices, wardAverage,
  wardProfiles, wardStanding, weakestSubject,
  type ClassInfo, type RosterEntry, type SubjectResult, type WardProfile,
} from '../../data/portal';
import { useParentAuth } from './AuthContext';
import { LoginScreen } from './LoginScreen';
import { Avatar, Sheet } from './ui';
import { HistoryControls } from '../../components/layout/HistoryControls';

type Student = (typeof students)[number];

export interface WardValue {
  guardian: (typeof guardians)[number] | undefined;
  wards: Student[];
  childId: string;
  child: Student | undefined;
  setChildId: (id: string) => void;
  profile: WardProfile | undefined;
  klass: ClassInfo | undefined;
  roster: RosterEntry[];
  average: number;
  standing: { rank: number; size: number };
  fees: { charged: number; paid: number; balance: number };
  attendance: number;
  best: SubjectResult | null;
  weakest: SubjectResult | null;
}

const WardContext = createContext<WardValue | null>(null);

export function useWard(): WardValue {
  const value = useContext(WardContext);
  if (!value) throw new Error('useWard must be used inside the portal shell');
  return value;
}

/** The five destinations a phone tab bar holds, and no more. */
const TABS = [
  { to: '/parent', label: 'Home', icon: Home, end: true, tone: 'orange' as const },
  { to: '/parent/class', label: 'Class', icon: Users, end: false, tone: 'green' as const },
  { to: '/parent/results', label: 'Grades', icon: GraduationCap, end: false, tone: 'purple' as const },
  { to: '/parent/fees', label: 'Fees', icon: Wallet, end: false, tone: 'yellow' as const },
  { to: '/parent/announcements', label: 'Notices', icon: Bell, end: false, tone: 'orange' as const },
];

/**
 * The tab bar's active colours, written out in full. Tailwind finds classes by
 * scanning the source for whole names, so a name assembled at runtime with a
 * template string is never generated and the bar would come out colourless.
 */
const TAB_ACTIVE: Record<string, { pill: string; icon: string }> = {
  orange: { pill: 'bg-tint-orange', icon: 'text-gold-deep' },
  green: { pill: 'bg-tint-green', icon: 'text-green-deep' },
  purple: { pill: 'bg-tint-purple', icon: 'text-purple-deep' },
  yellow: { pill: 'bg-tint-yellow', icon: 'text-yellow-deep' },
};

/** Reached from Home rather than the tab bar, and from the rail on a tablet. */
const SECONDARY = [
  { to: '/parent/attendance', label: 'Attendance', icon: CalendarCheck, end: false },
  { to: '/parent/profile', label: 'Account', icon: UserCircle, end: false },
];

/**
 * The app frame.
 *
 * Everything about this is taken from how a phone app is built: a light bar at
 * the top that stays put while the screen scrolls, a tab bar pinned at the
 * bottom with room for the home indicator, a rail instead of the tab bar once
 * there is room for one, and the chosen child kept while a parent moves around.
 *
 * There is no dark surface anywhere. The bar is white with a hairline, the tab
 * bar is white with a hairline, and the colour lives in the icons and the chips.
 */
export function PortalShell() {
  const { auth, login, logout } = useParentAuth();
  const [childId, setChildId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const guardian = guardians.find(entry => entry.id === auth?.guardianId);
  const wards = useMemo(
    () => (guardian ? students.filter(student => guardian.studentIds.includes(student.id)) : []),
    [guardian]
  );

  const activeId = childId && wards.some(ward => ward.id === childId) ? childId : wards[0]?.id ?? '';

  const wardNames = useMemo(
    () => Object.fromEntries(wards.map(ward => [ward.id, ward.name])) as Record<string, string>,
    [wards]
  );

  const value = useMemo<WardValue | null>(() => {
    const child = wards.find(ward => ward.id === activeId);
    if (!child) return null;
    const profile = wardProfiles[child.id];
    const klass = classInfo[profile?.classId ?? child.classId];
    return {
      guardian,
      wards,
      childId: child.id,
      child,
      setChildId: id => setChildId(id),
      profile,
      klass,
      roster: profile ? classRoster(profile.classId, wardNames) : [],
      average: wardAverage(child.id),
      standing: wardStanding(child.id, wardNames),
      fees: feeSummary(child.id),
      attendance: attendanceRate(child.id),
      best: bestSubject(child.id),
      weakest: weakestSubject(child.id),
    };
  }, [activeId, guardian, wards, wardNames]);

  if (!auth || !value) return <LoginScreen onSignIn={login} />;

  const pinned = notices.filter(
    notice => notice.pinned && (!notice.classId || notice.classId === value.profile?.classId)
  ).length;
  const isActive = (to: string, end: boolean) => (end ? location.pathname === to : location.pathname.startsWith(to));
  const here = TABS.find(tab => isActive(tab.to, tab.end)) ?? SECONDARY.find(item => item.to === location.pathname);
  const screenTitle = here?.label ?? 'Home';

  return (
    <WardContext.Provider value={value}>
      <div className="min-h-screen bg-canvas-deep">
        {/* ---------------------------------------------------------------- */}
        {/* The top bar. White, hairline, stays put.                          */}
        {/* ---------------------------------------------------------------- */}
        <header className="sticky top-0 z-50 border-b border-canvas-deep bg-paper pt-[env(safe-area-inset-top)]">
          <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-3 px-4">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold">
                <span className="text-[0.6875rem] font-bold text-ink">MG</span>
              </span>
              <div className="min-w-0">
                <p className="truncate text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-ink-mute">
                  Maple Grove
                </p>
                <p className="truncate text-[0.9375rem] font-semibold leading-tight text-ink">{screenTitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Back and forward, the same pair the console and the website
                  carry. A parent who has opened a class list can step back to
                  where they were without the phone's own gesture. */}
              <HistoryControls />
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="flex min-h-[2.75rem] items-center gap-2 rounded-full bg-canvas py-1.5 pl-1.5 pr-3 transition-transform active:scale-95"
                aria-label="Your account"
              >
                <Avatar name={guardian?.name ?? 'Parent'} size="sm" tone="orange" />
                <span className="hidden max-w-[8rem] truncate text-[0.8125rem] font-medium text-ink sm:block">
                  {guardian?.name.replace(/^Mr\. & Mrs\.\s*/, '')}
                </span>
              </button>
            </div>
          </div>

          {/* The child switcher, as pills. Only when there is more than one. */}
          {wards.length > 1 ? (
            <div className="border-t border-canvas-deep">
              <div className="mx-auto flex max-w-3xl gap-2 overflow-x-auto px-4 py-2.5">
                {wards.map(ward => {
                  const on = ward.id === value.childId;
                  return (
                    <button
                      key={ward.id}
                      type="button"
                      onClick={() => setChildId(ward.id)}
                      aria-pressed={on}
                      className={`inline-flex min-h-[2.75rem] shrink-0 items-center rounded-full px-3.5 text-[0.75rem] font-medium transition-colors ${
                        on ? 'bg-gold text-ink' : 'bg-canvas text-ink-mute'
                      }`}
                    >
                      {ward.name.split(' ')[0]} · {ward.className}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </header>

        <div className="mx-auto flex max-w-3xl lg:max-w-6xl">
          {/* -------------------------------------------------------------- */}
          {/* Rail, from a tablet upwards.                                    */}
          {/* -------------------------------------------------------------- */}
          <aside data-lenis-prevent className="sticky top-[4.5rem] hidden max-h-[calc(100dvh-5rem)] w-60 shrink-0 self-start overflow-y-auto overscroll-contain px-3 py-5 lg:block">
            {wards.length > 1 ? (
              <div className="mb-4">
                <p className="px-2 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-ink-mute">
                  Your children
                </p>
                <div className="mt-2 space-y-1.5">
                  {wards.map(ward => {
                    const on = ward.id === value.childId;
                    return (
                      <button
                        key={ward.id}
                        type="button"
                        onClick={() => setChildId(ward.id)}
                        className={`flex min-h-[3rem] w-full items-center gap-2.5 rounded-2xl px-2.5 text-left transition-colors ${
                          on ? 'bg-paper shadow-[0_1px_3px_rgba(17,17,17,0.06)]' : 'active:bg-paper'
                        }`}
                      >
                        <Avatar name={ward.name} size="sm" tone={on ? 'orange' : undefined} />
                        <span className="min-w-0">
                          <span className="block truncate text-[0.8125rem] font-medium text-ink">{ward.name}</span>
                          <span className="block text-[0.6875rem] text-ink-mute">{ward.className}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <nav className="space-y-1">
              {[...TABS, ...SECONDARY].map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive: on }) =>
                    `flex min-h-[2.75rem] items-center gap-3 rounded-2xl px-3 py-2.5 text-[0.875rem] font-medium transition-colors ${
                      on ? 'bg-paper text-ink shadow-[0_1px_3px_rgba(17,17,17,0.06)]' : 'text-ink-mute active:bg-paper'
                    }`
                  }
                >
                  <Icon size={18} aria-hidden="true" />
                  {label}
                  {label === 'Notices' && pinned > 0 ? (
                    <span className="ml-auto rounded-full bg-gold px-1.5 py-0.5 text-[0.625rem] font-bold text-ink">
                      {pinned}
                    </span>
                  ) : null}
                </NavLink>
              ))}
            </nav>

            <div className="mt-6 px-3">
              <a
                href={`tel:${school.phone.replace(/\s/g, '')}`}
                className="flex min-h-[2.75rem] items-center gap-2 text-[0.8125rem] font-medium text-ink"
              >
                <Phone size={15} aria-hidden="true" className="text-gold-deep" />
                Call the office
              </a>
              <button
                type="button"
                onClick={logout}
                className="mt-1 flex min-h-[2.75rem] items-center gap-2 text-[0.8125rem] text-ink-mute"
              >
                <LogOut size={15} aria-hidden="true" />
                Sign out
              </button>
            </div>
          </aside>

          {/* -------------------------------------------------------------- */}
          {/* The screen. Bottom padding leaves room for the tab bar.          */}
          {/* -------------------------------------------------------------- */}
          <main className="min-w-0 flex-1 px-4 pb-28 pt-4 sm:px-5 lg:pb-10">
            <Outlet />
          </main>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* The tab bar, pinned, with room for the home indicator.            */}
        {/* ---------------------------------------------------------------- */}
        <nav
          className="fixed inset-x-0 bottom-0 z-50 border-t border-canvas-deep bg-paper pb-[max(0.35rem,env(safe-area-inset-bottom))] lg:hidden"
          aria-label="Portal"
        >
          <div className="mx-auto flex max-w-3xl">
            {TABS.map(({ to, label, icon: Icon, end, tone }) => {
              const active = isActive(to, end);
              return (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className="relative flex min-h-[3.5rem] flex-1 flex-col items-center justify-center gap-1 px-1 py-1.5"
                >
                  <span
                    className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors ${
                      active ? TAB_ACTIVE[tone].pill : ''
                    }`}
                  >
                    <Icon
                      size={20}
                      aria-hidden="true"
                      className={active ? TAB_ACTIVE[tone].icon : 'text-ink-mute'}
                    />
                  </span>
                  <span className={`text-[0.625rem] font-medium ${active ? 'text-ink' : 'text-ink-mute'}`}>{label}</span>
                  {label === 'Notices' && pinned > 0 ? (
                    <span className="absolute right-1/2 top-0.5 flex h-4 min-w-4 translate-x-4 items-center justify-center rounded-full bg-gold px-1 text-[0.5625rem] font-bold text-ink">
                      {pinned}
                    </span>
                  ) : null}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* The account panel, opened from the top bar. */}
        <Sheet open={menuOpen} onClose={() => setMenuOpen(false)} title={guardian?.name ?? 'Your account'}>
          <div className="flex items-center gap-3.5 rounded-2xl bg-canvas px-4 py-3.5">
            <Avatar name={guardian?.name ?? 'Parent'} size="md" tone="orange" />
            <div className="min-w-0">
              <p className="truncate text-[0.9375rem] font-semibold text-ink">{guardian?.name}</p>
              <p className="truncate text-[0.8125rem] text-ink-mute">{guardian?.email}</p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {wards.map(ward => (
              <button
                key={ward.id}
                type="button"
                onClick={() => {
                  setChildId(ward.id);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-2xl bg-canvas px-3.5 py-3 text-left active:bg-canvas-deep"
              >
                <Avatar name={ward.name} size="sm" tone={ward.id === value.childId ? 'orange' : undefined} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.875rem] font-medium text-ink">{ward.name}</span>
                  <span className="block text-[0.75rem] text-ink-mute">{ward.className}</span>
                </span>
                {ward.id === value.childId ? (
                  <span className="rounded-full bg-gold px-2 py-0.5 text-[0.625rem] font-semibold text-ink">Open</span>
                ) : null}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-2">
            <Link
              to="/parent/profile"
              onClick={() => setMenuOpen(false)}
              className="flex min-h-[2.75rem] items-center gap-3 rounded-2xl bg-canvas px-3.5 py-3 text-[0.875rem] font-medium text-ink"
            >
              <UserCircle size={17} aria-hidden="true" className="text-gold-deep" />
              Account and children
            </Link>
            <Link
              to="/parent/attendance"
              onClick={() => setMenuOpen(false)}
              className="flex min-h-[2.75rem] items-center gap-3 rounded-2xl bg-canvas px-3.5 py-3 text-[0.875rem] font-medium text-ink"
            >
              <CalendarCheck size={17} aria-hidden="true" className="text-green-deep" />
              Attendance
            </Link>
            <a
              href={`tel:${school.phone.replace(/\s/g, '')}`}
              className="flex min-h-[2.75rem] items-center gap-3 rounded-2xl bg-canvas px-3.5 py-3 text-[0.875rem] font-medium text-ink"
            >
              <Phone size={17} aria-hidden="true" className="text-gold-deep" />
              Call the school office
            </a>
          </div>

          <button
            type="button"
            onClick={logout}
            className="mt-4 flex min-h-[3rem] w-full items-center justify-center gap-2 rounded-2xl bg-gold px-4 py-3 text-[0.875rem] font-semibold text-ink"
          >
            <LogOut size={17} aria-hidden="true" />
            Sign out
          </button>
        </Sheet>
      </div>
    </WardContext.Provider>
  );
}

export default PortalShell;
