import { create } from 'zustand'
import { SettingsService } from '../services/settings.service'
import { useAuthStore } from './useAuthStore'

interface SettingsState {
  isLoading: boolean
  updatePassword: (newPassword: string) => Promise<void>
  resetSystem: () => Promise<void>
  backupDatabase: () => Promise<void>
}

export const useSettingsStore = create<SettingsState>((set) => ({
  isLoading: false,

  updatePassword: async (newPassword: string) => {
    set({ isLoading: true })
    try {
      const currentUser = useAuthStore.getState().currentUser
      if (!currentUser) throw new Error('No user logged in')

      await SettingsService.updatePassword(currentUser.id, newPassword)
    } finally {
      set({ isLoading: false })
    }
  },

  resetSystem: async () => {
    set({ isLoading: true })
    try {
      await SettingsService.resetSystem()
    } finally {
      set({ isLoading: false })
    }
  },

  backupDatabase: async () => {
    set({ isLoading: true })
    try {
      // Fetch full data dump
      const backupData = await SettingsService.getFullSystemBackup()

      // Create JSON blob
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)

      // Trigger download
      const link = document.createElement('a')
      link.href = url
      link.download = `system_backup_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } finally {
      set({ isLoading: false })
    }
  }
}))
