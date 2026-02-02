import React from 'react';
import { Student } from '../../data/mockStudents';

interface PersonalInfoProps {
    student: Student;
}

const InfoRow: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="flex flex-col py-2 border-b border-gray-100 last:border-0 text-right">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
        <span className="text-base text-[#002147] font-medium">{value}</span>
    </div>
);

export const PersonalInfo: React.FC<PersonalInfoProps> = ({ student }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 p-1">
            <InfoRow label="الاسم بالكامل" value={student.name} />
            <InfoRow label="الرقم القومي" value={student.nationalId} />
            <InfoRow label="الكلية" value={student.college} />
            <InfoRow label="الفرقة الدراسية" value={student.year} />
            <InfoRow label="رقم الهاتف" value={student.phone} />
            <InfoRow label="البريد الإلكتروني" value={student.email} />
            <InfoRow label="المحافظة" value={student.governorate} />
            <InfoRow label="الغرفة" value={`${student.roomNumber} (طابق ${student.floor})`} />
        </div>
    );
};
