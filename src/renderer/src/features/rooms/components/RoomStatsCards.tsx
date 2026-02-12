import React from 'react'
import { Bed, Users, DoorOpen } from 'lucide-react'
import { Card, CardContent } from '@renderer/components/ui/card'

interface RoomStatsCardsProps {
  totalCapacity: number
  occupied: number
  free: number
}

export const RoomStatsCards: React.FC<RoomStatsCardsProps> = ({
  totalCapacity,
  occupied,
  free
}) => {
  const occupancyRate = totalCapacity > 0 ? Math.round((occupied / totalCapacity) * 100) : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Capacity Card */}
      <Card className="border-t-4 border-t-[#002147] hover:shadow-lg transition-shadow">
        <CardContent className="p-6 text-right">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-[#002147]/10 rounded-full">
              <Bed size={24} className="text-[#002147]" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">إجمالي الأسرّة</p>
              <h3 className="text-3xl font-bold text-[#002147]">{totalCapacity}</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Occupied Beds Card */}
      <Card className="border-t-4 border-t-green-500 hover:shadow-lg transition-shadow">
        <CardContent className="p-6 text-right">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-green-100 rounded-full">
              <Users size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">الأسرّة المشغولة</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold text-green-600">{occupied}</h3>
                <span className="text-sm font-semibold text-gray-400">({occupancyRate}%)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Free Beds Card */}
      <Card className="border-t-4 border-t-[#F2C94C] hover:shadow-lg transition-shadow">
        <CardContent className="p-6 text-right">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-[#F2C94C]/20 rounded-full">
              <DoorOpen size={24} className="text-[#F2C94C]" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">الأسرّة المتاحة</p>
              <h3 className="text-3xl font-bold text-[#F2C94C]">{free}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
