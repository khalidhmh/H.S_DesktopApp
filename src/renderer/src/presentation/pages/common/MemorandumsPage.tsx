import React, { useEffect, useState } from 'react'
import { useMemorandumStore } from '../../../viewmodels/useMemorandumStore'
import type { MemoTarget, MemoImportance } from '../../../viewmodels/useMemorandumStore'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Textarea } from '../../../components/ui/textarea'
import { Label } from '../../../components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '../../../components/ui/select'
import { Badge } from '../../../components/ui/badge'
import { Send, FileText, Clock, Target } from 'lucide-react'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'

export default function MemorandumsPage() {
    const { memos, isLoading, isSending, fetchMemos, sendMemo } = useMemorandumStore()

    const [formData, setFormData] = useState({
        title: '',
        target: 'ALL' as MemoTarget,
        targetDetails: '',
        importance: 'NORMAL' as MemoImportance,
        content: ''
    })

    useEffect(() => {
        fetchMemos()
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.title.trim() || !formData.content.trim()) {
            alert('يرجى إدخال العنوان والمحتوى')
            return
        }

        sendMemo(formData)

        // Reset form
        setFormData({
            title: '',
            target: 'ALL',
            targetDetails: '',
            importance: 'NORMAL',
            content: ''
        })
    }

    const getTargetLabel = (target: MemoTarget, details?: string) => {
        switch (target) {
            case 'ALL':
                return 'جميع الطلاب'
            case 'BUILDING':
                return `مبنى: ${details || '-'}`
            case 'FLOOR':
                return `دور: ${details || '-'}`
        }
    }

    return (
        <div className="p-6 space-y-6" dir="rtl">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#002147' }}>
                    إصدار التعميمات الرسمية
                </h1>
                <p className="text-muted-foreground mt-2">
                    إرسال تعاميم وإعلانات رسمية للطلاب والمقيمين
                </p>
            </div>

            {/* Issue Memo Form */}
            <Card className="border-2" style={{ borderColor: '#F2C94C' }}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Send className="text-blue-600" size={20} />
                        إصدار تعميم جديد
                    </CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title">عنوان التعميم *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="مثال: تعليمات جديدة للسكن"
                                required
                            />
                        </div>

                        {/* Target */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="target">المستهدفون</Label>
                                <Select
                                    value={formData.target}
                                    onValueChange={(val) =>
                                        setFormData({ ...formData, target: val as MemoTarget, targetDetails: '' })
                                    }
                                >
                                    <SelectTrigger id="target">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">جميع الطلاب</SelectItem>
                                        <SelectItem value="BUILDING">مبنى محدد</SelectItem>
                                        <SelectItem value="FLOOR">دور محدد</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {formData.target !== 'ALL' && (
                                <div className="space-y-2">
                                    <Label htmlFor="targetDetails">
                                        {formData.target === 'BUILDING' ? 'اسم المبنى' : 'رقم الدور والمبنى'}
                                    </Label>
                                    <Input
                                        id="targetDetails"
                                        value={formData.targetDetails}
                                        onChange={(e) => setFormData({ ...formData, targetDetails: e.target.value })}
                                        placeholder={
                                            formData.target === 'BUILDING' ? 'مثال: مبنى أ' : 'مثال: الطابق الثالث - مبنى ب'
                                        }
                                    />
                                </div>
                            )}
                        </div>

                        {/* Importance Toggle */}
                        <div className="space-y-2">
                            <Label>مستوى الأهمية</Label>
                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant={formData.importance === 'NORMAL' ? 'default' : 'outline'}
                                    onClick={() => setFormData({ ...formData, importance: 'NORMAL' })}
                                    className="flex-1"
                                >
                                    عادي
                                </Button>
                                <Button
                                    type="button"
                                    variant={formData.importance === 'URGENT' ? 'default' : 'outline'}
                                    onClick={() => setFormData({ ...formData, importance: 'URGENT' })}
                                    className="flex-1"
                                    style={
                                        formData.importance === 'URGENT'
                                            ? { backgroundColor: '#dc2626', borderColor: '#dc2626' }
                                            : {}
                                    }
                                >
                                    عاجل
                                </Button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-2">
                            <Label htmlFor="content">نص التعميم *</Label>
                            <Textarea
                                id="content"
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                placeholder="اكتب محتوى التعميم هنا..."
                                rows={6}
                                required
                            />
                        </div>
                    </CardContent>

                    <CardFooter>
                        <Button
                            type="submit"
                            className="w-full gap-2"
                            disabled={isSending}
                            style={{ backgroundColor: '#002147' }}
                        >
                            <Send size={16} />
                            {isSending ? 'جاري الإرسال...' : 'إرسال التعميم'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            {/* Sent Memos History */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold">التعاميم المرسلة</h2>

                {isLoading ? (
                    <div className="text-center py-10 text-muted-foreground">جاري التحميل...</div>
                ) : memos.length === 0 ? (
                    <Card className="border-2 border-dashed">
                        <CardContent className="py-16 text-center">
                            <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                            <p className="text-muted-foreground">لم يتم إرسال أي تعاميم بعد</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {memos.map((memo) => (
                            <Card key={memo.id} className="flex flex-col">
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-2">
                                        <CardTitle className="text-lg leading-tight">{memo.title}</CardTitle>
                                        {memo.importance === 'URGENT' && (
                                            <Badge className="bg-red-500 hover:bg-red-600 flex-shrink-0">عاجل</Badge>
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent className="flex-grow space-y-3">
                                    <p className="text-sm text-gray-600 line-clamp-3">{memo.content}</p>

                                    <div className="flex flex-col gap-1.5 text-xs text-muted-foreground pt-3 border-t">
                                        <div className="flex items-center gap-2">
                                            <Target size={14} />
                                            <span>{getTargetLabel(memo.target, memo.targetDetails)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} />
                                            <span>
                                                {format(new Date(memo.createdAt), 'dd MMMM yyyy - hh:mm a', {
                                                    locale: ar
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-blue-600">
                                            <FileText size={14} />
                                            <span>{memo.createdBy}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
