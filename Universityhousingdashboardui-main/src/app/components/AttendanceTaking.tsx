import { useState, useEffect } from 'react';
import { Clock, ChevronDown, UtensilsCrossed } from 'lucide-react';
import { MealHeadcountModal } from '@/app/components/MealHeadcountModal';

// Mock data for rooms and students
const mockRoomData = {
  1: generateFloorRooms(1),
  2: generateFloorRooms(2),
  3: generateFloorRooms(3),
  4: generateFloorRooms(4),
  5: generateFloorRooms(5),
  6: generateFloorRooms(6),
};

function generateFloorRooms(floor: number) {
  const wings = {
    'شمال A': generateWingRooms(floor, 'A', 0),
    'غرب B': generateWingRooms(floor, 'B', 10),
    'جنوب C': generateWingRooms(floor, 'C', 20),
    'شرق D': generateWingRooms(floor, 'D', 30),
  };
  return wings;
}

function generateWingRooms(floor: number, wing: string, offset: number) {
  const rooms = [];
  for (let i = 1; i <= 8; i++) {
    const roomNumber = `${floor}${String(offset + i).padStart(2, '0')}`;
    const studentCount = Math.floor(Math.random() * 3) + 2; // 2-4 students per room
    const students = [];
    
    for (let j = 0; j < studentCount; j++) {
      // Randomly assign status for demo purposes - 70% present, 20% absent, 10% unchecked
      const rand = Math.random();
      let status: boolean | null;
      if (rand < 0.7) {
        status = true; // Present
      } else if (rand < 0.9) {
        status = false; // Absent
      } else {
        status = null; // Unchecked
      }
      
      students.push({
        id: `${roomNumber}-${j}`,
        name: `طالب ${String.fromCharCode(65 + j)} - غرفة ${roomNumber}`,
        studentId: `${20230000 + parseInt(roomNumber) * 10 + j}`,
        status: status,
      });
    }
    
    rooms.push({
      roomNumber,
      students,
    });
  }
  return rooms;
}

type Room = {
  roomNumber: string;
  students: Array<{
    id: string;
    name: string;
    studentId: string;
    status: boolean | null;
  }>;
};

type WingRooms = Room[];

