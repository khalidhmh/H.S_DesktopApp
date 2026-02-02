import React, { useState, useEffect } from 'react';
import { LogOut, X, CheckCircle2, AlertTriangle } from 'lucide-react';
import { cn } from '@renderer/lib/utils';

interface EvacuationModalProps {
    isOpen: boolean;
    onClose: () => void;
    studentName: string;
}

export const EvacuationModal: React.FC<EvacuationModalProps> = ({ isOpen, onClose, studentName }) => {
    const [checks, setChecks] = useState({
        keys: false,
        custody: false,
        room: false
    });

    // Reset checks when modal opens
    useEffect(() => {
        if (isOpen) {
            setChecks({ keys: false, custody: false, room: false });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const allChecked = checks.keys && checks.custody && checks.room;

    const toggleCheck = (key: keyof typeof checks) => {
        setChecks(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleConfirm = () => {
        if (allChecked) {
            // Logic for evacuation
            console.log("Evacuating student:", studentName);
            onClose();
        }
    };

    const ChecklistItem = ({
        label,
        checked,
        onClick
    }: {
        label: string;
        checked: boolean;
        onClick: () => void;
    }) => (
        <div
            onClick={onClick}
            className={cn(
                "flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all duration-200",
                checked
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-white hover:border-orange-200"
            )}
        >
            <div className="flex items-center gap-3">
                <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                    checked ? "bg-green-500 text-white" : "bg-gray-200 text-gray-400"
                )}>
                    {checked && <CheckCircle2 size={16} />}
                </div>
                <span className={cn("font-bold", checked ? "text-green-800" : "text-gray-600")}>
                    {label}
                </span>
            </div>

            {/* Toggle visual */}
            <div className={cn(
                "w-12 h-6 rounded-full p-1 transition-colors relative",
                checked ? "bg-green-500" : "bg-gray-300"
            )}>
                <div className={cn(
                    "bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-200",
                    checked ? "translate-x-0" : "-translate-x-6" // RTL flip logic: translate negative moves left
                )} />
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" dir="rtl">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="bg-orange-50 p-4 border-b border-orange-100 flex justify-between items-center">
                    <div className="flex items-center gap-3 text-orange-700">
                        <div className="p-2 bg-orange-100 rounded-full">
                            <LogOut size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">إخلاء طرف طالب</h3>
                            <p className="text-xs text-orange-600/80">جاري إخلاء طرف: {studentName}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-orange-700 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6 flex items-start gap-3 text-yellow-800 text-sm">
                        <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                        <p>لا يمكن إتمام عملية الإخلاء إلا بعد التأكد من استلام كافة المتعلقات وسلامة الغرفة.</p>
                    </div>

                    <div className="space-y-3">
                        <ChecklistItem
                            label="تم استلام المفتاح"
                            checked={checks.keys}
                            onClick={() => toggleCheck('keys')}
                        />
                        <ChecklistItem
                            label="تم استلام العهدة كاملة"
                            checked={checks.custody}
                            onClick={() => toggleCheck('custody')}
                        />
                        <ChecklistItem
                            label="الغرفة سليمة ونظيفة"
                            checked={checks.room}
                            onClick={() => toggleCheck('room')}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3">
                    <button
                        onClick={handleConfirm}
                        disabled={!allChecked}
                        className={cn(
                            "flex-1 font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg",
                            allChecked
                                ? "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                        )}
                    >
                        <LogOut size={18} />
                        تأكيد الإخلاء
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-colors"
                    >
                        إلغاء
                    </button>
                </div>

            </div>
        </div>
    );
};
