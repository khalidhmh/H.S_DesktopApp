import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Utensils, MessageSquare, Wrench, Users, AlertCircle, CheckCircle, Megaphone, X, Clock, Calendar, ChevronLeft, Send, Check } from 'lucide-react';

interface DashboardProps {
    userRole: string;
}

export default function DashboardPage({ userRole }: DashboardProps) {
    // توحيد صيغة الدور (Manager / Supervisor)
    const role = userRole ? userRole.toUpperCase() : '';
    // تحديد هل المستخدم مدير أم لا (بناءً على بداية الكلمة لضمان المرونة)
    const isManager = role.startsWith('MANAGER') || role.startsWith('ADMIN');

    return (
        <div className="p-6 space-y-8 animate-fade-in pb-20 w-full">
            {/* --- Header المشترك --- */}
            <header className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {isManager ? 'M' : 'S'}
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-primary">
                            {isManager ? 'مرحباً، د. أحمد محمد' : 'مرحباً، خالد أحمد'}
                        </h1>
                        <p className="text-gray-500 text-sm">
                            {isManager ? 'مدير النظام' : 'مشرف الإسكان - المبنى أ'}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-secondary text-primary rounded-lg text-sm font-bold hover:bg-yellow-400 transition-colors flex items-center gap-2">
                        <Clock size={16} />
                        مزامنة الآن
                    </button>
                    <span className="px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-bold border border-green-200 flex items-center gap-2">
                        Ping: 12ms
                    </span>
                </div>
            </header>

            {/* =====================================================================================
          1. واجهة المدير (Manager View) - الدسمة (4 كروت + منحنيات + موافقات + طوابق)
         ===================================================================================== */}
            {isManager && <ManagerDashboard />}

            {/* =====================================================================================
          2. واجهة المشرف (Supervisor View) - التنفيذية (إعلانات + مهام + جدول)
         ===================================================================================== */}
            {!isManager && <SupervisorDashboard />}
        </div>
    );
}

// ======================= مكونات المدير (Manager Components) =======================

function ManagerDashboard() {
    const stats = { meals: 856, complaints: 7, maintenance: 18, occupancy: '94.8%' };
    const absenceData = [
        { name: 'السبت', value: 10 }, { name: 'الأحد', value: 8 }, { name: 'الإثنين', value: 15 },
        { name: 'الثلاثاء', value: 9 }, { name: 'الأربعاء', value: 7 }, { name: 'الخميس', value: 9 }, { name: 'الجمعة', value: 5 },
    ];

    return (
        <div className="space-y-6">
            {/* 1. الكروت الأربعة الملونة (من صور manager1.png) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="وجبات اليوم" value={stats.meals} icon={Utensils} bg="bg-blue-50" text="text-blue-600" />
                <StatCard title="شكاوى جديدة" value={stats.complaints} icon={MessageSquare} bg="bg-red-50" text="text-red-600" />
                <StatCard title="وقت حل الصيانة" value="24h" subValue="-14% أسرع" icon={Wrench} bg="bg-yellow-50" text="text-yellow-600" />
                <StatCard title="نسبة الإشغال" value={stats.occupancy} subValue="+2.3%" icon={Users} bg="bg-emerald-50" text="text-emerald-600" />
            </div>

            {/* 2. الصف الثاني: منحنى الغياب الأحمر (من manager2.png) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[350px]">
                <div className="flex justify-between mb-4">
                    <h3 className="text-lg font-bold text-primary">اتجاهات الغياب</h3>
                    <span className="text-sm text-gray-400">عدد الطلاب الغائبين خلال الأسبوع الماضي</span>
                </div>
                <ResponsiveContainer width="100%" height="85%">
                    <AreaChart data={absenceData}>
                        <defs>
                            <linearGradient id="colorAbsence" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="name" tick={{ fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                        <Area type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={3} fill="url(#colorAbsence)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* 3. قائمة الموافقات (من manager3.png) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                    <AlertCircle size={20} className="text-yellow-500" />
                    طلبات الموافقة قيد الانتظار
                </h3>
                <div className="space-y-4">
                    <ApprovalItem name="أحمد محمد العلي" id="52024001" reason="انسحاب من الجامعة" type="urgent" />
                    <ApprovalItem name="محمد عبدالله" id="52024045" reason="نقل إلى سكن خارجي" type="normal" />
                    <ApprovalItem name="عبدالرحمن يوسف" id="52024089" reason="تخرج من الجامعة" type="info" />
                </div>
            </div>

            {/* 4. نظرة عامة على الطوابق (من manager3.png أسفل) */}
            <div>
                <h3 className="text-lg font-bold text-primary mb-4">نظرة عامة على المبنى</h3>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    <FloorCard number={1} status="حالة ممتازة" color="text-emerald-600 bg-emerald-50 border-emerald-200" icon={CheckCircle} details="95/100" />
                    <FloorCard number={2} status="أعطال عالية" color="text-red-600 bg-red-50 border-red-200" icon={X} details="88/100" />
                    <FloorCard number={3} status="حالة ممتازة" color="text-emerald-600 bg-emerald-50 border-emerald-200" icon={CheckCircle} details="92/100" />
                    <FloorCard number={4} status="يحتاج متابعة" color="text-yellow-600 bg-yellow-50 border-yellow-200" icon={AlertCircle} details="90/100" />
                    <FloorCard number={5} status="حالة ممتازة" color="text-emerald-600 bg-emerald-50 border-emerald-200" icon={CheckCircle} details="94/100" />
                    <FloorCard number={6} status="حالة ممتازة" color="text-emerald-600 bg-emerald-50 border-emerald-200" icon={CheckCircle} details="94/100" />

                </div>
            </div>
        </div>
    );
}

