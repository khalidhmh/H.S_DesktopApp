import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './views/layouts/MainLayout';
import { LoginPage } from './features/auth/LoginPage';
import { useAuthStore } from './viewmodels/useAuthStore';
import { ErrorBoundary } from './components/ErrorBoundary';

// Lazy loading could be added here for performance
import ManagerDashboard from './views/pages/manager/ManagerDashboard';
import SupervisorDashboard from './views/pages/supervisor/SupervisorDashboard';
import StudentManagement from './views/pages/manager/StudentManagement';
import RoomManagement from './views/pages/manager/RoomManagement';
import AttendancePage from './views/pages/supervisor/AttendancePage';
import ComplaintsPage from './views/pages/common/ComplaintsPage';
import PenaltiesPage from './views/pages/manager/PenaltiesPage';
import ReportsPage from './views/pages/manager/ReportsPage';
import SettingsPage from './views/pages/common/SettingsPage';
import { Toaster } from 'sonner';
// Removed unused StudentManagementPage import

function App() {
  const { isAuthenticated, currentUser } = useAuthStore();

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => { }} />;
  }

  const Dashboard = currentUser?.role === 'SUPERVISOR' ? SupervisorDashboard : ManagerDashboard;

  // Determine home page based on role if needed, or default to dashboard
  return (
    <Router>
      <ErrorBoundary fallback={
        <div className="p-10 text-center">Something went wrong. Please refresh the app.</div>
      }>
        <Toaster position="top-center" richColors />
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="students" element={<StudentManagement />} />
            <Route path="rooms" element={<RoomManagement />} />
            <Route
              path="/complaints"
              element={<ComplaintsPage />}
            />
            <Route
              path="/penalties"
              element={<PenaltiesPage />}
            />
            <Route
              path="/reports"
              element={<ReportsPage />}
            />
            <Route
              path="/settings"
              element={<SettingsPage />}
            />
            <Route
              path="/rooms"
              element={<RoomManagement />}
            />
            <Route
              path="/attendance"
              element={<AttendancePage />}
            />
            {/* The original StudentManagementPage route is replaced by the new StudentManagement route */}
            {/* Add other routes here */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;