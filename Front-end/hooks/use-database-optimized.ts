import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useOrganization } from '@/contexts/organization-context'
import { toast } from 'sonner'
import { requiresOrgScope, CACHE_CONFIG } from '@/lib/database-constants'

interface UseDataOptions {
  table: string
  select?: string
  filter?: Record<string, string | number | boolean | null>
  orderBy?: { column: string; ascending?: boolean }
  limit?: number
  single?: boolean
  realtime?: boolean
  enabled?: boolean // Allow disabling the query
  staleTime?: number // How long data is considered fresh (ms)
  onError?: (error: Error) => void
}

interface DataState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

// Cache for storing query results with LRU eviction
const queryCache = new Map<string, { data: unknown; timestamp: number; lastAccessed: number }>()
const cacheAccessOrder: string[] = [] // Track access order for LRU

// Cache management functions
function updateCacheAccessOrder(key: string) {
  const index = cacheAccessOrder.indexOf(key)
  if (index > -1) {
    cacheAccessOrder.splice(index, 1)
  }
  cacheAccessOrder.push(key)
}

function evictLRUItems() {
  // Evict least recently used items when cache exceeds limit
  while (queryCache.size > CACHE_CONFIG.MAX_CACHE_SIZE && cacheAccessOrder.length > 0) {
    const keyToEvict = cacheAccessOrder.shift()
    if (keyToEvict) {
      queryCache.delete(keyToEvict)
      console.log(`[Cache] Evicted LRU item with key: ${keyToEvict.substring(0, 50)}...`)
    }
  }
}

function setCacheItem(key: string, data: unknown) {
  const now = Date.now()
  queryCache.set(key, { data, timestamp: now, lastAccessed: now })
  updateCacheAccessOrder(key)
  evictLRUItems()
}

function getCacheItem(key: string, staleTime: number) {
  const cached = queryCache.get(key)
  if (cached && Date.now() - cached.timestamp < staleTime) {
    // Update last accessed time and order
    cached.lastAccessed = Date.now()
    updateCacheAccessOrder(key)
    return cached.data
  }
  return null
}

// Generate cache key from options
function getCacheKey(options: UseDataOptions, organizationId: string | null): string {
  return JSON.stringify({
    table: options.table,
    select: options.select,
    filter: options.filter,
    orderBy: options.orderBy,
    limit: options.limit,
    single: options.single,
    organizationId
  })
}

