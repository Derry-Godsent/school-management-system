import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PublicLayout } from './components/layout/PublicLayout';
import { ScrollToTop } from './components/layout/ScrollToTop';
import HomePage from './pages/HomePage';
import AboutPage from './pages/public/AboutPage';
import AcademicsPage from './pages/public/AcademicsPage';
import AdmissionsPage from './pages/public/AdmissionsPage';
import GalleryPage from './pages/public/GalleryPage';
import NewsPage from './pages/public/NewsPage';
import ContactPage from './pages/public/ContactPage';
import {
  AuthProvider,
  ParentLayout,
  ParentDashboard,
  ResultsPage,
  AttendancePage,
  FeesPage,
  AnnouncementsPage,
} from './pages/ParentPortal';
import {
  AdminAuthProvider,
  AdminLayout,
  AdminDashboard,
  StudentsPage,
} from './pages/AdminPortal';

/** Wraps a public marketing page in the shared navigation/footer shell. */
function Public({ children }: { children: React.ReactNode }) {
  return <PublicLayout>{children}</PublicLayout>;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Website — HomePage still renders its own bespoke header/footer
            pending unification onto PublicLayout. */}
        <Route path="/" element={<HomePage />} />
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

        {/* Parent Portal */}
        <Route
          path="/parent"
          element={
            <AuthProvider>
              <ParentLayout>
                <ParentDashboard />
              </ParentLayout>
            </AuthProvider>
          }
        />
        <Route
          path="/parent/results"
          element={
            <AuthProvider>
              <ParentLayout>
                <ResultsPage />
              </ParentLayout>
            </AuthProvider>
          }
        />
        <Route
          path="/parent/attendance"
          element={
            <AuthProvider>
              <ParentLayout>
                <AttendancePage />
              </ParentLayout>
            </AuthProvider>
          }
        />
        <Route
          path="/parent/fees"
          element={
            <AuthProvider>
              <ParentLayout>
                <FeesPage />
              </ParentLayout>
            </AuthProvider>
          }
        />
        <Route
          path="/parent/announcements"
          element={
            <AuthProvider>
              <ParentLayout>
                <AnnouncementsPage />
              </ParentLayout>
            </AuthProvider>
          }
        />

        {/* Admin Portal */}
        <Route
          path="/admin"
          element={
            <AdminAuthProvider>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </AdminAuthProvider>
          }
        />
        <Route
          path="/admin/students"
          element={
            <AdminAuthProvider>
              <AdminLayout>
                <StudentsPage />
              </AdminLayout>
            </AdminAuthProvider>
          }
        />

        {/* 404 - Redirect to home */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
