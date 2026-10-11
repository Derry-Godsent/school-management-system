import { useState, createContext, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  school, students, guardians, demoUsers, results, attendance, feeRecords,
  paymentHistory, timetable, announcements, events, academicYear,
  getStudentById, getClassById, getGuardianChildren, getAttendanceStats,
  getFeeSummary, getGrade, formatCurrency,
} from '../data';
import {
  LogOut, ChevronDown, BookOpen, Calendar, CreditCard, Clock,
  Bell, FileText, Home, Users, TrendingUp, AlertCircle, Check, X,
  ChevronRight, Download, Eye, Menu, ArrowLeft,
} from 'lucide-react';

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

function AuthProvider({ children }: { children: React.ReactNode }) {
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#E85D04] rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-sm">MG</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Parent Portal</h1>
          <p className="text-sm text-gray-500 mt-1">{school.name}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04]"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04]"
                placeholder="Enter password"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-[#E85D04] text-white font-medium rounded-lg hover:bg-[#DC4A03] transition-colors"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 pt-6 border-t">
            <p className="text-xs text-gray-500 text-center mb-2">Demo Credentials</p>
            <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 space-y-1">
              <p><span className="font-medium">Email:</span> parent@demo.com</p>
              <p><span className="font-medium">Password:</span> demo123</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Back to school website
          </Link>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// PARENT LAYOUT
// ============================================================================
function ParentLayout({ children }: { children: React.ReactNode }) {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!auth) {
    return <LoginPage />;
  }

  const guardian = guardians.find(g => g.id === auth.guardianId);
  const guardianChildren = guardian ? getGuardianChildren(guardian.id) : [];

  const navItems = [
    { path: '/parent', icon: <Home size={18} />, label: 'Dashboard' },
    { path: '/parent/results', icon: <BookOpen size={18} />, label: 'Results' },
    { path: '/parent/attendance', icon: <Clock size={18} />, label: 'Attendance' },
    { path: '/parent/fees', icon: <CreditCard size={18} />, label: 'Fees' },
    { path: '/parent/timetable', icon: <Calendar size={18} />, label: 'Timetable' },
    { path: '/parent/announcements', icon: <Bell size={18} />, label: 'Announcements' },
    { path: '/parent/report-card', icon: <FileText size={18} />, label: 'Report Card' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-gray-600">
                <Menu size={20} />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#E85D04] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">MG</span>
                </div>
                <span className="font-semibold text-sm text-gray-900 hidden sm:block">Parent Portal</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden sm:block">{guardian?.name}</span>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
              >
                <LogOut size={16} />
                <span className="hidden sm:block">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className={`${mobileMenuOpen ? 'fixed inset-0 z-50 bg-white p-4' : 'hidden'} lg:block lg:relative lg:w-56 shrink-0`}>
            {mobileMenuOpen && (
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <span className="font-semibold text-sm">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)}><X size={20} /></button>
              </div>
            )}
            <nav className="space-y-1">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-[#E85D04]/10 text-[#E85D04]'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-8 pt-6 border-t">
              <Link to="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
                <ArrowLeft size={14} />
                School Website
              </Link>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// CHILD SELECTOR
// ============================================================================
function ChildSelector({ selectedChild, onSelect }: { selectedChild: string; onSelect: (id: string) => void }) {
  const { auth } = useContext(AuthContext);
  const guardian = guardians.find(g => g.id === auth?.guardianId);
  const children = guardian ? getGuardianChildren(guardian.id) : [];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {children.map(child => {
        const cls = getClassById(child.classId);
        return (
          <button
            key={child.id}
            onClick={() => onSelect(child.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedChild === child.id
                ? 'bg-[#E85D04] text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-[#E85D04]/30'
            }`}
          >
            {child.name} <span className="opacity-70">({cls?.name})</span>
          </button>
        );
      })}
    </div>
  );
}

// ============================================================================
// PARENT DASHBOARD
// ============================================================================
function ParentDashboard() {
  const { auth } = useContext(AuthContext);
  const guardian = guardians.find(g => g.id === auth?.guardianId);
  const children = guardian ? getGuardianChildren(guardian.id) : [];
  const [selectedChild, setSelectedChild] = useState(children[0]?.id || '');

  const student = getStudentById(selectedChild);
  const cls = student ? getClassById(student.classId) : null;
  const attendanceStats = getAttendanceStats(selectedChild);
  const feeSummary = getFeeSummary(selectedChild);
  const studentResults = results.filter(r => r.studentId === selectedChild);
  const averageScore = studentResults.length > 0
    ? Math.round(studentResults.reduce((sum, r) => sum + r.score, 0) / studentResults.length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">{academicYear.terms.find(t => t.id === academicYear.currentTerm)?.name} • {academicYear.name}</p>
        </div>
        <ChildSelector selectedChild={selectedChild} onSelect={setSelectedChild} />
      </div>

      {/* Student Info Card */}
      {student && (
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#E85D04]/10 rounded-full flex items-center justify-center">
              <span className="text-[#E85D04] font-bold">{student.name.split(' ').map(n => n[0]).join('')}</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{student.name}</h2>
              <p className="text-sm text-gray-500">{cls?.name} • {student.studentId} • {student.programme}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
              <TrendingUp size={16} className="text-blue-600" />
            </div>
            <span className="text-xs font-medium text-gray-500 uppercase">Average Score</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{averageScore}%</p>
          <p className="text-xs text-gray-500 mt-1">Term 1, 2025/2026</p>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
              <Check size={16} className="text-green-600" />
            </div>
            <span className="text-xs font-medium text-gray-500 uppercase">Attendance</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{attendanceStats.percentage}%</p>
          <p className="text-xs text-gray-500 mt-1">{attendanceStats.absent} absence(s) recorded</p>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center">
              <CreditCard size={16} className="text-[#E85D04]" />
            </div>
            <span className="text-xs font-medium text-gray-500 uppercase">Fee Balance</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(feeSummary.totalBalance)}</p>
          <p className="text-xs text-gray-500 mt-1">Term 2 outstanding</p>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center">
              <Bell size={16} className="text-purple-600" />
            </div>
            <span className="text-xs font-medium text-gray-500 uppercase">Announcements</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{announcements.length}</p>
          <p className="text-xs text-gray-500 mt-1">Active notices</p>
        </div>
      </div>

      {/* Recent Results */}
      <div className="bg-white rounded-xl border">
        <div className="p-5 border-b flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Latest Results</h3>
          <Link to="/parent/results" className="text-sm text-[#E85D04] font-medium">View all</Link>
        </div>
        <div className="divide-y">
          {studentResults.slice(0, 4).map(result => {
            const grade = getGrade(result.score);
            return (
              <div key={result.id} className="flex items-center justify-between px-5 py-3">
                <span className="text-sm text-gray-700">{result.subjectName}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-900">{result.score}%</span>
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
      <div className="bg-white rounded-xl border">
        <div className="p-5 border-b">
          <h3 className="font-semibold text-gray-900">Upcoming Events</h3>
        </div>
        <div className="divide-y">
          {events.slice(0, 3).map(event => (
            <div key={event.id} className="flex items-center gap-4 px-5 py-3">
              <div className="w-10 h-10 bg-gray-50 rounded-lg flex flex-col items-center justify-center shrink-0">
                <span className="text-[10px] font-medium text-[#E85D04] uppercase">
                  {new Date(event.date).toLocaleDateString('en', { month: 'short' })}
                </span>
                <span className="text-sm font-bold text-gray-900 leading-none">
                  {new Date(event.date).getDate()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{event.title}</p>
                <p className="text-xs text-gray-500">{event.time}</p>
              </div>
            </div>
          ))}
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Academic Results</h1>
          <p className="text-sm text-gray-500 mt-0.5">Term 1, 2025/2026 Academic Year</p>
        </div>
        <ChildSelector selectedChild={selectedChild} onSelect={setSelectedChild} />
      </div>

      <div className="bg-white rounded-xl border">
        <div className="p-5 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Subject Results</h3>
              <p className="text-sm text-gray-500 mt-0.5">Overall Average: <span className="font-medium text-gray-900">{average}%</span></p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Subject</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-gray-500 uppercase">Score</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-gray-500 uppercase">Grade</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-gray-500 uppercase">Position</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-gray-500 uppercase">Class Avg</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Comment</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {studentResults.map(result => {
                const grade = getGrade(result.score);
                return (
                  <tr key={result.id}>
                    <td className="px-5 py-3 text-sm font-medium text-gray-900">{result.subjectName}</td>
                    <td className="px-5 py-3 text-sm text-center font-medium text-gray-900">{result.score}%</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                        result.score >= 80 ? 'bg-green-50 text-green-700' :
                        result.score >= 60 ? 'bg-blue-50 text-blue-700' :
                        result.score >= 40 ? 'bg-yellow-50 text-yellow-700' :
                        'bg-red-50 text-red-700'
                      }`}>
                        {grade.grade} ({grade.remark})
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-center text-gray-600">{result.position}</td>
                    <td className="px-5 py-3 text-sm text-center text-gray-600">{result.classAverage}%</td>
                    <td className="px-5 py-3 text-sm text-gray-600 hidden md:table-cell">{result.teacherComment}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="text-sm text-gray-500 mt-0.5">Attendance record and summary</p>
        </div>
        <ChildSelector selectedChild={selectedChild} onSelect={setSelectedChild} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-5 text-center">
          <p className="text-3xl font-bold text-green-600">{stats.percentage}%</p>
          <p className="text-xs text-gray-500 mt-1">Attendance Rate</p>
        </div>
        <div className="bg-white rounded-xl border p-5 text-center">
          <p className="text-3xl font-bold text-gray-900">{stats.present}</p>
          <p className="text-xs text-gray-500 mt-1">Days Present</p>
        </div>
        <div className="bg-white rounded-xl border p-5 text-center">
          <p className="text-3xl font-bold text-yellow-600">{stats.late}</p>
          <p className="text-xs text-gray-500 mt-1">Days Late</p>
        </div>
        <div className="bg-white rounded-xl border p-5 text-center">
          <p className="text-3xl font-bold text-red-600">{stats.absent}</p>
          <p className="text-xs text-gray-500 mt-1">Days Absent</p>
        </div>
      </div>

      {/* History */}
      <div className="bg-white rounded-xl border">
        <div className="p-5 border-b">
          <h3 className="font-semibold text-gray-900">Attendance History</h3>
        </div>
        <div className="divide-y">
          {records.map(record => (
            <div key={record.id} className="flex items-center justify-between px-5 py-3">
              <span className="text-sm text-gray-700">
                {new Date(record.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
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
  const feeRecords_ = feeRecords.filter(f => f.studentId === selectedChild);
  const payments = paymentHistory.filter(p => p.studentId === selectedChild);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fees & Payments</h1>
          <p className="text-sm text-gray-500 mt-0.5">Term 2, 2025/2026</p>
        </div>
        <ChildSelector selectedChild={selectedChild} onSelect={setSelectedChild} />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-5">
          <p className="text-xs font-medium text-gray-500 uppercase mb-2">Total Charged</p>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(feeSummary.totalCharged)}</p>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <p className="text-xs font-medium text-gray-500 uppercase mb-2">Total Paid</p>
          <p className="text-xl font-bold text-green-600">{formatCurrency(feeSummary.totalPaid)}</p>
        </div>
        <div className={`rounded-xl border p-5 ${feeSummary.totalBalance > 0 ? 'bg-red-50 border-red-100' : 'bg-white'}`}>
          <p className="text-xs font-medium text-gray-500 uppercase mb-2">Outstanding Balance</p>
          <p className={`text-xl font-bold ${feeSummary.totalBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {formatCurrency(feeSummary.totalBalance)}
          </p>
        </div>
      </div>

      {/* Fee Breakdown */}
      <div className="bg-white rounded-xl border">
        <div className="p-5 border-b">
          <h3 className="font-semibold text-gray-900">Fee Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Charged</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Paid</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Balance</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {feeRecords_.map(record => (
                <tr key={record.id}>
                  <td className="px-5 py-3 text-sm font-medium text-gray-900">{record.category}</td>
                  <td className="px-5 py-3 text-sm text-right text-gray-700">{formatCurrency(record.charged)}</td>
                  <td className="px-5 py-3 text-sm text-right text-gray-700">{formatCurrency(record.paid)}</td>
                  <td className="px-5 py-3 text-sm text-right font-medium text-gray-900">{formatCurrency(record.balance)}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                      record.status === 'paid' ? 'bg-green-50 text-green-700' :
                      record.status === 'partial' ? 'bg-yellow-50 text-yellow-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {record.status === 'paid' ? 'Paid' : record.status === 'partial' ? 'Partial' : 'Unpaid'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-xl border">
        <div className="p-5 border-b">
          <h3 className="font-semibold text-gray-900">Payment History</h3>
        </div>
        <div className="divide-y">
          {payments.map(payment => (
            <div key={payment.id} className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">{payment.category}</p>
                <p className="text-xs text-gray-500">{new Date(payment.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} • {payment.method} • Ref: {payment.reference}</p>
              </div>
              <span className="text-sm font-medium text-green-600">{formatCurrency(payment.amount)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// TIMETABLE PAGE
// ============================================================================
function TimetablePage() {
  const { auth } = useContext(AuthContext);
  const guardian = guardians.find(g => g.id === auth?.guardianId);
  const children = guardian ? getGuardianChildren(guardian.id) : [];
  const [selectedChild, setSelectedChild] = useState(children[0]?.id || '');

  const student = getStudentById(selectedChild);
  const isJHS = student?.classId.startsWith('jhs');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Timetable</h1>
          <p className="text-sm text-gray-500 mt-0.5">Weekly class schedule</p>
        </div>
        <ChildSelector selectedChild={selectedChild} onSelect={setSelectedChild} />
      </div>

      {isJHS ? (
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Day</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Subject</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Teacher</th>
                </tr>
              </thead>
              <tbody>
                {timetable.map(day => (
                  day.periods.map((period, pi) => (
                    <tr key={`${day.day}-${pi}`} className={pi === 0 ? 'border-t-2 border-gray-200' : ''}>
                      {pi === 0 && (
                        <td rowSpan={day.periods.length} className="px-4 py-3 text-sm font-semibold text-gray-900 bg-gray-50/50 align-top border-r">
                          {day.day}
                        </td>
                      )}
                      <td className="px-4 py-2.5 text-xs text-gray-500">{period.time}</td>
                      <td className="px-4 py-2.5 text-sm font-medium text-gray-900">{period.subject}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-600 hidden md:table-cell">{period.teacher}</td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border p-8 text-center">
          <Calendar size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Timetable for this class will be displayed here once configured by the school.</p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ANNOUNCEMENTS PAGE
// ============================================================================
function AnnouncementsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
        <p className="text-sm text-gray-500 mt-0.5">School notices and updates</p>
      </div>

      <div className="space-y-4">
        {announcements.map(ann => (
          <div key={ann.id} className="bg-white rounded-xl border p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Bell size={14} className="text-[#E85D04]" />
                  <span className="text-xs font-medium text-[#E85D04]">{ann.audience === 'all' ? 'All Parents' : ann.audience === 'parents' ? 'Parents' : ann.audience.toUpperCase()}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{ann.title}</h3>
                <p className="text-sm text-gray-600">{ann.content}</p>
              </div>
              <span className="text-xs text-gray-400 shrink-0">
                {new Date(ann.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// REPORT CARD PAGE
// ============================================================================
function ReportCardPage() {
  const { auth } = useContext(AuthContext);
  const guardian = guardians.find(g => g.id === auth?.guardianId);
  const children = guardian ? getGuardianChildren(guardian.id) : [];
  const [selectedChild, setSelectedChild] = useState(children[0]?.id || '');

  const student = getStudentById(selectedChild);
  const cls = student ? getClassById(student.classId) : null;
  const studentResults = results.filter(r => r.studentId === selectedChild);
  const stats = getAttendanceStats(selectedChild);
  const totalScore = studentResults.reduce((sum, r) => sum + r.score, 0);
  const average = studentResults.length > 0 ? Math.round(totalScore / studentResults.length) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Report Card</h1>
          <p className="text-sm text-gray-500 mt-0.5">Term 1, 2025/2026</p>
        </div>
        <div className="flex items-center gap-3">
          <ChildSelector selectedChild={selectedChild} onSelect={setSelectedChild} />
          <button className="flex items-center gap-2 px-4 py-2 bg-[#E85D04] text-white text-sm font-medium rounded-lg hover:bg-[#DC4A03] transition-colors">
            <Download size={14} />
            Download PDF
          </button>
        </div>
      </div>

      {/* Report Card */}
      <div className="bg-white rounded-xl border p-6 sm:p-8">
        {/* Header */}
        <div className="text-center border-b pb-6 mb-6">
          <div className="w-14 h-14 bg-[#E85D04] rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold">MG</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">{school.name}</h2>
          <p className="text-sm text-gray-500">{school.address}</p>
          <p className="text-sm text-gray-500 mt-1">{school.motto}</p>
          <div className="mt-4 inline-block px-4 py-1.5 bg-gray-100 rounded-lg">
            <span className="text-sm font-medium text-gray-700">TERMINAL REPORT CARD</span>
          </div>
        </div>

        {/* Student Info */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-xs text-gray-500">Name</p>
            <p className="text-sm font-medium text-gray-900">{student?.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Student ID</p>
            <p className="text-sm font-medium text-gray-900">{student?.studentId}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Class</p>
            <p className="text-sm font-medium text-gray-900">{cls?.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Term</p>
            <p className="text-sm font-medium text-gray-900">Term 1, 2025/2026</p>
          </div>
        </div>

        {/* Results Table */}
        <table className="w-full mb-6">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase">Subject</th>
              <th className="text-center py-2 text-xs font-medium text-gray-500 uppercase">Score</th>
              <th className="text-center py-2 text-xs font-medium text-gray-500 uppercase">Grade</th>
              <th className="text-center py-2 text-xs font-medium text-gray-500 uppercase">Position</th>
              <th className="text-center py-2 text-xs font-medium text-gray-500 uppercase">Class Avg</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {studentResults.map(r => {
              const grade = getGrade(r.score);
              return (
                <tr key={r.id}>
                  <td className="py-2.5 text-sm text-gray-900">{r.subjectName}</td>
                  <td className="py-2.5 text-sm text-center font-medium">{r.score}%</td>
                  <td className="py-2.5 text-sm text-center">{grade.grade} ({grade.remark})</td>
                  <td className="py-2.5 text-sm text-center">{r.position}</td>
                  <td className="py-2.5 text-sm text-center">{r.classAverage}%</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-200">
              <td className="py-3 text-sm font-semibold text-gray-900">Average</td>
              <td className="py-3 text-sm text-center font-bold text-[#E85D04]">{average}%</td>
              <td colSpan={3} className="py-3 text-sm text-center text-gray-500">
                {average >= 80 ? 'Excellent' : average >= 70 ? 'Very Good' : average >= 60 ? 'Good' : 'Satisfactory'}
              </td>
            </tr>
          </tfoot>
        </table>

        {/* Additional Info */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Attendance</p>
            <p className="text-sm font-medium text-gray-900">{stats.percentage}% ({stats.present} present out of {stats.total} days)</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Programme</p>
            <p className="text-sm font-medium text-gray-900">{student?.programme}</p>
          </div>
        </div>

        {/* Comments */}
        <div className="space-y-4 border-t pt-6">
          <div>
            <p className="text-xs text-gray-500 mb-1">Class Teacher's Comment</p>
            <p className="text-sm text-gray-700 italic">
              A hardworking student who shows great promise. Continue to put in the same effort and even greater results will follow.
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Headteacher's Comment</p>
            <p className="text-sm text-gray-700 italic">
              Good performance overall. Keep up the good work and aim higher next term.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t flex items-center justify-between text-xs text-gray-400">
          <span>Issued: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <span>{school.name}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXPORT
// ============================================================================
export { AuthProvider, ParentLayout, ParentDashboard, ResultsPage, AttendancePage, FeesPage, TimetablePage, AnnouncementsPage, ReportCardPage };
