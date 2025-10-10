"use client"

import { useState, useMemo, ReactNode, memo, useCallback } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Download,
} from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export interface DataTableColumn<T> {
  key: string
  header: string | ReactNode
  accessor: (item: T) => ReactNode
  sortable?: boolean
  searchable?: boolean
  className?: string
  headerClassName?: string
  sticky?: boolean
  width?: string | number
  align?: 'left' | 'center' | 'right'
}

export interface DataTableAction<T> {
  label: string
  icon?: React.ElementType
  onClick: (item: T) => void
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost'
  condition?: (item: T) => boolean
}

interface DataTableProps<T> {
  data: T[]
  columns: DataTableColumn<T>[]
  // Search & Filter
  searchable?: boolean
  searchPlaceholder?: string
  searchKey?: (item: T) => string
  globalSearch?: boolean
  // Pagination
  paginate?: boolean
  pageSize?: number
  pageSizeOptions?: number[]
  // Selection
  selectable?: boolean
  selectedItems?: T[]
  onSelectionChange?: (items: T[]) => void
  // Sorting
  defaultSort?: { key: string; direction: 'asc' | 'desc' }
  onSort?: (key: string, direction: 'asc' | 'desc') => void
  // Actions
  actions?: DataTableAction<T>[] | ((item: T) => ReactNode)
  bulkActions?: DataTableAction<T[]>[]
  onRowClick?: (item: T) => void
  // Display
  loading?: boolean
  error?: string
  emptyMessage?: string
  emptyIcon?: React.ElementType
  striped?: boolean
  compact?: boolean
  bordered?: boolean
  hoverable?: boolean
  stickyHeader?: boolean
  maxHeight?: string | number
  className?: string
  containerClassName?: string
  // Custom row styling
  getRowClassName?: (item: T, index: number) => string
  // Export functionality
  exportData?: () => void
}

