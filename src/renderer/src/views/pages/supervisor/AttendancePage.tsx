import { useEffect, useState } from 'react';
import { useAttendanceStore } from '../../../viewmodels/useAttendanceStore';
import { Button } from '@renderer/components/ui/button';
import { Badge } from '@renderer/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@renderer/components/ui/avatar';
import { Input } from '@renderer/components/ui/input';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@renderer/components/ui/dialog';
import { Check, X, Clock, MessageSquare, Save, Building as BuildingIcon } from 'lucide-react';
import { cn } from '@renderer/lib/utils';


export default function AttendancePage() {
    const {
        attendanceSession,
        isLoading,
        building,
        initSession,
        mark,
        submit,
        getStats
    } = useAttendanceStore();

    const [noteModalOpen, setNoteModalOpen] = useState(false);
    const [currentStudentId, setCurrentStudentId] = useState<number | null>(null);
    const [noteText, setNoteText] = useState('');

    useEffect(() => {
        // Initialize for a default building or allow selection. 
        // For this task, we assume a building name or fetch it.
        // Let's rely on the store to handle data fetching, but we need to trigger it.
        // We'll hardcode 'Building A' for MVP or fetch distinct.
        initSession('Building A');
    }, []);

    const stats = getStats();

    // Quick Note Handling
    const openNoteModal = (studentId: number, currentNote?: string) => {
        setCurrentStudentId(studentId);
        setNoteText(currentNote || '');
        setNoteModalOpen(true);
    };

    const saveNote = () => {
        if (currentStudentId !== null) {
            // Find current status to preserve it
            const record = attendanceSession.find(r => r.studentId === currentStudentId);
            if (record) {
                mark(currentStudentId, record.status as any, noteText);
            }
        }
        setNoteModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20 relative">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">تسجيل الحضور اليومي</h1>
                            <div className="flex items-center text-gray-500 text-sm mt-1 gap-2">
                                <BuildingIcon size={14} />
                                <span>{building || 'جاري التحميل...'}</span>
                                <span className="mx-2">•</span>
                                <span>{new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            {/* Summary Bar */}
                            <div className="flex gap-2">
                                <StatsBadge label="حضور" count={stats.present} color="bg-green-100 text-green-700 hover:bg-green-200" />
                                <StatsBadge label="غياب" count={stats.absent} color="bg-red-100 text-red-700 hover:bg-red-200" />
                                <StatsBadge label="عذر" count={stats.excused} color="bg-yellow-100 text-yellow-700 hover:bg-yellow-200" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* List */}
            <main className="max-w-5xl mx-auto px-4 py-6 space-y-3">
                {isLoading ? (
                    <div className="text-center py-10 text-gray-500">جاري تحميل القائمة...</div>
                ) : attendanceSession.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">لا يوجد طلاب في هذا المبنى</div>
                ) : (
                    attendanceSession.map((record) => (
                        <div
                            key={record.studentId}
                            className={cn(
                                "group bg-white rounded-xl border p-4 flex items-center justify-between transition-all hover:shadow-md",
                                record.status === 'ABSENT' ? 'border-red-100 bg-red-50/30' :
                                    record.status === 'PRESENT' ? 'border-green-100 bg-green-50/30' :
                                        record.status === 'EXCUSED' ? 'border-yellow-100 bg-yellow-50/30' : 'border-gray-100'
                            )}
                        >
                            <div className="flex items-center gap-4 flex-1">
                                <Avatar className="h-12 w-12 border border-gray-100">
                                    <AvatarImage src={record.student.photo_url || ''} />
                                    <AvatarFallback>{record.student.name?.[0] || '?'}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className={cn("font-bold text-base",
                                        record.status === 'ABSENT' ? 'text-red-900' : 'text-gray-900'
                                    )}>
                                        {record.student.name}
                                    </h3>
                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                        <Badge variant="outline" className="bg-gray-50 text-gray-600 font-medium border-gray-200">
                                            غرفة {record.student.room?.roomNumber || record.student.room || '—'}
                                        </Badge>
                                        {record.note && (
                                            <span className="flex items-center text-amber-600 text-xs gap-1 bg-amber-50 px-2 py-0.5 rounded-full">
                                                <MessageSquare size={10} />
                                                {record.note}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <ToggleGroup
                                    value={record.status}
                                    onChange={(val) => mark(record.studentId, val as any)}
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={cn("h-10 w-10 shrink-0", record.note ? "text-amber-500 bg-amber-50" : "text-gray-400 hover:text-gray-600")}
                                    onClick={() => openNoteModal(record.studentId, record.note)}
                                >
                                    <MessageSquare size={18} />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </main>

            {/* Sticky Footer */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        تم رصد {stats.present + stats.absent + stats.excused} من {attendanceSession.length} طالب
                    </div>
                    <Button
                        size="lg"
                        onClick={submit}
                        className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 min-w-[200px] gap-2"
                        disabled={isLoading}
                    >
                        <Save size={18} />
                        حفظ سجل الحضور
                    </Button>
                </div>
            </div>

            {/* Note Modal */}
            <Dialog open={noteModalOpen} onOpenChange={setNoteModalOpen}>
                <DialogContent>
                    <DialogTitle>إضافة ملاحظة</DialogTitle>
                    <DialogDescription>
                        أضف ملاحظة بخصوص غياب أو عذر الطالب.
                    </DialogDescription>
                    <Input
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="اكتب الملاحظة هنا..."
                        autoFocus
                    />
                    <DialogFooter>
                        <Button onClick={saveNote}>حفظ</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function StatsBadge({ label, count, color }: { label: string, count: number, color: string }) {
    return (
        <div className={cn("px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 transition-colors", color)}>
            <span>{label}</span>
            <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs min-w-[20px] text-center">{count}</span>
        </div>
    );
}

function ToggleGroup({ value, onChange }: { value: string, onChange: (val: string) => void }) {
    return (
        <div className="flex bg-gray-100 p-1 rounded-lg gap-1">
            <ToggleButton
                active={value === 'PRESENT'}
                onClick={() => onChange('PRESENT')}
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-sm hover:text-green-600"
            >
                <Check size={18} />
                <span className="hidden sm:inline">حضور</span>
            </ToggleButton>

            <ToggleButton
                active={value === 'EXCUSED'}
                onClick={() => onChange('EXCUSED')}
                className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-sm hover:text-yellow-600"
            >
                <Clock size={16} />
                <span className="hidden sm:inline">عذر</span>
            </ToggleButton>

            <ToggleButton
                active={value === 'ABSENT'}
                onClick={() => onChange('ABSENT')}
                className="data-[state=active]:bg-red-500 data-[state=active]:text-white data-[state=active]:shadow-sm hover:text-red-600"
            >
                <X size={18} />
                <span className="hidden sm:inline">غياب</span>
            </ToggleButton>
        </div>
    );
}

function ToggleButton({ active, children, onClick, className }: any) {
    return (
        <button
            type="button"
            data-state={active ? 'active' : 'inactive'}
            onClick={onClick}
            className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all text-gray-500 hover:bg-white hover:shadow-sm",
                className
            )}
        >
            {children}
        </button>
    );
}
