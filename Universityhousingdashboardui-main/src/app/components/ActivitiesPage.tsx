import { useState } from 'react';
import { 
  Calendar, 
  Users, 
  MapPin, 
  Plus, 
  Clock, 
  Search,
  Filter,
  X,
  Upload,
  ChevronLeft,
  CheckCircle2,
  Trash2,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  maxParticipants: number | 'unlimited';
  registeredCount: number;
  coverImage: string;
  category: string;
}

const mockActivities: Activity[] = [
  {
    id: '1',
    title: 'دوري كرة القدم الرمضاني',
    description: 'دوري كرة قدم بنظام المجموعات لطلاب السكن الجامعي. سيتم توزيع الجوائز على المراكز الثلاثة الأولى.',
    date: '2026/02/15',
    time: '08:00 م',
    location: 'الملعب الرياضي الرئيسي',
    maxParticipants: 32,
    registeredCount: 24,
    coverImage: 'https://images.unsplash.com/photo-1546717003-caee5f93a9db?w=800&fit=crop',
    category: 'رياضي'
  },
  {
    id: '2',
    title: 'ندوة التفوق الدراسي',
    description: 'ندوة حوارية مع نخبة من أساتذة الجامعة حول طرق المذاكرة الفعالة وكيفية الاستعداد للامتحانات.',
    date: '2026/02/10',
    time: '04:30 م',
    location: 'قاعة الاجتماعات الكبرى',
    maxParticipants: 100,
    registeredCount: 85,
    coverImage: 'https://images.unsplash.com/photo-1589872880544-76e896b0592c?w=800&fit=crop',
    category: 'تعليمي'
  },
  {
    id: '3',
    title: 'بطولة الشطرنج المفتوحة',
    description: 'بطولة شطرنج بنظام الخروج المغلوب. الدعوة عامة لجميع محبي اللعبة من مختلف المستويات.',
    date: '2026/02/12',
    time: '06:00 م',
    location: 'صالة الألعاب الاجتماعية',
    maxParticipants: 'unlimited',
    registeredCount: 45,
    coverImage: 'https://images.unsplash.com/photo-1761910933033-d19b9c17c7db?w=800&fit=crop',
    category: 'ترفيهي'
  }
];

