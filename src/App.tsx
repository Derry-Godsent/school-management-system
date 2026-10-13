import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, ParentLayout, ParentDashboard, ResultsPage, AttendancePage, FeesPage, AnnouncementsPage } from './pages/ParentPortal';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
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

        {/* Default route - redirect to parent portal for now */}
        <Route path="*" element={
          <AuthProvider>
            <ParentLayout>
              <ParentDashboard />
            </ParentLayout>
          </AuthProvider>
        } />
      </Routes>
    </BrowserRouter>
  );
}
