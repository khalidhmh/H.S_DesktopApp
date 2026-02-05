import { db } from '../lib/db';

export const SettingsService = {
  updatePassword: async (userId: number, newPassword: string): Promise<void> => {
    try {
      await db.user.update({
        where: { id: userId },
        data: { password: newPassword },
      });
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  },

  resetSystem: async (): Promise<void> => {
    try {
      // Transaction to ensure all or nothing
      await db.$transaction([
        db.attendance.deleteMany(),
        db.penalty.deleteMany(),
        db.complaint.deleteMany(),
        db.maintenanceFault.deleteMany(),
        db.student.deleteMany(),
        // We do NOT delete Users or Rooms/Buildings usually, or maybe we do? 
        // Keeping Rooms is safer for strict "Student Data" reset. 
        // If "Reset System" implies full factory reset, we might clear Rooms too.
        // For now, I'll clear Student-related data which is the most volatile.
      ]);
    } catch (error) {
      console.error('Error resetting system:', error);
      throw error;
    }
  },

  // This is a "logical" backup that dumps all data to JSON
  // because direct file access to 'dev.db' from renderer might be restricted/complex without IPC.
  getFullSystemBackup: async () => {
    try {
      const timestamp = new Date().toISOString();
      const [users, students, rooms, attendance, penalties, complaints, maintenance] = await db.$transaction([
        db.user.findMany(),
        db.student.findMany(),
        db.room.findMany(),
        db.attendance.findMany(),
        db.penalty.findMany(),
        db.complaint.findMany(),
        db.maintenanceFault.findMany(),
      ]);

      return {
        metadata: {
          version: '1.0.0',
          timestamp,
          type: 'full_backup'
        },
        data: {
          users,
          students,
          rooms,
          attendance,
          penalties,
          complaints,
          maintenance
        }
      };
    } catch (error) {
      console.error('Error generating backup:', error);
      throw error;
    }
  }
};
