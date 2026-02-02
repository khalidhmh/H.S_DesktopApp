import React from 'react';
import { Student } from '../../data/mockStudents';

interface GuardianInfoProps {
    student: Student;
}

const InfoRow: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="flex flex-col py-2 border-b border-gray-100 last:border-0 text-right">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
        <span className="text-base text-[#002147] font-medium">{value}</span>
    </div>
);

export const GuardianInfo: React.FC<GuardianInfoProps> = ({ student }) => {
    return (
        <div className="space-y-4 p-1 text-right">
            <h3 className="text-lg font-bold text-[#002147] mb-4">بيانات ولي الأمر</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <InfoRow label="اسم ولي الأمر" value={student.guardianName} />
                <InfoRow label="صلة القرابة" value={student.guardianRelation} />
                <InfoRow label="رقم هاتف ولي الأمر" value={student.guardianPhone} />
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-800">
                    <strong>ملاحظة:</strong> في حالات الطوارئ، يرجى محاولة التواصل مع الطالب أولاً قبل الاتصال بولي الأمر.
                </p>
            </div>
        </div>
    );
};
