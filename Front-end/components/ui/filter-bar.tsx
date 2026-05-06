"use client"

import React, { useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { Search, List, Grid3X3, X, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DateRange } from 'react-day-picker'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from '@/components/ui/separator'

export interface FilterOption {
  value: string
  label: string
  icon?: React.ElementType
}

export interface FilterConfig {
  type: 'select' | 'dateRange' | 'multiselect' | 'search'
  key: string
  label: string
  placeholder?: string
  options?: FilterOption[]
  defaultValue?: string | string[]
  icon?: React.ElementType
}

export type ViewMode = 'list' | 'grid' | 'kanban'

interface FilterBarProps {
  searchPlaceholder?: string
  filters?: FilterConfig[]
  onFilterChange?: (filters: Record<string, string | DateRange | undefined>) => void
  onSearchChange?: (search: string) => void
  showViewToggle?: boolean
  viewMode?: ViewMode
  onViewModeChange?: (mode: ViewMode) => void
  className?: string
  showAdvancedFilters?: boolean
  advancedFilters?: FilterConfig[]
  sticky?: boolean
  compact?: boolean
  showFilterCount?: boolean
}

export function FilterBar({
  searchPlaceholder = "Search...",
  filters = [],
  onFilterChange,
  onSearchChange,
  showViewToggle = false,
  viewMode = 'list',
  onViewModeChange,
  className,
  showAdvancedFilters = false,
  advancedFilters = [],
  sticky = false,
  compact = false,
  showFilterCount = true
}: FilterBarProps) {
  const [searchValue, setSearchValue] = useState('')
  const [filterValues, setFilterValues] = useState<Record<string, string | DateRange | undefined>>({})
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  const activeFilterCount = Object.keys(filterValues).filter(
    key => filterValues[key] && filterValues[key] !== 'all'
  ).length + (dateRange ? 1 : 0)

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value)
    onSearchChange?.(value)
  }, [onSearchChange])

  const handleFilterChange = useCallback((key: string, value: string | DateRange | undefined) => {
    const newFilters = { ...filterValues, [key]: value }
    setFilterValues(newFilters)
    onFilterChange?.(newFilters)
  }, [filterValues, onFilterChange])

  const handleDateRangeChange = useCallback((range: DateRange | undefined) => {
    setDateRange(range)
    const newFilters = { ...filterValues, dateRange: range }
    setFilterValues(newFilters)
    onFilterChange?.(newFilters)
  }, [filterValues, onFilterChange])

  const clearFilters = useCallback(() => {
    setFilterValues({})
    setDateRange(undefined)
    setSearchValue('')
    onFilterChange?.({})
    onSearchChange?.('')
  }, [onFilterChange, onSearchChange])

  const renderFilter = (filter: FilterConfig) => {
    const FilterIcon = filter.icon

    switch (filter.type) {
      case 'select':
        return (
          <Select
            key={filter.key}
            value={(filterValues[filter.key] as string) || (filter.defaultValue as string) || 'all'}
            onValueChange={(value) => handleFilterChange(filter.key, value)}
          >
            <SelectTrigger className={cn(
              compact ? "h-8 text-xs" : "h-9 text-sm",
              "min-w-[120px]"
            )}>
              {FilterIcon && <FilterIcon className="h-3.5 w-3.5 mr-2" />}
              <SelectValue placeholder={filter.placeholder || filter.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All {filter.label}</SelectItem>
              {filter.options?.map((option) => {
                const OptionIcon = option.icon
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center">
                      {OptionIcon && <OptionIcon className="h-3.5 w-3.5 mr-2" />}
                      {option.label}
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        )
      case 'dateRange':
        return (
          <DateRangePicker
            key={filter.key}
            date={dateRange}
            onDateChange={handleDateRangeChange}
            className={compact ? "h-8" : "h-9"}
          />
        )
      default:
        return null
    }
  }

  return (
    <Card className={cn(
      sticky && "sticky top-0 z-10",
      className
    )}>
      <CardContent className={compact ? "py-2 px-3" : "py-3 px-4"}>
        <div className="flex flex-col gap-2">
          {/* Main filter row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className={cn(
                "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground",
                compact ? "h-3.5 w-3.5" : "h-4 w-4"
              )} />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                className={cn(
                  "pl-9",
                  compact ? "h-8 text-xs" : "h-9 text-sm"
                )}
              />
            </div>

            {/* Primary filters */}
            {filters.map(renderFilter)}

            {/* Advanced filters toggle */}
            {showAdvancedFilters && advancedFilters.length > 0 && (
              <Popover open={showAdvanced} onOpenChange={setShowAdvanced}>
                <PopoverTrigger asChild>
                  <Button
                    variant={showAdvanced ? "secondary" : "outline"}
                    size={compact ? "sm" : "default"}
                    className={compact ? "h-8 px-2" : "h-9 px-3"}
                  >
                    <SlidersHorizontal className={cn(
                      "mr-2",
                      compact ? "h-3.5 w-3.5" : "h-4 w-4"
                    )} />
                    Advanced
                    {showAdvanced && (
                      <Badge variant="secondary" className="ml-2">
                        {advancedFilters.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <div className="font-medium text-sm">Advanced Filters</div>
                    <Separator />
                    <div className="space-y-3">
                      {advancedFilters.map((filter) => (
                        <div key={filter.key} className="space-y-1">
                          <label className="text-xs font-medium">
                            {filter.label}
                          </label>
                          {renderFilter(filter)}
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {/* Clear filters */}
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size={compact ? "sm" : "default"}
                onClick={clearFilters}
                className={cn(
                  "text-muted-foreground",
                  compact ? "h-8 px-2" : "h-9 px-3"
                )}
              >
                <X className={cn(
                  "mr-1",
                  compact ? "h-3.5 w-3.5" : "h-4 w-4"
                )} />
                Clear
                {showFilterCount && (
                  <Badge variant="secondary" className="ml-1">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            )}

            {/* View toggle */}
            {showViewToggle && (
              <div className="flex rounded-md border ml-auto">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  className={compact ? "h-8 w-8" : "h-9 w-9"}
                  onClick={() => onViewModeChange?.('list')}
                >
                  <List className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  className={compact ? "h-8 w-8" : "h-9 w-9"}
                  onClick={() => onViewModeChange?.('grid')}
                >
                  <Grid3X3 className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
                </Button>
              </div>
            )}
          </div>

          {/* Active filters display */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">Active filters:</span>
              {Object.entries(filterValues).map(([key, value]) => {
                if (!value || value === 'all' || key === 'dateRange') return null
                const filter = [...filters, ...advancedFilters].find(f => f.key === key)
                return (
                  <Badge
                    key={key}
                    variant="secondary"
                    className="text-xs"
                  >
                    {filter?.label}: {String(value)}
                    <button
                      className="ml-1 hover:text-destructive"
                      onClick={() => handleFilterChange(key, undefined)}
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </Badge>
                )
              })}
              {dateRange && (
                <Badge variant="secondary" className="text-xs">
                  Date range selected
                  <button
                    className="ml-1 hover:text-destructive"
                    onClick={() => handleDateRangeChange(undefined)}
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}