// ======================= مكونات المشرف (Supervisor Components) =======================

function SupervisorDashboard() {
    return (
        <div className="space-y-6">
            {/* 1. قسم إرسال الإعلان (من supervisor1.png) */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-primary mb-1">إرسال إعلان للطلاب</h3>
                        <p className="text-gray-400 text-sm">أرسل رسالة فورية لجميع طلاب المبنى (مثال: تحذير انقطاع المياه)</p>
                    </div>
                    <Megaphone className="text-secondary w-8 h-8 opacity-80" />
                </div>
                <textarea
                    className="w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-4 h-32 focus:outline-none focus:border-secondary focus:bg-white transition-all resize-none mb-4 font-medium text-gray-700"
                    placeholder="اكتب الإعلان هنا... (سيظهر كإشعار على هواتف الطلاب)"
                ></textarea>
                <div className="flex justify-end gap-3">
                    <button className="px-6 py-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 font-bold">مسح</button>
                    <button className="px-6 py-2.5 bg-secondary text-primary font-bold rounded-xl hover:bg-yellow-400 shadow-lg shadow-yellow-100 flex items-center gap-2">
                        <Send size={18} />
                        إرسال الإعلان الآن
                    </button>
                </div>
            </div>

            {/* 2. جدول اليوم والمهام العاجلة (Layout Grid) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* جدول اليوم */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
                        <Calendar className="text-blue-500" size={20} />
                        جدول اليوم
                    </h3>
                    <div className="space-y-0 relative">
                        {/* الخط الرأسي */}
                        <div className="absolute right-[65px] top-2 bottom-2 w-0.5 bg-gray-100"></div>

                        <ScheduleItem time="08:00" title="تسجيل حضور الطلاب" active />
                        <ScheduleItem time="10:00" title="اجتماع فريق الصيانة" color="bg-yellow-100 text-yellow-700" />
                        <ScheduleItem time="13:00" title="توزيع الوجبات" />
                        <ScheduleItem time="16:00" title="جولة تفقدية للمبنى" />
                        <ScheduleItem time="20:00" title="فحص الأمن المسائي" />
                    </div>
                </div>

                {/* مهام عاجلة */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
                        <AlertCircle className="text-red-500" size={20} />
                        مهام عاجلة
                    </h3>
                    <div className="space-y-4">
                        <TaskItem title="متابعة صيانة التكييف - غرفة 305" time="منذ ساعة" tag="عاجل" tagColor="bg-red-100 text-red-600" />
                        <TaskItem title="التحقق من شكوى الطابق الثاني" time="منذ ساعتين" tag="مهم" tagColor="bg-yellow-100 text-yellow-700" />
                        <TaskItem title="تأكيد حضور الطلاب الجدد" time="منذ 3 ساعات" tag="عادي" tagColor="bg-blue-100 text-blue-600" />
                        <TaskItem title="فحص أجهزة الإنذار" time="منذ 4 ساعات" tag="عاجل" tagColor="bg-red-100 text-red-600" />
                    </div>
                </div>
            </div>
        </div>
    );
}

// ======================= Sub Components =======================

const StatCard = ({ title, value, subValue, icon: Icon, bg, text }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
        <div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
            <h2 className={`text-3xl font-bold ${text}`}>{value}</h2>
            {subValue && <span className="text-xs font-bold bg-gray-50 px-2 py-0.5 rounded text-gray-500 mt-1 inline-block">{subValue}</span>}
        </div>
        <div className={`p-4 rounded-xl ${bg}`}>
            <Icon className={`w-6 h-6 ${text}`} />
        </div>
    </div>
);

const ApprovalItem = ({ name, id, reason, type }: any) => (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex justify-between items-center group hover:bg-white hover:shadow-sm transition-all">
        <div>
            <h4 className="font-bold text-primary flex items-center gap-2">
                {name}
                <span className="text-gray-400 text-xs font-normal bg-white px-2 py-1 border rounded-full">({id})</span>
                {type === 'urgent' && <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-bold">عاجل</span>}
                {type === 'info' && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-bold">عادي</span>}
                {type === 'normal' && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-bold">متوسط</span>}
            </h4>
            <p className="text-sm text-gray-500 mt-1 mr-1">السبب: {reason}</p>
        </div>
        <div className="flex items-center gap-3">
            <button className="flex items-center gap-1 bg-emerald-500 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-emerald-600 shadow-emerald-200 shadow-md">
                <CheckCircle size={16} /> موافقة
            </button>
            <button className="flex items-center gap-1 bg-white text-red-500 border border-red-200 px-5 py-2 rounded-lg font-bold text-sm hover:bg-red-50 hover:border-red-300">
                <X size={16} /> رفض
            </button>
        </div>
    </div>
);

const FloorCard = ({ number, status, color, icon: Icon, details }: any) => (
    <div className={`p-5 rounded-2xl border ${color} text-center flex flex-col items-center gap-2 shadow-sm bg-opacity-10 bg-white`}>
        <h4 className="font-bold text-lg text-primary">الطابق {number}</h4>
        <Icon className="w-8 h-8 my-1" />
        <p className="text-sm font-bold opacity-90">{status}</p>
        <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-current opacity-50" style={{ width: '80%' }}></div>
        </div>
        <p className="text-xs opacity-60 mt-1">{details} إشغال</p>
    </div>
);

const ScheduleItem = ({ time, title, color = "bg-white border-gray-100", active }: any) => (
    <div className="flex items-center gap-4 py-3 relative z-10">
        <div className={`w-16 py-1 text-center rounded-lg text-sm font-bold ${active ? 'bg-secondary text-primary shadow-md' : 'bg-gray-50 text-gray-500'}`}>
            {time}
        </div>
        <div className={`flex-1 p-3 rounded-xl border ${active ? 'bg-blue-50 border-blue-100' : color} ${active ? 'shadow-sm' : ''}`}>
            <h4 className={`font-bold ${active ? 'text-primary' : 'text-gray-700'}`}>{title}</h4>
        </div>
        {active && <div className="absolute right-[61px] w-2.5 h-2.5 bg-secondary rounded-full border-2 border-white shadow-sm"></div>}
    </div>
);

const TaskItem = ({ title, time, tag, tagColor }: any) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-gray-100">
        <div>
            <h4 className="font-bold text-gray-800 text-sm">{title}</h4>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <Clock size={12} /> {time}
            </p>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full font-bold ${tagColor}`}>
            {tag}
        </span>
    </div>
);