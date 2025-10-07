"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { ShoppingCart, DollarSign, AlertTriangle, Clock, Info } from "lucide-react"

export interface Notification {
  id: string
  title: string
  description: string
  time: string
  read: boolean
  type: "order" | "payment" | "stock" | "info" | "warning"
  icon?: React.ReactNode
  archived?: boolean
}

interface NotificationsContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
  archiveNotification: (id: string) => void
  unarchiveNotification: (id: string) => void
  getUnreadCount: () => number
  getActiveNotifications: () => Notification[]
  getArchivedNotifications: () => Notification[]
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "New Order Received",
    description: "Order #1235 from Ayesha Rahman - ৳2,450",
    time: "2 min ago",
    read: false,
    type: "order",
    icon: <ShoppingCart className="h-3.5 w-3.5" />,
    archived: false
  },
  {
    id: "2",
    title: "Payment Received",
    description: "৳3,800 from Nusrat Jahan for Order #1232",
    time: "1 hour ago",
    read: false,
    type: "payment",
    icon: <DollarSign className="h-3.5 w-3.5" />,
    archived: false
  },
  {
    id: "3",
    title: "Low Stock Alert",
    description: "Cotton Kurti (Blue) - Only 3 items left",
    time: "3 hours ago",
    read: false,
    type: "stock",
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
    archived: false
  },
  {
    id: "4",
    title: "Payment Pending",
    description: "Rahman Ali's payment for Order #1233 is pending",
    time: "5 hours ago",
    read: true,
    type: "warning",
    icon: <Clock className="h-3.5 w-3.5" />,
    archived: false
  },
  {
    id: "5",
    title: "Weekly Report Ready",
    description: "Your sales report for this week is ready to view",
    time: "1 day ago",
    read: true,
    type: "info",
    icon: <Info className="h-3.5 w-3.5" />,
    archived: false
  },
  {
    id: "6",
    title: "Order Completed",
    description: "Order #1230 has been delivered successfully",
    time: "2 days ago",
    read: true,
    type: "order",
    icon: <ShoppingCart className="h-3.5 w-3.5" />,
    archived: true
  }
]

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)

  const addNotification = (notification: Omit<Notification, "id">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      archived: false
    }
    setNotifications(prev => [newNotification, ...prev])
  }

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const archiveNotification = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, archived: true, read: true } : notif
      )
    )
  }

  const unarchiveNotification = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, archived: false } : notif
      )
    )
  }

  const getUnreadCount = () => {
    return notifications.filter(n => !n.read && !n.archived).length
  }

  const getActiveNotifications = () => {
    return notifications.filter(n => !n.archived)
  }

  const getArchivedNotifications = () => {
    return notifications.filter(n => n.archived)
  }

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        archiveNotification,
        unarchiveNotification,
        getUnreadCount,
        getActiveNotifications,
        getArchivedNotifications
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationsProvider")
  }
  return context
}