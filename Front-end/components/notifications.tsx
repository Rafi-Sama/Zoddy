"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, Check, X, Archive as ArchiveIcon, ShoppingCart, DollarSign, AlertTriangle, Clock, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNotifications } from "@/contexts/notifications-context"
import Link from "next/link"

export function Notifications() {
  const {
    getActiveNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    archiveNotification,
    getUnreadCount
  } = useNotifications()

  const activeNotifications = getActiveNotifications()
  const unreadCount = getUnreadCount()

  const getNotificationColor = (type: string) => {
    switch(type) {
      case "order": return "text-blue-600 bg-blue-100"
      case "payment": return "text-green-600 bg-green-100"
      case "stock": return "text-orange-600 bg-orange-100"
      case "warning": return "text-yellow-600 bg-yellow-100"
      case "info": return "text-gray-600 bg-gray-100"
      default: return "text-gray-600 bg-gray-100"
    }
  }

  const getIcon = (type: string) => {
    switch(type) {
      case "order": return <ShoppingCart className="h-3.5 w-3.5" />
      case "payment": return <DollarSign className="h-3.5 w-3.5" />
      case "stock": return <AlertTriangle className="h-3.5 w-3.5" />
      case "warning": return <Clock className="h-3.5 w-3.5" />
      case "info": return <Info className="h-3.5 w-3.5" />
      default: return <Bell className="h-3.5 w-3.5" />
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-[10px]"
              variant="default"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px] p-0">
        <div className="flex items-center justify-between p-3 border-b">
          <DropdownMenuLabel className="text-sm font-semibold p-0">
            Notifications {unreadCount > 0 && `(${unreadCount})`}
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {activeNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <Bell className="h-8 w-8 mb-2 opacity-30" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="divide-y">
              {activeNotifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "group relative p-3 hover:bg-accent/50 transition-colors",
                    !notification.read && "bg-accent/20"
                  )}
                >
                  <div className="flex gap-3">
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full shrink-0",
                      getNotificationColor(notification.type)
                    )}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-xs font-medium leading-none">
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.description}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {notification.time}
                      </p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => archiveNotification(notification.id)}
                      >
                        <ArchiveIcon className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <DropdownMenuSeparator className="m-0" />
        <div className="p-2">
          <Link href="/notifications">
            <Button variant="ghost" className="w-full h-8 text-xs">
              View all notifications
            </Button>
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}