import { create } from 'zustand'
import { logger } from '@shared/utils/logger'

export type NotificationType = 'NEW_STUDENT' | 'EMERGENCY' | 'SYSTEM_UPDATE' | 'ANNOUNCEMENT'

export interface Notification {
  id: number
  type: NotificationType
  title: string
  message: string
  timestamp: string
  isRead: boolean
}

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean

  fetchNotifications: () => Promise<void>
  markAsRead: (id: number) => Promise<void>
  markAllAsRead: () => void
  getUnreadCount: () => number
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true })
    try {
      // ✅ Now using real API instead of mock data
      const notifications = await window.api.getNotifications()
      const unread = notifications.filter((n) => !n.isRead).length
      
      set({
        notifications,
        unreadCount: unread,
        isLoading: false
      })
    } catch (error) {
      logger.error('Failed to fetch notifications:', error)
      set({ isLoading: false })
    }
  },

  markAsRead: async (id: number) => {
    try {
      // ✅ Call API to mark as read in database
      await window.api.markNotificationAsRead(id)
      
      const updated = get().notifications.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
      const unread = updated.filter((n) => !n.isRead).length
      set({
        notifications: updated,
        unreadCount: unread
      })
    } catch (error) {
      logger.error('Failed to mark notification as read:', error)
    }
  },

  markAllAsRead: () => {
    const updated = get().notifications.map((notif) => ({ ...notif, isRead: true }))
    set({
      notifications: updated,
      unreadCount: 0
    })
  },

  getUnreadCount: () => {
    return get().notifications.filter((n) => !n.isRead).length
  }
}))
