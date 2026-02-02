import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CheckCircle, XCircle, TrendingUp, TrendingDown, AlertTriangle, CheckCheck } from 'lucide-react';

// Occupancy Rate Data
const occupancyData = [
  { name: 'مشغول', value: 812, color: '#10B981' },
  { name: 'شاغر', value: 44, color: '#E5E7EB' },
];

// Maintenance Resolution Time Data
const maintenanceData = [
  { month: 'أكتوبر', hours: 48 },
  { month: 'نوفمبر', hours: 36 },
  { month: 'ديسمبر', hours: 28 },
  { month: 'يناير', hours: 24 },
];

// Absence Trends Data
const absenceData = [
  { day: 'السبت', absent: 12 },
  { day: 'الأحد', absent: 8 },
  { day: 'الإثنين', absent: 15 },
  { day: 'الثلاثاء', absent: 10 },
  { day: 'الأربعاء', absent: 7 },
  { day: 'الخميس', absent: 9 },
  { day: 'الجمعة', absent: 5 },
];

interface PendingApproval {
  id: string;
  studentName: string;
  studentId: string;
  requestedBy: string;
  reason: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
}

const pendingApprovals: PendingApproval[] = [
  {
    id: '1',
    studentName: 'أحمد محمد العلي',
    studentId: 'S2024001',
    requestedBy: 'المشرف: خالد أحمد',
    reason: 'انسحاب من الجامعة',
    date: '2026-01-30',
    priority: 'high',
  },
  {
    id: '2',
    studentName: 'محمد عبدالله',
    studentId: 'S2024045',
    requestedBy: 'المشرف: فهد سعيد',
    reason: 'نقل إلى سكن خارجي',
    date: '2026-01-29',
    priority: 'medium',
  },
  {
    id: '3',
    studentName: 'عبدالرحمن يوسف',
    studentId: 'S2024089',
    requestedBy: 'المشرف: خالد أحمد',
    reason: 'تخرج من الجامعة',
    date: '2026-01-28',
    priority: 'low',
  },
];

interface FloorStatus {
  floor: number;
  status: 'ok' | 'warning' | 'critical';
  faults: number;
  occupancy: number;
  total: number;
}

const buildingStatus: FloorStatus[] = [
  { floor: 1, status: 'ok', faults: 0, occupancy: 95, total: 100 },
  { floor: 2, status: 'critical', faults: 8, occupancy: 88, total: 100 },
  { floor: 3, status: 'ok', faults: 1, occupancy: 92, total: 100 },
  { floor: 4, status: 'warning', faults: 3, occupancy: 90, total: 100 },
  { floor: 5, status: 'ok', faults: 0, occupancy: 94, total: 100 },
];

