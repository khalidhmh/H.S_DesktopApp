import bcrypt from 'bcryptjs'

/**
 * Hash a plaintext password using bcrypt
 * @param plainPassword - The password to hash
 * @returns Hashed password string
 */
export function hashPassword(plainPassword: string): string {
  const saltRounds = 10
  return bcrypt.hashSync(plainPassword, saltRounds)
}

/**
 * Verify a plaintext password against a hashed password
 * @param plainPassword - The password to verify
 * @param hashedPassword - The hashed password from database
 * @returns True if password matches, false otherwise
 */
export function verifyPassword(plainPassword: string, hashedPassword: string): boolean {
  return bcrypt.compareSync(plainPassword, hashedPassword)
}
