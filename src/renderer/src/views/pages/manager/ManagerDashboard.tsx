import { useEffect } from 'react';
import { useStudentStore } from '../../../viewmodels/useStudentStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Users, BedDouble, AlertCircle, Home } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';

const ManagerDashboard = () => {
    const { fetchDashboardStats, dashboardStats, isLoading } = useStudentStore();

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    if (isLoading || !dashboardStats) {
        return <div className="p-8 text-center text-gray-500">جاري تحميل البيانات...</div>;
    }

    const stats = [
        {
            title: "إجمالي الطلاب",
            value: dashboardStats.totalStudents,
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-100",
            desc: "+20 عن الشهر الماضي"
        },
        {
            title: "نسبة الإشغال",
            value: `${dashboardStats.occupancyRate}%`,
            icon: BedDouble,
            color: "text-green-600",
            bgColor: "bg-green-100",
            desc: "معدل طبيعي"
        },
        {
            title: "شكاوى معلقة",
            value: dashboardStats.pendingComplaints,
            icon: AlertCircle,
            color: "text-orange-600",
            bgColor: "bg-orange-100",
            desc: "تحتاج لاتخاذ إجراء"
        },
        {
            title: "غرف متاحة",
            value: dashboardStats.availableRooms,
            icon: Home,
            color: "text-[#1e1b4b]",
            bgColor: "bg-[#1e1b4b]/10",
            desc: "في جميع المباني"
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-full ${stat.bgColor}`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-[#1e1b4b]">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stat.desc}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Bar Chart: Distribution */}
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle>توزيع الطلاب على المباني</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dashboardStats.buildingDistribution}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                                    <YAxis tickLine={false} axisLine={false} />
                                    <Tooltip
                                        cursor={{ fill: '#f3f4f6' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="value" fill="#1e1b4b" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Line Chart: Attendance Trends */}
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle>إحصائيات الحضور (آخر 7 أيام)</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={dashboardStats.attendanceTrends}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="day" tickLine={false} axisLine={false} />
                                    <YAxis tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="present"
                                        stroke="#1e1b4b"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: "#1e1b4b" }}
                                        name="حضور"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="absent"
                                        stroke="#dc2626"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: "#dc2626" }}
                                        name="غياب"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions / Recent Activity Table could go here */}
        </div>
    );
};

export default ManagerDashboard;