export function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  return (
    <div className="p-6 bg-[#F5F7FA] h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#002147] mb-1">الأنشطة والفعاليات</h1>
            <p className="text-gray-500 text-sm">إدارة الفعاليات الاجتماعية والرياضية والتعليمية في السكن.</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-[#F2C94C] text-[#002147] font-bold px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-[#e0b83b] transition-all shadow-sm"
          >
            <Plus size={20} />
            إضافة نشاط جديد
          </button>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-2xl shadow-sm mb-8 flex flex-wrap items-center justify-between gap-4 border border-gray-100">
          <div className="relative flex-1 max-w-md">
            <input 
              type="text" 
              placeholder="البحث عن نشاط..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm pr-10 focus:ring-2 focus:ring-[#F2C94C] outline-none"
            />
            <Search className="absolute right-3 top-3 text-gray-400" size={18} />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#002147] px-3 py-2 rounded-lg hover:bg-gray-50 transition-all">
              <Filter size={18} />
              تصفية
            </button>
            <div className="h-6 w-px bg-gray-200" />
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button className="px-4 py-1.5 text-xs font-bold bg-white text-[#002147] rounded-md shadow-sm">الكل</button>
              <button className="px-4 py-1.5 text-xs font-bold text-gray-500 hover:text-[#002147]">رياضي</button>
              <button className="px-4 py-1.5 text-xs font-bold text-gray-500 hover:text-[#002147]">ثقافي</button>
            </div>
          </div>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <motion.div
              key={activity.id}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedActivity(activity)}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer group hover:shadow-xl transition-all"
            >
              <div className="relative h-48 overflow-hidden">
                <ImageWithFallback 
                  src={activity.coverImage} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  alt={activity.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg">
                  <span className="text-xs font-bold text-[#002147]">{activity.category}</span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-bold text-[#002147] mb-2 group-hover:text-[#F2C94C] transition-colors">{activity.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">{activity.description}</p>
                
                <div className="space-y-3 pt-4 border-t border-gray-50">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={14} className="text-[#F2C94C]" />
                      {activity.date}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={14} className="text-[#F2C94C]" />
                      {activity.time}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                    <MapPin size={14} className="text-[#F2C94C]" />
                    {activity.location}
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2 rtl:space-x-reverse">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                            <ImageWithFallback src={`https://i.pravatar.cc/100?u=${activity.id}-${i}`} alt="user" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                      <span className="text-[11px] font-bold text-gray-400">
                        {activity.registeredCount}/{activity.maxParticipants === 'unlimited' ? '∞' : activity.maxParticipants} مسجل
                      </span>
                    </div>
                    <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#F2C94C]" 
                        style={{ width: `${(activity.registeredCount / (typeof activity.maxParticipants === 'number' ? activity.maxParticipants : 100)) * 100}%` }} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateActivityModal onClose={() => setShowCreateModal(false)} />
        )}
        {selectedActivity && (
          <ActivityDetailsModal 
            activity={selectedActivity} 
            onClose={() => setSelectedActivity(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CreateActivityModal({ onClose }: { onClose: () => void }) {
  const [isUnlimited, setIsUnlimited] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" dir="rtl">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#002147]">إنشاء نشاط جديد</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {/* Cover Upload */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">صورة الغلاف</label>
            <div className="w-full border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100/50 transition-all cursor-pointer">
              <Upload className="text-gray-400 mb-3" size={32} />
              <p className="text-sm font-bold text-gray-500">انقر لرفع صورة الغلاف</p>
              <p className="text-xs text-gray-400 mt-1">المقاس الموصى به: 800×400 بكسل</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">عنوان النشاط</label>
              <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#F2C94C] outline-none" placeholder="مثال: بطولة تنس الطاولة" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">التصنيف</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#F2C94C] outline-none appearance-none">
                <option>رياضي</option>
                <option>ثقافي</option>
                <option>ترفيهي</option>
                <option>تعليمي</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">وصف النشاط</label>
            <textarea className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#F2C94C] outline-none h-32 resize-none" placeholder="اكتب تفاصيل النشاط هنا..." />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">التاريخ</label>
              <div className="relative">
                <input type="date" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#F2C94C] outline-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">الوقت</label>
              <input type="time" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#F2C94C] outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">الموقع</label>
              <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#F2C94C] outline-none" placeholder="مثال: الصالة الرياضية" />
            </div>
          </div>

          <div className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-bold text-gray-700">الحد الأقصى للمشاركين</label>
              <input 
                disabled={isUnlimited}
                type="number" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#F2C94C] outline-none disabled:opacity-50" 
                placeholder="مثال: 50" 
              />
            </div>
            <div className="flex items-center gap-3 mb-3">
              <button 
                onClick={() => setIsUnlimited(!isUnlimited)}
                className={`w-12 h-6 rounded-full transition-colors relative ${isUnlimited ? 'bg-[#F2C94C]' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isUnlimited ? 'left-1' : 'left-7'}`} />
              </button>
              <span className="text-sm font-bold text-gray-600">غير محدود</span>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-4">
          <button onClick={onClose} className="px-6 py-3 font-bold text-gray-500 hover:bg-gray-200 rounded-xl transition-all">إلغاء</button>
          <button className="bg-[#002147] text-white px-10 py-3 rounded-xl font-bold hover:bg-[#003366] transition-all shadow-md">نشر النشاط</button>
        </div>
      </motion.div>
    </div>
  );
}

function ActivityDetailsModal({ activity, onClose }: { activity: Activity, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" dir="rtl">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="relative h-64">
          <ImageWithFallback src={activity.coverImage} className="w-full h-full object-cover" alt={activity.title} />
          <div className="absolute inset-0 bg-black/40" />
          <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-all">
            <X size={24} />
          </button>
          <div className="absolute bottom-6 right-6">
            <span className="bg-[#F2C94C] text-[#002147] px-3 py-1 rounded-lg text-xs font-bold mb-2 inline-block">نشاط {activity.category}</span>
            <h2 className="text-2xl font-bold text-white">{activity.title}</h2>
          </div>
          <div className="absolute bottom-6 left-6 flex gap-2">
            <button className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-xl text-white transition-all">
              <Share2 size={20} />
            </button>
            <button className="p-2 bg-red-500/20 hover:bg-red-500/40 backdrop-blur-md rounded-xl text-white transition-all">
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="flex gap-8">
            <div className="flex-1 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[#002147] mb-3">عن النشاط</h3>
                <p className="text-gray-600 leading-relaxed">{activity.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-xs text-gray-400 font-bold mb-1">الموعد</p>
                  <p className="text-sm font-bold text-[#002147]">{activity.date} • {activity.time}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-xs text-gray-400 font-bold mb-1">المكان</p>
                  <p className="text-sm font-bold text-[#002147]">{activity.location}</p>
                </div>
              </div>
            </div>

            <div className="w-72 space-y-6">
              <div className="bg-[#002147] p-6 rounded-3xl text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold">المشتركون</h4>
                  <Users size={20} className="text-[#F2C94C]" />
                </div>
                <div className="text-3xl font-bold mb-1">{activity.registeredCount}</div>
                <p className="text-xs text-white/60 mb-4">من أصل {activity.maxParticipants === 'unlimited' ? 'مساحة غير محدودة' : activity.maxParticipants} مشارك</p>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#F2C94C]" 
                    style={{ width: `${(activity.registeredCount / (typeof activity.maxParticipants === 'number' ? activity.maxParticipants : 100)) * 100}%` }} 
                  />
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-gray-50 font-bold text-sm text-[#002147]">قائمة المسجلين</div>
                <div className="max-h-48 overflow-y-auto">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-all border-b border-gray-50 last:border-0">
                      <ImageWithFallback src={`https://i.pravatar.cc/100?u=user-${i}`} className="w-8 h-8 rounded-full" alt="user" />
                      <div>
                        <p className="text-xs font-bold text-[#002147]">طالب اسم {i}</p>
                        <p className="text-[10px] text-gray-400">غرفة A-10{i}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full py-3 text-xs font-bold text-[#F2C94C] bg-gray-50 hover:bg-gray-100 transition-all">تصدير القائمة (Excel)</button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
