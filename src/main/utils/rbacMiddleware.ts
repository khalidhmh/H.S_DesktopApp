import { IpcMainInvokeEvent } from 'electron'
import { getSession } from './sessionManager'

/**
 * RBAC Configuration Map
 * Defines which roles can access which IPC channels
 */
export const RBAC_CONFIG: Record<string, string[]> = {
  // Authentication - Public
  'auth:login': ['PUBLIC'],
  'auth:logout': ['PUBLIC'],

  // Students - MANAGER only for mutations
  'students:add': ['MANAGER'],
  'students:update-status': ['MANAGER'],
  'students:get-all': ['MANAGER', 'SUPERVISOR'],
  'students:get-all-paginated': ['MANAGER', 'SUPERVISOR'],
  'students:get-by-id': ['MANAGER', 'SUPERVISOR'],
  'students:search': ['MANAGER', 'SUPERVISOR'],

  // Rooms - MANAGER only for mutations
  'rooms:update-status': ['MANAGER'],
  'rooms:get-all': ['MANAGER', 'SUPERVISOR'],
  'rooms:get-by-building': ['MANAGER', 'SUPERVISOR'],
  'rooms:get-details': ['MANAGER', 'SUPERVISOR'],
  'rooms:search': ['MANAGER', 'SUPERVISOR'],

  // Complaints - Both roles
  'complaints:get-all': ['MANAGER', 'SUPERVISOR'],
  'complaints:create': ['MANAGER', 'SUPERVISOR'],
  'complaints:create-fault': ['MANAGER', 'SUPERVISOR'],
  'complaints:resolve': ['MANAGER', 'SUPERVISOR'],
  'complaints:get-stats': ['MANAGER', 'SUPERVISOR'],

  // Penalties - MANAGER only
  'penalties:add': ['MANAGER'],
  'penalties:get-all': ['MANAGER'],
  'penalties:get-by-student': ['MANAGER'],

  // Attendance - Both roles
  'attendance:get-today': ['MANAGER', 'SUPERVISOR'],
  'attendance:submit': ['MANAGER', 'SUPERVISOR'],
  'attendance:get-history': ['MANAGER', 'SUPERVISOR'],
  'attendance:get-all-logs': ['MANAGER'],

  // Dashboard - Both roles
  'dashboard:get-stats': ['MANAGER', 'SUPERVISOR'],

  // Settings - MANAGER only
  'settings:update-password': ['MANAGER', 'SUPERVISOR'],
  'settings:reset-system': ['MANAGER'],
  'settings:backup': ['MANAGER'],

  // Notifications - Both roles
  'notifications:get-all': ['MANAGER', 'SUPERVISOR'],
  'notifications:mark-read': ['MANAGER', 'SUPERVISOR'],
  'notifications:create': ['MANAGER'],

  // Memorandums - Both roles (MANAGER can create)
  'memos:get-all': ['MANAGER', 'SUPERVISOR'],
  'memos:create': ['MANAGER'],

  // Inventory - MANAGER only for mutations
  'inventory:get-all': ['MANAGER', 'SUPERVISOR'],
  'inventory:update-quantity': ['MANAGER'],
  'inventory:add-item': ['MANAGER'],
  'inventory:delete-item': ['MANAGER']
}

/**
 * Extract sessionId from IPC event arguments
 * Supports both { sessionId, ...data } and direct sessionId patterns
 */
function extractSessionId(args: any): string | undefined {
  if (!args) return undefined
  
  // Pattern 1: { sessionId, ...otherData }
  if (typeof args === 'object' && 'sessionId' in args) {
    return args.sessionId
  }
  
  // Pattern 2: Direct sessionId string
  if (typeof args === 'string') {
    return args
  }
  
  return undefined
}

/**
 * RBAC Middleware for IPC Handlers
 * Wraps existing handlers to add role-based access control
 */
export function withRBAC<T extends (...args: any[]) => any>(
  channel: string,
  handler: T
): (event: IpcMainInvokeEvent, ...args: Parameters<T>) => ReturnType<T> {
  return async (event: IpcMainInvokeEvent, ...args: any[]) => {
    const allowedRoles = RBAC_CONFIG[channel]

    // If no RBAC config, deny by default
    if (!allowedRoles) {
      throw new Error(`Unauthorized: No RBAC configuration for channel ${channel}`)
    }

    // PUBLIC endpoints don't need auth
    if (allowedRoles.includes('PUBLIC')) {
      return handler(event, ...args)
    }

    // Extract sessionId from arguments
    const sessionId = extractSessionId(args[0])
    const session = getSession(sessionId)

    if (!session) {
      throw new Error('Unauthorized: Invalid or expired session')
    }

    // Check if user has required role
    if (!allowedRoles.includes(session.role)) {
      throw new Error(
        `Forbidden: Required role: ${allowedRoles.join(' or ')}, but user has role: ${session.role}`
      )
    }

    // User is authorized, call handler
    return handler(event, ...args)
  }
}

/**
 * Helper to register IPC handler with RBAC
 */
export function registerSecureHandler(
  ipcMain: Electron.IpcMain,
  channel: string,
  handler: (event: IpcMainInvokeEvent, ...args: any[]) => any
): void {
  ipcMain.handle(channel, withRBAC(channel, handler))
}
