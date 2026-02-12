export const PenaltyService = {
  addPenalty: async (studentId: number, data: { reason: string; type: string }) => {
    try {
      return await window.api.addPenalty(studentId, data)
    } catch (error) {
      console.error('Error adding penalty:', error)
      throw error
    }
  },

  getPenaltiesByStudent: async (studentId: number) => {
    try {
      const penalties = await window.api.getPenaltiesByStudent(studentId)
      // Dates usually come back as strings over IPC
      return penalties.map((p: any) => ({
        ...p,
        date: new Date(p.date)
      }))
    } catch (error) {
      console.error('Error fetching student penalties:', error)
      throw error
    }
  },

  getAllPenalties: async () => {
    try {
      const penalties = await window.api.getAllPenalties()
      return penalties.map((p: any) => ({
        ...p,
        date: new Date(p.date)
      }))
    } catch (error) {
      console.error('Error fetching all penalties', error)
      throw error
    }
  }
}
