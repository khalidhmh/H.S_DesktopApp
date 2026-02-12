import { useEffect, useState } from 'react'
import { useStudentStore } from '../../../viewmodels/useStudentStore'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../../components/ui/table'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar'
import { StudentDetailModal } from '../../components/modals/StudentDetailModal'
import { AddStudentModal } from '../../components/modals/AddStudentModal'
import { Search, Plus, Filter, Eye, Edit, Trash2 } from 'lucide-react'

export default function StudentManagement() {
  // تم إزالة useState المستقل للطلاب والاعتماد كلياً على الـ Store لضمان تزامن البيانات
  const { students, fetchStudents, isLoading, selectStudent, selectedStudent } = useStudentStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'EVACUATED'>('ALL')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  useEffect(() => {
    // fetchStudents الآن تنادي على window.api.getAllStudents() عبر الـ Store
    fetchStudents()
  }, [fetchStudents])

  // منطق الفلترة المعدل ليتوافق مع أسماء الحقول في قاعدة البيانات
  const filteredStudents = (students || []).filter((student) => {
    const matchesSearch =
      student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.universityId?.includes(searchQuery)

    const matchesStatus = statusFilter === 'ALL' || student.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleViewStudent = (student: any) => {
    selectStudent(student)
    setIsModalOpen(true)
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 text-right" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">سجل الطلاب</h1>
          <p className="text-gray-500 mt-2">بيانات الطلاب من قاعدة البيانات (Seeded Data)</p>
        </div>
        <Button
          className="gap-2 bg-secondary text-primary hover:bg-secondary/90"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={18} />
          إضافة طالب جديد
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="بحث بالاسم أو الرقم الجامعي..."
            className="pr-10 text-right"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 min-w-[200px]">
          <Filter className="text-gray-400" size={20} />
          <select
            className="w-full p-2 border rounded-md bg-background text-sm outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="ALL">جميع الحالات</option>
            <option value="ACTIVE">نشط</option>
            <option value="EVACUATED">مخلى طرفه</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="text-right">الطالب</TableHead>
              <TableHead className="text-right">معلومات السكن</TableHead>
              <TableHead className="text-right">الكلية</TableHead>
              <TableHead className="text-center">الحالة</TableHead>
              <TableHead className="text-center">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="h-10 w-40 bg-gray-100 rounded animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-6 w-16 mx-auto bg-gray-100 rounded-full animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-8 w-20 mx-auto bg-gray-100 rounded animate-pulse" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <TableRow key={student.id} className="group">
                  <TableCell className="font-medium text-right">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{student.name?.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-primary font-bold">{student.name}</p>
                        <p className="text-xs text-gray-500">{student.universityId}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{student.room?.building || 'غير مسكن'}</p>
                      {student.room && (
                        <p className="text-xs text-gray-500">غرفة {student.room.roomNumber}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{student.college}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={student.status === 'ACTIVE' ? 'default' : 'secondary'}>
                      {student.status === 'ACTIVE' ? 'نشط' : 'مخلى'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewStudent(student)}
                      >
                        <Eye size={16} className="text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit size={16} className="text-orange-500" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 size={16} className="text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <Search size={48} className="mb-4 opacity-20" />
                    <p className="text-lg font-medium">لا توجد بيانات طلاب حالياً</p>
                    <p className="text-sm">تأكد من تشغيل الـ Seed وتوصيل الـ IPC بشكل صحيح</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <StudentDetailModal
        isOpen={isModalOpen}
        student={selectedStudent}
        onClose={() => setIsModalOpen(false)}
      />
      <AddStudentModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  )
}
