import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription
} from '@renderer/components/ui/dialog'
import { Avatar, AvatarImage, AvatarFallback } from '@renderer/components/ui/avatar'
import { Badge } from '@renderer/components/ui/badge'
import { Button } from '@renderer/components/ui/button'
import { Phone, Mail, MapPin, Building, GraduationCap } from 'lucide-react'
import { Student } from '../../../../models'

interface StudentDetailModalProps {
  student: Student | null
  isOpen: boolean
  onClose: () => void
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@renderer/components/ui/table'
import { Label } from '@renderer/components/ui/label'
import { Input } from '@renderer/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'
import { usePenaltyStore } from '../../../viewmodels/usePenaltyStore'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'

interface StudentDetailModalProps {
  student: Student | null
  isOpen: boolean
  onClose: () => void
}

export function StudentDetailModal({ student, isOpen, onClose }: StudentDetailModalProps) {
  const { penalties, fetchStudentPenalties, issuePenalty, isLoading } = usePenaltyStore()
  const [isAdding, setIsAdding] = useState(false)
  const [newPenalty, setNewPenalty] = useState({ reason: '', type: 'WARNING' })

  useEffect(() => {
    if (isOpen && student) {
      fetchStudentPenalties(student.id)
    }
  }, [isOpen, student])

  const handleIssuePenalty = async () => {
    if (!student || !newPenalty.reason) return
    await issuePenalty(student.id, newPenalty)
    setIsAdding(false)
    setNewPenalty({ reason: '', type: 'WARNING' })
  }

  if (!student) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[700px] p-0 overflow-hidden bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl"
        dir="rtl"
      >
        {/* Header Background */}
        <div className="h-32 bg-gradient-to-r from-primary to-[#00152e] relative">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>

        <div className="px-6 pb-6 -mt-12 relative z-10">
          <div className="flex justify-between items-start mb-4">
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
              <AvatarImage src={student.photo_url || ''} />
              <AvatarFallback className="text-2xl font-bold bg-secondary text-primary">
                {student.name
                  ? student.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                  : 'ST'}
              </AvatarFallback>
            </Avatar>
            <Badge
              variant={student.status === 'ACTIVE' ? 'success' : 'secondary'}
              className="mt-14 text-sm px-4 py-1"
            >
              {student.status === 'ACTIVE' ? 'نشط' : 'إخلاء'}
            </Badge>
          </div>

          <div className="space-y-1 mb-6">
            <DialogTitle className="text-2xl font-bold text-primary">{student.name}</DialogTitle>
            <DialogDescription className="text-gray-500 font-medium">
              {student.universityId}
            </DialogDescription>
          </div>

          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="info">البيانات الشخصية</TabsTrigger>
              <TabsTrigger value="attendance">الغياب والحضور</TabsTrigger>
              <TabsTrigger
                value="penalties"
                className="text-red-600 data-[state=active]:text-red-700 data-[state=active]:bg-red-50"
              >
                المخالفات والعقوبات
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <InfoItem icon={GraduationCap} label="الكلية" value={student.college} />
                  <InfoItem
                    icon={Building}
                    label="السكن"
                    value={
                      student.room
                        ? `${student.room.building} - غرفة ${student.room.roomNumber}`
                        : 'غير مسكن'
                    }
                  />
                  <InfoItem icon={Phone} label="رقم الهاتف" value={student.phone} dir="ltr" />
                </div>
                <div className="space-y-4">
                  <InfoItem icon={MapPin} label="العنوان" value={student.city || 'غير محدد'} />
                  <InfoItem
                    icon={Phone}
                    label="ولي الأمر"
                    value={student.guardianContact || 'غير متوفر'}
                    dir="ltr"
                    className="text-red-500"
                  />
                  {/* <InfoItem icon={Mail} label="البريد الجامعي" value={student.email || '—'} className="text-xs" /> */}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="attendance">
              <div className="text-center py-10 text-muted-foreground bg-gray-50 rounded-lg border border-dashed">
                سجل الحضور غير متوفر حالياً
              </div>
            </TabsContent>

            <TabsContent value="penalties">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">سجل المخالفات</h3>
                  <Button
                    variant={isAdding ? 'ghost' : 'destructive'}
                    size="sm"
                    onClick={() => setIsAdding(!isAdding)}
                  >
                    {isAdding ? 'إلغاء' : 'تسجيل مخالفة'}
                  </Button>
                </div>

                {isAdding && (
                  <div className="bg-red-50 p-4 rounded-lg border border-red-100 space-y-3 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-2">
                      <Label>نوع المخالفة</Label>
                      <Select
                        value={newPenalty.type}
                        onValueChange={(v) => setNewPenalty({ ...newPenalty, type: v })}
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="WARNING">تنبيه شفهي</SelectItem>
                          <SelectItem value="WRITTEN_WARNING">إنذار كتابي</SelectItem>
                          <SelectItem value="FINE">غرامة مالية</SelectItem>
                          <SelectItem value="DISMISSAL">فصل نهائي</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>سبب المخالفة</Label>
                      <Input
                        placeholder="اكتب تفاصيل المخالفة..."
                        value={newPenalty.reason}
                        onChange={(e) => setNewPenalty({ ...newPenalty, reason: e.target.value })}
                        className="bg-white"
                      />
                    </div>
                    <Button
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                      onClick={handleIssuePenalty}
                    >
                      تأكيد المخالفة
                    </Button>
                  </div>
                )}

                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="text-right">التاريخ</TableHead>
                        <TableHead className="text-right">نوع العقوبة</TableHead>
                        <TableHead className="text-right w-[50%]">السبب</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-4">
                            جاري التحميل...
                          </TableCell>
                        </TableRow>
                      ) : penalties.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                            لا يوجد مخالفات مسجلة 👏
                          </TableCell>
                        </TableRow>
                      ) : (
                        penalties.map((p) => (
                          <TableRow key={p.id}>
                            <TableCell>
                              {format(new Date(p.date), 'dd/MM/yyyy', { locale: ar })}
                            </TableCell>
                            <TableCell>
                              <Badge variant={p.type === 'WARNING' ? 'outline' : 'destructive'}>
                                {p.type === 'WARNING'
                                  ? 'تنبيه'
                                  : p.type === 'WRITTEN_WARNING'
                                    ? 'إنذار'
                                    : p.type === 'FINE'
                                      ? 'غرامة'
                                      : 'فصل'}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium text-sm text-gray-700">
                              {p.reason}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 flex justify-end gap-2 border-t pt-4">
            <Button variant="outline" onClick={onClose}>
              إغلاق
            </Button>
            <Button variant="default">تعديل البيانات</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function InfoItem({ icon: Icon, label, value, dir, className }: any) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-md transition-all group">
      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
        <Icon size={18} className="text-primary" />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
        <p className={`text-sm font-semibold text-gray-700 ${className}`} dir={dir}>
          {value}
        </p>
      </div>
    </div>
  )
}
