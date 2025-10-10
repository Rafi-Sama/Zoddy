"use client"

import * as React from "react"
import { format, parse, isValid, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear, isToday, isSameDay } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps {
  date?: DateRange
  onDateChange?: (date: DateRange | undefined) => void
  className?: string
  placeholder?: string
}

export function DateRangePicker({
  date,
  onDateChange,
  className,
  placeholder = "All time"
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [fromDate, setFromDate] = React.useState("")
  const [toDate, setToDate] = React.useState("")
  const [error, setError] = React.useState("")

  // Initialize dates when component mounts or date prop changes
  React.useEffect(() => {
    if (date?.from) {
      setFromDate(format(date.from, "dd-MM-yyyy"))
    } else {
      setFromDate("")
    }
    if (date?.to) {
      setToDate(format(date.to, "dd-MM-yyyy"))
    } else {
      setToDate("")
    }
  }, [date])

  // Quick presets
  const presets = [
    {
      name: "Today",
      value: () => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return { from: today, to: today }
      }
    },
    {
      name: "Yesterday",
      value: () => {
        const yesterday = subDays(new Date(), 1)
        yesterday.setHours(0, 0, 0, 0)
        return { from: yesterday, to: yesterday }
      }
    },
    {
      name: "Last 7 days",
      value: () => {
        const end = new Date()
        end.setHours(23, 59, 59, 999)
        const start = subDays(end, 6)
        start.setHours(0, 0, 0, 0)
        return { from: start, to: end }
      }
    },
    {
      name: "Last 30 days",
      value: () => {
        const end = new Date()
        end.setHours(23, 59, 59, 999)
        const start = subDays(end, 29)
        start.setHours(0, 0, 0, 0)
        return { from: start, to: end }
      }
    },
    {
      name: "This month",
      value: () => {
        const now = new Date()
        const start = startOfMonth(now)
        const end = endOfMonth(now)
        return { from: start, to: end }
      }
    },
    {
      name: "This year",
      value: () => {
        const now = new Date()
        const start = startOfYear(now)
        const end = endOfYear(now)
        return { from: start, to: end }
      }
    }
  ]

  const handlePresetClick = (preset: typeof presets[0]) => {
    const range = preset.value()
    setFromDate(format(range.from, "dd-MM-yyyy"))
    setToDate(format(range.to, "dd-MM-yyyy"))
    setError("")
    if (onDateChange) {
      onDateChange(range)
    }
    setTimeout(() => setIsOpen(false), 100)
  }

  const validateAndApply = () => {
    setError("")

    // Check if at least from date is provided
    if (!fromDate) {
      setError("Please enter a start date")
      return
    }

    // Parse dates - support multiple formats
    let from = parse(fromDate, "dd-MM-yyyy", new Date())
    if (!isValid(from)) {
      from = parse(fromDate, "dd/MM/yyyy", new Date())
      if (!isValid(from)) {
        from = parse(fromDate, "yyyy-MM-dd", new Date())
      }
    }

    let to = from
    if (toDate) {
      to = parse(toDate, "dd-MM-yyyy", new Date())
      if (!isValid(to)) {
        to = parse(toDate, "dd/MM/yyyy", new Date())
        if (!isValid(to)) {
          to = parse(toDate, "yyyy-MM-dd", new Date())
        }
      }
    }

    // Validate dates
    if (!isValid(from)) {
      setError("Invalid start date format")
      return
    }

    if (toDate && !isValid(to)) {
      setError("Invalid end date format")
      return
    }

    // Check if from date is before to date
    if (from > to) {
      setError("Start date must be before end date")
      return
    }

    // Check if dates are not in the future
    const today = new Date()
    today.setHours(23, 59, 59, 999)

    if (from > today) {
      setError("Start date cannot be in the future")
      return
    }

    if (to > today) {
      setError("End date cannot be in the future")
      return
    }

    // Apply the date range
    if (onDateChange) {
      onDateChange({ from, to })
    }
    setIsOpen(false)
  }

  const handleClear = () => {
    setFromDate("")
    setToDate("")
    setError("")
    if (onDateChange) {
      onDateChange(undefined)
    }
    setIsOpen(false)
  }

  const formatDateDisplay = () => {
    if (!date?.from) return placeholder

    if (date.from && !date.to) {
      return format(date.from, "dd-MM-yyyy")
    }

    if (date.from && date.to) {
      if (isSameDay(date.from, date.to)) {
        if (isToday(date.from)) {
          return "Today"
        }
        return format(date.from, "dd-MM-yyyy")
      }

      // Same month and year
      if (date.from.getMonth() === date.to.getMonth() &&
          date.from.getFullYear() === date.to.getFullYear()) {
        return `${format(date.from, "dd")}-${format(date.to, "dd-MM-yyyy")}`
      }

      // Same year
      if (date.from.getFullYear() === date.to.getFullYear()) {
        return `${format(date.from, "dd-MM")} to ${format(date.to, "dd-MM-yyyy")}`
      }

      // Different years
      return `${format(date.from, "dd-MM-yyyy")} to ${format(date.to, "dd-MM-yyyy")}`
    }

    return placeholder
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal h-10",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span className="flex-1 truncate text-sm">{formatDateDisplay()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="flex flex-col">
          {/* Quick presets */}
          <div className="p-3 border-b">
            <Label className="text-xs text-muted-foreground mb-2 block">Quick Select</Label>
            <div className="grid grid-cols-3 gap-1.5">
              {presets.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => handlePresetClick(preset)}
                >
                  {preset.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Manual date inputs */}
          <div className="p-3 space-y-3">
            <div className="space-y-2">
              <div className="space-y-1.5">
                <Label htmlFor="from-date" className="text-xs">From Date</Label>
                <Input
                  id="from-date"
                  type="text"
                  value={fromDate}
                  onChange={(e) => {
                    setFromDate(e.target.value)
                    setError("")
                  }}
                  className="h-9 text-sm"
                  placeholder="DD-MM-YYYY"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="to-date" className="text-xs">To Date (Optional)</Label>
                <Input
                  id="to-date"
                  type="text"
                  value={toDate}
                  onChange={(e) => {
                    setToDate(e.target.value)
                    setError("")
                  }}
                  className="h-9 text-sm"
                  placeholder="DD-MM-YYYY"
                />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <p className="text-xs text-red-500">{error}</p>
            )}
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between gap-2 p-3 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-8"
            >
              Clear
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsOpen(false)
                  // Reset to original values
                  if (date?.from) {
                    setFromDate(format(date.from, "dd-MM-yyyy"))
                  } else {
                    setFromDate("")
                  }
                  if (date?.to) {
                    setToDate(format(date.to, "dd-MM-yyyy"))
                  } else {
                    setToDate("")
                  }
                  setError("")
                }}
                className="h-8"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={validateAndApply}
                disabled={!fromDate}
                className="h-8"
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}