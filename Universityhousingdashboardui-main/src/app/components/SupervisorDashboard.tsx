import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Users, Wrench, MessageSquareWarning, UtensilsCrossed, Megaphone, ClipboardCheck, AlertTriangle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Textarea } from '@/app/components/ui/textarea';
import { useState } from 'react';

interface QuickStatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

function QuickStatCard({ title, value, icon, color, bgColor }: QuickStatCardProps) {
  return (
    <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow border-none" style={{ backgroundColor: bgColor }}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium mb-2" style={{ color }}>{title}</p>
            <p className="text-4xl font-bold" style={{ color }}>{value}</p>
          </div>
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
          >
            <div style={{ color }}>{icon}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface QuickActionButtonProps {
  label: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}

function QuickActionButton({ label, icon, color, onClick }: QuickActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all transform hover:scale-105"
      style={{ backgroundColor: color }}
    >
      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
        <div className="text-white">{icon}</div>
      </div>
      <span className="text-white font-semibold text-sm">{label}</span>
    </button>
  );
}

export function SupervisorDashboard() {
  const [announcement, setAnnouncement] = useState('');

  const handleSendAnnouncement = () => {
    if (announcement.trim()) {
      alert(`تم إرسال الإعلان: ${announcement}`);
      setAnnouncement('');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Top Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <QuickStatCard
          title="الطلاب الحاضرون اليوم"
          value="812"
          icon={<Users size={28} />}
          color="#10B981"
          bgColor="#ECFDF5"
        />
        <QuickStatCard
          title="صيانة قيد الانتظار"
          value="18"
          icon={<Wrench size={28} />}
          color="#F59E0B"
          bgColor="#FFFBEB"
        />
        <QuickStatCard
          title="شكاوى جديدة"
          value="7"
          icon={<MessageSquareWarning size={28} />}
          color="#EF4444"
          bgColor="#FEF2F2"
        />
        <QuickStatCard
          title="وجبات اليوم"
          value="856"
          icon={<UtensilsCrossed size={28} />}
          color="#3B82F6"
          bgColor="#EFF6FF"
        />
      </div>

      {/* Quick Actions Widget */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-[#002147]">إجراءات سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickActionButton
              label="إنشاء إعلان"
              icon={<Megaphone size={24} />}
              color="#8B5CF6"
              onClick={() => document.getElementById('announcement-input')?.focus()}
            />
            <QuickActionButton
              label="بدء الحضور"
              icon={<ClipboardCheck size={24} />}
              color="#10B981"
              onClick={() => alert('فتح نظام الحضور')}
            />
            <QuickActionButton
              label="بلاغ عطل عاجل"
              icon={<AlertTriangle size={24} />}
              color="#EF4444"
              onClick={() => alert('فتح نموذج البلاغ العاجل')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Announcement Section */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-[#002147]">إرسال إعلان للطلاب</CardTitle>
          <p className="text-sm text-gray-500 mt-1">أرسل رسالة فورية لجميع الطلاب (مثال: تحذير انقطاع المياه)</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            id="announcement-input"
            placeholder="اكتب الإعلان هنا... (مثال: عزيزي الطالب، نود إعلامكم بأنه سيتم قطع المياه يوم غد من الساعة 9 صباحاً حتى 12 ظهراً للصيانة الدورية)"
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            className="min-h-[120px] resize-none text-right"
          />
          <div className="flex items-center gap-3">
            <Button
              onClick={handleSendAnnouncement}
              className="bg-[#F2C94C] hover:bg-[#F2C94C]/90 text-[#002147] font-semibold"
            >
              <Megaphone size={18} className="ml-2" />
              إرسال الإعلان الآن
            </Button>
            <Button
              variant="outline"
              onClick={() => setAnnouncement('')}
              className="border-gray-300"
            >
              مسح
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Urgent Tasks */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-[#002147] flex items-center gap-2">
              <AlertTriangle size={20} className="text-red-500" />
              مهام عاجلة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { task: 'متابعة صيانة التكييف - غرفة 305', priority: 'عاجل', time: 'منذ ساعة' },
                { task: 'التحقق من شكوى الطابق الثاني', priority: 'مهم', time: 'منذ ساعتين' },
                { task: 'تأكيد حضور الطلاب الجدد', priority: 'عادي', time: 'منذ 3 ساعات' },
                { task: 'فحص أجهزة الإنذار', priority: 'عاجل', time: 'منذ 4 ساعات' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#002147]">{item.task}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.priority === 'عاجل'
                        ? 'bg-red-100 text-red-700'
                        : item.priority === 'مهم'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {item.priority}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-[#002147]">جدول اليوم</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: '08:00', event: 'تسجيل حضور الطلاب', status: 'completed' },
                { time: '10:00', event: 'اجتماع فريق الصيانة', status: 'current' },
                { time: '13:00', event: 'توزيع الوجبات', status: 'upcoming' },
                { time: '16:00', event: 'جولة تفقدية للمبنى', status: 'upcoming' },
                { time: '20:00', event: 'فحص الأمن المسائي', status: 'upcoming' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div
                    className={`w-16 text-sm font-semibold text-center py-2 rounded-lg ${
                      item.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : item.status === 'current'
                        ? 'bg-[#F2C94C] text-[#002147]'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {item.time}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-sm ${
                        item.status === 'completed'
                          ? 'text-gray-400 line-through'
                          : 'text-[#002147] font-medium'
                      }`}
                    >
                      {item.event}
                    </p>
                  </div>
                  {item.status === 'current' && (
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
