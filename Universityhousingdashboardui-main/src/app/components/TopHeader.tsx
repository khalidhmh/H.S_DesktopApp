import { Wifi, RefreshCw, ChevronLeft, UserCog, BarChart3 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Button } from '@/app/components/ui/button';

interface TopHeaderProps {
  currentView: 'supervisor' | 'manager';
  onViewChange: (view: 'supervisor' | 'manager') => void;
  activeSection: string;
}

export function TopHeader({ currentView, onViewChange, activeSection }: TopHeaderProps) {
  const ping = 12;
  const wifiStatus: 'excellent' | 'good' | 'poor' =
    ping < 20 ? 'excellent' : ping < 50 ? 'good' : 'poor';

  const wifiColor =
    wifiStatus === 'excellent' ? '#10B981' : wifiStatus === 'good' ? '#F2C94C' : '#EF4444';

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* System Status Widget - Left Side */}
      <div className="flex items-center gap-4 bg-[#F5F7FA] px-4 py-2 rounded-lg">
        <div className="flex items-center gap-2">
          <Wifi size={18} style={{ color: wifiColor }} />
          <span className="text-sm text-gray-700">
            Ping: <span className="font-semibold">{ping}ms</span>
          </span>
        </div>
        <div className="w-px h-6 bg-gray-300" />
        <Button
          size="sm"
          className="bg-[#F2C94C] hover:bg-[#F2C94C]/90 text-[#002147] h-8"
        >
          <RefreshCw size={14} className="ml-2" />
          مزامنة الآن
        </Button>
      </div>

      {/* View Selector and Breadcrumbs - Center */}
      <div className="flex items-center gap-6">
        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => onViewChange('supervisor')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              currentView === 'supervisor'
                ? 'bg-[#F2C94C] text-[#002147] font-semibold shadow-sm'
                : 'text-gray-600 hover:text-[#002147]'
            }`}
          >
            <UserCog size={16} />
            <span className="text-sm">عرض المشرف</span>
          </button>
          <button
            onClick={() => onViewChange('manager')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              currentView === 'manager'
                ? 'bg-[#F2C94C] text-[#002147] font-semibold shadow-sm'
                : 'text-gray-600 hover:text-[#002147]'
            }`}
          >
            <BarChart3 size={16} />
            <span className="text-sm">عرض المدير</span>
          </button>
        </div>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="text-[#002147] font-semibold">لوحة التحكم</span>
          <ChevronLeft size={16} />
          <span>
            {activeSection === 'dashboard' ? 'الرئيسية' :
             activeSection === 'attendance' ? 'تحضير الحضور' :
             activeSection === 'students' ? 'إدارة الطلاب' :
             activeSection === 'maintenance' ? 'إدارة الصيانة' :
             activeSection === 'settings' ? 'الإعدادات' : activeSection}
          </span>
        </div>
      </div>

      {/* User Profile - Right Side */}
      <div className="flex items-center gap-3">
        <div className="text-left">
          <p className="text-sm font-semibold text-[#002147]">
            {currentView === 'supervisor' ? 'خالد أحمد' : 'د. أحمد محمد'}
          </p>
          <p className="text-xs text-gray-500">
            {currentView === 'supervisor' ? 'مشرف الإسكان' : 'مدير النظام'}
          </p>
        </div>
        <Avatar className="h-10 w-10">
          <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" />
          <AvatarFallback className="bg-[#002147] text-white">
            {currentView === 'supervisor' ? 'خأ' : 'أم'}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}