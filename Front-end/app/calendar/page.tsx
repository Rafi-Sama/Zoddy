"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarIcon, Plus, Edit, Trash2, Bell, StickyNote, Check, Clock } from "lucide-react"
import { useState } from "react"

interface Reminder {
  id: string
  title: string
  description: string
  date: string
  time: string
  priority: "low" | "medium" | "high"
  completed: boolean
}

interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export default function CalendarPage() {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: "1",
      title: "Follow up with customer",
      description: "Check payment status for Order #1234",
      date: "2025-10-05",
      time: "10:00",
      priority: "high",
      completed: false
    },
    {
      id: "2",
      title: "Restock inventory",
      description: "Order more products for low stock items",
      date: "2025-10-06",
      time: "14:00",
      priority: "medium",
      completed: false
    }
  ])

  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Marketing Ideas",
      content: "Consider running a discount campaign for Eid. Target customers who haven&apos;t ordered in 30 days.",
      createdAt: "2025-10-01",
      updatedAt: "2025-10-01"
    },
    {
      id: "2",
      title: "Supplier Contact",
      content: "New supplier: Ahmed Trading - 01712345678. Better prices on electronics.",
      createdAt: "2025-09-28",
      updatedAt: "2025-09-30"
    }
  ])

  const [showReminderDialog, setShowReminderDialog] = useState(false)
  const [showNoteDialog, setShowNoteDialog] = useState(false)
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null)
  const [editingNote, setEditingNote] = useState<Note | null>(null)

  const handleAddReminder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const newReminder: Reminder = {
      id: Date.now().toString(),
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      priority: formData.get("priority") as "low" | "medium" | "high",
      completed: false
    }

    if (editingReminder) {
      setReminders(reminders.map(r => r.id === editingReminder.id ? { ...newReminder, id: editingReminder.id } : r))
      setEditingReminder(null)
    } else {
      setReminders([...reminders, newReminder])
    }

    setShowReminderDialog(false)
    e.currentTarget.reset()
  }

  const handleAddNote = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const now = new Date().toISOString().split("T")[0]
    const newNote: Note = {
      id: Date.now().toString(),
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      createdAt: editingNote?.createdAt || now,
      updatedAt: now
    }

    if (editingNote) {
      setNotes(notes.map(n => n.id === editingNote.id ? { ...newNote, id: editingNote.id } : n))
      setEditingNote(null)
    } else {
      setNotes([...notes, newNote])
    }

    setShowNoteDialog(false)
    e.currentTarget.reset()
  }

  const toggleReminderComplete = (id: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r))
  }

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id))
  }

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "low": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <MainLayout
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Calendar" }
      ]}
    >
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold font-display">Calendar &amp; Reminders</h1>
          <p className="text-muted-foreground">
            Manage your reminders and notes
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
        {/* Reminders Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-accent" />
              <h2 className="text-2xl font-bold">Reminders</h2>
            </div>
            <Dialog open={showReminderDialog} onOpenChange={setShowReminderDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingReminder(null)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Reminder
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingReminder ? "Edit Reminder" : "Add New Reminder"}</DialogTitle>
                  <DialogDescription>
                    Set up a reminder for important tasks
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
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      defaultValue={editingReminder?.description}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        defaultValue={editingReminder?.date}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        name="time"
                        type="time"
                        defaultValue={editingReminder?.time}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <select
                      id="priority"
                      name="priority"
                      defaultValue={editingReminder?.priority || "medium"}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      required
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <Button type="submit" className="w-full">
                    {editingReminder ? "Update Reminder" : "Create Reminder"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            {reminders.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No reminders yet. Add your first reminder to get started.
                </CardContent>
              </Card>
            ) : (
              reminders.map((reminder) => (
                <Card key={reminder.id} className={reminder.completed ? "opacity-60" : ""}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <button
                          onClick={() => toggleReminderComplete(reminder.id)}
                          className={`mt-1 h-5 w-5 rounded border-2 flex items-center justify-center ${
                            reminder.completed ? "bg-accent border-accent" : "border-muted-foreground"
                          }`}
                        >
                          {reminder.completed && <Check className="h-3 w-3 text-white" />}
                        </button>
                        <div className="flex-1">
                          <CardTitle className={`text-lg ${reminder.completed ? "line-through" : ""}`}>
                            {reminder.title}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {reminder.description}
                          </CardDescription>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              <CalendarIcon className="mr-1 h-3 w-3" />
                              {reminder.date}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Clock className="mr-1 h-3 w-3" />
                              {reminder.time}
                            </Badge>
                            <Badge className={getPriorityColor(reminder.priority)}>
                              {reminder.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingReminder(reminder)
                            setShowReminderDialog(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteReminder(reminder.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Notes Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StickyNote className="h-5 w-5 text-accent" />
              <h2 className="text-2xl font-bold">Notes</h2>
            </div>
            <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingNote(null)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Note
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingNote ? "Edit Note" : "Add New Note"}</DialogTitle>
                  <DialogDescription>
                    Create a note to remember important information
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddNote} className="space-y-4">
                  <div>
                    <Label htmlFor="note-title">Title</Label>
                    <Input
                      id="note-title"
                      name="title"
                      defaultValue={editingNote?.title}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      name="content"
                      rows={6}
                      defaultValue={editingNote?.content}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {editingNote ? "Update Note" : "Create Note"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            {notes.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No notes yet. Add your first note to get started.
                </CardContent>
              </Card>
            ) : (
              notes.map((note) => (
                <Card key={note.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{note.title}</CardTitle>
                        <CardDescription className="mt-2 whitespace-pre-wrap">
                          {note.content}
                        </CardDescription>
                        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                          <span>Updated: {note.updatedAt}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingNote(note)
                            setShowNoteDialog(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNote(note.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>
        </div>
        </div>
      </div>
    </MainLayout>
  )
}
