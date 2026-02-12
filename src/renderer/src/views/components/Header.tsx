import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Bell, Search, User, BedDouble, AlertCircle } from 'lucide-react'
import { useGlobalSearch } from '../../hooks/useGlobalSearch'
import { StudentDetailModal } from '../components/modals/StudentDetailModal'

export const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const { results, loading } = useGlobalSearch(query)
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  // Student Detail Modal State inside Header to be globally accessible
  const [selectedStudent, setSelectedStudent] = useState<any>(null)

  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/':
        return 'لوحة التحكم'
      case '/students':
        return 'إدارة الطلاب'
      case '/rooms':
        return 'إدارة الغرف'
      case '/reports':
        return 'التقارير'
      case '/settings':
        return 'الإعدادات'
      case '/attendance':
        return 'التمام اليومي'
      case '/complaints':
        return 'الشكاوى'
      case '/maintenance':
        return 'طلبات الصيانة'
      case '/penalties':
        return 'المخالفات'
      default:
        return 'نظام المدن الجامعية'
    }
  }

  const handleStudentClick = (student: any) => {
    setSelectedStudent(student)
    setIsSearchFocused(false)
    setQuery('')
  }

  const handleRoomClick = (room: any) => {
    navigate('/rooms')
    // Ideally we would pass state to highlight the room, but simple nav is okay for first version
    setIsSearchFocused(false)
    setQuery('')
  }

  return (
    <>
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
        <h2 className="text-xl font-bold text-[#1e1b4b]">{getPageTitle(location.pathname)}</h2>

        <div className="flex items-center gap-4">
          <div ref={searchRef} className="relative hidden md:block">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="بحث شامل (طلاب، غرف)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              className="pr-10 pl-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b]/20 w-80 transition-all"
            />

            {/* Search Dropdown */}
            {isSearchFocused && query.length >= 2 && (
              <div className="absolute top-full mt-2 right-0 w-96 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
                {loading ? (
                  <div className="p-4 text-center text-gray-500 text-sm">جاري البحث...</div>
                ) : results.students.length === 0 && results.rooms.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">لا توجد نتائج</div>
                ) : (
                  <div className="max-h-[400px] overflow-y-auto">
                    {results.students.length > 0 && (
                      <div className="p-2">
                        <h3 className="text-xs font-bold text-gray-400 mb-2 px-2">الطلاب</h3>
                        {results.students.map((student) => (
                          <div
                            key={student.id}
                            onClick={() => handleStudentClick(student)}
                            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer group"
                          >
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                              <User size={14} />
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-sm font-medium text-gray-700 group-hover:text-primary truncate">
                                {student.name}
                              </p>
                              <p className="text-xs text-gray-400 truncate">
                                {student.universityId} •{' '}
                                {student.room ? `غرفة ${student.room.roomNumber}` : 'غير مسكن'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {results.students.length > 0 && results.rooms.length > 0 && (
                      <div className="border-t border-gray-100 mx-2" />
                    )}

                    {results.rooms.length > 0 && (
                      <div className="p-2">
                        <h3 className="text-xs font-bold text-gray-400 mb-2 px-2 mt-1">الغرف</h3>
                        {results.rooms.map((room) => (
                          <div
                            key={room.id}
                            onClick={() => handleRoomClick(room)}
                            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer group"
                          >
                            <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                              <BedDouble size={14} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700 group-hover:text-primary">
                                غرفة {room.roomNumber}
                              </p>
                              <p className="text-xs text-gray-400">{room.building}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <button className="relative p-2 text-gray-500 hover:text-[#1e1b4b] transition-colors rounded-full hover:bg-gray-100">
            <Bell size={20} />
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
        </div>
      </header>

      {/* Global Student Modal */}
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </>
  )
}
