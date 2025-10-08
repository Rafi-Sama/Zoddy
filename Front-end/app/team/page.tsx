'use client'

import { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { TeamOverview } from '@/components/team/team-overview'
import { TeamMembers } from '@/components/team/team-members'
import { TeamTasks } from '@/components/team/team-tasks'
import { TeamDiscussion } from '@/components/team/team-discussion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, MessageSquare, CheckSquare, Activity } from 'lucide-react'
import type { TeamMember, TeamTask, TeamMessage, TeamStats } from '@/types/team'

export default function TeamPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [members, setMembers] = useState<TeamMember[]>([])
  const [tasks, setTasks] = useState<TeamTask[]>([])
  const [messages, setMessages] = useState<TeamMessage[]>([])
  const [stats, setStats] = useState<TeamStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load team data
    loadTeamData()
  }, [])

  const loadTeamData = async () => {
    try {
      // Mock data for now - replace with API calls
      setMembers([
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'owner',
          joinedAt: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          status: 'active',
          permissions: {
            canManageTeam: true,
            canAssignTasks: true,
            canViewAnalytics: true,
            canManageInventory: true,
            canManageOrders: true,
            canManageCustomers: true
          }
        }
      ])

      setStats({
        totalMembers: 5,
        activeMembers: 4,
        totalTasks: 24,
        completedTasks: 18,
        overdueTasks: 2,
        tasksInProgress: 4,
        averageCompletionTime: 3.5,
        productivityScore: 85
      })

      setLoading(false)
    } catch (error) {
      console.error('Error loading team data:', error)
      setLoading(false)
    }
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
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Tasks</span>
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
              onMembersUpdate={setMembers}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <TeamTasks
              tasks={tasks}
              members={members}
              onTasksUpdate={setTasks}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="discussion" className="space-y-6">
            <TeamDiscussion
              messages={messages}
              members={members}
              onMessagesUpdate={setMessages}
              loading={loading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}