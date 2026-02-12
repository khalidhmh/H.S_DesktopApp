import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@renderer/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@renderer/components/ui/table'
import { Badge } from '@renderer/components/ui/badge'
import { Input } from '@renderer/components/ui/input'
import { Search, AlertTriangle, FileWarning, Gavel, Ban } from 'lucide-react'
import { usePenaltyStore } from '../../../viewmodels/usePenaltyStore'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'

export default function PenaltiesPage() {
  const { penalties, fetchAllPenalties, isLoading } = usePenaltyStore()
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchAllPenalties()
  }, [])

  // We can filter locally for now since we fetch all
  const filteredPenalties = penalties.filter(
    (p) =>
      (p as any).student?.name.includes(searchTerm) ||
      (p as any).student?.universityId.includes(searchTerm) ||
      p.reason.includes(searchTerm)
  )

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            سجل المخالفات والعقوبات
          </h1>
          <p className="text-muted-foreground">عرض وإدارة مخالفات الطلاب</p>
        </div>
        <div className="relative w-72">
          <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="بحث عن طالب أو مخالفة..."
            className="pr-10 bg-gray-50 border-gray-200 focus:bg-white transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="مجمل المخالفات"
          value={penalties.length}
          icon={FileWarning}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="تنبيهات وإنذارات"
          value={penalties.filter((p) => p.type.includes('WARNING')).length}
          icon={AlertTriangle}
          color="bg-yellow-50 text-yellow-600"
        />
        <StatCard
          title="غرامات مالية"
          value={penalties.filter((p) => p.type === 'FINE').length}
          icon={Gavel}
          color="bg-orange-50 text-orange-600"
        />
        <StatCard
          title="قرارات فصل"
          value={penalties.filter((p) => p.type === 'DISMISSAL').length}
          icon={Ban}
          color="bg-red-50 text-red-600"
        />
      </div>

      <Card className="border-none shadow-md overflow-hidden">
        <CardHeader className="bg-gray-50/50 pb-4 border-b">
          <CardTitle>أحدث المخالفات المسجلة</CardTitle>
          <CardDescription>قائمة بجميع المخالفات مرتبة حسب التاريخ</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                <TableHead className="text-right py-4">الطالب</TableHead>
                <TableHead className="text-right">الرقم الجامعي</TableHead>
                <TableHead className="text-right">نوع العقوبة</TableHead>
                <TableHead className="text-right w-[40%]">السبب والتفاصيل</TableHead>
                <TableHead className="text-right">تاريخ التسجيل</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    جاري تحميل البيانات...
                  </TableCell>
                </TableRow>
              ) : filteredPenalties.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-48 text-center text-muted-foreground flex flex-col items-center justify-center"
                  >
                    <div className="bg-gray-50 p-4 rounded-full mb-3">
                      <FileWarning className="h-8 w-8 text-gray-400" />
                    </div>
                    لا توجد مخالفات مطابقة للبحث
                  </TableCell>
                </TableRow>
              ) : (
                filteredPenalties.map((penalty) => (
                  <TableRow key={penalty.id} className="group hover:bg-red-50/10 transition-colors">
                    <TableCell className="font-semibold text-gray-700">
                      {(penalty as any).student?.name || 'غير معروف'}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-gray-500">
                      {(penalty as any).student?.universityId || '—'}
                    </TableCell>
                    <TableCell>
                      <PenaltyTypeBadge type={penalty.type} />
                    </TableCell>
                    <TableCell className="text-gray-600 max-w-md truncate" title={penalty.reason}>
                      {penalty.reason}
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {format(new Date(penalty.date), 'dd MMMM yyyy', { locale: ar })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-all">
      <CardContent className="p-6 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function PenaltyTypeBadge({ type }: { type: string }) {
  switch (type) {
    case 'WARNING':
      return (
        <Badge
          variant="outline"
          className="border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
        >
          تنبيه شفهي
        </Badge>
      )
    case 'WRITTEN_WARNING':
      return (
        <Badge
          variant="outline"
          className="border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100"
        >
          إنذار كتابي
        </Badge>
      )
    case 'FINE':
      return (
        <Badge
          variant="destructive"
          className="bg-red-100 text-red-700 hover:bg-red-200 border-transparent"
        >
          غرامة مالية
        </Badge>
      )
    case 'DISMISSAL':
      return (
        <Badge variant="destructive" className="px-3">
          فصل نهائي
        </Badge>
      )
    default:
      return <Badge variant="secondary">{type}</Badge>
  }
}
