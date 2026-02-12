import { create } from 'zustand'
import { InventoryService, InventoryItem } from '../services/inventory.service'
import { useStudentStore } from './useStudentStore'

export interface InventoryItemWithStats extends InventoryItem {
  usedQuantity: number
  availableQuantity: number
}

interface InventoryState {
  items: InventoryItem[]
  isLoading: boolean
  error: string | null

  // Actions
  fetchInventory: () => Promise<void>
  updateTotalQuantity: (id: string, newQuantity: number) => Promise<void>
  addItem: (item: Omit<InventoryItem, 'id'>) => Promise<void>
  deleteItem: (id: string) => Promise<void>

  // Computed getter
  getItemsWithStats: () => InventoryItemWithStats[]
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchInventory: async () => {
    set({ isLoading: true, error: null })
    try {
      const items = await InventoryService.getAll()
      set({ items, isLoading: false })
    } catch (error) {
      console.error('Failed to fetch inventory:', error)
      set({ error: 'فشل تحميل البيانات', isLoading: false })
    }
  },

  updateTotalQuantity: async (id: string, newQuantity: number) => {
    try {
      await InventoryService.updateQuantity(id, newQuantity)

      // Update local state
      set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? { ...item, totalQuantity: newQuantity } : item
        )
      }))
    } catch (error) {
      console.error('Failed to update quantity:', error)
      set({ error: 'فشل تحديث الكمية' })
    }
  },

  addItem: async (item: Omit<InventoryItem, 'id'>) => {
    set({ isLoading: true })
    try {
      const newItem = await InventoryService.addItem(item)
      set((state) => ({
        items: [...state.items, newItem],
        isLoading: false
      }))
    } catch (error) {
      console.error('Failed to add item:', error)
      set({ error: 'فشل إضافة الصنف', isLoading: false })
    }
  },

  deleteItem: async (id: string) => {
    try {
      await InventoryService.deleteItem(id)
      set((state) => ({
        items: state.items.filter((item) => item.id !== id)
      }))
    } catch (error) {
      console.error('Failed to delete item:', error)
      set({ error: 'فشل حذف الصنف' })
    }
  },

  /**
   * Computed property: Get items with calculated stats
   * For per-student items, usedQuantity = active students count
   * availableQuantity = totalQuantity - usedQuantity
   */
  getItemsWithStats: () => {
    const { items } = get()

    // Get active students count from StudentStore
    const studentStore = useStudentStore.getState()
    const activeStudents = studentStore.students.filter((s) => s.status === 'ACTIVE').length

    return items.map((item) => {
      const usedQuantity = item.perStudent ? activeStudents : 0
      const availableQuantity = item.totalQuantity - usedQuantity

      return {
        ...item,
        usedQuantity,
        availableQuantity
      }
    })
  }
}))
