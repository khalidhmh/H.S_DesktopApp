import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Droplet, Zap, Flame, Wifi, Wind, Wrench, Upload, AlertCircle } from 'lucide-react';

type FaultType = 'plumbing' | 'electric' | 'gas' | 'internet' | 'ac' | 'other';

interface Fault {
  type: FaultType;
  title: string;
  description: string;
  location: {
    floor: number;
    wing: string;
    roomType: string;
    roomNumber?: string;
  };
  status: 'pending' | 'in-progress' | 'completed';
  photoUrl?: string;
  priority: 'low' | 'medium' | 'high';
}

interface AddFaultModalProps {
  onClose: () => void;
  onSubmit: (fault: Omit<Fault, 'id' | 'reportedDate' | 'reportedBy'>) => void;
}

const faultTypes = [
  { id: 'plumbing', label: 'سباكة', icon: <Droplet size={24} />, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { id: 'electric', label: 'كهرباء', icon: <Zap size={24} />, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  { id: 'gas', label: 'غاز', icon: <Flame size={24} />, color: 'text-red-600', bgColor: 'bg-red-50' },
  { id: 'internet', label: 'إنترنت', icon: <Wifi size={24} />, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  { id: 'ac', label: 'تكييف', icon: <Wind size={24} />, color: 'text-cyan-600', bgColor: 'bg-cyan-50' },
  { id: 'other', label: 'أخرى', icon: <Wrench size={24} />, color: 'text-gray-600', bgColor: 'bg-gray-50' },
];

const wings = [
  { id: 'A', label: 'شمال A' },
  { id: 'B', label: 'غرب B' },
  { id: 'C', label: 'جنوب C' },
  { id: 'D', label: 'شرق D' },
];

const roomTypes = [
  { id: 'room', label: 'غرفة سكنية', needsRoomNumber: true },
  { id: 'study', label: 'غرفة دراسة', needsRoomNumber: false },
  { id: 'corridor', label: 'ممر', needsRoomNumber: false },
  { id: 'bathroom', label: 'حمام مشترك', needsRoomNumber: false },
  { id: 'kitchen', label: 'مطبخ مشترك', needsRoomNumber: false },
  { id: 'office', label: 'مكتب إداري', needsRoomNumber: false },
  { id: 'lobby', label: 'صالة رئيسية', needsRoomNumber: false },
];

export function AddFaultModal({ onClose, onSubmit }: AddFaultModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: '' as FaultType | '',
    floor: 0,
    wing: '',
    roomType: '',
    roomNumber: '',
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  // Conditional Logic: Determine which room types are available based on fault type
  const getAvailableRoomTypes = () => {
    if (!formData.type) return roomTypes;

    switch (formData.type) {
      case 'internet':
        // Internet issues only in study rooms and offices
        return roomTypes.filter((rt) => ['study', 'office', 'lobby'].includes(rt.id));
      
      case 'gas':
        // Gas issues only in kitchens
        return roomTypes.filter((rt) => ['kitchen'].includes(rt.id));
      
      case 'plumbing':
        // Plumbing in bathrooms, kitchens, and rooms
        return roomTypes.filter((rt) => ['room', 'bathroom', 'kitchen'].includes(rt.id));
      
      case 'electric':
        // Electric can be anywhere
        return roomTypes;
      
      case 'ac':
        // AC in rooms, offices, study rooms, and lobby
        return roomTypes.filter((rt) => ['room', 'study', 'office', 'lobby'].includes(rt.id));
      
      default:
        return roomTypes;
    }
  };

  // Conditional Logic: Determine which wings are available based on fault type
  const getAvailableWings = () => {
    if (!formData.type) return wings;

    switch (formData.type) {
      case 'gas':
        // Gas only in wings B and D (example logic)
        return wings.filter((w) => ['B', 'D'].includes(w.id));
      
      default:
        return wings;
    }
  };

  const availableRoomTypes = getAvailableRoomTypes();
  const availableWings = getAvailableWings();

  const isRoomTypeDisabled = (roomTypeId: string) => {
    return !availableRoomTypes.some((rt) => rt.id === roomTypeId);
  };

  const isWingDisabled = (wingId: string) => {
    return !availableWings.some((w) => w.id === wingId);
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    if (!formData.type || !formData.floor || !formData.wing || !formData.roomType || !formData.title) {
      alert('الرجاء إكمال جميع الحقول المطلوبة');
      return;
    }

    const selectedRoomType = roomTypes.find((rt) => rt.id === formData.roomType);

    onSubmit({
      type: formData.type,
      title: formData.title,
      description: formData.description,
      location: {
        floor: formData.floor,
        wing: formData.wing,
        roomType: selectedRoomType?.label || '',
        roomNumber: formData.roomNumber || undefined,
      },
      status: 'pending',
      priority: formData.priority,
    });
  };

  const canProceedToStep2 = formData.type && formData.floor > 0;
  const canProceedToStep3 = canProceedToStep2 && formData.wing;
  const canProceedToStep4 = canProceedToStep3 && formData.roomType;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#002147] to-[#003366] text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">إضافة عطل جديد</h2>
            <p className="text-sm opacity-90 mt-1">املأ البيانات لتسجيل العطل</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="bg-gray-50 px-6 py-4 border-b">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      step >= stepNum
                        ? 'bg-[#F2C94C] text-[#002147]'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {stepNum}
                  </div>
                  <span className="text-xs mt-1 text-gray-600">
                    {stepNum === 1 && 'نوع العطل'}
                    {stepNum === 2 && 'الموقع'}
                    {stepNum === 3 && 'نوع الغرفة'}
                    {stepNum === 4 && 'التفاصيل'}
                  </span>
                </div>
                {stepNum < 4 && (
                  <div
                    className={`h-1 flex-1 mx-2 rounded transition-all ${
                      step > stepNum ? 'bg-[#F2C94C]' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
          {/* Step 1: Fault Type and Floor */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-[#002147] mb-3">
                  نوع العطل <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {faultTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setFormData({ ...formData, type: type.id as FaultType })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.type === type.id
                          ? `${type.bgColor} border-current ${type.color} shadow-md`
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        {type.icon}
                        <span className="text-sm font-medium">{type.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#002147] mb-3">
                  اختر الطابق <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-6 gap-3">
                  {[1, 2, 3, 4, 5, 6].map((floor) => (
                    <button
                      key={floor}
                      onClick={() => setFormData({ ...formData, floor })}
                      className={`py-3 rounded-lg border-2 font-bold transition-all ${
                        formData.floor === floor
                          ? 'bg-[#F2C94C] border-[#F2C94C] text-[#002147] shadow-md'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      {floor}
                    </button>
                  ))}
                </div>
              </div>

              {formData.type && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">ملاحظة هامة:</p>
                    <p>
                      {formData.type === 'internet' && 'أعطال الإنترنت متاحة فقط في غرف الدراسة والمكاتب الإدارية'}
                      {formData.type === 'gas' && 'أعطال الغاز متاحة فقط في الأجنحة B و D وفي المطابخ المشتركة فقط'}
                      {formData.type === 'plumbing' && 'أعطال السباكة متاحة في الغرف والحمامات والمطابخ'}
                      {formData.type === 'ac' && 'أعطال التكييف متاحة في الغرف وغرف الدراسة والمكاتب'}
                      {formData.type === 'electric' && 'أعطال الكهرباء متاحة في جميع المواقع'}
                      {formData.type === 'other' && 'الأعطال الأخرى متاحة في جميع المواقع'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Wing Selection */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-[#002147] mb-3">
                  اختر الجناح <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {wings.map((wing) => {
                    const disabled = isWingDisabled(wing.id);
                    return (
                      <button
                        key={wing.id}
                        onClick={() => !disabled && setFormData({ ...formData, wing: wing.id })}
                        disabled={disabled}
                        className={`p-6 rounded-xl border-2 transition-all text-center ${
                          formData.wing === wing.id
                            ? 'bg-[#F2C94C] border-[#F2C94C] text-[#002147] shadow-lg'
                            : disabled
                            ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="text-3xl font-bold mb-2">{wing.id}</div>
                        <div className="text-sm font-medium">{wing.label}</div>
                        {disabled && (
                          <div className="text-xs text-red-500 mt-2">غير متاح لهذا النوع</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                <p className="font-medium mb-1">الاختيارات:</p>
                <p>نوع العطل: <span className="font-bold text-[#002147]">{faultTypes.find(t => t.id === formData.type)?.label}</span></p>
                <p>الطابق: <span className="font-bold text-[#002147]">{formData.floor}</span></p>
              </div>
            </div>
          )}

          {/* Step 3: Room Type Selection (Dynamic) */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-[#002147] mb-3">
                  اختر نوع المكان <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {roomTypes.map((roomType) => {
                    const disabled = isRoomTypeDisabled(roomType.id);
                    return (
                      <button
                        key={roomType.id}
                        onClick={() => !disabled && setFormData({ ...formData, roomType: roomType.id })}
                        disabled={disabled}
                        className={`p-4 rounded-xl border-2 transition-all text-right ${
                          formData.roomType === roomType.id
                            ? 'bg-[#F2C94C] border-[#F2C94C] text-[#002147] shadow-md'
                            : disabled
                            ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="font-medium">{roomType.label}</div>
                        {disabled && (
                          <div className="text-xs text-red-500 mt-1">غير متاح لهذا النوع</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Room Number Input (if needed) */}
              {formData.roomType && roomTypes.find((rt) => rt.id === formData.roomType)?.needsRoomNumber && (
                <div>
                  <label className="block text-sm font-bold text-[#002147] mb-2">
                    رقم الغرفة (اختياري)
                  </label>
                  <input
                    type="text"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    placeholder={`${formData.floor}01`}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#F2C94C] transition-colors"
                  />
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                <p className="font-medium mb-1">الاختيارات:</p>
                <p>نوع العطل: <span className="font-bold text-[#002147]">{faultTypes.find(t => t.id === formData.type)?.label}</span></p>
                <p>الموقع: <span className="font-bold text-[#002147]">الطابق {formData.floor} - جناح {formData.wing}</span></p>
              </div>
            </div>
          )}

          {/* Step 4: Details */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-[#002147] mb-2">
                  عنوان العطل <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="مثال: تسرب مياه في الحمام"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#F2C94C] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#002147] mb-2">
                  وصف العطل <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="اشرح تفاصيل العطل..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#F2C94C] transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#002147] mb-2">
                  الأولوية
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'low', label: 'منخفضة', color: 'bg-green-500' },
                    { id: 'medium', label: 'متوسطة', color: 'bg-yellow-500' },
                    { id: 'high', label: 'عالية', color: 'bg-red-500' },
                  ].map((priority) => (
                    <button
                      key={priority.id}
                      onClick={() => setFormData({ ...formData, priority: priority.id as 'low' | 'medium' | 'high' })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.priority === priority.id
                          ? `${priority.color} border-current text-white shadow-md`
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      {priority.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#002147] mb-2">
                  إضافة صورة (اختياري)
                </label>
                <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-[#F2C94C] transition-colors flex flex-col items-center gap-2 text-gray-500 hover:text-[#002147]">
                  <Upload size={32} />
                  <span className="text-sm">اضغط لتحميل صورة</span>
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                <p className="font-medium mb-2">ملخص العطل:</p>
                <div className="space-y-1">
                  <p>النوع: <span className="font-bold text-[#002147]">{faultTypes.find(t => t.id === formData.type)?.label}</span></p>
                  <p>الموقع: <span className="font-bold text-[#002147]">الطابق {formData.floor} - جناح {formData.wing} - {roomTypes.find(rt => rt.id === formData.roomType)?.label}</span></p>
                  {formData.roomNumber && <p>رقم الغرفة: <span className="font-bold text-[#002147]">{formData.roomNumber}</span></p>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 hover:bg-gray-200"
          >
            <ChevronRight size={20} />
            <span>السابق</span>
          </button>

          <div className="text-sm text-gray-600">
            خطوة {step} من 4
          </div>

          {step < 4 ? (
            <button
              onClick={handleNext}
              disabled={
                (step === 1 && !canProceedToStep2) ||
                (step === 2 && !canProceedToStep3) ||
                (step === 3 && !canProceedToStep4)
              }
              className="px-6 py-2.5 bg-[#F2C94C] hover:bg-[#e0b73d] text-[#002147] rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              <span>التالي</span>
              <ChevronLeft size={20} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-8 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-md"
            >
              إرسال البلاغ
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
