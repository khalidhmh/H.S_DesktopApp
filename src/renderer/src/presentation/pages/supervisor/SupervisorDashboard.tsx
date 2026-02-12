import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@renderer/components/ui/card'
import { Button } from '@renderer/components/ui/button'
import { Badge } from '@renderer/components/ui/badge'
import { ClipboardCheck, MessageSquareWarning, Users, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useComplaintStore } from '../../../viewmodels/useComplaintStore'
// We might need student store for "Students in Building" count,
// or room store. Let's assume useRoomStore has a getter or similar,
// or just use a placeholder/mock for now as per "simple counts" requirement.
// Actually, `useRoomStore` has `rooms`. We can summing up `currentCount`.
import { useRoomStore } from '../../../viewmodels/useRoomStore'

export default function SupervisorDashboard() {
  const navigate = useNavigate()
  const { urgentCount, recentComplaints, fetchStats } = useComplaintStore()
  const { rooms, fetchRooms, selectedBuilding } = useRoomStore()

  useEffect(() => {
    fetchStats()
    // Assuming supervisor is assigned to a building, but for now fetching current selected building
    fetchRooms(selectedBuilding || 'المبنى أ')
  }, [selectedBuilding])

  const totalStudents = (rooms || []).reduce((acc, room) => acc + room.currentCount, 0)

  // Mock Attendance Status for now (Plan didn't specify store for it)
  const isAttendanceTaken = false

  return (
    <div className="space-y-8" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">مرحباً، المشرف</h1>
        <p className="text-muted-foreground mt-2">
          لوحة التحكم الخاصة بمشرف المبنى - {selectedBuilding}
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Attendance Status */}
        <Card
          className={`border-l-4 ${isAttendanceTaken ? 'border-l-green-500' : 'border-l-red-500'}`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">حالة التمام اليومي</CardTitle>
            <ClipboardCheck
              className={`h-4 w-4 ${isAttendanceTaken ? 'text-green-500' : 'text-red-500'}`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isAttendanceTaken ? 'تم الرصد' : 'لم يتم الرصد'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isAttendanceTaken ? 'اكتملت عملية تمام اليوم' : 'يرجى إجراء التمام اليومي'}
            </p>
          </CardContent>
        </Card>

        {/* Urgent Complaints */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">شكاوى عاجلة</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{urgentCount}</div>
            <p className="text-xs text-muted-foreground mt-1">تتطلب متابعة فورية</p>
          </CardContent>
        </Card>

        {/* Students in Building */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الطلاب في {selectedBuilding}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground mt-1">طالب مسجل في الغرف</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">إجراءات سريعة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            size="lg"
            className="h-24 text-lg gap-4 bg-primary hover:bg-primary/90"
            onClick={() => navigate('/attendance')}
          >
            <ClipboardCheck size={32} />
            بدء التمام اليومي
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-24 text-lg gap-4 border-2 border-orange-200 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300"
            onClick={() => navigate('/complaints')} // Might need to create this route or use / for now
          >
            <MessageSquareWarning size={32} className="text-orange-500" />
            تسجيل شكوى / مخالفة
          </Button>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold mb-4">النشاط الأخير</h2>
        <Card>
          <CardContent className="p-0">
            {(recentComplaints || []).length > 0 ? (
              <div className="divide-y">
                {(recentComplaints || []).map((complaint) => (
                  <div key={complaint.id} className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-100 p-2 rounded-full text-orange-600">
                        <MessageSquareWarning size={16} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{complaint.title}</p>
                        <p className="text-xs text-muted-foreground">
                          الطالب: {complaint.studentName} -{' '}
                          {new Date(complaint.createdAt).toLocaleDateString('ar-EG')}
                        </p>
                      </div>
                    </div>
                    <Badge variant={complaint.priority === 'HIGH' ? 'destructive' : 'secondary'}>
                      {complaint.priority === 'HIGH' ? 'عاجل' : 'عادي'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">لا يوجد نشاط حديث</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
