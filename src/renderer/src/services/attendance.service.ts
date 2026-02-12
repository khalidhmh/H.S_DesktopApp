// src/renderer/src/services/attendance.service.ts

export const AttendanceService = {
  // جلب سجلات حضور اليوم
  async getTodayAttendance(building?: string) {
    // @ts-ignore
    const records = await window.api.getTodayAttendance(building)
    // تحويل التاريخ من نص إلى كائن Date للعرض
    return records.map((r: any) => ({
      ...r,
      date: new Date(r.date)
    }))
  },

  // إرسال قائمة الحضور (تسجيل جماعي)
  async submitAttendance(records: { studentId: number; status: string; note?: string }[]) {
    // @ts-ignore
    return await window.api.submitAttendance(records)
  },

  // سجل حضور طالب معين
  async getAttendanceHistory(studentId: number) {
    // @ts-ignore
    const history = await window.api.getAttendanceHistory(studentId)
    return history.map((h: any) => ({
      ...h,
      date: new Date(h.date)
    }))
  },

  // كل السجلات (للتقارير)
  async getAllAttendanceLogs() {
    // @ts-ignore
    const logs = await window.api.getAllAttendanceLogs()
    return logs.map((l: any) => ({
      ...l,
      date: new Date(l.date)
    }))
  }
}
