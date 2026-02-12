import { create } from 'zustand'

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

  fetchNotifications: () => void
  markAsRead: (id: number) => void
  markAllAsRead: () => void
  getUnreadCount: () => number
}

// Mock Data
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: 'NEW_STUDENT',
    title: 'طالب جديد تم تسجيله',
    message: 'تم تسجيل الطالب أحمد محمد في الغرفة A-201',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    isRead: false
  },
  {
    id: 2,
    type: 'EMERGENCY',
    title: 'تنبيه عاجل',
    message: 'تم الإبلاغ عن تسرب مياه في الطابق الثاني من مبنى أ',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    isRead: false
  },
  {
    id: 3,
    type: 'SYSTEM_UPDATE',
    title: 'تحديث النظام',
    message: 'تم تحديث نظام الإدارة إلى الإصدار 2.5.0',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    isRead: true
  },
  {
    id: 4,
    type: 'ANNOUNCEMENT',
    title: 'إعلان هام',
    message: 'اجتماع الطاقم الإداري غداً الساعة 10 صباحاً',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    isRead: false
  },
  {
    id: 5,
    type: 'NEW_STUDENT',
    title: 'طالب جديد تم تسجيله',
    message: 'تم تسجيل الطالب خالد علي في الغرفة B-105',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    isRead: true
  },
  {
    id: 6,
    type: 'EMERGENCY',
    title: 'حالة طوارئ',
    message: 'انقطاع التيار الكهربائي في مبنى ب، يتم العمل على الإصلاح',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    isRead: true
  },
  {
    id: 7,
    type: 'ANNOUNCEMENT',
    title: 'صيانة دورية',
    message: 'سيتم إجراء صيانة دورية لنظام التكييف يوم الجمعة',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    isRead: false
  },
  {
    id: 8,
    type: 'SYSTEM_UPDATE',
    title: 'نسخة احتياطية تلقائية',
    message: 'تم إنشاء نسخة احتياطية من قاعدة البيانات بنجاح',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    isRead: true
  },
  {
    id: 9,
    type: 'NEW_STUDENT',
    title: 'طالب جديد تم تسجيله',
    message: 'تم تسجيل الطالب سعيد حسن في الغرفة A-310',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    isRead: true
  },
  {
    id: 10,
    type: 'ANNOUNCEMENT',
    title: 'تعميم جديد',
    message: 'يرجى من جميع الطلاب الالتزام بمواعيد الحضور المسائي',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    isRead: false
  },
  {
    id: 11,
    type: 'EMERGENCY',
    title: 'تنبيه أمني',
    message: 'تم رصد شخص غير مصرح له في منطقة المبنى ج',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    isRead: true
  },
  {
    id: 12,
    type: 'SYSTEM_UPDATE',
    title: 'تحسينات جديدة',
    message: 'تم إضافة ميزة التقارير المتقدمة إلى النظام',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    isRead: true
  }
]

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: () => {
    set({ isLoading: true })
    // Simulate API call delay
    setTimeout(() => {
      const unread = MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length
      set({
        notifications: MOCK_NOTIFICATIONS,
        unreadCount: unread,
        isLoading: false
      })
    }, 300)
  },

  markAsRead: (id: number) => {
    const updated = get().notifications.map((notif) =>
      notif.id === id ? { ...notif, isRead: true } : notif
    )
    const unread = updated.filter((n) => !n.isRead).length
    set({
      notifications: updated,
      unreadCount: unread
    })
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
