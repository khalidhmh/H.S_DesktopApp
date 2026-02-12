export const SettingsService = {
  updatePassword: async (userId: number, newPassword: string): Promise<void> => {
    try {
      await window.api.updatePassword(userId, newPassword)
    } catch (error) {
      console.error('Error updating password:', error)
      throw error
    }
  },

  resetSystem: async (): Promise<void> => {
    try {
      await window.api.resetSystem()
    } catch (error) {
      console.error('Error resetting system:', error)
      throw error
    }
  },

  getFullSystemBackup: async () => {
    try {
      return await window.api.getSystemBackup()
    } catch (error) {
      console.error('Error generating backup:', error)
      throw error
    }
  }
}
