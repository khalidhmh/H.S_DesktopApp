import { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './layouts/Sidebar';
import DashboardPage from './features/dashboard/DashboardPage';
import AttendancePage from './features/attendance/AttendancePage';
import StudentManagementPage from './features/students/StudentManagementPage';
import { LoginPage } from './features/auth/LoginPage';

function App() {
  // حالة تسجيل الدخول (مبدئياً false)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string>('');

  const handleLogin = (role: string) => {
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('');
  };

  // لو مش مسجل دخول، اعرض صفحة الدخول فقط
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLogin} />;
  }

  return (
    <Router>
      <div className="flex h-screen bg-[#F5F7FA] overflow-hidden font-sans text-right" dir="rtl">
        {/* السايد بار */}
        <Sidebar />

        {/* المحتوى */}
        <main className="flex-1 overflow-auto relative scroll-smooth">
          <div className="w-full max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<DashboardPage userRole={userRole as 'MANAGER' | 'SUPERVISOR'} />} />
              <Route path="/attendance" element={<AttendancePage userRole={userRole} />} />
              <Route path="/students" element={<StudentManagementPage />} />
              {/* باقي الروابط زي ما هي... */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;