export interface InventoryItem {
  id: string
  name: string
  nameAr: string
  totalQuantity: number
  perStudent: boolean // true for items consumed per student (Beds, Chairs, etc.)
  icon: string // Lucide icon name
}

const STORAGE_KEY = 'inventory_items'

// Seed data for initial inventory
const SEED_DATA: InventoryItem[] = [
  {
    id: 'bed',
    name: 'Bed',
    nameAr: 'سراير',
    totalQuantity: 500,
    perStudent: true,
    icon: 'Bed'
  },
  {
    id: 'mattress',
    name: 'Mattress',
    nameAr: 'مراتب',
    totalQuantity: 500,
    perStudent: true,
    icon: 'Bed'
  },
  {
    id: 'chair',
    name: 'Chair',
    nameAr: 'كراسي',
    totalQuantity: 500,
    perStudent: true,
    icon: 'Armchair'
  },
  {
    id: 'table',
    name: 'Table',
    nameAr: 'طاولات',
    totalQuantity: 500,
    perStudent: true,
    icon: 'Table'
  },
  {
    id: 'fridge',
    name: 'Fridge',
    nameAr: 'ثلاجات',
    totalQuantity: 50,
    perStudent: false,
    icon: 'Refrigerator'
  }
]

export const InventoryService = {
  /**
   * Get all inventory items from localStorage
   * Initializes with seed data if no data exists
   */
  getAll: async (): Promise<InventoryItem[]> => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)

      if (!stored) {
        // Initialize with seed data on first load
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA))
        return SEED_DATA
      }

      return JSON.parse(stored)
    } catch (error) {
      console.error('Failed to load inventory:', error)
      return SEED_DATA
    }
  },

  /**
   * Update the total quantity of a specific item
   */
  updateQuantity: async (id: string, newQuantity: number): Promise<void> => {
    try {
      const items = await InventoryService.getAll()
      const updated = items.map((item) =>
        item.id === id ? { ...item, totalQuantity: newQuantity } : item
      )

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch (error) {
      console.error('Failed to update inventory quantity:', error)
      throw error
    }
  },

  /**
   * Add a new inventory item
   */
  addItem: async (item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> => {
    try {
      const items = await InventoryService.getAll()
      const newItem: InventoryItem = {
        ...item,
        id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }

      items.push(newItem)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))

      return newItem
    } catch (error) {
      console.error('Failed to add inventory item:', error)
      throw error
    }
  },

  /**
   * Delete an inventory item
   */
  deleteItem: async (id: string): Promise<void> => {
    try {
      const items = await InventoryService.getAll()
      const filtered = items.filter((item) => item.id !== id)

      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    } catch (error) {
      console.error('Failed to delete inventory item:', error)
      throw error
    }
  },

  /**
   * Reset inventory to seed data (for testing/demo purposes)
   */
  resetToDefaults: async (): Promise<void> => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA))
  }
}
