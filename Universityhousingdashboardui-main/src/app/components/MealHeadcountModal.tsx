import { useState, useMemo } from 'react';
import { X, Search, Download, Printer, UtensilsCrossed, Users, UserX } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type Student = {
  id: string;
  name: string;
  studentId: string;
  status: boolean | null;
  roomNumber: string;
  floor: number;
  college: string;
  mealType: 'Regular' | 'Special';
};

type MealHeadcountModalProps = {
  isOpen: boolean;
  onClose: () => void;
  allStudentsData: Student[];
};

const COLORS = ['#002147', '#F2C94C', '#10B981', '#3B82F6', '#8B5CF6', '#EF4444'];

const colleges = [
  'كلية الهندسة',
  'كلية الطب',
  'كلية العلوم',
  'كلية الآداب',
  'كلية إدارة الأعمال',
  'كلية الحاسبات',
];

export function MealHeadcountModal({
  isOpen,
  onClose,
  allStudentsData,
}: MealHeadcountModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate statistics
  const stats = useMemo(() => {
    const totalPresent = allStudentsData.filter((s) => s.status === true).length;
    const totalAbsent = allStudentsData.filter((s) => s.status === false).length;
    const totalUnchecked = allStudentsData.filter((s) => s.status === null).length;
    
    // Eligible for meals = Present students
    const eligibleStudents = allStudentsData.filter((s) => s.status === true);
    const eligibleCount = eligibleStudents.length;
    
    // Count by floor
    const byFloor: Record<number, number> = {};
    eligibleStudents.forEach((student) => {
      byFloor[student.floor] = (byFloor[student.floor] || 0) + 1;
    });
    
    // Count by college
    const byCollege: Record<string, number> = {};
    eligibleStudents.forEach((student) => {
      byCollege[student.college] = (byCollege[student.college] || 0) + 1;
    });
    
    // Count meal types
    const regularMeals = eligibleStudents.filter((s) => s.mealType === 'Regular').length;
    const specialMeals = eligibleStudents.filter((s) => s.mealType === 'Special').length;
    
    return {
      totalPresent,
      totalAbsent,
      totalUnchecked,
      eligibleCount,
      regularMeals,
      specialMeals,
      eligibleStudents,
      byFloor,
      byCollege,
    };
  }, [allStudentsData]);

  // Prepare chart data
  const floorChartData = useMemo(() => {
    return Object.entries(stats.byFloor).map(([floor, count]) => ({
      name: `الطابق ${floor}`,
      value: count,
    }));
  }, [stats.byFloor]);

  const collegeChartData = useMemo(() => {
    return Object.entries(stats.byCollege)
      .map(([college, count]) => ({
        name: college,
        count: count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [stats.byCollege]);

  // Filter students based on search
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return stats.eligibleStudents;
    
    const query = searchQuery.toLowerCase().trim();
    return stats.eligibleStudents.filter(
      (student) =>
        student.name.toLowerCase().includes(query) ||
        student.studentId.includes(query) ||
        student.roomNumber.includes(query) ||
        student.college.toLowerCase().includes(query)
    );
  }, [stats.eligibleStudents, searchQuery]);

  const handleExportToKitchen = () => {
    // Generate CSV data
    const csvContent = [
      ['الاسم', 'رقم الغرفة', 'الكلية', 'نوع الوجبة'],
      ...stats.eligibleStudents.map((s) => [
        s.name,
        s.roomNumber,
        s.college,
        s.mealType === 'Regular' ? 'عادية' : 'خاصة',
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `meal-headcount-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    const content = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>إيصال عدد الوجبات</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; direction: rtl; }
          h1 { color: #002147; text-align: center; }
          .summary { display: flex; justify-content: space-around; margin: 20px 0; }
          .summary-card { text-align: center; padding: 15px; border: 2px solid #ddd; border-radius: 8px; }
          .number { font-size: 32px; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
          th { background-color: #002147; color: white; }
          .footer { margin-top: 30px; text-align: center; color: #666; }
        </style>
      </head>
      <body>
        <h1>إيصال عدد الوجبات</h1>
        <p style="text-align: center;">التاريخ: ${new Date().toLocaleDateString('ar-EG')}</p>
        
        <div class="summary">
          <div class="summary-card">
            <div class="number" style="color: #10B981;">${stats.totalPresent}</div>
            <div>إجمالي الحاضرين</div>
          </div>
          <div class="summary-card">
            <div class="number" style="color: #F97316;">${stats.eligibleCount}</div>
            <div>مستحقين للوجبات</div>
          </div>
          <div class="summary-card">
            <div class="number" style="color: #6B7280;">${stats.totalAbsent + stats.totalUnchecked}</div>
            <div>غائبين</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>الاسم</th>
              <th>رقم الغرفة</th>
              <th>الكلية</th>
              <th>نوع الوجبة</th>
            </tr>
          </thead>
          <tbody>
            ${stats.eligibleStudents
              .map(
                (s, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${s.name}</td>
                <td>${s.roomNumber}</td>
                <td>${s.college}</td>
                <td>${s.mealType === 'Regular' ? 'عادية' : 'خاصة'}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>نظام إدارة السكن الجامعي</p>
          <p>طُبع في: ${new Date().toLocaleString('ar-EG')}</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#002147] to-[#003366] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#F2C94C] rounded-xl flex items-center justify-center">
              <UtensilsCrossed size={24} className="text-[#002147]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">إحصائيات وعدد الوجبات</h2>
              <p className="text-sm opacity-90">
                تقرير شامل لعدد الطلاب المستحقين للوجبات
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 1. Summary Header - Big Numbers */}
          <div className="grid grid-cols-3 gap-6">
            {/* Total Present */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-500 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <Users size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-green-800">
                  إجمالي الحاضرين
                </h3>
              </div>
              <p className="text-5xl font-bold text-green-600 mb-2">
                {stats.totalPresent}
              </p>
              <p className="text-sm text-green-700">
                طالب حاضر في السكن
              </p>
            </div>

            {/* Eligible for Meals - HIGHLIGHTED */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border-4 border-orange-500 shadow-xl transform scale-105">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center animate-pulse">
                  <UtensilsCrossed size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-orange-800">
                  مستحقين للوجبات ⭐
                </h3>
              </div>
              <p className="text-6xl font-bold text-orange-600 mb-2">
                {stats.eligibleCount}
              </p>
              <p className="text-sm text-orange-700 font-medium">
                وجبة مطلوبة للمطبخ
              </p>
              <div className="mt-3 pt-3 border-t border-orange-300 flex items-center justify-between text-xs">
                <span className="text-orange-700">
                  عادية: {stats.regularMeals}
                </span>
                <span className="text-orange-700">
                  خاصة: {stats.specialMeals}
                </span>
              </div>
            </div>

            {/* Absent/Not Eating */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-400 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gray-400 rounded-lg flex items-center justify-center">
                  <UserX size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-700">
                  غائبين / لا يأكلون
                </h3>
              </div>
              <p className="text-5xl font-bold text-gray-600 mb-2">
                {stats.totalAbsent + stats.totalUnchecked}
              </p>
              <p className="text-sm text-gray-600">
                طالب غير مستحق للوجبة
              </p>
            </div>
          </div>

          {/* 2. Analytics Section - Charts */}
          <div className="grid grid-cols-2 gap-6">
            {/* Pie Chart - By Floor */}
            <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 p-6">
              <h3 className="text-xl font-bold text-[#002147] mb-4 flex items-center gap-2">
                <div className="w-2 h-8 bg-[#F2C94C] rounded"></div>
                توزيع الوجبات حسب الطابق
              </h3>
              {floorChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={floorChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {floorChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-400">
                  لا توجد بيانات لعرضها
                </div>
              )}
            </div>

            {/* Bar Chart - By College */}
            <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 p-6">
              <h3 className="text-xl font-bold text-[#002147] mb-4 flex items-center gap-2">
                <div className="w-2 h-8 bg-[#F2C94C] rounded"></div>
                توزيع الوجبات حسب الكلية
              </h3>
              {collegeChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={collegeChartData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={120} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#F2C94C" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-400">
                  لا توجد بيانات لعرضها
                </div>
              )}
            </div>
          </div>

          {/* 3. Detailed Student List */}
          <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#002147] flex items-center gap-2">
                <div className="w-2 h-8 bg-[#F2C94C] rounded"></div>
                قائمة الطلاب المستحقين للوجبات
              </h3>
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                {filteredStudents.length} من {stats.eligibleCount} طالب
              </span>
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
              <Search
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالاسم، رقم الطالب، رقم الغرفة، أو الكلية..."
                className="w-full pr-10 pl-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#F2C94C] text-right"
              />
            </div>

            {/* Table */}
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto border-2 border-gray-200 rounded-lg">
              <table className="w-full">
                <thead className="bg-[#002147] text-white sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-right text-sm font-bold">#</th>
                    <th className="px-4 py-3 text-right text-sm font-bold">
                      اسم الطالب
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-bold">
                      رقم الغرفة
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-bold">
                      الكلية
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-bold">
                      نوع الوجبة
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student, index) => (
                      <tr
                        key={student.id}
                        className={`border-b ${
                          index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                        } hover:bg-[#F2C94C]/10 transition-colors`}
                      >
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-[#002147]">
                              {student.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {student.studentId}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-700">
                          {student.roomNumber}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {student.college}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              student.mealType === 'Regular'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-purple-100 text-purple-700'
                            }`}
                          >
                            {student.mealType === 'Regular' ? 'عادية' : 'خاصة'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-8 text-center text-gray-400"
                      >
                        {searchQuery
                          ? 'لا توجد نتائج للبحث'
                          : 'لا يوجد طلاب مستحقين للوجبات'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 p-6 border-t-2 border-gray-200 flex items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            <p className="font-medium">
              تم إنشاء التقرير في:{' '}
              {new Date().toLocaleString('ar-EG', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Printer size={20} />
              طباعة الإيصال
            </button>
            <button
              onClick={handleExportToKitchen}
              className="px-6 py-3 bg-gradient-to-r from-[#F2C94C] to-[#F4D679] text-[#002147] rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2 shadow-md"
            >
              <Download size={20} />
              تصدير للمطبخ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
