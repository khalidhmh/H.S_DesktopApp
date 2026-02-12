import React from 'react'
import { Bed, AlertCircle, Award } from 'lucide-react'
import { cn } from '@renderer/lib/utils'
import { Badge } from '@renderer/components/ui/badge'
import { Progress } from '@renderer/components/ui/progress'

interface RoomCardProps {
  room: {
    id: number
    roomNumber: string
    floor: number
    capacity: number
    currentCount: number
    type?: 'SPECIAL' | 'NORMAL'
    status: string
    students?: Array<{ id: number; name: string; fullName?: string }>
    faults?: any[]
  }
  onBedClick?: (roomId: number, bedIndex: number) => void
  onClick?: () => void
}

// Helper to determine room type from room number
const getRoomType = (roomNumber: string): 'SPECIAL' | 'NORMAL' => {
  const num = parseInt(roomNumber)
  // Rooms ending in 01-10 on each floor are considered special
  const lastDigit = num % 100
  return lastDigit >= 1 && lastDigit <= 10 ? 'SPECIAL' : 'NORMAL'
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onBedClick, onClick }) => {
  const roomType = room.type || getRoomType(room.roomNumber)
  const isSpecial = roomType === 'SPECIAL'
  const isMaintenance = room.status === 'MAINTENANCE'
  const isFull = room.currentCount >= room.capacity
  const hasFaults = room.faults && room.faults.length > 0

  // Determine status color
  let statusColor = 'bg-green-500'
  let statusText = 'متاحة'
  let statusVariant: 'default' | 'destructive' | 'outline' = 'default'

  if (isMaintenance || hasFaults) {
    statusColor = 'bg-orange-500'
    statusText = 'صيانة'
    statusVariant = 'outline'
  } else if (isFull) {
    statusColor = 'bg-red-500'
    statusText = 'ممتلئة'
    statusVariant = 'destructive'
  }

  const occupancyPercentage = Math.min((room.currentCount / room.capacity) * 100, 100)

  // Create bed array
  const beds = Array.from({ length: room.capacity }, (_, i) => {
    const student = room.students?.[i]
    return {
      index: i,
      occupied: i < room.currentCount,
      student
    }
  })

  return (
    <div
      className={cn(
        'bg-white rounded-lg border-2 p-4 transition-all hover:shadow-lg cursor-pointer relative overflow-hidden',
        isSpecial ? 'border-[#F2C94C]' : 'border-gray-200',
        'hover:border-[#002147]'
      )}
      onClick={onClick}
    >
      {/* Top Border Accent */}
      <div className={cn('absolute top-0 left-0 right-0 h-1', statusColor)} />

      {/* Header */}
      <div className="flex justify-between items-start mb-3 mt-1">
        <div className="text-right">
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-bold text-[#002147]">غرفة {room.roomNumber}</h3>
            {isSpecial && <Award size={20} className="text-[#F2C94C]" />}
          </div>
          <p className="text-sm text-gray-500">الطابق {room.floor}</p>
        </div>

        {/* Status Badge */}
        <Badge
          variant={statusVariant}
          className={cn(
            statusVariant === 'outline' && 'border-orange-500 text-orange-700 bg-orange-50',
            statusVariant === 'default' && !isMaintenance && 'bg-green-600'
          )}
        >
          {statusText}
        </Badge>
      </div>

      {/* Type Badge */}
      {isSpecial && (
        <div className="mb-3">
          <Badge variant="outline" className="border-[#F2C94C] text-[#F2C94C] bg-[#F2C94C]/10">
            غرفة مميزة
          </Badge>
        </div>
      )}

      {/* Bed Visualizer */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">الأسرّة</span>
          <span className="text-xs text-gray-500">
            {room.currentCount} / {room.capacity}
          </span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {beds.map((bed) => (
            <div
              key={bed.index}
              className={cn('relative group', !bed.occupied && 'cursor-pointer')}
              onClick={(e) => {
                if (!bed.occupied && onBedClick) {
                  e.stopPropagation()
                  onBedClick(room.id, bed.index)
                }
              }}
              title={bed.student ? bed.student.name || bed.student.fullName || 'طالب' : 'سرير فارغ'}
            >
              {bed.occupied ? (
                // Occupied bed - filled green circle
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white shadow-sm">
                  <Bed size={20} />
                </div>
              ) : (
                // Empty bed - dashed circle
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-300 hover:border-[#002147] hover:text-[#002147] transition-colors">
                  <Bed size={20} />
                </div>
              )}

              {/* Tooltip on hover */}
              {bed.student && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  {bed.student.name || bed.student.fullName}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-500">
          <span>نسبة الإشغال</span>
          <span className="font-semibold">{Math.round(occupancyPercentage)}%</span>
        </div>
        <Progress value={occupancyPercentage} className="h-2" />
      </div>

      {/* Fault Indicator */}
      {hasFaults && (
        <div className="mt-3 flex items-center gap-1 text-xs text-orange-600">
          <AlertCircle size={14} />
          <span>يوجد {room.faults?.length} بلاغ صيانة</span>
        </div>
      )}
    </div>
  )
}
