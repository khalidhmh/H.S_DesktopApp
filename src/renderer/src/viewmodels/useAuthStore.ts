import { create } from 'zustand'
import { logger } from '@shared/utils/logger'

interface User {
  id: number
  name: string
  email: string
  role: 'MANAGER' | 'SUPERVISOR'
  sessionId?: string // ✅ Added session ID
}

interface AuthState {
  currentUser: User | null
  isAuthenticated: boolean

  login: (user: User) => void
  logout: () => void
  restoreSession: () => void
}

// Session storage key
const SESSION_KEY = 'housing_system_session'

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  isAuthenticated: false,

  login: (user) => {
    // Save to localStorage for persistence
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user))
    } catch (error) {
      logger.error('Failed to save session:', error)
    }
    set({ currentUser: user, isAuthenticated: true })
  },

  logout: () => {
    // Clear localStorage
    try {
      localStorage.removeItem(SESSION_KEY)
    } catch (error) {
      logger.error('Failed to clear session:', error)
    }
    set({ currentUser: null, isAuthenticated: false })
  },

  restoreSession: () => {
    // Restore from localStorage on app start
    try {
      const savedSession = localStorage.getItem(SESSION_KEY)
      if (savedSession) {
        const user = JSON.parse(savedSession) as User
        set({ currentUser: user, isAuthenticated: true })
      }
    } catch (error) {
      logger.error('Failed to restore session:', error)
      localStorage.removeItem(SESSION_KEY)
    }
  }
}))
