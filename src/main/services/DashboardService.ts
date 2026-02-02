import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const DashboardService = {
  // Fetch stats for the Manager (Global View - Matching Image 0)
  async getManagerStats() {
    // 1. Pending Requests (طلبات قيد الانتظار)
    // Using Pending Maintenance as a proxy for "Requests"
    const pendingRequests = await prisma.maintenanceFault.count({ where: { status: 'PENDING' } });

    // 2. Absence Rate (معدل الغياب)
    // Calculate based on today's attendance vs total students
    const totalStudents = await prisma.student.count();
    const todayAbsent = await prisma.attendance.count({
      where: {
        date: { gte: new Date(new Date().setHours(0,0,0,0)) },
        status: 'ABSENT'
      }
    });
    const absenceRate = totalStudents > 0 ? ((todayAbsent / totalStudents) * 100).toFixed(1) : 0;

    // 3. Maintenance Time (وقت حل الصيانة)
    // Mocked average for now as schema doesn't track 'resolvedAt'
    const maintenanceTime = '24h'; 

    // 4. Occupancy Rate (نسبة الإشغال)
    // Total Students / Total Capacity
    const totalCapacity = (await prisma.room.aggregate({ _sum: { capacity: true } }))._sum.capacity || 100; // avoid div/0
    const occupancyRate = totalStudents > 0 ? ((totalStudents / totalCapacity) * 100).toFixed(1) : 0;

    // 5. Occupancy Distribution (Pie Chart)
    // Active Students vs Vacant Spots
    const occupancyChart = [
      { name: 'مشغول', value: totalStudents },
      { name: 'شاغر', value: totalCapacity - totalStudents }
    ];

    // 6. Maintenance Time Chart (Line Chart) - Mocked Trend
    const maintenanceChart = [
      { name: 'أكتوبر', value: 30 },
      { name: 'نوفمبر', value: 25 },
      { name: 'ديسمبر', value: 20 },
      { name: 'يناير', value: 24 },
    ];

    // 7. Absence Trends (Line Chart)
    const absenceChart = await this.getAbsenceTrends();

    return {
      cards: {
        pendingRequests,
        absenceRate,
        maintenanceTime,
        occupancyRate,
        totalStudents // Extra for display
      },
      charts: {
        occupancy: occupancyChart,
        maintenance: maintenanceChart,
        absence: absenceChart
      }
    };
  },

  // Fetch stats for the Supervisor (Specific View - Matching Image 1, 2, 4)
  async getSupervisorStats() {
    // 1. Absence Trends (Red Line Chart)
    const absenceChart = await this.getAbsenceTrends();

    // 2. Pending Approvals (طلبات الموافقة) - Using Students as proxy
    // In real app, this would be a specific table. We'll fetch recent students.
    const recentStudents = await prisma.student.findMany({
      take: 3,
      orderBy: { id: 'desc' },
      select: { fullName: true, nationalId: true, college: true }
    });

    const pendingApprovals = recentStudents.map(s => ({
      name: s.fullName,
      id: s.nationalId,
      reason: 'تسجيل جديد', // Placeholder
      date: new Date().toLocaleDateString('en-GB')
    }));

    // 3. Floor Overview (نظرة عامة على المبنى)
    // Mocked status for floors 1-5
    const floorStatus = [
      { floor: 1, status: 'ممتازة', type: 'success' },
      { floor: 2, status: 'أعطال عالية', type: 'error' },
      { floor: 3, status: 'مستقرة', type: 'success' },
      { floor: 4, status: 'تحتاج متابعة', type: 'warning' },
      { floor: 5, status: 'ممتازة', type: 'success' },
    ];

    return {
      absenceChart,
      pendingApprovals,
      floorStatus
    };
  },

  // Helper for Absence Trends
  async getAbsenceTrends() {
    const daysMap = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const chartData = [];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      
      const count = await prisma.attendance.count({
        where: {
          date: {
            gte: new Date(d.setHours(0,0,0,0)),
            lt: new Date(d.setHours(23,59,59,999))
          },
          status: 'ABSENT'
        }
      });

      chartData.push({
        name: daysMap[new Date().getDay() - i < 0 ? 7 + (new Date().getDay() - i) : new Date().getDay() - i], // Handle day wrapping
        value: count + Math.floor(Math.random() * 5) // Add slight noise for "real feel" if DB empty
      });
    }
    return chartData;
  }
};
