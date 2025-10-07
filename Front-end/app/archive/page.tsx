"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useNotifications } from "@/contexts/notifications-context"
import { Archive, Trash2, ArchiveRestore, Search, ShoppingCart, DollarSign, AlertTriangle, Clock, Info, Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

export default function ArchivePage() {
  const {
    getArchivedNotifications,
    unarchiveNotification,
    deleteNotification
  } = useNotifications()

  const [searchQuery, setSearchQuery] = useState("")

  const archivedNotifications = getArchivedNotifications()

  // Filter archived notifications based on search
  const filteredNotifications = archivedNotifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          notification.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const getNotificationColor = (type: string) => {
    switch(type) {
      case "order": return "bg-blue-100 text-blue-800 border-blue-200"
      case "payment": return "bg-green-100 text-green-800 border-green-200"
      case "stock": return "bg-orange-100 text-orange-800 border-orange-200"
      case "warning": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "info": return "bg-gray-100 text-gray-800 border-gray-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getIcon = (type: string) => {
    switch(type) {
      case "order": return <ShoppingCart className="h-4 w-4" />
      case "payment": return <DollarSign className="h-4 w-4" />
      case "stock": return <AlertTriangle className="h-4 w-4" />
      case "warning": return <Clock className="h-4 w-4" />
      case "info": return <Info className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const handleDeleteAll = () => {
    if (confirm("Are you sure you want to delete all archived notifications? This action cannot be undone.")) {
      archivedNotifications.forEach(notification => {
        deleteNotification(notification.id)
      })
    }
  }

  return (
    <MainLayout
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Archive" }
      ]}
    >
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Archive className="h-5 w-5" />
                Archived Notifications
              </CardTitle>
              <CardDescription className="mt-1">
                {archivedNotifications.length > 0
                  ? `${archivedNotifications.length} archived notifications`
                  : "No archived notifications"}
              </CardDescription>
            </div>
            {archivedNotifications.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteAll}
                className="flex items-center gap-1.5 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete all
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Search */}
      {archivedNotifications.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search archived notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Archived Notifications List */}
      <Card>
        <CardContent className="pt-6">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Archive className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground text-sm">
                {searchQuery ? "No archived notifications found" : "No archived notifications"}
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                {searchQuery
                  ? "Try adjusting your search"
                  : "Archived notifications will appear here"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-4 p-4 rounded-lg border bg-muted/30"
                >
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full shrink-0",
                    getNotificationColor(notification.type)
                  )}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium leading-none">
                          {notification.title}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-muted-foreground">
                            {notification.time}
                          </span>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            Archived
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => unarchiveNotification(notification.id)}
                          title="Restore to notifications"
                        >
                          <ArchiveRestore className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => deleteNotification(notification.id)}
                          title="Delete permanently"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  )
}