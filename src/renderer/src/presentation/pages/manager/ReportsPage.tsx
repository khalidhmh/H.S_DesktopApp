import React, { useState } from 'react'
import {
  FileText,
  Users,
  Calendar,
  AlertTriangle,
  Package,
  Filter,
  Download,
  Printer,
  FileSpreadsheet,
  Sparkles
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Label } from '../../../components/ui/label'
import { Select } from '../../../components/ui/select'
import { Input } from '../../../components/ui/input'
import { useReportStore, ReportType } from '../../../viewmodels/useReportStore'
import { ReportPreview } from '../../components/ReportPreview'
import { format } from 'date-fns'

export default function ReportsPage() {
  const {
    reportType,
    filters,
    previewData,
    isGenerating,
    setReportType,
    setFilters,
    clearFilters,
    generateReport,
    exportToPDF,
    exportToExcel
  } = useReportStore()

  const [localFilters, setLocalFilters] = useState(filters)

  // Report Type Configurations
  const reportTypes = [
    {
      id: 'students' as ReportType,
      name: 'قوائم الطلاب',
      description: 'تقارير شاملة عن الطلاب حسب الكلية والفرقة والحالة',
      icon: Users,
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      id: 'attendance' as ReportType,
      name: 'سجل الحضور',
      description: 'تقارير الحضور والغياب خلال فترة زمنية محددة',
      icon: Calendar,
      color: 'bg-purple-50 text-purple-600 border-purple-200'
    },
    {
      id: 'penalties' as ReportType,
      name: 'المخالفات',
      description: 'سجل المخالفات والعقوبات المسجلة على الطلاب',
      icon: AlertTriangle,
      color: 'bg-red-50 text-red-600 border-red-200'
    },
    {
      id: 'inventory' as ReportType,
      name: 'العهدة',
      description: 'تقرير مخزون الأصناف والكميات المتبقية',
      icon: Package,
      color: 'bg-green-50 text-green-600 border-green-200'
    }
  ]

  const selectedReportConfig = reportTypes.find((r) => r.id === reportType)

  // Handle Filter Change
  const handleFilterChange = (key: string, value: any) => {
    setLocalFilters((prev: any) => ({
      ...prev,
      [key]: value || undefined
    }))
  }

  // Apply Filters and Generate
  const handleGenerate = () => {
    setFilters(localFilters)
    generateReport()
  }

  // Handle Clear
  const handleClear = () => {
    setLocalFilters({})
    clearFilters()
  }

  // Get active filters as readable strings
  const getActiveFilters = () => {
    const activeFilters: string[] = []
    if (filters.college) activeFilters.push(`الكلية: ${filters.college}`)
    if (filters.level) activeFilters.push(`الفرقة: ${filters.level}`)
    if (filters.building) activeFilters.push(`المبنى: ${filters.building}`)
    if (filters.status) activeFilters.push(`الحالة: ${filters.status}`)
    if (filters.dateFrom) activeFilters.push(`من: ${format(filters.dateFrom, 'yyyy-MM-dd')}`)
    if (filters.dateTo) activeFilters.push(`إلى: ${format(filters.dateTo, 'yyyy-MM-dd')}`)
    return activeFilters
  }

  const reportTitles = {
    students: 'تقرير الطلاب المسكنين',
    attendance: 'تقرير الحضور والغياب',
    penalties: 'سجل المخالفات والعقوبات',
    inventory: 'تقرير العهدة والمخزون'
  }

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: '#002147' }}>
          <FileText className="h-8 w-8" />
          مركز التقارير والإحصائيات
        </h1>
        <p className="text-muted-foreground">إنشاء وتصدير التقارير الشاملة للنظام</p>
      </div>

      {/* Report Type Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map((type) => {
          const Icon = type.icon
          const isSelected = reportType === type.id

          return (
            <Card
              key={type.id}
              className={`cursor-pointer transition-all hover:shadow-md ${isSelected
                  ? 'ring-2 shadow-lg'
                  : 'hover:scale-105'
                }`}
              style={{
                borderColor: isSelected ? '#F2C94C' : undefined,
                ringColor: isSelected ? '#F2C94C' : undefined
              }}
              onClick={() => setReportType(type.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${type.color} border`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-base">{type.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs">{type.description}</CardDescription>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filters Section */}
      <Card className="border-2" style={{ borderColor: '#002147' }}>
        <CardHeader className="pb-4" style={{ background: '#002147' }}>
          <CardTitle className="flex items-center gap-2 text-white">
            <Filter size={20} />
            فلاتر التقرير - {selectedReportConfig?.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Students Filters */}
            {reportType === 'students' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="college">الكلية</Label>
                  <select
                    id="college"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={localFilters.college || ''}
                    onChange={(e) => handleFilterChange('college', e.target.value)}
                  >
                    <option value="">الكل</option>
                    <option value="الهندسة">الهندسة</option>
                    <option value="العلوم">العلوم</option>
                    <option value="الطب">الطب</option>
                    <option value="الآداب">الآداب</option>
                    <option value="التجارة">التجارة</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">الفرقة</Label>
                  <select
                    id="level"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={localFilters.level || ''}
                    onChange={(e) => handleFilterChange('level', e.target.value)}
                  >
                    <option value="">الكل</option>
                    <option value="الأولى">الأولى</option>
                    <option value="الثانية">الثانية</option>
                    <option value="الثالثة">الثالثة</option>
                    <option value="الرابعة">الرابعة</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">الحالة</Label>
                  <select
                    id="status"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={localFilters.status || ''}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="">الكل</option>
                    <option value="ACTIVE">نشط</option>
                    <option value="CHECKOUT">إخلاء</option>
                  </select>
                </div>
              </>
            )}

            {/* Attendance/Penalties Filters */}
            {(reportType === 'attendance' || reportType === 'penalties') && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="dateFrom">من تاريخ</Label>
                  <Input
                    id="dateFrom"
                    type="date"
                    value={localFilters.dateFrom ? format(localFilters.dateFrom, 'yyyy-MM-dd') : ''}
                    onChange={(e) =>
                      handleFilterChange('dateFrom', e.target.value ? new Date(e.target.value) : null)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateTo">إلى تاريخ</Label>
                  <Input
                    id="dateTo"
                    type="date"
                    value={localFilters.dateTo ? format(localFilters.dateTo, 'yyyy-MM-dd') : ''}
                    onChange={(e) =>
                      handleFilterChange('dateTo', e.target.value ? new Date(e.target.value) : null)
                    }
                  />
                </div>

                {reportType === 'attendance' && (
                  <div className="space-y-2">
                    <Label htmlFor="building">المبنى</Label>
                    <select
                      id="building"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={localFilters.building || ''}
                      onChange={(e) => handleFilterChange('building', e.target.value)}
                    >
                      <option value="">الكل</option>
                      <option value="المبنى أ">المبنى أ</option>
                      <option value="المبنى ب">المبنى ب</option>
                      <option value="المبنى ج">المبنى ج</option>
                    </select>
                  </div>
                )}
              </>
            )}

            {/* Inventory - No filters */}
            {reportType === 'inventory' && (
              <div className="col-span-3 text-center py-4 text-gray-500">
                لا توجد فلاتر متاحة لهذا التقرير
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="gap-2"
              style={{ background: '#002147', color: 'white' }}
            >
              <Sparkles size={16} />
              {isGenerating ? 'جاري الإنشاء...' : 'إنشاء التقرير'}
            </Button>
            <Button onClick={handleClear} variant="outline" className="gap-2">
              <Filter size={16} />
              مسح الفلاتر
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Area */}
      <div className="preview-section">
        <ReportPreview
          title={reportTitles[reportType]}
          data={previewData}
          filters={getActiveFilters()}
          reportType={reportType}
        />
      </div>

      {/* Action Toolbar - Fixed Bottom */}
      {previewData.length > 0 && (
        <div
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white shadow-2xl rounded-full px-6 py-3 flex gap-3 border-2 print:hidden z-50"
          style={{ borderColor: '#F2C94C' }}
        >
          <Button
            onClick={exportToPDF}
            variant="outline"
            className="gap-2 rounded-full"
            style={{ borderColor: '#002147', color: '#002147' }}
          >
            <Printer size={18} />
            طباعة / PDF
          </Button>
          <Button
            onClick={exportToExcel}
            className="gap-2 rounded-full"
            style={{ background: '#F2C94C', color: '#002147' }}
          >
            <FileSpreadsheet size={18} />
            تصدير Excel
          </Button>
          <div className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium flex items-center">
            {previewData.length} سجل
          </div>
        </div>
      )}
    </div>
  )
}
