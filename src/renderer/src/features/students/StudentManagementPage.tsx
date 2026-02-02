import React, { useState, useMemo } from 'react';
import { Search, Download, UserPlus } from 'lucide-react';
import { mockStudents, Student } from './data/mockStudents';
import { FilterSidebar } from './components/FilterSidebar';
import { StudentGrid } from './components/StudentGrid';
import { StudentProfileModal } from './components/profile/StudentProfileModal';

const StudentManagementPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBuildings, setSelectedBuildings] = useState<string[]>([]);
    const [selectedColleges, setSelectedColleges] = useState<string[]>([]);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    const toggleFilter = (
        item: string,
        current: string[],
        setter: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        setter(prev =>
            prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
        );
    };

    const clearAllFilters = () => {
        setSelectedBuildings([]);
        setSelectedColleges([]);
        setSelectedStatuses([]);
        setSearchQuery('');
    };

    const filteredStudents = useMemo(() => {
        return mockStudents.filter(student => {
            const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.nationalId.includes(searchQuery) ||
                student.roomNumber.includes(searchQuery);

            const matchesBuilding = selectedBuildings.length === 0 || true; // Placeholder

            const matchesCollege = selectedColleges.length === 0 || selectedColleges.includes(student.college);

            const statusMap: Record<string, string> = {
                'نظامي': 'regular',
                'ساعات معتمدة': 'credit',
                'وافد': 'expat',
                'عام': 'regular' // handling both just in case
            };

            const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.some(s => statusMap[s] === student.status);

            return matchesSearch && matchesBuilding && matchesCollege && matchesStatus;
        });
    }, [searchQuery, selectedBuildings, selectedColleges, selectedStatuses]);

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

                    {/* Optional: 'New Student' button if needed, though not explicitly requested in final action items, good for completeness */}
                    {/* <button className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-[#002147] hover:bg-[#003366] text-white font-semibold rounded-lg shadow-md transition-colors text-sm">
            <UserPlus size={18} />
            <span>طالب جديد</span>
          </button> */}
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
                    onClearAll={clearAllFilters}
                />

                {/* Directory Grid */}
                <main className="flex-1 overflow-y-auto bg-gray-50">
                    <StudentGrid
                        students={filteredStudents}
                        onStudentClick={setSelectedStudent}
                    />
                </main>
            </div>

            {/* Profile Modal */}
            {selectedStudent && (
                <StudentProfileModal
                    student={selectedStudent}
                    isOpen={!!selectedStudent}
                    onClose={() => setSelectedStudent(null)}
                />
            )}
        </div>
    );
};

export default StudentManagementPage;
