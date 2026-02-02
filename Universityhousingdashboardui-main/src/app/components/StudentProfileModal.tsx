import { useState } from 'react';
import { X, User, Users, Calendar, AlertTriangle, Trophy, Key, CreditCard, CheckSquare, Trash2, RotateCcw } from 'lucide-react';
import { Student } from '@/app/components/StudentManagementPage';
import { SecurityChallengeModal } from '@/app/components/SecurityChallengeModal';
import { EvacuationChecklistModal } from '@/app/components/EvacuationChecklistModal';
import { IssuePenaltyModal } from '@/app/components/IssuePenaltyModal';

interface StudentProfileModalProps {
  student: Student;
  onClose: () => void;
}

type Tab = 'personal' | 'guardian' | 'attendance' | 'penalties' | 'activities';

// Mock attendance data
const mockAttendanceData = [
  { date: '2025-01-29', status: 'present' },
  { date: '2025-01-28', status: 'present' },
  { date: '2025-01-27', status: 'absent' },
  { date: '2025-01-26', status: 'present' },
  { date: '2025-01-25', status: 'present' },
  { date: '2025-01-24', status: 'present' },
  { date: '2025-01-23', status: 'absent' },
  { date: '2025-01-22', status: 'present' },
];

// Mock penalties data
const mockPenalties = [
  {
    id: '1',
    date: '2025-01-20',
    type: 'تأخير في تسليم المفتاح',
    description: 'عدم تسليم المفتاح في الموعد المحدد',
    issuedBy: 'أحمد محمد - مشرف',
    status: 'active',
  },
  {
    id: '2',
    date: '2025-01-15',
    type: 'إزعاج',
    description: 'صوت عالٍ بعد الساعة 11 مساءً',
    issuedBy: 'خالد علي - مشرف',
    status: 'resolved',
  },
];

// Mock activities data
const mockActivities = [
  {
    id: '1',
    name: 'بطولة كرة القدم',
    date: '2025-01-15',
    type: 'رياضي',
    status: 'participated',
  },
  {
    id: '2',
    name: 'ندوة ثقافية',
    date: '2025-01-10',
    type: 'ثقافي',
    status: 'participated',
  },
  {
    id: '3',
    name: 'يوم تطوعي',
    date: '2025-01-05',
    type: 'اجتماعي',
    status: 'participated',
  },
];

