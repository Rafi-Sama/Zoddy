"use client"

import { useState, useCallback, useRef } from 'react'
import { ValidationRule, validateField, validateForm, FormErrors } from '@/lib/validation'

interface UseFormOptions<T> {
  initialValues: T
  validationRules?: Partial<Record<keyof T, ValidationRule>>
  onSubmit?: (data: T) => Promise<void> | void
  validateOnChange?: boolean
  validateOnBlur?: boolean
}

export function useForm<T extends Record<string, unknown>>({
  initialValues,
  validationRules = {},
  onSubmit,
  validateOnChange = false,
  validateOnBlur = true
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  const formRef = useRef<HTMLFormElement>(null)

  // Handle field change
  const handleChange = useCallback((
    field: keyof T,
    value: T[keyof T]
  ) => {
    setValues(prev => ({
      ...prev,
      [field]: value
    }))

    setIsDirty(true)

    // Validate on change if enabled
    if (validateOnChange && validationRules[field]) {
      const result = validateField(value, validationRules[field]!)
      setErrors(prev => {
        const newErrors = { ...prev }
        if (result === true) {
          delete newErrors[field as string]
        } else {
          newErrors[field as string] = { message: result }
        }
        return newErrors
      })
    }
  }, [validateOnChange, validationRules])

  // Handle field blur
  const handleBlur = useCallback((field: keyof T) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }))

    // Validate on blur if enabled
    if (validateOnBlur && validationRules[field]) {
      const result = validateField(values[field], validationRules[field]!)
      setErrors(prev => {
        const newErrors = { ...prev }
        if (result === true) {
          delete newErrors[field as string]
        } else {
          newErrors[field as string] = { message: result }
        }
        return newErrors
      })
    }
  }, [validateOnBlur, validationRules, values])

  // Validate single field
  const validateSingleField = useCallback((field: keyof T): boolean => {
    if (!validationRules[field]) return true

    const result = validateField(values[field], validationRules[field]!)
    if (result === true) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field as string]
        return newErrors
      })
      return true
    } else {
      setErrors(prev => ({
        ...prev,
        [field as string]: { message: result }
      }))
      return false
    }
  }, [values, validationRules])

  // Validate all fields
  const validate = useCallback((): boolean => {
    const validationErrors = validateForm(values, validationRules as Record<keyof T, ValidationRule>)
    if (validationErrors) {
      setErrors(validationErrors)
      // Mark all fields as touched
      const touchedFields = Object.keys(values).reduce((acc, key) => ({
        ...acc,
        [key]: true
      }), {} as Record<keyof T, boolean>)
      setTouched(touchedFields)
      return false
    }
    setErrors({})
    return true
  }, [values, validationRules])

  // Reset form
  const reset = useCallback((newValues?: T) => {
    setValues(newValues || initialValues)
    setErrors({})
    setTouched({} as Record<keyof T, boolean>)
    setIsDirty(false)
  }, [initialValues])

  // Set field value
  const setValue = useCallback((field: keyof T, value: T[keyof T]) => {
    handleChange(field, value)
  }, [handleChange])

  // Set multiple values
  const setFieldValues = useCallback((newValues: Partial<T>) => {
    setValues(prev => ({
      ...prev,
      ...newValues
    }))
    setIsDirty(true)
  }, [])

  // Set field error
  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({
      ...prev,
      [field as string]: { message: error }
    }))
  }, [])

  // Clear field error
  const clearFieldError = useCallback((field: keyof T) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field as string]
      return newErrors
    })
  }, [])

  // Handle form submission
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault()

    if (!validate()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit?.(values)
    } catch (error) {
      console.error('Form submission error:', error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }, [validate, onSubmit, values])

  // Get field props helper
  const getFieldProps = useCallback((field: keyof T) => ({
    value: values[field],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : e.target.value
      handleChange(field, value as T[keyof T])
    },
    onBlur: () => handleBlur(field),
    error: touched[field] && errors[field as string]?.message
  }), [values, handleChange, handleBlur, touched, errors])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isDirty,
    isValid: Object.keys(errors).length === 0,
    handleChange,
    handleBlur,
    handleSubmit,
    setValue,
    setFieldValues,
    setFieldError,
    clearFieldError,
    validateSingleField,
    validate,
    reset,
    getFieldProps,
    formRef
  }
}