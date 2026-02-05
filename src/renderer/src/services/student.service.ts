import { db } from '../lib/db';
import { Student } from '../models';

export const StudentService = {
  getAllStudents: async (): Promise<Student[]> => {
    try {
      return await db.student.findMany({
        include: {
          attendance: true,
          penalties: true,
          room: true,
        },
      });
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  },

  getStudentById: async (id: number): Promise<Student | null> => {
    try {
      return await db.student.findUnique({
        where: { id },
        include: {
            attendance: true,
            penalties: true,
            room: true,
            complaints: true
        }
      });
    } catch (error) {
       console.error(`Error fetching student with id ${id}:`, error);
       throw error;
    }
  },

  addStudent: async (data: any): Promise<Student> => {
    try {
      return await db.student.create({
        data,
      });
    } catch (error) {
      console.error('Error adding student:', error);
      throw error;
    }
  },

  updateStudentStatus: async (id: number, status: string): Promise<Student> => {
    try {
      return await db.student.update({
        where: { id },
        data: { status },
      });
    } catch (error) {
      console.error(`Error updating student status for id ${id}:`, error);
      throw error;
    }
  },
  
  searchStudents: async (query: string) => {
    try {
      return await db.student.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { universityId: { contains: query } },
            { nationalId: { contains: query } }
          ]
        },
        include: {
          room: true
        },
        take: 5 // Limit results for header search
      });
    } catch (error) {
      console.error('Error searching students:', error);
      return [];
    }
  },

  getComplaintsByStudent: async (studentId: number) => {
      try {
          return await db.complaint.findMany({
              where: { studentId }
          });
      } catch (error) {
          console.error(`Error fetching complaints for student ${studentId}:`, error);
          throw error;
      }
  }
};
