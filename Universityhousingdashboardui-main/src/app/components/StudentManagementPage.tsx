import { useState } from 'react';
import { Search, Download, ChevronDown, ChevronUp, X } from 'lucide-react';
import { StudentProfileModal } from '@/app/components/StudentProfileModal';

export type StudentStatus = 'credit' | 'regular' | 'expat';

export interface Student {
  id: string;
  name: string;
  photo: string;
  college: string;
  year: number;
  roomNumber: string;
  floor: number;
  governorate: string;
  status: StudentStatus;
  nationalId: string;
  phone: string;
  email: string;
  hasPenalties: boolean;
  exceededAbsence: boolean;
  guardianName: string;
  guardianPhone: string;
  guardianRelation: string;
  absenceCount: number;
  penaltyCount: number;
}

// Mock data
const colleges = ['الهندسة', 'الطب', 'العلوم', 'الآداب', 'التجارة', 'الحقوق', 'الصيدلة'];
const governorates = ['القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'الشرقية', 'المنوفية', 'القليوبية'];

const mockStudents: Student[] = [
  {
    id: '1',
    name: 'أحمد محمد علي',
    photo: 'https://images.unsplash.com/photo-1600178572204-6ac8886aae63?w=400',
    college: 'الهندسة',
    year: 3,
    roomNumber: '301',
    floor: 3,
    governorate: 'القاهرة',
    status: 'regular',
    nationalId: '30012345678901',
    phone: '01012345678',
    email: 'ahmed.mohamed@university.edu',
    hasPenalties: false,
    exceededAbsence: false,
    guardianName: 'محمد علي حسن',
    guardianPhone: '01098765432',
    guardianRelation: 'والد',
    absenceCount: 2,
    penaltyCount: 0,
  },
  {
    id: '2',
    name: 'محمد أحمد سعد',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    college: 'الطب',
    year: 2,
    roomNumber: '205',
    floor: 2,
    governorate: 'الجيزة',
    status: 'credit',
    nationalId: '30112345678902',
    phone: '01123456789',
    email: 'mohamed.ahmed@university.edu',
    hasPenalties: true,
    exceededAbsence: false,
    guardianName: 'أحمد سعد محمود',
    guardianPhone: '01187654321',
    guardianRelation: 'والد',
    absenceCount: 5,
    penaltyCount: 2,
  },
  {
    id: '3',
    name: 'خالد يوسف عبدالله',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    college: 'العلوم',
    year: 1,
    roomNumber: '102',
    floor: 1,
    governorate: 'الإسكندرية',
    status: 'expat',
    nationalId: '30212345678903',
    phone: '01234567890',
    email: 'khaled.youssef@university.edu',
    hasPenalties: false,
    exceededAbsence: true,
    guardianName: 'يوسف عبدالله إبراهيم',
    guardianPhone: '01276543210',
    guardianRelation: 'والد',
    absenceCount: 12,
    penaltyCount: 0,
  },
  {
    id: '4',
    name: 'عمر حسن محمود',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    college: 'الآداب',
    year: 4,
    roomNumber: '408',
    floor: 4,
    governorate: 'الدقهلية',
    status: 'regular',
    nationalId: '30312345678904',
    phone: '01098765433',
    email: 'omar.hassan@university.edu',
    hasPenalties: true,
    exceededAbsence: true,
    guardianName: 'حسن محمود أحمد',
    guardianPhone: '01165432109',
    guardianRelation: 'والد',
    absenceCount: 15,
    penaltyCount: 3,
  },
  {
    id: '5',
    name: 'سعد الدين محمد',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
    college: 'التجارة',
    year: 2,
    roomNumber: '215',
    floor: 2,
    governorate: 'القاهرة',
    status: 'regular',
    nationalId: '30412345678905',
    phone: '01187654322',
    email: 'saad.aldeen@university.edu',
    hasPenalties: false,
    exceededAbsence: false,
    guardianName: 'الدين محمد علي',
    guardianPhone: '01254321098',
    guardianRelation: 'والد',
    absenceCount: 1,
    penaltyCount: 0,
  },
  {
    id: '6',
    name: 'يوسف عبدالرحمن',
    photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400',
    college: 'الحقوق',
    year: 3,
    roomNumber: '312',
    floor: 3,
    governorate: 'الشرقية',
    status: 'credit',
    nationalId: '30512345678906',
    phone: '01276543211',
    email: 'youssef.abdulrahman@university.edu',
    hasPenalties: false,
    exceededAbsence: false,
    guardianName: 'عبدالرحمن أحمد',
    guardianPhone: '01343210987',
    guardianRelation: 'والد',
    absenceCount: 3,
    penaltyCount: 0,
  },
  {
    id: '7',
    name: 'إبراهيم خالد سعد',
    photo: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400',
    college: 'الصيدلة',
    year: 1,
    roomNumber: '105',
    floor: 1,
    governorate: 'المنوفية',
    status: 'regular',
    nationalId: '30612345678907',
    phone: '01365432100',
    email: 'ibrahim.khaled@university.edu',
    hasPenalties: true,
    exceededAbsence: false,
    guardianName: 'خالد سعد محمد',
    guardianPhone: '01432109876',
    guardianRelation: 'والد',
    absenceCount: 7,
    penaltyCount: 1,
  },
  {
    id: '8',
    name: 'عبدالله محمود أحمد',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    college: 'الهندسة',
    year: 4,
    roomNumber: '405',
    floor: 4,
    governorate: 'القليوبية',
    status: 'expat',
    nationalId: '30712345678908',
    phone: '01454321099',
    email: 'abdullah.mahmoud@university.edu',
    hasPenalties: false,
    exceededAbsence: false,
    guardianName: 'محمود أحمد حسن',
    guardianPhone: '01521098765',
    guardianRelation: 'والد',
    absenceCount: 0,
    penaltyCount: 0,
  },
];

export function StudentManagementPage() {
  const [students] = useState<Student[]>(mockStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  
  // Filter states
  const [selectedFloors, setSelectedFloors] = useState<number[]>([]);
  const [selectedColleges, setSelectedColleges] = useState<string[]>([]);
  const [selectedGovernorates, setSelectedGovernorates] = useState<string[]>([]);
  const [filterHasPenalties, setFilterHasPenalties] = useState(false);
  const [filterExceededAbsence, setFilterExceededAbsence] = useState(false);

  // Filter logic
  const filteredStudents = students.filter((student) => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.roomNumber.includes(searchQuery) ||
      student.nationalId.includes(searchQuery);
    
    const matchesFloor = selectedFloors.length === 0 || selectedFloors.includes(student.floor);
    const matchesCollege = selectedColleges.length === 0 || selectedColleges.includes(student.college);
    const matchesGovernorate = selectedGovernorates.length === 0 || selectedGovernorates.includes(student.governorate);
    const matchesPenalties = !filterHasPenalties || student.hasPenalties;
    const matchesAbsence = !filterExceededAbsence || student.exceededAbsence;

    return matchesSearch && matchesFloor && matchesCollege && matchesGovernorate && matchesPenalties && matchesAbsence;
  });

  const toggleFloor = (floor: number) => {
    setSelectedFloors((prev) =>
      prev.includes(floor) ? prev.filter((f) => f !== floor) : [...prev, floor]
    );
  };

  const toggleCollege = (college: string) => {
    setSelectedColleges((prev) =>
      prev.includes(college) ? prev.filter((c) => c !== college) : [...prev, college]
    );
  };

  const toggleGovernorate = (gov: string) => {
    setSelectedGovernorates((prev) =>
      prev.includes(gov) ? prev.filter((g) => g !== gov) : [...prev, gov]
    );
  };

  const clearFilters = () => {
    setSelectedFloors([]);
    setSelectedColleges([]);
    setSelectedGovernorates([]);
    setFilterHasPenalties(false);
    setFilterExceededAbsence(false);
  };

  const activeFilterCount = 
    selectedFloors.length + 
    selectedColleges.length + 
    selectedGovernorates.length + 
    (filterHasPenalties ? 1 : 0) + 
    (filterExceededAbsence ? 1 : 0);

  const handleExportExcel = () => {
    // Mock export functionality
    alert('جاري تصدير البيانات إلى Excel...');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold text-[#002147] mb-1">
              إدارة الطلاب
            </h1>
            <p className="text-gray-600 text-sm">
              عرض وإدارة بيانات الطلاب المقيمين
            </p>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExportExcel}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-md hover:shadow-lg"
          >
            <Download size={20} />
            <span>تصدير إلى Excel</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-6 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="البحث بالاسم، رقم الغرفة، أو الرقم القومي..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#F2C94C] transition-colors"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <span>الفلاتر</span>
            {activeFilterCount > 0 && (
              <span className="bg-[#F2C94C] text-[#002147] text-xs font-bold px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
            {showFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600">
          عرض {filteredStudents.length} من {students.length} طالب
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters */}
        {showFilters && (
          <div className="w-80 space-y-4">
            {/* Filter Header */}
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#002147]">تصفية النتائج</h3>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <X size={16} />
                    <span>مسح الكل</span>
                  </button>
                )}
              </div>

              {/* Floor Filter */}
              <div className="mb-4 pb-4 border-b">
                <h4 className="text-sm font-bold text-gray-700 mb-2">الطابق</h4>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5, 6].map((floor) => (
                    <label key={floor} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={selectedFloors.includes(floor)}
                        onChange={() => toggleFloor(floor)}
                        className="w-4 h-4 text-[#F2C94C] border-gray-300 rounded focus:ring-[#F2C94C]"
                      />
                      <span className="text-sm">الطابق {floor}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* College Filter */}
              <div className="mb-4 pb-4 border-b">
                <h4 className="text-sm font-bold text-gray-700 mb-2">الكلية</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {colleges.map((college) => (
                    <label key={college} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={selectedColleges.includes(college)}
                        onChange={() => toggleCollege(college)}
                        className="w-4 h-4 text-[#F2C94C] border-gray-300 rounded focus:ring-[#F2C94C]"
                      />
                      <span className="text-sm">{college}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Governorate Filter */}
              <div className="mb-4 pb-4 border-b">
                <h4 className="text-sm font-bold text-gray-700 mb-2">المحافظة</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {governorates.map((gov) => (
                    <label key={gov} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={selectedGovernorates.includes(gov)}
                        onChange={() => toggleGovernorate(gov)}
                        className="w-4 h-4 text-[#F2C94C] border-gray-300 rounded focus:ring-[#F2C94C]"
                      />
                      <span className="text-sm">{gov}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Special Filters */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={filterHasPenalties}
                    onChange={(e) => setFilterHasPenalties(e.target.checked)}
                    className="w-4 h-4 text-[#F2C94C] border-gray-300 rounded focus:ring-[#F2C94C]"
                  />
                  <span className="text-sm">لديه جزاءات</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={filterExceededAbsence}
                    onChange={(e) => setFilterExceededAbsence(e.target.checked)}
                    className="w-4 h-4 text-[#F2C94C] border-gray-300 rounded focus:ring-[#F2C94C]"
                  />
                  <span className="text-sm">تجاوز حد الغياب</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Student Cards Grid */}
        <div className="flex-1">
          {filteredStudents.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <p className="text-gray-500">لا توجد نتائج مطابقة للبحث</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStudents.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  onClick={() => setSelectedStudent(student)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Student Profile Modal */}
      {selectedStudent && (
        <StudentProfileModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
}

interface StudentCardProps {
  student: Student;
  onClick: () => void;
}

function StudentCard({ student, onClick }: StudentCardProps) {
  const statusConfig = {
    credit: { label: 'انتظام', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    regular: { label: 'عادي', color: 'bg-green-100 text-green-700 border-green-200' },
    expat: { label: 'وافد', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  };

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-[#F2C94C] overflow-hidden text-right group"
    >
      {/* Photo */}
      <div className="h-48 bg-gray-200 overflow-hidden">
        <img
          src={student.photo}
          alt={student.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Name and Status */}
        <div>
          <h3 className="font-bold text-[#002147] text-lg mb-2">{student.name}</h3>
          <span className={`text-xs px-3 py-1 rounded-full border inline-block ${statusConfig[student.status].color}`}>
            {statusConfig[student.status].label}
          </span>
        </div>

        {/* Info */}
        <div className="space-y-1 text-sm text-gray-600">
          <p>
            <span className="font-medium">الكلية:</span> {student.college}
          </p>
          <p>
            <span className="font-medium">السنة:</span> المستوى {student.year}
          </p>
          <p>
            <span className="font-medium">الغرفة:</span> {student.roomNumber}
          </p>
        </div>

        {/* Warnings */}
        {(student.hasPenalties || student.exceededAbsence) && (
          <div className="flex items-center gap-2 pt-2 border-t">
            {student.hasPenalties && (
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded border border-red-200">
                لديه جزاءات
              </span>
            )}
            {student.exceededAbsence && (
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded border border-orange-200">
                تجاوز الغياب
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
}
