import { useState } from 'react';
import {
  LayoutDashboard,
  ClipboardCheck,
  Users,
  Wrench,
  MessageSquareWarning,
  Calendar,
  FileText,
  Package,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface DashboardSidebarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'لوحة التحكم', icon: <LayoutDashboard size={20} /> },
  { id: 'attendance', label: 'الحضور', icon: <ClipboardCheck size={20} /> },
  { id: 'students', label: 'الطلاب', icon: <Users size={20} /> },
  { id: 'maintenance', label: 'الصيانة', icon: <Wrench size={20} /> },
  { id: 'complaints', label: 'الشكاوى', icon: <MessageSquareWarning size={20} /> },
  { id: 'activities', label: 'الأنشطة', icon: <Calendar size={20} /> },
  { id: 'reports', label: 'التقارير', icon: <FileText size={20} /> },
  { id: 'custody', label: 'العهدة', icon: <Package size={20} /> },
  { id: 'notifications', label: 'الإشعارات', icon: <Bell size={20} /> },
  { id: 'settings', label: 'الإعدادات', icon: <Settings size={20} /> },
];

export function DashboardSidebar({ activeSection = 'dashboard', onSectionChange }: DashboardSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`h-screen bg-[#002147] transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-center border-b border-white/10">
        {!isCollapsed && (
          <h1 className="text-white text-xl font-bold">نظام الإسكان</h1>
        )}
        {isCollapsed && (
          <div className="w-10 h-10 bg-[#F2C94C] rounded-lg flex items-center justify-center">
            <span className="text-[#002147] font-bold text-lg">ن</span>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-6 px-2">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onSectionChange?.(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeSection === item.id
                    ? 'bg-[#F2C94C] text-[#002147]'
                    : 'text-white hover:bg-white/10'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!isCollapsed && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Collapse Button */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-all"
        >
          {isCollapsed ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          {!isCollapsed && <span className="text-sm">طي القائمة</span>}
        </button>
      </div>
    </div>
  );
}