import React, { useEffect, useState } from 'react'
import { PenaltyService } from '@renderer/services/penalty.service'
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react'
import { cn } from '@renderer/lib/utils'
import { logger } from '@shared/utils/logger'

interface PenaltiesListProps {
  studentId: number
}

export const PenaltiesList: React.FC<PenaltiesListProps> = ({ studentId }) => {
  const [penalties, setPenalties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPenalties = async () => {
      try {
        const data = await PenaltyService.getPenaltiesByStudent(studentId)
        setPenalties(data)
      } catch (error) {
        logger.error('Failed to fetch penalties:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPenalties()
  }, [studentId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#002147]" />
      </div>
    )
  }

  if (penalties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <CheckCircle2 size={48} className="mb-4 text-green-300" />
        <p className="text-lg">لا توجد جزاءات مسجلة. حالة الطالب ممتازة!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 text-right">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase">
          إجمالي الجزاءات: {penalties.length}
        </h3>
      </div>

      {penalties.map((penalty) => (
        <div
          key={penalty.id}
          className="flex items-start p-4 rounded-lg border-r-4 border-red-500 shadow-sm bg-red-50 transition-all hover:shadow-md"
        >
          <div className="text-red-500 mt-1 ml-4">
            <AlertTriangle size={24} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-lg text-red-700">{penalty.type || 'جزاء'}</h4>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock size={12} />
                {new Date(penalty.date).toLocaleDateString('ar-EG', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{penalty.reason}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
