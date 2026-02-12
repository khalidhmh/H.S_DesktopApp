import React from 'react'
import { User, Phone, Mail, MapPin, Hash, Building, Bed } from 'lucide-react'

interface PersonalInfoProps {
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

export const PersonalInfo: React.FC<PersonalInfoProps> = ({ student }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InfoRow
        icon={<User size={20} />}
        label="الاسم بالكامل"
        value={student.name || student.fullName}
      />
      <InfoRow icon={<Hash size={20} />} label="الرقم القومي" value={student.nationalId} />
      <InfoRow icon={<Building size={20} />} label="الكلية" value={student.college} />
      <InfoRow icon={<Phone size={20} />} label="رقم الهاتف" value={student.phone} />
      <InfoRow icon={<Mail size={20} />} label="البريد الإلكتروني" value={student.email} />
      <InfoRow icon={<MapPin size={20} />} label="المحافظة" value={student.governorate} />
      <InfoRow
        icon={<Bed size={20} />}
        label="الغرفة"
        value={
          student.room ? `${student.room.building} - غرفة ${student.room.roomNumber}` : 'غير محدد'
        }
      />
      <InfoRow icon={<Hash size={20} />} label="الرقم الجامعي" value={student.universityId} />
    </div>
  )
}
