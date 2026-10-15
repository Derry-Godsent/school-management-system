import { useState, createContext, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  school, students, staff, classes, departments, results, attendance,
  feeRecords, paymentHistory, admissionApplications, announcements, events,
  news, academicYear, getStudentById, getClassById, getGrade, getFeeSummary,
  formatCurrency,
} from '../data';
import {
  LogOut, Home, Users, GraduationCap, CreditCard, FileText, Clock,
  Bell, Settings, Menu, X, ChevronRight, AlertCircle, Check, TrendingUp,
  Eye, Search, Filter, Plus, ArrowLeft, BarChart3, UserCheck, UserX,
  ClipboardList, DollarSign,
} from 'lucide-react';

// ============================================================================
// AUTH CONTEXT
// ============================================================================
interface AdminAuth {
  email: string;
  staffId: string;
}

const AdminAuthContext = createContext<{
  auth: AdminAuth | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}>({ auth: null, login: () => false, logout: () => {} });

function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AdminAuth | null>(null);

  const login = (email: string, password: string) => {
    if (email === 'admin@demo.com' && password === 'demo123') {
      setAuth({ email, staffId: 'admin-1' });
      return true;
    }
    return false;
  };

  const logout = () => setAuth(null);

  return (
    <AdminAuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

// ============================================================================
// LOGIN
// ============================================================================
function AdminLoginPage() {
  const { login } = useContext(AdminAuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@demo.com');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate('/admin');
    } else {
      setError('Invalid credentials. Use the demo account below.');
    }
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gold flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-sm">MG</span>
          </div>
          <h1 className="text-2xl font-bold text-white">School Management</h1>
          <p className="text-sm text-ink-mute/60 mt-1">{school.name}</p>
        </div>

        <div className="bg-paper p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-sm text-red-700">{error}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-ink-mute mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-rule text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-mute mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-rule text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold"
              />
            </div>
            <button type="submit" className="w-full py-3.5 bg-gold text-white font-medium hover:bg-gold-deep transition-colors">
              Sign In
            </button>
          </form>
          <div className="mt-6 pt-6 border-t">
            <p className="text-xs text-ink-mute/80 text-center mb-2">Demo Credentials</p>
            <div className="bg-cream p-3 text-xs text-ink-mute space-y-1">
              <p><span className="font-medium">Email:</span> admin@demo.com</p>
              <p><span className="font-medium">Password:</span> demo123</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-ink-mute/80 hover:text-paper/40">← Back to school website</Link>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ADMIN LAYOUT
// ============================================================================
function AdminLayout({ children }: { children: React.ReactNode }) {
  const { auth, logout } = useContext(AdminAuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!auth) {
    return <AdminLoginPage />;
  }

  const staffMember = staff.find(s => s.id === auth.staffId);

  const navItems = [
    { path: '/admin', icon: <Home size={18} />, label: 'Dashboard' },
    { path: '/admin/students', icon: <Users size={18} />, label: 'Students' },
    { path: '/admin/admissions', icon: <GraduationCap size={18} />, label: 'Admissions' },
    { path: '/admin/fees', icon: <CreditCard size={18} />, label: 'Fees' },
    { path: '/admin/results', icon: <FileText size={18} />, label: 'Results' },
    { path: '/admin/attendance', icon: <Clock size={18} />, label: 'Attendance' },
    { path: '/admin/communications', icon: <Bell size={18} />, label: 'Communications' },
  ];

  const pendingAdmissions = admissionApplications.filter(a => a.status === 'pending').length;

  return (
    <div className="min-h-screen bg-cream">
      {/* Top Bar */}
      <header className="bg-paper border-b sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-ink-mute">
                <Menu size={20} />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gold flex items-center justify-center">
                  <span className="text-white font-bold text-xs">MG</span>
                </div>
                <div className="hidden sm:block">
                  <span className="font-semibold text-sm text-ink">Management</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-ink">{staffMember?.name}</p>
                <p className="text-xs text-ink-mute/80">{staffMember?.title}</p>
              </div>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="flex items-center gap-2 text-sm text-ink-mute/80 hover:text-ink-mute"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile Menu Backdrop */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className={`${mobileMenuOpen ? 'fixed inset-y-0 left-0 z-50 w-72 bg-paper p-6 overflow-y-auto' : 'hidden'} lg:block lg:relative lg:w-60 shrink-0 transition-transform`}>
            {mobileMenuOpen && (
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <span className="font-semibold text-sm">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-cream">
                  <X size={20} />
                </button>
              </div>
            )}
            <nav className="space-y-1">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-3 text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-gold/10 text-gold-deep'
                      : 'text-ink-mute hover:bg-cream'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    {item.label}
                  </div>
                  {item.path === '/admin/admissions' && pendingAdmissions > 0 && (
                    <span className="w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center">
                      {pendingAdmissions}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
            <div className="mt-8 pt-6 border-t">
              <Link to="/" className="flex items-center gap-2 text-sm text-ink-mute/80 hover:text-ink-mute py-2">
                <ArrowLeft size={14} />
                School Website
              </Link>
              <Link to="/parent" className="flex items-center gap-2 text-sm text-ink-mute/80 hover:text-ink-mute mt-3 py-2">
                <ArrowLeft size={14} />
                Parent Portal
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
// ADMIN DASHBOARD - ATTENTION CENTRE
// ============================================================================
function AdminDashboard() {
  const pendingApps = admissionApplications.filter(a => a.status === 'pending');
  const underReviewApps = admissionApplications.filter(a => a.status === 'under_review');
  const totalStudents = students.length;
  const studentsWithDebt = students.filter(s => {
    const summary = getFeeSummary(s.id);
    return summary.totalBalance > 0;
  });
  const totalOutstanding = students.reduce((sum, s) => sum + getFeeSummary(s.id).totalBalance, 0);
  const recentPayments = paymentHistory.slice(-5).reverse();
  const attendanceIssues = students.filter(s => {
    const records = attendance.filter(a => a.studentId === s.id);
    const absent = records.filter(r => r.status === 'absent').length;
    return absent >= 2;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Attention Centre</h1>
        <p className="text-sm text-ink-mute/80 mt-0.5">What needs your focus right now</p>
      </div>

      {/* Attention Items */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Link to="/admin/admissions" className="bg-paper border p-4 sm:p-5 hover:border-gold/30 active:bg-cream transition-colors min-h-[120px] flex flex-col justify-between">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-red-50 flex items-center justify-center shrink-0">
              <ClipboardList size={14} className="sm:hidden text-red-600" />
              <ClipboardList size={16} className="hidden sm:block text-red-600" />
            </div>
            <span className="text-[10px] sm:text-xs font-medium text-ink-mute/80 uppercase leading-tight">Pending Admissions</span>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-ink">{pendingApps.length}</p>
            <p className="text-[10px] sm:text-xs text-ink-mute/80 mt-0.5 sm:mt-1">awaiting review</p>
          </div>
        </Link>

        <div className="bg-paper border p-4 sm:p-5 min-h-[120px] flex flex-col justify-between">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-orange-50 flex items-center justify-center shrink-0">
              <DollarSign size={14} className="sm:hidden text-gold-deep" />
              <DollarSign size={16} className="hidden sm:block text-gold-deep" />
            </div>
            <span className="text-[10px] sm:text-xs font-medium text-ink-mute/80 uppercase leading-tight">Outstanding Fees</span>
          </div>
          <div>
            <p className="text-lg sm:text-2xl font-bold text-ink truncate">{formatCurrency(totalOutstanding)}</p>
            <p className="text-[10px] sm:text-xs text-ink-mute/80 mt-0.5 sm:mt-1">{studentsWithDebt.length} student(s)</p>
          </div>
        </div>

        <div className="bg-paper border p-4 sm:p-5 min-h-[120px] flex flex-col justify-between">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-yellow-50 flex items-center justify-center shrink-0">
              <UserX size={14} className="sm:hidden text-yellow-600" />
              <UserX size={16} className="hidden sm:block text-yellow-600" />
            </div>
            <span className="text-[10px] sm:text-xs font-medium text-ink-mute/80 uppercase leading-tight">Attendance Issues</span>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-ink">{attendanceIssues.length}</p>
            <p className="text-[10px] sm:text-xs text-ink-mute/80 mt-0.5 sm:mt-1">2+ absences</p>
          </div>
        </div>

        <div className="bg-paper border p-4 sm:p-5 min-h-[120px] flex flex-col justify-between">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-green-50 flex items-center justify-center shrink-0">
              <UserCheck size={14} className="sm:hidden text-green-600" />
              <UserCheck size={16} className="hidden sm:block text-green-600" />
            </div>
            <span className="text-[10px] sm:text-xs font-medium text-ink-mute/80 uppercase leading-tight">Total Students</span>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-ink">{totalStudents}</p>
            <p className="text-[10px] sm:text-xs text-ink-mute/80 mt-0.5 sm:mt-1">enrolled</p>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Actions */}
        <div className="bg-paper border">
          <div className="p-5 border-b">
            <h3 className="font-semibold text-ink flex items-center gap-2">
              <AlertCircle size={16} className="text-gold-deep" />
              Items Requiring Attention
            </h3>
          </div>
          <div className="divide-y">
            {pendingApps.length > 0 && (
              <Link to="/admin/admissions" className="flex items-center justify-between px-5 py-3 hover:bg-cream">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500" />
                  <span className="text-sm text-ink-mute">{pendingApps.length} admission applications pending review</span>
                </div>
                <ChevronRight size={14} className="text-ink-mute/60" />
              </Link>
            )}
            {studentsWithDebt.length > 0 && (
              <Link to="/admin/fees" className="flex items-center justify-between px-5 py-3 hover:bg-cream">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500" />
                  <span className="text-sm text-ink-mute">{studentsWithDebt.length} students with outstanding fee balances</span>
                </div>
                <ChevronRight size={14} className="text-ink-mute/60" />
              </Link>
            )}
            {attendanceIssues.length > 0 && (
              <Link to="/admin/attendance" className="flex items-center justify-between px-5 py-3 hover:bg-cream">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500" />
                  <span className="text-sm text-ink-mute">{attendanceIssues.length} students with attendance concerns</span>
                </div>
                <ChevronRight size={14} className="text-ink-mute/60" />
              </Link>
            )}
            <div className="flex items-center justify-between px-5 py-3 hover:bg-cream">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500" />
                <span className="text-sm text-ink-mute">PTA Meeting in 2 weeks (Feb 15)</span>
              </div>
              <ChevronRight size={14} className="text-ink-mute/60" />
            </div>
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-paper border">
          <div className="p-5 border-b">
            <h3 className="font-semibold text-ink">Recent Payments</h3>
          </div>
          <div className="divide-y">
            {recentPayments.map(payment => {
              const student = getStudentById(payment.studentId);
              return (
                <div key={payment.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-ink">{student?.name}</p>
                    <p className="text-xs text-ink-mute/80">{payment.category} • {payment.method}</p>
                  </div>
                  <span className="text-sm font-medium text-green-600">{formatCurrency(payment.amount)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-paper border p-5">
        <h3 className="font-semibold text-ink mb-4">School Overview</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-cream">
            <p className="text-xl font-bold text-ink">{classes.length}</p>
            <p className="text-xs text-ink-mute/80 mt-1">Classes</p>
          </div>
          <div className="text-center p-4 bg-cream">
            <p className="text-xl font-bold text-ink">{staff.filter(s => s.role === 'Teacher').length}</p>
            <p className="text-xs text-ink-mute/80 mt-1">Teachers</p>
          </div>
          <div className="text-center p-4 bg-cream">
            <p className="text-xl font-bold text-ink">{academicYear.terms.find(t => t.id === academicYear.currentTerm)?.name}</p>
            <p className="text-xs text-ink-mute/80 mt-1">Current Term</p>
          </div>
          <div className="text-center p-4 bg-cream">
            <p className="text-xl font-bold text-ink">{events.filter(e => new Date(e.date) > new Date()).length}</p>
            <p className="text-xs text-ink-mute/80 mt-1">Upcoming Events</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// STUDENTS PAGE
// ============================================================================
function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');

  const filtered = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || s.classId === selectedClass;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Students</h1>
          <p className="text-sm text-ink-mute/80 mt-0.5">{students.length} students enrolled</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-gold text-white text-sm font-medium hover:bg-gold-deep transition-colors">
          <Plus size={16} />
          Add Student
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-mute/60" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by name or student ID..."
            className="w-full pl-9 pr-4 py-2.5 border border-rule text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold"
          />
        </div>
        <select
          value={selectedClass}
          onChange={e => setSelectedClass(e.target.value)}
          className="px-4 py-2.5 border border-rule text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold"
        >
          <option value="all">All Classes</option>
          {classes.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-paper border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-cream">
                <th className="text-left px-5 py-3 text-xs font-medium text-ink-mute/80 uppercase">Student</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-ink-mute/80 uppercase">ID</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-ink-mute/80 uppercase">Class</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-ink-mute/80 uppercase hidden md:table-cell">Programme</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-ink-mute/80 uppercase hidden lg:table-cell">Guardian</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-ink-mute/80 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(student => {
                const cls = getClassById(student.classId);
                const guardian = students.find(s => s.id === student.id);
                return (
                  <tr key={student.id} className="hover:bg-cream">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-cream flex items-center justify-center">
                          <span className="text-xs font-medium text-ink-mute">{student.name.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <span className="text-sm font-medium text-ink">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-ink-mute">{student.studentId}</td>
                    <td className="px-5 py-3 text-sm text-ink-mute">{cls?.name}</td>
                    <td className="px-5 py-3 text-sm text-ink-mute hidden md:table-cell">{student.programme}</td>
                    <td className="px-5 py-3 text-sm text-ink-mute hidden lg:table-cell">
                      {student.guardianId ? 'Linked' : 'Not linked'}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className="text-xs px-2 py-0.5 rounded font-medium bg-green-50 text-green-700">Active</span>
                    </td>
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
// ADMISSIONS PAGE
// ============================================================================
function AdmissionsPage() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? admissionApplications
    : admissionApplications.filter(a => a.status === filter);

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-700',
    under_review: 'bg-blue-50 text-blue-700',
    accepted: 'bg-green-50 text-green-700',
    rejected: 'bg-red-50 text-red-700',
  };

  const statusLabels: Record<string, string> = {
    pending: 'Pending',
    under_review: 'Under Review',
    accepted: 'Accepted',
    rejected: 'Rejected',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Admissions</h1>
          <p className="text-sm text-ink-mute/80 mt-0.5">{admissionApplications.length} total applications</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { value: 'all', label: 'All' },
          { value: 'pending', label: 'Pending' },
          { value: 'under_review', label: 'Under Review' },
          { value: 'accepted', label: 'Accepted' },
        ].map(tab => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              filter === tab.value
                ? 'bg-gold text-white'
                : 'bg-paper border border-rule text-ink-mute hover:border-gold/30'
            }`}
          >
            {tab.label}
            {tab.value === 'pending' && (
              <span className="ml-1.5 text-xs opacity-70">
                ({admissionApplications.filter(a => a.status === 'pending').length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Applications */}
      <div className="space-y-4">
        {filtered.map(app => (
          <div key={app.id} className="bg-paper border p-5">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-ink">{app.childName}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${statusColors[app.status]}`}>
                    {statusLabels[app.status]}
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-1 text-sm text-ink-mute">
                  <p>Applying for: <span className="font-medium text-ink">{app.applyingFor}</span></p>
                  <p>DOB: {new Date(app.dob).toLocaleDateString('en-GB')}</p>
                  <p>Parent: {app.parentName}</p>
                  <p>Phone: {app.parentPhone}</p>
                  <p>Email: {app.parentEmail}</p>
                  <p>Submitted: {new Date(app.date).toLocaleDateString('en-GB')}</p>
                </div>
                {app.notes && (
                  <p className="text-sm text-ink-mute/80 mt-2 italic">Note: {app.notes}</p>
                )}
              </div>
              {app.status === 'pending' && (
                <div className="flex gap-2 shrink-0">
                  <button className="px-3 py-2 bg-green-50 text-green-700 text-xs font-medium hover:bg-green-100 transition-colors">
                    Accept
                  </button>
                  <button className="px-3 py-2 bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100 transition-colors">
                    Review
                  </button>
                  <button className="px-3 py-2 bg-red-50 text-red-700 text-xs font-medium hover:bg-red-100 transition-colors">
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// FEES PAGE
// ============================================================================
function AdminFeesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const studentFeeData = students.map(s => {
    const summary = getFeeSummary(s.id);
    const cls = getClassById(s.classId);
    return { ...s, classInfo: cls, ...summary };
  }).filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalCharged = studentFeeData.reduce((sum, s) => sum + s.totalCharged, 0);
  const totalPaid = studentFeeData.reduce((sum, s) => sum + s.totalPaid, 0);
  const totalBalance = studentFeeData.reduce((sum, s) => sum + s.totalBalance, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Fee Management</h1>
          <p className="text-sm text-ink-mute/80 mt-0.5">Term 2, 2025/2026</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-gold text-white text-sm font-medium hover:bg-gold-deep transition-colors">
          <Plus size={16} />
          Record Payment
        </button>
      </div>

      {/* Summary */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-paper border p-5">
          <p className="text-xs font-medium text-ink-mute/80 uppercase mb-1">Total Billed</p>
          <p className="text-xl font-bold text-ink">{formatCurrency(totalCharged)}</p>
        </div>
        <div className="bg-paper border p-5">
          <p className="text-xs font-medium text-ink-mute/80 uppercase mb-1">Total Collected</p>
          <p className="text-xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
        </div>
        <div className="bg-paper border p-5">
          <p className="text-xs font-medium text-ink-mute/80 uppercase mb-1">Total Outstanding</p>
          <p className="text-xl font-bold text-red-600">{formatCurrency(totalBalance)}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-mute/60" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search students..."
          className="w-full pl-9 pr-4 py-2.5 border border-rule text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold"
        />
      </div>

      {/* Table */}
      <div className="bg-paper border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-cream">
                <th className="text-left px-5 py-3 text-xs font-medium text-ink-mute/80 uppercase">Student</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-ink-mute/80 uppercase">Class</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-ink-mute/80 uppercase">Charged</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-ink-mute/80 uppercase">Paid</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-ink-mute/80 uppercase">Balance</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-ink-mute/80 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {studentFeeData.map(student => (
                <tr key={student.id} className="hover:bg-cream">
                  <td className="px-5 py-3 text-sm font-medium text-ink">{student.name}</td>
                  <td className="px-5 py-3 text-sm text-ink-mute">{student.classInfo?.name}</td>
                  <td className="px-5 py-3 text-sm text-right text-ink-mute">{formatCurrency(student.totalCharged)}</td>
                  <td className="px-5 py-3 text-sm text-right text-green-600">{formatCurrency(student.totalPaid)}</td>
                  <td className="px-5 py-3 text-sm text-right font-medium text-ink">{formatCurrency(student.totalBalance)}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                      student.totalBalance === 0 ? 'bg-green-50 text-green-700' :
                      student.totalPaid > 0 ? 'bg-yellow-50 text-yellow-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {student.totalBalance === 0 ? 'Clear' : student.totalPaid > 0 ? 'Partial' : 'Unpaid'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// RESULTS PAGE
// ============================================================================
function AdminResultsPage() {
  const [selectedClass, setSelectedClass] = useState('jhs2');

  const classStudents = students.filter(s => s.classId === selectedClass);
  const subjectList = selectedClass.startsWith('jhs')
    ? ['Mathematics', 'English Language', 'Science', 'Social Studies', 'Ghanaian Language', 'RME', 'ICT', 'French']
    : ['Mathematics', 'English Language', 'Science', 'Social Studies', 'Ghanaian Language', 'RME', 'Creative Arts'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Results Management</h1>
          <p className="text-sm text-ink-mute/80 mt-0.5">Enter and manage student results</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors">
          <Check size={16} />
          Publish Results
        </button>
      </div>

      {/* Class Selector */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm text-ink-mute/80">Class:</span>
        {classes.filter(c => c.department === 'jhs' || c.department === 'primary').slice(0, 6).map(cls => (
          <button
            key={cls.id}
            onClick={() => setSelectedClass(cls.id)}
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
              selectedClass === cls.id
                ? 'bg-gold text-white'
                : 'bg-paper border border-rule text-ink-mute hover:border-gold/30'
            }`}
          >
            {cls.name}
          </button>
        ))}
      </div>

      {/* Results Entry */}
      <div className="bg-paper border overflow-hidden">
        <div className="p-5 border-b">
          <h3 className="font-semibold text-ink">Term 1 Results - {getClassById(selectedClass)?.name}</h3>
          <p className="text-sm text-ink-mute/80 mt-0.5">Enter scores for each student and subject</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-cream">
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-mute/80 uppercase sticky left-0 bg-cream">Student</th>
                {subjectList.map(sub => (
                  <th key={sub} className="text-center px-3 py-3 text-xs font-medium text-ink-mute/80 uppercase min-w-[80px]">{sub.slice(0, 4)}</th>
                ))}
                <th className="text-center px-3 py-3 text-xs font-medium text-ink-mute/80 uppercase">Avg</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {classStudents.map(student => {
                const studentResults = results.filter(r => r.studentId === student.id);
                const avg = studentResults.length > 0
                  ? Math.round(studentResults.reduce((sum, r) => sum + r.score, 0) / studentResults.length)
                  : 0;
                return (
                  <tr key={student.id}>
                    <td className="px-4 py-2.5 text-sm font-medium text-ink sticky left-0 bg-paper">{student.name}</td>
                    {subjectList.map(sub => {
                      const result = studentResults.find(r => r.subjectName === sub);
                      return (
                        <td key={sub} className="px-3 py-2.5 text-center">
                          {result ? (
                            <span className={`text-sm font-medium ${
                              result.score >= 80 ? 'text-green-600' :
                              result.score >= 60 ? 'text-blue-600' :
                              result.score >= 40 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {result.score}
                            </span>
                          ) : (
                            <input
                              type="number"
                              min="0"
                              max="100"
                              placeholder="--"
                              className="w-14 px-2 py-1 border border-rule rounded text-sm text-center focus:outline-none focus:ring-1 focus:ring-gold/30 focus:border-gold"
                            />
                          )}
                        </td>
                      );
                    })}
                    <td className="px-3 py-2.5 text-center text-sm font-bold text-ink">{avg || '--'}</td>
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
function AdminAttendancePage() {
  const [selectedClass, setSelectedClass] = useState('jhs2');
  const [selectedDate, setSelectedDate] = useState('2026-02-06');

  const classStudents = students.filter(s => s.classId === selectedClass);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Attendance</h1>
        <p className="text-sm text-ink-mute/80 mt-0.5">Record and manage daily attendance</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={selectedClass}
          onChange={e => setSelectedClass(e.target.value)}
          className="px-4 py-2.5 border border-rule text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold"
        >
          {classes.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="px-4 py-2.5 border border-rule text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold"
        />
        <button className="px-4 py-2.5 bg-gold text-white text-sm font-medium hover:bg-gold-deep transition-colors">
          Save Attendance
        </button>
      </div>

      {/* Attendance List */}
      <div className="bg-paper border overflow-hidden">
        <div className="p-5 border-b">
          <h3 className="font-semibold text-ink">{getClassById(selectedClass)?.name} - {new Date(selectedDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</h3>
        </div>
        <div className="divide-y">
          {classStudents.map(student => {
            const record = attendance.find(a => a.studentId === student.id && a.date === selectedDate);
            const status = record?.status || 'present';
            return (
              <div key={student.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-cream flex items-center justify-center">
                    <span className="text-xs font-medium text-ink-mute">{student.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <span className="text-sm font-medium text-ink">{student.name}</span>
                </div>
                <div className="flex gap-1.5">
                  {['present', 'late', 'absent', 'excused'].map(s => (
                    <button
                      key={s}
                      className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                        status === s
                          ? s === 'present' ? 'bg-green-100 text-green-700' :
                            s === 'late' ? 'bg-yellow-100 text-yellow-700' :
                            s === 'absent' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          : 'bg-cream text-ink-mute/80 hover:bg-cream'
                      }`}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// COMMUNICATIONS PAGE
// ============================================================================
function CommunicationsPage() {
  const [tab, setTab] = useState<'announcements' | 'news' | 'events'>('announcements');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Communications</h1>
        <p className="text-sm text-ink-mute/80 mt-0.5">Manage announcements, news and events</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { value: 'announcements' as const, label: 'Announcements' },
          { value: 'news' as const, label: 'News' },
          { value: 'events' as const, label: 'Events' },
        ].map(t => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.value
                ? 'bg-gold text-white'
                : 'bg-paper border border-rule text-ink-mute hover:border-gold/30'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'announcements' && (
        <div className="space-y-4">
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-gold text-white text-sm font-medium hover:bg-gold-deep transition-colors">
            <Plus size={16} />
            New Announcement
          </button>
          {announcements.map(ann => (
            <div key={ann.id} className="bg-paper border p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-ink mb-1">{ann.title}</h3>
                  <p className="text-sm text-ink-mute">{ann.content}</p>
                  <p className="text-xs text-ink-mute/60 mt-2">Audience: {ann.audience} • {new Date(ann.date).toLocaleDateString('en-GB')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'news' && (
        <div className="space-y-4">
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-gold text-white text-sm font-medium hover:bg-gold-deep transition-colors">
            <Plus size={16} />
            New Article
          </button>
          {news.map(article => (
            <div key={article.id} className="bg-paper border p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-gold-deep bg-orange-50 px-2 py-0.5 rounded">{article.category}</span>
                <span className="text-xs text-ink-mute/60">{new Date(article.date).toLocaleDateString('en-GB')}</span>
              </div>
              <h3 className="font-semibold text-ink mb-1">{article.title}</h3>
              <p className="text-sm text-ink-mute line-clamp-2">{article.excerpt}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'events' && (
        <div className="space-y-4">
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-gold text-white text-sm font-medium hover:bg-gold-deep transition-colors">
            <Plus size={16} />
            New Event
          </button>
          {events.map(event => (
            <div key={event.id} className="bg-paper border p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-cream flex flex-col items-center justify-center shrink-0">
                <span className="text-[10px] font-medium text-gold-deep uppercase">
                  {new Date(event.date).toLocaleDateString('en', { month: 'short' })}
                </span>
                <span className="text-sm font-bold text-ink leading-none">
                  {new Date(event.date).getDate()}
                </span>
              </div>
              <div>
                <h3 className="font-medium text-ink">{event.title}</h3>
                <p className="text-sm text-ink-mute/80">{event.time}{event.location ? ` • ${event.location}` : ''}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// EXPORT
// ============================================================================
export { AdminAuthProvider, AdminLayout, AdminDashboard, StudentsPage, AdmissionsPage, AdminFeesPage, AdminResultsPage, AdminAttendancePage, CommunicationsPage };
