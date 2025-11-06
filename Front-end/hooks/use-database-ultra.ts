/**
 * Ultra-optimized database hook with advanced caching, query deduplication,
 * request batching, and smart invalidation strategies
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useOrganization } from '@/contexts/organization-context'
import { requiresOrgScope, CACHE_CONFIG } from '@/lib/database-constants'
import type { Order, Customer, Product } from '@/types/database'

const supabase = createClient()

// Types
type TableName = 'orders' | 'customers' | 'products' | 'team_members' | 'notifications' | 'users'
type TableMap = {
  orders: Order
  customers: Customer
  products: Product
  // Add other tables as needed
}

type Tables = {
  [K in TableName]: {
    Row: K extends keyof TableMap ? TableMap[K] : Record<string, unknown>
    Insert: K extends keyof TableMap ? Partial<TableMap[K]> : Record<string, unknown>
    Update: K extends keyof TableMap ? Partial<TableMap[K]> : Record<string, unknown>
  }
}

interface UseDataOptions<T extends TableName> {
  table: T
  select?: string
  filter?: Partial<Tables[T]['Row']>
  orderBy?: { column: string; ascending: boolean }
  limit?: number
  offset?: number // For pagination
  single?: boolean
  realtime?: boolean
  realtimeFilter?: Partial<Tables[T]['Row']> // Specific filter for realtime
  staleTime?: number // Cache duration in ms (default: 5 minutes)
  enabled?: boolean // Whether to run query
  dedupKey?: string // Key for deduplication
}

interface PaginationInfo {
  page: number
  pageSize: number
  totalPages: number
  totalCount: number
  hasMore: boolean
}

interface UseDataReturn<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
  pagination?: PaginationInfo
  nextPage?: () => void
  prevPage?: () => void
  setPage?: (page: number) => void
}

interface CacheEntry {
  data: unknown
  timestamp: number
  staleTime: number
  subscribers: Set<string>
}

interface PendingRequest {
  promise: Promise<unknown>
  timestamp: number
}

// Constants
const DEFAULT_STALE_TIME = CACHE_CONFIG.DEFAULT_STALE_TIME
const CACHE_SIZE_LIMIT = CACHE_CONFIG.MAX_CACHE_SIZE
const REQUEST_DEDUP_WINDOW = CACHE_CONFIG.REQUEST_DEDUP_WINDOW

// Global cache and request management
class DatabaseCache {
  private cache: Map<string, CacheEntry> = new Map()
  private pendingRequests: Map<string, PendingRequest> = new Map()
  private cacheOrder: string[] = [] // LRU tracking

  // Generate consistent cache key
  getCacheKey<T extends TableName>(options: UseDataOptions<T>, organizationId: string | null): string {
    // Sort object keys for consistent stringification
    const normalized = {
      table: options.table,
      select: options.select || '*',
      filter: options.filter ? this.sortObject(options.filter) : null,
      orderBy: options.orderBy,
      limit: options.limit,
      offset: options.offset || 0,
      single: options.single || false,
      organizationId: organizationId,
      dedupKey: options.dedupKey
    }
    return JSON.stringify(normalized)
  }

  private sortObject(obj: unknown): unknown {
    if (Array.isArray(obj)) return obj.map(item => this.sortObject(item))
    if (obj !== null && typeof obj === 'object') {
      const objRecord = obj as Record<string, unknown>
      return Object.keys(objRecord).sort().reduce((result, key) => {
        result[key] = this.sortObject(objRecord[key])
        return result
      }, {} as Record<string, unknown>)
    }
    return obj
  }

  // Get cached data if fresh
  get(key: string, subscriberId: string): unknown | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    const now = Date.now()
    const age = now - entry.timestamp

    // Add subscriber
    entry.subscribers.add(subscriberId)

    // Check if cache is still fresh
    if (age < entry.staleTime) {
      // Move to end for LRU
      this.updateLRU(key)
      return entry.data
    }

    return null
  }

  // Set cache with LRU eviction
  set(key: string, data: unknown, staleTime: number = DEFAULT_STALE_TIME): void {
    // Enforce cache size limit (LRU eviction)
    if (this.cache.size >= CACHE_SIZE_LIMIT && !this.cache.has(key)) {
      const oldestKey = this.cacheOrder.shift()
      if (oldestKey) {
        const entry = this.cache.get(oldestKey)
        // Only delete if no active subscribers
        if (entry && entry.subscribers.size === 0) {
          this.cache.delete(oldestKey)
        } else if (oldestKey) {
          // Put it back if it has subscribers
          this.cacheOrder.push(oldestKey)
        }
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      staleTime,
      subscribers: new Set()
    })
    this.updateLRU(key)
  }

  private updateLRU(key: string): void {
    const index = this.cacheOrder.indexOf(key)
    if (index > -1) {
      this.cacheOrder.splice(index, 1)
    }
    this.cacheOrder.push(key)
  }

  // Smart invalidation - only invalidate affected queries
  invalidate(table: string, filter?: Record<string, unknown>, operation?: 'insert' | 'update' | 'delete'): void {
    const keysToInvalidate: string[] = []

    this.cache.forEach((entry, key) => {
      try {
        const parsed = JSON.parse(key)

        // Only invalidate queries for the same table
        if (parsed.table !== table) return

        // If no filter provided, invalidate all queries for this table
        if (!filter) {
          keysToInvalidate.push(key)
          return
        }

        // Smart invalidation based on operation type
        if (operation === 'insert') {
          // Invalidate queries without filters or with matching filters
          if (!parsed.filter || this.filterMatches(filter, parsed.filter)) {
            keysToInvalidate.push(key)
          }
        } else if (operation === 'update' || operation === 'delete') {
          // Invalidate if the filter could match the affected record
          if (!parsed.filter || this.filterOverlaps(filter, parsed.filter)) {
            keysToInvalidate.push(key)
          }
        }
      } catch {
        // If can't parse, invalidate to be safe
        if (key.includes(`"table":"${table}"`)) {
          keysToInvalidate.push(key)
        }
      }
    })

    // Delete invalidated entries
    keysToInvalidate.forEach(key => {
      this.cache.delete(key)
      const index = this.cacheOrder.indexOf(key)
      if (index > -1) {
        this.cacheOrder.splice(index, 1)
      }
    })
  }

  private filterMatches(record: Record<string, unknown>, filter: Record<string, unknown>): boolean {
    return Object.keys(filter).every(key => record[key] === filter[key])
  }

  private filterOverlaps(filter1: Record<string, unknown>, filter2: Record<string, unknown>): boolean {
    // Check if filters could potentially overlap
    return Object.keys(filter1).some(key =>
      filter2[key] === undefined || filter1[key] === filter2[key]
    )
  }

  // Request deduplication
  async deduplicateRequest<T>(
    key: string,
    fetcher: () => Promise<T>
  ): Promise<T> {
    // Check if identical request is in flight
    const pending = this.pendingRequests.get(key)
    if (pending && Date.now() - pending.timestamp < REQUEST_DEDUP_WINDOW) {
      return pending.promise as Promise<T>
    }

    // Create new request
    const promise = fetcher()
    this.pendingRequests.set(key, {
      promise,
      timestamp: Date.now()
    })

    try {
      const result = await promise
      return result
    } finally {
      // Clean up after request completes
      setTimeout(() => {
        this.pendingRequests.delete(key)
      }, REQUEST_DEDUP_WINDOW)
    }
  }

  // Remove subscriber
  unsubscribe(key: string, subscriberId: string): void {
    const entry = this.cache.get(key)
    if (entry) {
      entry.subscribers.delete(subscriberId)
    }
  }

  // Get cache statistics
  getStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        age: Date.now() - entry.timestamp,
        subscribers: entry.subscribers.size
      }))
    }
  }
}

// Singleton cache instance
const dbCache = new DatabaseCache()

// Export for debugging
if (typeof window !== 'undefined') {
  (window as Window & { __dbCache?: DatabaseCache }).__dbCache = dbCache
}

/**
 * Ultra-optimized data fetching hook with advanced caching
 */
