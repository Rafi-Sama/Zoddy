// Form validation utilities

export interface ValidationRule {
  required?: boolean | string
  minLength?: { value: number; message?: string }
  maxLength?: { value: number; message?: string }
  pattern?: { value: RegExp; message?: string }
  min?: { value: number; message?: string }
  max?: { value: number; message?: string }
  email?: boolean | string
  phone?: boolean | string
  custom?: (value: unknown) => string | true
}

export interface FieldError {
  message: string
}

export interface FormErrors {
  [key: string]: FieldError
}

// Common validation patterns
export const PATTERNS = {
  email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  phone: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
  bangladeshPhone: /^(?:\+88|88)?(01[3-9]\d{8})$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  numeric: /^\d+$/,
  decimal: /^\d+(\.\d{1,2})?$/
}

export function validateField(value: unknown, rules: ValidationRule): string | true {
  if (!rules) return true

  // Required validation
  if (rules.required) {
    if (value === undefined || value === null || value === '') {
      return typeof rules.required === 'string' ? rules.required : 'This field is required'
    }
  }

  // Skip other validations if field is empty and not required
  if (value === undefined || value === null || value === '') {
    return true
  }

  // Email validation
  if (rules.email) {
    if (!PATTERNS.email.test(String(value))) {
      return typeof rules.email === 'string' ? rules.email : 'Please enter a valid email address'
    }
  }

  // Phone validation
  if (rules.phone) {
    const pattern = typeof rules.phone === 'string' && rules.phone === 'bd'
      ? PATTERNS.bangladeshPhone
      : PATTERNS.phone

    if (!pattern.test(String(value))) {
      return typeof rules.phone === 'string' && rules.phone !== 'bd'
        ? rules.phone
        : 'Please enter a valid phone number'
    }
  }

  // Pattern validation
  if (rules.pattern) {
    if (!rules.pattern.value.test(String(value))) {
      return rules.pattern.message || 'Invalid format'
    }
  }

  // String length validations
  if (typeof value === 'string') {
    if (rules.minLength && value.length < rules.minLength.value) {
      return rules.minLength.message || `Minimum ${rules.minLength.value} characters required`
    }

    if (rules.maxLength && value.length > rules.maxLength.value) {
      return rules.maxLength.message || `Maximum ${rules.maxLength.value} characters allowed`
    }
  }

  // Number validations
  if (typeof value === 'number' || !isNaN(Number(value))) {
    const numValue = Number(value)

    if (rules.min && numValue < rules.min.value) {
      return rules.min.message || `Minimum value is ${rules.min.value}`
    }

    if (rules.max && numValue > rules.max.value) {
      return rules.max.message || `Maximum value is ${rules.max.value}`
    }
  }

  // Custom validation
  if (rules.custom) {
    const result = rules.custom(value)
    if (result !== true) {
      return result
    }
  }

  return true
}

export function validateForm<T extends Record<string, unknown>>(
  data: T,
  validationRules: Record<keyof T, ValidationRule>
): FormErrors | null {
  const errors: FormErrors = {}
  let hasErrors = false

  for (const field in validationRules) {
    const result = validateField(data[field], validationRules[field])
    if (result !== true) {
      errors[field] = { message: result }
      hasErrors = true
    }
  }

  return hasErrors ? errors : null
}

// Validation rule builders for common scenarios
export const validators = {
  required: (message?: string): ValidationRule => ({
    required: message || true
  }),

  email: (message?: string): ValidationRule => ({
    required: true,
    email: message || true
  }),

  phone: (required = true, country?: 'bd'): ValidationRule => ({
    required,
    phone: country || true
  }),

  number: (min?: number, max?: number): ValidationRule => ({
    pattern: { value: PATTERNS.numeric, message: 'Must be a number' },
    ...(min !== undefined && { min: { value: min } }),
    ...(max !== undefined && { max: { value: max } })
  }),

  price: (required = true): ValidationRule => ({
    required,
    pattern: { value: PATTERNS.decimal, message: 'Invalid price format' },
    min: { value: 0, message: 'Price cannot be negative' }
  }),

  text: (minLength?: number, maxLength?: number, required = true): ValidationRule => ({
    required,
    ...(minLength && { minLength: { value: minLength } }),
    ...(maxLength && { maxLength: { value: maxLength } })
  }),

  password: (minLength = 8): ValidationRule => ({
    required: true,
    minLength: { value: minLength, message: `Password must be at least ${minLength} characters` },
    custom: (value: unknown) => {
      if (typeof value !== 'string') return 'Password must be a string'
      if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter'
      if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter'
      if (!/[0-9]/.test(value)) return 'Password must contain at least one number'
      return true
    }
  }),

  confirmPassword: (passwordField: string): ValidationRule => ({
    required: true,
    custom: (value: unknown, formData?: unknown) => {
      if (typeof value !== 'string') return 'Confirmation password must be a string'
      if (formData && typeof formData === 'object' && passwordField in formData && value !== (formData as Record<string, unknown>)[passwordField]) {
        return 'Passwords do not match'
      }
      return true
    }
  }),

  url: (required = false): ValidationRule => ({
    required,
    pattern: { value: PATTERNS.url, message: 'Invalid URL format' }
  })
}