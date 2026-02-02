import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface IssuePenaltyModalProps {
  studentName: string;
  onClose: () => void;
}

const penaltyTypes = [
  'تأخير في تسليم المفتاح',
  'إزعاج',
  'عدم الالتزام بقواعد النظافة',
  'التدخين داخل الغرفة',
  'عدم احترام مواعيد الحضور',
  'إتلاف ممتلكات',
  'أخرى',
];

const severityLevels = [
  { id: 'low', label: 'منخفضة', color: 'bg-yellow-500' },
  { id: 'medium', label: 'متوسطة', color: 'bg-orange-500' },
  { id: 'high', label: 'عالية', color: 'bg-red-500' },
];

export function IssuePenaltyModal({ studentName, onClose }: IssuePenaltyModalProps) {
  const [penaltyType, setPenaltyType] = useState('');
  const [customType, setCustomType] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSubmit = () => {
    if (!penaltyType || (penaltyType === 'أخرى' && !customType) || !description) {
      alert('الرجاء إكمال جميع الحقول المطلوبة');
      return;
    }

    alert('تم إصدار الجزاء بنجاح');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle size={32} />
              <div>
                <h2 className="text-xl font-bold">إصدار جزاء</h2>
                <p className="text-sm opacity-90">{studentName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Warning Notice */}
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="text-sm text-red-800">
              <p className="font-bold mb-1">تنبيه:</p>
              <p>إصدار الجزاء هو إجراء رسمي سيتم تسجيله في ملف الطالب. يرجى التأكد من صحة المعلومات قبل الإرسال.</p>
            </div>
          </div>

          {/* Penalty Type */}
          <div>
            <label className="block text-sm font-bold text-[#002147] mb-2">
              نوع المخالفة <span className="text-red-500">*</span>
            </label>
            <select
              value={penaltyType}
              onChange={(e) => setPenaltyType(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
            >
              <option value="">اختر نوع المخالفة</option>
              {penaltyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Type Input */}
          {penaltyType === 'أخرى' && (
            <div>
              <label className="block text-sm font-bold text-[#002147] mb-2">
                حدد نوع المخالفة <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                placeholder="اكتب نوع المخالفة..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
          )}

          {/* Severity Level */}
          <div>
            <label className="block text-sm font-bold text-[#002147] mb-3">
              درجة الخطورة <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {severityLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setSeverity(level.id as 'low' | 'medium' | 'high')}
                  className={`p-4 rounded-lg border-2 transition-all text-white font-medium ${
                    severity === level.id
                      ? `${level.color} border-current shadow-lg`
                      : 'bg-gray-200 border-gray-300 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-[#002147] mb-2">
              وصف المخالفة <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب تفاصيل المخالفة وملابساتها..."
              rows={5}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-500 transition-colors resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              الحد الأدنى: 20 حرف (الحالي: {description.length})
            </p>
          </div>

          {/* Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#002147] mb-2">
                تاريخ المخالفة
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#002147] mb-2">
                الوقت التقريبي
              </label>
              <input
                type="time"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 border-t flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            disabled={!penaltyType || (penaltyType === 'أخرى' && !customType) || description.length < 20}
            className="px-8 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors shadow-md"
          >
            إصدار الجزاء
          </button>
        </div>
      </div>
    </div>
  );
}
