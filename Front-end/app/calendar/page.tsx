"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar as CalendarIcon, Plus, Edit, Trash2, Check, Clock, ChevronLeft, ChevronRight, CalendarDays } from "lucide-react"
import { useState } from "react"
import { useCalendar, type Reminder } from "@/contexts/calendar-context"
import { cn } from "@/lib/utils"

export default function CalendarPage() {
  const {
    addReminder,
    updateReminder,
    deleteReminder,
    toggleCompleted,
    getRemindersByDate,
    getUpcomingReminders
  } = useCalendar()

  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [showReminderDialog, setShowReminderDialog] = useState(false)
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null)

  // Calendar logic
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"]
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentDate(today)
    setSelectedDate(today)
  }

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    setSelectedDate(clickedDate)
  }

  const getDayReminders = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return getRemindersByDate(dateStr)
  }

  const getSelectedDateReminders = () => {
    const dateStr = selectedDate.toISOString().split('T')[0]
    return getRemindersByDate(dateStr)
  }

  const isToday = (day: number) => {
    const today = new Date()
    return day === today.getDate() &&
           currentDate.getMonth() === today.getMonth() &&
           currentDate.getFullYear() === today.getFullYear()
  }

  const isSelected = (day: number) => {
    return day === selectedDate.getDate() &&
           currentDate.getMonth() === selectedDate.getMonth() &&
           currentDate.getFullYear() === selectedDate.getFullYear()
  }

  const handleAddReminder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const reminderData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      type: formData.get("type") as "reminder" | "note" | "event",
      completed: false
    }

    if (editingReminder) {
      updateReminder(editingReminder.id, reminderData)
      setEditingReminder(null)
    } else {
      addReminder(reminderData)
    }

    setShowReminderDialog(false)
    e.currentTarget.reset()
  }

  const getTypeColor = (type: string) => {
    switch(type) {
      case "reminder": return "bg-blue-100 text-blue-800"
      case "event": return "bg-purple-100 text-purple-800"
      case "note": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const upcomingReminders = getUpcomingReminders(7)

  return (
    <MainLayout
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Calendar" }
      ]}
    >
      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Full Calendar */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" />
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={prevMonth}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 px-3 text-xs" onClick={goToToday}>
                      Today
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={nextMonth}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Days of week */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {dayNames.map((day) => (
                    <div key={day} className="text-xs font-medium text-muted-foreground text-center p-2">
                      {day.substring(0, 3)}
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square p-2"></div>
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1
                    const dayReminders = getDayReminders(day)

                    return (
                      <Button
                        key={day}
                        variant="ghost"
                        className={cn(
                          "aspect-square p-2 h-auto flex flex-col items-start justify-start relative",
                          isToday(day) && "bg-accent",
                          isSelected(day) && "ring-2 ring-primary",
                          "hover:bg-accent/50"
                        )}
                        onClick={() => handleDateClick(day)}
                      >
                        <span className={cn(
                          "text-sm",
                          isToday(day) && "font-bold"
                        )}>
                          {day}
                        </span>
                        {dayReminders.length > 0 && (
                          <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-0.5">
                            {dayReminders.slice(0, 3).map((_, idx) => (
                              <div key={idx} className="h-1 w-1 rounded-full bg-primary" />
                            ))}
                          </div>
                        )}
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Selected Date Details */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">
                    {selectedDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </CardTitle>
                  <Dialog open={showReminderDialog} onOpenChange={setShowReminderDialog}>
                    <DialogTrigger asChild>
                      <Button size="icon" className="h-8 w-8" onClick={() => setEditingReminder(null)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingReminder ? "Edit Reminder" : "Add Reminder"}</DialogTitle>
                        <DialogDescription>
                          Create a reminder for {selectedDate.toLocaleDateString()}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddReminder} className="space-y-4">
                        <div>
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            name="title"
                            defaultValue={editingReminder?.title}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Description (optional)</Label>
                          <Textarea
                            id="description"
                            name="description"
                            defaultValue={editingReminder?.description}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="time">Time</Label>
                            <Input
                              id="time"
                              name="time"
                              type="time"
                              defaultValue={editingReminder?.time}
                            />
                          </div>
                          <div>
                            <Label htmlFor="type">Type</Label>
                            <select
                              id="type"
                              name="type"
                              defaultValue={editingReminder?.type || "reminder"}
                              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                            >
                              <option value="reminder">Reminder</option>
                              <option value="event">Event</option>
                              <option value="note">Note</option>
                            </select>
                          </div>
                        </div>
                        <Input
                          type="hidden"
                          name="date"
                          value={selectedDate.toISOString().split('T')[0]}
                        />
                        <Button type="submit" className="w-full">
                          {editingReminder ? "Update" : "Create"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {getSelectedDateReminders().length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No reminders for this date
                  </p>
                ) : (
                  getSelectedDateReminders().map((reminder) => (
                    <div
                      key={reminder.id}
                      className={cn(
                        "p-3 border rounded-lg space-y-1",
                        reminder.completed && "opacity-60"
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2 flex-1">
                          <button
                            onClick={() => toggleCompleted(reminder.id)}
                            className={cn(
                              "mt-0.5 h-4 w-4 rounded border-2 flex items-center justify-center shrink-0",
                              reminder.completed ? "bg-primary border-primary" : "border-muted-foreground"
                            )}
                          >
                            {reminder.completed && <Check className="h-2.5 w-2.5 text-white" />}
                          </button>
                          <div className="flex-1">
                            <p className={cn(
                              "text-sm font-medium",
                              reminder.completed && "line-through"
                            )}>
                              {reminder.title}
                            </p>
                            {reminder.description && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {reminder.description}
                              </p>
                            )}
                            <div className="flex items-center gap-1.5 mt-1">
                              {reminder.time && (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                  <Clock className="h-2.5 w-2.5 mr-1" />
                                  {reminder.time}
                                </Badge>
                              )}
                              <Badge className={cn("text-[10px] px-1.5 py-0", getTypeColor(reminder.type))}>
                                {reminder.type}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => {
                              setEditingReminder(reminder)
                              setShowReminderDialog(true)
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive hover:text-destructive"
                            onClick={() => deleteReminder(reminder.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          {/* Upcoming Reminders */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Upcoming Reminders</CardTitle>
              <CardDescription>Your reminders for the next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingReminders.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No upcoming reminders in the next 7 days
                </p>
              ) : (
                <div className="space-y-3">
                  {upcomingReminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className="flex items-start gap-3 p-3 border rounded-lg"
                    >
                      <button
                        onClick={() => toggleCompleted(reminder.id)}
                        className={cn(
                          "mt-0.5 h-4 w-4 rounded border-2 flex items-center justify-center shrink-0",
                          reminder.completed ? "bg-primary border-primary" : "border-muted-foreground"
                        )}
                      >
                        {reminder.completed && <Check className="h-2.5 w-2.5 text-white" />}
                      </button>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{reminder.title}</p>
                        {reminder.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {reminder.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            <CalendarIcon className="h-2.5 w-2.5 mr-1" />
                            {new Date(reminder.date).toLocaleDateString()}
                          </Badge>
                          {reminder.time && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                              <Clock className="h-2.5 w-2.5 mr-1" />
                              {reminder.time}
                            </Badge>
                          )}
                          <Badge className={cn("text-[10px] px-1.5 py-0", getTypeColor(reminder.type))}>
                            {reminder.type}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => {
                            setEditingReminder(reminder)
                            setShowReminderDialog(true)
                          }}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => deleteReminder(reminder.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  )
}