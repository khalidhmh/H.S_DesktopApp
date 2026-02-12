import { create } from 'zustand'
import { logger } from '@shared/utils/logger'

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'EXCUSED' | null
export type RoomType = 'STANDARD' | 'PREMIUM'
export type Wing = 'A' | 'B' | 'C' | 'D'

export interface RoomStudent {
  id: number
  name: string
  status: AttendanceStatus
  college: string
  level: number
}

export interface Room {
  id: number
  number: string // "501", "512", etc.
  floor: number // 1-6
  wing: Wing
  type: RoomType
  capacity: number // 2 or 3
  students: RoomStudent[]
  isComplete: boolean
  completionRate: string // "2/3"
}

export interface AttendanceSession {
  id: number
  date: string
  startTime: string
  endTime: string | null
  supervisorName: string
  totalRooms: number
  completedRooms: number
  totalStudents: number
  markedStudents: number
}

export interface AttendanceRecord {
  id: number
  date: string
  takenAt: string
  supervisorName: string
  totalStudents: number
  presentCount: number
  absentCount: number
  excusedCount: number
  students: Array<{
    id: number
    name: string
    roomNumber: string
    status: AttendanceStatus
  }>
}

interface AttendanceState {
  rooms: Room[]
  history: AttendanceRecord[]
  selectedFloor: number | 'ALL'
  selectedWing: Wing | 'ALL'
  searchQuery: string
  sessionActive: boolean
  sessionStartTime: string | null
  isLoading: boolean

  // Actions
  fetchRooms: () => void
  fetchHistory: () => void
  startSession: () => boolean
  endSession: () => Promise<void>
  markStudent: (roomId: number, studentId: number, status: AttendanceStatus) => void
  setFloorFilter: (floor: number | 'ALL') => void
  setWingFilter: (wing: Wing | 'ALL') => void
  setSearchQuery: (query: string) => void
  getFilteredRooms: () => Room[]
  getStats: () => {
    totalRooms: number
    completedRooms: number
    totalStudents: number
    markedStudents: number
    percentage: number
  }
  isAttendanceTime: () => boolean
}

// Arabic names pool
const ARABIC_NAMES = [
  'أحمد محمد علي',
  'خالد سعيد حسن',
  'محمد عبدالله أحمد',
  'عمر يوسف محمود',
  'فهد ناصر سالم',
  'ياسر أحمد خالد',
  'عبدالرحمن سالم علي',
  'بدر خالد محمد',
  'طارق محمود حسن',
  'نواف عبدالله سعد',
  'راشد فهد أحمد',
  'سلطان محمد علي',
  'فيصل أحمد حسن',
  'عبدالعزيز سعد يوسف',
  'ماجد علي محمد',
  'وليد حسن أحمد',
  'صالح يوسف خالد',
  'إبراهيم عمر سالم',
  'حسن محمود فهد',
  'علي أحمد محمد'
]

const COLLEGES = [
  'كلية الهندسة',
  'كلية العلوم',
  'كلية التجارة',
  'كلية الآداب',
  'كلية الطب',
  'كلية الحاسبات والمعلومات'
]

// Generate rooms for one floor
const generateFloorRooms = (floor: number): Room[] => {
  const rooms: Room[] = []
  let roomIdCounter = (floor - 1) * 30 + 1

  // Wing A: X01-X06 (6 rooms)
  for (let i = 1; i <= 6; i++) {
    const roomNum = floor * 100 + i
    rooms.push(createRoom(roomIdCounter++, String(roomNum), floor, 'A'))
  }
  // Skip X07

  // Wing B: X08-X12 (5 rooms)
  for (let i = 8; i <= 12; i++) {
    const roomNum = floor * 100 + i
    rooms.push(createRoom(roomIdCounter++, String(roomNum), floor, 'B'))
  }
  // Skip X13

  // Wing C: X14-X19 (6 rooms)
  for (let i = 14; i <= 19; i++) {
    const roomNum = floor * 100 + i
    rooms.push(createRoom(roomIdCounter++, String(roomNum), floor, 'C'))
  }
  // Skip X20

  // Wing D: X21-X25 (5 rooms)
  for (let i = 21; i <= 25; i++) {
    const roomNum = floor * 100 + i
    rooms.push(createRoom(roomIdCounter++, String(roomNum), floor, 'D'))
  }
  // Skip X26

  return rooms
}

let studentIdCounter = 1

const createRoom = (id: number, number: string, floor: number, wing: Wing): Room => {
  // Random room type (80% standard, 20% premium)
  const type: RoomType = Math.random() > 0.2 ? 'STANDARD' : 'PREMIUM'
  const capacity = type === 'STANDARD' ? 3 : 2

  const students: RoomStudent[] = []
  for (let i = 0; i < capacity; i++) {
    students.push({
      id: studentIdCounter++,
      name: ARABIC_NAMES[Math.floor(Math.random() * ARABIC_NAMES.length)],
      status: null,
      college: COLLEGES[Math.floor(Math.random() * COLLEGES.length)],
      level: Math.floor(Math.random() * 4) + 1
    })
  }

  return {
    id,
    number,
    floor,
    wing,
    type,
    capacity,
    students,
    isComplete: false,
    completionRate: `0/${capacity}`
  }
}

// Generate all building rooms (6 floors)
const generateAllRooms = (): Room[] => {
  const allRooms: Room[] = []
  for (let floor = 1; floor <= 6; floor++) {
    allRooms.push(...generateFloorRooms(floor))
  }
  return allRooms
}

