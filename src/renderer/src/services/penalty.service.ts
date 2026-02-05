import { db } from '../lib/db';
import { Penalty } from '@prisma/client';

export const PenaltyService = {
  addPenalty: async (studentId: number, data: { reason: string; type: string }): Promise<Penalty> => {
    try {
      return await db.penalty.create({
        data: {
          studentId,
          reason: data.reason,
          type: data.type,
          date: new Date()
        }
      });
    } catch (error) {
      console.error('Error adding penalty:', error);
      throw error;
    }
  },

  getPenaltiesByStudent: async (studentId: number): Promise<Penalty[]> => {
    try {
      return await db.penalty.findMany({
        where: { studentId },
        orderBy: { date: 'desc' }
      });
    } catch (error) {
      console.error('Error fetching student penalties:', error);
      throw error;
    }
  },

  getAllPenalties: async (): Promise<(Penalty & { student: { name: string; universityId: string } })[]> => {
    try {
      return await db.penalty.findMany({
        include: {
          student: {
            select: { name: true, universityId: true }
          }
        },
        orderBy: { date: 'desc' }
      });
    } catch (error) {
        console.error('Error fetching all penalties', error);
        throw error;
    }
  }
};