export function useData<T extends TableName, R = Tables[T]['Row'][]>(
  options: UseDataOptions<T>
): UseDataReturn<R> {
  const { organizationId, isLoading: orgLoading } = useOrganization()
  const [data, setData] = useState<R | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [pagination, setPagination] = useState<PaginationInfo | undefined>()

  const subscriberId = useRef(`${Math.random()}`).current
  const abortControllerRef = useRef<AbortController | null>(null)
  const realtimeChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  // Determine if this table needs organization scoping
  const needsOrgScope = useMemo(() =>
    requiresOrgScope(options.table),
    [options.table]
  )

  // Generate cache key
  const cacheKey = useMemo(() => {
    if (needsOrgScope && !organizationId && !orgLoading) return null
    return dbCache.getCacheKey(options, organizationId)
  }, [options, organizationId, needsOrgScope, orgLoading])

  // Fetch data with caching and deduplication
  const fetchData = useCallback(async () => {
    if (!cacheKey) {
      setLoading(false)
      setData(null)
      return
    }
    if (options.enabled === false) {
      setLoading(false)
      return
    }

    // Don't fetch multi-tenant tables if no organization ID exists
    if (needsOrgScope && !organizationId) {
      console.log(`Skipping query for ${options.table} - no organization ID available`)
      setLoading(false)
      setData(null)
      return
    }

    // Check cache first
    const cached = dbCache.get(cacheKey, subscriberId)
    if (cached !== null) {
      // Type assertion since we know the cache structure
      const cachedResult = cached as { data: R; pagination?: PaginationInfo }
      setData(cachedResult.data)
      if (cachedResult.pagination) setPagination(cachedResult.pagination)
      setLoading(false)
      return
    }

    // Cancel previous request
    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController()

    setLoading(true)
    setError(null)

    try {
      // Deduplicate concurrent requests
      const result = await dbCache.deduplicateRequest(cacheKey, async () => {
        // Build query
        let query = supabase.from(options.table).select(options.select || '*', {
          count: options.limit ? 'exact' : undefined
        })

        // Add organization filter for multi-tenant tables
        if (needsOrgScope && organizationId) {
          query = query.eq('organization_id', organizationId)
        }

        // Apply filters
        if (options.filter) {
          Object.entries(options.filter).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              query = query.eq(key, value)
            }
          })
        }

        // Apply ordering
        if (options.orderBy) {
          query = query.order(options.orderBy.column, {
            ascending: options.orderBy.ascending
          })
        }

        // Apply pagination
        if (options.limit) {
          const offset = options.offset || 0
          query = query.range(offset, offset + options.limit - 1)
        }

        // Execute query - handle single vs multiple differently for type safety
        let result: unknown
        let queryError: unknown
        let count: number | null = null

        if (options.single) {
          const response = await query.single()
          result = response.data
          queryError = response.error
        } else {
          const response = await query
          result = response.data
          queryError = response.error
          count = response.count
        }

        if (queryError) throw queryError

        // Calculate pagination info if applicable
        let paginationInfo: PaginationInfo | undefined
        if (options.limit && count !== null) {
          const currentPage = Math.floor((options.offset || 0) / options.limit) + 1
          paginationInfo = {
            page: currentPage,
            pageSize: options.limit,
            totalPages: Math.ceil(count / options.limit),
            totalCount: count,
            hasMore: (options.offset || 0) + options.limit < count
          }
        }

        return { data: result, pagination: paginationInfo }
      })

      // Cache the result
      dbCache.set(cacheKey, result, options.staleTime || DEFAULT_STALE_TIME)

      // Update state
      setData(result.data as R)
      if (result.pagination) setPagination(result.pagination)
      setLoading(false)
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err)
        setLoading(false)
        console.error(`Database query error (${options.table}):`, err)
      }
    }
  }, [cacheKey, options, organizationId, needsOrgScope, subscriberId])

  // Set up realtime subscription with filters
  useEffect(() => {
    if (!options.realtime || !cacheKey) return

    // Clean up previous subscription
    if (realtimeChannelRef.current) {
      supabase.removeChannel(realtimeChannelRef.current)
    }

    // Create filtered channel for this specific query
    const channelName = `${options.table}-${subscriberId}-${Date.now()}`
    // Type assertion needed due to Supabase type limitations
    const channel = supabase
      .channel(channelName)
      .on(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        'postgres_changes' as any,
        {
          event: '*',
          schema: 'public',
          table: options.table,
          // Apply realtime filter if provided
          ...(options.realtimeFilter ? { filter: options.realtimeFilter } : {})
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload: any) => {
          // Smart cache invalidation based on change
          dbCache.invalidate(
            options.table,
            payload.new || payload.old,
            payload.eventType as 'insert' | 'update' | 'delete'
          )

          // Refetch data
          fetchData()
        }
      )
      .subscribe()

    realtimeChannelRef.current = channel

    return () => {
      if (realtimeChannelRef.current) {
        supabase.removeChannel(realtimeChannelRef.current)
      }
    }
  }, [options.table, options.realtime, options.realtimeFilter, cacheKey, fetchData, subscriberId])

  // Clean up cache subscription on unmount
  useEffect(() => {
    return () => {
      if (cacheKey) {
        dbCache.unsubscribe(cacheKey, subscriberId)
      }
    }
  }, [cacheKey, subscriberId])

  // Initial fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Pagination helpers
  const nextPage = useCallback(() => {
    if (pagination && pagination.hasMore) {
      // const newOffset = (options.offset || 0) + (options.limit || 10)
      // This would need to trigger a new fetch with updated offset
      // Implementation depends on how you want to handle pagination
      console.log('Next page not yet implemented')
    }
  }, [pagination])

  const prevPage = useCallback(() => {
    if (pagination && pagination.page > 1) {
      // const newOffset = Math.max(0, (options.offset || 0) - (options.limit || 10))
      // This would need to trigger a new fetch with updated offset
      console.log('Previous page not yet implemented')
    }
  }, [pagination])

  const setPage = useCallback((page: number) => {
    if (pagination && options.limit) {
      // const newOffset = (page - 1) * options.limit
      // This would need to trigger a new fetch with updated offset
      console.log('Set page not yet implemented:', page)
    }
  }, [pagination, options])

  return {
    data,
    loading: loading || (needsOrgScope && orgLoading),
    error,
    refetch: fetchData,
    pagination,
    nextPage: pagination ? nextPage : undefined,
    prevPage: pagination ? prevPage : undefined,
    setPage: pagination ? setPage : undefined
  }
}

