// Application-wide constants

export const APP_NAME = 'Zoddy'
export const APP_DESCRIPTION = 'Business Growth Tracker for Small Businesses'

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || '',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  CACHE_DURATION: 5 * 60 * 1000 // 5 minutes
}

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
}

// Date Formats
export const DATE_FORMAT = {
  DISPLAY: 'MMM DD, YYYY',
  INPUT: 'YYYY-MM-DD',
  DATETIME: 'MMM DD, YYYY HH:mm',
  API: 'YYYY-MM-DDTHH:mm:ss.SSSZ'
}

// Currency
export const CURRENCY = {
  CODE: 'BDT',
  SYMBOL: '৳',
  LOCALE: 'bn-BD'
}

// Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  ORDERS: '/orders',
  CUSTOMERS: '/customers',
  INVENTORY: '/inventory',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
  ACCOUNT: '/account',
  LOGIN: '/login',
  SIGNOUT: '/signout',
  ONBOARDING: '/onboarding',
  PRICING: '/pricing',
  BENEFITS: '/benefits',
  CONTACT: '/contact'
}

// Storage Keys
export const STORAGE_KEYS = {
  THEME: 'theme',
  SIDEBAR_STATE: 'sidebar-state',
  DASHBOARD_WIDGETS: 'dashboardWidgets',
  USER_PREFERENCES: 'user-preferences',
  RECENT_SEARCHES: 'recent-searches'
}

// Status Types
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
} as const

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  PARTIAL: 'partial',
  FAILED: 'failed',
  REFUNDED: 'refunded'
} as const

// Breakpoints for responsive design
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
}

// Animation Durations
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
}

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ACCEPTED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ACCEPTED_SPREADSHEET_TYPES: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv']
}

// Toast Messages
export const TOAST_MESSAGES = {
  SUCCESS: {
    CREATE: 'Created successfully',
    UPDATE: 'Updated successfully',
    DELETE: 'Deleted successfully',
    SAVE: 'Saved successfully'
  },
  ERROR: {
    GENERIC: 'Something went wrong. Please try again.',
    NETWORK: 'Network error. Please check your connection.',
    VALIDATION: 'Please check the form for errors.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    NOT_FOUND: 'The requested resource was not found.'
  }
}

// Regex Patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  PHONE_BD: /^(?:\+88|88)?(01[3-9]\d{8})$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  NUMERIC: /^\d+$/,
  DECIMAL: /^\d+(\.\d{1,2})?$/
}

// Default Values
export const DEFAULTS = {
  AVATAR_URL: '/images/default-avatar.png',
  PRODUCT_IMAGE: '/images/default-product.png',
  COMPANY_LOGO: '/images/logo.png'
}