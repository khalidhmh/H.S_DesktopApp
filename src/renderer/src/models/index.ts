// ✅ Explicit Interface Definitions for Frontend (Decoupled from Prisma Client)

export interface Room {
  id: number
  roomNumber: string
  building: string
  floor: number
  capacity: number
  type: string
  price: number
  status: string
  gender: 'MALE' | 'FEMALE'
  notes?: string | null
  createdAt?: Date | string
  updatedAt?: Date | string
}

export interface Student {
  id: number
  name: string
  universityId: string
  nationalId: string
  college: string
  year: string
  phone: string | null
  parentPhone: string | null
  city: string | null
  address: string | null
  status: string
  photo: string | null
  roomId: number | null
  room?: Room | null
  
  // Computed/Joined fields
  attendance?: any[]
  penalties?: any[]
  complaints?: any[]
  
  createdAt?: Date | string
  updatedAt?: Date | string
}

export interface User {
  id: number
  name: string
  email: string
  role: 'MANAGER' | 'SUPERVISOR'
  sessionId?: string
}

export interface DashboardStats {
  totalStudents: number
  occupancyRate: number
  pendingComplaints: number
  availableRooms: number
  buildingDistribution: { name: string; value: number }[]
  attendanceTrends: { day: string; present: number; absent: number }[]
}
