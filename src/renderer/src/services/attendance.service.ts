import { db } from '../lib/db';

export const attendanceService = {
  // Get attendance records for today for a specific building (optional filtering) or all
  async getTodayAttendance(building?: string) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return await db.attendance.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        student: building ? {
          room: {
              building: building
          }
        } : undefined
      },
      include: {
        student: true
      }
    });
  },

  // Submit attendance (bulk create or update)
  async submitAttendance(records: { studentId: number; status: string; note?: string }[]) {
     const results = [];
     const startOfDay = new Date();
     startOfDay.setHours(0, 0, 0, 0);
     const endOfDay = new Date();
     endOfDay.setHours(23, 59, 59, 999);

     for (const record of records) {
         const existing = await db.attendance.findFirst({
             where: {
                 studentId: record.studentId,
                 date: { gte: startOfDay, lte: endOfDay }
             }
         });

         if (existing) {
             const updated = await db.attendance.update({
                 where: { id: existing.id },
                 data: { status: record.status, note: record.note }
             });
             results.push(updated);
         } else {
             const created = await db.attendance.create({
                 data: {
                     studentId: record.studentId,
                     status: record.status,
                     note: record.note
                 }
             });
             results.push(created);
         }
     }
     return results;
  },

  async getAttendanceHistory(studentId: number) {
    return await db.attendance.findMany({
      where: { studentId },
      orderBy: { date: 'desc' }
    });
  },

  async getAllAttendanceLogs() {
      return await db.attendance.findMany({
          include: {
              student: {
                  select: { name: true, universityId: true }
              }
          },
          orderBy: { date: 'desc' }
      });
  }
};
