import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useRoomStore } from '../../viewmodels/useRoomStore'
import type { GPA } from '../../viewmodels/useRoomStore'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '../../components/ui/select'
import { Camera, Save, X } from 'lucide-react'
import { toast } from 'sonner'

const GOVERNORATES = [
    'القاهرة',
    'الجيزة',
    'الإسكندرية',
    'الدقهلية',
    'البحيرة',
    'الفيوم',
    'الغربية',
    'الإسماعيلية',
    'المنوفية',
    'المنيا',
    'القليوبية',
    'الوادي الجديد',
    'الشرقية',
    'أسيوط',
    'سوهاج',
    'شمال سيناء',
    'جنوب سيناء',
    'بني سويف',
    'بورسعيد',
    'دمياط',
    'الأقصر',
    'أسوان',
    'البحر الأحمر',
    'مطروح',
    'السويس',
    'كفر الشيخ',
    'قنا'
]

const COLLEGES = [
    'كلية الهندسة',
    'كلية العلوم',
    'كلية التجارة',
    'كلية الآداب',
    'كلية الطب',
    'كلية الصيدلة',
    'كلية طب الأسنان',
    'كلية الطب البيطري',
    'كلية الزراعة',
    'كلية التربية',
    'كلية الحقوق',
    'كلية الفنون الجميلة',
    'كلية التمريض',
    'كلية الحاسبات والمعلومات'
]

const RELATIONS = ['أب', 'أم', 'أخ', 'أخت', 'عم', 'عمة', 'خال', 'خالة', 'جد', 'جدة']

const LEVELS = [
    { value: 1, label: 'الفرقة الأولى' },
    { value: 2, label: 'الفرقة الثانية' },
    { value: 3, label: 'الفرقة الثالثة' },
    { value: 4, label: 'الفرقة الرابعة' }
]

const GPAS: { value: GPA; label: string }[] = [
    { value: 'EXCELLENT', label: 'ممتاز' },
    { value: 'VERY_GOOD', label: 'جيد جداً' },
    { value: 'GOOD', label: 'جيد' },
    { value: 'PASS', label: 'مقبول' }
]

