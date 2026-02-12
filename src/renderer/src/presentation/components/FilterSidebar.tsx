import React from 'react'
import { Filter, X, Layers, School, UserCircle, Check } from 'lucide-react'
import { cn } from '@renderer/lib/utils'

interface FilterSidebarProps {
  selectedBuildings: string[]
  toggleBuilding: (building: string) => void
  selectedColleges: string[]
  toggleCollege: (college: string) => void
  selectedStatuses: string[]
  toggleStatus: (status: string) => void
  onClearAll: () => void
}

const FilterSection = ({
  title,
  icon: Icon,
  options,
  selected,
  onToggle
}: {
  title: string;
  icon: any;
  options: { value: string; label: string }[];
  selected: string[];
  onToggle: (val: string) => void
}) => (
  <div className="space-y-3">
    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
      <Icon size={16} className="text-[#002147]" />
      {title}
    </label>
    <div className="space-y-2">
      {options.map((opt) => {
        const isSelected = selected.includes(opt.value)
        return (
          <div
            key={opt.value}
            onClick={() => onToggle(opt.value)}
            className={cn(
              "flex items-center justify-between p-2 rounded-md cursor-pointer text-sm transition-colors border",
              isSelected
                ? "bg-[#002147]/5 border-[#002147]/20 text-[#002147] font-medium"
                : "bg-white border-gray-100 text-gray-600 hover:bg-gray-50"
            )}
          >
            <span>{opt.label}</span>
            {isSelected && <Check size={14} className="text-[#002147]" />}
          </div>
        )
      })}
    </div>
  </div>
)

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  selectedBuildings,
  toggleBuilding,
  selectedColleges,
  toggleCollege,
  selectedStatuses,
  toggleStatus,
  onClearAll
}) => {
  const hasActiveFilters =
    selectedBuildings.length > 0 ||
    selectedColleges.length > 0 ||
    selectedStatuses.length > 0

  const buildings = [
    { value: 'أ', label: 'المبنى أ' },
    { value: 'ب', label: 'المبنى ب' },
    { value: 'ج', label: 'المبنى ج' },
    { value: 'د', label: 'المبنى د' },
  ]

  const colleges = [
    { value: 'Engineering', label: 'الهندسة' },
    { value: 'Medicine', label: 'الطب البشري' },
    { value: 'Computers', label: 'حاسبات ومعلومات' },
    { value: 'Science', label: 'العلوم' },
    { value: 'Commerce', label: 'التجارة' },
    { value: 'Arts', label: 'الآداب' },
    { value: 'Law', label: 'الحقوق' },
  ]

  const statuses = [
    { value: 'regular', label: 'حكومي (عام)' },
    { value: 'credit', label: '(كريديت) ساعات معتمدة' },
    { value: 'expat', label: 'وافد' },
  ]

  return (
    <div className="w-72 bg-white border-l border-gray-100 h-full flex flex-col shadow-[rgba(0,0,15,0.05)_-5px_0px_15px_0px] z-20">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between text-[#002147] mb-2">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-[#F2C94C]" />
            <h2 className="text-lg font-bold">تصفية النتائج</h2>
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
        <p className="text-xs text-gray-500">استخدم الفلاتر للوصول السريع للطلاب</p>
      </div>

      {/* Filters Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <FilterSection
          title="المبنى"
          icon={Layers}
          options={buildings}
          selected={selectedBuildings}
          onToggle={toggleBuilding}
        />
        <FilterSection
          title="الكلية"
          icon={School}
          options={colleges}
          selected={selectedColleges}
          onToggle={toggleCollege}
        />
        <FilterSection
          title="نوع القيد"
          icon={UserCircle}
          options={statuses}
          selected={selectedStatuses}
          onToggle={toggleStatus}
        />
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <div className="text-xs text-center text-gray-400">يتم تحديث النتائج تلقائياً</div>
      </div>
    </div>
  )
}
