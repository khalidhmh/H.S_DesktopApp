import React, { useEffect } from 'react'
import { useMaintenanceStore } from '../../../viewmodels/useMaintenanceStore'
import type {
    MaintenanceStatus,
    MaintenancePriority,
    MaintenanceType
} from '../../../viewmodels/useMaintenanceStore'
import { Card, CardContent, CardFooter, CardHeader } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '../../../components/ui/select'
import { Button } from '../../../components/ui/button'
import { Wrench, Zap, Wind, Hammer, AlertCircle, MapPin, User, Clock, X } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ar } from 'date-fns/locale'

export default function MaintenancePage() {
    const {
        filteredRequests,
        statusFilter,
        priorityFilter,
        isLoading,
        fetchRequests,
        updateStatus,
        setStatusFilter,
        setPriorityFilter,
        clearFilters
    } = useMaintenanceStore()

    useEffect(() => {
        fetchRequests()
    }, [])

    const getTypeIcon = (type: MaintenanceType) => {
        switch (type) {
            case 'PLUMBING':
                return <AlertCircle className="text-blue-500" size={24} />
            case 'ELECTRICAL':
                return <Zap className="text-yellow-500" size={24} />
            case 'HVAC':
                return <Wind className="text-cyan-500" size={24} />
            case 'CARPENTRY':
                return <Hammer className="text-amber-700" size={24} />
            default:
                return <Wrench className="text-gray-500" size={24} />
        }
    }

    const getTypeLabel = (type: MaintenanceType) => {
        const labels = {
            PLUMBING: 'سباكة',
            ELECTRICAL: 'كهرباء',
            HVAC: 'تكييف',
            CARPENTRY: 'نجارة',
            OTHER: 'أخرى'
        }
        return labels[type]
    }

    const getPriorityColor = (priority: MaintenancePriority) => {
        switch (priority) {
            case 'HIGH':
                return 'bg-red-500'
            case 'MEDIUM':
                return 'bg-yellow-500'
            case 'LOW':
                return 'bg-blue-500'
        }
    }

    const getStatusLabel = (status: MaintenanceStatus) => {
        const labels = {
            PENDING: 'قيد الانتظار',
            IN_PROGRESS: 'قيد التنفيذ',
            DONE: 'مكتمل'
        }
        return labels[status]
    }

    const getStatusColor = (status: MaintenanceStatus) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800'
            case 'IN_PROGRESS':
                return 'bg-blue-100 text-blue-800'
            case 'DONE':
                return 'bg-green-100 text-green-800'
        }
    }

    return (
        <div className="p-6 space-y-6" dir="rtl">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#002147' }}>
                    طلبات الصيانة الفنية
                </h1>
                <p className="text-muted-foreground mt-2">
                    إدارة ومتابعة طلبات الصيانة الفنية (سباكة، كهرباء، تكييف، نجارة)
                </p>
            </div>

            {/* Filter Bar */}
            <Card className="border-2" style={{ borderColor: '#F2C94C' }}>
                <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex-1 min-w-[200px]">
                            <label className="text-sm font-medium mb-2 block">حالة الطلب</label>
                            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as any)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">الكل</SelectItem>
                                    <SelectItem value="PENDING">قيد الانتظار</SelectItem>
                                    <SelectItem value="IN_PROGRESS">قيد التنفيذ</SelectItem>
                                    <SelectItem value="DONE">مكتمل</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex-1 min-w-[200px]">
                            <label className="text-sm font-medium mb-2 block">الأولوية</label>
                            <Select value={priorityFilter} onValueChange={(val) => setPriorityFilter(val as any)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">الكل</SelectItem>
                                    <SelectItem value="HIGH">عالية</SelectItem>
                                    <SelectItem value="MEDIUM">متوسطة</SelectItem>
                                    <SelectItem value="LOW">منخفضة</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-end">
                            <Button
                                variant="outline"
                                onClick={clearFilters}
                                className="gap-2"
                                disabled={statusFilter === 'ALL' && priorityFilter === 'ALL'}
                            >
                                <X size={16} />
                                مسح الفلاتر
                            </Button>
                        </div>

                        <div className="mr-auto text-sm text-muted-foreground">
                            عدد النتائج: <span className="font-bold">{filteredRequests.length}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Request Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading ? (
                    <div className="col-span-full text-center py-10 text-muted-foreground">جاري التحميل...</div>
                ) : filteredRequests.length === 0 ? (
                    <div className="col-span-full text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">
                        لا توجد طلبات صيانة تطابق الفلاتر المحددة
                    </div>
                ) : (
                    filteredRequests.map((request) => (
                        <Card
                            key={request.id}
                            className="flex flex-col relative overflow-hidden group hover:shadow-lg transition-all"
                        >
                            {/* Priority Indicator Bar */}
                            <div className={`absolute top-0 right-0 w-1 h-full ${getPriorityColor(request.priority)}`} />

                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        {getTypeIcon(request.type)}
                                        <div>
                                            <Badge variant="outline" className="mb-1">
                                                {request.roomNumber}
                                            </Badge>
                                            <p className="text-xs text-muted-foreground">{getTypeLabel(request.type)}</p>
                                        </div>
                                    </div>
                                    <Badge className={getStatusColor(request.status)} variant="secondary">
                                        {getStatusLabel(request.status)}
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="flex-grow space-y-3">
                                <div>
                                    <h3 className="font-semibold text-base mb-1">{request.title}</h3>
                                    <p className="text-sm text-gray-600 line-clamp-2">{request.description}</p>
                                </div>

                                <div className="flex flex-col gap-1.5 text-xs text-muted-foreground pt-3 border-t">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={14} />
                                        <span>{request.building}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User size={14} />
                                        <span>{request.reportedBy}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} />
                                        <span>
                                            {formatDistanceToNow(new Date(request.reportedAt), {
                                                addSuffix: true,
                                                locale: ar
                                            })}
                                        </span>
                                    </div>
                                    {request.assignedTo && (
                                        <div className="flex items-center gap-2 text-blue-600">
                                            <Wrench size={14} />
                                            <span>المسؤول: {request.assignedTo}</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>

                            <CardFooter className="pt-3">
                                <Select
                                    value={request.status}
                                    onValueChange={(val) => updateStatus(request.id, val as MaintenanceStatus)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="تحديث الحالة" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PENDING">قيد الانتظار</SelectItem>
                                        <SelectItem value="IN_PROGRESS">قيد التنفيذ</SelectItem>
                                        <SelectItem value="DONE">مكتمل</SelectItem>
                                    </SelectContent>
                                </Select>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
