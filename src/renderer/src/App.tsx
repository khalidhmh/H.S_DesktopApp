import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from './views/layouts/MainLayout'
import { LoginPage } from './features/auth/LoginPage'
import { useAuthStore } from './viewmodels/useAuthStore'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Toaster } from 'sonner'
// Lazy loading could be added here for performance
import ManagerDashboard from './views/pages/manager/ManagerDashboard'
import SupervisorDashboard from './views/pages/supervisor/SupervisorDashboard'

// --- التعديل هنا: استدعاء الصفحة الجديدة من مسار features ---
import StudentManagementPage from './features/students/StudentManagementPage'
// import StudentManagement from './views/pages/manager/StudentManagement'; // هذا هو القديم

import RoomManagement from './views/pages/manager/RoomManagement'
import AttendancePage from './views/pages/supervisor/AttendancePage'
import AttendanceArchivePage from './views/pages/manager/AttendanceArchivePage'
import ComplaintsPage from './views/pages/common/ComplaintsPage'
import MaintenancePage from './views/pages/common/MaintenancePage'
import NotificationsPage from './views/pages/common/NotificationsPage'
import MemorandumsPage from './views/pages/common/MemorandumsPage'
import InventoryPage from './views/pages/common/InventoryPage'
import AddStudentPage from './features/students/AddStudentPage'
import PenaltiesPage from './views/pages/manager/PenaltiesPage'
import ReportsPage from './views/pages/manager/ReportsPage'
import SettingsPage from './views/pages/common/SettingsPage'

function App() {
  const { isAuthenticated, currentUser } = useAuthStore()

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => { }} />
  }

  const Dashboard = currentUser?.role === 'SUPERVISOR' ? SupervisorDashboard : ManagerDashboard

  return (
    <Router>
      <ErrorBoundary
        fallback={
          <div className="p-10 text-center">Something went wrong. Please refresh the app.</div>
        }
      >
        <Toaster position="top-center" richColors />
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<Dashboard />} />

            {/* --- التعديل هنا: استخدام المكون الجديد --- */}
            <Route path="students" element={<StudentManagementPage />} />
            <Route path="students/add" element={<AddStudentPage />} />

            <Route path="rooms" element={<RoomManagement />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/attendance-history" element={<AttendanceArchivePage />} />
            <Route path="/complaints" element={<ComplaintsPage />} />
            <Route path="/maintenance" element={<MaintenancePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/memos" element={<MemorandumsPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/penalties" element={<PenaltiesPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </Router>
  )
}

export default App
