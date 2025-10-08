"use client"

import { memo, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X, Filter } from "lucide-react"
import { cn } from "@/lib/utils"

export interface FilterOption {
  value: string
  label: string
  icon?: React.ReactNode
}

interface SearchFilterProps {
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  filters?: {
    key: string
    label: string
    options: FilterOption[]
    value?: string
    onChange?: (value: string) => void
  }[]
  onReset?: () => void
  className?: string
  showReset?: boolean
}

export const SearchFilter = memo(function SearchFilter({
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  onReset,
  className,
  showReset = true
}: SearchFilterProps) {
  // Using debounce internally - removed unused variable

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange?.(e.target.value)
  }, [onSearchChange])

  const handleClearSearch = useCallback(() => {
    onSearchChange?.("")
  }, [onSearchChange])

  const hasActiveFilters = filters.some(f => f.value && f.value !== "all") || searchValue

  return (
    <div className={cn("flex flex-col sm:flex-row gap-3", className)}>
      {onSearchChange && (
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={handleSearchChange}
            className="pl-10 pr-10"
          />
          {searchValue && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {filters.length > 0 && (
        <div className="flex gap-2">
          {filters.map(filter => (
            <Select
              key={filter.key}
              value={filter.value}
              onValueChange={filter.onChange}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                {filter.options.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      {option.icon}
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>
      )}

      {showReset && hasActiveFilters && onReset && (
        <Button variant="outline" size="sm" onClick={onReset}>
          <Filter className="h-4 w-4 mr-2" />
          Reset
        </Button>
      )}
    </div>
  )
})