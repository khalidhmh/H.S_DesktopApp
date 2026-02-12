import React, { useState, useEffect } from 'react'
import { X, ShieldAlert, Key, LogOut, Trash2, Home, User, AlertCircle } from 'lucide-react'
import { cn } from '@renderer/lib/utils'
import { PersonalInfo } from './tabs/PersonalInfo'
import { GuardianInfo } from './tabs/GuardianInfo'
import { AttendanceHistory } from './tabs/AttendanceHistory'
import { PenaltiesList } from './tabs/PenaltiesList'
import { ActivitiesList } from './tabs/ActivitiesList'
import { IssuePenaltyModal } from '../actions/IssuePenaltyModal'
import { EvacuationModal } from '../actions/EvacuationModal'
import { SettingsService } from '@renderer/services/settings.service'
import { logger } from '@shared/utils/logger'

interface StudentProfileModalProps {
  student: any
  isOpen: boolean
  onClose: () => void
}

type TabType = 'personal' | 'guardian' | 'attendance' | 'penalties' | 'activities'

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('personal')
  const [isVisible, setIsVisible] = useState(false)
  const [showPenaltyModal, setShowPenaltyModal] = useState(false)
  const [showEvacuationModal, setShowEvacuationModal] = useState(false)
  const [isResettingPassword, setIsResettingPassword] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      document.body.style.overflow = 'hidden'
    } else {
      setIsVisible(false)
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  if (!isOpen || !student) return null

  const tabs: { id: TabType; label: string }[] = [
    { id: 'personal', label: 'البيانات الشخصية' },
    { id: 'guardian', label: 'ولي الأمر' },
    { id: 'attendance', label: 'سجل الحضور' },
    { id: 'penalties', label: 'الجزاءات' },
    { id: 'activities', label: 'الأنشطة' }
  ]

  const statusLabels = {
    REGULAR: 'نظامي',
    CREDIT: 'ساعات معتمدة',
    EXPAT: 'وافد'
  }

  const handleResetPassword = async () => {
    if (!student.id) return

    const confirmed = window.confirm(
      `هل أنت متأكد من استعادة كلمة المرور للطالب ${student.name || student.fullName}؟`
    )
    if (!confirmed) return

    setIsResettingPassword(true)
    try {
      const defaultPassword = '123456' // Default or generate one
      // @ts-ignore - SettingsService might need userId which we assume is student.id
      await SettingsService.updatePassword(student.id, defaultPassword)
      alert(`تم استعادة كلمة المرور بنجاح. كلمة المرور الجديدة: ${defaultPassword}`)
    } catch (error) {
      logger.error('Failed to reset password:', error)
      alert('فشل استعادة كلمة المرور. حاول مرة أخرى.')
    } finally {
      setIsResettingPassword(false)
    }
  }

  // Check if student has penalties
  const hasPenalties = student.hasPenalties || (student.penalties && student.penalties.length > 0)

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" dir="rtl">
        {/* Backdrop */}
        <div
          className={cn(
            'absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300',
            isVisible ? 'opacity-100' : 'opacity-0'
          )}
          onClick={onClose}
        />

        {/* Modal Content - The Digital File */}
        <div
          className={cn(
            'relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col transform transition-all duration-300',
            isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
          )}
        >
          {/* Hero Section with Gradient */}
          <div className="relative h-48 bg-gradient-to-r from-[#002147] to-[#0A4E9E] p-6 text-white shrink-0">
            <button
              onClick={onClose}
              className="absolute top-4 left-4 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
              aria-label="إغلاق"
            >
              <X size={20} className="text-white" />
            </button>

            <div className="flex items-end h-full relative z-10 translate-y-10 mr-4">
              {/* Profile Image with Border */}
              <div className="relative">
                <img
                  src={student.photo || student.photoUrl || '/default-avatar.png'}
                  alt={student.name || student.fullName}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-gray-200"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = '/default-avatar.png'
                  }}
                />
                {/* Status Indicator Dot */}
                <div
                  className={cn(
                    'absolute bottom-2 left-2 w-6 h-6 rounded-full border-2 border-white',
                    student.status === 'CREDIT'
                      ? 'bg-[#F2C94C]'
                      : student.status === 'EXPAT'
                        ? 'bg-orange-500'
                        : 'bg-green-500'
                  )}
                />
              </div>

              <div className="mr-6 mb-3 text-right">
                <h2 className="text-3xl font-bold tracking-tight mb-1 flex items-center gap-3">
                  {student.name || student.fullName}
                  {/* Penalty Warning Badge */}
                  {hasPenalties && (
                    <span className="bg-red-500/20 text-red-100 border border-red-500/50 text-xs px-2 py-1 rounded-full flex items-center gap-1 animate-pulse">
                      <ShieldAlert size={12} /> عليه جزاءات
                    </span>
                  )}
                </h2>
                <div className="flex items-center space-x-4 space-x-reverse text-blue-100 text-sm">
                  <span className="flex items-center">
                    <User size={14} className="ml-1" />
                    {student.college}
                  </span>
                  <span className="flex items-center">
                    <Home size={14} className="ml-1" />
                    {student.room
                      ? `${student.room.building} - غرفة ${student.room.roomNumber}`
                      : 'غير محدد'}
                  </span>
                  {/* Status Badge */}
                  <span className="px-2 py-0.5 bg-white/20 rounded capitalize">
                    {statusLabels[student.status] || student.status || 'نظامي'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-12 px-6 border-b border-gray-200 shrink-0">
            <div className="flex space-x-6 space-x-reverse overflow-x-auto no-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'pb-3 text-sm font-semibold transition-all border-b-2 whitespace-nowrap',
                    activeTab === tab.id
                      ? 'border-[#F2C94C] text-[#002147]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              {activeTab === 'personal' && <PersonalInfo student={student} />}
              {activeTab === 'guardian' && <GuardianInfo student={student} />}
              {activeTab === 'attendance' && <AttendanceHistory studentId={student.id} />}
              {activeTab === 'penalties' && <PenaltiesList studentId={student.id} />}
              {activeTab === 'activities' && <ActivitiesList student={student} />}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-between items-center shrink-0">
            <div className="flex gap-2">
              <button
                onClick={() => setShowPenaltyModal(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors border border-red-200"
              >
                <ShieldAlert size={16} /> توقيع جزاء
              </button>
              <button
                onClick={() => setShowEvacuationModal(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-md transition-colors border border-orange-200"
              >
                <LogOut size={16} /> إخلاء طرف
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleResetPassword}
                disabled={isResettingPassword}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors border border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Key size={16} />
                {isResettingPassword ? 'جاري الاستعادة...' : 'استعادة كلمة المرور'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Modals */}
      <IssuePenaltyModal
        isOpen={showPenaltyModal}
        onClose={() => setShowPenaltyModal(false)}
        studentName={student.name || student.fullName}
        studentId={student.id}
      />
      <EvacuationModal
        isOpen={showEvacuationModal}
        onClose={() => setShowEvacuationModal(false)}
        studentName={student.name || student.fullName}
        studentId={student.id}
      />
    </>
  )
}
