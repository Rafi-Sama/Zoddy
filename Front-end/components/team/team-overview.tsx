'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  CheckCircle2,
  Clock,
  TrendingUp,
  Target,
  Award
} from 'lucide-react'
import type { TeamStats, TeamMember, TeamTask } from '@/types/team'

interface TeamOverviewProps {
  stats: TeamStats | null
  members: TeamMember[]
  tasks: TeamTask[]
  loading: boolean
}

export function TeamOverview({ stats, members, tasks, loading }: TeamOverviewProps) {
  if (loading) {
    return (
      <div className="grid gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-20 bg-gray-200 dark:bg-gray-800" />
            <CardContent className="h-32 bg-gray-100 dark:bg-gray-900" />
          </Card>
        ))}
      </div>
    )
  }

  const recentTasks = tasks.slice(0, 5)
  const activeMembers = members.filter(m => m.status === 'active')

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalMembers || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.activeMembers || 0} active now
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Progress</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.completedTasks || 0}/{stats?.totalTasks || 0}
            </div>
            <Progress
              value={(stats?.completedTasks || 0) / (stats?.totalTasks || 1) * 100}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Completion</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.averageCompletionTime || 0} days</div>
            <p className="text-xs text-muted-foreground">
              Per task average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productivity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.productivityScore || 0}%</div>
            <Progress
              value={stats?.productivityScore || 0}
              className="mt-2"
              indicatorClassName="bg-gradient-to-r from-green-500 to-emerald-500"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Team Members */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Active Team Members
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeMembers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active members</p>
            ) : (
              activeMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm text-muted-foreground">Active</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Recent Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent tasks</p>
            ) : (
              recentTasks.map((task) => (
                <div key={task.id} className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">{task.title}</p>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            task.priority === 'urgent' ? 'destructive' :
                            task.priority === 'high' ? 'default' :
                            'secondary'
                          }
                          className="text-xs"
                        >
                          {task.priority}
                        </Badge>
                        <Badge
                          variant={
                            task.status === 'completed' ? 'default' :
                            task.status === 'in_progress' ? 'secondary' :
                            'outline'
                          }
                          className="text-xs"
                        >
                          {task.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    {task.status === 'completed' && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                    {task.status === 'in_progress' && (
                      <Clock className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Team Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tasks On Track</span>
                <span className="text-2xl font-bold text-green-600">
                  {stats?.tasksInProgress || 0}
                </span>
              </div>
              <Progress value={70} className="h-2" indicatorClassName="bg-green-500" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overdue Tasks</span>
                <span className="text-2xl font-bold text-red-600">
                  {stats?.overdueTasks || 0}
                </span>
              </div>
              <Progress value={20} className="h-2" indicatorClassName="bg-red-500" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Completion Rate</span>
                <span className="text-2xl font-bold text-blue-600">
                  {Math.round((stats?.completedTasks || 0) / (stats?.totalTasks || 1) * 100)}%
                </span>
              </div>
              <Progress
                value={(stats?.completedTasks || 0) / (stats?.totalTasks || 1) * 100}
                className="h-2"
                indicatorClassName="bg-blue-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}