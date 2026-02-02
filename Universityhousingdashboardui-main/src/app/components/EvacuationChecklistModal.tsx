import { useState } from 'react';
import { X, CheckSquare, AlertCircle } from 'lucide-react';

interface EvacuationChecklistModalProps {
  studentName: string;
  onClose: () => void;
}

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export function EvacuationChecklistModal({ studentName, onClose }: EvacuationChecklistModalProps) {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: 'key', label: 'تم إرجاع المفتاح', checked: false },
    { id: 'id', label: 'تم إرجاع بطاقة الإقامة', checked: false },
    { id: 'room', label: 'تم فحص الغرفة', checked: false },
  ]);

  const [notes, setNotes] = useState('');

  const toggleItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const allChecked = checklist.every((item) => item.checked);

  const handleSubmit = () => {
    if (allChecked) {
      alert('تم إتمام عملية الإخلاء بنجاح');
      onClose();
    } else {
      alert('يجب إكمال جميع بنود القائمة قبل الإتمام');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <CheckSquare size={32} />
              <div>
                <h2 className="text-xl font-bold">قائمة الإخلاء</h2>
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
          {/* Info Notice */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="text-sm text-blue-800">
              <p className="font-bold mb-1">تعليمات:</p>
              <p>يرجى التأكد من إتمام جميع البنود التالية قبل إنهاء عملية إخلاء الغرفة</p>
            </div>
          </div>

          {/* Checklist Items */}
          <div className="space-y-3">
            {checklist.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  item.checked
                    ? 'bg-green-50 border-green-500'
                    : 'bg-gray-50 border-gray-300 hover:border-gray-400'
                }`}
              >
                {/* Toggle Switch */}
                <div
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    item.checked ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
                      item.checked ? 'translate-x-1' : 'translate-x-7'
                    }`}
                  />
                </div>

                {/* Label */}
                <span
                  className={`flex-1 text-right font-medium ${
                    item.checked ? 'text-green-700' : 'text-gray-700'
                  }`}
                >
                  {item.label}
                </span>

                {/* Check Icon */}
                {item.checked && (
                  <CheckSquare className="text-green-600" size={24} />
                )}
              </button>
            ))}
          </div>

          {/* Notes Section */}
          <div>
            <label className="block text-sm font-bold text-[#002147] mb-2">
              ملاحظات إضافية (اختياري)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="أضف أي ملاحظات حول حالة الغرفة أو الأغراض المرتجعة..."
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#F2C94C] transition-colors resize-none"
            />
          </div>

          {/* Progress Indicator */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">التقدم</span>
              <span className="text-sm font-bold text-[#002147]">
                {checklist.filter((item) => item.checked).length} / {checklist.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  allChecked ? 'bg-green-500' : 'bg-[#F2C94C]'
                }`}
                style={{
                  width: `${
                    (checklist.filter((item) => item.checked).length /
                      checklist.length) *
                    100
                  }%`,
                }}
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
            disabled={!allChecked}
            className={`px-8 py-2.5 rounded-lg font-medium transition-colors shadow-md ${
              allChecked
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            إتمام الإخلاء
          </button>
        </div>
      </div>
    </div>
  );
}
