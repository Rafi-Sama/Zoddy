"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
// Remove unused import

interface FetchOptions {
  cacheTime?: number // Cache duration in milliseconds
  retryCount?: number
  refetchInterval?: number // Auto refetch interval in milliseconds
  enabled?: boolean // Whether to fetch on mount
}

interface FetchResult<T> {
  data: T | null
  error: Error | null
  loading: boolean
  refetch: () => Promise<void>
  mutate: (data: T) => void
}

// Simple in-memory cache
const cache = new Map<string, { data: unknown; timestamp: number }>()

export function useDataFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: FetchOptions = {}
): FetchResult<T> {
  const {
    cacheTime = 5 * 60 * 1000, // 5 minutes default
    retryCount = 3,
    refetchInterval,
    enabled = true
  } = options

  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(enabled)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchData = useCallback(async () => {
    // Check cache first
    const cached = cache.get(key)
    if (cached && Date.now() - cached.timestamp < cacheTime) {
      setData(cached.data as T)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    let attempts = 0
    while (attempts < retryCount) {
      try {
        const result = await fetcher()

        // Update cache
        cache.set(key, {
          data: result,
          timestamp: Date.now()
        })

        setData(result)
        setError(null)
        setLoading(false)
        return
      } catch (err) {
        attempts++
        if (attempts === retryCount) {
          setError(err instanceof Error ? err : new Error('Failed to fetch data'))
          setLoading(false)
        } else {
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000))
        }
      }
    }
  }, [key, fetcher, cacheTime, retryCount])

  const mutate = useCallback((newData: T) => {
    setData(newData)
    // Update cache
    cache.set(key, {
      data: newData,
      timestamp: Date.now()
    })
  }, [key])

  useEffect(() => {
    if (enabled) {
      fetchData()
    }
  }, [enabled, fetchData])

  // Setup refetch interval
  useEffect(() => {
    if (refetchInterval && refetchInterval > 0) {
      intervalRef.current = setInterval(() => {
        fetchData()
      }, refetchInterval)

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }
  }, [refetchInterval, fetchData])

  return {
    data,
    error,
    loading,
    refetch: fetchData,
    mutate
  }
}

// Hook for fetching paginated data
export function usePaginatedFetch<T>(
  key: string,
  fetcher: (page: number, pageSize: number) => Promise<{ data: T[]; total: number }>,
  pageSize = 10,
  options: FetchOptions = {}
): {
  data: T[]
  error: Error | null
  loading: boolean
  page: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
  nextPage: () => void
  prevPage: () => void
  goToPage: (page: number) => void
  refetch: () => Promise<void>
} {
  const [page, setPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  const fetchPaginatedData = useCallback(async () => {
    const result = await fetcher(page, pageSize)
    setTotalItems(result.total)
    return result.data
  }, [fetcher, page, pageSize])

  const { data, error, loading, refetch } = useDataFetch(
    `${key}-page-${page}-size-${pageSize}`,
    fetchPaginatedData,
    options
  )

  const totalPages = Math.ceil(totalItems / pageSize)
  const hasNext = page < totalPages
  const hasPrev = page > 1

  const nextPage = useCallback(() => {
    if (hasNext) {
      setPage(p => p + 1)
    }
  }, [hasNext])

  const prevPage = useCallback(() => {
    if (hasPrev) {
      setPage(p => p - 1)
    }
  }, [hasPrev])

  const goToPage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
    }
  }, [totalPages])

  return {
    data: data || [],
    error,
    loading,
    page,
    totalPages,
    hasNext,
    hasPrev,
    nextPage,
    prevPage,
    goToPage,
    refetch
  }
}

// Clear cache utility
export function clearCache(key?: string) {
  if (key) {
    cache.delete(key)
  } else {
    cache.clear()
  }
}