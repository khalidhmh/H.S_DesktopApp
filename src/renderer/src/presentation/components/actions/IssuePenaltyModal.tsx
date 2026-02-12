import React, { useState } from 'react'
import { ShieldAlert, X, Save } from 'lucide-react'
import { cn } from '@renderer/lib/utils'
import { PenaltyService } from '@renderer/services/penalty.service'
import { logger } from '@shared/utils/logger'

interface IssuePenaltyModalProps {
  isOpen: boolean
  onClose: () => void
  studentName: string
  studentId: number
}

export const IssuePenaltyModal: React.FC<IssuePenaltyModalProps> = ({
  isOpen,
  onClose,
  studentName,
  studentId
}) => {
  const [violationType, setViolationType] = useState('إزعاج وضوضاء')
  const [severity, setSeverity] = useState('MEDIUM')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim()) {
      alert('الرجاء كتابة وصف للمخالفة')
      return
    }

    setIsSubmitting(true)
    try {
      await PenaltyService.addPenalty(studentId, {
        type: violationType,
        reason: description
      })
      alert('تم إصدار الجزاء بنجاح')
      onClose()
      // Reset form
      setDescription('')
      setViolationType('إزعاج وضوضاء')
      setSeverity('MEDIUM')
    } catch (error) {
      logger.error('Failed to issue penalty:', error)
      alert('فشل في إصدار الجزاء. حاول مرة أخرى.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      dir="rtl"
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-red-50 p-4 border-b border-red-100 flex justify-between items-center">
          <div className="flex items-center gap-3 text-red-700">
            <div className="p-2 bg-red-100 rounded-full">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold">إصدار قرار جزاء</h3>
              <p className="text-xs text-red-600/80">الطالب: {studentName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-700 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Violation Type */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">نوع المخالفة</label>
            <select
              value={violationType}
              onChange={(e) => setViolationType(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none text-right bg-white"
            >
              <option value="إتلاف عهدة">إتلاف عهدة</option>
              <option value="إزعاج وضوضاء">إزعاج وضوضاء</option>
              <option value="غياب متكرر">غياب متكرر</option>
              <option value="سلوك غير لائق">سلوك غير لائق</option>
              <option value="تدخين في الغرف">تدخين في الغرف</option>
              <option value="مخالفة قوانين السكن">مخالفة قوانين السكن</option>
            </select>
          </div>

          {/* Severity */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">درجة الخطورة</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-gray-200 hover:bg-gray-50 flex-1 justify-center transition-colors has-[:checked]:bg-red-50 has-[:checked]:border-red-200 has-[:checked]:text-red-700">
                <input
                  type="radio"
                  name="severity"
                  value="HIGH"
                  checked={severity === 'HIGH'}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="accent-red-600"
                />
                <span className="text-sm font-medium">جسيـمة</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-gray-200 hover:bg-gray-50 flex-1 justify-center transition-colors has-[:checked]:bg-orange-50 has-[:checked]:border-orange-200 has-[:checked]:text-orange-700">
                <input
                  type="radio"
                  name="severity"
                  value="MEDIUM"
                  checked={severity === 'MEDIUM'}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="accent-orange-500"
                />
                <span className="text-sm font-medium">متوسطة</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-gray-200 hover:bg-gray-50 flex-1 justify-center transition-colors has-[:checked]:bg-blue-50 has-[:checked]:border-blue-200 has-[:checked]:text-blue-700">
                <input
                  type="radio"
                  name="severity"
                  value="LOW"
                  checked={severity === 'LOW'}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="accent-blue-500"
                />
                <span className="text-sm font-medium">بسيطة</span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">وصف الواقعة *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="اكتب تفاصيل المخالفة هنا..."
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-100 mt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {isSubmitting ? 'جاري الحفظ...' : 'حفظ وإصدار القرار'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
