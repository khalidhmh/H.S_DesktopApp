import React from 'react'
import { Student } from '../../data/mockStudents'
import { Trophy, BookOpen, Users } from 'lucide-react'

interface ActivitiesListProps {
  student: Student
}

export const ActivitiesList: React.FC<ActivitiesListProps> = ({ student }) => {
  const activities = student.activities || []

  const getIcon = (type: string) => {
    switch (type) {
      case 'sports':
        return <Trophy className="w-6 h-6 text-orange-500" />
      case 'cultural':
        return <BookOpen className="w-6 h-6 text-purple-500" />
      case 'social':
        return <Users className="w-6 h-6 text-blue-500" />
      default:
        return <Trophy className="w-6 h-6 text-gray-500" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'sports':
        return 'رياضي'
      case 'cultural':
        return 'ثقافي'
      case 'social':
        return 'اجتماعي'
      default:
        return type
    }
  }

  if (activities.length === 0) {
    return <div className="text-center py-12 text-gray-400 italic">لا توجد أنشطة مسجلة.</div>
  }

  return (
    <div className="grid grid-cols-1 gap-4 text-right">
      {activities.map((activity, idx) => (
        <div
          key={idx}
          className="flex items-center p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="p-3 bg-gray-50 rounded-full ml-4">{getIcon(activity.type)}</div>
          <div>
            <h4 className="font-bold text-[#002147]">{activity.name}</h4>
            <div className="flex items-center space-x-2 space-x-reverse mt-1">
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {getTypeLabel(activity.type)}
              </span>
              <span className="text-xs text-gray-400">{activity.date}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
