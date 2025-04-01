import { useState } from 'react'

type SortDirection = 'asc' | 'desc' | null
type SortConfig<T> = {
  key: keyof T
  direction: SortDirection
}

export function useSort<T>(items: T[]) {
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(null)

  const sortedItems = [...items].sort((a, b) => {
    if (!sortConfig) return 0

    const { key, direction } = sortConfig
    const aValue = a[key]
    const bValue = b[key]

    if (aValue === bValue) return 0
    if (direction === 'asc') {
      return aValue < bValue ? -1 : 1
    }
    return aValue > bValue ? -1 : 1
  })

  const requestSort = (key: keyof T) => {
    let direction: SortDirection = 'asc'
    if (sortConfig?.key === key) {
      if (sortConfig.direction === 'asc') direction = 'desc'
      else if (sortConfig.direction === 'desc') direction = null
      else direction = 'asc'
    }
    setSortConfig(direction ? { key, direction } : null)
  }

  return { items: sortedItems, sortConfig, requestSort }
}
