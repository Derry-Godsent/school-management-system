import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Bell, CalendarCheck, GraduationCap, LayoutDashboard, LogOut, Phone, UserCircle, Users, Wallet,
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

type Student = (typeof students)[number];

export interface WardValue {
  guardian: (typeof guardians)[number] | undefined;
  /** Every ward of the signed in guardian. */
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

/** Everything a screen needs about the ward it is showing, worked out once. */
export function useWard(): WardValue {
  const value = useContext(WardContext);
  if (!value) throw new Error('useWard must be used inside the portal shell');
  return value;
}

const TABS = [
  { to: '/parent', label: 'Home', icon: LayoutDashboard, end: true },
  { to: '/parent/class', label: 'Class', icon: Users, end: false },
  { to: '/parent/results', label: 'Grades', icon: GraduationCap, end: false },
  { to: '/parent/fees', label: 'Fees', icon: Wallet, end: false },
  { to: '/parent/announcements', label: 'Notices', icon: Bell, end: false },
];

/** Attendance and the account page are on the rail, and reachable from Home. */
const RAIL_ONLY = [
  { to: '/parent/attendance', label: 'Attendance', icon: CalendarCheck, end: false },
  { to: '/parent/profile', label: 'Account', icon: UserCircle, end: false },
];

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

  const pinned = notices.filter(notice => notice.pinned && (!notice.classId || notice.classId === value.profile?.classId)).length;
  const isActive = (to: string, end: boolean) =>
    end ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <WardContext.Provider value={value}>
      <div className="min-h-screen bg-cream">
        {/* ---------------------------------------------------------------- */}
        {/* The app bar. Sticky, because a parent scrolling a long list of     */}
        {/* marks should not have to scroll back up to change child.           */}
        {/* ---------------------------------------------------------------- */}
        <header className="sticky top-0 z-50 border-b border-rule bg-paper">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
            <Link to="/parent" className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-gold">
                <span className="font-display text-xs font-bold tracking-wide text-ink">MG</span>
              </span>
              <span className="min-w-0 leading-tight">
                <span className="block truncate font-display text-[0.9375rem] text-ink">Maple Grove</span>
                <span className="block text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-gold-deep">
                  Parent Portal
                </span>
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="flex items-center gap-2 border border-rule px-2 py-1.5 transition-colors hover:bg-cream"
            >
              <Avatar name={guardian?.name ?? 'Parent'} size="sm" tone="ink" />
              <span className="hidden text-[0.8125rem] font-medium text-ink sm:block">
                {guardian?.name.replace(/^Mr\. & Mrs\.\s*/, '')}
              </span>
            </button>
          </div>

