import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Users, Building, Wrench, MessageSquareWarning, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
  trendValue?: string;
  color: string;
}

function StatCard({ title, value, icon, trend, trendValue, color }: StatCardProps) {
  return (
    <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${color}15` }}
          >
            <div style={{ color }}>{icon}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <p className="text-3xl font-bold text-[#002147]">{value}</p>
          {trend && trendValue && (
            <div
              className={`flex items-center gap-1 text-sm ${
                trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface ActivityItem {
  id: string;
  title: string;
  time: string;
  type: 'info' | 'warning' | 'success';
}

const recentActivities: ActivityItem[] = [
  { id: '1', title: 'تم تسجيل طالب جديد - محمد علي', time: 'منذ 5 دقائق', type: 'success' },
  { id: '2', title: 'طلب صيانة جديد - غرفة 204', time: 'منذ 15 دقيقة', type: 'warning' },
  { id: '3', title: 'تم الانتهاء من صيانة التكييف', time: 'منذ ساعة', type: 'success' },
  { id: '4', title: 'شكوى جديدة من الطابق الثاني', time: 'منذ ساعتين', type: 'warning' },
  { id: '5', title: 'تحديث بيانات الطالب - خالد أحمد', time: 'منذ 3 ساعات', type: 'info' },
];

export function DashboardContent() {
  return (
    <div className="p-6 space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="إجمالي الطلاب"
          value="856"
          icon={<Users size={24} />}
          trend="up"
          trendValue="+12%"
          color="#3B82F6"
        />
        <StatCard
          title="الوحدات السكنية"
          value="42"
          icon={<Building size={24} />}
          trend="up"
          trendValue="+3"
          color="#10B981"
        />
        <StatCard
          title="طلبات الصيانة"
          value="18"
          icon={<Wrench size={24} />}
          trend="down"
          trendValue="-5"
          color="#F2C94C"
        />
        <StatCard
          title="الشكاوى المفتوحة"
          value="7"
          icon={<MessageSquareWarning size={24} />}
          trend="down"
          trendValue="-2"
          color="#EF4444"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="lg:col-span-2 rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-[#002147]">النشاطات الأخيرة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      activity.type === 'success'
                        ? 'bg-green-500'
                        : activity.type === 'warning'
                        ? 'bg-yellow-500'
                        : 'bg-blue-500'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#002147] font-medium">{activity.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-[#002147]">إحصائيات سريعة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">نسبة الإشغال</span>
                <span className="text-sm font-bold text-[#002147]">94%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-[#F2C94C] h-2 rounded-full" style={{ width: '94%' }} />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">الحضور اليوم</span>
                <span className="text-sm font-bold text-[#002147]">812/856</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }} />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">معدل الرضا</span>
                <span className="text-sm font-bold text-[#002147]">4.6/5.0</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }} />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button className="w-full bg-[#F2C94C] hover:bg-[#F2C94C]/90 text-[#002147] font-medium py-2 rounded-lg transition-colors">
                عرض جميع الإحصائيات
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-[#002147]">الصيانة القادمة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { room: 'غرفة 305', task: 'صيانة دورية للتكييف', date: '2026-02-02' },
                { room: 'غرفة 412', task: 'فحص الكهرباء', date: '2026-02-03' },
                { room: 'قاعة الطعام', task: 'صيانة المعدات', date: '2026-02-05' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-[#002147]">{item.room}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.task}</p>
                  </div>
                  <span className="text-xs text-gray-600">{item.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-[#002147]">الإشعارات الحديثة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { message: 'تذكير: اجتماع فريق الإسكان غداً الساعة 10 صباحاً', priority: 'high' },
                { message: 'تم رفع التقرير الشهري بنجاح', priority: 'low' },
                { message: 'يوجد 3 طلبات صيانة تحتاج موافقة', priority: 'medium' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      item.priority === 'high'
                        ? 'bg-red-500'
                        : item.priority === 'medium'
                        ? 'bg-yellow-500'
                        : 'bg-blue-500'
                    }`}
                  />
                  <p className="text-sm text-gray-700">{item.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
