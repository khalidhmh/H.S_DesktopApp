import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '../../../components/ui/dialog'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { useStudentStore } from '../../../viewmodels/useStudentStore'
import { Loader2 } from 'lucide-react'


interface AddStudentModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddStudentModal({ isOpen, onClose }: AddStudentModalProps) {
  const { addStudent, isLoading } = useStudentStore()
  const [formData, setFormData] = useState({
    nameArabic: '',
    universityId: '',
    nationalId: '',
    college: '',
    phoneNumber: '',
    guardianContact: '',
    building: 'المبنى أ',
    room: '',
    status: 'ACTIVE'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const validateForm = () => {
    if (!formData.nameArabic || !formData.universityId || !formData.room) {
      setErrorMessage('الرجاء تعبئة الحقول المطلوبة: الاسم الكامل، الرقم الجامعي، رقم الغرفة.')
      return false
    }
    setErrorMessage('')
    return true
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      // Using formData state directly as the form inputs are controlled
      const studentData = {
        nameArabic: formData.nameArabic,
        universityId: formData.universityId,
        nationalId: formData.nationalId,
        college: formData.college,
        phoneNumber: formData.phoneNumber,
        guardianContact: formData.guardianContact,
        building: formData.building,
        room: formData.room,
        status: formData.status,
        // Mocking missing required fields for now or ensuring they are optional/defaulted on backend
        photo_url: null,
        email: null,
        level: '1', // Assuming a default level
        city: 'غير محدد' // Assuming a default city
      }

      // ✅ Removed console.log for production
      const success = await addStudent(studentData)

      if (success) {
        setFormData({
          nameArabic: '',
          universityId: '',
          nationalId: '',
          college: '',
          phoneNumber: '',
          guardianContact: '',
          building: 'المبنى أ',
          room: '',
          status: 'ACTIVE'
        })
        onClose()
      } else {
        setErrorMessage('فشل إضافة الطالب')
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'حدث خطأ غير متوقع')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>إضافة طالب جديد</DialogTitle>
          <DialogDescription>قم بإدخال بيانات الطالب الأساسية</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">الاسم الكامل</label>
            <Input
              required
              value={formData.nameArabic}
              onChange={(e) => setFormData({ ...formData, nameArabic: e.target.value })}
              placeholder="الاسم الثلاثي"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">الرقم الجامعي</label>
              <Input
                required
                value={formData.universityId}
                onChange={(e) => setFormData({ ...formData, universityId: e.target.value })}
                placeholder="442..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">رقم الهوية</label>
              <Input
                value={formData.nationalId}
                onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">الكلية</label>
              <Input
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">رقم الهاتف</label>
              <Input
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">المبنى</label>
              <select
                className="w-full h-10 px-3 py-2 rounded-md border text-sm bg-background focus:ring-2 focus:ring-primary"
                value={formData.building}
                onChange={(e) => setFormData({ ...formData, building: e.target.value })}
              >
                <option>المبنى أ</option>
                <option>المبنى ب</option>
                <option>المبنى ج</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">رقم الغرفة</label>
              <Input
                required
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                placeholder="101"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">هاتف ولي الأمر</label>
            <Input
              value={formData.guardianContact}
              onChange={(e) => setFormData({ ...formData, guardianContact: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              حفظ البيانات
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
