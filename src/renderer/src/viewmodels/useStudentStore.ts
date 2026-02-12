import { create } from 'zustand'
import { Student } from '../models'
import { StudentService } from '../services/student.service'

interface StudentState {
  students: Student[]
  isLoading: boolean
  selectedStudent: Student | null
  filter: string | null // e.g., filter by status or college

  fetchStudents: () => Promise<void>
  selectStudent: (student: Student | null) => void
  setFilter: (filter: string | null) => void
  addStudent: (studentData: any) => Promise<boolean>

  // Dashboard Stats
  dashboardStats: {
    totalStudents: number
    occupancyRate: number
    pendingComplaints: number
    availableRooms: number
    buildingDistribution: { name: string; value: number }[]
    attendanceTrends: { day: string; present: number; absent: number }[]
  } | null
  fetchDashboardStats: () => Promise<void>
}

export const useStudentStore = create<StudentState>((set, get) => ({
  students: [],
  isLoading: false,
  selectedStudent: null,
  filter: null,
  dashboardStats: null,

  fetchStudents: async () => {
    set({ isLoading: true })
    try {
      const students = await StudentService.getAllStudents()
      set({ students, isLoading: false })
    } catch (error) {
      console.error('Failed to fetch students:', error)
      set({ isLoading: false })
    }
  },

  selectStudent: (student) => {
    set({ selectedStudent: student })
  },

  setFilter: (filter) => {
    set({ filter })
  },

  addStudent: async (studentData: any) => {
    set({ isLoading: true })
    try {
      await StudentService.addStudent(studentData)
      // Refresh list
      const students = await StudentService.getAllStudents()
      set({ students, isLoading: false })
      return true
    } catch (error) {
      console.error('Failed to add student:', error)
      set({ isLoading: false })
      return false
    }
  },

  fetchDashboardStats: async () => {
    // In a real app, this would be an API call to a specific dashboard endpoint
    // For now, we simulate it or calculate from existing data if available
    set({ isLoading: true })

    // Mock Data Simulation
    setTimeout(() => {
      set({
        isLoading: false,
        dashboardStats: {
          totalStudents: 1250,
          occupancyRate: 85,
          pendingComplaints: 12,
          availableRooms: 45,
          buildingDistribution: [
            { name: 'المبنى أ', value: 400 },
            { name: 'المبنى ب', value: 350 },
            { name: 'المبنى ج', value: 300 },
            { name: 'المبنى د', value: 200 }
          ],
          attendanceTrends: [
            { day: 'السبت', present: 1100, absent: 150 },
            { day: 'الأحد', present: 1150, absent: 100 },
            { day: 'الاثنين', present: 1180, absent: 70 },
            { day: 'الثلاثاء', present: 1120, absent: 130 },
            { day: 'الأربعاء', present: 1190, absent: 60 },
            { day: 'الخميس', present: 1050, absent: 200 },
            { day: 'الجمعة', present: 900, absent: 350 }
          ]
        }
      })
    }, 500)
  }
}))
