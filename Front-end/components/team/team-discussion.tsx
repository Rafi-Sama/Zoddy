'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Send,
  Paperclip,
  Smile,
  Reply,
  Edit2,
  Trash2,
  Hash,
  Megaphone,
  MessageSquare,
  Search,
  Bell,
  Users,
  FileText,
  Download
} from 'lucide-react'
import { format, isToday, isYesterday } from 'date-fns'
import type { TeamMessage, TeamMember } from '@/types/team'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface TeamDiscussionProps {
  messages: TeamMessage[]
  members: TeamMember[]
  onMessagesUpdate: (messages: TeamMessage[]) => void
  loading: boolean
}

export function TeamDiscussion({ messages, members, onMessagesUpdate, loading }: TeamDiscussionProps) {
  const [newMessage, setNewMessage] = useState('')
  const [selectedChannel, setSelectedChannel] = useState('general')
  const [editingMessage, setEditingMessage] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [replyingTo, setReplyingTo] = useState<TeamMessage | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const channels = [
    { id: 'general', name: 'General', icon: Hash, unread: 0 },
    { id: 'announcements', name: 'Announcements', icon: Megaphone, unread: 2 },
    { id: 'tasks', name: 'Task Updates', icon: MessageSquare, unread: 5 }
  ]

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: TeamMessage = {
      id: Date.now().toString(),
      authorId: 'current-user',
      authorName: 'You',
      content: newMessage,
      type: selectedChannel === 'announcements' ? 'announcement' : 'message',
      createdAt: new Date().toISOString(),
      readBy: ['current-user'],
      reactions: []
    }

    if (replyingTo) {
      message.threadId = replyingTo.id
    }

    onMessagesUpdate([...messages, message])
    setNewMessage('')
    setReplyingTo(null)

    toast({
      title: 'Message sent',
      description: 'Your message has been sent to the team'
    })
  }

  const handleEditMessage = (messageId: string) => {
    const updatedMessages = messages.map(m =>
      m.id === messageId
        ? { ...m, content: editContent, editedAt: new Date().toISOString() }
        : m
    )
    onMessagesUpdate(updatedMessages)
    setEditingMessage(null)
    setEditContent('')
  }

  const handleDeleteMessage = (messageId: string) => {
    onMessagesUpdate(messages.filter(m => m.id !== messageId))
    toast({
      title: 'Message deleted',
      description: 'Message has been removed from the discussion'
    })
  }

  const handleReaction = (messageId: string, emoji: string) => {
    const updatedMessages = messages.map(m => {
      if (m.id === messageId) {
        const reactions = m.reactions || []
        const existingReaction = reactions.find(r => r.emoji === emoji)

        if (existingReaction) {
          if (existingReaction.users.includes('current-user')) {
            existingReaction.users = existingReaction.users.filter(u => u !== 'current-user')
            if (existingReaction.users.length === 0) {
              return {
                ...m,
                reactions: reactions.filter(r => r.emoji !== emoji)
              }
            }
          } else {
            existingReaction.users.push('current-user')
          }
        } else {
          reactions.push({ emoji, users: ['current-user'] })
        }
        return { ...m, reactions }
      }
      return m
    })
    onMessagesUpdate(updatedMessages)
  }

  const formatMessageTime = (date: string) => {
    const messageDate = new Date(date)
    if (isToday(messageDate)) {
      return format(messageDate, 'HH:mm')
    } else if (isYesterday(messageDate)) {
      return `Yesterday ${format(messageDate, 'HH:mm')}`
    } else {
      return format(messageDate, 'MMM dd, HH:mm')
    }
  }

  const groupMessagesByDate = (messages: TeamMessage[]) => {
    const groups: { [key: string]: TeamMessage[] } = {}

    messages.forEach(message => {
      const date = format(new Date(message.createdAt), 'yyyy-MM-dd')
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
    })

    return groups
  }

  const getDateLabel = (dateStr: string) => {
    const date = new Date(dateStr)
    if (isToday(date)) return 'Today'
    if (isYesterday(date)) return 'Yesterday'
    return format(date, 'MMMM dd, yyyy')
  }

  const filteredMessages = messages.filter(m =>
    !searchQuery || m.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const groupedMessages = groupMessagesByDate(filteredMessages)

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader className="h-20 bg-gray-200 dark:bg-gray-800" />
        <CardContent className="h-96 bg-gray-100 dark:bg-gray-900" />
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-4 gap-6">
      {/* Channels Sidebar */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-base">Channels</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="space-y-1">
            {channels.map((channel) => (
              <Button
                key={channel.id}
                variant={selectedChannel === channel.id ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setSelectedChannel(channel.id)}
              >
                <channel.icon className="h-4 w-4 mr-2" />
                <span className="flex-1 text-left">{channel.name}</span>
                {channel.unread > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {channel.unread}
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground px-2">Direct Messages</p>
            {members.filter(m => m.status === 'active').map((member) => (
              <Button
                key={member.id}
                variant="ghost"
                className="w-full justify-start"
              >
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback className="text-xs">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="flex-1 text-left truncate">{member.name}</span>
                <span className="flex h-2 w-2 rounded-full bg-green-500" />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Chat Area */}
      <Card className="col-span-3">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              <CardTitle>
                {channels.find(c => c.id === selectedChannel)?.name || 'General'}
              </CardTitle>
              <Badge variant="outline" className="ml-2">
                {members.length} members
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  className="pl-9 w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Users className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 flex flex-col h-[600px]">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {Object.entries(groupedMessages).map(([date, dayMessages]) => (
                <div key={date}>
                  <div className="flex items-center gap-2 my-4">
                    <Separator className="flex-1" />
                    <span className="text-xs text-muted-foreground font-medium">
                      {getDateLabel(date)}
                    </span>
                    <Separator className="flex-1" />
                  </div>

                  {dayMessages.map((message) => {
                    const author = members.find(m => m.id === message.authorId)
                    const isCurrentUser = message.authorId === 'current-user'

                    return (
                      <div
                        key={message.id}
                        className={cn(
                          'group flex gap-3 hover:bg-accent/50 rounded-lg p-2 -mx-2',
                          editingMessage === message.id && 'bg-accent'
                        )}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={author?.avatar || message.authorAvatar} />
                          <AvatarFallback>
                            {message.authorName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{message.authorName}</span>
                            {message.type === 'announcement' && (
                              <Badge variant="destructive" className="text-xs">
                                Announcement
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {formatMessageTime(message.createdAt)}
                            </span>
                            {message.editedAt && (
                              <span className="text-xs text-muted-foreground">(edited)</span>
                            )}
                          </div>

                          {editingMessage === message.id ? (
                            <div className="flex gap-2">
                              <Input
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleEditMessage(message.id)
                                  }
                                }}
                              />
                              <Button
                                size="sm"
                                onClick={() => handleEditMessage(message.id)}
                              >
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingMessage(null)
                                  setEditContent('')
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <>
                              <p className="text-sm">{message.content}</p>

                              {message.attachments && message.attachments.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {message.attachments.map((attachment) => (
                                    <div
                                      key={attachment.id}
                                      className="flex items-center gap-2 p-2 border rounded-lg"
                                    >
                                      <FileText className="h-4 w-4" />
                                      <span className="text-sm">{attachment.name}</span>
                                      <Button variant="ghost" size="icon" className="h-6 w-6">
                                        <Download className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {message.reactions && message.reactions.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {message.reactions.map((reaction) => (
                                    <Button
                                      key={reaction.emoji}
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 px-2"
                                      onClick={() => handleReaction(message.id, reaction.emoji)}
                                    >
                                      <span className="mr-1">{reaction.emoji}</span>
                                      <span className="text-xs">{reaction.users.length}</span>
                                    </Button>
                                  ))}
                                </div>
                              )}
                            </>
                          )}

                          {/* Message Actions */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleReaction(message.id, '👍')}
                            >
                              <span className="text-sm">👍</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => setReplyingTo(message)}
                            >
                              <Reply className="h-3 w-3" />
                            </Button>
                            {isCurrentUser && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => {
                                    setEditingMessage(message.id)
                                    setEditContent(message.content)
                                  }}
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-destructive"
                                  onClick={() => handleDeleteMessage(message.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="border-t p-4">
            {replyingTo && (
              <div className="flex items-center justify-between mb-2 p-2 bg-accent rounded-lg">
                <div className="flex items-center gap-2">
                  <Reply className="h-4 w-4" />
                  <span className="text-sm">
                    Replying to <strong>{replyingTo.authorName}</strong>
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setReplyingTo(null)}
                >
                  ×
                </Button>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                placeholder={`Message #${channels.find(c => c.id === selectedChannel)?.name || 'general'}`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                className="flex-1"
              />
              <Button variant="ghost" size="icon">
                <Smile className="h-4 w-4" />
              </Button>
              <Button onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}