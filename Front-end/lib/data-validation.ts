/**
 * Data Validation and Sanitization Utilities
 * Ensures data integrity and security for all database operations
 */

import { z } from 'zod'

// =====================================================
// COMMON VALIDATION SCHEMAS
// =====================================================

// Phone number validation for Bangladesh
const bangladeshPhoneRegex = /^(\+?880|0)1[3-9]\d{8}$/

export const phoneSchema = z.string()
  .transform(val => val.replace(/\s+/g, '').replace(/-/g, ''))
  .refine(val => !val || bangladeshPhoneRegex.test(val), {
    message: "Invalid Bangladesh phone number"
  })

// Email validation
export const emailSchema = z.string()
  .email("Invalid email address")
  .toLowerCase()
  .trim()

// URL validation
export const urlSchema = z.string()
  .url("Invalid URL")
  .or(z.string().length(0))

// Currency amount validation (positive numbers only)
export const currencySchema = z.number()
  .positive("Amount must be positive")
  .multipleOf(0.01, "Maximum 2 decimal places")

// Quantity validation
export const quantitySchema = z.number()
  .int("Quantity must be a whole number")
  .nonnegative("Quantity cannot be negative")

// =====================================================
// CUSTOMER VALIDATION
// =====================================================

export const customerValidationSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .trim()
    .transform(val => val.replace(/\s+/g, ' ')), // Remove extra spaces

  email: emailSchema.optional().or(z.literal('')),

  phone: phoneSchema.optional().or(z.literal('')),

  address: z.string()
    .max(500, "Address cannot exceed 500 characters")
    .trim()
    .optional(),

  city: z.string()
    .max(100, "City cannot exceed 100 characters")
    .trim()
    .optional(),

  postal_code: z.string()
    .regex(/^\d{4}$/, "Postal code must be 4 digits")
    .optional()
    .or(z.literal('')),

  notes: z.string()
    .max(1000, "Notes cannot exceed 1000 characters")
    .trim()
    .optional(),

  tags: z.array(z.string().trim()).optional(),

  metadata: z.record(z.string(), z.any()).optional()
})

// =====================================================
// PRODUCT VALIDATION
// =====================================================

export const productValidationSchema = z.object({
  name: z.string()
    .min(2, "Product name must be at least 2 characters")
    .max(200, "Product name cannot exceed 200 characters")
    .trim(),

  sku: z.string()
    .regex(/^[A-Z0-9-]+$/, "SKU must contain only uppercase letters, numbers, and hyphens")
    .max(50, "SKU cannot exceed 50 characters")
    .optional()
    .or(z.literal('')),

  barcode: z.string()
    .regex(/^[0-9]+$/, "Barcode must contain only numbers")
    .optional()
    .or(z.literal('')),

  description: z.string()
    .max(2000, "Description cannot exceed 2000 characters")
    .trim()
    .optional(),

  category: z.string()
    .max(100, "Category cannot exceed 100 characters")
    .trim()
    .optional(),

  subcategory: z.string()
    .max(100, "Subcategory cannot exceed 100 characters")
    .trim()
    .optional(),

  brand: z.string()
    .max(100, "Brand cannot exceed 100 characters")
    .trim()
    .optional(),

  price: currencySchema,

  cost: currencySchema.optional(),

  compare_at_price: currencySchema.optional(),

  quantity: quantitySchema,

  low_stock_threshold: quantitySchema.optional(),

  weight: z.number()
    .nonnegative("Weight cannot be negative")
    .optional(),

  track_inventory: z.boolean().default(true),

  sell_without_stock: z.boolean().default(false),

  status: z.enum(['active', 'draft', 'archived']).default('active'),

  images: z.array(urlSchema).optional(),

  variants: z.array(z.object({
    name: z.string().trim(),
    sku: z.string().optional(),
    price: currencySchema,
    quantity: quantitySchema,
    attributes: z.record(z.string(), z.any()).optional()
  })).optional(),

  metadata: z.record(z.string(), z.any()).optional()
})

// =====================================================
// ORDER VALIDATION
// =====================================================