export function AttendanceTaking() {
  const [selectedFloor, setSelectedFloor] = useState(3);
  const [expandedRoom, setExpandedRoom] = useState<string | null>(null);
  const [roomsData, setRoomsData] = useState<Record<string, WingRooms>>(
    mockRoomData[selectedFloor as keyof typeof mockRoomData]
  );
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 1,
    minutes: 30,
    seconds: 0,
  });
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Update rooms data when floor changes
  useEffect(() => {
    setRoomsData(mockRoomData[selectedFloor as keyof typeof mockRoomData]);
    setExpandedRoom(null);
  }, [selectedFloor]);

  const handleFloorChange = (floor: number) => {
    setSelectedFloor(floor);
  };

  const toggleStudentAttendance = (
    wing: string,
    roomIndex: number,
    studentId: string
  ) => {
    setRoomsData((prev) => {
      const newData = { ...prev };
      const room = newData[wing][roomIndex];
      const student = room.students.find((s) => s.id === studentId);
      if (student) {
        // Toggle: null -> true -> false -> null
        if (student.status === null) {
          student.status = true;
        } else if (student.status === true) {
          student.status = false;
        } else {
          student.status = null;
        }
      }
      return newData;
    });
  };

  const getRoomStatus = (room: Room) => {
    const checkedStudents = room.students.filter((s) => s.status !== null);
    const presentStudents = room.students.filter((s) => s.status === true);

    if (checkedStudents.length === 0) {
      return 'unchecked'; // Grey
    } else if (presentStudents.length === room.students.length) {
      return 'full'; // Green
    } else {
      return 'partial'; // Yellow
    }
  };

  const getRoomStatusColor = (status: string) => {
    switch (status) {
      case 'full':
        return 'bg-green-500 border-green-600';
      case 'partial':
        return 'bg-yellow-500 border-yellow-600';
      case 'unchecked':
      default:
        return 'bg-gray-300 border-gray-400';
    }
  };

  const wings = Object.keys(roomsData);

  // Gather all students data from all floors for meal report
  const getAllStudentsData = () => {
    const colleges = [
      'كلية الهندسة',
      'كلية الطب',
      'كلية العلوم',
      'كلية الآداب',
      'كلية إدارة الأعمال',
      'كلية الحاسبات',
    ];
    
    const allStudents = [];
    
    // Iterate through all floors
    for (let floor = 1; floor <= 6; floor++) {
      const floorData = mockRoomData[floor as keyof typeof mockRoomData];
      
      Object.entries(floorData).forEach(([wing, rooms]) => {
        rooms.forEach((room) => {
          room.students.forEach((student) => {
            allStudents.push({
              ...student,
              roomNumber: room.roomNumber,
              floor: floor,
              college: colleges[Math.floor(Math.random() * colleges.length)],
              mealType: Math.random() > 0.85 ? 'Special' : 'Regular', // 15% special meals
            });
          });
        });
      });
    }
    
    return allStudents;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold text-[#002147] mb-1">
              أخذ الحضور
            </h1>
            <p className="text-gray-600 text-sm">
              تسجيل حضور الطلاب في المبنى السكني
            </p>
          </div>

          {/* Floor Selector */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">
              اختر الطابق:
            </label>
            <div className="relative">
              <select
                value={selectedFloor}
                onChange={(e) => handleFloorChange(Number(e.target.value))}
                className="appearance-none bg-white border-2 border-gray-200 rounded-lg px-6 py-2.5 pl-10 pr-4 text-[#002147] font-medium focus:outline-none focus:border-[#F2C94C] cursor-pointer min-w-[120px]"
              >
                {[1, 2, 3, 4, 5, 6].map((floor) => (
                  <option key={floor} value={floor}>
                    الطابق {floor}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={20}
              />
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="bg-gradient-to-r from-[#002147] to-[#003366] text-white rounded-xl px-6 py-3 flex items-center gap-3">
            <Clock size={24} />
            <div>
              <p className="text-xs opacity-90 mb-0.5">فترة أخذ الحضور</p>
              <p className="text-lg font-bold font-mono">
                {String(timeRemaining.hours).padStart(2, '0')}:
                {String(timeRemaining.minutes).padStart(2, '0')}:
                {String(timeRemaining.seconds).padStart(2, '0')}
              </p>
              <p className="text-xs opacity-75">11:00 م - 12:30 ص</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floor Plan Grid */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="grid grid-cols-2 gap-6">
          {wings.map((wing, wingIndex) => (
            <div
              key={wing}
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200"
            >
              {/* Wing Header */}
              <div className="mb-4 pb-3 border-b-2 border-[#002147]">
                <h3 className="text-lg font-bold text-[#002147] flex items-center gap-2">
                  <span className="w-8 h-8 bg-[#F2C94C] rounded-lg flex items-center justify-center text-sm">
                    {wing.charAt(wing.length - 1)}
                  </span>
                  {wing}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {roomsData[wing].length} غرفة
                </p>
              </div>

              {/* Rooms Grid */}
              <div className="grid grid-cols-4 gap-3">
                {roomsData[wing].map((room, roomIndex) => {
                  const status = getRoomStatus(room);
                  const isExpanded = expandedRoom === room.roomNumber;

                  return (
                    <div
                      key={room.roomNumber}
                      className={`relative ${
                        isExpanded ? 'col-span-4' : 'col-span-1'
                      }`}
                    >
                      {/* Room Card */}
                      <button
                        onClick={() =>
                          setExpandedRoom(
                            isExpanded ? null : room.roomNumber
                          )
                        }
                        className={`w-full aspect-square rounded-lg border-2 ${getRoomStatusColor(
                          status
                        )} hover:scale-105 transition-all shadow-md hover:shadow-lg flex flex-col items-center justify-center gap-1 ${
                          isExpanded ? 'h-auto aspect-auto p-4' : ''
                        }`}
                      >
                        <span className="text-white font-bold text-lg drop-shadow-md">
                          {room.roomNumber}
                        </span>
                        <span className="text-white text-xs drop-shadow">
                          {room.students.length} طلاب
                        </span>
                      </button>

                      {/* Expanded Room - Student List */}
                      {isExpanded && (
                        <div className="mt-3 bg-white rounded-lg border-2 border-gray-200 p-4">
                          <h4 className="text-sm font-bold text-[#002147] mb-3 pb-2 border-b">
                            طلاب غرفة {room.roomNumber}
                          </h4>
                          <div className="space-y-2">
                            {room.students.map((student) => (
                              <div
                                key={student.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-[#002147]">
                                    {student.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {student.studentId}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {/* Toggle Switch */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleStudentAttendance(
                                        wing,
                                        roomIndex,
                                        student.id
                                      );
                                    }}
                                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                                      student.status === true
                                        ? 'bg-green-500'
                                        : student.status === false
                                        ? 'bg-red-500'
                                        : 'bg-gray-300'
                                    }`}
                                  >
                                    <span
                                      className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
                                        student.status !== null
                                          ? 'translate-x-1'
                                          : 'translate-x-7'
                                      }`}
                                    />
                                  </button>
                                  <span
                                    className={`text-xs font-medium min-w-[50px] text-left ${
                                      student.status === true
                                        ? 'text-green-600'
                                        : student.status === false
                                        ? 'text-red-600'
                                        : 'text-gray-500'
                                    }`}
                                  >
                                    {student.status === true
                                      ? 'حاضر'
                                      : student.status === false
                                      ? 'غائب'
                                      : 'لم يتم'}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <div className="flex items-center justify-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 border-2 border-green-600 rounded"></div>
            <span className="text-sm text-gray-700">حضور كامل</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-500 border-2 border-yellow-600 rounded"></div>
            <span className="text-sm text-gray-700">حضور جزئي</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-300 border-2 border-gray-400 rounded"></div>
            <span className="text-sm text-gray-700">لم يتم التحقق</span>
          </div>
        </div>
      </div>

      {/* Generate Meal Report Button */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-center">
          <button
            onClick={() => setIsMealModalOpen(true)}
            className="px-8 py-4 bg-gradient-to-r from-[#F2C94C] to-[#F4D679] text-[#002147] rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-3 shadow-lg"
          >
            <UtensilsCrossed size={28} />
            <span>إنشاء تقرير الوجبات</span>
          </button>
        </div>
      </div>

      {/* Meal Headcount Modal */}
      <MealHeadcountModal
        isOpen={isMealModalOpen}
        onClose={() => setIsMealModalOpen(false)}
        allStudentsData={getAllStudentsData()}
      />
    </div>
  );
}