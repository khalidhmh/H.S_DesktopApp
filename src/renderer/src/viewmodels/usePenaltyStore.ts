import { create } from 'zustand';
import { PenaltyService } from '../services/penalty.service';
import { Penalty } from '@prisma/client';

interface PenaltyState {
  penalties: Penalty[];
  isLoading: boolean;
  
  fetchStudentPenalties: (studentId: number) => Promise<void>;
  issuePenalty: (studentId: number, data: { reason: string; type: string }) => Promise<void>;
  fetchAllPenalties: () => Promise<void>; // For the manager view
}

export const usePenaltyStore = create<PenaltyState>((set, get) => ({
  penalties: [],
  isLoading: false,

  fetchStudentPenalties: async (studentId) => {
    set({ isLoading: true });
    try {
      const penalties = await PenaltyService.getPenaltiesByStudent(studentId);
      set({ penalties, isLoading: false });
    } catch (error) {
      console.error('Error fetching student penalties:', error);
      set({ isLoading: false });
    }
  },

  issuePenalty: async (studentId, data) => {
    try {
      await PenaltyService.addPenalty(studentId, data);
      // Refresh list if we are currently viewing this student
      get().fetchStudentPenalties(studentId);
    } catch (error) {
      console.error('Error issuing penalty:', error);
      throw error;
    }
  },
  
  fetchAllPenalties: async () => {
    set({ isLoading: true });
    try {
        const penalties = await PenaltyService.getAllPenalties();
        set({ penalties, isLoading: false });
    } catch(error) {
        console.log("Error fetching all penalties:", error);
        set({isLoading: false});
    }
  }
}));
