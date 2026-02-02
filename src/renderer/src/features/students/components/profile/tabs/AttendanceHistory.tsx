import React from 'react';
import { Student } from '../../data/mockStudents';
import { cn } from '@renderer/lib/utils';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface AttendanceHistoryProps {
    student: Student;
}

export const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({ student }) => {
    const history = student.attendanceHistory || [];

    const stats = {
        present: history.filter(d => d.status === 'present').length,
        absent: history.filter(d => d.status === 'absent').length,
        pending: history.filter(d => d.status === 'pending').length,
    };

    const statusColors = {
        present: 'bg-green-500',
        absent: 'bg-red-500',
        pending: 'bg-gray-400',
    };

    return (
        <div className="space-y-6 text-right">
            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-green-50 rounded-lg border border-green-100 text-center">
                    <span className="block text-2xl font-bold text-green-700">{stats.present}</span>
                    <span className="text-xs text-green-600 uppercase font-semibold">حضور</span>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border border-red-100 text-center">
                    <span className="block text-2xl font-bold text-red-700">{stats.absent}</span>
                    <span className="text-xs text-red-600 uppercase font-semibold">غياب</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
                    <span className="block text-2xl font-bold text-gray-700">{stats.pending}</span>
                    <span className="text-xs text-gray-500 uppercase font-semibold">قيد الانتظار</span>
                </div>
            </div>

            {/* Calendar Grid Visualization */}
            <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">سجل النشاط الحديث</h3>
                <div className="grid grid-cols-7 gap-2" dir="ltr"> {/* Calendar usually stays LTR or grids need careful RTL, usually visuals are fine LTR even in Arabic context unless strictly required */}
                    {/* Headers */}
                    {['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'].map(day => (
                        <div key={day} className="text-center text-xs font-semibold text-gray-400 py-1">{day}</div>
                    ))}

                    {history.map((day, idx) => (
                        <div key={idx} className="flex flex-col items-center p-2 border border-gray-100 rounded-lg hover:shadow-md transition-shadow bg-white">
                            <span className="text-[10px] text-gray-400 mb-1">{day.date.split('-')[2]}</span>
                            <div className={cn("w-3 h-3 rounded-full", statusColors[day.status])} title={day.status === 'present' ? 'حاضر' : 'غائب'} />
                        </div>
                    ))}

                    {history.length === 0 && (
                        <div className="col-span-7 py-8 text-center text-gray-400 italic">لا توجد سجلات حضور.</div>
                    )}
                </div>
            </div>
        </div>
    );
};
