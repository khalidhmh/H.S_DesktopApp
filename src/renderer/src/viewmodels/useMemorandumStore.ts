import { create } from 'zustand'

export type MemoTarget = 'ALL' | 'BUILDING' | 'FLOOR'
export type MemoImportance = 'NORMAL' | 'URGENT'

export interface Memorandum {
  id: number
  title: string
  target: MemoTarget
  targetDetails?: string // Building name or floor number
  importance: MemoImportance
  content: string
  createdAt: string
  createdBy: string
}

interface MemorandumState {
  memos: Memorandum[]
  isLoading: boolean
  isSending: boolean

  fetchMemos: () => void
  sendMemo: (data: Omit<Memorandum, 'id' | 'createdAt' | 'createdBy'>) => void
  getMemoHistory: () => Memorandum[]
}

// Mock Data
const MOCK_MEMOS: Memorandum[] = [
  {
    id: 1,
    title: 'تعليمات السكن الجديدة',
    target: 'ALL',
    importance: 'URGENT',
    content:
      'يرجى من جميع الطلاب الالتزام بالتعليمات الجديدة للسكن والتي تشمل: منع التدخين داخل المباني، الالتزام بمواعيد الحضور والغياب، المحافظة على النظافة العامة.',
    createdAt: '2024-02-05T09:00:00',
    createdBy: 'مدير السكن'
  },
  {
    id: 2,
    title: 'صيانة دورية للمصاعد',
    target: 'BUILDING',
    targetDetails: 'مبنى أ',
    importance: 'NORMAL',
    content:
      'سيتم إجراء صيانة دورية للمصاعد في مبنى أ يوم الخميس القادم من الساعة 8 صباحاً حتى 12 ظهراً. يرجى استخدام السلالم خلال هذه الفترة.',
    createdAt: '2024-02-04T11:30:00',
    createdBy: 'قسم الصيانة'
  },
  {
    id: 3,
    title: 'موعد اجتماع الطلاب',
    target: 'FLOOR',
    targetDetails: 'الطابق الثالث - مبنى ب',
    importance: 'NORMAL',
    content:
      'اجتماع مع طلاب الطابق الثالث في مبنى ب لمناقشة الأنشطة الطلابية القادمة. الاجتماع يوم الأحد الساعة 6 مساءً في قاعة الاجتماعات.',
    createdAt: '2024-02-03T14:20:00',
    createdBy: 'المشرف العام'
  },
  {
    id: 4,
    title: 'تحذير من عدم الالتزام',
    target: 'ALL',
    importance: 'URGENT',
    content:
      'لوحظ عدم التزام بعض الطلاب بمواعيد الحضور المسائي. نذكركم بأن التأخر المتكرر قد يؤدي إلى جزاءات إدارية. يرجى الالتزام بالوقت المحدد: 10 مساءً.',
    createdAt: '2024-02-02T16:00:00',
    createdBy: 'مدير السكن'
  },
  {
    id: 5,
    title: 'إعلان عن فعالية رياضية',
    target: 'ALL',
    importance: 'NORMAL',
    content:
      'ننظم بطولة كرة قدم بين طلاب السكن يوم الجمعة القادم في ملعب الجامعة. التسجيل مفتوح حتى يوم الأربعاء. للتسجيل يرجى التواصل مع قسم الأنشطة.',
    createdAt: '2024-02-01T10:15:00',
    createdBy: 'قسم الأنشطة الطلابية'
  },
  {
    id: 6,
    title: 'انقطاع الماء المؤقت',
    target: 'BUILDING',
    targetDetails: 'مبنى ج',
    importance: 'URGENT',
    content:
      'سيتم قطع الماء بشكل مؤقت في مبنى ج غداً من الساعة 9 صباحاً حتى 2 ظهراً لإجراء أعمال الصيانة. يرجى التخطيط وفقاً لذلك.',
    createdAt: '2024-01-31T13:45:00',
    createdBy: 'قسم الصيانة'
  },
  {
    id: 7,
    title: 'تذكير بقوانين السكن',
    target: 'ALL',
    importance: 'NORMAL',
    content:
      'نذكر الطلاب الكرام بضرورة الالتزام بقوانين السكن الجامعي وعدم إحداث ضوضاء بعد الساعة 11 مساءً احتراماً لراحة الآخرين.',
    createdAt: '2024-01-30T08:30:00',
    createdBy: 'المشرف العام'
  }
]

export const useMemorandumStore = create<MemorandumState>((set, get) => ({
  memos: [],
  isLoading: false,
  isSending: false,

  fetchMemos: () => {
    set({ isLoading: true })
    // Simulate API call delay
    setTimeout(() => {
      set({
        memos: MOCK_MEMOS,
        isLoading: false
      })
    }, 300)
  },

  sendMemo: (data) => {
    set({ isSending: true })
    // Simulate API call delay
    setTimeout(() => {
      const newMemo: Memorandum = {
        ...data,
        id: get().memos.length + 1,
        createdAt: new Date().toISOString(),
        createdBy: 'مدير السكن' // In real app, get from auth context
      }
      set({
        memos: [newMemo, ...get().memos],
        isSending: false
      })
    }, 500)
  },

  getMemoHistory: () => {
    return get().memos
  }
}))