          {/* The child switcher. On a wide screen this lives on the rail. */}
          {wards.length > 1 ? (
            <div className="border-t border-rule lg:hidden">
              <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-2.5">
                {wards.map(ward => (
                  <button
                    key={ward.id}
                    type="button"
                    onClick={() => setChildId(ward.id)}
                    aria-pressed={ward.id === value.childId}
                    className={`shrink-0 px-3 py-1.5 text-[0.75rem] font-semibold transition-colors ${
                      ward.id === value.childId ? 'bg-ink text-paper' : 'bg-cream text-ink-mute hover:bg-tint-orange'
                    }`}
                  >
                    {ward.name} <span className="font-normal">· {ward.className}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </header>

        <div className="mx-auto flex max-w-6xl">
          {/* -------------------------------------------------------------- */}
          {/* The rail, from a tablet upwards.                                */}
          {/* -------------------------------------------------------------- */}
          <aside className="hidden w-64 shrink-0 border-r border-rule px-4 py-6 lg:block">
            {wards.length > 1 ? (
              <div className="mb-6">
                <p className="text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-ink-mute">
                  Your children
                </p>
                <div className="mt-2 space-y-1.5">
                  {wards.map(ward => (
                    <button
                      key={ward.id}
                      type="button"
                      onClick={() => setChildId(ward.id)}
                      className={`flex w-full items-center gap-2.5 border px-2.5 py-2 text-left transition-colors ${
                        ward.id === value.childId
                          ? 'border-ink bg-ink'
                          : 'border-rule bg-paper hover:bg-tint-orange'
                      }`}
                    >
                      <Avatar name={ward.name} size="sm" tone={ward.id === value.childId ? 'ink' : undefined} />
                      <span className="min-w-0">
                        <span className={`block truncate text-[0.8125rem] font-medium ${ward.id === value.childId ? 'text-paper' : 'text-ink'}`}>
                          {ward.name}
                        </span>
                        <span className={`block text-[0.6875rem] ${ward.id === value.childId ? 'text-paper' : 'text-ink-mute'}`}>
                          {ward.className}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <nav className="space-y-1">
              {[...TABS, ...RAIL_ONLY].map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 text-[0.875rem] font-medium transition-colors ${
                      isActive ? 'bg-ink text-paper' : 'text-ink-mute hover:bg-cream hover:text-ink'
                    }`
                  }
                >
                  <Icon size={17} aria-hidden="true" />
                  {label}
                  {label === 'Notices' && pinned > 0 ? (
                    <span className="ml-auto bg-yellow px-1.5 py-0.5 text-[0.625rem] font-bold text-ink">{pinned}</span>
                  ) : null}
                </NavLink>
              ))}
            </nav>

            <div className="mt-8 border-t border-rule pt-5">
              <p className="text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-ink-mute">School office</p>
              <a
                href={`tel:${school.phone.replace(/\s/g, '')}`}
                className="mt-2 flex items-center gap-2 text-[0.875rem] font-medium text-ink hover:text-gold-deep"
              >
                <Phone size={15} aria-hidden="true" />
                {school.phone}
              </a>
              <p className="mt-2 text-[0.75rem] leading-relaxed text-ink-mute">{school.address}</p>
              <button
                type="button"
                onClick={logout}
                className="mt-4 flex items-center gap-2 text-[0.8125rem] font-medium text-ink-mute transition-colors hover:text-ink"
              >
                <LogOut size={15} aria-hidden="true" />
                Sign out
              </button>
            </div>
          </aside>

          {/* -------------------------------------------------------------- */}
          {/* The page. Extra space at the bottom on a phone for the tab bar.  */}
          {/* -------------------------------------------------------------- */}
          <main className="min-w-0 flex-1 px-4 pt-5 pb-28 sm:px-6 lg:pb-12">
            <Outlet />
          </main>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* The tab bar, on a phone. Five destinations, which is as many as    */}
        {/* fits without shrinking the labels.                                 */}
        {/* ---------------------------------------------------------------- */}
        <nav
          className="fixed inset-x-0 bottom-0 z-50 border-t border-rule bg-paper pb-[env(safe-area-inset-bottom)] lg:hidden"
          aria-label="Portal"
        >
          <div className="mx-auto flex max-w-6xl">
            {TABS.map(({ to, label, icon: Icon, end }) => {
              const active = isActive(to, end);
              return (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className="relative flex flex-1 flex-col items-center gap-1 px-1 py-2.5"
                >
                  {active ? <span className="absolute inset-x-3 top-0 h-0.5 bg-gold" /> : null}
                  <span className="relative">
                    <Icon size={20} aria-hidden="true" className={active ? 'text-ink' : 'text-ink-mute'} />
                    {label === 'Notices' && pinned > 0 ? (
                      <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center bg-yellow px-1 text-[0.5625rem] font-bold text-ink">
                        {pinned}
                      </span>
                    ) : null}
                  </span>
                  <span className={`text-[0.625rem] font-semibold uppercase tracking-[0.08em] ${active ? 'text-ink' : 'text-ink-mute'}`}>
                    {label}
                  </span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* The account menu, from the app bar. */}
        <Sheet open={menuOpen} onClose={() => setMenuOpen(false)} title={guardian?.name ?? 'Your account'}>
          <dl className="border-t border-rule">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 border-b border-rule py-2.5">
              <dt className="text-[0.8125rem] text-ink-mute">Email</dt>
              <dd className="text-[0.875rem] font-medium text-ink">{guardian?.email}</dd>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 border-b border-rule py-2.5">
              <dt className="text-[0.8125rem] text-ink-mute">Phone</dt>
              <dd className="text-[0.875rem] font-medium text-ink">{guardian?.phone}</dd>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 py-2.5">
              <dt className="text-[0.8125rem] text-ink-mute">Children</dt>
              <dd className="text-[0.875rem] font-medium text-ink">
                {wards.map(ward => ward.name).join(', ')}
              </dd>
            </div>
          </dl>

          <div className="mt-5 space-y-2">
            <Link
              to="/parent/profile"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 bg-cream px-4 py-3 text-[0.875rem] font-medium text-ink transition-colors hover:bg-tint-orange"
            >
              <UserCircle size={17} aria-hidden="true" />
              Account and children
            </Link>
            <a
              href={`tel:${school.phone.replace(/\s/g, '')}`}
              className="flex items-center gap-3 bg-cream px-4 py-3 text-[0.875rem] font-medium text-ink transition-colors hover:bg-tint-orange"
            >
              <Phone size={17} aria-hidden="true" />
              Call the school office
            </a>
            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-3 bg-ink px-4 py-3 text-[0.875rem] font-medium text-paper"
            >
              <LogOut size={17} aria-hidden="true" />
              Sign out
            </button>
          </div>
        </Sheet>
      </div>
    </WardContext.Provider>
  );
}

export default PortalShell;
