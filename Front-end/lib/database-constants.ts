/**
 * Shared database constants and configurations
 * This file centralizes all database-related constants to prevent duplication
 */

// Multi-tenant tables that require organization_id scoping
// IMPORTANT: This list must be kept in sync with the database schema
export const MULTI_TENANT_TABLES = [
  'orders',
  'customers',
  'products',
  'team_members',
  'notifications',
  'team',
  'team_tasks',
  'subscriptions',
  'stock_movements',
  'categories',
  'reminders',
  'transactions',
  'delivery_bookings',
  'order_items'
] as const

export type MultiTenantTable = typeof MULTI_TENANT_TABLES[number]

// Cache configuration
export const CACHE_CONFIG = {
  DEFAULT_STALE_TIME: 5 * 60 * 1000, // 5 minutes
  DASHBOARD_STALE_TIME: 10 * 60 * 1000, // 10 minutes for dashboard
  LONG_STALE_TIME: 30 * 60 * 1000, // 30 minutes for static data
  MAX_CACHE_SIZE: 100, // Maximum number of cache entries
  REQUEST_DEDUP_WINDOW: 100, // ms to deduplicate identical requests
  ORG_CACHE_TTL: 30 * 60 * 1000, // 30 minutes for organization cache
} as const

// Pagination defaults
export const PAGINATION_DEFAULTS = {
  PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  DASHBOARD_LIMIT: 10,
  WIDGET_LIMIT: 5,
} as const

// Real-time subscription configuration
export const REALTIME_CONFIG = {
  RECONNECT_DELAY: 1000, // 1 second
  MAX_RECONNECT_ATTEMPTS: 5,
  HEARTBEAT_INTERVAL: 30000, // 30 seconds
} as const

// Query performance thresholds
export const PERFORMANCE_THRESHOLDS = {
  SLOW_QUERY_MS: 1000, // Log queries taking longer than 1 second
  VERY_SLOW_QUERY_MS: 5000, // Warn about queries taking longer than 5 seconds
  QUERY_TIMEOUT_MS: 10000, // Timeout queries after 10 seconds
} as const

// Database error codes
export const DB_ERROR_CODES = {
  NO_ROWS: 'PGRST116',
  UNIQUE_VIOLATION: '23505',
  FOREIGN_KEY_VIOLATION: '23503',
  CHECK_VIOLATION: '23514',
  NOT_NULL_VIOLATION: '23502',
} as const

// Helper function to check if a table requires organization scoping
export function requiresOrgScope(table: string): boolean {
  return MULTI_TENANT_TABLES.includes(table as typeof MULTI_TENANT_TABLES[number])
}

// Helper function to get appropriate cache time for different data types
export function getCacheTime(table: string, operation?: 'list' | 'single' | 'aggregate'): number {
  // Static/reference data gets longer cache
  if (['categories', 'tags', 'settings'].includes(table)) {
    return CACHE_CONFIG.LONG_STALE_TIME
  }

  // Dashboard data gets medium cache
  if (operation === 'aggregate') {
    return CACHE_CONFIG.DASHBOARD_STALE_TIME
  }

  // Default cache time
  return CACHE_CONFIG.DEFAULT_STALE_TIME
}

// Helper to determine if real-time is beneficial for a query
export function shouldUseRealtime(
  table: string,
  recordCount?: number,
  hasFilters?: boolean
): boolean {
  // Don't use real-time for large unfiltered datasets
  if (recordCount && recordCount > 1000 && !hasFilters) {
    return false
  }

  // Real-time is most useful for frequently changing data
  const realtimeTables = ['orders', 'notifications', 'team_members']
  return realtimeTables.includes(table)
}

// Export type for tables that can be queried
export type QueryableTable =
  | 'orders'
  | 'customers'
  | 'products'
  | 'team_members'
  | 'notifications'
  | 'profiles'
  | 'categories'
  | 'tags'
  | 'settings'
  | 'team'
  | 'team_tasks'
  | 'subscriptions'
  | 'stock_movements'
  | 'reminders'
  | 'transactions'
  | 'delivery_bookings'
  | 'order_items'
  | 'organizations'

// Batch query configuration
export const BATCH_CONFIG = {
  MAX_BATCH_SIZE: 10, // Maximum queries to batch together
  BATCH_WINDOW_MS: 50, // Time window to collect queries for batching
} as const

// Field selections for optimized queries - only fetch necessary fields
export const FIELD_SELECTIONS = {
  orders: {
    list: 'id,order_number,customer_name,customer_phone,total_amount,status,payment_status,created_at,channel,payment_method,updated_at',
    detail: '*',
    dashboard: 'id,total_amount,status,payment_status,created_at,channel'
  },
  customers: {
    list: 'id,name,phone,email,city,status,total_orders,total_spent,created_at',
    detail: '*',
    dashboard: 'id,name,total_orders,total_spent,status,created_at'
  },
  products: {
    list: 'id,name,sku,category,current_stock,selling_price,status,reorder_level,image_url,cost_price',
    detail: '*',
    dashboard: 'id,name,current_stock,status,selling_price'
  },
  team_members: {
    list: 'id,user_id,role,status,permissions,joined_at,last_active',
    withUser: '*, profiles!inner(id,email,first_name,last_name,profile_picture_url)'
  },
  notifications: {
    list: 'id,title,type,priority,read,created_at',
    detail: '*'
  }
} as const

// Helper function to get field selection for a table and context
export function getFieldSelection(
  table: string,
  context: 'list' | 'detail' | 'dashboard' = 'list'
): string {
  const selections = FIELD_SELECTIONS[table as keyof typeof FIELD_SELECTIONS]
  if (!selections) return '*' // Default to all fields if not configured

  const selection = selections[context as keyof typeof selections]
  return selection || selections.list || '*'
}