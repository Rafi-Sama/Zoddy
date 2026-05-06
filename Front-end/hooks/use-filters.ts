"use client"

import { useState, useCallback, useMemo } from 'react'
import { useDebounce } from './use-debounce'

interface FilterState {
  [key: string]: unknown
}

interface UseFiltersOptions<T> {
  data: T[]
  searchKeys?: (keyof T)[]
  debounceDelay?: number
  initialFilters?: FilterState
}

export function useFilters<T>({
  data,
  searchKeys = [],
  debounceDelay = 300,
  initialFilters = {}
}: UseFiltersOptions<T>) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<FilterState>(initialFilters)

  const debouncedSearchTerm = useDebounce(searchTerm, debounceDelay)

  const updateFilter = useCallback((key: string, value: unknown) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }, [])

  const removeFilter = useCallback((key: string) => {
    setFilters(prev => {
      const newFilters = { ...prev }
      delete newFilters[key]
      return newFilters
    })
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(initialFilters)
    setSearchTerm('')
  }, [initialFilters])

  const filteredData = useMemo(() => {
    let result = [...data]

    // Apply search filter
    if (debouncedSearchTerm && searchKeys.length > 0) {
      result = result.filter(item => {
        return searchKeys.some(key => {
          const value = item[key]
          if (value == null) return false
          return String(value).toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        })
      })
    }

    // Apply custom filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        result = result.filter(item => {
          const itemValue = (item as Record<string, unknown>)[key]
          if (Array.isArray(value)) {
            return value.includes(itemValue)
          }
          return itemValue === value
        })
      }
    })

    return result
  }, [data, debouncedSearchTerm, searchKeys, filters])

  const hasActiveFilters = useMemo(() => {
    return searchTerm !== '' || Object.values(filters).some(v => v && v !== 'all')
  }, [searchTerm, filters])

  return {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    removeFilter,
    resetFilters,
    filteredData,
    hasActiveFilters,
    totalResults: filteredData.length,
    originalCount: data.length
  }
}