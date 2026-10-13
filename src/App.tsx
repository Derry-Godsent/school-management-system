import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { AuthProvider, ParentLayout, ParentDashboard, ResultsPage, AttendancePage, FeesPage, AnnouncementsPage } from './pages/ParentPortal';
import { AdminAuthProvider, AdminLayout, AdminDashboard, StudentsPage } from './pages/AdminPortal';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Website */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<HomePage />} />
        <Route path="/academics" element={<HomePage />} />
        <Route path="/admissions" element={<HomePage />} />
        <Route path="/gallery" element={<HomePage />} />
        <Route path="/news" element={<HomePage />} />
        <Route path="/contact" element={<HomePage />} />

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
        <Route path="/parent/announcements" element={
          <AuthProvider>
            <ParentLayout>
              <AnnouncementsPage />
            </ParentLayout>
          </AuthProvider>
        } />

        {/* Admin Portal */}
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

        {/* 404 - Redirect to home */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
