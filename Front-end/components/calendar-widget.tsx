"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar as CalendarIcon, Plus, Clock, Trash2, ChevronLeft, ChevronRight, Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCalendar } from "@/contexts/calendar-context"
import Link from "next/link"

export function CalendarWidget() {
  const {
    addReminder,
    deleteReminder,
    getRemindersByDate,
    getUpcomingReminders
  } = useCalendar()

  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newReminder, setNewReminder] = useState({
    title: "",
    description: "",
    time: "",
    type: "reminder" as "reminder" | "note" | "event"
  })

  // Calendar logic
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"]

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(new Date())
  }

  const getDayReminders = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return getRemindersByDate(dateStr)
  }

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    setSelectedDate(clickedDate)
  }

  const handleAddReminder = () => {
    if (!selectedDate || !newReminder.title) return

    addReminder({
      date: selectedDate.toISOString().split('T')[0],
      time: newReminder.time,
      title: newReminder.title,
      description: newReminder.description,
      type: newReminder.type,
      completed: false
    })

    setNewReminder({ title: "", description: "", time: "", type: "reminder" })
    setShowAddForm(false)
  }

  const getSelectedDateReminders = () => {
    if (!selectedDate) return []
    const dateStr = selectedDate.toISOString().split('T')[0]
    return getRemindersByDate(dateStr)
  }

  const isToday = (day: number) => {
    const today = new Date()
    return day === today.getDate() &&
           currentDate.getMonth() === today.getMonth() &&
           currentDate.getFullYear() === today.getFullYear()
  }

  const upcomingReminders = getUpcomingReminders(3)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
          <CalendarIcon className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[420px] p-0">
        <div className="flex">
          {/* Calendar Side */}
          <div className="w-[240px] border-r p-3">
            <div className="flex items-center justify-between mb-3">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={prevMonth}>
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <div className="text-xs font-semibold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={nextMonth}>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Days of week */}
            <div className="grid grid-cols-7 gap-0.5 mb-1">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                <div key={day} className="text-[10px] text-muted-foreground text-center p-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-0.5">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="p-1"></div>
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const dayReminders = getDayReminders(day)
                const isSelected = selectedDate &&
                  day === selectedDate.getDate() &&
                  currentDate.getMonth() === selectedDate.getMonth() &&
                  currentDate.getFullYear() === selectedDate.getFullYear()

                return (
                  <Button
                    key={day}
                    variant="ghost"
                    className={cn(
                      "h-7 w-7 p-0 text-[11px] relative",
                      isToday(day) && "bg-accent font-semibold",
                      isSelected && "ring-2 ring-primary",
                      dayReminders.length > 0 && "font-semibold"
                    )}
                    onClick={() => handleDateClick(day)}
                  >
                    {day}
                    {dayReminders.length > 0 && (
                      <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                        {dayReminders.slice(0, 3).map((_, idx) => (
                          <div key={idx} className="h-1 w-1 rounded-full bg-primary" />
                        ))}
                      </div>
                    )}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3 h-7 text-[10px]"
              onClick={goToToday}
            >
              Today
            </Button>
          </div>

          {/* Reminders Side */}
          <div className="w-[180px] p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold">
                Quick View
              </div>
              {selectedDate && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => setShowAddForm(!showAddForm)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              )}
            </div>

            {showAddForm && selectedDate && (
              <div className="space-y-2 mb-3 p-2 border rounded-md bg-accent/20">
                <Input
                  placeholder="Title"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                  className="h-7 text-xs"
                />
                <Textarea
                  placeholder="Description (optional)"
                  value={newReminder.description}
                  onChange={(e) => setNewReminder({...newReminder, description: e.target.value})}
                  className="h-14 text-xs resize-none"
                />
                <div className="flex gap-2">
                  <Input
                    type="time"
                    value={newReminder.time}
                    onChange={(e) => setNewReminder({...newReminder, time: e.target.value})}
                    className="h-7 text-xs"
                  />
                  <select
                    value={newReminder.type}
                    onChange={(e) => setNewReminder({...newReminder, type: e.target.value as "reminder" | "note" | "event"})}
                    className="h-7 text-xs border rounded px-2"
                  >
                    <option value="reminder">Reminder</option>
                    <option value="event">Event</option>
                    <option value="note">Note</option>
                  </select>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    className="h-6 text-[10px] flex-1"
                    onClick={handleAddReminder}
                  >
                    Add
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 text-[10px] flex-1"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <ScrollArea className="h-[180px]">
              {!selectedDate ? (
                <div className="space-y-2">
                  <div className="text-[11px] font-medium text-muted-foreground mb-1">
                    Upcoming Reminders
                  </div>
                  {upcomingReminders.length === 0 ? (
                    <div className="text-center text-[10px] text-muted-foreground py-4">
                      No upcoming reminders
                    </div>
                  ) : (
                    upcomingReminders.map((reminder) => (
                      <div
                        key={reminder.id}
                        className="p-2 border rounded-md bg-accent/10"
                      >
                        <div className="flex items-center gap-1">
                          <Bell className="h-2.5 w-2.5 text-primary" />
                          <div className="text-[10px] font-medium truncate">
                            {reminder.title}
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5 text-[9px] text-muted-foreground mt-0.5">
                          <Clock className="h-2.5 w-2.5" />
                          {new Date(reminder.date).toLocaleDateString()}
                          {reminder.time && ` at ${reminder.time}`}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <>
                  <div className="text-[11px] font-medium mb-1">
                    {selectedDate.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                  {getSelectedDateReminders().length === 0 && !showAddForm && (
                    <div className="text-center text-[10px] text-muted-foreground py-4">
                      No reminders
                    </div>
                  )}
                  {getSelectedDateReminders().map((reminder) => (
                    <div
                      key={reminder.id}
                      className="mb-2 p-2 border rounded-md bg-accent/10 group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-1">
                            <Bell className="h-2.5 w-2.5 text-primary" />
                            <div className="text-[10px] font-medium">{reminder.title}</div>
                          </div>
                          {reminder.time && (
                            <div className="flex items-center gap-0.5 text-[9px] text-muted-foreground">
                              <Clock className="h-2.5 w-2.5" />
                              {reminder.time}
                            </div>
                          )}
                          {reminder.description && (
                            <div className="text-[9px] text-muted-foreground mt-0.5">
                              {reminder.description}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteReminder(reminder.id)}
                        >
                          <Trash2 className="h-2.5 w-2.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </ScrollArea>

            <Link href="/calendar">
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-7 text-[10px] mt-2"
              >
                View Full Calendar
              </Button>
            </Link>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}