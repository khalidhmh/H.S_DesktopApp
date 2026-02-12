import React, { useEffect, useState } from 'react'
import { useInventoryStore } from '../../../viewmodels/useInventoryStore'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import {
    Bed,
    Armchair,
    Refrigerator,
    Table,
    AlertTriangle,
    Plus,
    FileText,
    Pencil,
    Check,
    X
} from 'lucide-react'
import { Alert, AlertDescription } from '../../../components/ui/alert'

// Icon mapping for inventory items
const iconMap: Record<string, React.ComponentType<any>> = {
    Bed,
    Armchair,
    Refrigerator,
    Table
}

export default function InventoryPage() {
    const { fetchInventory, updateTotalQuantity, getItemsWithStats, isLoading } = useInventoryStore()
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editValue, setEditValue] = useState<string>('')

    useEffect(() => {
        fetchInventory()
    }, [fetchInventory])

    const itemsWithStats = getItemsWithStats()

    const handleEdit = (id: string, currentValue: number) => {
        setEditingId(id)
        setEditValue(currentValue.toString())
    }

    const handleSave = async (id: string) => {
        const newQuantity = parseInt(editValue, 10)
        if (!isNaN(newQuantity) && newQuantity >= 0) {
            await updateTotalQuantity(id, newQuantity)
        }
        setEditingId(null)
    }

    const handleCancel = () => {
        setEditingId(null)
        setEditValue('')
    }

    const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
        if (e.key === 'Enter') {
            handleSave(id)
        } else if (e.key === 'Escape') {
            handleCancel()
        }
    }

    return (
        <div className="p-6 space-y-6" dir="rtl">
            {/* Header Section */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#002147' }}>
                        إدارة العهدة والمخزون
                    </h1>
                    <p className="text-muted-foreground mt-2">متابعة أصول السكن والاستهلاك التلقائي</p>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <FileText size={16} />
                        تصدير تقرير
                    </Button>
                    <Button className="gap-2" style={{ background: '#F2C94C', color: '#002147' }}>
                        <Plus size={16} />
                        إضافة صنف جديد
                    </Button>
                </div>
            </div>

            {/* Beta Warning Banner */}
            <Alert className="bg-yellow-50 border-yellow-200">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <AlertDescription className="text-yellow-800 font-medium">
                    هذه الصفحة تحت التطوير (Beta Version) - قد تواجه بعض المشاكل
                </AlertDescription>
            </Alert>

            {/* Asset Grid */}
            {isLoading ? (
                <div className="text-center py-20 text-muted-foreground">جاري تحميل البيانات...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {itemsWithStats.map((item) => {
                        const Icon = iconMap[item.icon] || Bed
                        const isLowInventory = item.availableQuantity < 10
                        const isEditing = editingId === item.id

                        return (
                            <Card
                                key={item.id}
                                className="relative overflow-hidden hover:shadow-lg transition-all"
                            >
                                {/* Top accent bar */}
                                <div
                                    className="absolute top-0 right-0 w-full h-1"
                                    style={{ background: isLowInventory ? '#EF4444' : '#002147' }}
                                />

                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="p-3 rounded-lg"
                                            style={{ background: '#002147', color: 'white' }}
                                        >
                                            <Icon size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className="text-xl font-bold">{item.nameAr}</CardTitle>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {item.perStudent ? 'صنف مرتبط بالطلاب' : 'صنف عام'}
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    {/* Total Quantity (Editable) */}
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm font-medium text-gray-600">الأصل (الإجمالي)</span>
                                        <div className="flex items-center gap-2">
                                            {isEditing ? (
                                                <>
                                                    <input
                                                        type="number"
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        onKeyDown={(e) => handleKeyDown(e, item.id)}
                                                        className="w-20 px-2 py-1 text-center border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        autoFocus
                                                    />
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-7 w-7 p-0"
                                                        onClick={() => handleSave(item.id)}
                                                    >
                                                        <Check size={14} className="text-green-600" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-7 w-7 p-0"
                                                        onClick={handleCancel}
                                                    >
                                                        <X size={14} className="text-red-600" />
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-lg font-bold">{item.totalQuantity}</span>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-7 w-7 p-0"
                                                        onClick={() => handleEdit(item.id, item.totalQuantity)}
                                                    >
                                                        <Pencil size={14} className="text-gray-400" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Used Quantity (Read-only) */}
                                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                        <span className="text-sm font-medium text-blue-600">المستخدم</span>
                                        <span className="text-lg font-bold text-blue-700">{item.usedQuantity}</span>
                                    </div>

                                    {/* Divider */}
                                    <div className="border-t border-gray-200" />

                                    {/* Available Quantity (Calculated) */}
                                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                                        <span className="text-sm font-semibold text-gray-700">المتبقي</span>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`text-3xl font-bold ${isLowInventory ? 'text-red-600' : 'text-green-600'
                                                    }`}
                                            >
                                                {item.availableQuantity}
                                            </span>
                                            {isLowInventory && (
                                                <Badge variant="destructive" className="gap-1">
                                                    <AlertTriangle size={12} />
                                                    منخفض
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    {/* Warning message for low inventory */}
                                    {isLowInventory && (
                                        <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                                            ⚠️ تحذير: الكمية المتبقية أقل من 10 وحدات
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && itemsWithStats.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">لا توجد أصناف في المخزون</p>
                    <Button className="mt-4 gap-2" style={{ background: '#F2C94C', color: '#002147' }}>
                        <Plus size={16} />
                        إضافة صنف جديد
                    </Button>
                </div>
            )}
        </div>
    )
}
