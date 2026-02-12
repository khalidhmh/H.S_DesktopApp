import React, { useEffect, useState } from 'react'
import { useAttendanceStore } from '../../../viewmodels/useAttendanceStore'
import type { AttendanceRecord } from '../../../viewmodels/useAttendanceStore'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from '../../../components/ui/dialog'
import { Calendar, User, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'

export default function AttendanceArchivePage() {
    const { history, isLoading, fetchHistory } = useAttendanceStore()
    const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null)

    useEffect(() => {
        fetchHistory()
    }, [])

    const getAttendanceRate = (record: AttendanceRecord) => {
        return Math.round((record.presentCount / record.totalStudents) * 100)
    }

    const getRateColor = (rate: number) => {
        if (rate >= 95) return 'bg-green-100 text-green-800 border-green-200'
        if (rate >= 90) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
        return 'bg-red-100 text-red-800 border-red-200'
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PRESENT':
                return <CheckCircle size={14} className="text-green-600" />
            case 'ABSENT':
                return <XCircle size={14} className="text-red-600" />
            case 'EXCUSED':
                return <AlertCircle size={14} className="text-yellow-600" />
            default:
                return null
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'PRESENT':
                return 'حاضر'
            case 'ABSENT':
                return 'غائب'
            case 'EXCUSED':
                return 'غائب بعذر'
            default:
                return '-'
        }
    }

    return (
        <div className="p-6 space-y-6" dir="rtl">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#002147' }}>
                    أرشيف التمام اليومي
                </h1>
                <p className="text-muted-foreground mt-2">سجل التمام اليومي للأيام السابقة</p>
            </div>

            {/* History List */}
            {isLoading ? (
                <div className="text-center py-10 text-muted-foreground">جاري التحميل...</div>
            ) : history.length === 0 ? (
                <Card className="border-2 border-dashed">
                    <CardContent className="py-16 text-center">
                        <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
                        <p className="text-muted-foreground">لا يوجد سجلات سابقة</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {history.map((record) => {
                        const rate = getAttendanceRate(record)
                        return (
                            <Card
                                key={record.id}
                                className="cursor-pointer hover:shadow-lg transition-all"
                                onClick={() => setSelectedRecord(record)}
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="text-blue-500" size={20} />
                                            <CardTitle className="text-lg">
                                                {format(new Date(record.date), 'dd MMMM yyyy', { locale: ar })}
                                            </CardTitle>
                                        </div>
                                        <Badge className={`${getRateColor(rate)} border`}>{rate}%</Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <User size={14} />
                                        <span>المشرف: {record.supervisorName}</span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 text-center">
                                        <div className="bg-green-50 rounded-lg p-2">
                                            <p className="text-2xl font-bold text-green-700">{record.presentCount}</p>
                                            <p className="text-xs text-green-600">حاضر</p>
                                        </div>
                                        <div className="bg-red-50 rounded-lg p-2">
                                            <p className="text-2xl font-bold text-red-700">{record.absentCount}</p>
                                            <p className="text-xs text-red-600">غائب</p>
                                        </div>
                                        <div className="bg-yellow-50 rounded-lg p-2">
                                            <p className="text-2xl font-bold text-yellow-700">{record.excusedCount}</p>
                                            <p className="text-xs text-yellow-600">عذر</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                                        <Clock size={12} />
                                        <span>{format(new Date(record.takenAt), 'hh:mm a', { locale: ar })}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}

            {/* Detail Modal */}
            <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" dir="rtl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Calendar size={20} />
                            تفاصيل التمام اليومي
                        </DialogTitle>
                        <DialogDescription className="text-right">
                            {selectedRecord &&
                                format(new Date(selectedRecord.date), 'EEEE، dd MMMM yyyy', { locale: ar })}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedRecord && (
                        <div className="space-y-4">
                            {/* Summary Stats */}
                            <div className="grid grid-cols-4 gap-3">
                                <div className="bg-blue-50 rounded-lg p-3 text-center">
                                    <p className="text-2xl font-bold text-blue-700">
                                        {selectedRecord.totalStudents}
                                    </p>
                                    <p className="text-xs text-blue-600">إجمالي</p>
                                </div>
                                <div className="bg-green-50 rounded-lg p-3 text-center">
                                    <p className="text-2xl font-bold text-green-700">
                                        {selectedRecord.presentCount}
                                    </p>
                                    <p className="text-xs text-green-600">حاضر</p>
                                </div>
                                <div className="bg-red-50 rounded-lg p-3 text-center">
                                    <p className="text-2xl font-bold text-red-700">{selectedRecord.absentCount}</p>
                                    <p className="text-xs text-red-600">غائب</p>
                                </div>
                                <div className="bg-yellow-50 rounded-lg p-3 text-center">
                                    <p className="text-2xl font-bold text-yellow-700">
                                        {selectedRecord.excusedCount}
                                    </p>
                                    <p className="text-xs text-yellow-600">عذر</p>
                                </div>
                            </div>

                            {/* Student List */}
                            <div>
                                <h3 className="font-semibold mb-3">قائمة الطلاب:</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                                    {selectedRecord.students.map((student) => (
                                        <div
                                            key={student.id}
                                            className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50"
                                        >
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(student.status || '')}
                                                <div>
                                                    <p className="text-sm font-medium">{student.name}</p>
                                                    <p className="text-xs text-muted-foreground">{student.roomNumber}</p>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                                {getStatusLabel(student.status || '')}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer Info */}
                            <div className="flex items-center justify-between pt-3 border-t text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <User size={14} />
                                    <span>المشرف: {selectedRecord.supervisorName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={14} />
                                    <span>{format(new Date(selectedRecord.takenAt), 'hh:mm a', { locale: ar })}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
