"use client"

import { useState, useMemo, ReactNode, memo } from "react"
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
// Removed unused Select imports
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"

export interface DataTableColumn<T> {
  key: string
  header: string
  accessor: (item: T) => ReactNode
  sortable?: boolean
  className?: string
  headerClassName?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: DataTableColumn<T>[]
  searchable?: boolean
  searchPlaceholder?: string
  searchKey?: (item: T) => string
  paginate?: boolean
  pageSize?: number
  loading?: boolean
  emptyMessage?: string
  actions?: (item: T) => ReactNode
  onRowClick?: (item: T) => void
  className?: string
}

export const DataTable = memo(function DataTable<T extends { id?: string | number }>({
  data,
  columns,
  searchable = false,
  searchPlaceholder = "Search...",
  searchKey,
  paginate = false,
  pageSize = 10,
  loading = false,
  emptyMessage = "No data available",
  actions,
  onRowClick,
  className
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<{
    key: string | null
    direction: "asc" | "desc"
  }>({ key: null, direction: "asc" })

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchable || !searchTerm) return data

    return data.filter(item => {
      if (searchKey) {
        return searchKey(item).toLowerCase().includes(searchTerm.toLowerCase())
      }
      // Default: search in all string fields
      return Object.values(item as Record<string, unknown>).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    })
  }, [data, searchTerm, searchable, searchKey])

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

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }))
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  if (loading) {
    return <LoadingSkeleton type="table" count={5} />
  }

  return (
    <div className={className}>
      {searchable && (
        <div className="mb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(column => (
                <TableHead
                  key={column.key}
                  className={column.headerClassName}
                  onClick={() => column.sortable && handleSort(column.key)}
                  style={{ cursor: column.sortable ? "pointer" : "default" }}
                >
                  <div className="flex items-center gap-1">
                    {column.header}
                    {column.sortable && sortConfig.key === column.key && (
                      <span className="text-xs">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
              {actions && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="text-center py-8 text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, index) => (
                <TableRow
                  key={item.id || index}
                  onClick={() => onRowClick?.(item)}
                  className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
                >
                  {columns.map(column => (
                    <TableCell key={column.key} className={column.className}>
                      {column.accessor(item)}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell>
                      <div onClick={(e) => e.stopPropagation()}>
                        {actions(item)}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {paginate && totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-4">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * pageSize) + 1} to{" "}
            {Math.min(currentPage * pageSize, sortedData.length)} of{" "}
            {sortedData.length} entries
          </div>
          <div className="flex items-center gap-2">
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
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
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