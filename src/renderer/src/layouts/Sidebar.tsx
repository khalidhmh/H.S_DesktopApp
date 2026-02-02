import { useState } from 'react';
import { NavLink } from 'react-router-dom';
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
    ShieldCheck,
    AlertTriangle
} from 'lucide-react';
import { cn } from '../lib/utils'; // تأكد إن ملف utils.ts موجود

interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    path: string;
}

const navItems: NavItem[] = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: <LayoutDashboard size={20} />, path: '/' },
    { id: 'attendance', label: 'التمام والحضور', icon: <ClipboardCheck size={20} />, path: '/attendance' },
    { id: 'students', label: 'الطلاب', icon: <Users size={20} />, path: '/students' },
    { id: 'permits', label: 'التصاريح', icon: <ShieldCheck size={20} />, path: '/permits' },
    { id: 'maintenance', label: 'الصيانة', icon: <Wrench size={20} />, path: '/maintenance' },
    { id: 'complaints', label: 'الشكاوى', icon: <MessageSquareWarning size={20} />, path: '/complaints' },
    { id: 'activities', label: 'الأنشطة', icon: <Calendar size={20} />, path: '/activities' },
    { id: 'penalties', label: 'الجزاءات', icon: <AlertTriangle size={20} />, path: '/penalties' },
    { id: 'reports', label: 'التقارير', icon: <FileText size={20} />, path: '/reports' },
    { id: 'custody', label: 'العهدة', icon: <Package size={20} />, path: '/custody' },
    { id: 'notifications', label: 'الإشعارات', icon: <Bell size={20} />, path: '/notifications' },
    { id: 'settings', label: 'الإعدادات', icon: <Settings size={20} />, path: '/settings' },
];

export function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div
            className={cn(
                "h-screen bg-[#002147] text-white transition-all duration-300 flex flex-col shadow-2xl z-50",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            {/* Logo Section */}
            <div className="h-16 flex items-center justify-center border-b border-white/10 bg-black/10">
                {!isCollapsed ? (
                    <h1 className="text-xl font-bold tracking-wide text-white">نظام الإسكان</h1>
                ) : (
                    <div className="w-10 h-10 bg-[#F2C94C] rounded-lg flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                        <span className="text-[#002147] font-bold text-lg">ن</span>
                    </div>
                )}
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 py-4 px-3 overflow-y-auto overflow-x-hidden custom-scrollbar">
                <ul className="space-y-1.5">
                    {navItems.map((item) => (
                        <li key={item.id}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) => cn(
                                    "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden",
                                    isActive
                                        ? "bg-[#F2C94C] text-[#002147] font-bold shadow-md transform scale-[1.02]"
                                        : "text-gray-300 hover:bg-white/10 hover:text-white hover:translate-x-1",
                                    isCollapsed && "justify-center px-0"
                                )}
                            >
                                <span className={cn("flex-shrink-0 transition-colors", isCollapsed ? "" : "")}>
                                    {item.icon}
                                </span>

                                {!isCollapsed && (
                                    <span className="text-sm whitespace-nowrap">{item.label}</span>
                                )}

                                {/* Tooltip for collapsed mode */}
                                {isCollapsed && (
                                    <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 px-2 py-1 bg-[#002147] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg border border-white/10">
                                        {item.label}
                                    </div>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Collapse Button */}
            <div className="p-4 border-t border-white/10 bg-black/10">
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300 active:scale-95"
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    {!isCollapsed && <span className="text-xs font-medium">طي القائمة</span>}
                </button>
            </div>
        </div>
    );
}