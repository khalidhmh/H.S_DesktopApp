import { create } from 'zustand'

interface User {
  id: number
  name: string
  email: string
  role: 'MANAGER' | 'SUPERVISOR'
}

interface AuthState {
  currentUser: User | null
  isAuthenticated: boolean

  login: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  isAuthenticated: false,

  login: (user) => {
    set({ currentUser: user, isAuthenticated: true })
  },

  logout: () => {
    set({ currentUser: null, isAuthenticated: false })
  }
}))
