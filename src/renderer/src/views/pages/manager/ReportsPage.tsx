import { FileText, Calendar, AlertTriangle, Home, Download, Printer } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@renderer/components/ui/card';
import { Button } from '@renderer/components/ui/button';
import { useReportStore } from '../../../viewmodels/useReportStore';

export default function ReportsPage() {
    const {
        generateStudentReport,
        generateAttendanceReport,
        generatePenaltyReport,
        isGenerating
    } = useReportStore();

    return (
        <div className="p-6 space-y-6" dir="rtl">
            <div className="flex flex-col gap-2 mb-8">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary" />
                    التقارير والإحصائيات
                </h1>
                <p className="text-muted-foreground">تصدير بيانات النظام والتقارير الدورية</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Students Report */}
                <ReportCard
                    title="بيانات الطلاب"
                    description="قائمة شاملة بجميع الطلاب المسكنين وبياناتهم التفصيلية"
                    icon={FileText}
                    color="bg-blue-50 text-blue-600"
                    action={generateStudentReport}
                    loading={isGenerating}
                    buttonText="تصدير كـ CSV"
                />

                {/* Attendance Report */}
                <ReportCard
                    title="سجل الحضور والغياب"
                    description="تقرير بحالات الغياب والحضور لجميع الطلاب"
                    icon={Calendar}
                    color="bg-purple-50 text-purple-600"
                    action={generateAttendanceReport}
                    loading={isGenerating}
                    buttonText="تصدير كـ CSV"
                />

                {/* Penalties Report */}
                <ReportCard
                    title="المخالفات والعقوبات"
                    description="كشف بجميع العقوبات والمخالفات المسجلة على الطلاب"
                    icon={AlertTriangle}
                    color="bg-red-50 text-red-600"
                    action={generatePenaltyReport}
                    loading={isGenerating}
                    buttonText="تصدير كـ CSV"
                />

                {/* Housing Summary */}
                <ReportCard
                    title="ملخص التسكين"
                    description="إحصائيات الإشغال وتوزيع الطلاب على المباني"
                    icon={Home}
                    color="bg-green-50 text-green-600"
                    action={() => window.print()}
                    loading={false}
                    buttonText="طباعة الملخص"
                    iconButton={Printer}
                />

            </div>
        </div>
    );
}

function ReportCard({ title, description, icon: Icon, color, action, loading, buttonText, iconButton: ActionIcon = Download }: any) {
    return (
        <Card className="hover:shadow-lg transition-all border-none shadow-sm">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                    <Icon className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                    <CardTitle className="text-lg">{title}</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <CardDescription className="mb-6 h-10">
                    {description}
                </CardDescription>
                <Button
                    className="w-full gap-2"
                    variant="outline"
                    onClick={action}
                    disabled={loading}
                >
                    <ActionIcon className="h-4 w-4" />
                    {loading ? 'جاري التحضير...' : buttonText}
                </Button>
            </CardContent>
        </Card>
    );
}
