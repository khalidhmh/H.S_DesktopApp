import { useEffect, useState } from 'react'
import { useAttendanceStore } from '../../../viewmodels/useAttendanceStore'
import type { Room, Wing, AttendanceStatus } from '../../../viewmodels/useAttendanceStore'
import { Card, CardContent } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import { Badge } from '../../../components/ui/badge'
import { Input } from '../../../components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '../../../components/ui/dialog'
import { Check, X, AlertCircle, Search, Clock, Play, Save } from 'lucide-react'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'
import { toast } from 'sonner'

export default function AttendancePage() {
  const {
    rooms,
    selectedFloor,
    selectedWing,
    searchQuery,
    sessionActive,
    sessionStartTime,
    isLoading,
    fetchRooms,
    startSession,
    endSession,
    markStudent,
    setFloorFilter,
    setWingFilter,
    setSearchQuery,
    getFilteredRooms,
    getStats,
    isAttendanceTime
  } = useAttendanceStore()

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)

  useEffect(() => {
    fetchRooms()
  }, [])

  const filteredRooms = getFilteredRooms()
  const stats = getStats()

  const handleStartSession = () => {
    const allowed = isAttendanceTime()
    if (!allowed) {
      toast.error('التمام متاح فقط من الساعة 10:30 مساءً حتى 12:30 صباحاً')
      return
    }

    const started = startSession()
    if (started) {
      toast.success('تم بدء جلسة التمام اليومي')
    }
  }

  const handleEndSession = async () => {
    if (stats.markedStudents === 0) {
      toast.error('يرجى تحديد حضور الطلاب أولاً')
      return
    }

    await endSession()
    toast.success('تم حفظ وإنهاء التمام اليومي بنجاح!')
  }

  const getRoomCardColor = (room: Room) => {
    if (room.isComplete) return 'border-green-500 bg-green-50'
    const markedCount = room.students.filter((s) => s.status !== null).length
    if (markedCount > 0) return 'border-yellow-500 bg-yellow-50'
    return 'border-gray-300'
  }

  const getCompletionBadge = (room: Room) => {
    if (room.isComplete) {
      return <Badge className="bg-green-500 text-white">✓ مكتمل</Badge>
    }
    const markedCount = room.students.filter((s) => s.status !== null).length
    if (markedCount > 0) {
      return <Badge variant="outline" className="border-yellow-500 text-yellow-700">قيد التنفيذ</Badge>
    }
    return <Badge variant="outline">لم يبدأ</Badge>
  }

  const getWingLabel = (wing: Wing) => {
    const labels = { A: 'أ', B: 'ب', C: 'ج', D: 'د' }
    return labels[wing]
  }

  return (
    <div className="p-6 space-y-6 pb-32" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#002147' }}>
            التمام اليومي
          </h1>
          <p className="text-muted-foreground mt-1">
            {format(new Date(), 'EEEE، dd MMMM yyyy', { locale: ar })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {sessionActive ? (
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500 text-white gap-2">
                <Clock size={14} />
                الجلسة نشطة
              </Badge>
              {sessionStartTime && (
                <span className="text-sm text-muted-foreground">
                  بدأت {format(new Date(sessionStartTime), 'hh:mm a', { locale: ar })}
                </span>
              )}
            </div>
          ) : (
            <Button
              onClick={handleStartSession}
              className="gap-2"
              style={{ backgroundColor: '#002147' }}
            >
              <Play size={18} />
              بدء التمام
            </Button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {sessionActive && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">التقدم العام</p>
                <div className="flex items-center gap-4 text-sm">
                  <span>
                    <strong>{stats.completedRooms}</strong>/{stats.totalRooms} غرفة
                  </span>
                  <span>|</span>
                  <span>
                    <strong>{stats.markedStudents}</strong>/{stats.totalStudents} طالب
                  </span>
                </div>
              </div>
              <Badge className="bg-blue-600 text-white text-lg px-4 py-2">
                {stats.percentage}%
              </Badge>
            </div>
            <div className="mt-3 h-2 bg-white rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all"
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="space-y-4">
        {/* Floor Tabs */}
        <Tabs
          value={String(selectedFloor)}
          onValueChange={(val) => setFloorFilter(val === 'ALL' ? 'ALL' : Number(val))}
        >
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="ALL">الكل</TabsTrigger>
            <TabsTrigger value="1">الدور 1</TabsTrigger>
            <TabsTrigger value="2">الدور 2</TabsTrigger>
            <TabsTrigger value="3">الدور 3</TabsTrigger>
            <TabsTrigger value="4">الدور 4</TabsTrigger>
            <TabsTrigger value="5">الدور 5</TabsTrigger>
            <TabsTrigger value="6">الدور 6</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Wing Filters + Search */}
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            {(['ALL', 'A', 'B', 'C', 'D'] as const).map((wing) => (
              <Button
                key={wing}
                variant={selectedWing === wing ? 'default' : 'outline'}
                size="sm"
                onClick={() => setWingFilter(wing as Wing | 'ALL')}
                className={selectedWing === wing ? 'bg-[#002147]' : ''}
              >
                {wing === 'ALL' ? 'كل الأجنحة' : `جناح ${getWingLabel(wing as Wing)}`}
              </Button>
            ))}
          </div>

          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="ابحث برقم الغرفة أو اسم الطالب..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      {isLoading ? (
        <div className="text-center py-10 text-muted-foreground">جاري التحميل...</div>
      ) : filteredRooms.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">لا توجد غرف تطابق البحث</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filteredRooms.map((room) => (
            <Card
              key={room.id}
              className={`cursor-pointer hover:shadow-md transition-all border-2 ${getRoomCardColor(room)}`}
              onClick={() => setSelectedRoom(room)}
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold" style={{ color: '#002147' }}>
                    {room.number}
                  </div>
                  {room.isComplete && <Check className="text-green-600" size={20} />}
                </div>

                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>جناح {getWingLabel(room.wing)} - الدور {room.floor}</p>
                  <p>{room.type === 'STANDARD' ? 'غرفة عادية' : 'غرفة مميزة'}</p>
                </div>

                <div className="pt-2 border-t space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{room.completionRate}</span>
                    {getCompletionBadge(room)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Room Detail Modal */}
      <Dialog open={!!selectedRoom} onOpenChange={() => setSelectedRoom(null)}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              غرفة {selectedRoom?.number}
            </DialogTitle>
            <DialogDescription className="text-right">
              جناح {selectedRoom && getWingLabel(selectedRoom.wing)} - الدور {selectedRoom?.floor} |{' '}
              {selectedRoom?.type === 'STANDARD' ? 'غرفة عادية' : 'غرفة مميزة'} ({selectedRoom?.capacity} طلاب)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {selectedRoom?.students.map((student, idx) => (
              <div key={student.id} className="space-y-3 pb-4 border-b last:border-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-lg">{student.name}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      <span>{student.college}</span>
                      <span>•</span>
                      <span>المستوى {student.level}</span>
                    </div>
                  </div>
                  <Badge
                    variant={student.status ? 'default' : 'outline'}
                    className={
                      student.status === 'PRESENT'
                        ? 'bg-green-500'
                        : student.status === 'ABSENT'
                          ? 'bg-red-500'
                          : student.status === 'EXCUSED'
                            ? 'bg-yellow-500'
                            : ''
                    }
                  >
                    {student.status === 'PRESENT'
                      ? 'حاضر'
                      : student.status === 'ABSENT'
                        ? 'غائب'
                        : student.status === 'EXCUSED'
                          ? 'عذر'
                          : 'لم يحدد'}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button
                    size="lg"
                    variant={student.status === 'PRESENT' ? 'default' : 'outline'}
                    className={`h-14 ${student.status === 'PRESENT'
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'hover:bg-green-50'
                      }`}
                    onClick={() =>
                      selectedRoom && markStudent(selectedRoom.id, student.id, 'PRESENT')
                    }
                  >
                    <Check size={20} className="ml-2" />
                    حاضر
                  </Button>
                  <Button
                    size="lg"
                    variant={student.status === 'ABSENT' ? 'default' : 'outline'}
                    className={`h-14 ${student.status === 'ABSENT'
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'hover:bg-red-50'
                      }`}
                    onClick={() =>
                      selectedRoom && markStudent(selectedRoom.id, student.id, 'ABSENT')
                    }
                  >
                    <X size={20} className="ml-2" />
                    غائب
                  </Button>
                  <Button
                    size="lg"
                    variant={student.status === 'EXCUSED' ? 'default' : 'outline'}
                    className={`h-14 ${student.status === 'EXCUSED'
                        ? 'bg-yellow-500 hover:bg-yellow-600'
                        : 'hover:bg-yellow-50'
                      }`}
                    onClick={() =>
                      selectedRoom && markStudent(selectedRoom.id, student.id, 'EXCUSED')
                    }
                  >
                    <AlertCircle size={20} className="ml-2" />
                    عذر
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="flex gap-2" dir="rtl">
            <Button variant="outline" onClick={() => setSelectedRoom(null)}>
              إغلاق
            </Button>
            <Button
              onClick={() => {
                toast.success('تم حفظ البيانات')
                setSelectedRoom(null)
              }}
              className="bg-[#002147]"
            >
              حفظ والانتقال للتالي
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sticky Footer */}
      {sessionActive && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-lg p-4 z-10">
          <div className="max-w-screen-2xl mx-auto flex items-center justify-between" dir="rtl">
            <div className="flex items-center gap-6">
              <div className="text-sm">
                <span className="text-muted-foreground">التقدم: </span>
                <span className="font-bold text-xl" style={{ color: '#002147' }}>
                  {stats.completedRooms}/{stats.totalRooms}
                </span>
                <span className="text-muted-foreground"> غرفة</span>
              </div>
              <div className="h-8 w-px bg-gray-300" />
              <div className="text-sm">
                <span className="text-muted-foreground">الطلاب: </span>
                <span className="font-bold text-xl" style={{ color: '#002147' }}>
                  {stats.markedStudents}/{stats.totalStudents}
                </span>
              </div>
              <Badge
                variant="outline"
                className={
                  stats.percentage === 100
                    ? 'bg-green-50 text-green-700 border-green-200 text-lg px-3'
                    : 'bg-blue-50 text-blue-700 border-blue-200 text-lg px-3'
                }
              >
                {stats.percentage}%
              </Badge>
            </div>

            <Button
              onClick={handleEndSession}
              disabled={isLoading}
              size="lg"
              className="gap-2"
              style={{ backgroundColor: '#002147' }}
            >
              <Save size={20} />
              {isLoading ? 'جاري الحفظ...' : 'حفظ وإنهاء التمام'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