export function useData<T = unknown>({
  table,
  select = '*',
  filter,
  orderBy,
  limit,
  single = false,
  realtime = false,
  enabled = true,
  staleTime = 5000, // Default 5 seconds
  onError
}: UseDataOptions): DataState<T> & { refetch: () => void } {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState<Error | null>(null)
  const { organizationId, isLoading: orgLoading } = useOrganization()
  const supabase = createClient()
  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchData = useCallback(async () => {
    // Don't fetch if disabled or org is still loading
    if (!enabled || orgLoading) {
      setLoading(false)
      return
    }

    // Don't fetch multi-tenant tables if no organization ID exists
    if (requiresOrgScope(table) && !organizationId) {
      console.log(`Skipping query for ${table} - no organization ID available`)
      setLoading(false)
      setData(null)
      return
    }

    // Check cache first
    const cacheKey = getCacheKey({ table, select, filter, orderBy, limit, single }, organizationId)
    const cachedData = getCacheItem(cacheKey, staleTime)

    if (cachedData !== null) {
      setData(cachedData as T)
      setLoading(false)
      return
    }

    // Abort previous request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController()

    try {
      setLoading(true)
      setError(null)

      // Build query
      let query = supabase.from(table).select(select)

      // Apply organization filter for multi-tenant tables
      // These tables require organization_id filtering for multi-tenancy
      if (requiresOrgScope(table) && organizationId) {
        query = query.eq('organization_id', organizationId)
      }

      // Apply custom filters
      if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value)
          }
        })
      }

      // Apply ordering
      if (orderBy) {
        query = query.order(orderBy.column, {
          ascending: orderBy.ascending ?? true
        })
      }

      // Apply limit
      if (limit) {
        query = query.limit(limit)
      }

      // Execute query
      const result = single ? await query.single() : await query

      if (result.error) {
        // Check if it's an abort error
        if (result.error.message?.includes('aborted')) {
          return
        }
        throw result.error
      }

      // Cache the result
      setCacheItem(cacheKey, result.data)

      // Update state only if component is still mounted
      if (!abortControllerRef.current?.signal.aborted) {
        setData(result.data as T)
        setError(null)
      }
    } catch (err) {
      if (err instanceof Error && err.message?.includes('aborted')) {
        return
      }
      console.error(`Error fetching ${table}:`, err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data'
      setError(new Error(errorMessage))
      setData(null)
      if (onError) {
        onError(err as Error)
      }
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setLoading(false)
      }
    }
  }, [table, select, filter, orderBy, limit, single, supabase, onError, enabled, orgLoading, organizationId, staleTime])

  useEffect(() => {
    fetchData()

    return () => {
      // Cleanup: abort any pending requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchData])

  useEffect(() => {
    // Set up realtime subscription if requested
    if (realtime && enabled && !orgLoading) {
      const channel = supabase
        .channel(`${table}_changes`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table },
          () => {
            // Invalidate cache and refetch
            const cacheKey = getCacheKey({ table, select, filter, orderBy, limit, single }, organizationId)
            queryCache.delete(cacheKey)
            fetchData()
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
    // FIXED: Reduced dependency array to prevent excessive re-subscriptions
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realtime, table, enabled, orgLoading])

  return { data, loading, error, refetch: fetchData }
}

// Hook for mutations with optimistic updates
export function useMutation<T = unknown>(table: string) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { organizationId, user } = useOrganization()
  const supabase = createClient()

  const insert = useCallback(async (data: Partial<T>): Promise<T | null> => {
    // Prevent inserts to multi-tenant tables without organization ID
    if (requiresOrgScope(table) && !organizationId) {
      const errorMessage = 'Cannot insert - no organization ID available'
      setError(new Error(errorMessage))
      toast.error(errorMessage)
      return null
    }

    try {
      setLoading(true)
      setError(null)

      let insertData = { ...data }

      if (requiresOrgScope(table) && organizationId) {
        insertData = { ...insertData, organization_id: organizationId }
      }

      // Add user_id for tables that require it
      if (user?.id && !(insertData as Record<string, unknown>).user_id) {
        insertData = { ...insertData, user_id: user.id }
      }

      const { data: result, error } = await supabase
        .from(table)
        .insert(insertData)
        .select()
        .single()

      if (error) throw error

      // Invalidate relevant cache entries
      queryCache.forEach((_, key) => {
        if (key.includes(`"table":"${table}"`)) {
          queryCache.delete(key)
        }
      })

      toast.success('Created successfully')
      return result as T
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create'
      setError(new Error(errorMessage))
      toast.error(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [table, supabase, organizationId, user])

  const update = useCallback(async (id: string, data: Partial<T>): Promise<T | null> => {
    // Prevent updates to multi-tenant tables without organization ID
    if (requiresOrgScope(table) && !organizationId) {
      const errorMessage = 'Cannot update - no organization ID available'
      setError(new Error(errorMessage))
      toast.error(errorMessage)
      return null
    }

    try {
      setLoading(true)
      setError(null)

      let query = supabase.from(table).update(data)

      if (requiresOrgScope(table) && organizationId) {
        query = query.eq('organization_id', organizationId)
      }

      const { data: result, error } = await query
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Invalidate relevant cache entries
      queryCache.forEach((_, key) => {
        if (key.includes(`"table":"${table}"`)) {
          queryCache.delete(key)
        }
      })

      toast.success('Updated successfully')
      return result as T
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update'
      setError(new Error(errorMessage))
      toast.error(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [table, supabase, organizationId])

  const remove = useCallback(async (id: string): Promise<boolean> => {
    // Prevent deletes from multi-tenant tables without organization ID
    if (requiresOrgScope(table) && !organizationId) {
      const errorMessage = 'Cannot delete - no organization ID available'
      setError(new Error(errorMessage))
      toast.error(errorMessage)
      return false
    }

    try {
      setLoading(true)
      setError(null)

      let query = supabase.from(table).delete()

      if (requiresOrgScope(table) && organizationId) {
        query = query.eq('organization_id', organizationId)
      }

      const { error } = await query.eq('id', id)

      if (error) throw error

      // Invalidate relevant cache entries
      queryCache.forEach((_, key) => {
        if (key.includes(`"table":"${table}"`)) {
          queryCache.delete(key)
        }
      })

      toast.success('Deleted successfully')
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete'
      setError(new Error(errorMessage))
      toast.error(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }, [table, supabase, organizationId])

  return { insert, update, remove, loading, error }
}

// Optimized aggregate hook with caching
export function useAggregate(
  table: string,
  aggregateType: 'count' | 'sum' | 'avg' | 'min' | 'max',
  column?: string,
  filter?: Record<string, string | number | boolean | null>,
  options?: { enabled?: boolean; staleTime?: number }
) {
  const [data, setData] = useState<number>(0)
  const [loading, setLoading] = useState(options?.enabled !== false)
  const [error, setError] = useState<Error | null>(null)
  const { organizationId, isLoading: orgLoading } = useOrganization()
  const supabase = createClient()
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const fetchAggregate = async () => {
      // Don't fetch if disabled or org is still loading
      if (options?.enabled === false || orgLoading) {
        setLoading(false)
        return
      }

      // Don't fetch multi-tenant tables if no organization ID exists
      if (requiresOrgScope(table) && !organizationId) {
        console.log(`Skipping aggregate query for ${table} - no organization ID available`)
        setLoading(false)
        setData(0)
        return
      }

      // Check cache first
      const cacheKey = `aggregate_${table}_${aggregateType}_${column}_${JSON.stringify(filter)}_${organizationId}`
      const staleTime = options?.staleTime ?? 10000 // Default 10 seconds for aggregates
      const cachedData = getCacheItem(cacheKey, staleTime)

      if (cachedData !== null) {
        setData(cachedData as number)
        setLoading(false)
        return
      }

      // Abort previous request if any
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      abortControllerRef.current = new AbortController()

      try {
        setLoading(true)
        setError(null)

        // FIXED: Removed head: true to prevent excessive HEAD requests to Supabase
        let query = supabase.from(table).select(column || '*', { count: 'exact' })

        // Apply organization filter
        if (requiresOrgScope(table) && organizationId) {
          query = query.eq('organization_id', organizationId)
        }

        // Apply custom filters
        if (filter) {
          Object.entries(filter).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              query = query.eq(key, value)
            }
          })
        }

        const { count, error } = await query

        if (error) {
          if (error.message?.includes('aborted')) {
            return
          }
          throw error
        }

        const resultValue = aggregateType === 'count' ? (count || 0) : 0

        // Cache the result
        setCacheItem(cacheKey, resultValue)

        if (!abortControllerRef.current?.signal.aborted) {
          setData(resultValue)
        }
      } catch (err) {
        if (err instanceof Error && err.message?.includes('aborted')) {
          return
        }
        console.error(`Error fetching ${table} aggregate:`, err)
        if (!abortControllerRef.current?.signal.aborted) {
          setError(err as Error)
          setData(0)
        }
      } finally {
        if (!abortControllerRef.current?.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchAggregate()

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [table, aggregateType, column, filter, supabase, orgLoading, organizationId, options?.enabled, options?.staleTime])

  return { data, loading, error }
}

// Clear cache utility
export function clearQueryCache(table?: string) {
  if (table) {
    // Clear specific table entries
    const keysToDelete: string[] = []
    queryCache.forEach((_, key) => {
      if (key.includes(`"table":"${table}"`)) {
        keysToDelete.push(key)
      }
    })
    keysToDelete.forEach(key => {
      queryCache.delete(key)
      const index = cacheAccessOrder.indexOf(key)
      if (index > -1) {
        cacheAccessOrder.splice(index, 1)
      }
    })
  } else {
    // Clear all cache
    queryCache.clear()
    cacheAccessOrder.length = 0
  }
}

// Export cache statistics for monitoring
export function getCacheStats() {
  const stats = {
    size: queryCache.size,
    maxSize: CACHE_CONFIG.MAX_CACHE_SIZE,
    utilizationPercent: Math.round((queryCache.size / CACHE_CONFIG.MAX_CACHE_SIZE) * 100),
    oldestEntry: null as Date | null,
    newestEntry: null as Date | null,
    averageAge: 0,
    entries: [] as Array<{ key: string; age: number; size: number }>
  }

  if (queryCache.size > 0) {
    let totalAge = 0
    let oldestTime = Date.now()
    let newestTime = 0

    queryCache.forEach((value, key) => {
      const age = Date.now() - value.timestamp
      totalAge += age

      if (value.timestamp < oldestTime) oldestTime = value.timestamp
      if (value.timestamp > newestTime) newestTime = value.timestamp

      stats.entries.push({
        key: key.substring(0, 100), // Truncate long keys
        age: Math.round(age / 1000), // Convert to seconds
        size: JSON.stringify(value.data).length
      })
    })

    stats.oldestEntry = new Date(oldestTime)
    stats.newestEntry = new Date(newestTime)
    stats.averageAge = Math.round(totalAge / queryCache.size / 1000) // In seconds
  }

  return stats
}