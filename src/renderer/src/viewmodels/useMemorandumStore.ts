import { create } from 'zustand'
import { logger } from '@shared/utils/logger'

export interface Memo {
  id: number
  title: string
  target: 'ALL' | 'BUILDING' | 'FLOOR'
  targetDetails?: string
  importance: 'NORMAL' | 'URGENT'
  content: string
  createdAt: string
  createdBy: {
    name: string
    email: string
  }
}

interface MemorandumState {
  memos: Memo[]
  isLoading: boolean

  fetchMemos: () => Promise<void>
  createMemo: (data: Omit<Memo, 'id' | 'createdAt' | 'createdBy'> & { createdById: number }) => Promise<void>
  deleteMemo: (id: number) => Promise<void>
}

export const useMemorandumStore = create<MemorandumState>((set, get) => ({
  memos: [],
  isLoading: false,

  fetchMemos: async () => {
    set({ isLoading: true })
    try {
      // ✅ Now using real API instead of mock data
      const memos = await window.api.getMemos()
      set({ memos, isLoading: false })
    } catch (error) {
      logger.error('Failed to fetch memos:', error)
      set({ isLoading: false })
    }
  },

  createMemo: async (data) => {
    try {
      const newMemo = await window.api.createMemo(data)
      const currentMemos = get().memos
      set({ memos: [newMemo, ...currentMemos] })
    } catch (error) {
      logger.error('Failed to create memo:', error)
      throw error
    }
  },

  deleteMemo: async (id) => {
    try {
      // TODO: Add delete-memo IPC handler if needed
      const updated = get().memos.filter((memo) => memo.id !== id)
      set({ memos: updated })
    } catch (error) {
      logger.error('Failed to delete memo:', error)
      throw error
    }
  }
}))
