"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export interface ReminderFormData {
  title: string
  description: string
  date: string
  time: string
  type: 'reminder' | 'note' | 'event'
  completed: boolean
}

export interface Reminder {
  id: string
  title: string
  description?: string
  date: string
  time?: string
  type: 'reminder' | 'note' | 'event'
  completed?: boolean
}

interface ReminderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDate: Date
  editingReminder: Reminder | null
  onSubmit: (data: ReminderFormData) => void
}

export function ReminderModal({
  open,
  onOpenChange,
  selectedDate,
  editingReminder,
  onSubmit
}: ReminderModalProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const reminderData: ReminderFormData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      type: formData.get("type") as "reminder" | "note" | "event",
      completed: false,
    }

    onSubmit(reminderData)
    e.currentTarget.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingReminder ? "Edit Reminder" : "Add Reminder"}
          </DialogTitle>
          <DialogDescription>
            Create a reminder for {selectedDate.toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            value={selectedDate.toISOString().split("T")[0]}
          />
          <Button type="submit" className="w-full">
            {editingReminder ? "Update" : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
