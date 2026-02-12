import { create } from 'zustand'
import { StudentService } from '../services/student.service'
import { AttendanceService } from '../services/attendance.service'
import { PenaltyService } from '../services/penalty.service'
import { InventoryService } from '../services/inventory.service'
import { exportToCSV } from '../utils/exportUtils'
import { format } from 'date-fns'

export type ReportType = 'students' | 'attendance' | 'penalties' | 'inventory'

export interface ReportFilters {
  dateFrom?: Date
  dateTo?: Date
  college?: string
  level?: string
  building?: string
  status?: string
}

interface ReportState {
  // State
  reportType: ReportType
  filters: ReportFilters
  previewData: any[]
  isGenerating: boolean

  // Actions
  setReportType: (type: ReportType) => void
  setFilters: (filters: Partial<ReportFilters>) => void
  clearFilters: () => void
  generateReport: () => Promise<void>
  exportToPDF: () => void
  exportToExcel: () => void

  // Legacy methods (kept for backward compatibility)
  generateStudentReport: () => Promise<void>
  generateAttendanceReport: () => Promise<void>
  generatePenaltyReport: () => Promise<void>
}

export const useReportStore = create<ReportState>((set, get) => ({
  // Initial State
  reportType: 'students',
  filters: {},
  previewData: [],
  isGenerating: false,

  // Set Report Type
  setReportType: (type) => {
    set({ reportType: type, filters: {}, previewData: [] })
  },

  // Set Filters
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    }))
  },

  // Clear Filters
  clearFilters: () => {
    set({ filters: {}, previewData: [] })
  },

  // Generate Report with Current Filters
  generateReport: async () => {
    const { reportType, filters } = get()
    set({ isGenerating: true, previewData: [] })

    try {
      let data: any[] = []

      switch (reportType) {
        case 'students': {
          const students = await StudentService.getAllStudents()
          
          // Apply filters
          let filtered = students
          if (filters.college) {
            filtered = filtered.filter((s) => s.college === filters.college)
          }
          if (filters.level) {
            filtered = filtered.filter((s) => s.level === filters.level)
          }
          if (filters.building) {
            filtered = filtered.filter((s) => s.room?.building === filters.building)
          }
          if (filters.status) {
            filtered = filtered.filter((s) => s.status === filters.status)
          }

          // Transform for preview
          data = filtered.map((s) => ({
            الاسم: s.name,
            'الرقم الجامعي': s.universityId,
            'الرقم القومي': s.nationalId,
            الكلية: s.college,
            الفرقة: s.level,
            المبنى: s.room?.building || 'غير مسكن',
            الغرفة: s.room?.roomNumber || '-',
            'رقم الهاتف': s.phone,
            الحالة: s.status === 'ACTIVE' ? 'نشط' : 'إخلاء'
          }))
          break
        }

        case 'attendance': {
          const logs = await AttendanceService.getAllAttendanceLogs()
          
          // Apply date filters
          let filtered = logs
          if (filters.dateFrom) {
            filtered = filtered.filter((log) => new Date(log.date) >= filters.dateFrom!)
          }
          if (filters.dateTo) {
            filtered = filtered.filter((log) => new Date(log.date) <= filters.dateTo!)
          }
          if (filters.building) {
            filtered = filtered.filter(
              (log) => (log.student as any)?.room?.building === filters.building
            )
          }

          // Transform for preview
          data = filtered.map((log) => ({
            التاريخ: format(new Date(log.date), 'yyyy-MM-dd'),
            الطالب: (log.student as any)?.name || 'غير معروف',
            'الرقم الجامعي': (log.student as any)?.universityId || '-',
            المبنى: (log.student as any)?.room?.building || '-',
            الحالة: log.status === 'PRESENT' ? 'حاضر' : 'غائب',
            ملاحظات: log.note || '-'
          }))
          break
        }

        case 'penalties': {
          const penalties = await PenaltyService.getAllPenalties()
          
          // Apply date filters
          let filtered = penalties
          if (filters.dateFrom) {
            filtered = filtered.filter((p) => new Date(p.date) >= filters.dateFrom!)
          }
          if (filters.dateTo) {
            filtered = filtered.filter((p) => new Date(p.date) <= filters.dateTo!)
          }

          // Transform for preview
          data = filtered.map((p) => ({
            'تاريخ المخالفة': format(new Date(p.date), 'yyyy-MM-dd'),
            الطالب: p.student.name,
            'الرقم الجامعي': p.student.universityId,
            'نوع العقوبة': p.type,
            السبب: p.reason
          }))
          break
        }

        case 'inventory': {
          const items = await InventoryService.getAll()
          
          // Get active students count for calculation
          const students = await StudentService.getAllStudents()
          const activeStudentsCount = students.filter((s) => s.status === 'ACTIVE').length

          // Transform for preview
          data = items.map((item) => {
            const usedQuantity = item.perStudent ? activeStudentsCount : 0
            const availableQuantity = item.totalQuantity - usedQuantity
            
            return {
              'اسم الصنف': item.nameAr,
              'الكمية الإجمالية': item.totalQuantity,
              'الكمية المستخدمة': usedQuantity,
              'الكمية المتبقية': availableQuantity,
              النوع: item.perStudent ? 'مرتبط بالطلاب' : 'صنف عام'
            }
          })
          break
        }
      }

      set({ previewData: data, isGenerating: false })
    } catch (error) {
      console.error('Failed to generate report:', error)
      set({ isGenerating: false, previewData: [] })
    }
  },

  // Export to PDF (using browser print)
  exportToPDF: () => {
    const { reportType } = get()
    
    // Add a print-specific class to the body
    document.body.classList.add('printing-report')
    
    // Trigger print dialog
    setTimeout(() => {
      window.print()
      document.body.classList.remove('printing-report')
    }, 100)
  },

  // Export to Excel (using CSV for now)
  exportToExcel: () => {
    const { previewData, reportType } = get()
    
    if (!previewData || previewData.length === 0) {
      console.warn('No data to export')
      return
    }

    const reportNames = {
      students: 'تقرير_الطلاب',
      attendance: 'تقرير_الحضور',
      penalties: 'تقرير_المخالفات',
      inventory: 'تقرير_العهدة'
    }

    const filename = `${reportNames[reportType]}_${format(new Date(), 'yyyy-MM-dd')}`
    exportToCSV(previewData, filename)
  },

  // Legacy: Generate Student Report (CSV)
  generateStudentReport: async () => {
    set({ isGenerating: true })
    try {
      const students = await StudentService.getAllStudents()

      const data = students.map((s) => ({
        الاسم: s.name,
        'الرقم الجامعي': s.universityId,
        'الرقم القومي': s.nationalId,
        الكلية: s.college,
        الفرقة: s.level,
        المبنى: s.room ? s.room.building : 'غير مسكن',
        الغرفة: s.room ? s.room.roomNumber : '-',
        'رقم الهاتف': s.phone,
        العنوان: s.city,
        'حالة القيد': s.status === 'ACTIVE' ? 'نشط' : 'إخلاء'
      }))

      exportToCSV(data, `تقرير_الطلاب_${format(new Date(), 'yyyy-MM-dd')}`)
    } catch (error) {
      console.error('Failed to generate student report:', error)
    } finally {
      set({ isGenerating: false })
    }
  },

  // Legacy: Generate Attendance Report (CSV)
  generateAttendanceReport: async () => {
    set({ isGenerating: true })
    try {
      const logs = await AttendanceService.getAllAttendanceLogs()

      const data = logs.map((log) => ({
        التاريخ: format(new Date(log.date), 'yyyy-MM-dd'),
        الطالب: (log.student as any)?.name || 'غير معروف',
        'الرقم الجامعي': (log.student as any)?.universityId || '-',
        الحالة: log.status === 'PRESENT' ? 'حاضر' : 'غائب',
        ملاحظات: log.note || '-'
      }))

      exportToCSV(data, `تقرير_الغياب_${format(new Date(), 'yyyy-MM-dd')}`)
    } catch (error) {
      console.error('Failed to generate attendance report:', error)
    } finally {
      set({ isGenerating: false })
    }
  },

  // Legacy: Generate Penalty Report (CSV)
  generatePenaltyReport: async () => {
    set({ isGenerating: true })
    try {
      const penalties = await PenaltyService.getAllPenalties()

      const data = penalties.map((p) => ({
        'تاريخ المخالفة': format(new Date(p.date), 'yyyy-MM-dd'),
        الطالب: p.student.name,
        'الرقم الجامعي': p.student.universityId,
        'نوع العقوبة': p.type,
        السبب: p.reason
      }))

      exportToCSV(data, `سجل_المخالفات_${format(new Date(), 'yyyy-MM-dd')}`)
    } catch (error) {
      console.error('Failed to generate penalty report:', error)
    } finally {
      set({ isGenerating: false })
    }
  }
}))
