import { create } from 'zustand'

export type MaintenanceType = 'PLUMBING' | 'ELECTRICAL' | 'HVAC' | 'CARPENTRY' | 'OTHER'
export type MaintenanceStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE'
export type MaintenancePriority = 'HIGH' | 'MEDIUM' | 'LOW'

export interface MaintenanceRequest {
  id: number
  type: MaintenanceType
  title: string
  description: string
  roomNumber: string
  building: string
  priority: MaintenancePriority
  status: MaintenanceStatus
  reportedBy: string
  reportedAt: string
  assignedTo?: string
  completedAt?: string
}

interface MaintenanceState {
  requests: MaintenanceRequest[]
  filteredRequests: MaintenanceRequest[]
  statusFilter: MaintenanceStatus | 'ALL'
  priorityFilter: MaintenancePriority | 'ALL'
  isLoading: boolean

  fetchRequests: () => void
  updateStatus: (id: number, status: MaintenanceStatus) => void
  setStatusFilter: (filter: MaintenanceStatus | 'ALL') => void
  setPriorityFilter: (filter: MaintenancePriority | 'ALL') => void
  clearFilters: () => void
  applyFilters: () => void
}

export const useMaintenanceStore = create<MaintenanceState>((set, get) => ({
  requests: [],
  filteredRequests: [],
  statusFilter: 'ALL',
  priorityFilter: 'ALL',
  isLoading: false,

  fetchRequests: () => {
    set({ isLoading: true })
    // TODO: Replace with actual API call - use getAllIssues and filter MAINTENANCE type
    // const issues = await window.api.getAllIssues()
    // const maintenanceRequests = issues.filter(i => i.type === 'MAINTENANCE')
    // For now, return empty array until DB integration is complete
    setTimeout(() => {
      set({
        requests: [],
        filteredRequests: [],
        isLoading: false
      })
    }, 100)
  },

  updateStatus: (id: number, status: MaintenanceStatus) => {
    const updated = get().requests.map((req) =>
      req.id === id
        ? {
            ...req,
            status,
            assignedTo: status === 'IN_PROGRESS' ? req.assignedTo || 'فني الصيانة' : req.assignedTo,
            completedAt: status === 'DONE' ? new Date().toISOString() : req.completedAt
          }
        : req
    )
    set({ requests: updated })
    get().applyFilters()
  },

  setStatusFilter: (filter: MaintenanceStatus | 'ALL') => {
    set({ statusFilter: filter })
    get().applyFilters()
  },

  setPriorityFilter: (filter: MaintenancePriority | 'ALL') => {
    set({ priorityFilter: filter })
    get().applyFilters()
  },

  clearFilters: () => {
    set({
      statusFilter: 'ALL',
      priorityFilter: 'ALL',
      filteredRequests: get().requests
    })
  },

  applyFilters: () => {
    const { requests, statusFilter, priorityFilter } = get()
    let filtered = requests

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((req) => req.status === statusFilter)
    }

    if (priorityFilter !== 'ALL') {
      filtered = filtered.filter((req) => req.priority === priorityFilter)
    }

    set({ filteredRequests: filtered })
  }
}))
