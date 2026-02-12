import React, { useEffect, useState } from 'react'
import { AttendanceService } from '@renderer/services/attendance.service'
import { cn } from '@renderer/lib/utils'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { logger } from '@shared/utils/logger'

interface AttendanceHistoryProps {
  studentId: number
}

export const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({ studentId }) => {
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await AttendanceService.getAttendanceHistory(studentId)
        setHistory(data)
      } catch (error) {
        logger.error('Failed to fetch attendance history:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [studentId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#002147]" />
      </div>
    )
  }

  const stats = {
    present: history.filter((d) => d.status === 'PRESENT').length,
    absent: history.filter((d) => d.status === 'ABSENT').length,
    excused: history.filter((d) => d.status === 'EXCUSED').length
  }

  const statusConfig = {
    PRESENT: { icon: CheckCircle, color: 'bg-green-500', label: 'حاضر' },
    ABSENT: { icon: XCircle, color: 'bg-red-500', label: 'غائب' },
    EXCUSED: { icon: AlertCircle, color: 'bg-yellow-500', label: 'بعذر' }
  }

  return (
    <div className="space-y-6 text-right">
      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-green-50 rounded-lg border border-green-100 text-center">
          <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
          <span className="block text-2xl font-bold text-green-700">{stats.present}</span>
          <span className="text-xs text-green-600 uppercase font-semibold">حضور</span>
        </div>
        <div className="p-4 bg-red-50 rounded-lg border border-red-100 text-center">
          <XCircle className="w-8 h-8 mx-auto mb-2 text-red-600" />
          <span className="block text-2xl font-bold text-red-700">{stats.absent}</span>
          <span className="text-xs text-red-600 uppercase font-semibold">غياب</span>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100 text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
          <span className="block text-2xl font-bold text-yellow-700">{stats.excused}</span>
          <span className="text-xs text-yellow-600 uppercase font-semibold">بعذر</span>
        </div>
      </div>

      {/* Recent History List */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">السجل الحديث</h3>
        {history.length === 0 ? (
          <div className="py-8 text-center text-gray-400 italic">لا توجد سجلات حضور.</div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {history.slice(0, 30).map((record, idx) => {
              const config = statusConfig[record.status] || statusConfig.PRESENT
              const Icon = config.icon
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'p-2 rounded-full',
                        config.color.replace('bg-', 'bg-').replace('-500', '-100')
                      )}
                    >
                      <Icon className={cn('w-4 h-4', config.color.replace('bg-', 'text-'))} />
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-800">{config.label}</div>
                      {record.note && <div className="text-xs text-gray-500">{record.note}</div>}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 font-mono">
                    {new Date(record.date).toLocaleDateString('ar-EG', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