export function ManagerDashboard() {
  const handleApprove = (id: string, studentName: string) => {
    alert(`تمت الموافقة على طلب حذف الطالب: ${studentName}`);
  };

  const handleReject = (id: string, studentName: string) => {
    alert(`تم رفض طلب حذف الطالب: ${studentName}`);
  };

  const getStatusColor = (status: FloorStatus['status']) => {
    switch (status) {
      case 'ok':
        return { bg: '#ECFDF5', text: '#10B981', border: '#10B981' };
      case 'warning':
        return { bg: '#FFFBEB', text: '#F59E0B', border: '#F59E0B' };
      case 'critical':
        return { bg: '#FEF2F2', text: '#EF4444', border: '#EF4444' };
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="rounded-2xl shadow-sm border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">نسبة الإشغال</p>
                <p className="text-3xl font-bold text-[#002147]">94.8%</p>
                <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                  <TrendingUp size={14} />
                  <span>+2.3%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">وقت حل الصيانة</p>
                <p className="text-3xl font-bold text-[#002147]">24h</p>
                <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                  <TrendingDown size={14} />
                  <span>-14% أسرع</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-l-4 border-l-yellow-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">معدل الغياب</p>
                <p className="text-3xl font-bold text-[#002147]">5.1%</p>
                <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                  <TrendingUp size={14} />
                  <span>+0.8%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-l-4 border-l-purple-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">طلبات قيد الانتظار</p>
                <p className="text-3xl font-bold text-[#002147]">{pendingApprovals.length}</p>
                <p className="text-sm text-gray-500 mt-2">تحتاج مراجعة</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Occupancy Rate Pie Chart */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-[#002147]">نسبة الإشغال</CardTitle>
            <p className="text-sm text-gray-500">توزيع الوحدات السكنية</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={occupancyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {occupancyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center">
              <p className="text-2xl font-bold text-[#002147]">812 / 856</p>
              <p className="text-sm text-gray-500">طالب مسجل</p>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Resolution Time Line Chart */}
        <Card className="rounded-2xl shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg text-[#002147]">وقت حل الصيانة (بالساعات)</CardTitle>
            <p className="text-sm text-gray-500">المعدل الشهري لإنجاز طلبات الصيانة</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={maintenanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    textAlign: 'right'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#F2C94C" 
                  strokeWidth={3}
                  name="الساعات"
                  dot={{ fill: '#F2C94C', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Absence Trends Chart */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-[#002147]">اتجاهات الغياب</CardTitle>
          <p className="text-sm text-gray-500">عدد الطلاب الغائبين خلال الأسبوع الماضي</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={absenceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="day" stroke="#6B7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  textAlign: 'right'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="absent" 
                stroke="#EF4444" 
                strokeWidth={3}
                name="الغائبون"
                dot={{ fill: '#EF4444', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pending Approvals Section */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-[#002147] flex items-center gap-2">
            <AlertTriangle size={20} className="text-yellow-500" />
            طلبات الموافقة قيد الانتظار
          </CardTitle>
          <p className="text-sm text-gray-500">طلبات حذف الطلاب الواردة من المشرفين</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingApprovals.map((approval) => (
              <div
                key={approval.id}
                className="flex items-center justify-between p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-base font-bold text-[#002147]">{approval.studentName}</h3>
                    <span className="text-sm text-gray-500">({approval.studentId})</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        approval.priority === 'high'
                          ? 'bg-red-100 text-red-700'
                          : approval.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {approval.priority === 'high' ? 'عاجل' : approval.priority === 'medium' ? 'متوسط' : 'عادي'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">السبب: {approval.reason}</p>
                  <p className="text-xs text-gray-500">
                    {approval.requestedBy} • {approval.date}
                  </p>
                </div>
                <div className="flex items-center gap-3 mr-4">
                  <Button
                    onClick={() => handleApprove(approval.id, approval.studentName)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle size={18} className="ml-2" />
                    موافقة
                  </Button>
                  <Button
                    onClick={() => handleReject(approval.id, approval.studentName)}
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <XCircle size={18} className="ml-2" />
                    رفض
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Building Overview */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-[#002147]">نظرة عامة على المبنى</CardTitle>
          <p className="text-sm text-gray-500">ملخص حالة كل طابق</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {buildingStatus.map((floor) => {
              const colors = getStatusColor(floor.status);
              return (
                <div
                  key={floor.floor}
                  className="p-5 rounded-xl border-2 transition-all hover:shadow-md"
                  style={{ 
                    backgroundColor: colors.bg, 
                    borderColor: colors.border 
                  }}
                >
                  <div className="text-center">
                    <p className="text-sm font-medium mb-2" style={{ color: colors.text }}>
                      الطابق {floor.floor}
                    </p>
                    <div className="mb-3">
                      {floor.status === 'ok' && <CheckCheck size={32} style={{ color: colors.text }} className="mx-auto" />}
                      {floor.status === 'warning' && <AlertTriangle size={32} style={{ color: colors.text }} className="mx-auto" />}
                      {floor.status === 'critical' && <XCircle size={32} style={{ color: colors.text }} className="mx-auto" />}
                    </div>
                    <p className="text-xs mb-2" style={{ color: colors.text }}>
                      {floor.status === 'ok' && 'حالة ممتازة'}
                      {floor.status === 'warning' && 'يحتاج متابعة'}
                      {floor.status === 'critical' && 'أعطال عالية'}
                    </p>
                    <div className="space-y-1 pt-2 border-t" style={{ borderColor: colors.border }}>
                      <p className="text-xs font-semibold" style={{ color: colors.text }}>
                        أعطال: {floor.faults}
                      </p>
                      <p className="text-xs" style={{ color: colors.text }}>
                        إشغال: {floor.occupancy}/{floor.total}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
