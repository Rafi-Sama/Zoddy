"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Edit,
  Trash2,
  Check,
  Clock,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Search,
  Pin,
  X,
  StickyNote,
  Sparkles,
  Copy,
} from "lucide-react";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCalendar, type Reminder } from "@/contexts/calendar-context";
import { cn } from "@/lib/utils";
import { ReminderModal, type ReminderFormData } from "@/components/calendar/reminder-modal";

export default function CalendarPage() {
  const {
    addReminder,
    updateReminder,
    deleteReminder,
    toggleCompleted,
    getRemindersByDate,
  } = useCalendar();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

  // Notes tab state
  const [searchQuery, setSearchQuery] = useState("");
  const [pinnedNotes, setPinnedNotes] = useState<Set<string>>(new Set());
  const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [isEditingNote, setIsEditingNote] = useState(false);

  // Calendar logic
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(clickedDate);
  };

  const getDayReminders = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return getRemindersByDate(dateStr).filter((r) => r.type !== "note");
  };

  const getSelectedDateReminders = () => {
    const dateStr = selectedDate.toISOString().split("T")[0];
    return getRemindersByDate(dateStr).filter((r) => r.type !== "note");
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    return (
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  const handleSubmitReminder = (reminderData: ReminderFormData) => {
    if (editingReminder) {
      updateReminder(editingReminder.id, reminderData);
      setEditingReminder(null);
    } else {
      addReminder(reminderData);
    }

    setShowReminderDialog(false);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "reminder":
        return "bg-blue-100 text-blue-800";
      case "event":
        return "bg-purple-100 text-purple-800";
      case "note":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Notes filtering and sorting
  const { reminders } = useCalendar();
  const allNotes = useMemo(() => {
    return reminders.filter((r) => r.type === "note");
  }, [reminders]);

  const filteredNotes = useMemo(() => {
    let notes = allNotes;

    // Filter by search query
    if (searchQuery) {
      notes = notes.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort: pinned first, then by date (newest first)
    return notes.sort((a, b) => {
      const aIsPinned = pinnedNotes.has(a.id);
      const bIsPinned = pinnedNotes.has(b.id);

      if (aIsPinned && !bIsPinned) return -1;
      if (!aIsPinned && bIsPinned) return 1;

      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [allNotes, searchQuery, pinnedNotes]);

  // Note handlers
  const handleCreateNewNote = () => {
    setSelectedNoteId(null);
    setNoteTitle("");
    setNoteContent("");
    setIsEditingNote(true);
  };

  const handleSelectNote = (note: Reminder) => {
    setSelectedNoteId(note.id);
    setNoteTitle(note.title);
    setNoteContent(note.description || "");
    setIsEditingNote(false);
  };

  const handleAutoSave = () => {
    if (!noteTitle.trim()) return;

    if (selectedNoteId) {
      // Update existing note
      updateReminder(selectedNoteId, {
        title: noteTitle,
        description: noteContent,
      });
    } else {
      // Create new note
      const newNote = {
        title: noteTitle,
        description: noteContent,
        date: new Date().toISOString().split("T")[0],
        time: "",
        type: "note" as const,
      };
      addReminder(newNote);
      // Set the newly created note as selected
      const newId = Date.now().toString();
      setSelectedNoteId(newId);
    }
    setIsEditingNote(false);
  };

  const handleDeleteCurrentNote = () => {
    if (selectedNoteId) {
      deleteReminder(selectedNoteId);
      setSelectedNoteId(null);
      setNoteTitle("");
      setNoteContent("");
    }
  };


  const togglePinNote = (id: string) => {
    setPinnedNotes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const copyNoteContent = async (note: Reminder) => {
    const content = note.description
      ? `${note.title}\n\n${note.description}`
      : note.title;
    try {
      await navigator.clipboard.writeText(content);
      setCopiedNoteId(note.id);
      setTimeout(() => setCopiedNoteId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <MainLayout breadcrumbs={[{ label: "Calendar" }]}>
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="list">Notes</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-3">
          <div className="grid gap-3 lg:grid-cols-3">
            {/* Full Calendar */}
            <Card className="lg:col-span-2">
              <CardHeader className="py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" />
                    {monthNames[currentDate.getMonth()]}{" "}
                    {currentDate.getFullYear()}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      onClick={prevMonth}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-3 text-sm"
                      onClick={goToToday}
                    >
                      Today
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      onClick={nextMonth}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="py-4">
                {/* Days of week */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {dayNames.map((day) => (
                    <div
                      key={day}
                      className="text-sm font-medium text-muted-foreground text-center py-1"
                    >
                      {day.substring(0, 3)}
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-28 w-full"></div>
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dayReminders = getDayReminders(day);

                    return (
                      <Button
                        key={day}
                        variant="ghost"
                        className={cn(
                          "h-28 w-full p-2 flex items-center justify-center relative text-lg",
                          isToday(day) && "bg-accent font-bold",
                          isSelected(day) && "ring-2 ring-primary",
                          "hover:bg-accent/50"
                        )}
                        onClick={() => handleDateClick(day)}
                      >
                        <span className={cn(isToday(day) && "font-bold")}>
                          {day}
                        </span>
                        {dayReminders.length > 0 && (
                          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                            {dayReminders.slice(0, 3).map((_, idx) => (
                              <div
                                key={idx}
                                className="h-1.5 w-1.5 rounded-full bg-primary"
                              />
                            ))}
                          </div>
                        )}
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Selected Date Details */}
            <Card>
              <CardHeader className="py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </CardTitle>
                  <Button
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      setEditingReminder(null);
                      setShowReminderDialog(true);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 py-4">
                {getSelectedDateReminders().length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No reminders
                  </p>
                ) : (
                  getSelectedDateReminders().map((reminder) => (
                    <div
                      key={reminder.id}
                      className={cn(
                        "p-2.5 border rounded-lg space-y-1",
                        reminder.completed && "opacity-60"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          <button
                            onClick={() => toggleCompleted(reminder.id)}
                            className={cn(
                              "mt-0.5 h-4 w-4 rounded border-2 flex items-center justify-center shrink-0",
                              reminder.completed
                                ? "bg-primary border-primary"
                                : "border-muted-foreground"
                            )}
                          >
                            {reminder.completed && (
                              <Check className="h-2.5 w-2.5 text-white" />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p
                              className={cn(
                                "text-sm font-medium line-clamp-2",
                                reminder.completed && "line-through"
                              )}
                            >
                              {reminder.title}
                            </p>
                            {reminder.description && (
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                {reminder.description}
                              </p>
                            )}
                            <div className="flex items-center gap-1 mt-1">
                              {reminder.time && (
                                <Badge
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0 h-4"
                                >
                                  <Clock className="h-2.5 w-2.5 mr-0.5" />
                                  {reminder.time}
                                </Badge>
                              )}
                              <Badge
                                className={cn(
                                  "text-[10px] px-1.5 py-0 h-4",
                                  getTypeColor(reminder.type)
                                )}
                              >
                                {reminder.type}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-0.5 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => {
                              setEditingReminder(reminder);
                              setShowReminderDialog(true);
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

        <TabsContent value="list" className="space-y-0">
          <div className="grid grid-cols-5 gap-3 h-[calc(100vh-12rem)]">
            {/* Left Panel - Notes List */}
            <Card className="col-span-2 flex flex-col overflow-hidden">
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between mb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <StickyNote className="h-4 w-4" />
                    Notes
                  </CardTitle>
                </div>

                {/* Search Bar with New Button */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                    <Input
                      placeholder="Search notes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-8 h-8 text-xs"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2"
                        aria-label="Clear search"
                      >
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </button>
                    )}
                  </div>
                  <Button
                    size="sm"
                    onClick={handleCreateNewNote}
                    className="h-8 px-3 shrink-0"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    New
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto p-2 space-y-1">
                {filteredNotes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4">
                    <StickyNote className="h-12 w-12 text-muted-foreground/30 mb-2" />
                    <p className="text-sm font-medium text-muted-foreground">
                      {searchQuery ? "No notes found" : "No notes yet"}
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      {searchQuery ? "Try a different search" : "Create your first note"}
                    </p>
                  </div>
                ) : (
                  filteredNotes.map((note) => {
                    const isPinned = pinnedNotes.has(note.id);
                    const isSelected = selectedNoteId === note.id;
                    const noteDate = new Date(note.date);
                    const isToday = noteDate.toDateString() === new Date().toDateString();

                    return (
                      <button
                        key={note.id}
                        onClick={() => handleSelectNote(note)}
                        className={cn(
                          "w-full text-left p-2.5 rounded-lg border transition-all hover:bg-accent/50",
                          isSelected && "bg-primary/10 border-primary/40 shadow-sm",
                          !isSelected && "hover:border-primary/20"
                        )}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="text-sm font-semibold line-clamp-1 flex-1">
                            {note.title}
                          </h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePinNote(note.id);
                            }}
                            className="shrink-0"
                          >
                            <Pin
                              className={cn(
                                "h-3 w-3 transition-all",
                                isPinned
                                  ? "text-primary fill-current"
                                  : "text-muted-foreground/40 hover:text-primary"
                              )}
                            />
                          </button>
                        </div>
                        {note.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-1.5">
                            {note.description}
                          </p>
                        )}
                        <p className="text-[10px] text-muted-foreground">
                          {isToday ? "Today" : noteDate.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </button>
                    );
                  })
                )}
              </CardContent>
            </Card>

            {/* Right Panel - Note Editor */}
            <Card className="col-span-3 flex flex-col overflow-hidden">
              {selectedNoteId || isEditingNote ? (
                <>
                  <CardHeader className="pb-3 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <StickyNote className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {isEditingNote ? "Auto-saving..." : "Saved"}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {selectedNoteId && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyNoteContent({ id: selectedNoteId, title: noteTitle, description: noteContent, date: "", time: "", type: "note" })}
                              className="h-8 px-2"
                            >
                              {copiedNoteId === selectedNoteId ? (
                                <Check className="h-3.5 w-3.5 text-green-600" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleDeleteCurrentNote}
                              className="h-8 px-2 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col p-4 overflow-hidden">
                    {/* Title Input */}
                    <Input
                      placeholder="Title"
                      value={noteTitle}
                      onChange={(e) => {
                        setNoteTitle(e.target.value);
                        setIsEditingNote(true);
                      }}
                      onBlur={handleAutoSave}
                      className="text-xl font-semibold border-0 border-b rounded-none px-0 focus-visible:ring-0 mb-3"
                    />

                    {/* Content Textarea */}
                    <Textarea
                      placeholder="Start typing your note..."
                      value={noteContent}
                      onChange={(e) => {
                        setNoteContent(e.target.value);
                        setIsEditingNote(true);
                      }}
                      onBlur={handleAutoSave}
                      className="flex-1 resize-none border-0 focus-visible:ring-0 text-sm leading-relaxed px-0"
                    />

                    {/* Character count */}
                    <div className="flex items-center justify-between pt-2 border-t text-[10px] text-muted-foreground">
                      <span>
                        {noteTitle.length > 0 || noteContent.length > 0
                          ? `${noteTitle.length + noteContent.length} characters`
                          : ""}
                      </span>
                      <span className="flex items-center gap-1">
                        Changes saved automatically
                      </span>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="relative inline-block mb-4">
                      <StickyNote className="h-20 w-20 text-muted-foreground/20" />
                      <Sparkles className="h-6 w-6 text-primary/40 absolute -top-2 -right-2" />
                    </div>
                    <p className="text-base font-medium text-muted-foreground mb-2">
                      Select a note to view
                    </p>
                    <p className="text-sm text-muted-foreground/70 mb-4">
                      Choose a note from the list or create a new one
                    </p>
                    <Button onClick={handleCreateNewNote} size="sm">
                      <Plus className="h-4 w-4 mr-1.5" />
                      Create New Note
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Reminder Modal */}
      <ReminderModal
        open={showReminderDialog}
        onOpenChange={setShowReminderDialog}
        selectedDate={selectedDate}
        editingReminder={editingReminder}
        onSubmit={handleSubmitReminder}
      />
    </MainLayout>
  );
}
