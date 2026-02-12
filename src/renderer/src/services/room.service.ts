import { logger } from '@shared/utils/logger'
export const RoomService = {
  /**
   * Get all rooms for a specific building
   */
  getRoomsByBuilding: async (buildingName: string) => {
    try {
      return await window.api.getRoomsByBuilding(buildingName)
    } catch (error) {
      logger.error(`Error fetching rooms for building ${buildingName}:`, error)
      throw error
    }
  },

  /**
   * Get detailed information for a specific room
   */
  getRoomDetails: async (roomId: number) => {
    try {
      return await window.api.getRoomDetails(roomId)
    } catch (error) {
      logger.error(`Error fetching room details for room ${roomId}:`, error)
      throw error
    }
  },

  /**
   * Update room status
   */
  updateRoomStatus: async (roomId: number, status: string) => {
    try {
      return await window.api.updateRoomStatus(roomId, status)
    } catch (error) {
      logger.error(`Error updating room status for room ${roomId}:`, error)
      throw error
    }
  },

  /**
   * Search rooms
   */
  searchRooms: async (query: string) => {
    try {
      return await window.api.searchRooms(query)
    } catch (error) {
      logger.error('Error searching rooms:', error)
      return []
    }
  }
}
