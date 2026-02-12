import { create } from 'zustand'
import { ComplaintService, Issue, IssueType } from '../services/complaint.service'

interface ComplaintState {
  issues: Issue[]
  filter: 'ALL' | 'PENDING' | 'RESOLVED'
  isLoading: boolean
  urgentCount: number // For badge
  recentComplaints: Issue[] // Recent activity for dashboard

  fetchIssues: (filter?: 'ALL' | 'PENDING' | 'RESOLVED') => Promise<void>
  setFilter: (filter: 'ALL' | 'PENDING' | 'RESOLVED') => void
  resolveIssue: (id: number, type: IssueType) => Promise<void>
  reportComplaint: (data: {
    title: string
    description: string
    priority: string
    studentId: number
  }) => Promise<void>
  reportMaintenance: (data: {
    type: string
    description: string
    priority: string
    roomId?: number
    location?: string
  }) => Promise<void>
  fetchStats: () => Promise<void> // For dashboard
}

export const useComplaintStore = create<ComplaintState>((set, get) => ({
  issues: [],
  filter: 'PENDING', // Default to Pending
  isLoading: false,
  urgentCount: 0,
  recentComplaints: [],

  fetchIssues: async (filter) => {
    const currentFilter = filter || get().filter
    set({ isLoading: true })
    try {
      const issues = await ComplaintService.getAllIssues(
        currentFilter === 'ALL' ? undefined : currentFilter
      )
      set({ issues, isLoading: false })

      // Update urgent count if fetching all or pending
      if (currentFilter !== 'RESOLVED') {
        const urgent = issues.filter((i) => i.priority === 'HIGH' && i.status !== 'RESOLVED').length
        set({ urgentCount: urgent })
      }
    } catch (error) {
      console.error('Error fetching issues:', error)
      set({ isLoading: false })
    }
  },

  setFilter: (filter) => {
    set({ filter })
    get().fetchIssues(filter)
  },

  resolveIssue: async (id, type) => {
    try {
      await ComplaintService.resolveIssue(id, type)
      // Refresh list
      get().fetchIssues()
    } catch (error) {
      console.error('Error resolving issue:', error)
    }
  },

  reportComplaint: async (data) => {
    try {
      await ComplaintService.createComplaint(data)
      get().fetchIssues()
    } catch (error) {
      console.error('Error reporting complaint:', error)
      throw error
    }
  },

  reportMaintenance: async (data) => {
    try {
      await ComplaintService.createMaintenanceFault(data)
      get().fetchIssues()
    } catch (error) {
      console.error('Error reporting maintenance:', error)
      throw error
    }
  },

  fetchStats: async () => {
    try {
      const { urgentCount, recent } = await ComplaintService.getStats()
      set({ urgentCount, recentComplaints: recent || [] })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }
}))
