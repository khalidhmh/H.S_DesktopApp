import React, { useEffect } from 'react'
import { useNotificationStore } from '../../../viewmodels/useNotificationStore'
import type { NotificationType } from '../../../viewmodels/useNotificationStore'
import { Card, CardContent } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Bell, UserPlus, AlertTriangle, Settings, Megaphone, CheckCheck } from 'lucide-react'
import { formatDistanceToNow, isToday, isYesterday, isThisWeek } from 'date-fns'
import { ar } from 'date-fns/locale'

export default function NotificationsPage() {
    const { notifications, unreadCount, isLoading, fetchNotifications, markAsRead, markAllAsRead } =
        useNotificationStore()

    useEffect(() => {
        fetchNotifications()
    }, [])

    const getTypeIcon = (type: NotificationType) => {
        switch (type) {
            case 'NEW_STUDENT':
                return <UserPlus className="text-blue-500" size={20} />
            case 'EMERGENCY':
                return <AlertTriangle className="text-red-500" size={20} />
            case 'SYSTEM_UPDATE':
                return <Settings className="text-gray-500" size={20} />
            case 'ANNOUNCEMENT':
                return <Megaphone className="text-purple-500" size={20} />
        }
    }

    const groupNotifications = () => {
        const today: typeof notifications = []
        const yesterday: typeof notifications = []
        const thisWeek: typeof notifications = []
        const older: typeof notifications = []

        notifications.forEach((notif) => {
            const date = new Date(notif.timestamp)
            if (isToday(date)) {
                today.push(notif)
            } else if (isYesterday(date)) {
                yesterday.push(notif)
            } else if (isThisWeek(date)) {
                thisWeek.push(notif)
            } else {
                older.push(notif)
            }
        })

        return { today, yesterday, thisWeek, older }
    }

    const grouped = groupNotifications()

    const renderNotificationGroup = (title: string, notifs: typeof notifications) => {
        if (notifs.length === 0) return null

        return (
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
                <div className="space-y-2">
                    {notifs.map((notif) => (
                        <Card
                            key={notif.id}
                            className={`cursor-pointer transition-all hover:shadow-md ${!notif.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-gray-50'
                                }`}
                            onClick={() => !notif.isRead && markAsRead(notif.id)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">{getTypeIcon(notif.type)}</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <h4 className="font-semibold text-base">{notif.title}</h4>
                                            {!notif.isRead && (
                                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            {formatDistanceToNow(new Date(notif.timestamp), {
                                                addSuffix: true,
                                                locale: ar
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6" dir="rtl">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#002147' }}>
                        مركز الإشعارات
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        جميع التنبيهات والإشعارات الخاصة بالنظام
                        {unreadCount > 0 && (
                            <span className="mr-2 text-blue-600 font-semibold">
                                ({unreadCount} غير مقروءة)
                            </span>
                        )}
                    </p>
                </div>

                {unreadCount > 0 && (
                    <Button
                        onClick={markAllAsRead}
                        className="gap-2"
                        style={{ backgroundColor: '#002147' }}
                    >
                        <CheckCheck size={16} />
                        تحديد الكل كمقروء
                    </Button>
                )}
            </div>

            {/* Notifications List */}
            {isLoading ? (
                <div className="text-center py-10 text-muted-foreground">جاري التحميل...</div>
            ) : notifications.length === 0 ? (
                <Card className="border-2 border-dashed">
                    <CardContent className="py-16 text-center">
                        <Bell size={48} className="mx-auto mb-4 text-gray-300" />
                        <p className="text-muted-foreground">لا توجد إشعارات</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {renderNotificationGroup('اليوم', grouped.today)}
                    {renderNotificationGroup('الأمس', grouped.yesterday)}
                    {renderNotificationGroup('هذا الأسبوع', grouped.thisWeek)}
                    {renderNotificationGroup('الأقدم', grouped.older)}

                    {notifications.every((n) => n.isRead) && (
                        <Card className="border-2 border-dashed border-green-200 bg-green-50">
                            <CardContent className="py-8 text-center">
                                <CheckCheck size={32} className="mx-auto mb-2 text-green-600" />
                                <p className="text-green-700 font-medium">تم قراءة جميع الإشعارات ✓</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
        </div>
    )
}
