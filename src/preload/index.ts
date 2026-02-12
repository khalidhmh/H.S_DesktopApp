import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  // Authentication
  login: (email: string, password: string) => ipcRenderer.invoke('auth:login', { email, password }),

  // Students
  getAllStudents: () => ipcRenderer.invoke('students:get-all'),
  getStudentsPaginated: (page: number, limit: number, filters?: any) =>
    ipcRenderer.invoke('students:get-all-paginated', { page, limit, ...filters }),
  getStudentById: (id: number) => ipcRenderer.invoke('students:get-by-id', id),
  searchStudents: (query: string) => ipcRenderer.invoke('students:search', query),
  addStudent: (data: any) => ipcRenderer.invoke('students:add', data),
  updateStudentStatus: (id: number, status: string) =>
    ipcRenderer.invoke('students:update-status', { id, status }),

  // Rooms
  getAllRooms: () => ipcRenderer.invoke('rooms:get-all'),
  getRoomsByBuilding: (building: string) => ipcRenderer.invoke('rooms:get-by-building', building),
  getRoomDetails: (id: number) => ipcRenderer.invoke('rooms:get-details', id),
  updateRoomStatus: (id: number, status: string) =>
    ipcRenderer.invoke('rooms:update-status', { id, status }),
  searchRooms: (query: string) => ipcRenderer.invoke('rooms:search', query),

  // Complaints
  getAllIssues: (filter?: string) => ipcRenderer.invoke('complaints:get-all', filter),
  createComplaint: (data: any) => ipcRenderer.invoke('complaints:create', data),
  createMaintenanceFault: (data: any) => ipcRenderer.invoke('complaints:create-fault', data),
  resolveIssue: (id: number, type: string) =>
    ipcRenderer.invoke('complaints:resolve', { id, type }),
  getComplaintStats: () => ipcRenderer.invoke('complaints:get-stats'),

  // Penalties
  getAllPenalties: () => ipcRenderer.invoke('penalties:get-all'),
  addPenalty: (studentId: number, data: any) =>
    ipcRenderer.invoke('penalties:add', { studentId, data }),
  getPenaltiesByStudent: (studentId: number) =>
    ipcRenderer.invoke('penalties:get-by-student', studentId),

  // Attendance
  getTodayAttendance: (building?: string) => ipcRenderer.invoke('attendance:get-today', building),
  submitAttendance: (records: any[]) => ipcRenderer.invoke('attendance:submit', records),
  getAttendanceHistory: (studentId: number) =>
    ipcRenderer.invoke('attendance:get-history', studentId),
  getAllAttendanceLogs: () => ipcRenderer.invoke('attendance:get-all-logs'),

  // Dashboard
  getDashboardStats: (role: string) => ipcRenderer.invoke('dashboard:get-stats', role),

  // Notifications
  getNotifications: (userId?: number) => ipcRenderer.invoke('notifications:get-all', userId),
  markNotificationAsRead: (id: number) => ipcRenderer.invoke('notifications:mark-read', id),
  createNotification: (data: any) => ipcRenderer.invoke('notifications:create', data),

  // Memorandums
  getMemos: () => ipcRenderer.invoke('memos:get-all'),
  createMemo: (data: any) => ipcRenderer.invoke('memos:create', data),

  // Inventory
  getInventory: () => ipcRenderer.invoke('inventory:get-all'),
  updateInventoryQuantity: (id: number, quantity: number) =>
    ipcRenderer.invoke('inventory:update-quantity', { id, quantity }),
  addInventoryItem: (data: any) => ipcRenderer.invoke('inventory:add-item', data),
  deleteInventoryItem: (id: number) => ipcRenderer.invoke('inventory:delete-item', id),

  // Settings
  updatePassword: (userId: number, newPassword: string) =>
    ipcRenderer.invoke('settings:update-password', { userId, newPassword }),
  resetSystem: () => ipcRenderer.invoke('settings:reset-system'),
  getSystemBackup: () => ipcRenderer.invoke('settings:backup')
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore
  window.electron = electronAPI
  // @ts-ignore
  window.api = api
}
