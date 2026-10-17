import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PublicLayout } from './components/layout/PublicLayout';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { SmoothScroll, ScrollProgress } from './components/fx';
import { LiveProvider } from './data/live';
import HomePage from './pages/HomePage';
import AboutPage from './pages/public/AboutPage';
import AcademicsPage from './pages/public/AcademicsPage';
import AdmissionsPage from './pages/public/AdmissionsPage';
import GalleryPage from './pages/public/GalleryPage';
import NewsPage from './pages/public/NewsPage';
import ContactPage from './pages/public/ContactPage';
import CampusLifePage from './pages/public/CampusLifePage';
import NotFoundPage from './pages/public/NotFoundPage';
// Imported by full path on purpose. A legacy file called parent.tsx still sits
// in src/pages, and it shadows the parent/ folder, so a bare './pages/parent'
// would quietly import the old page instead of the portal.
import { ParentAuthProvider } from './pages/parent/AuthContext';
import { PortalShell } from './pages/parent/PortalShell';
import HomeScreen from './pages/parent/screens/Home';
import GradesScreen from './pages/parent/screens/Grades';
import AttendanceScreen from './pages/parent/screens/Attendance';
import FeesScreen from './pages/parent/screens/Fees';
import NoticesScreen from './pages/parent/screens/Notices';
import ClassListScreen from './pages/parent/screens/ClassList';
import ProfileScreen from './pages/parent/screens/Profile';
// The staff console, imported by full path for the same reason as the parent
// portal: a legacy admin file sits beside the folder and would shadow it.
import { StaffAuthProvider } from './pages/admin/AuthContext';
import { AdminShell } from './pages/admin/AdminShell';
import OverviewScreen from './pages/admin/screens/Overview';
import ConsoleAdmissions from './pages/admin/screens/Admissions';
import ConsoleStudents from './pages/admin/screens/Students';
import ConsoleStaff from './pages/admin/screens/Staff';
import ConsoleClasses from './pages/admin/screens/Classes';
import ConsoleAttendance from './pages/admin/screens/Attendance';
import ConsoleAcademics from './pages/admin/screens/Academics';
import ConsoleFinance from './pages/admin/screens/Finance';
import ConsoleCommunications from './pages/admin/screens/Communications';
import ConsoleReports from './pages/admin/screens/Reports';
import ConsoleAccess from './pages/admin/screens/Access';
import ConsoleSettings from './pages/admin/screens/Settings';

/** Wraps a public marketing page in the shared navigation/footer shell. */
function Public({ children }: { children: React.ReactNode }) {
  return <PublicLayout>{children}</PublicLayout>;
}

export default function App() {
  return (
    <BrowserRouter>
      <LiveProvider>
      {/* Global motion layer. Each of these no-ops on reduced-motion and
          low-power devices rather than degrading them. */}
      <SmoothScroll />
      <ScrollProgress />
      <ScrollToTop />
      <Routes>
        {/* Public Website, every route shares one shell */}
        <Route
          path="/"
          element={
            <Public>
              <HomePage />
            </Public>
          }
        />
        <Route
          path="/about"
          element={
            <Public>
              <AboutPage />
            </Public>
          }
        />
        <Route
          path="/academics"
          element={
            <Public>
              <AcademicsPage />
            </Public>
          }
        />
        <Route
          path="/admissions"
          element={
            <Public>
              <AdmissionsPage />
            </Public>
          }
        />
        <Route
          path="/gallery"
          element={
            <Public>
              <GalleryPage />
            </Public>
          }
        />
        <Route
          path="/campus-life"
          element={
            <Public>
              <CampusLifePage />
            </Public>
          }
        />
        <Route
          path="/news"
          element={
            <Public>
              <NewsPage />
            </Public>
          }
        />
        <Route
          path="/contact"
          element={
            <Public>
              <ContactPage />
            </Public>
          }
        />

        {/* Parent Portal. One shell holds the app bar, the child switcher,
            the rail and the tab bar, and the screens change inside it, which
            is how an app behaves and keeps the chosen child between pages. */}
        <Route
          path="/parent"
          element={
            <ParentAuthProvider>
              <PortalShell />
            </ParentAuthProvider>
          }
        >
          <Route index element={<HomeScreen />} />
          <Route path="class" element={<ClassListScreen />} />
          <Route path="results" element={<GradesScreen />} />
          <Route path="attendance" element={<AttendanceScreen />} />
          <Route path="fees" element={<FeesScreen />} />
          <Route path="announcements" element={<NoticesScreen />} />
          <Route path="profile" element={<ProfileScreen />} />
        </Route>

        {/* Staff console. One shell holds the rail, the top bar and the phone
            tab bar, and the working area changes inside it. Every module is a
            real route: a member of staff can bookmark the finance screen and
            come back to it, and the gate is the permission table, not the
            absence of a URL. */}
        <Route
          path="/admin"
          element={
            <StaffAuthProvider>
              <AdminShell />
            </StaffAuthProvider>
          }
        >
          <Route index element={<OverviewScreen />} />
          <Route path="admissions" element={<ConsoleAdmissions />} />
          <Route path="students" element={<ConsoleStudents />} />
          <Route path="staff" element={<ConsoleStaff />} />
          <Route path="classes" element={<ConsoleClasses />} />
          <Route path="attendance" element={<ConsoleAttendance />} />
          <Route path="academics" element={<ConsoleAcademics />} />
          <Route path="finance" element={<ConsoleFinance />} />
          <Route path="communications" element={<ConsoleCommunications />} />
          <Route path="reports" element={<ConsoleReports />} />
          <Route path="access" element={<ConsoleAccess />} />
          <Route path="settings" element={<ConsoleSettings />} />
        </Route>

        {/* Unknown paths fall back to the homepage for now. A dedicated 404
            route would be better than silently showing the home page. */}
        <Route
          path="*"
          element={
            <Public>
              <NotFoundPage />
            </Public>
          }
        />
      </Routes>
      </LiveProvider>
    </BrowserRouter>
  );
}
