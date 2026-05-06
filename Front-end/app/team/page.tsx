'use client'

import { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { MainLayout } from '@/components/layout/main-layout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, MessageSquare, CheckSquare, Activity, Loader2, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useData } from '@/hooks/use-database-optimized'
import { useOrganization } from '@/contexts/organization-context'
import type { TeamMember, TeamTask, TeamMessage, TeamStats } from '@/types/team'
import type { TeamMember as DBTeamMember, User } from '@/types/database'

// Type for team member with user details
interface TeamMemberWithUser extends DBTeamMember {
  profiles?: User
}

// Lazy load heavy team components for better performance
const TeamOverview = dynamic(() => import('@/components/team/team-overview').then(mod => ({ default: mod.TeamOverview })), {
  loading: () => <div className="h-64 flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>
})
const TeamMembers = dynamic(() => import('@/components/team/team-members').then(mod => ({ default: mod.TeamMembers })), {
  ssr: false,
  loading: () => <div className="h-64 flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>
})
const TeamTasks = dynamic(() => import('@/components/team/team-tasks').then(mod => ({ default: mod.TeamTasks })), {
  ssr: false,
  loading: () => <div className="h-64 flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>
})
const TeamDiscussion = dynamic(() => import('@/components/team/team-discussion').then(mod => ({ default: mod.TeamDiscussion })), {
  ssr: false,
  loading: () => <div className="h-64 flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>
})

export default function TeamPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [members, setMembers] = useState<TeamMember[]>([])
  const [tasks, setTasks] = useState<TeamTask[]>([])
  const [messages, setMessages] = useState<TeamMessage[]>([])
  const [stats, setStats] = useState<TeamStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const { isLoading: orgLoading } = useOrganization()
  // REMOVED: Redundant createClient() call that was never used

  // OPTIMIZED: Fetch team members with only necessary user fields
  // NOTE: organization_id filter is redundant - useData automatically filters by org in multi-tenant tables
  const { data: teamMembersData, loading: membersLoading, error: membersError, refetch: refetchMembers } = useData<DBTeamMember[]>({
    table: 'team_members',
    select: '*, profiles!inner(id,email,first_name,last_name,profile_picture_url,phone)',
  })

  // OPTIMIZED: Fetch team tasks
  // NOTE: organization_id filter is redundant - useData automatically filters by org in multi-tenant tables
  const { data: tasksData, loading: tasksLoading, refetch: refetchTasks } = useData<TeamTask[]>({
    table: 'team_tasks',
    orderBy: { column: 'created_at', ascending: false },
  })

  // Removed unused mutation hook that was created but never used

  // Transform team members data with memoization for performance
  const transformedMembers = useMemo(() => {
    if (!teamMembersData) return []

    return (teamMembersData as TeamMemberWithUser[]).map((tm: TeamMemberWithUser) => ({
      id: tm.id,
      name: `${tm.profiles?.first_name || ''} ${tm.profiles?.last_name || ''}`.trim() || tm.profiles?.email || 'Unknown',
      email: tm.profiles?.email || '',
      role: (tm.role === 'sales' || tm.role === 'inventory' || tm.role === 'support' || tm.role === 'viewer' ? 'member' : tm.role) as 'owner' | 'admin' | 'member',
      avatar: tm.profiles?.profile_picture_url,
      joinedAt: tm.joined_at,
      lastActive: tm.joined_at,
      status: tm.status,
      permissions: typeof tm.permissions === 'object' && tm.permissions !== null && !Array.isArray(tm.permissions) ?
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (tm.permissions as any) : {
        canManageTeam: false,
        canAssignTasks: false,
        canViewAnalytics: false,
        canManageInventory: false,
        canManageOrders: false,
        canManageCustomers: false,
      },
    }))
  }, [teamMembersData])

  // Transform tasks data with memoization
  const transformedTasks = useMemo(() => {
    if (!tasksData) return []

    return tasksData.map((task: TeamTask) => ({
      id: task.id,
      title: task.title,
      description: task.description || '',
      assignedTo: task.assignedTo || [],
      createdBy: task.createdBy || '',
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
      completedAt: task.completedAt,
      tags: task.tags || [],
      comments: [],
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }))
  }, [tasksData])

  // Calculate stats with memoization
  const calculatedStats = useMemo(() => {
    const activeMembers = (teamMembersData as TeamMemberWithUser[] || []).filter((tm: TeamMemberWithUser) => tm.status === 'active').length
    const totalTasks = tasksData?.length || 0
    const completedTasks = tasksData?.filter((t: TeamTask) => t.status === 'completed').length || 0
    const overdueTasks = tasksData?.filter((t: TeamTask) => {
      if (t.status === 'completed' || !t.dueDate) return false
      return new Date(t.dueDate) < new Date()
    }).length || 0
    const tasksInProgress = tasksData?.filter((t: TeamTask) => t.status === 'in_progress').length || 0

    return {
      totalMembers: teamMembersData?.length || 0,
      activeMembers,
      totalTasks,
      completedTasks,
      overdueTasks,
      tasksInProgress,
      averageCompletionTime: completedTasks > 0 ? 3.5 : 0,
      productivityScore: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    }
  }, [teamMembersData, tasksData])

  // Update state when data changes
  useEffect(() => {
    setMembers(transformedMembers)
  }, [transformedMembers])

  useEffect(() => {
    setTasks(transformedTasks)
  }, [transformedTasks])

  useEffect(() => {
    setStats(calculatedStats)
  }, [calculatedStats])

  // Update loading state
  useEffect(() => {
    setLoading(membersLoading || tasksLoading)
  }, [membersLoading, tasksLoading])

  // Update error state
  useEffect(() => {
    setError(membersError || null)
  }, [membersError])

  // Handle team member updates
  const handleMembersUpdate = async (updatedMembers: TeamMember[]) => {
    setMembers(updatedMembers)
    await refetchMembers()
  }

  // Handle tasks updates
  const handleTasksUpdate = async (updatedTasks: TeamTask[]) => {
    setTasks(updatedTasks)
    await refetchTasks()
  }

  // Handle messages updates
  const handleMessagesUpdate = (updatedMessages: TeamMessage[]) => {
    setMessages(updatedMessages)
  }

  if (orgLoading || (loading && !error)) {
    return (
      <MainLayout>
        <div className="container mx-auto p-6 max-w-7xl">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </MainLayout>
    )
  }

  if (membersError || error) {
    return (
      <MainLayout>
        <div className="container mx-auto p-6 max-w-7xl">
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <div>
                  <p className="font-semibold">Failed to load team data</p>
                  <p className="text-sm">{(membersError || error)?.message || 'Please try again later'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Team Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your team, assign tasks, and collaborate efficiently
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Members</span>
              <span className="ml-1 text-xs">({stats?.totalMembers || 0})</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Tasks</span>
              <span className="ml-1 text-xs">({stats?.totalTasks || 0})</span>
            </TabsTrigger>
            <TabsTrigger value="discussion" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Discussion</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <TeamOverview
              stats={stats}
              members={members}
              tasks={tasks}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="members" className="space-y-6">
            <TeamMembers
              members={members}
              onMembersUpdate={handleMembersUpdate}
              loading={membersLoading}
            />
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <TeamTasks
              tasks={tasks}
              members={members}
              onTasksUpdate={handleTasksUpdate}
              loading={tasksLoading}
            />
          </TabsContent>

          <TabsContent value="discussion" className="space-y-6">
            <TeamDiscussion
              messages={messages}
              members={members}
              onMessagesUpdate={handleMessagesUpdate}
              loading={loading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
