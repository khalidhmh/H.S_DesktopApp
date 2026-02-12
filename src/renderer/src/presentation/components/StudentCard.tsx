import React from 'react'
import { Student } from '../types/student.types'
import { User, AlertCircle, Building2, MapPin } from 'lucide-react'
import { cn } from '@renderer/lib/utils'

interface StudentCardProps {
  student: Student
  onClick: (student: Student) => void
}

export const StudentCard: React.FC<StudentCardProps> = ({ student, onClick }) => {
  const statusColors = {
    regular: 'bg-blue-100 text-[#002147]',
    credit: 'bg-[#F2C94C] text-[#002147]', // Gold/Yellow
    expat: 'bg-green-100 text-green-800'
  }

  const statusLabels = {
    regular: 'عام', // or 'نظامي' as per request 'Regular' -> 'عام' (or 'نظامي'? The prompt said: Credit -> "ساعات معتمدة", Regular -> "عام", Expat -> "وافد")
    credit: 'ساعات معتمدة',
    expat: 'وافد'
  }

  return (
    <div
      onClick={() => onClick(student)}
      className="group relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-right"
    >
      {/* Top decorative bar - Red if penalties, else Navy */}
      <div className={cn('h-2 w-full', student.hasPenalties ? 'bg-red-500' : 'bg-[#002147]')} />

      <div className="p-4">
        {/* Header: Status Badge & Penalty Icon */}
        <div className="flex justify-between items-start mb-3">
          <span
            className={cn(
              'text-xs font-bold px-2.5 py-1 rounded-full',
              statusColors[student.status]
            )}
          >
            {statusLabels[student.status] || student.status}
          </span>

          <div className="flex space-x-1 space-x-reverse">
            {student.hasPenalties && (
              <div
                className="text-red-500 animate-pulse bg-red-50 p-1 rounded-full"
                title="عليه جزاءات"
              >
                <AlertCircle size={18} />
              </div>
            )}
            {student.exceededAbsence && (
              <div className="text-red-600 bg-red-100 px-2 py-0.5 rounded text-[10px] font-bold border border-red-200 flex items-center">
                تجاوز الغياب
              </div>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col items-center mb-4">
          <div className="relative">
            <img
              src={student.photo}
              alt={student.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md group-hover:border-[#F2C94C] transition-colors"
            />
          </div>
          <h3 className="mt-3 text-lg font-bold text-[#002147] text-center line-clamp-1">
            {student.name}
          </h3>
          <p className="text-sm text-gray-500 text-center">
            {student.college} • السنة {student.year}
          </p>
        </div>

        {/* Details Footer */}
        <div className="space-y-2 border-t border-gray-100 pt-3 text-sm text-gray-600">
          <div className="flex items-center justify-end group-hover:text-[#002147] transition-colors">
            <span dir="rtl">
              غرفة {student.roomNumber} - طابق {student.floor}
            </span>
            <Building2 size={16} className="ml-2 text-gray-400" />
          </div>
          <div className="flex items-center justify-end">
            <span>{student.governorate}</span>
            <MapPin size={16} className="ml-2 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  )
}
