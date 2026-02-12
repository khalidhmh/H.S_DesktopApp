import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRoomStore } from '../../../viewmodels/useRoomStore'
import type { RoomWithOccupancy, Wing } from '../../../viewmodels/useRoomStore'
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
  DialogDescription
} from '../../../components/ui/dialog'
import { Search, UserPlus, User } from 'lucide-react'

export default function RoomManagement() {
  const navigate = useNavigate()
  const {
    rooms,
    selectedFloor,
    selectedWing,
    searchQuery,
    isLoading,
    fetchRooms,
    setFloorFilter,
    setWingFilter,
    setSearchQuery,
    getFilteredRooms,
    getStats
  } = useRoomStore()

  const [selectedRoom, setSelectedRoom] = useState<RoomWithOccupancy | null>(null)

  useEffect(() => {
    fetchRooms()
  }, [])

  const filteredRooms = getFilteredRooms()
  const stats = getStats()

  const getRoomCardColor = (room: RoomWithOccupancy) => {
    if (room.occupiedBeds === room.capacity) return 'border-green-500 bg-green-50'
    if (room.occupiedBeds > 0) return 'border-yellow-500 bg-yellow-50'
    return 'border-gray-300'
  }

  const getOccupancyBadge = (room: RoomWithOccupancy) => {
    if (room.occupiedBeds === room.capacity) {
      return <Badge className="bg-green-500 text-white">ممتلئة</Badge>
    }
    if (room.occupiedBeds > 0) {
      return (
        <Badge variant="outline" className="border-yellow-500 text-yellow-700">
          {room.availableBeds} سرير متاح
        </Badge>
      )
    }
    return <Badge variant="outline">فارغة</Badge>
  }

  const getWingLabel = (wing: Wing) => {
    const labels = { A: 'أ', B: 'ب', C: 'ج', D: 'د' }
    return labels[wing]
  }

  const handleAddStudent = (roomId: number, bedNumber: number) => {
    const room = rooms.find((r) => r.id === roomId)
    if (room) {
      navigate(`/students/add?room=${room.number}&bed=${bedNumber}`)
    }
  }

  const handleViewProfile = (studentId: number) => {
    navigate(`/profile/${studentId}`)
  }

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#002147' }}>
            إدارة الغرف
          </h1>
          <p className="text-muted-foreground mt-1">
            إجمالي: {stats.totalRooms} غرفة | مشغول: {stats.occupiedRooms} | فارغ:{' '}
            {stats.emptyRooms}
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-muted-foreground">السعة الكلية</p>
          <p className="text-2xl font-bold" style={{ color: '#002147' }}>
            {stats.occupiedBeds}/{stats.totalBeds} سرير
          </p>
        </div>
      </div>

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
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
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
                  <User size={18} className="text-muted-foreground" />
                </div>

                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>جناح {getWingLabel(room.wing)} - الدور {room.floor}</p>
                  <p>{room.type === 'STANDARD' ? 'غرفة عادية' : 'غرفة مميزة'}</p>
                </div>

                <div className="pt-2 border-t space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">
                      {room.occupiedBeds}/{room.capacity}
                    </span>
                    {getOccupancyBadge(room)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Room Details Modal */}
      <Dialog open={!!selectedRoom} onOpenChange={() => setSelectedRoom(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-2xl">غرفة {selectedRoom?.number}</DialogTitle>
            <DialogDescription className="text-right">
              جناح {selectedRoom && getWingLabel(selectedRoom.wing)} - الدور{' '}
              {selectedRoom?.floor} |{' '}
              {selectedRoom?.type === 'STANDARD' ? 'غرفة عادية' : 'غرفة مميزة'} (
              {selectedRoom?.capacity} أسرة) | المشغول: {selectedRoom?.occupiedBeds}/
              {selectedRoom?.capacity}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <h3 className="font-semibold mb-4">الأسرة:</h3>
            <div
              className={`grid gap-4 ${selectedRoom?.capacity === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}
            >
              {selectedRoom &&
                Array.from({ length: selectedRoom.capacity }, (_, i) => {
                  const bedNumber = i + 1
                  const student = selectedRoom.students.find((s) => s.bedNumber === bedNumber)

                  return (
                    <Card
                      key={bedNumber}
                      className={`${student ? 'border-green-500' : 'border-dashed border-gray-300'}`}
                    >
                      <CardContent className="p-4">
                        <div className="text-center space-y-3">
                          <p className="font-semibold text-sm text-muted-foreground">
                            سرير {bedNumber}
                          </p>

                          {student ? (
                            <>
                              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                                {student.name
                                  .split(' ')
                                  .slice(0, 2)
                                  .map((n) => n[0])
                                  .join('')}
                              </div>
                              <div>
                                <p className="font-semibold">{student.name}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {student.college}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  الفرقة {student.level}
                                </p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewProfile(student.id)}
                                className="w-full"
                              >
                                عرض البروفايل
                              </Button>
                            </>
                          ) : (
                            <>
                              <div className="w-20 h-20 mx-auto rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                                <UserPlus size={32} className="text-gray-400" />
                              </div>
                              <p className="text-sm text-muted-foreground">سرير فارغ</p>
                              <Button
                                size="sm"
                                onClick={() => handleAddStudent(selectedRoom.id, bedNumber)}
                                className="w-full gap-2"
                                style={{ backgroundColor: '#002147' }}
                              >
                                <UserPlus size={16} />
                                إضافة طالب
                              </Button>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
