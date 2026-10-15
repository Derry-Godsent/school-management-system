import React, { useState, createContext, useContext, ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Home, BookOpen, Calendar, CreditCard, Bell, User, LogOut,
  ChevronRight, TrendingUp, Clock, AlertCircle, Check, X,
  Download, ArrowLeft, Menu
} from 'lucide-react';
import {
  school, students, guardians, demoUsers, results, attendance,
  feeRecords, paymentHistory, timetable, announcements, events,
  academicYear, getStudentById, getGuardianChildren, getAttendanceStats,
  getFeeSummary, getGrade, formatCurrency
} from '../data';

// ============================================================================
// AUTH CONTEXT
// ============================================================================
interface ParentAuth {
  email: string;
  guardianId: string;
}

const AuthContext = createContext<{
  auth: ParentAuth | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}>({ auth: null, login: () => false, logout: () => {} });

function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<ParentAuth | null>(null);

  const login = (email: string, password: string) => {
    const user = demoUsers.find(u => u.email === email && u.password === password && u.role === 'parent');
    if (user && user.guardianId) {
      setAuth({ email: user.email, guardianId: user.guardianId });
      return true;
    }
    return false;
  };

  const logout = () => setAuth(null);

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ============================================================================
// LOGIN PAGE
// ============================================================================
function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('parent@demo.com');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate('/parent');
    } else {
      setError('Invalid credentials. Use the demo account shown below.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gold flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">MG</span>
          </div>
          <h1 className="text-2xl font-bold text-ink">Parent Portal</h1>
          <p className="text-sm text-ink-mute/80 mt-1">{school.name}</p>
        </div>

        <div className="bg-paper border border-rule p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-sm text-red-700">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-ink-mute mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-rule text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-mute mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-rule text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold"
                placeholder="Enter password"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-gold text-white font-medium hover:bg-gold-deep transition-colors shadow-orange-500/20"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 pt-6 border-t">
            <p className="text-xs text-ink-mute/80 text-center mb-2">Demo Credentials</p>
            <div className="bg-cream p-3 text-xs text-ink-mute space-y-1">
              <p><span className="font-medium">Email:</span> parent@demo.com</p>
              <p><span className="font-medium">Password:</span> demo123</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-ink-mute/80 hover:text-ink-mute">
            ← Back to school website
          </Link>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// BOTTOM NAVIGATION (App-style)
// ============================================================================
function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/parent', icon: Home, label: 'Home' },
    { path: '/parent/results', icon: BookOpen, label: 'Results' },
    { path: '/parent/attendance', icon: Clock, label: 'Attendance' },
    { path: '/parent/fees', icon: CreditCard, label: 'Fees' },
    { path: '/parent/announcements', icon: Bell, label: 'News' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-paper border-t border-rule z-50 safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-gold-deep' : 'text-ink-mute/60'
              }`}
            >
              <Icon size={22} className={isActive ? 'scale-110' : ''} />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute top-0 w-12 h-0.5 bg-gold" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// ============================================================================
// APP HEADER
// ============================================================================
function AppHeader({ title, showBack = false }: { title: string; showBack?: boolean }) {
  const navigate = useNavigate();
  const { auth, logout } = useContext(AuthContext);
  const guardian = guardians.find(g => g.id === auth?.guardianId);

  return (
    <header className="sticky top-0 bg-paper border-b border-rule z-40 safe-area-top">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 hover:bg-cream transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 className="text-lg font-semibold text-ink">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gold/10 flex items-center justify-center">
            <span className="text-xs font-bold text-gold-deep">
              {guardian?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

// ============================================================================
// CHILD SELECTOR (App-style tabs)
// ============================================================================
function ChildSelector({ selectedChild, onSelect }: { selectedChild: string; onSelect: (id: string) => void }) {
  const { auth } = useContext(AuthContext);
  const guardian = guardians.find(g => g.id === auth?.guardianId);
  const children = guardian ? getGuardianChildren(guardian.id) : [];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {children.map(child => (
        <button
          key={child.id}
          onClick={() => onSelect(child.id)}
          className={`flex-shrink-0 px-4 py-2 text-sm font-medium transition-all ${
            selectedChild === child.id
              ? 'bg-gold text-white shadow-orange-500/20'
              : 'bg-cream text-ink-mute hover:bg-rule'
          }`}
        >
          {child.name}
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// DASHBOARD
// ============================================================================
function ParentDashboard() {
  const { auth } = useContext(AuthContext);
  const guardian = guardians.find(g => g.id === auth?.guardianId);
  const children = guardian ? getGuardianChildren(guardian.id) : [];
  const [selectedChild, setSelectedChild] = useState(children[0]?.id || '');

  const student = getStudentById(selectedChild);
  const attendanceStats = getAttendanceStats(selectedChild);
  const feeSummary = getFeeSummary(selectedChild);
  const studentResults = results.filter(r => r.studentId === selectedChild);
  const averageScore = studentResults.length > 0
    ? Math.round(studentResults.reduce((sum, r) => sum + r.score, 0) / studentResults.length)
    : 0;

  return (
    <div className="pb-20">
      <AppHeader title="Dashboard" />
      
      <div className="px-4 py-6 space-y-6">
        {/* Child Selector */}
        <ChildSelector selectedChild={selectedChild} onSelect={setSelectedChild} />

        {/* Student Info Card */}
        {student && (
          <div className="bg-gradient-to-br from-gold to-gold-deep p-6 text-white shadow-orange-500/20 animate-fade-in">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-paper/20 flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl font-bold">{student.name.split(' ').map(n => n[0]).join('')}</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">{student.name}</h2>
                <p className="text-sm text-white/80">{student.className} • {student.studentId}</p>
                <p className="text-xs text-white/60 mt-1">{student.programme}</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="border-t-2 border-ink pt-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-cream flex items-center justify-center">
                <TrendingUp size={16} className="text-gold-deep" />
              </div>
              <span className="text-xs font-medium text-ink-mute/80">Average</span>
            </div>
            <p className="text-2xl font-bold text-ink">{averageScore}%</p>
          </div>

          <div className="border-t-2 border-ink pt-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-cream flex items-center justify-center">
                <Check size={16} className="text-gold-deep" />
              </div>
              <span className="text-xs font-medium text-ink-mute/80">Attendance</span>
            </div>
            <p className="text-2xl font-bold text-ink">{attendanceStats.percentage}%</p>
          </div>

          <div className="border-t-2 border-ink pt-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-cream flex items-center justify-center">
                <CreditCard size={16} className="text-gold-deep" />
              </div>
              <span className="text-xs font-medium text-ink-mute/80">Balance</span>
            </div>
            <p className="text-lg font-bold text-ink">{formatCurrency(feeSummary.totalBalance)}</p>
          </div>

          <div className="border-t-2 border-ink pt-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-cream flex items-center justify-center">
                <Bell size={16} className="text-gold-deep" />
              </div>
              <span className="text-xs font-medium text-ink-mute/80">News</span>
            </div>
            <p className="text-2xl font-bold text-ink">{announcements.length}</p>
          </div>
        </div>

        {/* Recent Results */}
        <div className="bg-paper border border-rule">
          <div className="p-4 border-b border-rule flex items-center justify-between">
            <h3 className="font-semibold text-ink">Latest Results</h3>
            <Link to="/parent/results" className="text-sm text-gold-deep font-medium">
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {studentResults.slice(0, 3).map(result => {
              const grade = getGrade(result.score);
              return (
                <div key={result.id} className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-ink-mute">{result.subjectName}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-ink">{result.score}%</span>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                      result.score >= 80 ? 'bg-green-50 text-green-700' :
                      result.score >= 60 ? 'bg-blue-50 text-blue-700' :
                      result.score >= 40 ? 'bg-yellow-50 text-yellow-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      Grade {grade.grade}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-paper border border-rule">
          <div className="p-4 border-b border-rule">
            <h3 className="font-semibold text-ink">Upcoming Events</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {events.slice(0, 3).map(event => (
              <div key={event.id} className="flex items-center gap-3 px-4 py-3">
                <div className="w-10 h-10 bg-cream flex flex-col items-center justify-center">
                  <span className="text-[10px] font-medium text-gold-deep uppercase">
                    {new Date(event.date).toLocaleDateString('en', { month: 'short' })}
                  </span>
                  <span className="text-sm font-bold text-ink leading-none">
                    {new Date(event.date).getDate()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">{event.title}</p>
                  <p className="text-xs text-ink-mute/80">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// RESULTS PAGE
// ============================================================================
function ResultsPage() {
  const { auth } = useContext(AuthContext);
  const guardian = guardians.find(g => g.id === auth?.guardianId);
  const children = guardian ? getGuardianChildren(guardian.id) : [];
  const [selectedChild, setSelectedChild] = useState(children[0]?.id || '');

  const studentResults = results.filter(r => r.studentId === selectedChild);
  const totalScore = studentResults.reduce((sum, r) => sum + r.score, 0);
  const average = studentResults.length > 0 ? Math.round(totalScore / studentResults.length) : 0;

  return (
    <div className="pb-20">
      <AppHeader title="Results" showBack />
      
      <div className="px-4 py-6 space-y-6">
        <ChildSelector selectedChild={selectedChild} onSelect={setSelectedChild} />

        <div className="bg-paper border border-rule">
          <div className="p-4 border-b border-rule">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-ink">Subject Results</h3>
                <p className="text-sm text-ink-mute/80 mt-0.5">Overall Average: <span className="font-medium text-ink">{average}%</span></p>
              </div>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {studentResults.map(result => {
              const grade = getGrade(result.score);
              return (
                <div key={result.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-ink">{result.subjectName}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-ink">{result.score}%</span>
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                        result.score >= 80 ? 'bg-green-50 text-green-700' :
                        result.score >= 60 ? 'bg-blue-50 text-blue-700' :
                        result.score >= 40 ? 'bg-yellow-50 text-yellow-700' :
                        'bg-red-50 text-red-700'
                      }`}>
                        {grade.grade}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-ink-mute/80">
                    <span>Position: {result.position}</span>
                    <span>Class Avg: {result.classAverage}%</span>
                  </div>
                  <p className="text-xs text-ink-mute mt-2 italic">{result.teacherComment}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ATTENDANCE PAGE
// ============================================================================
function AttendancePage() {
  const { auth } = useContext(AuthContext);
  const guardian = guardians.find(g => g.id === auth?.guardianId);
  const children = guardian ? getGuardianChildren(guardian.id) : [];
  const [selectedChild, setSelectedChild] = useState(children[0]?.id || '');

  const stats = getAttendanceStats(selectedChild);
  const records = attendance.filter(a => a.studentId === selectedChild).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="pb-20">
      <AppHeader title="Attendance" showBack />
      
      <div className="px-4 py-6 space-y-6">
        <ChildSelector selectedChild={selectedChild} onSelect={setSelectedChild} />

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-paper p-4 border border-rule">
            <p className="text-3xl font-bold text-green-600">{stats.percentage}%</p>
            <p className="text-xs text-ink-mute/80 mt-1">Attendance Rate</p>
          </div>
          <div className="bg-paper p-4 border border-rule">
            <p className="text-3xl font-bold text-ink">{stats.present}</p>
            <p className="text-xs text-ink-mute/80 mt-1">Days Present</p>
          </div>
          <div className="bg-paper p-4 border border-rule">
            <p className="text-3xl font-bold text-yellow-600">{stats.late}</p>
            <p className="text-xs text-ink-mute/80 mt-1">Days Late</p>
          </div>
          <div className="bg-paper p-4 border border-rule">
            <p className="text-3xl font-bold text-red-600">{stats.absent}</p>
            <p className="text-xs text-ink-mute/80 mt-1">Days Absent</p>
          </div>
        </div>

        {/* History */}
        <div className="bg-paper border border-rule">
          <div className="p-4 border-b border-rule">
            <h3 className="font-semibold text-ink">Attendance History</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {records.map(record => (
              <div key={record.id} className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-ink-mute">
                  {new Date(record.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                </span>
                <span className={`text-xs px-2.5 py-1 font-medium ${
                  record.status === 'present' ? 'bg-green-50 text-green-700' :
                  record.status === 'late' ? 'bg-yellow-50 text-yellow-700' :
                  record.status === 'absent' ? 'bg-red-50 text-red-700' :
                  'bg-blue-50 text-blue-700'
                }`}>
                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FEES PAGE
// ============================================================================
function FeesPage() {
  const { auth } = useContext(AuthContext);
  const guardian = guardians.find(g => g.id === auth?.guardianId);
  const children = guardian ? getGuardianChildren(guardian.id) : [];
  const [selectedChild, setSelectedChild] = useState(children[0]?.id || '');

  const feeSummary = getFeeSummary(selectedChild);
  const fees = feeRecords.filter(f => f.studentId === selectedChild);
  const payments = paymentHistory.filter(p => p.studentId === selectedChild);

  return (
    <div className="pb-20">
      <AppHeader title="Fees" showBack />
      
      <div className="px-4 py-6 space-y-6">
        <ChildSelector selectedChild={selectedChild} onSelect={setSelectedChild} />

        {/* Summary */}
        <div className="bg-gradient-to-br from-gold to-gold-deep p-6 text-white shadow-orange-500/20">
          <p className="text-sm text-white/80 mb-2">Outstanding Balance</p>
          <p className="text-3xl font-bold">{formatCurrency(feeSummary.totalBalance)}</p>
          <div className="flex items-center gap-4 mt-4 text-sm">
            <div>
              <p className="text-white/60">Charged</p>
              <p className="font-semibold">{formatCurrency(feeSummary.totalCharged)}</p>
            </div>
            <div>
              <p className="text-white/60">Paid</p>
              <p className="font-semibold">{formatCurrency(feeSummary.totalPaid)}</p>
            </div>
          </div>
        </div>

        {/* Fee Breakdown */}
        <div className="bg-paper border border-rule">
          <div className="p-4 border-b border-rule">
            <h3 className="font-semibold text-ink">Fee Breakdown</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {fees.map(record => (
              <div key={record.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-ink">{record.category}</span>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                    record.status === 'paid' ? 'bg-green-50 text-green-700' :
                    record.status === 'partial' ? 'bg-yellow-50 text-yellow-700' :
                    'bg-red-50 text-red-700'
                  }`}>
                    {record.status === 'paid' ? 'Paid' : record.status === 'partial' ? 'Partial' : 'Unpaid'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-mute/80">Charged: {formatCurrency(record.charged)}</span>
                  <span className="text-ink-mute/80">Paid: {formatCurrency(record.paid)}</span>
                </div>
                {record.balance > 0 && (
                  <p className="text-sm text-red-600 font-medium mt-1">Balance: {formatCurrency(record.balance)}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-paper border border-rule">
          <div className="p-4 border-b border-rule">
            <h3 className="font-semibold text-ink">Payment History</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {payments.map(payment => (
              <div key={payment.id} className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-ink">{payment.category}</span>
                  <span className="text-sm font-bold text-green-600">{formatCurrency(payment.amount)}</span>
                </div>
                <p className="text-xs text-ink-mute/80">
                  {new Date(payment.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} • {payment.method}
                </p>
                <p className="text-xs text-ink-mute/60 mt-1">Ref: {payment.reference}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ANNOUNCEMENTS PAGE
// ============================================================================
function AnnouncementsPage() {
  return (
    <div className="pb-20">
      <AppHeader title="Announcements" showBack />
      
      <div className="px-4 py-6 space-y-4">
        {announcements.map(ann => (
          <div
            key={ann.id}
            className="bg-paper border border-rule p-4 animate-fade-in"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-gold-deep" />
                <span className="text-xs font-medium text-gold-deep">
                  {ann.audience === 'all' ? 'All Parents' : ann.audience.toUpperCase()}
                </span>
              </div>
              <span className="text-xs text-ink-mute/60">
                {new Date(ann.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </span>
            </div>
            <h3 className="font-semibold text-ink mb-1">{ann.title}</h3>
            <p className="text-sm text-ink-mute">{ann.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// PARENT LAYOUT
// ============================================================================
function ParentLayout({ children }: { children: ReactNode }) {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!auth) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-cream">
      {children}
      <BottomNav />
    </div>
  );
}

// ============================================================================
// EXPORT
// ============================================================================
export { AuthProvider, ParentLayout, ParentDashboard, ResultsPage, AttendancePage, FeesPage, AnnouncementsPage };
