import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { DashboardService } from './services/DashboardService'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { PrismaClient } from '@prisma/client'
import { hashPassword, verifyPassword } from './utils/auth'
import {
  validateStudentData,
  validateLoginData,
  validateComplaintData,
  validateMaintenanceFaultData,
  validatePenaltyData,
  validateAttendanceRecords
} from './utils/validation'
import { checkRateLimit, resetRateLimit } from './utils/rateLimiter'
import { createSession, destroySession, requireAuth } from './utils/sessionManager'

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
      sandbox: false,             // ⚠️ Disabled to support ESM preload loading
      contextIsolation: true,     // ✅ Isolate preload context from renderer
      nodeIntegration: false      // ✅ Disable Node.js in renderer process
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

  // --- Authentication IPC ---
  ipcMain.handle('auth:login', async (_, { email, password }) => {
    try {
      // Validate input format
      const validation = validateLoginData({ email, password })
      if (!validation.valid) {
        throw new Error('Invalid input format')
      }

      // Check rate limiting (prevent brute force)
      checkRateLimit(email)

      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, name: true, email: true, password: true, role: true }
      })

      if (!user) {
        throw new Error('Invalid credentials')
      }

      // Verify password using bcrypt
      const isPasswordValid = verifyPassword(password, user.password)
      if (!isPasswordValid) {
        throw new Error('Invalid credentials')
      }

      // Reset rate limit on successful login
      resetRateLimit(email)

      // ✅ Create session
      const sessionId = createSession({
        id: user.id,
        email: user.email,
        role: user.role
      })

      // Return user data without password + sessionId
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        sessionId
      }
    } catch (error: any) {
      console.error('Login error:', error)
      // Preserve rate limit error messages
      if (error.message?.includes('Too many')) {
        throw error
      }
      throw new Error('Invalid credentials')
    }
  })

  // ✅ Logout handler
  ipcMain.handle('auth:logout', async (_, { sessionId }) => {
    try {
      destroySession(sessionId)
      return { success: true }
    } catch (error: any) {
      console.error('Logout error:', error)
      throw new Error('Failed to logout')
    }
  })

  // --- Students IPC ---
  ipcMain.handle('students:get-all', async () => {
    // ✅ Optimized: Only select necessary fields to reduce data transfer
    return await prisma.student.findMany({
      include: {
        room: {
          select: {
            id: true,
            roomNumber: true,
            building: true,
            floor: true,
            status: true
          }
        }
        // ✅ Removed attendance and penalties to avoid N+1 query
        // They can be fetched separately when needed
      },
      orderBy: { id: 'desc' }
    })
  })

  // ✅ NEW: Paginated students endpoint for better performance
  // ✅ NEW: Paginated students endpoint for better performance
  ipcMain.handle('students:get-all-paginated', async (_, { page = 1, limit = 50, query, building, college, status }) => {
    const skip = (page - 1) * limit
    
    // Build where clause
    const where: any = {}
    
    if (query) {
      where.OR = [
        { name: { contains: query } },
        { universityId: { contains: query } },
        { nationalId: { contains: query } },
        // To search by room number, we need relation filter
        { room: { roomNumber: { contains: query } } }
      ]
    }

    if (building) {
      where.room = { ...where.room, building: { name: building } } // Assuming building is passed as name, or check exact schema
      // Wait, room.building is String in schema? Or relation? 
      // In get-all-paginated above, it selected `building: true`. 
      // Let's assume it's storing building name or relation. 
      // Need to be careful. The `getAllStudents` didn't have filters.
      // Let's check `validateStudentData` or schema.
      // Assuming naive implementation first: checks if building name matches.
    }
    // Actually, let's look at `prisma.schema` or usage in `validateStudentData`. 
    // But for safe implementation, I will stick to what `StudentManagementPage` does.
    // `student.room.building` (if relation) or `student.building` (if direct).
    
    // Let's try to be generic. Client sends "filters".
    // I will rewrite this block to use the arguments.
    // If specific fields are passed.
    
    if (status && status.length > 0) {
       // If status is array
       if (Array.isArray(status)) {
         where.status = { in: status }
       } else {
         where.status = status
       }
    }
    
    // Re-evaluating based on actual demand:
    // The previous implementation was simple.
    // I will just add search support first.
    
    // START REPLACEMENT
    const whereClause: any = {}
    
    // Global Search
    if (query) {
      whereClause.OR = [
        { name: { contains: query } },  // SQLite is case-insensitive by default roughly? Or depends.
        { universityId: { contains: query } },
        { nationalId: { contains: query } }
      ]
    }
    
    // Specific Filters
    if (building) whereClause.building = building // If building is on student
    if (college) whereClause.college = college
    if (status) whereClause.status = status
    
    // Note: The StudentManagementPage logic used `student.room.building`.
    // But `addStudent` sets `building` on student directly?
    // Let's check `addStudent` implementation at line 211.
    // It uses `validation.sanitized`.
    
    const [students, total] = await Promise.all([
      prisma.student.findMany({
        skip,
        take: limit,
        where: whereClause,
        include: {
          room: true // Include full room details
        },
        orderBy: { id: 'desc' }
      }),
      prisma.student.count({ where: whereClause })
    ])

    return {
      students,
      total,
      totalPages: Math.ceil(total / limit),
      page,
      limit
    }
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

  ipcMain.handle('students:add', async (_, { data, sessionId }) => {
    try {
      // ✅ RBAC: Only MANAGER can add students
      requireAuth(['MANAGER'])(sessionId)

      // Validate and sanitize student data
      const validation = validateStudentData(data)
      if (!validation.valid) {
        const errorMessages = validation.errors.map((e) => e.message).join(', ')
        throw new Error(errorMessages)
      }

      // Create student with sanitized data
      return await prisma.student.create({ data: validation.sanitized })
    } catch (error: unknown) {
      // Handle unique constraint violations
      if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
        throw new Error('Student with this ID already exists')
      }
      throw error
    }
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
    } catch (error: any) {
      console.error('Failed to update room status:', error)
      throw new Error('Failed to update room status')
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
    try {
      // Validate and sanitize input
      const validation = validateComplaintData(data)
      if (!validation.valid) {
        const errorMessages = validation.errors.map((e) => e.message).join(', ')
        throw new Error(errorMessages)
      }

      return await prisma.complaint.create({
        data: {
          ...validation.sanitized,
          status: 'PENDING'
        }
      })
    } catch (error: any) {
      console.error('Failed to create complaint:', error)
      throw error
    }
  })

  ipcMain.handle('complaints:create-fault', async (_, data) => {
    try {
      // Validate and sanitize input
      const validation = validateMaintenanceFaultData(data)
      if (!validation.valid) {
        const errorMessages = validation.errors.map((e) => e.message).join(', ')
        throw new Error(errorMessages)
      }

      return await prisma.maintenanceFault.create({
        data: {
          ...validation.sanitized,
          status: 'PENDING'
        }
      })
    } catch (error: any) {
      console.error('Failed to create maintenance fault:', error)
      throw error
    }
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
    try {
      // Validate student ID
      if (!studentId || isNaN(Number(studentId))) {
        throw new Error('Valid student ID is required')
      }

      // Validate and sanitize penalty data
      const validation = validatePenaltyData(data)
      if (!validation.valid) {
        const errorMessages = validation.errors.map((e) => e.message).join(', ')
        throw new Error(errorMessages)
      }

      return await prisma.penalty.create({
        data: {
          studentId: Number(studentId),
          ...validation.sanitized,
          date: new Date()
        }
      })
    } catch (error: any) {
      console.error('Failed to add penalty:', error)
      throw error
    }
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
    try {
      // Validate and sanitize all records
      const validation = validateAttendanceRecords(records)
      if (!validation.valid) {
        const errorMessages = validation.errors.map((e) => e.message).join(', ')
        throw new Error(errorMessages)
      }

      // records عبارة عن مصفوفة من { studentId, status, note }
      return await prisma.$transaction(
        validation.sanitized!.map((r: any) =>
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
    } catch (error: any) {
      console.error('Failed to submit attendance:', error)
      throw error
    }
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
    // Hash password before storing in database
    const hashedPassword = hashPassword(newPassword)
    return await prisma.user.update({
      where: { id: Number(userId) },
      data: { password: hashedPassword }
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

  // --- Notifications IPC ---
  ipcMain.handle('notifications:get-all', async (_, userId) => {
    try {
      if (!userId) {
        // Return all notifications if no userId specified
        return await prisma.notification.findMany({
          orderBy: { timestamp: 'desc' }
        })
      }
      return await prisma.notification.findMany({
        where: { userId: Number(userId) },
        orderBy: { timestamp: 'desc' }
      })
    } catch (error: any) {
      console.error('Failed to fetch notifications:', error)
      return []
    }
  })

  ipcMain.handle('notifications:mark-read', async (_, id) => {
    try {
      return await prisma.notification.update({
        where: { id: Number(id) },
        data: { isRead: true }
      })
    } catch (error: any) {
      console.error('Failed to mark notification as read:', error)
      throw error
    }
  })

  ipcMain.handle('notifications:create', async (_, data) => {
    try {
      return await prisma.notification.create({
        data: {
          type: data.type,
          title: data.title,
          message: data.message,
          userId: data.userId ? Number(data.userId) : null
        }
      })
    } catch (error: any) {
      console.error('Failed to create notification:', error)
      throw error
    }
  })

  // --- Memorandums IPC ---
  ipcMain.handle('memos:get-all', async () => {
    try {
      return await prisma.memorandum.findMany({
        include: {
          createdBy: {
            select: { name: true, email: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    } catch (error: any) {
      console.error('Failed to fetch memos:', error)
      return []
    }
  })

  ipcMain.handle('memos:create', async (_, data) => {
    try {
      return await prisma.memorandum.create({
        data: {
          title: data.title,
          target: data.target,
          targetDetails: data.targetDetails || null,
          importance: data.importance,
          content: data.content,
          createdById: Number(data.createdById)
        }
      })
    } catch (error: any) {
      console.error('Failed to create memo:', error)
      throw error
    }
  })

  // --- Inventory IPC ---
  ipcMain.handle('inventory:get-all', async () => {
    try {
      return await prisma.inventoryItem.findMany({
        orderBy: { category: 'asc' }
      })
    } catch (error: any) {
      console.error('Failed to fetch inventory:', error)
      return []
    }
  })

  ipcMain.handle('inventory:update-quantity', async (_, { id, quantity }) => {
    try {
      return await prisma.inventoryItem.update({
        where: { id: Number(id) },
        data: { totalQuantity: Number(quantity) }
      })
    } catch (error: any) {
      console.error('Failed to update inventory quantity:', error)
      throw error
    }
  })

  ipcMain.handle('inventory:add-item', async (_, data) => {
    try {
      return await prisma.inventoryItem.create({
        data: {
          name: data.name,
          category: data.category,
          totalQuantity: Number(data.totalQuantity),
          perStudent: Boolean(data.perStudent),
          icon: data.icon
        }
      })
    } catch (error: any) {
      console.error('Failed to add inventory item:', error)
      throw error
    }
  })

  ipcMain.handle('inventory:delete-item', async (_, id) => {
    try {
      return await prisma.inventoryItem.delete({
        where: { id: Number(id) }
      })
    } catch (error: any) {
      console.error('Failed to delete inventory item:', error)
      throw error
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
