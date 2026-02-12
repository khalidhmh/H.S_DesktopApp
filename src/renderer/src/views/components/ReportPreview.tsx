import React from 'react'
import { format } from 'date-fns'
import { FileText, Calendar } from 'lucide-react'

interface ReportPreviewProps {
    title: string
    data: any[]
    filters?: string[]
    reportType: string
}

export const ReportPreview: React.FC<ReportPreviewProps> = ({
    title,
    data,
    filters = [],
    reportType
}) => {
    const currentDate = format(new Date(), 'yyyy-MM-dd')

    if (!data || data.length === 0) {
        return (
            <div className="report-preview-container bg-white rounded-lg shadow-lg p-8 min-h-[600px] flex items-center justify-center">
                <div className="text-center text-gray-400">
                    <FileText size={64} className="mx-auto mb-4 opacity-30" />
                    <p className="text-lg">لم يتم إنشاء التقرير بعد</p>
                    <p className="text-sm mt-2">اختر نوع التقرير والفلاتر ثم اضغط "إنشاء التقرير"</p>
                </div>
            </div>
        )
    }

    const columns = data.length > 0 ? Object.keys(data[0]) : []

    return (
        <div className="report-preview-container bg-white rounded-lg shadow-lg p-8 print:shadow-none" dir="rtl">
            {/* University Header */}
            <div className="report-header border-b-2 pb-4 mb-6 print:border-b-4" style={{ borderColor: '#002147' }}>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold mb-1" style={{ color: '#002147' }}>
                            جامعة [اسم الجامعة]
                        </h1>
                        <h2 className="text-xl font-semibold mb-2" style={{ color: '#002147' }}>
                            مركز التقارير والإحصائيات
                        </h2>
                        <p className="text-sm text-gray-600">نظام إدارة السكن الجامعي</p>
                    </div>

                    {/* Logo Placeholder */}
                    <div
                        className="w-20 h-20 rounded-lg flex items-center justify-center print:w-24 print:h-24"
                        style={{ background: '#002147' }}
                    >
                        <FileText className="text-white" size={40} />
                    </div>
                </div>
            </div>

            {/* Report Title and Metadata */}
            <div className="report-metadata mb-6">
                <h3 className="text-xl font-bold mb-3" style={{ color: '#002147' }}>
                    {title}
                </h3>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>تاريخ الإنشاء: {currentDate}</span>
                    </div>
                    <div className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: '#F2C94C', color: '#002147' }}>
                        عدد السجلات: {data.length}
                    </div>
                </div>

                {/* Active Filters */}
                {filters.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-3 mt-3 print:bg-gray-100">
                        <p className="text-xs font-semibold text-gray-700 mb-1">الفلاتر المطبقة:</p>
                        <div className="flex flex-wrap gap-2">
                            {filters.map((filter, idx) => (
                                <span
                                    key={idx}
                                    className="text-xs px-2 py-1 rounded bg-white border border-gray-200"
                                >
                                    {filter}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Data Table */}
            <div className="report-table overflow-x-auto mb-8">
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr style={{ background: '#002147' }}>
                            <th className="px-4 py-3 text-right text-white font-semibold border border-gray-300">
                                #
                            </th>
                            {columns.map((col) => (
                                <th
                                    key={col}
                                    className="px-4 py-3 text-right text-white font-semibold border border-gray-300"
                                >
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                            >
                                <td className="px-4 py-2 border border-gray-300 text-gray-600 font-medium">
                                    {rowIndex + 1}
                                </td>
                                {columns.map((col) => (
                                    <td
                                        key={col}
                                        className="px-4 py-2 border border-gray-300 text-gray-700"
                                    >
                                        {row[col]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="report-footer border-t-2 pt-4 mt-8 print:border-t print:fixed print:bottom-0 print:left-0 print:right-0 print:bg-white print:px-8" style={{ borderColor: '#002147' }}>
                <div className="flex justify-between items-center text-xs text-gray-600">
                    <div>
                        <p>تم إنشاء التقرير بواسطة: نظام إدارة السكن الجامعي</p>
                        <p className="mt-1">التاريخ: {currentDate}</p>
                    </div>
                    <div className="text-left">
                        <p>التوقيع: _________________</p>
                        <p className="mt-1">الختم الرسمي</p>
                    </div>
                </div>
            </div>

            {/* Print-specific styles */}
            <style>{`
        @media print {
          .report-preview-container {
            padding: 20mm;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          
          .report-header {
            margin-bottom: 10mm;
          }
          
          .report-table {
            page-break-inside: auto;
          }
          
          .report-table tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          
          .report-table thead {
            display: table-header-group;
          }
          
          .report-footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: white;
            padding: 10mm 20mm;
          }

          /* Hide everything except the report preview when printing */
          body * {
            visibility: hidden;
          }
          
          .report-preview-container,
          .report-preview-container * {
            visibility: visible;
          }
          
          .report-preview-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
        </div>
    )
}
