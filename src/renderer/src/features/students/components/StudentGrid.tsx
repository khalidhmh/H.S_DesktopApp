import React from 'react';
import { Student } from '../data/mockStudents';
import { StudentCard } from './StudentCard';

interface StudentGridProps {
    students: Student[];
    onStudentClick: (student: Student) => void;
}

export const StudentGrid: React.FC<StudentGridProps> = ({ students, onStudentClick }) => {
    if (students.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                <p className="text-xl font-semibold">لا يوجد طلاب</p>
                <p className="text-sm">جرب تغيير معايير التصفية أو البحث.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6" dir="rtl">
            {students.map((student) => (
                <StudentCard
                    key={student.id}
                    student={student}
                    onClick={onStudentClick}
                />
            ))}
        </div>
    );
};
