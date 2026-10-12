import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PublicLayout, HomePage, AboutPage, AcademicsPage, AdmissionsPage, GalleryPage, NewsPage, ContactPage } from './pages/public';
import { AuthProvider, ParentLayout, ParentDashboard, ResultsPage, AttendancePage, FeesPage, TimetablePage, AnnouncementsPage, ReportCardPage } from './pages/parent';
import { AdminAuthProvider, AdminLayout, AdminDashboard, StudentsPage, AdmissionsPage as AdminAdmissionsPage, AdminFeesPage, AdminResultsPage, AdminAttendancePage, CommunicationsPage } from './pages/admin';
import { CustomCursor } from './components/motion/CustomCursor';
import { MouseSpotlightCSS } from './components/motion/MouseSpotlight';
import { PageLoader } from './components/layout/PageLoader';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { BackToTop } from './components/layout/BackToTop';

// ============================================================================
// ANIMATED ROUTES
// Wraps route output in AnimatePresence for page transitions.
// Uses location.pathname as key for exit/enter animations.
// ============================================================================

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Website */}
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
        <Route path="/academics" element={<PublicLayout><AcademicsPage /></PublicLayout>} />
        <Route path="/admissions" element={<PublicLayout><AdmissionsPage /></PublicLayout>} />
        <Route path="/gallery" element={<PublicLayout><GalleryPage /></PublicLayout>} />
        <Route path="/news" element={<PublicLayout><NewsPage /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />

        {/* Parent Portal */}
        <Route path="/parent" element={
          <AuthProvider>
            <ParentLayout>
              <ParentDashboard />
            </ParentLayout>
          </AuthProvider>
        } />
        <Route path="/parent/results" element={
          <AuthProvider>
            <ParentLayout>
              <ResultsPage />
            </ParentLayout>
          </AuthProvider>
        } />
        <Route path="/parent/attendance" element={
          <AuthProvider>
            <ParentLayout>
              <AttendancePage />
            </ParentLayout>
          </AuthProvider>
        } />
        <Route path="/parent/fees" element={
          <AuthProvider>
            <ParentLayout>
              <FeesPage />
            </ParentLayout>
          </AuthProvider>
        } />
        <Route path="/parent/timetable" element={
          <AuthProvider>
            <ParentLayout>
              <TimetablePage />
            </ParentLayout>
          </AuthProvider>
        } />
        <Route path="/parent/announcements" element={
          <AuthProvider>
            <ParentLayout>
              <AnnouncementsPage />
            </ParentLayout>
          </AuthProvider>
        } />
        <Route path="/parent/report-card" element={
          <AuthProvider>
            <ParentLayout>
              <ReportCardPage />
            </ParentLayout>
          </AuthProvider>
        } />

        {/* Admin / Management Platform */}
        <Route path="/admin" element={
          <AdminAuthProvider>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </AdminAuthProvider>
        } />
        <Route path="/admin/students" element={
          <AdminAuthProvider>
            <AdminLayout>
              <StudentsPage />
            </AdminLayout>
          </AdminAuthProvider>
        } />
        <Route path="/admin/admissions" element={
          <AdminAuthProvider>
            <AdminLayout>
              <AdminAdmissionsPage />
            </AdminLayout>
          </AdminAuthProvider>
        } />
        <Route path="/admin/fees" element={
          <AdminAuthProvider>
            <AdminLayout>
              <AdminFeesPage />
            </AdminLayout>
          </AdminAuthProvider>
        } />
        <Route path="/admin/results" element={
          <AdminAuthProvider>
            <AdminLayout>
              <AdminResultsPage />
            </AdminLayout>
          </AdminAuthProvider>
        } />
        <Route path="/admin/attendance" element={
          <AdminAuthProvider>
            <AdminLayout>
              <AdminAttendancePage />
            </AdminLayout>
          </AdminAuthProvider>
        } />
        <Route path="/admin/communications" element={
          <AdminAuthProvider>
            <AdminLayout>
              <CommunicationsPage />
            </AdminLayout>
          </AdminAuthProvider>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <PageLoader />
      <CustomCursor />
      <MouseSpotlightCSS />
      <ScrollToTop />
      <BackToTop />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
