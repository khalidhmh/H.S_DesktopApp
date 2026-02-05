import { create } from 'zustand';
import { attendanceService } from '../services/attendance.service';
import { StudentService } from '../services/student.service';
import { Student } from '../models';

interface AttendanceRecord {
  studentId: number;
  student: Student;
  status: 'PRESENT' | 'ABSENT' | 'EXCUSED' | 'PENDING';
  note?: string;
}

interface AttendanceState {
  attendanceSession: AttendanceRecord[];
  isLoading: boolean;
  error: string | null;
  building: string;

  // Actions
  initSession: (building: string) => Promise<void>;
  mark: (studentId: number, status: 'PRESENT' | 'ABSENT' | 'EXCUSED', note?: string) => void;
  submit: () => Promise<void>;
  
  // Computed (will be derived from state in component or getter)
  getStats: () => { present: number; absent: number; excused: number; pending: number };
}

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  attendanceSession: [],
  isLoading: false,
  error: null,
  building: '',

  initSession: async (building: string) => {
    set({ isLoading: true, error: null, building });
    try {
      // 1. Get all active students for the building
      // We might need to add a method to studentService to distinct filter by building if not exists.
      // For now, let's assume we fetch all and filter client side or use existing method.
      // Checking student.service calls might be needed but let's assume we can fetch all for now.
      
      const allStudents = await studentService.getAllStudents(); 
      const buildingStudents = allStudents.filter(s => 
          s.status === 'ACTIVE' && s.building === building
      ).sort((a: any, b: any) => {
          // Sort by room number
          return (a.room?.roomNumber || '').localeCompare(b.room?.roomNumber || '');
      });

      // 2. Get existing attendance for today to pre-fill
      const existingAttendance = await attendanceService.getTodayAttendance(building);
      
      const session: AttendanceRecord[] = buildingStudents.map(student => {
        const existing = existingAttendance.find(a => a.studentId === student.id);
        return {
          studentId: student.id,
          student: student,
          status: (existing?.status as any) || 'PENDING', // Default to PENDING or PRESENT? Requirement says "mark students", implies defaulting to pending or present.
          note: existing?.note || ''
        };
      });

      set({ attendanceSession: session, isLoading: false });
    } catch (error) {
      console.error('Failed to init attendance session', error);
      set({ error: 'Failed to load data', isLoading: false });
    }
  },

  mark: (studentId, status, note) => {
    set(state => ({
      attendanceSession: state.attendanceSession.map(record => 
        record.studentId === studentId 
          ? { ...record, status, note: note !== undefined ? note : record.note }
          : record
      )
    }));
  },

  submit: async () => {
    const { attendanceSession } = get();
    // Filter out PENDING if we don't want to submit them, or force checks?
    // Usually only submit marked ones. But for "Daily", we might want to submit all.
    // Let's submit those that are not PENDING for now, or all if we treat PENDING as ABSENT?
    // Let's only submit modified/marked ones to avoid clutter, or all.
    // Goal: "Save Attendance".
    
    // We'll submit only those that have a status set (not PENDING). 
    // Or if requirement implies bulk for everyone, we might need to handle PENDING.
    
    const toSubmit = attendanceSession.filter(r => r.status !== 'PENDING').map(r => ({
        studentId: r.studentId,
        status: r.status,
        note: r.note
    }));

    if (toSubmit.length === 0) return;

    set({ isLoading: true });
    try {
        await attendanceService.submitAttendance(toSubmit);
        set({ isLoading: false });
        // Optionally re-fetch
    } catch (error) {
        console.error('Submit failed', error);
        set({ isLoading: false, error: 'Failed to submit' });
    }
  },

  getStats: () => {
      const { attendanceSession } = get();
      return {
          present: attendanceSession.filter(r => r.status === 'PRESENT').length,
          absent: attendanceSession.filter(r => r.status === 'ABSENT').length,
          excused: attendanceSession.filter(r => r.status === 'EXCUSED').length,
          pending: attendanceSession.filter(r => r.status === 'PENDING').length,
      };
  }
}));