export function StudentProfileModal({ student, onClose }: StudentProfileModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('personal');
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showEvacuationModal, setShowEvacuationModal] = useState(false);
  const [showPenaltyModal, setShowPenaltyModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const statusConfig = {
    credit: { label: 'انتظام', color: 'bg-blue-500' },
    regular: { label: 'عادي', color: 'bg-green-500' },
    expat: { label: 'وافد', color: 'bg-purple-500' },
  };

  const tabs = [
    { id: 'personal' as Tab, label: 'المعلومات الشخصية', icon: <User size={18} /> },
    { id: 'guardian' as Tab, label: 'معلومات ولي الأمر', icon: <Users size={18} /> },
    { id: 'attendance' as Tab, label: 'سجل الحضور', icon: <Calendar size={18} /> },
    { id: 'penalties' as Tab, label: 'الجزاءات', icon: <AlertTriangle size={18} /> },
    { id: 'activities' as Tab, label: 'الأنشطة', icon: <Trophy size={18} /> },
  ];

  const handleDelete = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#002147] to-[#003366] text-white p-6">
            <div className="flex items-start justify-between gap-6">
              {/* Photo and Info */}
              <div className="flex items-start gap-6">
                <div className="w-32 h-32 rounded-xl overflow-hidden border-4 border-white/20 shadow-lg flex-shrink-0">
                  <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">{student.name}</h2>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`${statusConfig[student.status].color} text-white text-sm px-3 py-1 rounded-full`}>
                      {statusConfig[student.status].label}
                    </span>
                    {student.hasPenalties && (
                      <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                        لديه جزاءات
                      </span>
                    )}
                    {student.exceededAbsence && (
                      <span className="bg-orange-500 text-white text-sm px-3 py-1 rounded-full">
                        تجاوز الغياب
                      </span>
                    )}
                  </div>
                  <div className="text-sm space-y-1 opacity-90">
                    <p>{student.college} - المستوى {student.year}</p>
                    <p>الغرفة: {student.roomNumber} - الطابق {student.floor}</p>
                    <p>الرقم القومي: {student.nationalId}</p>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b bg-gray-50">
            <div className="flex items-center gap-2 px-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium transition-all border-b-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-[#002147] border-[#F2C94C]'
                      : 'text-gray-600 border-transparent hover:text-gray-900'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'personal' && <PersonalInfoTab student={student} />}
            {activeTab === 'guardian' && <GuardianInfoTab student={student} />}
            {activeTab === 'attendance' && <AttendanceTab />}
            {activeTab === 'penalties' && <PenaltiesTab />}
            {activeTab === 'activities' && <ActivitiesTab />}
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 px-6 py-4 border-t flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPenaltyModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-md flex items-center gap-2"
              >
                <AlertTriangle size={18} />
                <span>إصدار جزاء</span>
              </button>
              <button
                onClick={() => setShowEvacuationModal(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-md flex items-center gap-2"
              >
                <CheckSquare size={18} />
                <span>قائمة الإخلاء</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSecurityModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-md flex items-center gap-2"
              >
                <RotateCcw size={18} />
                <span>إعادة تعيين كلمة المرور</span>
              </button>
              <button
                onClick={handleDelete}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Trash2 size={18} />
                <span>حذف</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showSecurityModal && (
        <SecurityChallengeModal
          studentNationalId={student.nationalId}
          onClose={() => setShowSecurityModal(false)}
        />
      )}

      {showEvacuationModal && (
        <EvacuationChecklistModal
          studentName={student.name}
          onClose={() => setShowEvacuationModal(false)}
        />
      )}

      {showPenaltyModal && (
        <IssuePenaltyModal
          studentName={student.name}
          onClose={() => setShowPenaltyModal(false)}
        />
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-4 rounded-xl shadow-2xl z-[60] flex items-center gap-3 animate-slide-down">
          <CheckSquare size={20} />
          <span className="font-medium">تم إرسال طلب الحذف إلى مدير المبنى للموافقة</span>
        </div>
      )}
    </>
  );
}

function PersonalInfoTab({ student }: { student: Student }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <InfoField label="الاسم الكامل" value={student.name} />
        <InfoField label="الرقم القومي" value={student.nationalId} />
        <InfoField label="رقم الهاتف" value={student.phone} />
        <InfoField label="البريد الإلكتروني" value={student.email} />
        <InfoField label="الكلية" value={student.college} />
        <InfoField label="السنة الدراسية" value={`المستوى ${student.year}`} />
        <InfoField label="رقم الغرفة" value={student.roomNumber} />
        <InfoField label="الطابق" value={`الطابق ${student.floor}`} />
        <InfoField label="المحافظة" value={student.governorate} />
        <InfoField label="حالة الطالب" value={student.status === 'credit' ? 'انتظام' : student.status === 'regular' ? 'عادي' : 'وافد'} />
      </div>

      <div className="grid grid-cols-2 gap-6 pt-6 border-t">
        <StatCard label="عدد مرات الغياب" value={student.absenceCount} color="orange" />
        <StatCard label="عدد الجزاءات" value={student.penaltyCount} color="red" />
      </div>
    </div>
  );
}

function GuardianInfoTab({ student }: { student: Student }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <InfoField label="اسم ولي الأمر" value={student.guardianName} />
        <InfoField label="صلة القرابة" value={student.guardianRelation} />
        <InfoField label="رقم الهاتف" value={student.guardianPhone} />
        <InfoField label="عنوان ولي الأمر" value={student.governorate} />
      </div>

      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mt-6">
        <p className="text-sm text-blue-800">
          <span className="font-bold">ملاحظة:</span> يتم التواصل مع ولي الأمر في حالة الطوارئ أو عند الحاجة لإبلاغه بأي مستجدات
        </p>
      </div>
    </div>
  );
}

