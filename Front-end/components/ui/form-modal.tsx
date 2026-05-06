"use client"

import React, { useState, ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'switch'
  | 'date'
  | 'dateRange'
  | 'custom'

export interface FieldOption {
  value: string
  label: string
  disabled?: boolean
}

export interface FormField {
  name: string
  label: string
  type: FieldType
  placeholder?: string
  description?: string
  required?: boolean
  disabled?: boolean
  defaultValue?: string | number | boolean | DateRange
  options?: FieldOption[]
  validation?: (value: string | number | boolean | DateRange | undefined) => string | undefined
  customComponent?: ReactNode
  gridSpan?: 1 | 2 | 'full'
  section?: string
}

export interface FormSection {
  id: string
  title: string
  description?: string
  fields: FormField[]
}

interface FormModalProps {
  trigger?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title: string
  description?: string
  fields?: FormField[]
  sections?: FormSection[]
  onSubmit: (data: Record<string, string | number | boolean | DateRange | undefined>) => void | Promise<void>
  submitLabel?: string
  cancelLabel?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  error?: string
  validationMode?: 'onSubmit' | 'onChange' | 'onBlur'
  defaultValues?: Record<string, string | number | boolean | DateRange | undefined>
  className?: string
  showRequiredIndicator?: boolean
  columns?: 1 | 2
}

export function FormModal({
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  title,
  description,
  fields = [],
  sections = [],
  onSubmit,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  size = 'md',
  loading = false,
  error: externalError,
  validationMode = 'onSubmit',
  defaultValues = {},
  className,
  showRequiredIndicator = true,
  columns = 1
}: FormModalProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [formData, setFormData] = useState<Record<string, string | number | boolean | DateRange | undefined>>(defaultValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [internalError, setInternalError] = useState<string | null>(null)

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = controlledOnOpenChange || setInternalOpen
  const error = externalError || internalError

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }

  // Combine fields from direct fields prop and sections
  const allFields = [
    ...fields,
    ...(sections.flatMap(section => section.fields))
  ]

  const handleFieldChange = (name: string, value: string | number | boolean | DateRange | undefined) => {
    setFormData(prev => ({ ...prev, [name]: value }))

    if (validationMode === 'onChange') {
      validateField(name, value)
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleFieldBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }))

    if (validationMode === 'onBlur') {
      validateField(name, formData[name])
    }
  }

  const validateField = (name: string, value: string | number | boolean | DateRange | undefined) => {
    const field = allFields.find(f => f.name === name)
    if (!field) return

    let error = ''

    // Required validation
    if (field.required && !value) {
      error = `${field.label} is required`
    }

    // Custom validation
    if (!error && field.validation) {
      error = field.validation(value) || ''
    }

    setErrors(prev => ({ ...prev, [name]: error }))
    return error
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    allFields.forEach(field => {
      const error = validateField(field.name, formData[field.name])
      if (error) {
        newErrors[field.name] = error
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    setInternalError(null)

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      setOpen(false)
      // Reset form on successful submission
      setFormData(defaultValues)
      setErrors({})
      setTouched({})
    } catch (error) {
      setInternalError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderField = (field: FormField) => {
    const value = formData[field.name] ?? field.defaultValue ?? ''
    const fieldError = touched[field.name] ? errors[field.name] : ''
    const isDisabled = field.disabled || isSubmitting || loading

    const fieldContent = () => {
      switch (field.type) {
        case 'text':
        case 'email':
        case 'password':
        case 'number':
        case 'tel':
        case 'url':
          return (
            <Input
              type={field.type}
              value={value as string | number}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              onBlur={() => handleFieldBlur(field.name)}
              placeholder={field.placeholder}
              disabled={isDisabled}
              className={fieldError ? 'border-destructive' : ''}
            />
          )

        case 'textarea':
          return (
            <Textarea
              value={value as string}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              onBlur={() => handleFieldBlur(field.name)}
              placeholder={field.placeholder}
              disabled={isDisabled}
              className={cn(
                fieldError ? 'border-destructive' : '',
                'min-h-[80px]'
              )}
            />
          )

        case 'select':
          return (
            <Select
              value={value as string}
              onValueChange={(v) => handleFieldChange(field.name, v)}
              disabled={isDisabled}
            >
              <SelectTrigger className={fieldError ? 'border-destructive' : ''}>
                <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map(option => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )

        case 'radio':
          return (
            <RadioGroup
              value={value as string}
              onValueChange={(v) => handleFieldChange(field.name, v)}
              disabled={isDisabled}
              className="flex flex-col space-y-2"
            >
              {field.options?.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.value}
                    disabled={option.disabled}
                  />
                  <Label className="font-normal">{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          )

        case 'checkbox':
          return (
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={value as boolean}
                onCheckedChange={(checked) => handleFieldChange(field.name, checked)}
                disabled={isDisabled}
              />
              <Label className="font-normal">
                {field.placeholder || field.label}
              </Label>
            </div>
          )

        case 'switch':
          return (
            <div className="flex items-center justify-between">
              <Label className="font-normal">
                {field.placeholder || field.label}
              </Label>
              <Switch
                checked={value as boolean}
                onCheckedChange={(checked) => handleFieldChange(field.name, checked)}
                disabled={isDisabled}
              />
            </div>
          )

        case 'dateRange':
          return (
            <DateRangePicker
              date={(value as unknown) as DateRange | undefined}
              onDateChange={(range) => handleFieldChange(field.name, range)}
              className={fieldError ? 'border-destructive' : ''}
            />
          )

        case 'custom':
          return field.customComponent

        default:
          return null
      }
    }

    const gridSpanClass = field.gridSpan === 'full' ? 'col-span-full' :
                          field.gridSpan === 2 && columns === 2 ? 'col-span-2' :
                          'col-span-1'

    return (
      <div key={field.name} className={cn("space-y-2", gridSpanClass)}>
        {field.type !== 'checkbox' && field.type !== 'switch' && (
          <Label htmlFor={field.name}>
            {field.label}
            {field.required && showRequiredIndicator && (
              <span className="text-destructive ml-1">*</span>
            )}
          </Label>
        )}

        {fieldContent()}

        {field.description && !fieldError && (
          <p className="text-xs text-muted-foreground">{field.description}</p>
        )}

        {fieldError && (
          <p className="text-xs text-destructive">{fieldError}</p>
        )}
      </div>
    )
  }

  const renderContent = () => {
    if (sections.length > 0) {
      return (
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div key={section.id}>
              {index > 0 && <Separator className="mb-6" />}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">{section.title}</h3>
                  {section.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {section.description}
                    </p>
                  )}
                </div>
                <div className={cn(
                  "grid gap-4",
                  columns === 2 && "md:grid-cols-2"
                )}>
                  {section.fields.map(renderField)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className={cn(
        "grid gap-4",
        columns === 2 && "md:grid-cols-2"
      )}>
        {fields.map(renderField)}
      </div>
    )
  }

  const dialogContent = (
    <>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {description && (
          <DialogDescription>{description}</DialogDescription>
        )}
      </DialogHeader>

      <ScrollArea className="max-h-[60vh] pr-4">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {renderContent()}
      </ScrollArea>

      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => setOpen(false)}
          disabled={isSubmitting || loading}
        >
          {cancelLabel}
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || loading}
        >
          {(isSubmitting || loading) && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {submitLabel}
        </Button>
      </DialogFooter>
    </>
  )

  if (trigger) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        <DialogContent className={cn(sizeClasses[size], className)}>
          {dialogContent}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className={cn(sizeClasses[size], className)}>
        {dialogContent}
      </DialogContent>
    </Dialog>
  )
}