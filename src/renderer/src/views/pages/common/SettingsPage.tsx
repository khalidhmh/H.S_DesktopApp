import { useState } from 'react';
import { useSettingsStore } from '../../../viewmodels/useSettingsStore';
import { useAuthStore } from '../../../viewmodels/useAuthStore';
import { Button } from '@renderer/components/ui/button';
import { Input } from '@renderer/components/ui/input';
import { Label } from '@renderer/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@renderer/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/components/ui/tabs';
import { Save, AlertTriangle, Download, RefreshCw, KeyRound, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
    const { currentUser } = useAuthStore();
    const { updatePassword, resetSystem, backupDatabase, isLoading } = useSettingsStore();

    const [passwordData, setPasswordData] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const handlePasswordUpdate = async () => {
        if (passwordData.new !== passwordData.confirm) {
            toast.error("كلمة المرور الجديدة غير متطابقة");
            return;
        }
        if (passwordData.new.length < 4) {
            toast.error("كلمة المرور يجب أن تكون 4 أحرف على الأقل");
            return;
        }

        try {
            // Note: In a real app we would verify 'current' password on backend first
            await updatePassword(passwordData.new);
            toast.success("تم تحديث كلمة المرور بنجاح");
            setPasswordData({ current: '', new: '', confirm: '' });
        } catch (error) {
            toast.error("فشل تحديث كلمة المرور");
        }
    };

    const handleBackup = async () => {
        try {
            await backupDatabase();
            toast.success("تم تحميل النسخة الاحتياطية بنجاح");
        } catch (error) {
            toast.error("فشل إنشاء النسخة الاحتياطية");
        }
    };

    const handleReset = async () => {
        if (confirm("تحذير: هذا الإجراء سيقوم بحذف جميع بيانات الطلاب والعمليات في النظام ولا يمكن التراجع عنه. هل أنت متأكد؟")) {
            try {
                await resetSystem();
                toast.success("تمت إعادة تعيين النظام بنجاح");
            } catch (error) {
                toast.error("حدث خطأ أثناء إعادة التعيين");
            }
        }
    };

    return (
        <div className="p-6 space-y-6" dir="rtl">
            <div className="flex flex-col gap-2 mb-4">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <KeyRound className="h-8 w-8 text-primary" />
                    الإعدادات والصيانة
                </h1>
                <p className="text-muted-foreground">إدارة الملف الشخصي وصيانة النظام</p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full md:w-[400px] grid-cols-2 mb-8">
                    <TabsTrigger value="profile">الملف الشخصي</TabsTrigger>
                    {currentUser?.role === 'MANAGER' && (
                        <TabsTrigger value="system">النظام والبيانات</TabsTrigger>
                    )}
                </TabsList>

                {/* Profile Settings (Password) */}
                <TabsContent value="profile">
                    <Card className="max-w-2xl">
                        <CardHeader>
                            <CardTitle>تغيير كلمة المرور</CardTitle>
                            <CardDescription>قم بتحديث كلمة المرور الخاصة بحسابك</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>كلمة المرور الحالية</Label>
                                <Input
                                    type="password"
                                    value={passwordData.current}
                                    onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>كلمة المرور الجديدة</Label>
                                <Input
                                    type="password"
                                    value={passwordData.new}
                                    onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>تأكيد كلمة المرور الجديدة</Label>
                                <Input
                                    type="password"
                                    value={passwordData.confirm}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                />
                            </div>
                            <div className="pt-4 flex justify-end">
                                <Button onClick={handlePasswordUpdate} disabled={isLoading} className="gap-2">
                                    <Save className="h-4 w-4" />
                                    حفظ التغييرات
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* System Settings (Backup/Reset) - Manager Only */}
                {currentUser?.role === 'MANAGER' && (
                    <TabsContent value="system" className="space-y-6">

                        {/* Backup Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Download className="h-5 w-5 text-blue-600" />
                                    النسخ الاحتياطي
                                </CardTitle>
                                <CardDescription>تحميل نسخة كاملة من قاعدة البيانات بصيغة JSON</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="outline" onClick={handleBackup} disabled={isLoading} className="gap-2 w-full md:w-auto">
                                    <Download className="h-4 w-4" />
                                    تحميل نسخة احتياطية
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Danger Zone */}
                        <Card className="border-red-200 bg-red-50/50">
                            <CardHeader>
                                <CardTitle className="text-red-600 flex items-center gap-2">
                                    <ShieldAlert className="h-5 w-5" />
                                    منطقة الخطر
                                </CardTitle>
                                <CardDescription className="text-red-800/80">
                                    الإجراءات هنا لا يمكن التراجع عنها. يرجى توخي الحذر.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-white">
                                    <div>
                                        <h4 className="font-semibold text-red-700">تصفير النظام (Reset System)</h4>
                                        <p className="text-sm text-gray-500">حذف جميع الطلاب، المخالفات، سجلات الحضور، والشكاوى.</p>
                                    </div>
                                    <Button variant="destructive" onClick={handleReset} disabled={isLoading} className="gap-2">
                                        <AlertTriangle className="h-4 w-4" />
                                        إعادة تعيين النظام
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
}