function AttendanceTab() {
  const getCurrentMonthDays = () => {
    const days = [];
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const attendanceRecord = mockAttendanceData.find((a) => a.date === dateStr);
      
      days.push({
        day,
        date: dateStr,
        status: attendanceRecord?.status || 'pending',
        isToday: day === today.getDate(),
        isFuture: day > today.getDate(),
      });
    }

    return days;
  };

  const days = getCurrentMonthDays();
  const weekDays = ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#002147]">سجل الحضور - يناير 2025</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>حاضر</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>غائب</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
            <span>لم يتم التحقق</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-gray-50 rounded-xl p-4">
        {/* Week days header */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center font-bold text-gray-600 text-sm py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((dayInfo) => {
            const bgColor =
              dayInfo.status === 'present'
                ? 'bg-green-500 text-white'
                : dayInfo.status === 'absent'
                ? 'bg-red-500 text-white'
                : dayInfo.isFuture
                ? 'bg-gray-100 text-gray-400'
                : 'bg-gray-300 text-gray-700';

            return (
              <div
                key={dayInfo.day}
                className={`aspect-square rounded-lg flex items-center justify-center font-medium text-sm ${bgColor} ${
                  dayInfo.isToday ? 'ring-2 ring-[#F2C94C] ring-offset-2' : ''
                }`}
              >
                {dayInfo.day}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="إجمالي الحضور" value={26} color="green" />
        <StatCard label="إجمالي الغياب" value={3} color="red" />
        <StatCard label="نسبة الحضور" value="89%" color="blue" />
      </div>
    </div>
  );
}

function PenaltiesTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-[#002147]">سجل الجزاءات</h3>
      </div>

      {mockPenalties.length === 0 ? (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 text-center">
          <Trophy className="mx-auto mb-3 text-green-600" size={48} />
          <p className="text-green-700 font-medium">لا توجد جزاءات - سلوك ممتاز!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {mockPenalties.map((penalty) => (
            <div
              key={penalty.id}
              className={`bg-white border-2 rounded-xl p-4 ${
                penalty.status === 'active' ? 'border-red-200' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold text-[#002147]">{penalty.type}</h4>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        penalty.status === 'active'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {penalty.status === 'active' ? 'نشط' : 'محلول'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{penalty.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>التاريخ: {penalty.date}</span>
                    <span>بواسطة: {penalty.issuedBy}</span>
                  </div>
                </div>
                <AlertTriangle className="text-red-500" size={24} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ActivitiesTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-[#002147]">الأنشطة المشارك بها</h3>
      </div>

      {mockActivities.length === 0 ? (
        <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-8 text-center">
          <p className="text-gray-500">لم يشارك في أي أنشطة بعد</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {mockActivities.map((activity) => (
            <div key={activity.id} className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-[#F2C94C] transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-[#F2C94C] p-3 rounded-lg">
                    <Trophy className="text-[#002147]" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#002147]">{activity.name}</h4>
                    <p className="text-sm text-gray-600">نوع النشاط: {activity.type}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-500">{activity.date}</p>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    شارك
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mt-6">
        <p className="text-sm text-blue-800">
          <span className="font-bold">إجمالي الأنشطة:</span> {mockActivities.length} نشاط
        </p>
      </div>
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-500 mb-1 block">{label}</label>
      <p className="text-[#002147] font-medium bg-gray-50 p-3 rounded-lg">{value}</p>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number | string; color: string }) {
  const colorClasses = {
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
  };

  return (
    <div className={`border-2 rounded-xl p-4 ${colorClasses[color as keyof typeof colorClasses]}`}>
      <p className="text-sm font-medium mb-1">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
