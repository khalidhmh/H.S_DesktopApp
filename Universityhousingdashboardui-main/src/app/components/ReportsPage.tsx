import { useState } from 'react';
import {
  ClipboardCheck,
  UserX,
  AlertTriangle,
  Wrench,
  Package,
  FileText,
  Printer,
  FileSpreadsheet,
  Send,
  ChevronRight,
  Building2,
  GraduationCap,
  User,
  BarChart3,
  TrendingUp,
  Download,
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

type ReportTopic = 'attendance' | 'absence' | 'penalties' | 'maintenance' | 'inventory' | 'statistics' | null;
type FilterType = 'all' | 'floor' | 'college' | 'student';

const reportTypes = [
  { 
    id: 'attendance' as const, 
    label: 'تقرير الحضور', 
    icon: ClipboardCheck, 
    color: '#10B981',
    bgColor: 'bg-green-500',
    description: 'سجلات حضور الطلاب اليومية'
  },
  { 
    id: 'absence' as const, 
    label: 'تقرير الغياب', 
    icon: UserX, 
    color: '#EF4444',
    bgColor: 'bg-red-500',
    description: 'تفاصيل الغياب والتأخيرات'
  },
  { 
    id: 'penalties' as const, 
    label: 'تقرير المخالفات', 
    icon: AlertTriangle, 
    color: '#F59E0B',
    bgColor: 'bg-orange-500',
    description: 'المخالفات والجزاءات المطبقة'
  },
  { 
    id: 'maintenance' as const, 
    label: 'تكاليف الصيانة', 
    icon: Wrench, 
    color: '#8B5CF6',
    bgColor: 'bg-purple-500',
    description: 'تقارير الصيانة والتكاليف'
  },
  { 
    id: 'inventory' as const, 
    label: 'تقرير المخزون', 
    icon: Package, 
    color: '#06B6D4',
    bgColor: 'bg-cyan-500',
    description: 'حالة المخزون والعهدة'
  },
  { 
    id: 'statistics' as const, 
    label: 'الإحصائيات العامة', 
    icon: TrendingUp, 
    color: '#3B82F6',
    bgColor: 'bg-blue-500',
    description: 'تقرير شامل ومؤشرات الأداء'
  },
];

export function ReportsPage() {
  const [selectedTopic, setSelectedTopic] = useState<ReportTopic>(null);
  const [dateFrom, setDateFrom] = useState('2026-01-01');
  const [dateTo, setDateTo] = useState('2026-01-31');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterValue, setFilterValue] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerateReport = () => {
    if (!selectedTopic) {
      toast.error('يرجى اختيار نوع التقرير');
      return;
    }
    setShowPreview(true);
    toast.success('جاري إنشاء التقرير...', {
      description: 'سيتم عرض التقرير في لحظات',
    });
  };

  const handlePrint = () => {
    window.print();
    toast.success('جاري طباعة التقرير...');
  };

  const handleExportExcel = () => {
    toast.success('تم تصدير التقرير إلى Excel بنجاح');
  };

  const handleExportPDF = () => {
    toast.success('تم تصدير التقرير إلى PDF بنجاح');
  };

  const handleSendToManager = () => {
    toast.success('تم إرسال التقرير بنجاح إلى لوحة تحكم المدير', {
      description: 'سيتم إشعار المدير بالتقرير الجديد',
      duration: 4000,
    });
  };

  // Mock data for different report types
  const getMockData = () => {
    switch (selectedTopic) {
      case 'attendance':
        return {
          summary: [
            { name: 'الأسبوع 1', حاضر: 145, غائب: 5 },
            { name: 'الأسبوع 2', حاضر: 148, غائب: 2 },
            { name: 'الأسبوع 3', حاضر: 142, غائب: 8 },
            { name: 'الأسبوع 4', حاضر: 150, غائب: 0 },
          ],
          pieData: [
            { name: 'حضور منتظم', value: 92, color: '#10B981' },
            { name: 'تأخيرات', value: 5, color: '#F59E0B' },
            { name: 'غياب', value: 3, color: '#EF4444' },
          ],
          tableData: [
            { floor: 'الطابق الأول', total: 50, present: 48, absent: 2, rate: '96%' },
            { floor: 'الطابق الثاني', total: 50, present: 47, absent: 3, rate: '94%' },
            { floor: 'الطابق الثالث', total: 50, present: 50, absent: 0, rate: '100%' },
          ],
        };
      case 'absence':
        return {
          summary: [
            { name: 'الأسبوع 1', غياب_بعذر: 3, غياب_بدون_عذر: 2 },
            { name: 'الأسبوع 2', غياب_بعذر: 2, غياب_بدون_عذر: 0 },
            { name: 'الأسبوع 3', غياب_بعذر: 5, غياب_بدون_عذر: 3 },
            { name: 'الأسبوع 4', غياب_بعذر: 0, غياب_بدون_عذر: 0 },
          ],
          pieData: [
            { name: 'غياب بعذر', value: 65, color: '#F59E0B' },
            { name: 'غياب بدون عذر', value: 35, color: '#EF4444' },
          ],
          tableData: [
            { student: 'أحمد محمد', room: '101', days: 3, type: 'بعذر', reason: 'مرض' },
            { student: 'سعيد علي', room: '205', days: 5, type: 'بدون عذر', reason: '-' },
            { student: 'خالد فهد', room: '312', days: 2, type: 'بعذر', reason: 'ظروف عائلية' },
          ],
        };
      case 'penalties':
        return {
          summary: [
            { name: 'شهر 1', عالية: 2, متوسطة: 5, بسيطة: 8 },
            { name: 'شهر 2', عالية: 1, متوسطة: 3, بسيطة: 6 },
            { name: 'شهر 3', عالية: 0, متوسطة: 4, بسيطة: 5 },
          ],
          pieData: [
            { name: 'ضوضاء', value: 35, color: '#F59E0B' },
            { name: 'نظافة', value: 25, color: '#EF4444' },
            { name: 'تأخير', value: 20, color: '#8B5CF6' },
            { name: 'أخرى', value: 20, color: '#6B7280' },
          ],
          tableData: [
            { student: 'محمد سالم', room: '203', type: 'ضوضاء', severity: 'متوسطة', fine: '100 ريال' },
            { student: 'فهد عبدالله', room: '105', type: 'نظافة', severity: 'بسيطة', fine: '50 ريال' },
            { student: 'علي حسن', room: '308', type: 'تأخير', severity: 'عالية', fine: '200 ريال' },
          ],
        };
      case 'maintenance':
        return {
          summary: [
            { name: 'يناير', تكلفة: 5200 },
            { name: 'فبراير', تكلفة: 3800 },
            { name: 'مارس', تكلفة: 4500 },
            { name: 'أبريل', تكلفة: 6100 },
          ],
          pieData: [
            { name: 'كهرباء', value: 40, color: '#F59E0B' },
            { name: 'سباكة', value: 30, color: '#3B82F6' },
            { name: 'نجارة', value: 20, color: '#8B5CF6' },
            { name: 'أخرى', value: 10, color: '#6B7280' },
          ],
          tableData: [
            { category: 'كهرباء', requests: 15, completed: 13, cost: '7,800 ريال', avgTime: '2 يوم' },
            { category: 'سباكة', requests: 12, completed: 11, cost: '5,600 ريال', avgTime: '1 يوم' },
            { category: 'نجارة', requests: 8, completed: 8, cost: '3,900 ريال', avgTime: '3 أيام' },
          ],
        };
      case 'inventory':
        return {
          summary: [
            { name: 'كامل', value: 85 },
            { name: 'ناقص', value: 10 },
            { name: 'تالف', value: 5 },
          ],
          pieData: [
            { name: 'متوفر بالكامل', value: 85, color: '#10B981' },
            { name: 'ناقص', value: 10, color: '#F59E0B' },
            { name: 'تالف', value: 5, color: '#EF4444' },
          ],
          tableData: [
            { item: 'سرير', total: 150, available: 148, damaged: 2, missing: 0 },
            { item: 'خزانة', total: 150, available: 145, damaged: 3, missing: 2 },
            { item: 'مكتب', total: 150, available: 147, damaged: 2, missing: 1 },
            { item: 'كرسي', total: 150, available: 143, damaged: 5, missing: 2 },
          ],
        };
      case 'statistics':
        return {
          summary: [
            { name: 'يناير', نسبة_الحضور: 94, نسبة_الصيانة: 87, نسبة_الرضا: 92 },
            { name: 'فبراير', نسبة_الحضور: 96, نسبة_الصيانة: 91, نسبة_الرضا: 89 },
            { name: 'مارس', نسبة_الحضور: 93, نسبة_الصيانة: 88, نسبة_الرضا: 95 },
            { name: 'أبريل', نسبة_الحضور: 98, نسبة_الصيانة: 93, نسبة_الرضا: 97 },
          ],
          pieData: [
            { name: 'ممتاز', value: 60, color: '#10B981' },
            { name: 'جيد', value: 30, color: '#F59E0B' },
            { name: 'يحتاج تحسين', value: 10, color: '#EF4444' },
          ],
          tableData: [
            { metric: 'معدل الحضور', value: '95.2%', trend: '+2.3%', status: 'ممتاز' },
            { metric: 'رضا السكان', value: '93.5%', trend: '+5.1%', status: 'ممتاز' },
            { metric: 'سرعة الصيانة', value: '89.8%', trend: '+1.2%', status: 'جيد' },
            { metric: 'معدل المخالفات', value: '4.2%', trend: '-1.5%', status: 'ممتاز' },
          ],
        };
      default:
        return null;
    }
  };

  const reportData = getMockData();

  if (showPreview && reportData) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] p-6">
        {/* Preview Toolbar */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 print:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(false)}
                className="flex items-center gap-2 px-4 py-2 text-[#002147] hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight size={20} />
                <span className="font-medium">رجوع</span>
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <h2 className="text-lg font-bold text-[#002147]">معاينة التقرير</h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-[#002147] text-[#002147] rounded-lg hover:bg-[#002147] hover:text-white transition-colors"
              >
                <Printer size={18} />
                <span className="font-medium">طباعة</span>
              </button>
              
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-colors"
              >
                <FileSpreadsheet size={18} />
                <span className="font-medium">Excel</span>
              </button>

              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
              >
                <FileText size={18} />
                <span className="font-medium">PDF</span>
              </button>

              <div className="h-6 w-px bg-gray-300" />

              <button
                onClick={handleSendToManager}
                className="flex items-center gap-2 px-6 py-2 bg-[#F2C94C] text-[#002147] rounded-lg hover:bg-[#F2C94C]/90 transition-colors font-bold shadow-md"
              >
                <Send size={18} />
                <span>إرسال إلى المدير</span>
              </button>
            </div>
          </div>
        </div>

        {/* A4 Preview Container */}
        <div className="bg-white rounded-2xl shadow-lg mx-auto max-w-[210mm] min-h-[297mm] p-12 print:shadow-none print:rounded-none">
          {/* Report Header */}
          <div className="border-b-4 border-[#002147] pb-6 mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-[#002147] mb-2">
                  {reportTypes.find(t => t.id === selectedTopic)?.label}
                </h1>
                <p className="text-gray-600">
                  الفترة: من {dateFrom} إلى {dateTo}
                </p>
                {filterType !== 'all' && (
                  <p className="text-gray-600 mt-1">
                    التصفية: {filterType === 'floor' ? 'الطابق' : filterType === 'college' ? 'الكلية' : 'الطالب'} - {filterValue}
                  </p>
                )}
              </div>
              <div className="text-left">
                <div className="w-20 h-20 bg-[#002147] rounded-lg flex items-center justify-center mb-2">
                  <span className="text-white font-bold text-3xl">ن</span>
                </div>
                <p className="text-sm text-gray-600">نظام الإسكان الجامعي</p>
                <p className="text-xs text-gray-500">تاريخ الإنشاء: {new Date().toLocaleDateString('ar-SA')}</p>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-[#002147] mb-4 flex items-center gap-2">
              <BarChart3 size={24} />
              <span>الإحصائيات</span>
            </h3>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Line/Bar Chart */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <ResponsiveContainer width="100%" height={250}>
                  {selectedTopic === 'attendance' || selectedTopic === 'absence' || selectedTopic === 'penalties' ? (
                    <BarChart data={reportData.summary}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {Object.keys(reportData.summary[0]).filter(key => key !== 'name').map((key, index) => (
                        <Bar key={key} dataKey={key} fill={['#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index]} />
                      ))}
                    </BarChart>
                  ) : (
                    <LineChart data={reportData.summary}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {Object.keys(reportData.summary[0]).filter(key => key !== 'name').map((key, index) => (
                        <Line key={key} type="monotone" dataKey={key} stroke={['#8B5CF6', '#10B981', '#F59E0B'][index]} strokeWidth={2} />
                      ))}
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={reportData.pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {reportData.pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-[#002147] mb-4">البيانات التفصيلية</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#002147] text-white">
                    {Object.keys(reportData.tableData[0]).map((header) => (
                      <th key={header} className="px-4 py-3 text-right font-bold border border-gray-300">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reportData.tableData.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      {Object.values(row).map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-4 py-3 text-right border border-gray-300">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Footer */}
          <div className="border-t-2 border-gray-300 pt-6 mt-8">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">إجمالي السجلات</p>
                <p className="text-2xl font-bold text-green-600">{reportData.tableData.length}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">تاريخ التقرير</p>
                <p className="text-lg font-bold text-blue-600">{new Date().toLocaleDateString('ar-SA')}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">المُعد بواسطة</p>
                <p className="text-lg font-bold text-purple-600">المشرف الرئيسي</p>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>هذا التقرير تم إنشاؤه آليًا من نظام الإسكان الجامعي</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#F2C94C] rounded-lg flex items-center justify-center">
            <FileText className="text-[#002147]" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#002147]">لوحة التقارير</h1>
            <p className="text-gray-600">اختر نوع التقرير وقم بإنشاء تقارير شاملة عن نشاطات السكن</p>
          </div>
        </div>
      </div>

      {/* Report Type Cards Grid - 6 Cards */}
      <div className="grid grid-cols-3 gap-6">
        {reportTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => setSelectedTopic(type.id)}
              className={`bg-white rounded-2xl shadow-sm p-6 transition-all hover:shadow-lg hover:scale-105 border-2 ${
                selectedTopic === type.id
                  ? 'border-[#F2C94C] bg-[#F2C94C]/5'
                  : 'border-transparent hover:border-gray-200'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-16 h-16 ${type.bgColor} rounded-xl flex items-center justify-center shadow-md`}
                >
                  <Icon size={32} className="text-white" />
                </div>
                <div className="flex-1 text-right">
                  <h3 className="text-lg font-bold text-[#002147] mb-1">
                    {type.label}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {type.description}
                  </p>
                </div>
              </div>
              {selectedTopic === type.id && (
                <div className="mt-4 pt-4 border-t border-[#F2C94C]">
                  <div className="flex items-center justify-center gap-2 text-[#F2C94C] font-medium">
                    <div className="w-2 h-2 bg-[#F2C94C] rounded-full animate-pulse"></div>
                    <span className="text-sm">محدد</span>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Report Builder Section */}
      <div className="bg-gradient-to-br from-[#002147] to-[#003366] rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#F2C94C] rounded-lg flex items-center justify-center">
            <BarChart3 className="text-[#002147]" size={20} />
          </div>
          <h2 className="text-2xl font-bold text-white">منشئ التقارير</h2>
        </div>

        <div className="space-y-6">
          {/* Date Range Pickers */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-white font-bold mb-3 flex items-center gap-2">
                <span>من تاريخ</span>
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-4 py-3 border-2 border-white/20 bg-white/10 text-white rounded-xl focus:border-[#F2C94C] focus:outline-none placeholder-white/50"
              />
            </div>
            <div>
              <label className="block text-white font-bold mb-3 flex items-center gap-2">
                <span>إلى تاريخ</span>
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-4 py-3 border-2 border-white/20 bg-white/10 text-white rounded-xl focus:border-[#F2C94C] focus:outline-none placeholder-white/50"
              />
            </div>
          </div>

          {/* Filter Options */}
          <div>
            <label className="block text-white font-bold mb-3">تصفية التقرير (اختياري)</label>
            <div className="grid grid-cols-4 gap-3 mb-4">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  filterType === 'all'
                    ? 'bg-[#F2C94C] text-[#002147]'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <User className="mx-auto mb-1" size={20} />
                <span className="text-sm">الكل</span>
              </button>
              <button
                onClick={() => setFilterType('floor')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  filterType === 'floor'
                    ? 'bg-[#F2C94C] text-[#002147]'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Building2 className="mx-auto mb-1" size={20} />
                <span className="text-sm">حسب الطابق</span>
              </button>
              <button
                onClick={() => setFilterType('college')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  filterType === 'college'
                    ? 'bg-[#F2C94C] text-[#002147]'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <GraduationCap className="mx-auto mb-1" size={20} />
                <span className="text-sm">حسب الكلية</span>
              </button>
              <button
                onClick={() => setFilterType('student')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  filterType === 'student'
                    ? 'bg-[#F2C94C] text-[#002147]'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <User className="mx-auto mb-1" size={20} />
                <span className="text-sm">طالب محدد</span>
              </button>
            </div>

            {filterType !== 'all' && (
              <div>
                {filterType === 'floor' ? (
                  <select
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-white/20 bg-white/10 text-white rounded-xl focus:border-[#F2C94C] focus:outline-none"
                  >
                    <option value="" className="text-gray-900">اختر الطابق</option>
                    <option value="الطابق الأول" className="text-gray-900">الطابق الأول</option>
                    <option value="الطابق الثاني" className="text-gray-900">الطابق الثاني</option>
                    <option value="الطابق الثالث" className="text-gray-900">الطابق الثالث</option>
                    <option value="الطابق الرابع" className="text-gray-900">الطابق الرابع</option>
                    <option value="الطابق الخامس" className="text-gray-900">الطابق الخامس</option>
                    <option value="الطابق السادس" className="text-gray-900">الطابق السادس</option>
                  </select>
                ) : filterType === 'college' ? (
                  <select
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-white/20 bg-white/10 text-white rounded-xl focus:border-[#F2C94C] focus:outline-none"
                  >
                    <option value="" className="text-gray-900">اختر الكلية</option>
                    <option value="كلية الهندسة" className="text-gray-900">كلية الهندسة</option>
                    <option value="كلية الطب" className="text-gray-900">كلية الطب</option>
                    <option value="كلية العلوم" className="text-gray-900">كلية العلوم</option>
                    <option value="كلية الآداب" className="text-gray-900">كلية الآداب</option>
                    <option value="كلية إدارة الأعمال" className="text-gray-900">كلية إدارة الأعمال</option>
                    <option value="كلية الحاسبات" className="text-gray-900">كلية الحاسبات</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    placeholder="ابحث باسم الطالب أو رقمه الجامعي"
                    className="w-full px-4 py-3 border-2 border-white/20 bg-white/10 text-white rounded-xl focus:border-[#F2C94C] focus:outline-none placeholder-white/50"
                  />
                )}
              </div>
            )}
          </div>

          {/* Large Generate PDF Button */}
          <button
            onClick={handleGenerateReport}
            className="w-full py-5 bg-gradient-to-r from-[#F2C94C] to-[#F4D679] text-[#002147] rounded-xl font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-lg"
          >
            <Download size={28} />
            <span>إنشاء التقرير PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
