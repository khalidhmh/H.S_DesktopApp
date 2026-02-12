import React from 'react'
import { Filter, X, Layers, Home, Users } from 'lucide-react'
import { cn } from '@renderer/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'

interface RoomFilterSidebarProps {
  selectedFloor: string
  setSelectedFloor: (floor: string) => void
  selectedType: string
  setSelectedType: (type: string) => void
  selectedStatus: string
  setSelectedStatus: (status: string) => void
  onClearAll: () => void
}

export const RoomFilterSidebar: React.FC<RoomFilterSidebarProps> = ({
  selectedFloor,
  setSelectedFloor,
  selectedType,
  setSelectedType,
  selectedStatus,
  setSelectedStatus,
  onClearAll
}) => {
  const hasActiveFilters =
    selectedFloor !== 'ALL' || selectedType !== 'ALL' || selectedStatus !== 'ALL'

  return (
    <div className="w-72 bg-white border-l border-gray-100 h-full flex flex-col shadow-[rgba(0,0,15,0.05)_-5px_0px_15px_0px] z-20">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between text-[#002147] mb-2">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-[#F2C94C]" />
            <h2 className="text-lg font-bold">تصفية الغرف</h2>
          </div>
          {hasActiveFilters && (
            <button
              onClick={onClearAll}
              className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1 transition-colors bg-red-50 px-2 py-1 rounded-md"
            >
              <X size={12} />
              مسح الكل
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500">استخدم الفلاتر للبحث عن الغرف</p>
      </div>

      {/* Filters Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Floor Filter */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Layers size={16} className="text-[#002147]" />
            الطابق
          </label>
          <Select value={selectedFloor} onValueChange={setSelectedFloor} dir="rtl">
            <SelectTrigger className="w-full text-right bg-gray-50 border-gray-200 focus:ring-[#002147]">
              <SelectValue placeholder="كل الطوابق" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="ALL">كل الطوابق</SelectItem>
              <SelectItem value="1">الطابق الأول</SelectItem>
              <SelectItem value="2">الطابق الثاني</SelectItem>
              <SelectItem value="3">الطابق الثالث</SelectItem>
              <SelectItem value="4">الطابق الرابع</SelectItem>
              <SelectItem value="5">الطابق الخامس</SelectItem>
              <SelectItem value="6">الطابق السادس</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Room Type Filter */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Home size={16} className="text-[#002147]" />
            نوع الغرفة
          </label>
          <Select value={selectedType} onValueChange={setSelectedType} dir="rtl">
            <SelectTrigger className="w-full text-right bg-gray-50 border-gray-200 focus:ring-[#002147]">
              <SelectValue placeholder="جميع الأنواع" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="ALL">جميع الأنواع</SelectItem>
              <SelectItem value="SPECIAL">غرف مميزة</SelectItem>
              <SelectItem value="NORMAL">غرف عادية</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Users size={16} className="text-[#002147]" />
            حالة الإشغال
          </label>
          <Select value={selectedStatus} onValueChange={setSelectedStatus} dir="rtl">
            <SelectTrigger className="w-full text-right bg-gray-50 border-gray-200 focus:ring-[#002147]">
              <SelectValue placeholder="جميع الحالات" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="ALL">جميع الحالات</SelectItem>
              <SelectItem value="AVAILABLE">متاحة</SelectItem>
              <SelectItem value="FULL">ممتلئة</SelectItem>
              <SelectItem value="MAINTENANCE">تحت الصيانة</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <div className="text-xs text-center text-gray-400">يتم تحديث النتائج تلقائياً</div>
      </div>
    </div>
  )
}