export const DataTableEnhanced = memo(function DataTableEnhanced<T extends { id?: string | number }>({
  data,
  columns,
  // Search & Filter
  searchable = false,
  searchPlaceholder = "Search...",
  searchKey,
  globalSearch = true,
  // Pagination
  paginate = false,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50, 100],
  // Selection
  selectable = false,
  selectedItems = [],
  onSelectionChange,
  // Sorting
  defaultSort,
  onSort,
  // Actions
  actions,
  bulkActions = [],
  onRowClick,
  // Display
  loading = false,
  error,
  emptyMessage = "No data available",
  emptyIcon,
  striped = false,
  compact = false,
  bordered = true,
  hoverable = true,
  stickyHeader = false,
  maxHeight,
  className,
  containerClassName,
  // Custom row styling
  getRowClassName,
  // Export
  exportData
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [sortConfig, setSortConfig] = useState<{
    key: string | null
    direction: "asc" | "desc"
  }>(defaultSort ? { key: defaultSort.key, direction: defaultSort.direction } : { key: null, direction: "asc" })
  const [internalSelectedItems, setInternalSelectedItems] = useState<T[]>(selectedItems)

  const selected = useMemo(() => {
    return selectable ? (onSelectionChange ? selectedItems : internalSelectedItems) : []
  }, [selectable, onSelectionChange, selectedItems, internalSelectedItems])

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchable || !searchTerm) return data

    return data.filter(item => {
      if (searchKey) {
        return searchKey(item).toLowerCase().includes(searchTerm.toLowerCase())
      }

      if (globalSearch) {
        // Search in all searchable columns
        return columns.some(column => {
          if (column.searchable === false) return false
          const value = column.accessor(item)
          if (value === null || value === undefined) return false
          return String(value).toLowerCase().includes(searchTerm.toLowerCase())
        })
      }

      return false
    })
  }, [data, searchTerm, searchable, searchKey, globalSearch, columns])

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData

    const sorted = [...filteredData].sort((a, b) => {
      const column = columns.find(col => col.key === sortConfig.key)
      if (!column) return 0

      const aValue = column.accessor(a)
      const bValue = column.accessor(b)

      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
      return 0
    })

    return sorted
  }, [filteredData, sortConfig, columns])

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!paginate) return sortedData

    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return sortedData.slice(startIndex, endIndex)
  }, [sortedData, currentPage, pageSize, paginate])

  const totalPages = Math.ceil(sortedData.length / pageSize)

  const handleSort = useCallback((key: string) => {
    const newDirection = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc"
    setSortConfig({ key, direction: newDirection })
    onSort?.(key, newDirection)
  }, [sortConfig, onSort])

  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }, [totalPages])

  const handleSelectAll = useCallback(() => {
    const newSelection = selected.length === paginatedData.length ? [] : paginatedData
    if (onSelectionChange) {
      onSelectionChange(newSelection)
    } else {
      setInternalSelectedItems(newSelection)
    }
  }, [selected, paginatedData, onSelectionChange])

  const handleSelectItem = useCallback((item: T) => {
    const isSelected = selected.some(s => s.id === item.id)
    const newSelection = isSelected
      ? selected.filter(s => s.id !== item.id)
      : [...selected, item]

    if (onSelectionChange) {
      onSelectionChange(newSelection)
    } else {
      setInternalSelectedItems(newSelection)
    }
  }, [selected, onSelectionChange])

  const renderActions = useCallback((item: T) => {
    if (typeof actions === 'function') {
      return actions(item)
    }

    if (!actions || actions.length === 0) return null

    const visibleActions = actions.filter(action =>
      !action.condition || action.condition(item)
    )

    if (visibleActions.length === 0) return null

    if (visibleActions.length === 1) {
      const action = visibleActions[0]
      const Icon = action.icon
      return (
        <Button
          variant={action.variant || 'ghost'}
          size="sm"
          onClick={() => action.onClick(item)}
          className={compact ? "h-7 px-2" : "h-8 px-3"}
        >
          {Icon && <Icon className={cn("mr-1", compact ? "h-3 w-3" : "h-3.5 w-3.5")} />}
          {action.label}
        </Button>
      )
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className={compact ? "h-7 w-7" : "h-8 w-8"}>
            <MoreHorizontal className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {visibleActions.map((action, index) => {
            const Icon = action.icon
            return (
              <DropdownMenuItem
                key={index}
                onClick={() => action.onClick(item)}
                className={action.variant === 'destructive' ? 'text-destructive' : ''}
              >
                {Icon && <Icon className="mr-2 h-3.5 w-3.5" />}
                {action.label}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }, [actions, compact])

  if (loading) {
    return (
      <div className={containerClassName}>
        <div className="space-y-3">
          {searchable && <Skeleton className="h-9 w-full max-w-sm" />}
          <div className="rounded-md border">
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={containerClassName}>
        <EmptyState
          variant="error"
          title="Error loading data"
          description={error}
        />
      </div>
    )
  }

  const getSortIcon = (column: DataTableColumn<T>) => {
    if (!column.sortable) return null

    if (sortConfig.key !== column.key) {
      return <ArrowUpDown className="ml-1 h-3 w-3 text-muted-foreground" />
    }

    return sortConfig.direction === "asc"
      ? <ArrowUp className="ml-1 h-3 w-3" />
      : <ArrowDown className="ml-1 h-3 w-3" />
  }

  return (
    <div className={containerClassName}>
      {/* Header actions */}
      {(searchable || bulkActions.length > 0 || exportData) && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {searchable && (
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          )}

          {selected.length > 0 && bulkActions.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {selected.length} selected
              </Badge>
              {bulkActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <Button
                    key={index}
                    variant={action.variant || 'outline'}
                    size="sm"
                    onClick={() => action.onClick(selected)}
                  >
                    {Icon && <Icon className="mr-1 h-3.5 w-3.5" />}
                    {action.label}
                  </Button>
                )
              })}
            </div>
          )}

          {exportData && (
            <Button
              variant="outline"
              size="sm"
              onClick={exportData}
              className="ml-auto"
            >
              <Download className="mr-1 h-3.5 w-3.5" />
              Export
            </Button>
          )}
        </div>
      )}

      {/* Table */}
      <div
        className={cn(
          "rounded-md overflow-auto",
          bordered && "border",
          className
        )}
        style={{ maxHeight }}
      >
        <Table>
          <TableHeader className={stickyHeader ? "sticky top-0 bg-background z-10" : ""}>
            <TableRow>
              {selectable && (
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={selected.length === paginatedData.length && paginatedData.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}
              {columns.map(column => (
                <TableHead
                  key={column.key}
                  className={cn(
                    column.headerClassName,
                    column.sortable && "cursor-pointer select-none",
                    column.align === 'center' && "text-center",
                    column.align === 'right' && "text-right",
                    column.sticky && "sticky left-0 bg-background z-10"
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className={cn(
                    "flex items-center",
                    column.align === 'center' && "justify-center",
                    column.align === 'right' && "justify-end"
                  )}>
                    {column.header}
                    {getSortIcon(column)}
                  </div>
                </TableHead>
              ))}
              {actions && <TableHead className="w-[100px] text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions ? 1 : 0) + (selectable ? 1 : 0)}
                  className="text-center py-8"
                >
                  <EmptyState
                    icon={emptyIcon}
                    title={emptyMessage}
                    variant={searchTerm ? 'search' : 'default'}
                  />
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, index) => {
                const isSelected = selected.some(s => s.id === item.id)
                return (
                  <TableRow
                    key={item.id || index}
                    onClick={() => onRowClick?.(item)}
                    className={cn(
                      onRowClick && "cursor-pointer",
                      hoverable && "hover:bg-muted/50",
                      striped && index % 2 === 1 && "bg-muted/20",
                      isSelected && "bg-muted/30",
                      getRowClassName?.(item, index)
                    )}
                  >
                    {selectable && (
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleSelectItem(item)}
                        />
                      </TableCell>
                    )}
                    {columns.map(column => (
                      <TableCell
                        key={column.key}
                        className={cn(
                          column.className,
                          column.align === 'center' && "text-center",
                          column.align === 'right' && "text-right",
                          column.sticky && "sticky left-0 bg-background",
                          compact && "py-2"
                        )}
                      >
                        {column.accessor(item)}
                      </TableCell>
                    ))}
                    {actions && (
                      <TableCell
                        className={cn("text-right", compact && "py-2")}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {renderActions(item)}
                      </TableCell>
                    )}
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {paginate && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-2 py-4 gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Showing {((currentPage - 1) * pageSize) + 1} to{" "}
              {Math.min(currentPage * pageSize, sortedData.length)} of{" "}
              {sortedData.length} entries
            </span>
            {pageSizeOptions.length > 1 && (
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="h-8 rounded border px-2 text-sm"
              >
                {pageSizeOptions.map(size => (
                  <option key={size} value={size}>
                    {size} per page
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Page numbers */}
            <div className="flex items-center gap-1 mx-2">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNum = i + 1
                if (totalPages > 5) {
                  if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                }

                if (pageNum < 1 || pageNum > totalPages) return null

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className="w-8"
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
})