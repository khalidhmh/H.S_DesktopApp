import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      // Authentication
      login: (email: string, password: string) => Promise<any>

      // Students
      getAllStudents: () => Promise<any[]>
      getStudentsPaginated: (
        page: number,
        limit: number,
        filters?: any
      ) => Promise<{ students: any[]; total: number; page: number; totalPages: number }>
      getStudentById: (id: number) => Promise<any>
      searchStudents: (query: string) => Promise<any[]>
      addStudent: (data: any) => Promise<any>
      updateStudentStatus: (id: number, status: string) => Promise<any>

      // Rooms
      getAllRooms: () => Promise<any[]>
      getRoomsByBuilding: (building: string) => Promise<any[]>
      getRoomDetails: (id: number) => Promise<any>
      updateRoomStatus: (id: number, status: string) => Promise<any>
      searchRooms: (query: string) => Promise<any[]>

      // Complaints
      getAllIssues: (filter?: string) => Promise<any[]>
      createComplaint: (data: any) => Promise<any>
      createMaintenanceFault: (data: any) => Promise<any>
      resolveIssue: (id: number, type: string) => Promise<void>
      getComplaintStats: () => Promise<{ urgentCount: number; recent: any[] }>

      // Penalties
      getAllPenalties: () => Promise<any[]>
      addPenalty: (studentId: number, data: any) => Promise<any>
      getPenaltiesByStudent: (studentId: number) => Promise<any[]>

      // Attendance
      getTodayAttendance: (building?: string) => Promise<any[]>
      submitAttendance: (records: any[]) => Promise<any[]>
      getAttendanceHistory: (studentId: number) => Promise<any[]>
      getAllAttendanceLogs: () => Promise<any[]>

      // Dashboard
      getDashboardStats: (role: string) => Promise<any>

      // Settings
      updatePassword: (userId: number, newPassword: string) => Promise<void>
      resetSystem: () => Promise<void>
      getSystemBackup: () => Promise<any>

      // Notifications
      getNotifications: (userId?: number) => Promise<any[]>
      markNotificationAsRead: (id: number) => Promise<void>
      createNotification: (data: any) => Promise<any>

      // Memorandums
      getMemos: () => Promise<any[]>
      createMemo: (data: any) => Promise<any>

      // Inventory
      getInventory: () => Promise<any[]>
      updateInventoryQuantity: (id: number, quantity: number) => Promise<any>
      addInventoryItem: (data: any) => Promise<any>
      deleteInventoryItem: (id: number) => Promise<any>
    }
  }
}
