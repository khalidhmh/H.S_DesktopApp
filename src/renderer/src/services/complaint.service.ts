import { db } from '../lib/db';
import { Complaint, MaintenanceFault, Student, Room } from '@prisma/client';

export type IssueType = 'COMPLAINT' | 'MAINTENANCE';

export interface Issue {
    id: number;
    type: IssueType;
    title: string; // Description for Maintenance
    description: string;
    status: string;
    priority: string;
    location?: string; // For Maintenance
    studentName?: string; // For Complaint
    studentId?: number;
    roomId?: number;
    createdAt: Date;
}

export const ComplaintService = {
  getAllIssues: async (filter?: string): Promise<Issue[]> => {
      try {
          // Fetch Complaints
          const complaints = await db.complaint.findMany({
              include: { student: true },
              orderBy: { createdAt: 'desc' }
          });

          // Fetch Maintenance Faults
          const faults = await db.maintenanceFault.findMany({
              include: { room: true },
              orderBy: { createdAt: 'desc' }
          });

          // Map to unified Issue interface
          const mappedComplaints: Issue[] = complaints.map(c => ({
              id: c.id,
              type: 'COMPLAINT',
              title: c.title,
              description: c.description,
              status: c.status,
              priority: c.priority,
              studentName: c.student?.name,
              studentId: c.studentId,
              createdAt: c.createdAt
          }));

          const mappedFaults: Issue[] = faults.map(f => ({
              id: f.id,
              type: 'MAINTENANCE',
              title: f.type, // Use type as title for maintenance
              description: f.description,
              status: f.status,
              priority: f.priority,
              location: f.location || (f.room ? `Building ${f.room.building} Room ${f.room.roomNumber}` : 'Unknown'),
              roomId: f.roomId,
              createdAt: f.createdAt
          }));

          let allIssues = [...mappedComplaints, ...mappedFaults];

          if (filter === 'PENDING') {
              allIssues = allIssues.filter(i => i.status !== 'RESOLVED');
          } else if (filter === 'RESOLVED') {
              allIssues = allIssues.filter(i => i.status === 'RESOLVED');
          }

          // Sort combined list by date desc
          return allIssues.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      } catch (error) {
          console.error('Error fetching issues:', error);
          throw error;
      }
  },

  createComplaint: async (data: { title: string; description: string; priority: string; studentId: number }): Promise<Complaint> => {
    return await db.complaint.create({
        data: {
            title: data.title,
            description: data.description,
            priority: data.priority,
            studentId: data.studentId,
            status: 'PENDING'
        }
    });
  },

  createMaintenanceFault: async (data: { type: string; description: string; priority: string; roomId?: number; location?: string }): Promise<MaintenanceFault> => {
      return await db.maintenanceFault.create({
          data: {
              type: data.type,
              description: data.description,
              priority: data.priority,
              roomId: data.roomId,
              location: data.location,
              status: 'PENDING'
          }
      });
  },

  resolveIssue: async (id: number, type: IssueType): Promise<void> => {
    try {
        if (type === 'COMPLAINT') {
            await db.complaint.update({
                where: { id },
                data: { status: 'RESOLVED' }
            });
        } else {
            await db.maintenanceFault.update({
                where: { id },
                data: { status: 'RESOLVED' }
            });
        }
    } catch (error) {
        console.error(`Error resolving issue ${id} (${type}):`, error);
        throw error;
    }
  },

  getStats: async () => {
        // ... (Keep existing or update logic later if needed, but for now we rely on getAllIssues from store)
        // But the store calls this. Let's update it to use the new unified logic or keep it simple.
        // The store logic for fetchStats uses ComplaintService.getStats
        // I will keep a simple version or reuse getAllIssues count
        
        // Let's implement correct counting
        const urgentComplaints = await db.complaint.count({ where: { priority: 'HIGH', status: { not: 'RESOLVED' } } });
        const urgentFaults = await db.maintenanceFault.count({ where: { priority: 'HIGH', status: { not: 'RESOLVED' } } });
        
        // Recent items - fetch top 3 of each and sort
        // For simplicity, let's just return counts and maybe let the store handle recent list via getAllIssues
        
        return {
            urgentCount: urgentComplaints + urgentFaults,
            // We can return empty recent array here as the Page will use getAllIssues
            recent: [] 
        };
  }
};
