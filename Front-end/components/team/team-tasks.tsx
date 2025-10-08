'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import {
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Flag,
  CheckCircle2,
  Circle,
  AlertCircle,
  MessageSquare,
  Paperclip,
  User,
  Filter
} from 'lucide-react'
import type { TeamTask, TeamMember, TaskComment } from '@/types/team'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface TeamTasksProps {
  tasks: TeamTask[]
  members: TeamMember[]
  onTasksUpdate: (tasks: TeamTask[]) => void
  loading: boolean
}

export function TeamTasks({ tasks, members, onTasksUpdate, loading }: TeamTasksProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<TeamTask | null>(null)
  const [taskDetailsOpen, setTaskDetailsOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const { toast } = useToast()

  // New task form state
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: [] as string[],
    priority: 'medium' as TeamTask['priority'],
    dueDate: undefined as Date | undefined,
    tags: [] as string[]
  })

  const [newComment, setNewComment] = useState('')

  const handleCreateTask = () => {
    const task: TeamTask = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      assignedTo: newTask.assignedTo,
      createdBy: 'current-user',
      priority: newTask.priority,
      status: 'pending',
      dueDate: newTask.dueDate?.toISOString(),
      tags: newTask.tags,
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    onTasksUpdate([...tasks, task])
    setCreateDialogOpen(false)
    setNewTask({
      title: '',
      description: '',
      assignedTo: [],
      priority: 'medium',
      dueDate: undefined,
      tags: []
    })

    toast({
      title: 'Task created',
      description: 'New task has been created and assigned'
    })
  }

  const handleUpdateTaskStatus = (taskId: string, status: TeamTask['status']) => {
    const updatedTasks = tasks.map(t =>
      t.id === taskId
        ? {
            ...t,
            status,
            completedAt: status === 'completed' ? new Date().toISOString() : undefined,
            updatedAt: new Date().toISOString()
          }
        : t
    )
    onTasksUpdate(updatedTasks)

    toast({
      title: 'Task updated',
      description: `Task status changed to ${status.replace('_', ' ')}`
    })
  }

  const handleAddComment = (taskId: string) => {
    if (!newComment.trim()) return

    const comment: TaskComment = {
      id: Date.now().toString(),
      taskId,
      authorId: 'current-user',
      authorName: 'You',
      content: newComment,
      createdAt: new Date().toISOString()
    }

    const updatedTasks = tasks.map(t =>
      t.id === taskId
        ? { ...t, comments: [...t.comments, comment] }
        : t
    )
    onTasksUpdate(updatedTasks)
    setNewComment('')
  }

  const filteredTasks = tasks
    .filter(task => {
      if (filterStatus !== 'all' && task.status !== filterStatus) return false
      if (filterPriority !== 'all' && task.priority !== filterPriority) return false
      return true
    })
    .sort((a, b) => {
      // Sort by due date by default
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })

  const tasksByStatus = {
    pending: filteredTasks.filter(t => t.status === 'pending'),
    in_progress: filteredTasks.filter(t => t.status === 'in_progress'),
    review: filteredTasks.filter(t => t.status === 'review'),
    completed: filteredTasks.filter(t => t.status === 'completed')
  }

  const getPriorityIcon = (priority: TeamTask['priority']) => {
    switch (priority) {
      case 'urgent':
        return <Flag className="h-4 w-4 text-red-500" />
      case 'high':
        return <Flag className="h-4 w-4 text-orange-500" />
      case 'medium':
        return <Flag className="h-4 w-4 text-yellow-500" />
      case 'low':
        return <Flag className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusIcon = (status: TeamTask['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'review':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <Circle className="h-4 w-4 text-gray-400" />
    }
  }

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader className="h-20 bg-gray-200 dark:bg-gray-800" />
        <CardContent className="h-96 bg-gray-100 dark:bg-gray-900" />
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tasks Management</CardTitle>
            <div className="flex items-center gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-[140px]">
                  <Flag className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                    <DialogDescription>
                      Create a new task and assign it to team members
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Task Title</Label>
                      <Input
                        id="title"
                        placeholder="Enter task title"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe the task..."
                        rows={4}
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Priority</Label>
                        <Select
                          value={newTask.priority}
                          onValueChange={(value: TeamTask['priority']) =>
                            setNewTask({ ...newTask, priority: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Due Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                'justify-start text-left font-normal',
                                !newTask.dueDate && 'text-muted-foreground'
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {newTask.dueDate ? format(newTask.dueDate, 'PPP') : 'Select date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={newTask.dueDate}
                              onSelect={(date) => setNewTask({ ...newTask, dueDate: date })}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label>Assign To</Label>
                      <div className="flex flex-wrap gap-2">
                        {members.map((member) => (
                          <Badge
                            key={member.id}
                            variant={newTask.assignedTo.includes(member.id) ? 'default' : 'outline'}
                            className="cursor-pointer"
                            onClick={() => {
                              const isSelected = newTask.assignedTo.includes(member.id)
                              setNewTask({
                                ...newTask,
                                assignedTo: isSelected
                                  ? newTask.assignedTo.filter(id => id !== member.id)
                                  : [...newTask.assignedTo, member.id]
                              })
                            }}
                          >
                            <User className="h-3 w-3 mr-1" />
                            {member.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateTask}>Create Task</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Kanban Board */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
              <div key={status} className="space-y-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-sm capitalize">
                    {status.replace('_', ' ')}
                  </h3>
                  <Badge variant="secondary">{statusTasks.length}</Badge>
                </div>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2">
                    {statusTasks.map((task) => (
                      <Card
                        key={task.id}
                        className="p-3 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => {
                          setSelectedTask(task)
                          setTaskDetailsOpen(true)
                        }}
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <p className="font-medium text-sm line-clamp-2">{task.title}</p>
                            {getPriorityIcon(task.priority)}
                          </div>

                          {task.dueDate && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <CalendarIcon className="h-3 w-3" />
                              {format(new Date(task.dueDate), 'MMM dd')}
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex -space-x-2">
                              {task.assignedTo.slice(0, 3).map((userId) => {
                                const member = members.find(m => m.id === userId)
                                return (
                                  <Avatar key={userId} className="h-6 w-6 border-2 border-background">
                                    <AvatarImage src={member?.avatar} />
                                    <AvatarFallback className="text-xs">
                                      {member?.name.split(' ').map(n => n[0]).join('') || '?'}
                                    </AvatarFallback>
                                  </Avatar>
                                )
                              })}
                              {task.assignedTo.length > 3 && (
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs">
                                  +{task.assignedTo.length - 3}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              {task.comments.length > 0 && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <MessageSquare className="h-3 w-3" />
                                  {task.comments.length}
                                </div>
                              )}
                              {task.attachments && task.attachments.length > 0 && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Paperclip className="h-3 w-3" />
                                  {task.attachments.length}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Task Details Dialog */}
      <Dialog open={taskDetailsOpen} onOpenChange={setTaskDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedTask && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <DialogTitle className="text-xl">{selectedTask.title}</DialogTitle>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedTask.status)}
                      <Badge variant="outline">{selectedTask.status.replace('_', ' ')}</Badge>
                      {getPriorityIcon(selectedTask.priority)}
                      <Badge
                        variant={
                          selectedTask.priority === 'urgent' ? 'destructive' :
                          selectedTask.priority === 'high' ? 'default' :
                          'secondary'
                        }
                      >
                        {selectedTask.priority}
                      </Badge>
                    </div>
                  </div>
                  <Select
                    value={selectedTask.status}
                    onValueChange={(value: TeamTask['status']) =>
                      handleUpdateTaskStatus(selectedTask.id, value)
                    }
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedTask.description || 'No description provided'}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Assigned To</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTask.assignedTo.map((userId) => {
                      const member = members.find(m => m.id === userId)
                      return (
                        <div key={userId} className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member?.avatar} />
                            <AvatarFallback>
                              {member?.name.split(' ').map(n => n[0]).join('') || '?'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{member?.name || 'Unknown'}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {selectedTask.dueDate && (
                  <div>
                    <h4 className="font-medium mb-2">Due Date</h4>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(selectedTask.dueDate), 'PPP')}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-2">Comments</h4>
                  <div className="space-y-2 mb-4 max-h-[200px] overflow-y-auto">
                    {selectedTask.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.authorAvatar} />
                          <AvatarFallback>
                            {comment.authorName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{comment.authorName}</span>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(comment.createdAt), 'MMM dd, HH:mm')}
                            </span>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddComment(selectedTask.id)
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={() => handleAddComment(selectedTask.id)}
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}