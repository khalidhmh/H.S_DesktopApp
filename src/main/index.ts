import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { DashboardService } from './services/DashboardService'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // --- Students IPC ---
  ipcMain.handle('students:get-all', async () => {
    return await prisma.student.findMany({
      include: { room: true, attendance: true, penalties: true }
    })
  })

  ipcMain.handle('students:get-by-id', async (_, id) => {
    const studentId = Number(id)
    return await prisma.student.findUnique({
      where: { id: studentId },
      include: { room: true, attendance: true, penalties: true }
    })
  })

  ipcMain.handle('students:search', async (_, query) => {
    return await prisma.student.findMany({
      where: {
        OR: [{ name: { contains: query } }, { universityId: { contains: query } }]
      },
      include: { room: true }
    })
  })

  ipcMain.handle('students:add', async (_, data) => {
    // Basic create, assuming data matches schema
    return await prisma.student.create({ data })
  })

  ipcMain.handle('students:update-status', async (_, { id, status }) => {
    return await prisma.student.update({
      where: { id: Number(id) },
      data: { status }
    })
  })

  // --- Rooms IPC ---
  ipcMain.handle('rooms:get-all', async () => {
    return await prisma.room.findMany({
      include: { students: true }
    })
  })

  ipcMain.handle('rooms:get-by-building', async (_, building) => {
    return await prisma.room.findMany({
      where: { building },
      include: { students: true },
      orderBy: { roomNumber: 'asc' }
    })
  })

  ipcMain.handle('rooms:get-details', async (_, id) => {
    return await prisma.room.findUnique({
      where: { id: Number(id) },
      include: { students: true, faults: true }
    })
  })

  ipcMain.handle('rooms:update-status', async (_, { id, status }) => {
    try {
      return await prisma.room.update({
        where: { id: Number(id) },
        data: { status }
      })
    } catch (e) {
      console.error('Failed to update room status:', e)
      return null
    }
  })

  ipcMain.handle('rooms:search', async (_, query) => {
    return await prisma.room.findMany({
      where: {
        OR: [{ roomNumber: { contains: query } }, { building: { contains: query } }]
      },
      orderBy: { roomNumber: 'asc' },
      take: 5
    })
  })

  // --- Complaints IPC ---
  ipcMain.handle('complaints:get-all', async (_, filter) => {
    const complaints = await prisma.complaint.findMany({
      include: { student: true },
      orderBy: { createdAt: 'desc' }
    })
    const faults = await prisma.maintenanceFault.findMany({
      include: { room: true },
      orderBy: { createdAt: 'desc' }
    })

    const mappedComplaints = complaints.map((c) => ({
      id: c.id,
      type: 'COMPLAINT',
      title: c.title,
      description: c.description,
      status: c.status,
      priority: c.priority,
      studentName: c.student?.name,
      studentId: c.studentId,
      createdAt: c.createdAt
    }))

    const mappedFaults = faults.map((f) => ({
      id: f.id,
      type: 'MAINTENANCE',
      title: f.type,
      description: f.description,
      status: f.status,
      priority: f.priority,
      location:
        f.location ||
        (f.room ? `Building ${f.room.building} Room ${f.room.roomNumber}` : 'Unknown'),
      roomId: f.roomId,
      createdAt: f.createdAt
    }))

    let allIssues = [...mappedComplaints, ...mappedFaults]

    if (filter === 'PENDING') {
      allIssues = allIssues.filter((i) => i.status !== 'RESOLVED')
    } else if (filter === 'RESOLVED') {
      allIssues = allIssues.filter((i) => i.status === 'RESOLVED')
    }

    return allIssues.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  })

  ipcMain.handle('complaints:create', async (_, data) => {
    return await prisma.complaint.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        studentId: data.studentId,
        status: 'PENDING'
      }
    })
  })

  ipcMain.handle('complaints:create-fault', async (_, data) => {
    return await prisma.maintenanceFault.create({
      data: {
        type: data.type,
        description: data.description,
        priority: data.priority,
        roomId: data.roomId,
        location: data.location,
        status: 'PENDING'
      }
    })
  })

  ipcMain.handle('complaints:resolve', async (_, { id, type }) => {
    if (type === 'COMPLAINT') {
      return await prisma.complaint.update({
        where: { id: Number(id) },
        data: { status: 'RESOLVED' }
      })
    } else {
      return await prisma.maintenanceFault.update({
        where: { id: Number(id) },
        data: { status: 'RESOLVED' }
      })
    }
  })

  ipcMain.handle('complaints:get-stats', async () => {
    const urgentComplaints = await prisma.complaint.count({
      where: { priority: 'HIGH', status: { not: 'RESOLVED' } }
    })
    const urgentFaults = await prisma.maintenanceFault.count({
      where: { priority: 'HIGH', status: { not: 'RESOLVED' } }
    })
    return {
      urgentCount: urgentComplaints + urgentFaults,
      recent: []
    }
  })

  // --- Penalties IPC ---
  ipcMain.handle('penalties:get-all', async () => {
    return await prisma.penalty.findMany({
      include: {
        student: {
          select: { name: true, universityId: true }
        }
      },
      orderBy: { date: 'desc' }
    })
  })

  ipcMain.handle('penalties:add', async (_, { studentId, data }) => {
    return await prisma.penalty.create({
      data: {
        studentId,
        reason: data.reason,
        type: data.type,
        date: new Date()
      }
    })
  })

  ipcMain.handle('penalties:get-by-student', async (_, studentId) => {
    return await prisma.penalty.findMany({
      where: { studentId: Number(studentId) },
      orderBy: { date: 'desc' }
    })
  })

  // --- Attendance IPC ---
  // src/main/index.ts

  // --- Attendance Handlers ---

  // 1. جلب حضور اليوم (مع فلترة المبنى اختياري)
  ipcMain.handle('attendance:get-today', async (_, building) => {
    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0))
    const endOfDay = new Date(today.setHours(23, 59, 59, 999))

    const whereClause: any = {
      date: {
        gte: startOfDay,
        lte: endOfDay
      }
    }

    // إذا تم تحديد مبنى، نفلتر الطلاب الساكنين فيه فقط
    if (building) {
      whereClause.student = {
        room: {
          building: building
        }
      }
    }

    return await prisma.attendance.findMany({
      where: whereClause,
      include: {
        student: {
          include: { room: true }
        }
      },
      orderBy: { date: 'desc' }
    })
  })

  // 2. تسجيل الحضور (batch insert)
  ipcMain.handle('attendance:submit', async (_, records) => {
    // records عبارة عن مصفوفة من { studentId, status, note }
    return await prisma.$transaction(
      records.map((r: any) =>
        prisma.attendance.create({
          data: {
            studentId: r.studentId,
            status: r.status,
            note: r.note,
            date: new Date() // وقت التسجيل الحالي
          }
        })
      )
    )
  })

  // 3. سجل حضور طالب معين
  ipcMain.handle('attendance:get-history', async (_, studentId) => {
    return await prisma.attendance.findMany({
      where: { studentId: Number(studentId) },
      orderBy: { date: 'desc' },
      include: { student: true }
    })
  })

  // 4. كل السجلات
  ipcMain.handle('attendance:get-all-logs', async () => {
    return await prisma.attendance.findMany({
      orderBy: { date: 'desc' },
      include: {
        student: { include: { room: true } }
      }
    })
  })
  // --- Dashboard IPC ---
  ipcMain.handle('dashboard:get-stats', async (_, role) => {
    if (role === 'MANAGER') return await DashboardService.getManagerStats()
    return await DashboardService.getSupervisorStats()
  })

  // --- Settings IPC ---
  ipcMain.handle('settings:update-password', async (_, { userId, newPassword }) => {
    return await prisma.user.update({
      where: { id: Number(userId) },
      data: { password: newPassword }
    })
  })

  ipcMain.handle('settings:reset-system', async () => {
    return await prisma.$transaction([
      prisma.attendance.deleteMany(),
      prisma.penalty.deleteMany(),
      prisma.complaint.deleteMany(),
      prisma.maintenanceFault.deleteMany(),
      prisma.student.deleteMany()
    ])
  })

  ipcMain.handle('settings:backup', async () => {
    const timestamp = new Date().toISOString()
    const [users, students, rooms, attendance, penalties, complaints, maintenance] =
      await prisma.$transaction([
        prisma.user.findMany(),
        prisma.student.findMany(),
        prisma.room.findMany(),
        prisma.attendance.findMany(),
        prisma.penalty.findMany(),
        prisma.complaint.findMany(),
        prisma.maintenanceFault.findMany()
      ])

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
    }
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
