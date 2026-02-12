import React, { useEffect } from 'react'
import { Search, Download } from 'lucide-react'
import { FilterSidebar } from '../../components/FilterSidebar'
import { StudentGrid } from '../../components/StudentGrid'
import { StudentProfileModal } from '../../components/profile/StudentProfileModal'
import { Pagination } from '../../../components/ui/pagination'
import { useStudentStore } from '../../../viewmodels/useStudentStore'

const StudentManagementPage: React.FC = () => {
  const {
    students,
    fetchStudents,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedBuildings,
    setSelectedBuildings,
    selectedColleges,
    setSelectedColleges,
    selectedStatuses,
    setSelectedStatuses,
    clearFilters,
    currentPage,
    totalPages,
    setPage,
    totalItems,
    selectedStudent,
    selectStudent
  } = useStudentStore()

  // Fetch students on mount
  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  const toggleFilter = (
    item: string,
    current: string[],
    setter: (items: string[]) => void
  ) => {
    setter(current.includes(item) ? current.filter((i) => i !== item) : [...current, item])
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900 font-sans" dir="rtl">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm z-10">
        <div>
          <h1 className="text-2xl font-bold text-[#002147]">إدارة الطلاب</h1>
          <p className="text-xs text-gray-500 mt-1">عرض وإدارة بيانات الطلاب المقيمين</p>
        </div>

        <div className="flex items-center space-x-4 space-x-reverse flex-1 justify-end">
          <div className="relative w-96">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="بحث بالاسم، الغرفة، أو الرقم القومي..."
              className="w-full pr-10 pl-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#002147] focus:border-transparent outline-none transition-all placeholder:text-gray-400 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-[#F2C94C] hover:bg-[#E0B83B] text-[#002147] font-semibold rounded-lg shadow-md transition-colors text-sm">
            <Download size={18} />
            <span>تصدير Excel</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <FilterSidebar
          selectedBuildings={selectedBuildings}
          toggleBuilding={(b) => toggleFilter(b, selectedBuildings, setSelectedBuildings)}
          selectedColleges={selectedColleges}
          toggleCollege={(c) => toggleFilter(c, selectedColleges, setSelectedColleges)}
          selectedStatuses={selectedStatuses}
          toggleStatus={(s) => toggleFilter(s, selectedStatuses, setSelectedStatuses)}
          onClearAll={clearFilters}
        />

        {/* Directory Grid */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
          <StudentGrid students={students} isLoading={isLoading} onStudentClick={selectStudent} />

          {!isLoading && students.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-500">
                  عرض {students.length} من أصل {totalItems} طالب
                </p>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Profile Modal */}
      {selectedStudent && (
        <StudentProfileModal
          student={selectedStudent}
          isOpen={!!selectedStudent}
          onClose={() => selectStudent(null)}
        />
      )}
    </div>
  )
}

export default StudentManagementPage
