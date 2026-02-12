interface LoginAttempt {
  count: number
  lastAttempt: number
  blockedUntil?: number
}

// Store login attempts in memory (will reset on app restart)
const loginAttempts = new Map<string, LoginAttempt>()

/**
 * Check if a login attempt should be allowed based on rate limiting
 * @param email - User email attempting to login
 * @param maxAttempts - Maximum failed attempts before blocking (default: 5)
 * @param windowMs - Time window for counting attempts in milliseconds (default: 1 minute)
 * @param blockDurationMs - How long to block after exceeding attempts (default: 5 minutes)
 * @throws Error if rate limit exceeded
 */
export function checkRateLimit(
  email: string,
  maxAttempts: number = 5,
  windowMs: number = 60000, // 1 minute
  blockDurationMs: number = 300000 // 5 minutes
): void {
  const now = Date.now()
  const attempt = loginAttempts.get(email)

  // Check if currently blocked
  if (attempt?.blockedUntil && now < attempt.blockedUntil) {
    const remainingSeconds = Math.ceil((attempt.blockedUntil - now) / 1000)
    throw new Error(`Too many login attempts. Please try again in ${remainingSeconds} seconds.`)
  }

  // No previous attempt - create new entry
  if (!attempt) {
    loginAttempts.set(email, { count: 1, lastAttempt: now })
    return
  }

  // Reset if time window has expired
  if (now - attempt.lastAttempt > windowMs) {
    loginAttempts.set(email, { count: 1, lastAttempt: now })
    return
  }

  // Increment attempt count
  const newCount = attempt.count + 1

  // Block if exceeded max attempts
  if (newCount > maxAttempts) {
    loginAttempts.set(email, {
      count: newCount,
      lastAttempt: now,
      blockedUntil: now + blockDurationMs
    })
    throw new Error(
      `Too many failed login attempts. Your account has been temporarily locked for 5 minutes.`
    )
  }

  // Update attempt count
  loginAttempts.set(email, { count: newCount, lastAttempt: now })
}

/**
 * Reset rate limit for a user after successful login
 * @param email - User email to reset
 */
export function resetRateLimit(email: string): void {
  loginAttempts.delete(email)
}

/**
 * Get current attempt count for a user (for debugging/monitoring)
 * @param email - User email
 * @returns Current attempt count or 0 if none
 */
export function getAttemptCount(email: string): number {
  return loginAttempts.get(email)?.count || 0
}

/**
 * Clear all rate limit data (useful for testing or admin reset)
 */
export function clearAllRateLimits(): void {
  loginAttempts.clear()
}
