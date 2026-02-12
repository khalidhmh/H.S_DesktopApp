import { useState, useRef } from 'react'
import {
  Printer,
  Save,
  BarChart3,
  Users,
  CheckCircle,
  X,
  AlertCircle,
  FileText,
  Download,
  ChefHat
} from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts'

interface AttendancePageProps {
  userRole?: string
}

export default function AttendancePage({ userRole }: AttendancePageProps) {
  const role = userRole ? userRole.toUpperCase() : ''
  const isManager = role.startsWith('MANAGER') || role.startsWith('ADMIN')

  // --- States ---
  const [selectedFloor, setSelectedFloor] = useState(1)
  const [selectedWing, setSelectedWing] = useState('A')
  const [showReportModal, setShowReportModal] = useState(false)

  const reportRef = useRef<HTMLDivElement>(null)

  // --- طباعة التقرير فقط ---
  const handlePrint = () => {
    if (reportRef.current) {
      const printContent = reportRef.current.innerHTML
      const originalContent = document.body.innerHTML
      document.body.innerHTML = `<div style="direction: rtl; font-family: 'Cairo', sans-serif;">${printContent}</div>`
      window.print()
      document.body.innerHTML = originalContent
      window.location.reload()
    }
  }

  // --- ألوان الأجنحة (استعدنا التصميم الأصلي) ---
  const wingColors = {
    A: {
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      text: 'text-blue-700',
      headerBg: 'bg-blue-100',
      badge: 'bg-blue-200 text-blue-800'
    },
    B: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-100',
      text: 'text-yellow-700',
      headerBg: 'bg-yellow-100',
      badge: 'bg-yellow-200 text-yellow-800'
    },
    C: {
      bg: 'bg-green-50',
      border: 'border-green-100',
      text: 'text-green-700',
      headerBg: 'bg-green-100',
      badge: 'bg-green-200 text-green-800'
    },
    D: {
      bg: 'bg-purple-50',
      border: 'border-purple-100',
      text: 'text-purple-700',
      headerBg: 'bg-purple-100',
      badge: 'bg-purple-200 text-purple-800'
    }
  }
  const currentColors = wingColors[selectedWing as keyof typeof wingColors]

  // --- توليد الغرف ---
  const generateRooms = (floor: number, wing: string) => {
    let start, end
    switch (wing) {
      case 'A':
        start = 1
        end = 6
        break
      case 'B':
        start = 8
        end = 12
        break
      case 'C':
        start = 14
        end = 19
        break
      case 'D':
        start = 21
        end = 25
        break
      default:
        start = 1
        end = 6
    }
    const roomsList = []
    for (let i = start; i <= end; i++) {
      const roomNum = `${floor}${i.toString().padStart(2, '0')}`
      const capacity = i % 5 === 0 ? 2 : 3
      const students = Array.from({ length: capacity }).map((_, idx) => ({
        id: `${roomNum}-${idx}`,
        name: `طالب ${idx + 1}`,
        faculty: idx % 2 === 0 ? 'كلية الطب' : 'كلية الهندسة',
        status: idx < 2 ? 'present' : 'absent',
        mealType: 'عادية'
      }))
      roomsList.push({ number: roomNum, capacity, students })
    }
    return roomsList
  }
  const rooms = generateRooms(selectedFloor, selectedWing)

  // --- إحصائيات التقرير ---
  const totalStudents = rooms.reduce((acc, r) => acc + r.students.length, 0)
  const presentCount = rooms.reduce(
    (acc, r) => acc + r.students.filter((s) => s.status === 'present').length,
    0
  )
  const absentCount = totalStudents - presentCount
  const eligibleForMeals = presentCount

  const mealsByFloorData = [
    { name: 'الطابق 1', value: 65, fill: '#10b981' },
    { name: 'الطابق 2', value: 45, fill: '#f59e0b' },
    { name: 'الطابق 3', value: 55, fill: '#3b82f6' },
    { name: 'الطابق 4', value: 30, fill: '#ef4444' }
  ]
  const mealsByCollegeData = [
    { name: 'طب', value: 120 },
    { name: 'هندسة', value: 98 },
    { name: 'حاسبات', value: 86 },
    { name: 'علوم', value: 54 }
  ]

  return (
    <div className="p-6 space-y-6 animate-fade-in pb-20 relative">
      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            {isManager ? (
              <AlertCircle className="text-secondary" />
            ) : (
              <CheckCircle className="text-secondary" />
            )}
            {isManager ? 'مراقبة التمام اليومي' : 'تسجيل الحضور والانصراف'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isManager ? 'لوحة متابعة لحظية لحالة السكن' : 'يرجى تحري الدقة في تسجيل حالة الطلاب'}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-secondary text-primary rounded-xl font-bold hover:bg-yellow-400 shadow-md shadow-yellow-100 transition-all active:scale-95"
          >
            <FileText size={18} />
            {isManager ? 'عرض التقارير' : 'إنشاء تقرير الوجبات'}
          </button>
        </div>
      </div>

      {/* --- Filters (Floor/Wing) --- */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-6 items-center">
        <div className="flex items-center gap-3">
          <span className="font-bold text-primary">الدور:</span>
          <div className="flex bg-gray-100 p-1.5 rounded-xl">
            {[1, 2, 3, 4, 5, 6].map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFloor(f)}
                className={`w-10 h-10 rounded-lg font-bold transition-all ${selectedFloor === f ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-bold text-primary">الجناح:</span>
          <div className="flex gap-2 bg-gray-100 p-1.5 rounded-xl">
            {[
              { id: 'A', label: 'أ - الشمالي' },
              { id: 'B', label: 'ب - الغربي' },
              { id: 'C', label: 'ج - الجنوبي' },
              { id: 'D', label: 'د - الشرقي' }
            ].map((w) => {
              const isActive = selectedWing === w.id
              const colors = wingColors[w.id as keyof typeof wingColors]
              return (
                <button
                  key={w.id}
                  onClick={() => setSelectedWing(w.id)}
                  className={`px-4 py-2 rounded-lg font-bold transition-all border-2 ${isActive ? `${colors.bg} ${colors.border} ${colors.text} shadow-sm` : 'border-transparent text-gray-500 hover:bg-gray-200'}`}
                >
                  {w.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* --- ROOMS GRID (بالشكل القديم الملون) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {rooms.map((room) => (
          <div
            key={room.number}
            className={`bg-white rounded-3xl border ${currentColors.border} overflow-hidden shadow-sm hover:shadow-md transition-all group`}
          >
            {/* Room Header with Wing Color */}
            <div
              className={`p-4 flex justify-between items-center ${currentColors.headerBg} border-b ${currentColors.border}`}
            >
              <h3 className={`font-bold text-xl ${currentColors.text}`}>غرفة {room.number}</h3>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-bold bg-white/50 border border-white/20 ${currentColors.text}`}
              >
                {room.capacity === 3 ? '3 أفراد' : '2 أفراد'}
              </span>
            </div>

            {/* Students List */}
            <div className="p-5 space-y-4">
              {room.students.map((student, idx) => (
                <div
                  key={student.id}
                  className={`flex items-center justify-between p-2 rounded-xl transition-colors ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ring-2 ring-white shadow-sm ${student.status === 'present' ? 'bg-emerald-500' : 'bg-red-500'}`}
                    ></div>
                    <span className="font-bold text-gray-800">{student.name}</span>
                  </div>

                  {!isManager ? (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked={student.status === 'present'}
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer transition-all peer-checked:bg-emerald-500"></div>
                      <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-4 shadow-sm"></div>
                    </label>
                  ) : (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${student.status === 'present' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}
                    >
                      {student.status === 'present' ? 'حاضر' : 'غائب'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ================= REPORT MODAL ================= */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in-95">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
            <div className="bg-primary p-6 text-white flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <ChefHat className="text-secondary" size={32} /> إحصائيات وعدد الوجبات
                </h2>
                <p className="text-white/60 text-sm mt-1">
                  تقرير شامل لعدد الطلاب المستحقين للوجبات اليوم
                </p>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-8 bg-gray-50" ref={reportRef}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center justify-center text-center py-8">
                  <div className="flex items-center gap-2 text-gray-500 mb-2 font-bold">
                    <Users size={20} /> غائبين / لا يأكلون
                  </div>
                  <h3 className="text-5xl font-bold text-primary mb-2">{absentCount}</h3>
                  <p className="text-sm text-gray-400">طالب غير مستحق للوجبة</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-orange-200 flex flex-col items-center justify-center text-center py-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-orange-400"></div>
                  <div className="flex items-center gap-2 text-orange-500 mb-2 font-bold">
                    <Utensils size={20} /> مستحقين للوجبات
                  </div>
                  <h3 className="text-6xl font-bold text-orange-500 mb-2">{eligibleForMeals}</h3>
                  <p className="text-sm text-gray-400 mb-4">وجبة مطلوبة للمطبخ</p>
                  <div className="flex gap-4 text-xs font-bold w-full justify-center border-t border-gray-100 pt-3">
                    <span className="text-orange-600">عادية: {eligibleForMeals - 50}</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-red-500">صايم: 50</span>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 flex flex-col items-center justify-center text-center py-8 bg-emerald-50/30">
                  <div className="flex items-center gap-2 text-emerald-600 mb-2 font-bold">
                    <Users size={20} /> إجمالي الحاضرين
                  </div>
                  <h3 className="text-5xl font-bold text-emerald-500 mb-2">{presentCount}</h3>
                  <p className="text-sm text-gray-400">طالب حاضر في السكن</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <h3 className="font-bold text-primary mb-4 border-r-4 border-secondary pr-3">
                    توزيع الوجبات حسب الكلية
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mealsByCollegeData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" hide />
                        <YAxis
                          dataKey="name"
                          type="category"
                          width={80}
                          tick={{ fontSize: 12, fontWeight: 'bold' }}
                        />
                        <Tooltip cursor={{ fill: 'transparent' }} />
                        <Bar dataKey="value" fill="#F2C94C" radius={[0, 4, 4, 0]} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <h3 className="font-bold text-primary mb-4 border-r-4 border-secondary pr-3">
                    توزيع الوجبات حسب الطابق
                  </h3>
                  <div className="h-64 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={mealsByFloorData}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {mealsByFloorData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} strokeWidth={0} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h3 className="font-bold text-primary border-r-4 border-secondary pr-3">
                    قائمة الطلاب المستحقين للوجبات
                  </h3>
                  <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-lg border border-gray-200">
                    {eligibleForMeals} من {totalStudents} طالب
                  </div>
                </div>
                <table className="w-full text-right">
                  <thead className="bg-primary text-white text-sm">
                    <tr>
                      <th className="p-4 font-bold">#</th>
                      <th className="p-4 font-bold">اسم الطالب</th>
                      <th className="p-4 font-bold">رقم الغرفة</th>
                      <th className="p-4 font-bold">الكلية</th>
                      <th className="p-4 font-bold">نوع الوجبة</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {rooms
                      .flatMap((r) => r.students)
                      .filter((s) => s.status === 'present')
                      .slice(0, 5)
                      .map((student, idx) => (
                        <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="p-4 text-gray-400 font-bold">{idx + 1}</td>
                          <td className="p-4 font-bold text-primary">
                            {student.name}
                            <div className="text-xs text-gray-400 font-normal mt-0.5">
                              {student.id}
                            </div>
                          </td>
                          <td className="p-4 font-medium">{student.id.split('-')[0]}</td>
                          <td className="p-4 text-gray-600">{student.faculty}</td>
                          <td className="p-4">
                            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
                              {student.mealType}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white p-4 border-t border-gray-100 flex justify-between items-center shrink-0">
              <div className="text-xs text-gray-400 font-medium">
                تم إنشاء التقرير في: {new Date().toLocaleString('ar-EG')}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  <Printer size={18} /> طباعة الإيصال
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-secondary text-primary rounded-xl font-bold hover:bg-yellow-400 shadow-lg shadow-yellow-100 transition-all">
                  <Download size={18} /> تصدير للمطبخ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const Utensils = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
    <path d="M7 2v20" />
    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
  </svg>
)
