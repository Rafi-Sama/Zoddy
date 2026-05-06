"use client"

import { ReactNode } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface BaseFieldProps {
  label?: string
  error?: string
  required?: boolean
  className?: string
  hint?: string
}

interface TextFieldProps extends BaseFieldProps {
  type?: "text" | "email" | "password" | "number" | "tel" | "url"
  value: string | number
  onChange: (value: string) => void
  onBlur?: () => void
  placeholder?: string
  disabled?: boolean
  autoComplete?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export function TextField({
  label,
  error,
  required,
  className,
  hint,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  disabled,
  autoComplete,
  leftIcon,
  rightIcon
}: TextFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </div>
        )}
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className={cn(
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            error && "border-destructive"
          )}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {rightIcon}
          </div>
        )}
      </div>
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  )
}

interface TextAreaFieldProps extends BaseFieldProps {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  placeholder?: string
  disabled?: boolean
  rows?: number
  maxLength?: number
  showCount?: boolean
}

export function TextAreaField({
  label,
  error,
  required,
  className,
  hint,
  value,
  onChange,
  onBlur,
  placeholder,
  disabled,
  rows = 3,
  maxLength,
  showCount
}: TextAreaFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={cn(error && "border-destructive")}
      />
      <div className="flex justify-between">
        <div>
          {hint && !error && (
            <p className="text-xs text-muted-foreground">{hint}</p>
          )}
          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}
        </div>
        {showCount && maxLength && (
          <p className="text-xs text-muted-foreground">
            {value.length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  )
}

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectFieldProps extends BaseFieldProps {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  placeholder?: string
  disabled?: boolean
  options: SelectOption[]
}

export function SelectField({
  label,
  error,
  required,
  className,
  hint,
  value,
  onChange,
  onBlur,
  placeholder,
  disabled,
  options
}: SelectFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          className={cn(error && "border-destructive")}
          onBlur={onBlur}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
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
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  )
}

interface CheckboxFieldProps extends BaseFieldProps {
  checked: boolean
  onChange: (checked: boolean) => void
  onBlur?: () => void
  disabled?: boolean
}

export function CheckboxField({
  label,
  error,
  className,
  hint,
  checked,
  onChange,
  onBlur,
  disabled
}: CheckboxFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          onBlur={onBlur}
          disabled={disabled}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        {label && (
          <Label className="text-sm font-medium cursor-pointer">
            {label}
          </Label>
        )}
      </div>
      {hint && !error && (
        <p className="text-xs text-muted-foreground ml-6">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-destructive ml-6">{error}</p>
      )}
    </div>
  )
}