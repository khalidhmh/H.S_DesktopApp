import { create } from 'zustand'

export type RoomType = 'STANDARD' | 'PREMIUM'
export type Wing = 'A' | 'B' | 'C' | 'D'
export type GPA = 'EXCELLENT' | 'VERY_GOOD' | 'GOOD' | 'PASS'

export interface StudentInRoom {
  id: number
  name: string
  nationalId: string
  studentAffairsId: string
  phone: string
  photoUrl?: string
  college: string
  level: number // 1-4
  gpa: GPA

  // Guardian info
  guardianName: string
  guardianRelation: string
  guardianJob: string
  guardianPhone: string

  // Addresses
  studentGovernorate: string
  studentAddressDetails: string
  guardianGovernorate: string
  guardianAddressDetails: string

  // Room assignment
  roomNumber: string
  bedNumber: number // 1, 2, or 3
}

export interface RoomWithOccupancy {
  id: number
  number: string // "501"
  floor: number // 1-6
  wing: Wing
  type: RoomType
  capacity: number // 2 or 3
  occupiedBeds: number
  students: StudentInRoom[]
  availableBeds: number
}

interface RoomState {
  rooms: RoomWithOccupancy[]
  selectedFloor: number | 'ALL'
  selectedWing: Wing | 'ALL'
  searchQuery: string
  isLoading: boolean

  // Actions
  fetchRooms: () => void
  getRoomDetails: (roomId: number) => RoomWithOccupancy | null
  assignStudentToRoom: (roomId: number, bedNumber: number, studentData: Omit<StudentInRoom, 'id' | 'roomNumber' | 'bedNumber'>) => Promise<void>
  removeStudentFromRoom: (studentId: number) => void
  setFloorFilter: (floor: number | 'ALL') => void
  setWingFilter: (wing: Wing | 'ALL') => void
  setSearchQuery: (query: string) => void
  getFilteredRooms: () => RoomWithOccupancy[]
  getStats: () => {
    totalRooms: number
    occupiedRooms: number
    emptyRooms: number
    totalBeds: number
    occupiedBeds: number
    availableBeds: number
  }
}

// Generate rooms for one floor (same logic as attendance)
const generateFloorRooms = (floor: number): RoomWithOccupancy[] => {
  const rooms: RoomWithOccupancy[] = []
  let roomIdCounter = (floor - 1) * 30 + 1

  // Wing A: X01-X06
  for (let i = 1; i <= 6; i++) {
    const roomNum = floor * 100 + i
    rooms.push(createRoom(roomIdCounter++, String(roomNum), floor, 'A'))
  }

  // Wing B: X08-X12
  for (let i = 8; i <= 12; i++) {
    const roomNum = floor * 100 + i
    rooms.push(createRoom(roomIdCounter++, String(roomNum), floor, 'B'))
  }

  // Wing C: X14-X19
  for (let i = 14; i <= 19; i++) {
    const roomNum = floor * 100 + i
    rooms.push(createRoom(roomIdCounter++, String(roomNum), floor, 'C'))
  }

  // Wing D: X21-X25
  for (let i = 21; i <= 25; i++) {
    const roomNum = floor * 100 + i
    rooms.push(createRoom(roomIdCounter++, String(roomNum), floor, 'D'))
  }

  return rooms
}

const createRoom = (id: number, number: string, floor: number, wing: Wing): RoomWithOccupancy => {
  const type: RoomType = Math.random() > 0.2 ? 'STANDARD' : 'PREMIUM'
  const capacity = type === 'STANDARD' ? 3 : 2

  // No students initially - will be added via UI
  const students: StudentInRoom[] = []

  return {
    id,
    number,
    floor,
    wing,
    type,
    capacity,
    occupiedBeds: students.length,
    students,
    availableBeds: capacity - students.length
  }
}

// Generate all building rooms
const generateAllRooms = (): RoomWithOccupancy[] => {
  const allRooms: RoomWithOccupancy[] = []
  for (let floor = 1; floor <= 6; floor++) {
    allRooms.push(...generateFloorRooms(floor))
  }
  return allRooms
}

const MOCK_ROOMS = generateAllRooms()

let nextStudentId = 1000

export const useRoomStore = create<RoomState>((set, get) => ({
  rooms: [],
  selectedFloor: 'ALL',
  selectedWing: 'ALL',
  searchQuery: '',
  isLoading: false,

  fetchRooms: () => {
    set({ isLoading: true })
    setTimeout(() => {
      set({
        rooms: MOCK_ROOMS,
        isLoading: false
      })
    }, 300)
  },

  getRoomDetails: (roomId: number) => {
    const room = get().rooms.find((r) => r.id === roomId)
    return room || null
  },

  assignStudentToRoom: async (roomId, bedNumber, studentData) => {
    set({ isLoading: true })

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const rooms = get().rooms.map((room) => {
          if (room.id !== roomId) return room

          const newStudent: StudentInRoom = {
            ...studentData,
            id: nextStudentId++,
            roomNumber: room.number,
            bedNumber
          }

          const updatedStudents = [...room.students, newStudent]

          return {
            ...room,
            students: updatedStudents,
            occupiedBeds: updatedStudents.length,
            availableBeds: room.capacity - updatedStudents.length
          }
        })

        set({ rooms, isLoading: false })

        // TODO: Deduct inventory items
        // useInventoryStore.getState().deductMultiple([
        //   'سرير', 'مرتبة', 'مخدة', 'كرسي'
        // ])
        // If first student, also deduct 'ترابيزة'

        resolve()
      }, 1000)
    })
  },

  removeStudentFromRoom: (studentId: number) => {
    const rooms = get().rooms.map((room) => {
      const updatedStudents = room.students.filter((s) => s.id !== studentId)

      if (updatedStudents.length === room.students.length) return room

      return {
        ...room,
        students: updatedStudents,
        occupiedBeds: updatedStudents.length,
        availableBeds: room.capacity - updatedStudents.length
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

    // Filter by search (room number or student name)
    if (searchQuery.trim()) {
      const query = searchQuery.trim()
      filtered = filtered.filter((r) => {
        if (r.number.includes(query)) return true

        return r.students.some((s) => {
          const name = s.name.trim()
          const searchTerms = query.split(/\s+/)
          const nameWords = name.split(/\s+/)

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
    const occupiedRooms = rooms.filter((r) => r.occupiedBeds > 0).length
    const emptyRooms = totalRooms - occupiedRooms
    const totalBeds = rooms.reduce((sum, r) => sum + r.capacity, 0)
    const occupiedBeds = rooms.reduce((sum, r) => sum + r.occupiedBeds, 0)
    const availableBeds = totalBeds - occupiedBeds

    return {
      totalRooms,
      occupiedRooms,
      emptyRooms,
      totalBeds,
      occupiedBeds,
      availableBeds
    }
  }
}))
