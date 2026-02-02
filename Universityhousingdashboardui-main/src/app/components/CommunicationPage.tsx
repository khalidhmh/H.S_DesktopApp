import { useState } from 'react';
import { 
  Bell, 
  Send, 
  Users, 
  Building, 
  DoorOpen, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowLeft,
  Filter,
  MoreVertical,
  User,
  Megaphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Notification {
  id: string;
  title: string;
  time: string;
  type: 'fault' | 'approval' | 'complaint' | 'system';
  description: string;
  actionUrl: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'بلاغ عطل جديد في الغرفة 102',
    time: 'منذ 5 دقائق',
    type: 'fault',
    description: 'تم تقديم بلاغ عن تسرب مياه في دورة المياه الخاصة بالغرفة.',
    actionUrl: '/maintenance/102'
  },
  {
    id: '2',
    title: 'طلب موافقة من المشرف المناوب',
    time: 'منذ ساعة',
    type: 'approval',
    description: 'يطلب المشرف الموافقة على طلب خروج استثنائي لطالب.',
    actionUrl: '/approvals'
  },
  {
    id: '3',
    title: 'شكوى عاجلة بخصوص المطعم',
    time: 'منذ ساعتين',
    type: 'complaint',
    description: 'هناك شكوى جماعية من طلاب الطابق الرابع بخصوص وجبة العشاء.',
    actionUrl: '/complaints/urgent'
  }
];

export function CommunicationPage() {
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState('all');
  const supervisorName = 'م. أحمد خالد';

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'fault': return <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center"><AlertCircle size={20} /></div>;
      case 'approval': return <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><CheckCircle2 size={20} /></div>;
      case 'complaint': return <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center"><Megaphone size={20} /></div>;
      default: return <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center"><Bell size={20} /></div>;
    }
  };

  return (
    <div className="p-6 bg-[#F5F7FA] h-full overflow-y-auto" dir="rtl">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Section A: System Notifications (Inbox) */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-[#002147] flex items-center gap-3">
              <Bell size={24} className="text-[#F2C94C]" />
              مركز الإشعارات
            </h2>
            <button className="text-xs font-bold text-gray-400 hover:text-[#002147] flex items-center gap-1 transition-colors">
              <CheckCircle2 size={14} />
              تحديد الكل كمقروء
            </button>
          </div>

          <div className="space-y-4">
            {mockNotifications.map((notif) => (
              <motion.div 
                key={notif.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 flex items-start gap-4 group hover:border-[#F2C94C]/50 transition-all"
              >
                {getTypeIcon(notif.type)}
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-[#002147] group-hover:text-[#F2C94C] transition-colors">{notif.title}</h3>
                    <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                      <Clock size={12} />
                      {notif.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4 leading-relaxed">{notif.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <button className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
                      عرض التفاصيل واتخاذ إجراء
                      <ArrowLeft size={14} />
                    </button>
                    <button className="p-1.5 text-gray-300 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <button className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold text-sm hover:border-[#F2C94C] hover:text-[#F2C94C] transition-all">
            عرض الإشعارات القديمة
          </button>
        </div>

        {/* Section B: Broadcast Announcements (Outbox) */}
        <div className="w-full lg:w-[450px]">
          <div className="bg-[#002147] rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-xl font-black mb-6 flex items-center gap-3">
                <Send size={24} className="text-[#F2C94C]" />
                إرسال تعميم للطلاب
              </h2>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/60">الجمهور المستهدف</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => setTargetAudience('all')}
                      className={`py-2 px-1 rounded-xl text-[10px] font-black transition-all flex flex-col items-center gap-1 ${targetAudience === 'all' ? 'bg-[#F2C94C] text-[#002147]' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
                    >
                      <Building size={16} />
                      كل المبنى
                    </button>
                    <button 
                      onClick={() => setTargetAudience('floor')}
                      className={`py-2 px-1 rounded-xl text-[10px] font-black transition-all flex flex-col items-center gap-1 ${targetAudience === 'floor' ? 'bg-[#F2C94C] text-[#002147]' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
                    >
                      <Filter size={16} />
                      طابق محدد
                    </button>
                    <button 
                      onClick={() => setTargetAudience('room')}
                      className={`py-2 px-1 rounded-xl text-[10px] font-black transition-all flex flex-col items-center gap-1 ${targetAudience === 'room' ? 'bg-[#F2C94C] text-[#002147]' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
                    >
                      <DoorOpen size={16} />
                      غرفة محددة
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/60">نص الرسالة</label>
                  <textarea 
                    placeholder="اكتب التعميم هنا... (مثال: سيتم قطع المياه يوم الثلاثاء للصيانة)"
                    className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#F2C94C] outline-none min-h-[150px] resize-none text-white placeholder:text-white/30"
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                  />
                </div>

                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-bold text-white/40 mb-2 uppercase tracking-widest">معاينة التوقيع</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F2C94C] flex items-center justify-center text-[#002147]">
                      <User size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-bold">{supervisorName}</p>
                      <p className="text-[10px] text-white/40">المشرف المسؤول</p>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-[#F2C94C] text-[#002147] py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-[#e0b83b] transition-all shadow-lg">
                  إرسال الآن للجميع
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-white p-6 rounded-[24px] border border-gray-100">
            <h4 className="text-sm font-bold text-[#002147] mb-4">إحصائيات الإرسال</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">عدد الطلاب المستهدفين</span>
                <span className="font-bold text-[#002147]">450 طالب</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">نسبة الوصول المقدرة</span>
                <span className="font-bold text-green-600">98% (التطبيق نشط)</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