export default function AddStudentPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const roomNumber = searchParams.get('room') || ''
    const bedNumber = parseInt(searchParams.get('bed') || '1')

    const { assignStudentToRoom, getRoomDetails, rooms } = useRoomStore()

    // Get room details from room number
    const room = rooms.find((r) => r.number === roomNumber)
    const floor = room?.floor || 0
    const wing = room?.wing || 'A'

    const [photoPreview, setPhotoPreview] = useState<string>('')
    const [formData, setFormData] = useState({
        // Basic info
        name: '',
        nationalId: '',
        studentAffairsId: '',
        phone: '',
        photoUrl: '',

        // Academic
        college: '',
        level: 1,
        gpa: 'GOOD' as GPA,

        // Guardian
        guardianName: '',
        guardianRelation: '',
        guardianJob: '',
        guardianPhone: '',

        // Addresses
        studentGovernorate: '',
        studentAddressDetails: '',
        guardianGovernorate: '',
        guardianAddressDetails: ''
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('حجم الصورة يجب ألا يتجاوز 5 ميجابايت')
                return
            }

            const reader = new FileReader()
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string)
                setFormData((prev) => ({ ...prev, photoUrl: reader.result as string }))
            }
            reader.readAsDataURL(file)
        }
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.name.trim()) newErrors.name = 'الاسم مطلوب'
        if (!formData.nationalId.trim()) newErrors.nationalId = 'الرقم القومي مطلوب'
        if (formData.nationalId.length !== 14) newErrors.nationalId = 'الرقم القومي يجب أن يكون 14 رقم'
        if (!formData.studentAffairsId.trim()) newErrors.studentAffairsId = 'رقم شئون الطلبة مطلوب'
        if (!formData.phone.trim()) newErrors.phone = 'رقم الموبايل مطلوب'
        if (!/^01[0-9]{9}$/.test(formData.phone)) newErrors.phone = 'رقم الموبايل غير صحيح (يجب أن يبدأ بـ 01 ويكون 11 رقم)'

        if (!formData.college) newErrors.college = 'الكلية مطلوبة'
        if (!formData.gpa) newErrors.gpa = 'التقدير مطلوب'

        if (!formData.guardianName.trim()) newErrors.guardianName = 'اسم ولي الأمر مطلوب'
        if (!formData.guardianRelation) newErrors.guardianRelation = 'درجة القرابة مطلوبة'
        if (!formData.guardianJob.trim()) newErrors.guardianJob = 'وظيفة ولي الأمر مطلوبة'
        if (!formData.guardianPhone.trim()) newErrors.guardianPhone = 'رقم ولي الأمر مطلوب'
        if (!/^01[0-9]{9}$/.test(formData.guardianPhone))
            newErrors.guardianPhone = 'رقم ولي الأمر غير صحيح'

        if (!formData.studentGovernorate) newErrors.studentGovernorate = 'محافظة الطالب مطلوبة'
        if (!formData.studentAddressDetails.trim())
            newErrors.studentAddressDetails = 'تفاصيل عنوان الطالب مطلوبة'
        if (!formData.guardianGovernorate) newErrors.guardianGovernorate = 'محافظة ولي الأمر مطلوبة'
        if (!formData.guardianAddressDetails.trim())
            newErrors.guardianAddressDetails = 'تفاصيل عنوان ولي الأمر مطلوبة'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            toast.error('يرجى تصحيح الأخطاء في النموذج')
            return
        }

        if (!room) {
            toast.error('الغرفة غير موجودة')
            return
        }

        try {
            await assignStudentToRoom(room.id, bedNumber, formData)
            toast.success(`تم إضافة الطالب ${formData.name} بنجاح إلى غرفة ${roomNumber}`)
            navigate('/rooms')
        } catch (error) {
            toast.error('حدث خطأ أثناء إضافة الطالب')
        }
    }

    return (
        <div className="p-6 max-w-4xl mx-auto" dir="rtl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold" style={{ color: '#002147' }}>
                    إضافة طالب جديد
                </h1>
                <p className="text-muted-foreground mt-2">
                    غرفة {roomNumber} - سرير {bedNumber} | الدور {floor} - جناح{' '}
                    {wing === 'A' ? 'أ' : wing === 'B' ? 'ب' : wing === 'C' ? 'ج' : 'د'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Photo Upload */}
                <Card>
                    <CardHeader>
                        <CardTitle>صورة الطالب</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-6">
                            <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden">
                                {photoPreview ? (
                                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <Camera size={48} className="text-gray-400" />
                                )}
                            </div>
                            <div>
                                <Label htmlFor="photo" className="cursor-pointer">
                                    <Button type="button" variant="outline" asChild>
                                        <span>
                                            <Camera className="ml-2" size={18} />
                                            اختر صورة
                                        </span>
                                    </Button>
                                </Label>
                                <input
                                    id="photo"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handlePhotoChange}
                                />
                                <p className="text-xs text-muted-foreground mt-2">
                                    يفضل صورة واضحة بحجم أقل من 5 ميجابايت
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Basic Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>البيانات الأساسية</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <Label htmlFor="name">الاسم الكامل *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                className={errors.name ? 'border-red-500' : ''}
                            />
                            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <Label htmlFor="nationalId">الرقم القومي *</Label>
                            <Input
                                id="nationalId"
                                maxLength={14}
                                value={formData.nationalId}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, nationalId: e.target.value }))
                                }
                                className={errors.nationalId ? 'border-red-500' : ''}
                            />
                            {errors.nationalId && (
                                <p className="text-xs text-red-500 mt-1">{errors.nationalId}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="studentAffairsId">رقم شئون الطلبة *</Label>
                            <Input
                                id="studentAffairsId"
                                value={formData.studentAffairsId}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, studentAffairsId: e.target.value }))
                                }
                                className={errors.studentAffairsId ? 'border-red-500' : ''}
                            />
                            {errors.studentAffairsId && (
                                <p className="text-xs text-red-500 mt-1">{errors.studentAffairsId}</p>
                            )}
                        </div>

                        <div className="col-span-2">
                            <Label htmlFor="phone">رقم الموبايل *</Label>
                            <Input
                                id="phone"
                                type="tel"
                                maxLength={11}
                                value={formData.phone}
                                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                                className={errors.phone ? 'border-red-500' : ''}
                            />
                            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                        </div>
                    </CardContent>
                </Card>

                {/* Academic Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>البيانات الأكاديمية</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-3 gap-4">
                        <div>
                            <Label>الكلية *</Label>
                            <Select
                                value={formData.college}
                                onValueChange={(value) => setFormData((prev) => ({ ...prev, college: value }))}
                            >
                                <SelectTrigger className={errors.college ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="اختر الكلية" />
                                </SelectTrigger>
                                <SelectContent>
                                    {COLLEGES.map((college) => (
                                        <SelectItem key={college} value={college}>
                                            {college}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.college && <p className="text-xs text-red-500 mt-1">{errors.college}</p>}
                        </div>

                        <div>
                            <Label>الفرقة *</Label>
                            <Select
                                value={String(formData.level)}
                                onValueChange={(value) =>
                                    setFormData((prev) => ({ ...prev, level: parseInt(value) }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {LEVELS.map((level) => (
                                        <SelectItem key={level.value} value={String(level.value)}>
                                            {level.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>التقدير *</Label>
                            <Select
                                value={formData.gpa}
                                onValueChange={(value) => setFormData((prev) => ({ ...prev, gpa: value as GPA }))}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {GPAS.map((gpa) => (
                                        <SelectItem key={gpa.value} value={gpa.value}>
                                            {gpa.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Guardian Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>بيانات ولي الأمر</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <Label htmlFor="guardianName">الاسم *</Label>
                            <Input
                                id="guardianName"
                                value={formData.guardianName}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, guardianName: e.target.value }))
                                }
                                className={errors.guardianName ? 'border-red-500' : ''}
                            />
                            {errors.guardianName && (
                                <p className="text-xs text-red-500 mt-1">{errors.guardianName}</p>
                            )}
                        </div>

                        <div>
                            <Label>درجة القرابة *</Label>
                            <Select
                                value={formData.guardianRelation}
                                onValueChange={(value) =>
                                    setFormData((prev) => ({ ...prev, guardianRelation: value }))
                                }
                            >
                                <SelectTrigger className={errors.guardianRelation ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="اختر درجة القرابة" />
                                </SelectTrigger>
                                <SelectContent>
                                    {RELATIONS.map((relation) => (
                                        <SelectItem key={relation} value={relation}>
                                            {relation}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.guardianRelation && (
                                <p className="text-xs text-red-500 mt-1">{errors.guardianRelation}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="guardianJob">الوظيفة *</Label>
                            <Input
                                id="guardianJob"
                                value={formData.guardianJob}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, guardianJob: e.target.value }))
                                }
                                className={errors.guardianJob ? 'border-red-500' : ''}
                            />
                            {errors.guardianJob && (
                                <p className="text-xs text-red-500 mt-1">{errors.guardianJob}</p>
                            )}
                        </div>

                        <div className="col-span-2">
                            <Label htmlFor="guardianPhone">رقم الموبايل *</Label>
                            <Input
                                id="guardianPhone"
                                type="tel"
                                maxLength={11}
                                value={formData.guardianPhone}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, guardianPhone: e.target.value }))
                                }
                                className={errors.guardianPhone ? 'border-red-500' : ''}
                            />
                            {errors.guardianPhone && (
                                <p className="text-xs text-red-500 mt-1">{errors.guardianPhone}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Student Address */}
                <Card>
                    <CardHeader>
                        <CardTitle>عنوان الطالب</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label>المحافظة *</Label>
                            <Select
                                value={formData.studentGovernorate}
                                onValueChange={(value) =>
                                    setFormData((prev) => ({ ...prev, studentGovernorate: value }))
                                }
                            >
                                <SelectTrigger className={errors.studentGovernorate ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="اختر المحافظة" />
                                </SelectTrigger>
                                <SelectContent>
                                    {GOVERNORATES.map((gov) => (
                                        <SelectItem key={gov} value={gov}>
                                            {gov}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.studentGovernorate && (
                                <p className="text-xs text-red-500 mt-1">{errors.studentGovernorate}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="studentAddressDetails">تفاصيل العنوان بالكامل *</Label>
                            <Textarea
                                id="studentAddressDetails"
                                rows={3}
                                value={formData.studentAddressDetails}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, studentAddressDetails: e.target.value }))
                                }
                                className={errors.studentAddressDetails ? 'border-red-500' : ''}
                                placeholder="مثال: شارع الجامعة، مدينة نصر، القاهرة"
                            />
                            {errors.studentAddressDetails && (
                                <p className="text-xs text-red-500 mt-1">{errors.studentAddressDetails}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Guardian Address */}
                <Card>
                    <CardHeader>
                        <CardTitle>عنوان ولي الأمر</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label>المحافظة *</Label>
                            <Select
                                value={formData.guardianGovernorate}
                                onValueChange={(value) =>
                                    setFormData((prev) => ({ ...prev, guardianGovernorate: value }))
                                }
                            >
                                <SelectTrigger className={errors.guardianGovernorate ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="اختر المحافظة" />
                                </SelectTrigger>
                                <SelectContent>
                                    {GOVERNORATES.map((gov) => (
                                        <SelectItem key={gov} value={gov}>
                                            {gov}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.guardianGovernorate && (
                                <p className="text-xs text-red-500 mt-1">{errors.guardianGovernorate}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="guardianAddressDetails">تفاصيل العنوان بالكامل *</Label>
                            <Textarea
                                id="guardianAddressDetails"
                                rows={3}
                                value={formData.guardianAddressDetails}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, guardianAddressDetails: e.target.value }))
                                }
                                className={errors.guardianAddressDetails ? 'border-red-500' : ''}
                                placeholder="مثال: شارع الجامعة، مدينة نصر، القاهرة"
                            />
                            {errors.guardianAddressDetails && (
                                <p className="text-xs text-red-500 mt-1">{errors.guardianAddressDetails}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Room Assignment (Read-only) */}
                <Card className="bg-gray-50">
                    <CardHeader>
                        <CardTitle>معلومات السكن (محددة تلقائياً)</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-4 gap-4">
                        <div>
                            <Label>رقم الغرفة</Label>
                            <Input value={roomNumber} readOnly className="bg-white" />
                        </div>
                        <div>
                            <Label>الدور</Label>
                            <Input value={floor} readOnly className="bg-white" />
                        </div>
                        <div>
                            <Label>الجناح</Label>
                            <Input
                                value={wing === 'A' ? 'أ' : wing === 'B' ? 'ب' : wing === 'C' ? 'ج' : 'د'}
                                readOnly
                                className="bg-white"
                            />
                        </div>
                        <div>
                            <Label>رقم السرير</Label>
                            <Input value={bedNumber} readOnly className="bg-white" />
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/rooms')}
                        className="gap-2"
                    >
                        <X size={18} />
                        إلغاء
                    </Button>
                    <Button type="submit" className="gap-2" style={{ backgroundColor: '#002147' }}>
                        <Save size={18} />
                        حفظ وإضافة الطالب
                    </Button>
                </div>
            </form>
        </div>
    )
}
