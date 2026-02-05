import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../viewmodels/useAuthStore';
import {
    LayoutDashboard,
    Users,
    BedDouble,
    FileText,
    Settings,
    ClipboardCheck,
    MessageSquareWarning,
    Wrench,
    LogOut,
    AlertTriangle
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const Sidebar = () => {
    const { currentUser, logout } = useAuthStore();
    const role = currentUser?.role || '';

    const managerLinks = [
        { name: 'لوحة التحكم', path: '/', icon: LayoutDashboard },
        { name: 'الطلاب', path: '/students', icon: Users },
        { name: 'الغرف', path: '/rooms', icon: BedDouble },
        { name: 'الشكاوى والصيانة', path: '/complaints', icon: MessageSquareWarning },
        { name: 'المخالفات', path: '/penalties', icon: AlertTriangle },
        { name: 'التقارير', path: '/reports', icon: FileText },
        { name: 'الإعدادات', path: '/settings', icon: Settings },
    ];

    const supervisorLinks = [
        { name: 'لوحة التحكم', path: '/', icon: LayoutDashboard },
        { name: 'التمام اليومي', path: '/attendance', icon: ClipboardCheck },
        { name: 'الشكاوى والصيانة', path: '/complaints', icon: MessageSquareWarning },
        { name: 'الصيانة', path: '/maintenance', icon: Wrench },
    ];

    const links = role === 'MANAGER' ? managerLinks : supervisorLinks;

    return (
        <aside className="w-64 bg-[#1e1b4b] text-white flex flex-col h-screen shadow-xl transition-all duration-300">
            {/* Logo Area */}
            <div className="h-16 flex items-center justify-center border-b border-white/10 bg-[#151336]">
                <h1 className="text-xl font-bold text-[#F2C94C] tracking-wide">نظام المدن الجامعية</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group text-gray-300 hover:bg-white/10 hover:text-white",
                            isActive && "bg-[#F2C94C] text-[#1e1b4b] font-bold shadow-md hover:bg-[#F2C94C] hover:text-[#1e1b4b]"
                        )}
                    >
                        <link.icon size={20} className="shrink-0" />
                        <span>{link.name}</span>
                    </NavLink>
                ))}
            </nav>

            {/* User Profile / Logout */}
            <div className="p-4 border-t border-white/10 bg-[#151336]">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-lg">
                        {currentUser?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium truncate text-white">{currentUser?.name || 'مستخدم'}</p>
                        <p className="text-xs text-gray-400 truncate">{role === 'MANAGER' ? 'مدير النظام' : 'مشرف مبنى'}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600/10 hover:bg-red-600 text-red-100 rounded-lg transition-colors text-sm"
                >
                    <LogOut size={16} />
                    تسجيل الخروج
                </button>
            </div>
        </aside>
    );
};
