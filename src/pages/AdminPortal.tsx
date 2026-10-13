import { useState, createContext, useContext, ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Home, Users, GraduationCap, CreditCard, FileText, Clock, Bell,
  LogOut, Menu, X, ChevronRight, AlertCircle, Check, ClipboardList,
  DollarSign, UserCheck, UserX, ArrowLeft, Search, Plus
} from 'lucide-react';
import {
  school, students, staff, classes, results, attendance,
  feeRecords, paymentHistory, admissionApplications, announcements, events,
  academicYear, getStudentById, getClassById, getFeeSummary, formatCurrency
} from '../data';

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

function AdminAuthProvider({ children }: { children: ReactNode }) {
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
// LOGIN PAGE
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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#E85D04] rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-sm">MG</span>
          </div>
          <h1 className="text-2xl font-bold text-white">School Management</h1>
          <p className="text-sm text-gray-400 mt-1">{school.name}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">{error}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04]"
              />
            </div>
            <button type="submit" className="w-full py-3.5 bg-[#E85D04] text-white font-medium rounded-lg hover:bg-[#DC4A03] transition-colors">
              Sign In
            </button>
          </form>
          <div className="mt-6 pt-6 border-t">
            <p className="text-xs text-gray-500 text-center mb-2">Demo Credentials</p>
            <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 space-y-1">
              <p><span className="font-medium">Email:</span> admin@demo.com</p>
              <p><span className="font-medium">Password:</span> demo123</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-300">← Back to school website</Link>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ADMIN LAYOUT
// ============================================================================
function AdminLayout({ children }: { children: ReactNode }) {
  const { auth, logout } = useContext(AdminAuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!auth) {
    return <AdminLoginPage />;
  }

  const staffMember = staff.find(s => s.id === auth.staffId);

  const navItems = [
    { path: '/admin', icon: Home, label: 'Dashboard' },
    { path: '/admin/students', icon: Users, label: 'Students' },
    { path: '/admin/admissions', icon: GraduationCap, label: 'Admissions' },
    { path: '/admin/fees', icon: CreditCard, label: 'Fees' },
    { path: '/admin/results', icon: FileText, label: 'Results' },
    { path: '/admin/attendance', icon: Clock, label: 'Attendance' },
    { path: '/admin/communications', icon: Bell, label: 'Communications' },
  ];

  const pendingAdmissions = admissionApplications.filter(a => a.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-gray-600">
                <Menu size={20} />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#E85D04] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">MG</span>
                </div>
                <span className="font-semibold text-sm text-gray-900 hidden sm:block">Management</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">{staffMember?.name}</p>
                <p className="text-xs text-gray-500">{staffMember?.title}</p>
              </div>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className={`${mobileMenuOpen ? 'fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl p-6 overflow-y-auto' : 'hidden'} lg:block lg:relative lg:w-60 shrink-0`}>
            {mobileMenuOpen && (
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <span className="font-semibold text-sm">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
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
                  className={`flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-[#E85D04]/10 text-[#E85D04]'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} />
                    {item.label}
                  </div>
                  {item.path === '/admin/admissions' && pendingAdmissions > 0 && (
                    <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {pendingAdmissions}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
            <div className="mt-8 pt-6 border-t">
              <Link to="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 py-2">
                <ArrowLeft size={14} />
                School Website
              </Link>
              <Link to="/parent" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mt-3 py-2">
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
// ADMIN DASHBOARD
// ============================================================================
function AdminDashboard() {
  const pendingApps = admissionApplications.filter(a => a.status === 'pending');
  const totalStudents = students.length;
  const studentsWithDebt = students.filter(s => getFeeSummary(s.id).totalBalance > 0);
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
        <h1 className="text-2xl font-bold text-gray-900">Attention Centre</h1>
        <p className="text-sm text-gray-500 mt-0.5">What needs your focus right now</p>
      </div>

      {/* Attention Items */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Link to="/admin/admissions" className="bg-white rounded-xl border p-4 sm:p-5 hover:border-[#E85D04]/30 transition-colors min-h-[120px] flex flex-col justify-between">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
              <ClipboardList size={14} className="sm:hidden text-red-600" />
              <ClipboardList size={16} className="hidden sm:block text-red-600" />
            </div>
            <span className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase leading-tight">Pending Admissions</span>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{pendingApps.length}</p>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">awaiting review</p>
          </div>
        </Link>

        <div className="bg-white rounded-xl border p-4 sm:p-5 min-h-[120px] flex flex-col justify-between">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-orange-50 rounded-lg flex items-center justify-center shrink-0">
              <DollarSign size={14} className="sm:hidden text-[#E85D04]" />
              <DollarSign size={16} className="hidden sm:block text-[#E85D04]" />
            </div>
            <span className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase leading-tight">Outstanding Fees</span>
          </div>
          <div>
            <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">{formatCurrency(totalOutstanding)}</p>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">{studentsWithDebt.length} student(s)</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 sm:p-5 min-h-[120px] flex flex-col justify-between">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-yellow-50 rounded-lg flex items-center justify-center shrink-0">
              <UserX size={14} className="sm:hidden text-yellow-600" />
              <UserX size={16} className="hidden sm:block text-yellow-600" />
            </div>
            <span className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase leading-tight">Attendance Issues</span>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{attendanceIssues.length}</p>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">2+ absences</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 sm:p-5 min-h-[120px] flex flex-col justify-between">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
              <UserCheck size={14} className="sm:hidden text-green-600" />
              <UserCheck size={16} className="hidden sm:block text-green-600" />
            </div>
            <span className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase leading-tight">Total Students</span>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{totalStudents}</p>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">enrolled</p>
          </div>
        </div>
      </div>

      {/* Recent Payments */}
      <div className="bg-white rounded-xl border">
        <div className="p-5 border-b">
          <h3 className="font-semibold text-gray-900">Recent Payments</h3>
        </div>
        <div className="divide-y">
          {recentPayments.map(payment => {
            const student = getStudentById(payment.studentId);
            return (
              <div key={payment.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{student?.name}</p>
                  <p className="text-xs text-gray-500">{payment.category} • {payment.method}</p>
                </div>
                <span className="text-sm font-medium text-green-600">{formatCurrency(payment.amount)}</span>
              </div>
            );
          })}
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

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-sm text-gray-500 mt-0.5">{students.length} students enrolled</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#E85D04] text-white text-sm font-medium rounded-lg hover:bg-[#DC4A03] transition-colors">
          <Plus size={16} />
          Add Student
        </button>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search by name or student ID..."
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04]"
        />
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Class</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Programme</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(student => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">{student.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600">{student.studentId}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{student.className}</td>
                  <td className="px-5 py-3 text-sm text-gray-600 hidden md:table-cell">{student.programme}</td>
                  <td className="px-5 py-3 text-center">
                    <span className="text-xs px-2 py-0.5 rounded font-medium bg-green-50 text-green-700">Active</span>
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
// EXPORT
// ============================================================================
export { AdminAuthProvider, AdminLayout, AdminDashboard, StudentsPage };
