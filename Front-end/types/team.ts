export interface TeamMember {
  id: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'member'
  avatar?: string
  joinedAt: string
  lastActive: string
  status: 'active' | 'invited' | 'inactive'
  permissions: TeamPermissions
}

export interface TeamPermissions {
  canManageTeam: boolean
  canAssignTasks: boolean
  canViewAnalytics: boolean
  canManageInventory: boolean
  canManageOrders: boolean
  canManageCustomers: boolean
}

export interface TeamTask {
  id: string
  title: string
  description: string
  assignedTo: string[]
  createdBy: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in_progress' | 'review' | 'completed' | 'cancelled'
  dueDate?: string
  completedAt?: string
  tags: string[]
  attachments?: TaskAttachment[]
  comments: TaskComment[]
  createdAt: string
  updatedAt: string
}

export interface TaskAttachment {
  id: string
  name: string
  url: string
  type: string
  size: number
  uploadedBy: string
  uploadedAt: string
}

export interface TaskComment {
  id: string
  taskId: string
  authorId: string
  authorName: string
  authorAvatar?: string
  content: string
  createdAt: string
  editedAt?: string
  mentions?: string[]
}

export interface TeamMessage {
  id: string
  authorId: string
  authorName: string
  authorAvatar?: string
  content: string
  type: 'message' | 'announcement' | 'task_update' | 'system'
  attachments?: MessageAttachment[]
  reactions?: MessageReaction[]
  threadId?: string
  createdAt: string
  editedAt?: string
  readBy: string[]
}

export interface MessageAttachment {
  id: string
  name: string
  url: string
  type: string
  size: number
}

export interface MessageReaction {
  emoji: string
  users: string[]
}

export interface TeamInvitation {
  id: string
  email: string
  role: 'admin' | 'member'
  invitedBy: string
  invitedAt: string
  expiresAt: string
  status: 'pending' | 'accepted' | 'expired' | 'cancelled'
  permissions: TeamPermissions
}

export interface TeamActivity {
  id: string
  type: 'task_created' | 'task_completed' | 'member_joined' | 'member_left' | 'permission_changed'
  actorId: string
  actorName: string
  targetId?: string
  targetName?: string
  description: string
  timestamp: string
  metadata?: Record<string, unknown>
}

export interface TeamStats {
  totalMembers: number
  activeMembers: number
  totalTasks: number
  completedTasks: number
  overdueTasks: number
  tasksInProgress: number
  averageCompletionTime: number
  productivityScore: number
}