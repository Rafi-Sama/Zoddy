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
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold font-display">Calendar &amp; Reminders</h1>
          <p className="text-muted-foreground">
            Manage your reminders and notes
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
        {/* Reminders Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Bell className="h-4 w-4 text-accent" />
              <h2 className="text-sm font-bold">Reminders</h2>
            </div>
            <Dialog open={showReminderDialog} onOpenChange={setShowReminderDialog}>
              <DialogTrigger asChild>
                <Button className="h-8 text-xs px-3" onClick={() => setEditingReminder(null)}>
                  <Plus className="mr-2 h-3.5 w-3.5" />
                  Add Reminder
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-sm">{editingReminder ? "Edit Reminder" : "Add New Reminder"}</DialogTitle>
                  <DialogDescription className="text-xs">
                    Set up a reminder for important tasks
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddReminder} className="space-y-3">
                  <div>
                    <Label htmlFor="title" className="text-xs">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      className="h-8 text-xs"
                      defaultValue={editingReminder?.title}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-xs">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      className="text-xs"
                      defaultValue={editingReminder?.description}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="date" className="text-xs">Date</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        className="h-8 text-xs"
                        defaultValue={editingReminder?.date}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="time" className="text-xs">Time</Label>
                      <Input
                        id="time"
                        name="time"
                        type="time"
                        className="h-8 text-xs"
                        defaultValue={editingReminder?.time}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="priority" className="text-xs">Priority</Label>
                    <select
                      id="priority"
                      name="priority"
                      defaultValue={editingReminder?.priority || "medium"}
                      className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background"
                      required
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <Button type="submit" className="w-full h-8 text-xs px-3">
                    {editingReminder ? "Update Reminder" : "Create Reminder"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-2">
            {reminders.length === 0 ? (
              <Card>
                <CardContent className="pt-4 text-center text-muted-foreground text-xs">
                  No reminders yet. Add your first reminder to get started.
                </CardContent>
              </Card>
            ) : (
              reminders.map((reminder) => (
                <Card key={reminder.id} className={reminder.completed ? "opacity-60" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2 flex-1">
                        <button
                          onClick={() => toggleReminderComplete(reminder.id)}
                          className={`mt-1 h-4 w-4 rounded border-2 flex items-center justify-center ${
                            reminder.completed ? "bg-accent border-accent" : "border-muted-foreground"
                          }`}
                        >
                          {reminder.completed && <Check className="h-2.5 w-2.5 text-white" />}
                        </button>
                        <div className="flex-1">
                          <CardTitle className={`text-sm ${reminder.completed ? "line-through" : ""}`}>
                            {reminder.title}
                          </CardTitle>
                          <CardDescription className="mt-1 text-xs">
                            {reminder.description}
                          </CardDescription>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <Badge variant="outline" className="text-[9px] px-1.5 py-0">
                              <CalendarIcon className="mr-1 h-2.5 w-2.5" />
                              {reminder.date}
                            </Badge>
                            <Badge variant="outline" className="text-[9px] px-1.5 py-0">
                              <Clock className="mr-1 h-2.5 w-2.5" />
                              {reminder.time}
                            </Badge>
                            <Badge className={`${getPriorityColor(reminder.priority)} text-[9px] px-1.5 py-0`}>
                              {reminder.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-[10px] px-2"
                          onClick={() => {
                            setEditingReminder(reminder)
                            setShowReminderDialog(true)
                          }}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-[10px] px-2"
                          onClick={() => deleteReminder(reminder.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
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
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <StickyNote className="h-4 w-4 text-accent" />
              <h2 className="text-sm font-bold">Notes</h2>
            </div>
            <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
              <DialogTrigger asChild>
                <Button className="h-8 text-xs px-3" onClick={() => setEditingNote(null)}>
                  <Plus className="mr-2 h-3.5 w-3.5" />
                  Add Note
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-sm">{editingNote ? "Edit Note" : "Add New Note"}</DialogTitle>
                  <DialogDescription className="text-xs">
                    Create a note to remember important information
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddNote} className="space-y-3">
                  <div>
                    <Label htmlFor="note-title" className="text-xs">Title</Label>
                    <Input
                      id="note-title"
                      name="title"
                      className="h-8 text-xs"
                      defaultValue={editingNote?.title}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="content" className="text-xs">Content</Label>
                    <Textarea
                      id="content"
                      name="content"
                      rows={6}
                      className="text-xs"
                      defaultValue={editingNote?.content}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full h-8 text-xs px-3">
                    {editingNote ? "Update Note" : "Create Note"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-2">
            {notes.length === 0 ? (
              <Card>
                <CardContent className="pt-4 text-center text-muted-foreground text-xs">
                  No notes yet. Add your first note to get started.
                </CardContent>
              </Card>
            ) : (
              notes.map((note) => (
                <Card key={note.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-sm">{note.title}</CardTitle>
                        <CardDescription className="mt-1.5 whitespace-pre-wrap text-xs">
                          {note.content}
                        </CardDescription>
                        <div className="flex items-center gap-1.5 mt-2 text-[10px] text-muted-foreground">
                          <span>Updated: {note.updatedAt}</span>
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-[10px] px-2"
                          onClick={() => {
                            setEditingNote(note)
                            setShowNoteDialog(true)
                          }}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-[10px] px-2"
                          onClick={() => deleteNote(note.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
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
