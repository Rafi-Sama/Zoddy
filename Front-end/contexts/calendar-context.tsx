"use client"

import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from "react"

export interface Reminder {
  id: string
  date: string
  time: string
  title: string
  description?: string
  type: "reminder" | "note" | "event"
  completed?: boolean
}

interface CalendarContextType {
  reminders: Reminder[]
  addReminder: (reminder: Omit<Reminder, "id">) => void
  updateReminder: (id: string, updates: Partial<Reminder>) => void
  deleteReminder: (id: string) => void
  toggleCompleted: (id: string) => void
  getRemindersByDate: (date: string) => Reminder[]
  getUpcomingReminders: (days?: number) => Reminder[]
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined)

const initialReminders: Reminder[] = [
  {
    id: "1",
    date: new Date().toISOString().split('T')[0],
    time: "14:00",
    title: "Follow up with Rahman Ali",
    description: "Check on pending payment for Order #1233",
    type: "reminder",
    completed: false
  },
  {
    id: "2",
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: "10:00",
    title: "Restock inventory",
    description: "Order more Cotton Kurtis - Blue variant",
    type: "reminder",
    completed: false
  },
  {
    id: "3",
    date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    time: "15:30",
    title: "Monthly sales review",
    description: "Analyze sales performance and set goals for next month",
    type: "event",
    completed: false
  }
]

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders)

  const addReminder = useCallback((reminder: Omit<Reminder, "id">) => {
    const newReminder: Reminder = {
      ...reminder,
      id: Date.now().toString(),
      completed: false
    }
    setReminders(prev => [...prev, newReminder])
  }, [])

  const updateReminder = useCallback((id: string, updates: Partial<Reminder>) => {
    setReminders(prev =>
      prev.map(reminder =>
        reminder.id === id ? { ...reminder, ...updates } : reminder
      )
    )
  }, [])

  const deleteReminder = useCallback((id: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id))
  }, [])

  const toggleCompleted = useCallback((id: string) => {
    setReminders(prev =>
      prev.map(reminder =>
        reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
      )
    )
  }, [])

  const getRemindersByDate = useCallback((date: string) => {
    return reminders.filter(reminder => reminder.date === date)
  }, [reminders])

  const getUpcomingReminders = useCallback((days: number = 7) => {
    const today = new Date()
    const futureDate = new Date(today.getTime() + (days * 24 * 60 * 60 * 1000))

    return reminders.filter(reminder => {
      const reminderDate = new Date(reminder.date)
      return reminderDate >= today && reminderDate <= futureDate && !reminder.completed
    }).sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time || '00:00'}`)
      const dateB = new Date(`${b.date} ${b.time || '00:00'}`)
      return dateA.getTime() - dateB.getTime()
    })
  }, [reminders])

  const contextValue = useMemo(
    () => ({
      reminders,
      addReminder,
      updateReminder,
      deleteReminder,
      toggleCompleted,
      getRemindersByDate,
      getUpcomingReminders
    }),
    [reminders, addReminder, updateReminder, deleteReminder, toggleCompleted, getRemindersByDate, getUpcomingReminders]
  )

  return (
    <CalendarContext.Provider value={contextValue}>
      {children}
    </CalendarContext.Provider>
  )
}

export function useCalendar() {
  const context = useContext(CalendarContext)
  if (context === undefined) {
    throw new Error("useCalendar must be used within a CalendarProvider")
  }
  return context
}