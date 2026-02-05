import React, { useEffect, useState } from 'react';
import { useComplaintStore } from '../../../viewmodels/useComplaintStore';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { CheckCircle, AlertTriangle, Hammer, User, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function ComplaintsPage() {
    const { issues, filter, fetchIssues, resolveIssue, setFilter, isLoading } = useComplaintStore();
    const [activeTab, setActiveTab] = useState('PENDING');

    useEffect(() => {
        fetchIssues(activeTab as 'PENDING' | 'RESOLVED' | 'ALL');
    }, [activeTab]);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        setFilter(value as 'PENDING' | 'RESOLVED' | 'ALL');
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'HIGH': return 'bg-red-500 hover:bg-red-600';
            case 'MEDIUM': return 'bg-yellow-500 hover:bg-yellow-600';
            case 'LOW': return 'bg-blue-500 hover:bg-blue-600';
            default: return 'bg-gray-500';
        }
    };

    const getStatusColor = (status: string) => {
        return status === 'RESOLVED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
    };

    return (
        <div className="p-6 space-y-6" dir="rtl">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">الشكاوى والصيانة</h1>
                    <p className="text-muted-foreground mt-2">متابعة بلاغات الأعطال وشكاوى الطلاب</p>
                </div>

                {/* TODO: Add Report Issue Modal Trigger Here */}
            </div>

            <Tabs defaultValue="PENDING" onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-[400px] grid-cols-2">
                    <TabsTrigger value="PENDING">
                        قيد الانتظار
                        {issues.filter(i => i.status !== 'RESOLVED').length > 0 && (
                            <Badge variant="destructive" className="mr-2 ml-0 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                                {issues.filter(i => i.status !== 'RESOLVED').length}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="RESOLVED">تم الحل</TabsTrigger>
                </TabsList>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {isLoading ? (
                        <div className="col-span-full text-center py-10 text-muted-foreground">جاري التحميل...</div>
                    ) : issues.length === 0 ? (
                        <div className="col-span-full text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">
                            لا يوجد بلاغات في هذه القائمة
                        </div>
                    ) : (
                        issues.map((issue) => (
                            <Card key={`${issue.type}-${issue.id}`} className="flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
                                <div className={`absolute top-0 right-0 w-1 h-full ${getPriorityColor(issue.priority)}`} />

                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                {issue.type === 'COMPLAINT' ? <User size={16} className="text-blue-500" /> : <Hammer size={16} className="text-orange-500" />}
                                                <span className="text-xs font-medium text-muted-foreground">
                                                    {issue.type === 'COMPLAINT' ? 'شكوى طالب' : 'طلب صيانة'}
                                                </span>
                                                <Badge variant="outline" className={`${getStatusColor(issue.status)} border-0`}>
                                                    {issue.status === 'RESOLVED' ? 'تم الحل' : 'قيد المعالجة'}
                                                </Badge>
                                            </div>
                                            <CardTitle className="text-lg font-semibold leading-tight">{issue.title}</CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="flex-grow text-sm text-gray-600 space-y-3">
                                    <p className="line-clamp-3">{issue.description}</p>

                                    <div className="flex flex-col gap-1 text-xs text-muted-foreground mt-4 pt-4 border-t">
                                        {issue.location && (
                                            <div className="flex items-center gap-2">
                                                <MapPin size={14} />
                                                <span>{issue.location}</span>
                                            </div>
                                        )}
                                        {issue.studentName && (
                                            <div className="flex items-center gap-2">
                                                <User size={14} />
                                                <span>{issue.studentName}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} />
                                            <span>{format(new Date(issue.createdAt), 'dd MMMM yyyy - hh:mm a', { locale: ar })}</span>
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="pt-2">
                                    {issue.status !== 'RESOLVED' && (
                                        <Button
                                            className="w-full gap-2"
                                            variant="outline"
                                            onClick={() => resolveIssue(issue.id, issue.type)}
                                        >
                                            <CheckCircle size={16} className="text-green-600" />
                                            تحديد كمحلول
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        ))
                    )}
                </div>
            </Tabs>
        </div>
    );
}
