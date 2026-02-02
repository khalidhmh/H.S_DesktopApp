import React from 'react';
import { Student } from '../../data/mockStudents';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@renderer/lib/utils';

interface PenaltiesListProps {
    student: Student;
}

export const PenaltiesList: React.FC<PenaltiesListProps> = ({ student }) => {
    const penalties = student.penaltiesHistory || [];

    if (penalties.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <CheckCircle2 size={48} className="mb-4 text-green-100" />
                <p>لا توجد جزاءات مسجلة. حالة الطالب ممتازة!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 text-right">
            {penalties.map((penalty) => (
                <div
                    key={penalty.id}
                    className={cn(
                        "flex items-start p-4 rounded-lg border-l-4 shadow-sm bg-white transition-all",
                        penalty.status === 'active'
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300 bg-gray-50 opacity-75"
                    )}
                >
                    <div className={cn("mt-1 ml-4", penalty.status === 'active' ? "text-red-500" : "text-gray-400")}>
                        <AlertTriangle size={24} />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h4 className={cn("font-bold text-lg", penalty.status === 'active' ? "text-red-700" : "text-gray-700")}>
                                {penalty.title}
                            </h4>
                            <span className={cn(
                                "text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider",
                                penalty.status === 'active' ? "bg-red-200 text-red-800" : "bg-gray-200 text-gray-600"
                            )}>
                                {penalty.status === 'active' ? 'نشط' : 'تم الحل'}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{penalty.description}</p>
                        <div className="text-xs text-gray-400 mt-2 font-mono">{penalty.date}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};