/**
 * Optimized mutation hook with smart cache invalidation
 */
export function useMutation<T extends TableName>() {
  const { organizationId, user } = useOrganization()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const mutate = useCallback(async (
    operation: 'insert' | 'update' | 'delete',
    table: T,
    data?: Partial<Tables[T]['Insert']> | Partial<Tables[T]['Update']>,
    filter?: Partial<Tables[T]['Row']>
  ) => {
    setLoading(true)
    setError(null)

    try {
      // Add organization_id for multi-tenant tables
      if (requiresOrgScope(table) && organizationId) {
        if (operation === 'insert' && data) {
          (data as Record<string, unknown>).organization_id = organizationId
        } else if (operation === 'update' || operation === 'delete') {
          if (!filter) filter = {} as Partial<Tables[T]['Row']>
          (filter as Record<string, unknown>).organization_id = organizationId
        }
      }

      // Add user_id for tables that require it during insert
      if (operation === 'insert' && data && user?.id && !(data as Record<string, unknown>).user_id) {
        (data as Record<string, unknown>).user_id = user.id
      }

      let result
      switch (operation) {
        case 'insert':
          result = await supabase.from(table).insert(data as Tables[T]['Insert']).select().single()
          break
        case 'update':
          if (!filter) throw new Error('Update requires a filter')
          result = await supabase.from(table).update(data as Tables[T]['Update']).match(filter).select()
          break
        case 'delete':
          if (!filter) throw new Error('Delete requires a filter')
          result = await supabase.from(table).delete().match(filter)
          break
      }

      if (result.error) throw result.error

      // Smart cache invalidation
      dbCache.invalidate(table, (filter || data) as Record<string, unknown>, operation)

      setLoading(false)
      return result.data
    } catch (err) {
      setError(err as Error)
      setLoading(false)
      throw err
    }
  }, [organizationId, user])

  return {
    insert: (table: T, data: Tables[T]['Insert']) => mutate('insert', table, data),
    update: (table: T, data: Tables[T]['Update'], filter: Partial<Tables[T]['Row']>) =>
      mutate('update', table, data, filter),
    remove: (table: T, filter: Partial<Tables[T]['Row']>) => mutate('delete', table, undefined, filter),
    loading,
    error
  }
}

