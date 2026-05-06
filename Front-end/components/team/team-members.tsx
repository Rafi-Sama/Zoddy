'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import {
  UserPlus,
  MoreVertical,
  Shield,
  Mail,
  Clock,
  UserX,
  Send,
  Copy
} from 'lucide-react'
import type { TeamMember, TeamInvitation, TeamPermissions } from '@/types/team'
import { useToast } from '@/hooks/use-toast'

interface TeamMembersProps {
  members: TeamMember[]
  onMembersUpdate: (members: TeamMember[]) => void
  loading: boolean
}

export function TeamMembers({ members, onMembersUpdate, loading }: TeamMembersProps) {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'admin' | 'member'>('member')
  const [invitations, setInvitations] = useState<TeamInvitation[]>([])
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false)
  const [editingPermissions, setEditingPermissions] = useState<TeamPermissions | null>(null)
  const { toast } = useToast()

  const handleInviteMember = async () => {
    try {
      // API call to invite member
      const newInvitation: TeamInvitation = {
        id: Date.now().toString(),
        email: inviteEmail,
        role: inviteRole,
        invitedBy: 'current-user',
        invitedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        permissions: {
          canManageTeam: inviteRole === 'admin',
          canAssignTasks: true,
          canViewAnalytics: true,
          canManageInventory: inviteRole === 'admin',
          canManageOrders: true,
          canManageCustomers: true
        }
      }

      setInvitations([...invitations, newInvitation])
      setInviteEmail('')
      setInviteDialogOpen(false)

      toast({
        title: 'Invitation sent',
        description: `Invitation sent to ${inviteEmail}`
      })
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to send invitation',
        variant: 'destructive'
      })
    }
  }

  const handleUpdatePermissions = (memberId: string, permissions: TeamPermissions) => {
    const updatedMembers = members.map(m =>
      m.id === memberId ? { ...m, permissions } : m
    )
    onMembersUpdate(updatedMembers)
    setPermissionsDialogOpen(false)
    toast({
      title: 'Permissions updated',
      description: 'Member permissions have been updated successfully'
    })
  }

  const handleRemoveMember = (memberId: string) => {
    const updatedMembers = members.filter(m => m.id !== memberId)
    onMembersUpdate(updatedMembers)
    toast({
      title: 'Member removed',
      description: 'Team member has been removed'
    })
  }

  const copyInviteLink = (invitationId: string) => {
    navigator.clipboard.writeText(`https://zoddy.app/invite/${invitationId}`)
    toast({
      title: 'Link copied',
      description: 'Invitation link copied to clipboard'
    })
  }

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader className="h-20 bg-gray-200 dark:bg-gray-800" />
        <CardContent className="h-64 bg-gray-100 dark:bg-gray-900" />
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Team Members</CardTitle>
          <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to add a new member to your team
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="colleague@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={inviteRole} onValueChange={(value: 'admin' | 'member') => setInviteRole(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleInviteMember}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Invitation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active" className="space-y-4">
            <TabsList>
              <TabsTrigger value="active">
                Active ({members.filter(m => m.status === 'active').length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({invitations.filter(i => i.status === 'pending').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              {members.filter(m => m.status === 'active').map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{member.name}</p>
                        <Badge variant={member.role === 'owner' ? 'default' : 'secondary'}>
                          {member.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Joined {new Date(member.joinedAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="flex h-2 w-2 rounded-full bg-green-500" />
                          Active now
                        </span>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedMember(member)
                          setEditingPermissions(member.permissions)
                          setPermissionsDialogOpen(true)
                        }}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Manage Permissions
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Message
                      </DropdownMenuItem>
                      {member.role !== 'owner' && (
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          <UserX className="h-4 w-4 mr-2" />
                          Remove from Team
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {invitations.filter(i => i.status === 'pending').map((invitation) => (
                <div key={invitation.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{invitation.email}</p>
                      <Badge variant="outline">Invited</Badge>
                      <Badge variant="secondary">{invitation.role}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Expires {new Date(invitation.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyInviteLink(invitation.id)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setInvitations(invitations.filter(i => i.id !== invitation.id))
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ))}
              {invitations.filter(i => i.status === 'pending').length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No pending invitations
                </p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Permissions Dialog */}
      <Dialog open={permissionsDialogOpen} onOpenChange={setPermissionsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Permissions</DialogTitle>
            <DialogDescription>
              Configure what {selectedMember?.name} can access and manage
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="manage-team">Manage Team</Label>
              <Switch
                id="manage-team"
                checked={editingPermissions?.canManageTeam}
                onCheckedChange={(checked) =>
                  setEditingPermissions(prev => prev ? { ...prev, canManageTeam: checked } : null)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="assign-tasks">Assign Tasks</Label>
              <Switch
                id="assign-tasks"
                checked={editingPermissions?.canAssignTasks}
                onCheckedChange={(checked) =>
                  setEditingPermissions(prev => prev ? { ...prev, canAssignTasks: checked } : null)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="view-analytics">View Analytics</Label>
              <Switch
                id="view-analytics"
                checked={editingPermissions?.canViewAnalytics}
                onCheckedChange={(checked) =>
                  setEditingPermissions(prev => prev ? { ...prev, canViewAnalytics: checked } : null)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="manage-inventory">Manage Inventory</Label>
              <Switch
                id="manage-inventory"
                checked={editingPermissions?.canManageInventory}
                onCheckedChange={(checked) =>
                  setEditingPermissions(prev => prev ? { ...prev, canManageInventory: checked } : null)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="manage-orders">Manage Orders</Label>
              <Switch
                id="manage-orders"
                checked={editingPermissions?.canManageOrders}
                onCheckedChange={(checked) =>
                  setEditingPermissions(prev => prev ? { ...prev, canManageOrders: checked } : null)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="manage-customers">Manage Customers</Label>
              <Switch
                id="manage-customers"
                checked={editingPermissions?.canManageCustomers}
                onCheckedChange={(checked) =>
                  setEditingPermissions(prev => prev ? { ...prev, canManageCustomers: checked } : null)
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPermissionsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedMember && editingPermissions) {
                  handleUpdatePermissions(selectedMember.id, editingPermissions)
                }
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}