const MOCK_ROOMS = generateAllRooms()

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  rooms: [],
  history: [],
  selectedFloor: 'ALL',
  selectedWing: 'ALL',
  searchQuery: '',
  sessionActive: false,
  sessionStartTime: null,
  isLoading: false,

  fetchRooms: () => {
    set({ isLoading: true })
    setTimeout(() => {
      set({
        rooms: MOCK_ROOMS.map((r) => ({
          ...r,
          students: r.students.map((s) => ({ ...s, status: null }))
        })),
        isLoading: false
      })
    }, 300)
  },

  fetchHistory: () => {
    set({ isLoading: true })
    setTimeout(() => {
      // Generate mock historical records for the past 7 days
      const history: AttendanceRecord[] = []
      const supervisors = ['أحمد محمد علي', 'خالد سعيد حسن', 'محمد عبدالله أحمد']


      for (let i = 1; i <= 7; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i)

        const totalStudents = MOCK_ROOMS.reduce((sum, r) => sum + r.capacity, 0)
        const presentCount = Math.floor(totalStudents * (0.88 + Math.random() * 0.1))
        const absentCount = Math.floor((totalStudents - presentCount) * 0.6)
        const excusedCount = totalStudents - presentCount - absentCount

        // Generate student attendance details
        const students = MOCK_ROOMS.flatMap((room) =>
          room.students.map((student) => {
            const rand = Math.random()
            let status: AttendanceStatus = 'PRESENT'
            if (rand > 0.95) status = 'ABSENT'
            else if (rand > 0.92) status = 'EXCUSED'

            return {
              id: student.id,
              name: student.name,
              roomNumber: room.number,
              status
            }
          })
        )

        history.push({
          id: i,
          date: date.toISOString(),
          takenAt: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            22,
            45
          ).toISOString(),
          supervisorName: supervisors[i % supervisors.length],
          totalStudents,
          presentCount,
          absentCount,
          excusedCount,
          students
        })
      }

      set({ history, isLoading: false })
    }, 500)
  },

  isAttendanceTime: () => {
    const now = new Date()
    const hour = now.getHours()
    const minute = now.getMinutes()

    // Between 10:30 PM (22:30) and 12:30 AM (00:30 next day)
    return (
      (hour === 22 && minute >= 30) || hour === 23 || (hour === 0 && minute <= 30)
    )
  },

  startSession: () => {
    if (!get().isAttendanceTime()) {
      return false
    }

    set({
      sessionActive: true,
      sessionStartTime: new Date().toISOString()
    })
    return true
  },

  endSession: async () => {
    set({ isLoading: true })
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        logger.info('Session ended, data saved')
        set({
          sessionActive: false,
          sessionStartTime: null,
          isLoading: false
        })
        resolve()
      }, 1000)
    })
  },

  markStudent: (roomId: number, studentId: number, status: AttendanceStatus) => {
    const rooms = get().rooms.map((room) => {
      if (room.id !== roomId) return room

      const updatedStudents = room.students.map((student) =>
        student.id === studentId ? { ...student, status } : student
      )

      const markedCount = updatedStudents.filter((s) => s.status !== null).length
      const isComplete = markedCount === room.capacity

      return {
        ...room,
        students: updatedStudents,
        isComplete,
        completionRate: `${markedCount}/${room.capacity}`
      }
    })

    set({ rooms })
  },

  setFloorFilter: (floor: number | 'ALL') => {
    set({ selectedFloor: floor })
  },

  setWingFilter: (wing: Wing | 'ALL') => {
    set({ selectedWing: wing })
  },

  setSearchQuery: (query: string) => {
    // Auto-reset filters when searching
    if (query.trim()) {
      set({
        searchQuery: query,
        selectedFloor: 'ALL',
        selectedWing: 'ALL'
      })
    } else {
      set({ searchQuery: query })
    }
  },

  getFilteredRooms: () => {
    const { rooms, selectedFloor, selectedWing, searchQuery } = get()

    let filtered = rooms

    // Filter by floor
    if (selectedFloor !== 'ALL') {
      filtered = filtered.filter((r) => r.floor === selectedFloor)
    }

    // Filter by wing
    if (selectedWing !== 'ALL') {
      filtered = filtered.filter((r) => r.wing === selectedWing)
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.trim()
      filtered = filtered.filter((r) => {
        // Search by room number
        if (r.number.includes(query)) return true

        // Search by student name (word-boundary based)
        // "خالد" matches "خالد محمد" but not "محمد خالد"
        // "خالد حسين" matches "خالد حسين علي" but not "علي خالد حسين"
        return r.students.some((s) => {
          const name = s.name.trim()
          const searchTerms = query.split(/\s+/) // Split by spaces

          // Check if name starts with the search terms in order
          const nameWords = name.split(/\s+/)
          
          // All search terms must match from the beginning
          return searchTerms.every((term, index) => {
            return nameWords[index]?.startsWith(term)
          })
        })
      })
    }

    return filtered
  },

  getStats: () => {
    const { rooms } = get()
    const totalRooms = rooms.length
    const completedRooms = rooms.filter((r) => r.isComplete).length
    const totalStudents = rooms.reduce((sum, r) => sum + r.capacity, 0)
    const markedStudents = rooms.reduce(
      (sum, r) => sum + r.students.filter((s) => s.status !== null).length,
      0
    )
    const percentage =
      totalStudents > 0 ? Math.round((markedStudents / totalStudents) * 100) : 0

    return {
      totalRooms,
      completedRooms,
      totalStudents,
      markedStudents,
      percentage
    }
  }
}))
