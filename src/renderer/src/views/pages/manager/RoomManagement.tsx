import { useEffect, useState } from 'react';
import { useRoomStore } from '../../../viewmodels/useRoomStore';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@renderer/components/ui/card';
import { Button } from '@renderer/components/ui/button';
import { Progress } from '@renderer/components/ui/progress';
import { Badge } from '@renderer/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@renderer/components/ui/dialog';
import { Users, AlertCircle, CheckCircle, Home, Wrench } from 'lucide-react';
import { ScrollArea } from '@renderer/components/ui/scroll-area';

export default function RoomManagement() {
    const { rooms, selectedBuilding, isLoading, fetchRooms, setBuilding, getRoomDetails, selectedRoom } = useRoomStore();
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    useEffect(() => {
        fetchRooms(selectedBuilding);
    }, [selectedBuilding]);

    const handleOpenDetail = async (roomId: number) => {
        await getRoomDetails(roomId);
        setIsDetailOpen(true);
    };

    const getStatusColor = (current: number, capacity: number, faults: any[]) => {
        if (faults && faults.length > 0) return 'bg-orange-500 hover:bg-orange-600';
        if (current >= capacity) return 'bg-red-500 hover:bg-red-600';
        return 'bg-green-500 hover:bg-green-600';
    };

    const getStatusBadge = (current: number, capacity: number, faults: any[]) => {
        if (faults && faults.length > 0) return <Badge variant="outline" className="text-orange-600 border-orange-600 bg-orange-50">صيانة</Badge>;
        if (current >= capacity) return <Badge variant="destructive">ممتلئة</Badge>;
        return <Badge variant="default" className="bg-green-600">متاحة</Badge>;
    };

    const calculatePercentage = (current: number, capacity: number) => {
        return Math.min((current / capacity) * 100, 100);
    };

    return (
        <div className="space-y-6" dir="rtl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">إدارة الغرف</h1>
                <p className="text-muted-foreground mt-2">
                    عرض وإدارة حالة الغرف ونسب الإشغال في المباني السكنية.
                </p>
            </div>

            {/* Building Tabs */}
            <div className="flex gap-2 pb-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
                {['المبنى أ', 'المبنى ب', 'المبنى ج', 'المبنى د'].map((building) => (
                    <Button
                        key={building}
                        variant={selectedBuilding === building ? "default" : "outline"}
                        onClick={() => setBuilding(building)}
                        className="min-w-[100px]"
                    >
                        <Home className="ml-2 h-4 w-4" />
                        {building}
                    </Button>
                ))}
            </div>

            {/* Rooms Grid */}
            {isLoading && rooms.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <Card key={i} className="animate-pulse h-40 bg-muted" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {rooms.map((room) => {
                        const isMaintenance = room.status === 'MAINTENANCE';
                        const isFull = room.currentCount >= room.capacity;
                        // Status color logic: Maintenance (Orange) > Full (Red) > Available (Green)
                        let statusColor = 'bg-green-500 hover:bg-green-600';
                        if (isMaintenance) statusColor = 'bg-orange-500 hover:bg-orange-600';
                        else if (isFull) statusColor = 'bg-red-500 hover:bg-red-600';

                        return (
                            <Card
                                key={room.id}
                                className="hover:shadow-lg transition-shadow cursor-pointer relative overflow-hidden group"
                                onClick={() => handleOpenDetail(room.id)}
                            >
                                {/* Status Border Indicator */}
                                <div className={`absolute top-0 right-0 left-0 h-1 ${statusColor}`} />

                                <CardHeader className="pb-2 pt-6">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-xl">غرفة {room.roomNumber}</CardTitle>

                                        {isMaintenance ? (
                                            <Badge variant="outline" className="text-orange-600 border-orange-600 bg-orange-50">صيانة</Badge>
                                        ) : isFull ? (
                                            <Badge variant="destructive">ممتلئة</Badge>
                                        ) : (
                                            <Badge variant="default" className="bg-green-600">متاحة</Badge>
                                        )}
                                    </div>
                                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                                        الطابق {room.floor}
                                    </div>
                                </CardHeader>
                                <CardContent className="pb-2">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span>نسبة الإشغال</span>
                                        <span className="font-bold">{room.currentCount} / {room.capacity}</span>
                                    </div>
                                    <Progress value={calculatePercentage(room.currentCount, room.capacity)} className="h-2" />
                                </CardContent>
                                <CardFooter className="pt-2 text-xs text-muted-foreground flex justify-between items-center">
                                    {room.faults && room.faults.length > 0 ? (
                                        <span className="flex items-center text-orange-600 gap-1">
                                            <AlertCircle size={14} /> يوجد بلاغات صيانة
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1">
                                            <Users size={14} /> للطلاب
                                        </span>
                                    )}

                                    {/* Maintenance Toggle Button (Visible on Hover or if Valid) */}
                                    <div onClick={(e) => e.stopPropagation()}>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={`h-8 w-8 ${isMaintenance ? 'text-orange-600 bg-orange-100' : 'text-gray-400 hover:text-orange-600'}`}
                                            title={isMaintenance ? "إنهاء الصيانة" : "تحويل للصيانة"}
                                            onClick={async () => {
                                                const newStatus = isMaintenance ? 'AVAILABLE' : 'MAINTENANCE';
                                                await useRoomStore.getState().updateRoomStatus(room.id, newStatus);
                                                // Optimistic update or refetch is handled by store usually, but let's refetch to be safe
                                                useRoomStore.getState().fetchRooms(selectedBuilding);
                                            }}
                                        >
                                            <Wrench size={16} />
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>
            )}

            {/* Room Detail Modal */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="sm:max-w-[425px]" dir="rtl">
                    <DialogHeader>
                        <DialogTitle>تفاصيل الغرفة {selectedRoom?.roomNumber}</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                                <div>
                                    <div className="text-sm text-muted-foreground">المبنى</div>
                                    <div className="font-bold">{selectedRoom?.building}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">الطابق</div>
                                    <div className="font-bold">{selectedRoom?.floor}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">الحالة</div>
                                    <div className="font-bold">{selectedRoom && getStatusBadge(selectedRoom.currentCount, selectedRoom.capacity, selectedRoom.faults || [])}</div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2 flex items-center gap-2">
                                    <Users size={16} />
                                    الطلاب المقيمين
                                </h3>
                                <ScrollArea className="h-[200px] rounded-md border p-4">
                                    {selectedRoom?.students && selectedRoom.students.length > 0 ? (
                                        <div className="space-y-3">
                                            {selectedRoom.students.map(student => (
                                                <div key={student.id} className="flex justify-between items-center pb-2 border-b last:border-0 last:pb-0">
                                                    <div>
                                                        <div className="font-medium">{student.name}</div>
                                                        <div className="text-xs text-muted-foreground">{student.universityId}</div>
                                                    </div>
                                                    <Badge variant="outline">{student.college}</Badge>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center text-muted-foreground py-8">
                                            لا يوجد طلاب في هذه الغرفة
                                        </div>
                                    )}
                                </ScrollArea>
                            </div>

                            {selectedRoom?.faults && selectedRoom.faults.length > 0 && (
                                <div>
                                    <h3 className="font-semibold mb-2 flex items-center gap-2 text-orange-600">
                                        <AlertCircle size={16} />
                                        بلاغات الصيانة
                                    </h3>
                                    <div className="bg-orange-50 border border-orange-200 rounded-md p-3 text-sm">
                                        {selectedRoom.faults.map((fault: any) => (
                                            <div key={fault.id} className="mb-2 last:mb-0">
                                                • {fault.description}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
