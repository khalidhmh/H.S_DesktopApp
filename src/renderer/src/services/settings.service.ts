import { logger } from '@shared/utils/logger'
export const SettingsService = {
  updatePassword: async (userId: number, newPassword: string): Promise<void> => {
    try {
      await window.api.updatePassword(userId, newPassword)
    } catch (error) {
      logger.error('Error updating password:', error)
      throw error
    }
  },

  resetSystem: async (): Promise<void> => {
    try {
      await window.api.resetSystem()
    } catch (error) {
      logger.error('Error resetting system:', error)
      throw error
    }
  },

  getFullSystemBackup: async () => {
    try {
      return await window.api.getSystemBackup()
    } catch (error) {
      logger.error('Error generating backup:', error)
      throw error
    }
  }
}
