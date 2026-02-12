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
}

// Mock Data
const MOCK_REQUESTS: MaintenanceRequest[] = [
  {
    id: 1,
    type: 'PLUMBING',
    title: 'تسرب مياه في الحمام',
    description: 'يوجد تسرب مياه من الصنبور الرئيسي في الحمام، يحتاج إلى إصلاح عاجل',
    roomNumber: 'A-201',
    building: 'مبنى أ',
    priority: 'HIGH',
    status: 'PENDING',
    reportedBy: 'أحمد محمد',
    reportedAt: '2024-02-05T10:30:00'
  },
  {
    id: 2,
    type: 'ELECTRICAL',
    title: 'عطل في الإضاءة',
    description: 'لا تعمل الإضاءة الرئيسية في الغرفة',
    roomNumber: 'B-105',
    building: 'مبنى ب',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    reportedBy: 'خالد علي',
    reportedAt: '2024-02-04T14:20:00',
    assignedTo: 'فني الكهرباء'
  },
  {
    id: 3,
    type: 'HVAC',
    title: 'تكييف لا يعمل',
    description: 'التكييف في الغرفة لا يبرد بشكل جيد',
    roomNumber: 'A-310',
    building: 'مبنى أ',
    priority: 'HIGH',
    status: 'PENDING',
    reportedBy: 'سعيد حسن',
    reportedAt: '2024-02-05T09:15:00'
  },
  {
    id: 4,
    type: 'CARPENTRY',
    title: 'باب مكسور',
    description: 'باب الخزانة مكسور ويحتاج إلى استبدال',
    roomNumber: 'C-202',
    building: 'مبنى ج',
    priority: 'LOW',
    status: 'DONE',
    reportedBy: 'محمد عبدالله',
    reportedAt: '2024-02-03T11:00:00',
    assignedTo: 'النجار',
    completedAt: '2024-02-04T16:30:00'
  },
  {
    id: 5,
    type: 'ELECTRICAL',
    title: 'مقبس كهربائي معطل',
    description: 'المقبس الكهربائي بجانب السرير لا يعمل',
    roomNumber: 'B-308',
    building: 'مبنى ب',
    priority: 'MEDIUM',
    status: 'PENDING',
    reportedBy: 'عمر يوسف',
    reportedAt: '2024-02-05T08:45:00'
  },
  {
    id: 6,
    type: 'PLUMBING',
    title: 'انسداد في المصرف',
    description: 'مصرف المغسلة مسدود',
    roomNumber: 'A-115',
    building: 'مبنى أ',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    reportedBy: 'فهد ناصر',
    reportedAt: '2024-02-05T07:30:00',
    assignedTo: 'فني السباكة'
  },
  {
    id: 7,
    type: 'OTHER',
    title: 'نافذة لا تغلق بشكل جيد',
    description: 'النافذة في الغرفة لا تغلق بإحكام وتسبب دخول الهواء',
    roomNumber: 'C-401',
    building: 'مبنى ج',
    priority: 'LOW',
    status: 'PENDING',
    reportedBy: 'ياسر أحمد',
    reportedAt: '2024-02-04T16:00:00'
  },
  {
    id: 8,
    type: 'HVAC',
    title: 'صوت غريب من التكييف',
    description: 'يصدر التكييف أصوات غريبة عند التشغيل',
    roomNumber: 'B-210',
    building: 'مبنى ب',
    priority: 'MEDIUM',
    status: 'DONE',
    reportedBy: 'عبدالرحمن سالم',
    reportedAt: '2024-02-02T13:20:00',
    assignedTo: 'فني التكييف',
    completedAt: '2024-02-03T10:15:00'
  },
  {
    id: 9,
    type: 'ELECTRICAL',
    title: 'قطع كهربائي متكرر',
    description: 'ينقطع التيار الكهربائي بشكل متكرر في الغرفة',
    roomNumber: 'A-405',
    building: 'مبنى أ',
    priority: 'HIGH',
    status: 'PENDING',
    reportedBy: 'بدر خالد',
    reportedAt: '2024-02-05T11:00:00'
  },
  {
    id: 10,
    type: 'PLUMBING',
    title: 'ضغط ماء ضعيف',
    description: 'ضغط الماء في الدش ضعيف جداً',
    roomNumber: 'C-305',
    building: 'مبنى ج',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    reportedBy: 'طارق محمود',
    reportedAt: '2024-02-04T09:30:00',
    assignedTo: 'فني السباكة'
  },
  {
    id: 11,
    type: 'CARPENTRY',
    title: 'كرسي متكسر',
    description: 'أحد الكراسي في الغرفة مكسور ويحتاج إصلاح',
    roomNumber: 'B-112',
    building: 'مبنى ب',
    priority: 'LOW',
    status: 'DONE',
    reportedBy: 'نواف عبدالله',
    reportedAt: '2024-02-01T15:00:00',
    assignedTo: 'النجار',
    completedAt: '2024-02-02T11:20:00'
  },
  {
    id: 12,
    type: 'OTHER',
    title: 'طلاء متقشر على الجدار',
    description: 'الطلاء على أحد الجدران بدأ يتقشر ويحتاج إعادة طلاء',
    roomNumber: 'A-220',
    building: 'مبنى أ',
    priority: 'LOW',
    status: 'PENDING',
    reportedBy: 'راشد فهد',
    reportedAt: '2024-02-03T12:45:00'
  }
]

export const useMaintenanceStore = create<MaintenanceState>((set, get) => ({
  requests: [],
  filteredRequests: [],
  statusFilter: 'ALL',
  priorityFilter: 'ALL',
  isLoading: false,

  fetchRequests: () => {
    set({ isLoading: true })
    // Simulate API call delay
    setTimeout(() => {
      set({
        requests: MOCK_REQUESTS,
        filteredRequests: MOCK_REQUESTS,
        isLoading: false
      })
    }, 300)
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
