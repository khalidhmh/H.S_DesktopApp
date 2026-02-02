import { useState } from 'react';
import { DashboardSidebar } from '@/app/components/DashboardSidebar';
import { TopHeader } from '@/app/components/TopHeader';
import { SupervisorDashboard } from '@/app/components/SupervisorDashboard';
import { ManagerDashboard } from '@/app/components/ManagerDashboard';
import { AttendanceTaking } from '@/app/components/AttendanceTaking';
import { MaintenancePage } from '@/app/components/MaintenancePage';
import { StudentManagementPage } from '@/app/components/StudentManagementPage';
import { SettingsPage } from '@/app/components/SettingsPage';
import { ComplaintsPage } from '@/app/components/ComplaintsPage';
import { ActivitiesPage } from '@/app/components/ActivitiesPage';
import { InventoryPage } from '@/app/components/InventoryPage';
import { CommunicationPage } from '@/app/components/CommunicationPage';

export default function App() {
  const [currentView, setCurrentView] = useState<'supervisor' | 'manager'>('supervisor');
  const [activeSection, setActiveSection] = useState('dashboard');

  return (
    <div className="min-h-screen bg-[#F5F7FA]" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar - Right side for RTL */}
        <DashboardSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <TopHeader currentView={currentView} onViewChange={setCurrentView} activeSection={activeSection} />

          {/* Dashboard Content - Scrollable */}
          <main className="flex-1 overflow-y-auto">
            {activeSection === 'dashboard' ? (
              currentView === 'supervisor' ? <SupervisorDashboard /> : <ManagerDashboard />
            ) : activeSection === 'attendance' ? (
              <AttendanceTaking />
            ) : activeSection === 'maintenance' ? (
              <MaintenancePage />
            ) : activeSection === 'students' ? (
              <StudentManagementPage />
            ) : activeSection === 'complaints' ? (
              <ComplaintsPage />
            ) : activeSection === 'activities' ? (
              <ActivitiesPage />
            ) : activeSection === 'custody' ? (
              <InventoryPage />
            ) : activeSection === 'notifications' ? (
              <CommunicationPage />
            ) : activeSection === 'settings' ? (
              <SettingsPage />
            ) : (
              <div className="p-6">
                <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                  <h2 className="text-xl font-bold text-[#002147] mb-2">
                    قسم {activeSection === 'complaints' ? 'الشكاوى' :
                          activeSection === 'activities' ? 'الأنشطة' :
                          activeSection === 'reports' ? 'التقارير' :
                          activeSection === 'custody' ? 'العهدة' :
                          activeSection === 'notifications' ? 'الإشعارات' : activeSection}
                  </h2>
                  <p className="text-gray-600">هذا القسم قيد التطوير</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}