export const orderItemSchema = z.object({
  product_id: z.string().uuid().optional(),
  product_name: z.string()
    .min(1, "Product name is required")
    .trim(),
  product_sku: z.string().optional(),
  quantity: z.number()
    .int()
    .positive("Quantity must be positive"),
  price: currencySchema,
  discount: currencySchema.optional(),
  total: currencySchema,
  variant: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional()
})

export const orderValidationSchema = z.object({
  customer_id: z.string().uuid().optional(),

  customer_name: z.string()
    .min(2, "Customer name is required")
    .max(100)
    .trim()
    .optional(),

  customer_email: emailSchema.optional(),

  customer_phone: phoneSchema.optional(),

  shipping_address: z.string()
    .max(500)
    .trim()
    .optional(),

  billing_address: z.string()
    .max(500)
    .trim()
    .optional(),

  items: z.array(orderItemSchema)
    .min(1, "Order must have at least one item"),

  subtotal: currencySchema,

  tax_amount: currencySchema.optional(),

  shipping_amount: currencySchema.optional(),

  discount_amount: currencySchema.optional(),

  total_amount: currencySchema,

  status: z.enum([
    'pending', 'confirmed', 'processing',
    'shipped', 'delivered', 'cancelled', 'returned'
  ]).default('pending'),

  payment_status: z.enum([
    'pending', 'paid', 'partial', 'refunded', 'failed'
  ]).default('pending'),

  payment_method: z.enum([
    'cash', 'bkash', 'nagad', 'rocket',
    'bank', 'card', 'upay', 'cellfin'
  ]).optional(),

  delivery_provider: z.enum([
    'ecourier', 'redx', 'pathao',
    'steadfast', 'paperfly', 'sundarban'
  ]).optional(),

  tracking_number: z.string()
    .max(100)
    .trim()
    .optional(),

  source: z.enum([
    'whatsapp', 'facebook', 'instagram',
    'website', 'phone', 'walk-in', 'other'
  ]).optional(),

  notes: z.string()
    .max(1000)
    .trim()
    .optional(),

  tags: z.array(z.string().trim()).optional(),

  metadata: z.record(z.string(), z.any()).optional()
})

// =====================================================
// TEAM MEMBER VALIDATION
// =====================================================

export const teamMemberValidationSchema = z.object({
  user_id: z.string().uuid(),

  role: z.enum([
    'owner', 'admin', 'sales',
    'inventory', 'support', 'viewer'
  ]),

  permissions: z.array(z.string()).optional(),

  department: z.string()
    .max(100)
    .trim()
    .optional(),

  status: z.enum(['active', 'inactive', 'invited'])
    .default('invited')
})

// =====================================================
// SETTINGS VALIDATION
// =====================================================

export const businessSettingsSchema = z.object({
  business_name: z.string()
    .min(2, "Business name must be at least 2 characters")
    .max(200)
    .trim()
    .optional(),

  business_email: emailSchema.optional(),

  business_phone: phoneSchema.optional(),

  business_address: z.string()
    .max(500)
    .trim()
    .optional(),

  business_logo: urlSchema.optional(),

  currency: z.string()
    .length(3, "Currency must be 3-letter code")
    .default('BDT'),

  timezone: z.string().default('Asia/Dhaka'),

  tax_rate: z.number()
    .min(0, "Tax rate cannot be negative")
    .max(100, "Tax rate cannot exceed 100%")
    .optional(),

  invoice_prefix: z.string()
    .max(10)
    .trim()
    .optional(),

  invoice_next_number: z.number()
    .int()
    .positive()
    .optional(),

  payment_methods: z.object({
    cash: z.boolean().optional(),
    bkash: z.boolean().optional(),
    nagad: z.boolean().optional(),
    rocket: z.boolean().optional(),
    bank: z.boolean().optional(),
    card: z.boolean().optional(),
    upay: z.boolean().optional(),
    cellfin: z.boolean().optional()
  }).optional(),

  delivery_zones: z.array(z.object({
    name: z.string().trim(),
    areas: z.array(z.string().trim()).optional(),
    fee: currencySchema,
    minimum_order: currencySchema.optional(),
    estimated_days: z.number().int().positive().optional()
  })).optional(),

  notification_settings: z.object({
    email_notifications: z.boolean().optional(),
    sms_notifications: z.boolean().optional(),
    push_notifications: z.boolean().optional(),
    order_notifications: z.boolean().optional(),
    inventory_alerts: z.boolean().optional(),
    customer_notifications: z.boolean().optional()
  }).optional()
})

