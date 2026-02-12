import React from 'react'
import { Users, Phone, User } from 'lucide-react'

interface GuardianInfoProps {
  student: any
}

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({
  icon,
  label,
  value
}) => (
  <div className="flex items-start p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow text-right">
    <div className="ml-4 mt-1 text-[#002147]">{icon}</div>
    <div className="flex-1">
      <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
        {label}
      </span>
      <span className="text-base text-[#002147] font-medium">{value || 'غير محدد'}</span>
    </div>
  </div>
)

export const GuardianInfo: React.FC<GuardianInfoProps> = ({ student }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InfoRow
        icon={<User size={20} />}
        label="اسم ولي الأمر"
        value={student.guardianName || 'غير محدد'}
      />
      <InfoRow
        icon={<Users size={20} />}
        label="صلة القرابة"
        value={student.guardianRelation || 'غير محدد'}
      />
      <InfoRow
        icon={<Phone size={20} />}
        label="رقم هاتف ولي الأمر"
        value={student.guardianPhone || 'غير محدد'}
      />

      {/* Extra field if available */}
      {student.emergencyContact && (
        <InfoRow icon={<Phone size={20} />} label="رقم الطوارئ" value={student.emergencyContact} />
      )}
    </div>
  )
}
