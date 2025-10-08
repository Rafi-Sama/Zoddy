import { CURRENCY } from './constants'

// Format currency
export function formatCurrency(amount: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(CURRENCY.LOCALE, {
    style: 'currency',
    currency: CURRENCY.CODE,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options
  }).format(amount).replace(CURRENCY.CODE, CURRENCY.SYMBOL)
}

// Format date
export function formatDate(date: string | Date, format?: string): string {
  const d = typeof date === 'string' ? new Date(date) : date

  if (isNaN(d.getTime())) {
    return 'Invalid Date'
  }

  // Simple formatting without external library
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }

  if (format === 'datetime') {
    options.hour = '2-digit'
    options.minute = '2-digit'
  }

  return d.toLocaleDateString('en-US', options)
}

// Format phone number
export function formatPhone(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '')

  // Format for Bangladesh numbers
  if (cleaned.startsWith('880')) {
    const number = cleaned.substring(3)
    return `+880 ${number.substring(0, 4)}-${number.substring(4)}`
  }

  if (cleaned.startsWith('01')) {
    return `+880 ${cleaned.substring(0, 4)}-${cleaned.substring(4)}`
  }

  return phone
}

// Truncate text
export function truncate(text: string, length: number, suffix = '...'): string {
  if (text.length <= length) return text
  return text.substring(0, length - suffix.length) + suffix
}

// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

// Generate random ID
export function generateId(prefix?: string): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 9)
  return prefix ? `${prefix}_${timestamp}${random}` : `${timestamp}${random}`
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Throttle function
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return function(this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Deep clone object
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as T
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T
  if (obj instanceof Object) {
    const clonedObj = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
  return obj
}

// Group array by key
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const group = String(item[key])
    if (!result[group]) result[group] = []
    result[group].push(item)
    return result
  }, {} as Record<string, T[]>)
}

// Sort array of objects
export function sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]

    if (aVal < bVal) return order === 'asc' ? -1 : 1
    if (aVal > bVal) return order === 'asc' ? 1 : -1
    return 0
  })
}

// Calculate percentage
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

// Check if object is empty
export function isEmpty(obj: unknown): boolean {
  if (!obj) return true
  if (Array.isArray(obj)) return obj.length === 0
  if (typeof obj === 'object') return Object.keys(obj).length === 0
  return false
}

// Sleep function for async operations
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Retry async operation
export async function retry<T>(
  fn: () => Promise<T>,
  attempts = 3,
  delay = 1000
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (attempts <= 1) throw error
    await sleep(delay)
    return retry(fn, attempts - 1, delay * 2)
  }
}

// Parse query string
export function parseQueryString(queryString: string): Record<string, string> {
  const params = new URLSearchParams(queryString)
  const result: Record<string, string> = {}

  params.forEach((value, key) => {
    result[key] = value
  })

  return result
}

// Build query string
export function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value))
    }
  })

  return searchParams.toString()
}

// Calculate reading time
export function calculateReadingTime(text: string, wordsPerMinute = 200): number {
  const words = text.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate Bangladesh phone number
export function isValidBDPhone(phone: string): boolean {
  const phoneRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/
  return phoneRegex.test(phone)
}