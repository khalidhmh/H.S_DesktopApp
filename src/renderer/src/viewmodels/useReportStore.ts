import { create } from 'zustand';
import { StudentService } from '../services/student.service';
import { attendanceService } from '../services/attendance.service';
import { PenaltyService } from '../services/penalty.service';
import { exportToCSV } from '../utils/exportUtils';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface ReportState {
  isGenerating: boolean;
  generateStudentReport: () => Promise<void>;
  generateAttendanceReport: () => Promise<void>;
  generatePenaltyReport: () => Promise<void>;
}

export const useReportStore = create<ReportState>((set) => ({
  isGenerating: false,

  generateStudentReport: async () => {
    set({ isGenerating: true });
    try {
      const students = await StudentService.getAllStudents();
      
      const data = students.map(s => ({
        'الاسم': s.name,
        'الرقم الجامعي': s.universityId,
        'الرقم القومي': s.nationalId,
        'الكلية': s.college,
        'الفرقة': s.level,
        'المبنى': s.room ? s.room.building : 'غير مسكن',
        'الغرفة': s.room ? s.room.roomNumber : '-',
        'رقم الهاتف': s.phone,
        'العنوان': s.city,
        'حالة القيد': s.status === 'ACTIVE' ? 'نشط' : 'إخلاء'
      }));

      exportToCSV(data, `تقرير_الطلاب_${format(new Date(), 'yyyy-MM-dd')}`);
    } catch (error) {
      console.error('Failed to generate student report:', error);
    } finally {
      set({ isGenerating: false });
    }
  },

  generateAttendanceReport: async () => {
    set({ isGenerating: true });
    try {
      // Using the method we just added
      const logs = await attendanceService.getAllAttendanceLogs();
      
      const data = logs.map(log => ({
        'التاريخ': format(new Date(log.date), 'yyyy-MM-dd', { locale: ar }),
        'الطالب': (log.student as any)?.name || 'غير معروف',
        'الرقم الجامعي': (log.student as any)?.universityId || '-',
        'الحالة': log.status === 'PRESENT' ? 'حاضر' : 'غائب',
        'ملاحظات': log.note || '-'
      }));

      exportToCSV(data, `تقرير_الغياب_${format(new Date(), 'yyyy-MM-dd')}`);
    } catch (error) {
      console.error('Failed to generate attendance report:', error);
    } finally {
      set({ isGenerating: false });
    }
  },

  generatePenaltyReport: async () => {
    set({ isGenerating: true });
    try {
      const penalties = await PenaltyService.getAllPenalties();
      
      const data = penalties.map(p => ({
        'تاريخ المخالفة': format(new Date(p.date), 'yyyy-MM-dd', { locale: ar }),
        'الطالب': p.student.name,
        'الرقم الجامعي': p.student.universityId,
        'نوع العقوبة': p.type,
        'السبب': p.reason
      }));

      exportToCSV(data, `سجل_المخالفات_${format(new Date(), 'yyyy-MM-dd')}`);
    } catch (error) {
      console.error('Failed to generate penalty report:', error);
    } finally {
      set({ isGenerating: false });
    }
  }
}));
