import { logger } from '@shared/utils/logger'

export type IssueType = 'COMPLAINT' | 'MAINTENANCE'

export interface Issue {
  id: number
  type: IssueType
  title: string
  description: string
  status: string
  priority: string
  location?: string
  studentName?: string
  studentId?: number
  roomId?: number
  createdAt: Date
}

export const ComplaintService = {
  getAllIssues: async (filter?: string): Promise<Issue[]> => {
    try {
      // The IPC returns raw objects, we might need to ensure Dates are parsed if JSON serialization messed them up
      // But usually IPC handles Dates or converts to ISO strings.
      // Let's assume we receive them as is or string.
      // Electron IPC usually mimics JSON.parse/stringify logic unless specialized.
      // Dates become strings. We might need to map them back to Dates.
      const issues = await window.api.getAllIssues(filter)
      return issues.map((i: any) => ({
        ...i,
        createdAt: new Date(i.createdAt)
      }))
    } catch (error) {
      logger.error('Error fetching issues:', error)
      throw error
    }
  },

  createComplaint: async (data: {
    title: string
    description: string
    priority: string
    studentId: number
  }) => {
    return await window.api.createComplaint(data)
  },

  createMaintenanceFault: async (data: {
    type: string
    description: string
    priority: string
    roomId?: number
    location?: string
  }) => {
    return await window.api.createMaintenanceFault(data)
  },

  resolveIssue: async (id: number, type: IssueType) => {
    try {
      await window.api.resolveIssue(id, type)
    } catch (error) {
      logger.error(`Error resolving issue ${id} (${type}):`, error)
      throw error
    }
  },

  getStats: async () => {
    return await window.api.getComplaintStats()
  }
}
