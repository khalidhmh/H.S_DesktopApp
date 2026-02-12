import { lazy, Suspense, useEffect } from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from './presentation/layouts/MainLayout'
import { LoginPage } from './presentation/pages/common/LoginPage'
import { useAuthStore } from './viewmodels/useAuthStore'
import { ErrorBoundary } from './components/ErrorBoundary'
import { LoadingSpinner } from './components/LoadingSpinner'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Toaster } from 'sonner'

// ✅ Lazy load all pages from unified presentation/ structure
const ManagerDashboard = lazy(() => import('./presentation/pages/manager/ManagerDashboard'))
const SupervisorDashboard = lazy(() => import('./presentation/pages/supervisor/SupervisorDashboard'))
const StudentManagementPage = lazy(() => import('./presentation/pages/manager/StudentManagementPage'))
const AddStudentPage = lazy(() => import('./presentation/pages/manager/AddStudentPage'))
const RoomManagement = lazy(() => import('./presentation/pages/manager/RoomManagement'))
const AttendancePage = lazy(() => import('./presentation/pages/supervisor/AttendancePage'))
const AttendanceArchivePage = lazy(() => import('./presentation/pages/manager/AttendanceArchivePage'))
const ComplaintsPage = lazy(() => import('./presentation/pages/common/ComplaintsPage'))
const MaintenancePage = lazy(() => import('./presentation/pages/common/MaintenancePage'))
const NotificationsPage = lazy(() => import('./presentation/pages/common/NotificationsPage'))
const MemorandumsPage = lazy(() => import('./presentation/pages/common/MemorandumsPage'))
const InventoryPage = lazy(() => import('./presentation/pages/common/InventoryPage'))
const PenaltiesPage = lazy(() => import('./presentation/pages/manager/PenaltiesPage'))
const ReportsPage = lazy(() => import('./presentation/pages/manager/ReportsPage'))
const SettingsPage = lazy(() => import('./presentation/pages/common/SettingsPage'))

function App() {
  const { isAuthenticated, currentUser, restoreSession } = useAuthStore()

  // Restore session from localStorage on app start
  useEffect(() => {
    restoreSession()
  }, [restoreSession])

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => { }} />
  }

  const Dashboard =
    currentUser?.role === 'SUPERVISOR' ? SupervisorDashboard : ManagerDashboard

  return (
    <Router>
      <ErrorBoundary
        fallback={
          <div className="p-10 text-center">
            Something went wrong. Please refresh the app.
          </div>
        }
      >
        <Toaster position="top-center" richColors />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route index element={<Dashboard />} />

              {/* Manager-only routes */}
              <Route
                path="students"
                element={
                  <ProtectedRoute allowedRoles={['MANAGER']}>
                    <StudentManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="students/add"
                element={
                  <ProtectedRoute allowedRoles={['MANAGER']}>
                    <AddStudentPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="rooms"
                element={
                  <ProtectedRoute allowedRoles={['MANAGER']}>
                    <RoomManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/penalties"
                element={
                  <ProtectedRoute allowedRoles={['MANAGER']}>
                    <PenaltiesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute allowedRoles={['MANAGER']}>
                    <ReportsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/attendance-history"
                element={
                  <ProtectedRoute allowedRoles={['MANAGER']}>
                    <AttendanceArchivePage />
                  </ProtectedRoute>
                }
              />

              {/* Supervisor-only routes */}
              <Route
                path="/attendance"
                element={
                  <ProtectedRoute allowedRoles={['SUPERVISOR']}>
                    <AttendancePage />
                  </ProtectedRoute>
                }
              />

              {/* Common routes - accessible by both roles */}
              <Route path="/complaints" element={<ComplaintsPage />} />
              <Route path="/maintenance" element={<MaintenancePage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/memos" element={<MemorandumsPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/settings" element={<SettingsPage />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  )
}

export default App
