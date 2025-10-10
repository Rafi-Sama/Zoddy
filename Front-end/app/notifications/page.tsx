"use client";

import { MainLayout } from "@/components/layout/main-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNotifications } from "@/contexts/notifications-context";
import {
  Bell,
  Check,
  Archive,
  Trash2,
  Search,
  Filter,
  CheckCheck,
  BellOff,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  Clock,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function NotificationsPage() {
  const {
    getActiveNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    archiveNotification,
    getUnreadCount,
  } = useNotifications();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const activeNotifications = getActiveNotifications();
  const unreadCount = getUnreadCount();

  // Filter notifications based on search and filters
  const filteredNotifications = activeNotifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesType =
      filterType === "all" || notification.type === filterType;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "unread" && !notification.read) ||
      (filterStatus === "read" && notification.read);

    return matchesSearch && matchesType && matchesStatus;
  });

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "order":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "payment":
        return "bg-green-100 text-green-800 border-green-200";
      case "stock":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "info":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingCart className="h-4 w-4" />;
      case "payment":
        return <DollarSign className="h-4 w-4" />;
      case "stock":
        return <AlertTriangle className="h-4 w-4" />;
      case "warning":
        return <Clock className="h-4 w-4" />;
      case "info":
        return <Info className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <MainLayout breadcrumbs={[{ label: "Notifications" }]}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription className="mt-1">
                {unreadCount > 0
                  ? `You have ${unreadCount} unread notifications`
                  : "All notifications are read"}
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-3 w-1/2">
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-3.5 w-3.5 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="order">Orders</SelectItem>
                  <SelectItem value="payment">Payments</SelectItem>
                  <SelectItem value="stock">Stock</SelectItem>
                  <SelectItem value="warning">Warnings</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  className="flex items-center gap-1.5"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Mark all as read
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardContent className="pt-6">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BellOff className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground text-sm">
                No notifications found
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                {searchQuery || filterType !== "all" || filterStatus !== "all"
                  ? "Try adjusting your filters"
                  : "You're all caught up!"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-4 p-4 rounded-lg border transition-all",
                    !notification.read && "bg-accent/20 border-accent",
                    notification.read && "bg-background"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full shrink-0",
                      getNotificationColor(notification.type)
                    )}
                  >
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between">
                      <div>
                       <div className="flex items-top gap-2 mb-2">
                         <p className="text-sm font-medium leading-none">
                          {notification.title}
                          </p>
                        <div className="flex items-center gap-2 mt-[-10px]">
                          <span className="text-xs text-muted-foreground">
                            {notification.time}
                          </span>
                          {!notification.read && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0"
                            >
                              New
                            </Badge>
                          )}
                        </div>

                       </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.description}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => archiveNotification(notification.id)}
                        >
                          <Archive className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => deleteNotification(notification.id)}
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
  );
}
