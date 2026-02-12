export const StudentService = {
  // Get All
  getAllStudents: async () => {
    return await window.api.getAllStudents()
  },

  getStudentsPaginated: async (
    page: number,
    limit: number,
    filters?: any
  ) => {
    return await window.api.getStudentsPaginated(page, limit, filters)
  },

  // Get By ID
  getStudentById: async (id: number) => {
    return await window.api.getStudentById(id)
  },

  // Search
  searchStudents: async (query: string) => {
    return await window.api.searchStudents(query)
  },

  // Add
  addStudent: async (data: any) => {
    return await window.api.addStudent(data)
  },

  // Update Status
  updateStudentStatus: async (id: number, status: string) => {
    return await window.api.updateStudentStatus(id, status)
  }
}
