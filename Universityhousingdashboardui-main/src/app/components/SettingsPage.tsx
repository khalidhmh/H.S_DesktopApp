import { useState } from 'react';
import { 
  ShieldCheck, 
  Database, 
  Settings2, 
  Lock, 
  Eye, 
  EyeOff, 
  CloudDownload, 
  AlertTriangle, 
  FileSpreadsheet,
  Volume2,
  Moon,
  Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { DataImportWizard } from '@/app/components/ImportWizardModal';

type TabId = 'security' | 'data' | 'general';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('security');
  const [showImportWizard, setShowImportWizard] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);

  const tabs = [
    { id: 'security', label: 'أمان الحساب', icon: <ShieldCheck size={20} /> },
    { id: 'data', label: 'إدارة البيانات', icon: <Database size={20} /> },
    { id: 'general', label: 'الإعدادات العامة', icon: <Settings2 size={20} /> },
  ];

  return (
    <div className="p-6 h-full bg-[#F5F7FA]">
      <div className="max-w-6xl mx-auto h-full flex flex-col">
        <h1 className="text-2xl font-bold text-[#002147] mb-6">الإعدادات</h1>
        
        <div className="flex flex-row-reverse gap-6 h-full overflow-hidden">
          {/* Left Vertical Tabs (Visually left in RTL) */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabId)}
                  className={`w-full flex items-center gap-3 px-6 py-4 transition-all border-r-4 ${
                    activeTab === tab.id
                      ? 'bg-[#F2C94C]/10 border-[#F2C94C] text-[#002147]'
                      : 'border-transparent text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className={activeTab === tab.id ? 'text-[#F2C94C]' : 'text-gray-400'}>
                    {tab.icon}
                  </span>
                  <span className="font-bold text-sm">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content (Visually right in RTL) */}
          <div className="flex-1 overflow-y-auto pl-2 pb-6">
            <AnimatePresence mode="wait">
              {activeTab === 'security' && (
                <MotionContent key="security">
                  <ProfileSecurityView />
                </MotionContent>
              )}
              {activeTab === 'data' && (
                <MotionContent key="data">
                  <DataManagementView onStartWizard={() => setShowImportWizard(true)} />
                </MotionContent>
              )}
              {activeTab === 'general' && (
                <MotionContent key="general">
                  <GeneralPreferencesView 
                    isDarkMode={isDarkMode} 
                    setIsDarkMode={setIsDarkMode}
                    isNotificationsEnabled={isNotificationsEnabled}
                    setIsNotificationsEnabled={setIsNotificationsEnabled}
                  />
                </MotionContent>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Import Wizard Modal */}
      {showImportWizard && (
        <DataImportWizard onClose={() => setShowImportWizard(false)} />
      )}
    </div>
  );
}

function MotionContent({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

function ProfileSecurityView() {
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-[#002147] mb-6 flex items-center gap-2">
          <ShieldCheck className="text-[#F2C94C]" size={20} />
          أمان الحساب وكلمة المرور
        </h3>

        <div className="space-y-6 max-w-lg">
          {/* Username Field (Disabled) */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">اسم المستخدم (المعرف الشخصي)</label>
            <div className="relative">
              <input
                type="text"
                disabled
                value="ADMIN_USER_2024"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed pr-10"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
            </div>
            <p className="text-xs text-gray-400 font-medium">لا يمكن تغيير اسم المستخدم لأسباب أمنية.</p>
          </div>

          <div className="h-px bg-gray-100 my-4" />

          {/* Password Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">كلمة المرور الحالية</label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F2C94C] focus:border-transparent outline-none transition-all"
                />
                <button 
                  onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                  className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">كلمة المرور الجديدة</label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F2C94C] focus:border-transparent outline-none transition-all"
                />
                <button 
                  onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                  className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">تأكيد كلمة المرور الجديدة</label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F2C94C] focus:border-transparent outline-none transition-all"
                />
                <button 
                  onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                  className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <button className="w-full bg-[#F2C94C] text-[#002147] font-bold py-3 rounded-xl hover:bg-[#e0b83b] transition-colors shadow-sm mt-4">
            تحديث كلمة المرور
          </button>
        </div>
      </div>
    </div>
  );
}

function DataManagementView({ onStartWizard }: { onStartWizard: () => void }) {
  return (
    <div className="space-y-6">
      {/* Backup Section */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#002147] mb-2 flex items-center gap-2">
              <Database className="text-[#F2C94C]" size={20} />
              النسخ الاحتياطي
            </h3>
            <p className="text-gray-500 text-sm max-w-md">قم بتحميل نسخة احتياطية كاملة من قاعدة البيانات للرجوع إليها في أي وقت. نوصي بالقيام بذلك أسبوعياً.</p>
          </div>
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-[#002147] px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm">
            <CloudDownload size={20} className="text-[#F2C94C]" />
            تحميل النسخة الاحتياطية
          </button>
        </div>
      </div>

      {/* Bulk Import */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border-2 border-dashed border-[#F2C94C]/30 bg-[#F2C94C]/5">
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-16 h-16 bg-[#F2C94C]/20 rounded-2xl flex items-center justify-center mb-4">
            <FileSpreadsheet className="text-[#F2C94C]" size={32} />
          </div>
          <h3 className="text-xl font-bold text-[#002147] mb-2">استيراد الطلاب من Excel</h3>
          <p className="text-gray-600 text-sm max-w-md mb-6">يمكنك إضافة مجموعة كبيرة من الطلاب دفعة واحدة من خلال ملف Excel. سيقوم المعالج بمساعدتك في مطابقة البيانات.</p>
          <button 
            onClick={onStartWizard}
            className="bg-[#002147] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#003366] transition-all shadow-md"
          >
            بدء معالج الاستيراد
          </button>
        </div>
      </div>

      {/* Restore Section - Danger Zone */}
      <div className="bg-[#FEF2F2] p-8 rounded-2xl shadow-sm border border-red-100">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-red-700 mb-2 flex items-center gap-2">
              <AlertTriangle size={20} />
              منطقة الخطر: استعادة البيانات
            </h3>
            <p className="text-red-600/70 text-sm max-w-md">تنبيه: سيؤدي استعادة قاعدة البيانات إلى حذف جميع البيانات الحالية واستبدالها بالبيانات الموجودة في الملف المرفوع.</p>
          </div>
          <button className="flex items-center gap-2 bg-white border border-red-200 text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-50 transition-all shadow-sm">
            استعادة قاعدة البيانات
          </button>
        </div>
      </div>
    </div>
  );
}

function GeneralPreferencesView({ 
  isDarkMode, 
  setIsDarkMode, 
  isNotificationsEnabled, 
  setIsNotificationsEnabled 
}: any) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-[#002147] mb-8 flex items-center gap-2">
          <Settings2 className="text-[#F2C94C]" size={20} />
          التفضيلات المرئية والعامة
        </h3>

        <div className="space-y-8 max-w-md">
          {/* Toggles */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Volume2 size={20} />
              </div>
              <div>
                <p className="font-bold text-[#002147] text-sm">أصوات التنبيهات</p>
                <p className="text-xs text-gray-400">تشغيل صوت عند وصول إشعار جديد</p>
              </div>
            </div>
            <Toggle checked={isNotificationsEnabled} onChange={setIsNotificationsEnabled} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                <Moon size={20} />
              </div>
              <div>
                <p className="font-bold text-[#002147] text-sm">الوضع الليلي</p>
                <p className="text-xs text-gray-400">تفعيل المظهر الداكن لواجهة النظام</p>
              </div>
            </div>
            <Toggle checked={isDarkMode} onChange={setIsDarkMode} />
          </div>

          <div className="h-px bg-gray-100" />

          {/* Printer Setup */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[#002147]">
              <Printer size={18} className="text-gray-400" />
              إعدادات الطباعة
            </div>
            <p className="text-xs text-gray-500">اختر الطابعة الافتراضية لطباعة التقارير والبطاقات التعريفية.</p>
            <div className="relative">
              <select className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#F2C94C] outline-none">
                <option>HP LaserJet Pro M404n (المكتب الرئيسي)</option>
                <option>Epson EcoTank L3250 (الاستقبال)</option>
                <option>Canon imageRUNNER 2206 (الأرشيف)</option>
                <option>حفظ كملف PDF</option>
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean, onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        checked ? 'bg-[#F2C94C]' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? '-translate-x-6' : '-translate-x-1'
        }`}
      />
    </button>
  );
}
