import crypto from 'crypto'

interface UserSession {
  userId: number
  email: string
  role: string
  createdAt: number
  lastActivity: number
}

// Store active sessions in memory
const activeSessions = new Map<string, UserSession>()

// Session timeout: 24 hours
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000

/**
 * Create a new session for authenticated user
 * @param user - User object from database
 * @returns Session ID
 */
export function createSession(user: {
  id: number
  email: string
  role: string
}): string {
  const sessionId = crypto.randomUUID()
  const now = Date.now()

  activeSessions.set(sessionId, {
    userId: user.id,
    email: user.email,
    role: user.role,
    createdAt: now,
    lastActivity: now
  })

  return sessionId
}

/**
 * Validate and retrieve session
 * @param sessionId - Session ID to validate
 * @returns User session or null if invalid
 */
export function getSession(sessionId: string | undefined): UserSession | null {
  if (!sessionId) return null

  const session = activeSessions.get(sessionId)
  if (!session) return null

  const now = Date.now()

  // Check if session expired
  if (now - session.lastActivity > SESSION_TIMEOUT) {
    activeSessions.delete(sessionId)
    return null
  }

  // Update last activity
  session.lastActivity = now
  activeSessions.set(sessionId, session)

  return session
}

/**
 * Destroy a session (logout)
 * @param sessionId - Session ID to destroy
 */
export function destroySession(sessionId: string): void {
  activeSessions.delete(sessionId)
}

/**
 * Check if user has required role
 * @param session - User session
 * @param allowedRoles - Array of allowed roles
 * @returns true if authorized
 */
export function isAuthorized(session: UserSession | null, allowedRoles: string[]): boolean {
  if (!session) return false
  return allowedRoles.includes(session.role)
}

/**
 * Middleware to require authentication and authorization
 * @param allowedRoles - Roles allowed to access this endpoint
 */
export function requireAuth(allowedRoles: string[]) {
  return (sessionId: string | undefined): UserSession => {
    const session = getSession(sessionId)

    if (!session) {
      throw new Error('Unauthorized: Invalid or expired session')
    }

    if (!isAuthorized(session, allowedRoles)) {
      throw new Error(`Forbidden: Required role: ${allowedRoles.join(' or ')}`)
    }

    return session
  }
}

/**
 * Get all active sessions (for monitoring)
 */
export function getActiveSessions(): number {
  return activeSessions.size
}

/**
 * Clear expired sessions (cleanup task)
 */
export function cleanupExpiredSessions(): void {
  const now = Date.now()
  for (const [sessionId, session] of activeSessions.entries()) {
    if (now - session.lastActivity > SESSION_TIMEOUT) {
      activeSessions.delete(sessionId)
    }
  }
}

// Run cleanup every hour
setInterval(cleanupExpiredSessions, 60 * 60 * 1000)
