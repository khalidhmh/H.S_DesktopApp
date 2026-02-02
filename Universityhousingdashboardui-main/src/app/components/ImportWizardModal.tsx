import { useState } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ImportWizardModalProps {
  onClose: () => void;
}

export function DataImportWizard({ onClose }: ImportWizardModalProps) {
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUpload = () => {
    setIsUploading(true);
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      setTimeout(() => setStep(2), 1000);
    }, 2000);
  };

  const systemFields = [
    { id: 'name', label: 'اسم الطالب', required: true },
    { id: 'nationalId', label: 'الرقم القومي', required: true },
    { id: 'college', label: 'الكلية', required: false },
    { id: 'roomNo', label: 'رقم الغرفة', required: false },
    { id: 'phone', label: 'رقم الهاتف', required: false },
  ];

  const excelHeaders = [
    'Column A: Name_Full',
    'Column B: ID_14',
    'Column C: Faculty_Dept',
    'Column D: Room_Index',
    'Column E: Contact_Number',
    'Column F: Birth_Date'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" dir="rtl">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#002147]">معالج استيراد البيانات</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className={`h-1.5 w-12 rounded-full ${step >= 1 ? 'bg-[#F2C94C]' : 'bg-gray-200'}`} />
              <div className={`h-1.5 w-12 rounded-full ${step >= 2 ? 'bg-[#F2C94C]' : 'bg-gray-200'}`} />
              <div className={`h-1.5 w-12 rounded-full ${step >= 3 ? 'bg-[#F2C94C]' : 'bg-gray-200'}`} />
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col items-center justify-center py-10"
              >
                {!uploadSuccess ? (
                  <>
                    <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6">
                      <FileSpreadsheet className="text-blue-500" size={40} />
                    </div>
                    <h3 className="text-lg font-bold text-[#002147] mb-2">رفع ملف البيانات</h3>
                    <p className="text-gray-500 mb-8 text-center max-w-md">يرجى رفع ملف Excel يحتوي على بيانات الطلاب. يدعم النظام صيغ .xlsx و .csv</p>
                    
                    <div 
                      className={`w-full max-w-md border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isUploading ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200 hover:border-[#F2C94C] hover:bg-gray-50'
                      }`}
                      onClick={!isUploading ? handleUpload : undefined}
                    >
                      {isUploading ? (
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                          <p className="text-blue-600 font-bold">جاري الرفع...</p>
                        </div>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Upload className="text-gray-400" size={24} />
                          </div>
                          <p className="text-gray-700 font-bold mb-1">اسحب وأفلت الملف هنا</p>
                          <p className="text-gray-400 text-sm">أو انقر لاختيار ملف من جهازك</p>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center py-10">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 className="text-green-500" size={48} />
                    </div>
                    <h3 className="text-xl font-bold text-[#002147] mb-2">تم الرفع بنجاح</h3>
                    <p className="text-gray-500">جاري الانتقال لمرحلة مطابقة الحقول...</p>
                  </div>
                )}
              </motion.div>
            ) : step === 2 ? (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-[#002147] mb-2">مطابقة أعمدة ملف Excel مع حقول النظام</h3>
                  <p className="text-gray-500 text-sm">قم باختيار العمود المناسب من ملفك لكل حقل من حقول النظام المطلوبة.</p>
                </div>

                <div className="space-y-4">
                  {systemFields.map((field) => (
                    <div key={field.id} className="flex items-center gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="w-1/3 flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${field.required ? 'bg-red-400' : 'bg-gray-300'}`} />
                        <span className="font-bold text-[#002147]">{field.label}</span>
                      </div>
                      
                      <div className="flex-1 flex items-center justify-center">
                        <ArrowLeft className="text-gray-300" size={20} />
                      </div>

                      <div className="w-1/2">
                        <div className="relative">
                          <select className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#F2C94C] outline-none">
                            <option value="">-- اختر عموداً --</option>
                            {excelHeaders.map(header => (
                              <option key={header} value={header}>{header}</option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <ChevronDown size={18} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
               <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col items-center justify-center py-10"
              >
                <div className="w-20 h-20 bg-[#F2C94C]/20 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="text-[#002147]" size={48} />
                </div>
                <h3 className="text-xl font-bold text-[#002147] mb-2">جاهز للاستيراد</h3>
                <p className="text-gray-500 mb-8 text-center max-w-md">تمت مطابقة جميع الحقول بنجاح. سيتم استيراد 150 سجلاً إلى قاعدة البيانات.</p>
                
                <div className="w-full bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">إجمالي السجلات:</span>
                    <span className="font-bold text-[#002147]">150</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">السجلات الصالحة:</span>
                    <span className="font-bold text-green-600">148</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">سجلات بها أخطاء:</span>
                    <span className="font-bold text-red-600">2</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <button 
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            className="flex items-center gap-2 text-gray-500 font-bold hover:text-gray-700 transition-colors"
          >
            <ArrowRight size={20} />
            {step === 1 ? 'إلغاء' : 'السابق'}
          </button>
          
          <button 
            onClick={() => step < 3 ? setStep(step + 1) : onClose()}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all shadow-md ${
              step === 3 ? 'bg-green-600 text-white' : 'bg-[#F2C94C] text-[#002147]'
            }`}
          >
            {step === 1 ? 'التالي' : step === 2 ? 'متابعة' : 'تأكيد الاستيراد'}
            <ArrowLeft size={20} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