// =====================================================
// SANITIZATION FUNCTIONS
// =====================================================

/**
 * Sanitize string input to prevent XSS and SQL injection
 */
export function sanitizeString(input: string): string {
  if (!input) return ''

  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim()
}

/**
 * Sanitize HTML content (for rich text fields)
 */
export function sanitizeHtml(html: string): string {
  if (!html) return ''

  // Remove script tags and their content
  let cleaned = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

  // Remove on* event handlers
  cleaned = cleaned.replace(/on\w+="[^"]*"/gi, '')
  cleaned = cleaned.replace(/on\w+='[^']*'/gi, '')

  // Remove javascript: protocol
  cleaned = cleaned.replace(/javascript:/gi, '')

  return cleaned
}

/**
 * Sanitize and validate file uploads
 */
export function validateFileUpload(file: File, options?: {
  maxSize?: number // in bytes
  allowedTypes?: string[]
}): { valid: boolean; error?: string } {
  const maxSize = options?.maxSize || 5 * 1024 * 1024 // 5MB default
  const allowedTypes = options?.allowedTypes || [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]

  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${maxSize / (1024 * 1024)}MB limit`
    }
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed`
    }
  }

  // Check for suspicious file extensions
  const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.sh', '.ps1', '.dll']
  const fileName = file.name.toLowerCase()

  for (const ext of suspiciousExtensions) {
    if (fileName.endsWith(ext)) {
      return {
        valid: false,
        error: 'Potentially harmful file type detected'
      }
    }
  }

  return { valid: true }
}

/**
 * Validate and sanitize search queries
 */
export function sanitizeSearchQuery(query: string): string {
  if (!query) return ''

  return query
    .replace(/[%_]/g, '\\$&') // Escape SQL wildcards
    .replace(/[<>\"']/g, '') // Remove potentially dangerous characters
    .trim()
    .slice(0, 100) // Limit length to prevent abuse
}

/**
 * Validate pagination parameters
 */
export function validatePagination(params: {
  page?: number
  limit?: number
}): { page: number; limit: number; offset: number } {
  const page = Math.max(1, Math.floor(params.page || 1))
  const limit = Math.min(100, Math.max(1, Math.floor(params.limit || 20)))
  const offset = (page - 1) * limit

  return { page, limit, offset }
}

/**
 * Rate limiting helper
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map()

  constructor(
    private maxAttempts: number = 10,
    private windowMs: number = 60000 // 1 minute
  ) {}

  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const attempts = this.attempts.get(identifier) || []

    // Remove old attempts outside the window
    const validAttempts = attempts.filter(
      time => now - time < this.windowMs
    )

    if (validAttempts.length >= this.maxAttempts) {
      return false
    }

    // Add new attempt
    validAttempts.push(now)
    this.attempts.set(identifier, validAttempts)

    return true
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier)
  }
}

// =====================================================
// EXPORT VALIDATORS
// =====================================================

export const validators = {
  customer: customerValidationSchema,
  product: productValidationSchema,
  order: orderValidationSchema,
  orderItem: orderItemSchema,
  teamMember: teamMemberValidationSchema,
  businessSettings: businessSettingsSchema
}

// Type exports for use in components
export type CustomerInput = z.infer<typeof customerValidationSchema>
export type ProductInput = z.infer<typeof productValidationSchema>
export type OrderInput = z.infer<typeof orderValidationSchema>
export type OrderItemInput = z.infer<typeof orderItemSchema>
export type TeamMemberInput = z.infer<typeof teamMemberValidationSchema>
export type BusinessSettingsInput = z.infer<typeof businessSettingsSchema>