/**
 * Server-side aggregation using database RPCs for optimal performance
 */
export function useAggregate<T extends TableName>(
  table: T,
  operation: 'count' | 'sum' | 'avg' | 'min' | 'max',
  column?: keyof Tables[T]['Row'],
  filter?: Partial<Tables[T]['Row']>
) {
  const [data, setData] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { organizationId } = useOrganization()
  const supabase = createClient()

  useEffect(() => {
    let mounted = true

    const fetchAggregate = async () => {
      try {
        setLoading(true)
        setError(null)

        // Check if organization ID is required for this table
        if (requiresOrgScope(table) && !organizationId) {
          setData(0)
          setLoading(false)
          return
        }

        // Use RPC for server-side aggregation
        const { data: result, error: rpcError } = await supabase.rpc('get_table_aggregate', {
          p_table_name: table,
          p_operation: operation,
          p_column_name: column as string || null,
          p_organization_id: requiresOrgScope(table) ? organizationId : null,
          p_filters: filter || {}
        })

        if (rpcError) throw rpcError

        if (mounted) {
          setData(result || 0)
        }
      } catch (err) {
        console.error(`Error fetching aggregate for ${table}:`, err)
        if (mounted) {
          setError(err as Error)
          setData(null)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchAggregate()

    return () => {
      mounted = false
    }
  }, [table, operation, column, filter, organizationId, supabase])

  return { data, loading, error }
}

/**
 * Batch multiple queries together
 */
export function useBatchedQueries<T extends Record<string, UseDataOptions<TableName>>>(
  queries: T
): {
  [K in keyof T]: UseDataReturn<unknown>
} {
  const results: Record<string, UseDataReturn<unknown>> = {}

  // Process each query
  Object.entries(queries).forEach(([key, options]) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    results[key] = useData(options)
  })

  return results as { [K in keyof T]: UseDataReturn<unknown> }
}

// Export cache for debugging and monitoring
export { dbCache }