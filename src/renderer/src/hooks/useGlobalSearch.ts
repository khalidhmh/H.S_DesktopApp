import { useState, useEffect } from 'react'
import { StudentService } from '../services/student.service'
import { RoomService } from '../services/room.service'
import { logger } from '@shared/utils/logger'

interface SearchResult {
  students: any[]
  rooms: any[]
}

export const useGlobalSearch = (query: string) => {
  const [results, setResults] = useState<SearchResult>({ students: [], rooms: [] })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Basic debounce
    const timer = setTimeout(async () => {
      if (!query || query.length < 2) {
        setResults({ students: [], rooms: [] })
        return
      }

      setLoading(true)
      try {
        const [students, rooms] = await Promise.all([
          StudentService.searchStudents(query),
          RoomService.searchRooms(query)
        ])
        setResults({ students, rooms })
      } catch (error) {
        logger.error('Global search failed:', error)
      } finally {
        setLoading(false)
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(timer)
  }, [query])

  return { results, loading }
}
