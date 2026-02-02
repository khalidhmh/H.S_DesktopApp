import { useState } from 'react';
import { X, AlertTriangle, CheckCircle, Copy, Shield } from 'lucide-react';

interface SecurityChallengeModalProps {
  studentNationalId: string;
  onClose: () => void;
}

export function SecurityChallengeModal({ studentNationalId, onClose }: SecurityChallengeModalProps) {
  const [inputId, setInputId] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  const handleVerify = () => {
    if (inputId === studentNationalId) {
      // Generate a random password
      const password = generatePassword();
      setGeneratedPassword(password);
      setIsVerified(true);
    } else {
      alert('الرقم القومي غير صحيح. الرجاء المحاولة مرة أخرى.');
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$%&*';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPassword);
    setShowCopySuccess(true);
    setTimeout(() => setShowCopySuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4" onClick={onClose}>
      <div
        className={`bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border-4 ${
          isVerified ? 'border-green-500' : 'border-red-500'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {!isVerified ? (
          // Warning State
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle size={32} />
                  <div>
                    <h2 className="text-xl font-bold">تحدي أمني</h2>
                    <p className="text-sm opacity-90">إعادة تعيين كلمة المرور</p>
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
              {/* Critical Warning */}
              <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 flex items-start gap-3">
                <Shield className="text-red-600 flex-shrink-0 mt-1" size={24} />
                <div className="text-sm text-red-800">
                  <p className="font-bold mb-1">تحذير هام:</p>
                  <p>هذا الإجراء سيقوم بإعادة تعيين كلمة مرور الطالب بشكل نهائي. للمتابعة، يجب إدخال الرقم القومي للطالب للتحقق من الهوية.</p>
                </div>
              </div>

              {/* Input Field */}
              <div>
                <label className="block text-sm font-bold text-[#002147] mb-2">
                  أدخل الرقم القومي للطالب للتحقق <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={inputId}
                  onChange={(e) => setInputId(e.target.value)}
                  placeholder="أدخل الرقم القومي المكون من 14 رقم"
                  maxLength={14}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-500 transition-colors font-mono text-lg"
                  dir="ltr"
                />
              </div>

              {/* Footer Note */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <span className="font-bold text-[#002147]">ملاحظة:</span> سيتم تسجيل هذا الإجراء بشكل دائم تحت معرف المستخدم الخاص بك
                </p>
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
                onClick={handleVerify}
                disabled={inputId.length !== 14}
                className="px-8 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors shadow-md"
              >
                تحقق ومتابعة
              </button>
            </div>
          </>
        ) : (
          // Success State
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <CheckCircle size={32} />
                  <div>
                    <h2 className="text-xl font-bold">تم بنجاح!</h2>
                    <p className="text-sm opacity-90">تم إعادة تعيين كلمة المرور</p>
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
              {/* Success Message */}
              <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 text-center">
                <CheckCircle className="mx-auto mb-3 text-green-600" size={48} />
                <p className="text-green-800 font-medium">
                  تم التحقق من الهوية بنجاح وإنشاء كلمة مرور جديدة
                </p>
              </div>

              {/* Generated Password Display */}
              <div>
                <label className="block text-sm font-bold text-[#002147] mb-3 text-center">
                  كلمة المرور الجديدة
                </label>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 rounded-xl p-6">
                  <div className="text-center mb-4">
                    <p className="text-5xl font-bold text-[#002147] tracking-wider font-mono mb-2">
                      {generatedPassword}
                    </p>
                    <p className="text-xs text-gray-600">قم بنسخ كلمة المرور وإرسالها للطالب</p>
                  </div>

                  <button
                    onClick={handleCopy}
                    className="w-full bg-[#F2C94C] hover:bg-[#e0b73d] text-[#002147] px-6 py-3 rounded-lg font-bold transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    <Copy size={20} />
                    <span>{showCopySuccess ? 'تم النسخ!' : 'نسخ كلمة المرور'}</span>
                  </button>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                  <div className="text-sm text-yellow-800">
                    <p className="font-bold mb-1">تنبيه أمني:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>تأكد من إرسال كلمة المرور للطالب عبر قناة آمنة</li>
                      <li>اطلب من الطالب تغيير كلمة المرور فور تسجيل الدخول</li>
                      <li>لا تشارك كلمة المرور مع أي شخص آخر</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Audit Log Notice */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 text-center">
                  <span className="font-bold text-[#002147]">تم تسجيل هذا الإجراء:</span>
                  <br />
                  العملية مسجلة بشكل دائم تحت معرف المستخدم الخاص بك
                  <br />
                  التاريخ والوقت: {new Date().toLocaleString('ar-EG')}
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-gray-50 px-6 py-4 border-t">
              <button
                onClick={onClose}
                className="w-full px-6 py-3 bg-[#002147] hover:bg-[#003366] text-white rounded-lg font-medium transition-colors shadow-md"
              >
                إغلاق
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
