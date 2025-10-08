"use client"
import { useState, useEffect } from "react"
import {
  ChevronUp,
  ChevronDown,
  Home,
  Package,
  Settings,
  ShoppingCart,
  Wallet,
  Megaphone,
  TrendingUp,
  User2,
  Users,
  UsersRound,
  Calendar,
  Bell,
  Archive,
  MoreVertical,
  GripVertical,
  ArchiveRestore,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// Menu item type
interface MenuItem {
  id: string
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  isArchived?: boolean
}

// Initial items
const initialItems: MenuItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    id: "orders",
    title: "Orders",
    url: "/orders",
    icon: ShoppingCart,
  },
  {
    id: "customers",
    title: "Customers",
    url: "/customers",
    icon: Users,
  },
  {
    id: "team",
    title: "Team",
    url: "/team",
    icon: UsersRound,
  },
  {
    id: "inventory",
    title: "Inventory",
    url: "/inventory",
    icon: Package,
  },
  {
    id: "payments",
    title: "Payments",
    url: "/payments",
    icon: Wallet,
  },
  {
    id: "marketing",
    title: "Marketing",
    url: "/marketing",
    icon: Megaphone,
  },
  {
    id: "calendar",
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
  },
  {
    id: "notifications",
    title: "Notifications",
    url: "/notifications",
    icon: Bell,
  },
  {
    id: "settings",
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

// Sortable Item Component
function SortableItem({ item, onArchive, onUnarchive }: {
  item: MenuItem;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleAction = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (item.isArchived) {
      onUnarchive(item.id)
    } else {
      onArchive(item.id)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group",
        isDragging && "opacity-50"
      )}
    >
      <ContextMenu>
        <ContextMenuTrigger>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={item.title}>
              <a href={item.url} className="relative group/item flex items-center">
                <item.icon className="group-data-[collapsible=icon]/sidebar:mx-auto h-4 w-4 flex-shrink-0" />
                <span className="group-data-[collapsible=icon]/sidebar:hidden truncate">{item.title}</span>
                <div className="ml-auto flex items-center gap-0.5 group-data-[collapsible=icon]/sidebar:hidden">
                  <div
                    className="cursor-move opacity-0 group-hover/item:opacity-100 transition-opacity hidden md:block touch-none"
                    {...attributes}
                    {...listeners}
                  >
                    <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 md:opacity-0 md:group-hover/item:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleAction}>
                      {item.isArchived ? (
                        <>
                          <ArchiveRestore className="mr-2 h-3.5 w-3.5" />
                          Unarchive
                        </>
                      ) : (
                        <>
                          <Archive className="mr-2 h-3.5 w-3.5" />
                          Archive
                        </>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => item.isArchived ? onUnarchive(item.id) : onArchive(item.id)}>
            {item.isArchived ? (
              <>
                <ArchiveRestore className="mr-2 h-3.5 w-3.5" />
                Unarchive
              </>
            ) : (
              <>
                <Archive className="mr-2 h-3.5 w-3.5" />
                Archive
              </>
            )}
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}

export function AppSidebarEnhanced() {
  const [items, setItems] = useState<MenuItem[]>(() => {
    // Load from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarItems')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          const savedIds = new Set(parsed.map((item: MenuItem) => item.id))

          // Start with saved items that still exist in initialItems
          const validSavedItems = parsed
            .filter((item: MenuItem) => initialItems.some(i => i.id === item.id))
            .map((item: MenuItem) => ({
              ...item,
              icon: initialItems.find(i => i.id === item.id)?.icon || Home
            }))

          // Add any new items from initialItems that aren't in saved items
          const newItems = initialItems.filter(item => !savedIds.has(item.id))

          // Merge saved items with new items
          const mergedItems = [...validSavedItems]

          // Insert new items at their original positions
          newItems.forEach(newItem => {
            const originalIndex = initialItems.findIndex(i => i.id === newItem.id)
            // Find the right position to insert
            let insertIndex = mergedItems.length
            for (let i = originalIndex + 1; i < initialItems.length; i++) {
              const afterItemIndex = mergedItems.findIndex(item => item.id === initialItems[i].id)
              if (afterItemIndex !== -1) {
                insertIndex = afterItemIndex
                break
              }
            }
            mergedItems.splice(insertIndex, 0, newItem)
          })

          return mergedItems
        } catch {
          localStorage.removeItem('sidebarItems')
          return initialItems
        }
      }
    }
    return initialItems
  })

  const [archiveExpanded, setArchiveExpanded] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)


  // Save to localStorage whenever items change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Only save valid items
      const validIds = initialItems.map(item => item.id)
      const validItems = items.filter(item => validIds.includes(item.id))
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const toSave = validItems.map(({ icon, ...rest }) => rest)
      localStorage.setItem('sidebarItems', JSON.stringify(toSave))
    }
  }, [items])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const activeItems = items.filter(item => !item.isArchived)
  const archivedItems = items.filter(item => item.isArchived)

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setItems((items) => {
        const activeItem = items.find(item => item.id === active.id)
        const overItem = items.find(item => item.id === over.id)

        if (!activeItem || !overItem) return items

        // Only allow reordering within the same archive status
        if (activeItem.isArchived !== overItem.isArchived) return items

        const oldIndex = items.indexOf(activeItem)
        const newIndex = items.indexOf(overItem)

        const newItems = [...items]
        newItems.splice(oldIndex, 1)
        newItems.splice(newIndex, 0, activeItem)

        return newItems
      })
    }

    setActiveId(null)
  }

  const handleArchive = (id: string) => {
    setItems(items =>
      items.map(item =>
        item.id === id ? { ...item, isArchived: true } : item
      )
    )
    // Auto-expand archive section when archiving
    setArchiveExpanded(true)
  }

  const handleUnarchive = (id: string) => {
    setItems(items =>
      items.map(item =>
        item.id === id ? { ...item, isArchived: false } : item
      )
    )
  }

  const activeItem = activeId ? items.find(item => item.id === activeId) : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-1.5 md:gap-2 px-2 py-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent text-accent-foreground flex-shrink-0">
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
            <div className="grid flex-1 text-left text-xs leading-tight min-w-0">
              <span className="truncate font-bold font-display">Zoddy</span>
              <span className="truncate text-[10px] text-muted-foreground group-data-[collapsible=icon]/sidebar:hidden">Business Tracker</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SortableContext
                  items={activeItems.map(item => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {activeItems.map((item) => (
                    <SortableItem
                      key={item.id}
                      item={item}
                      onArchive={handleArchive}
                      onUnarchive={handleUnarchive}
                    />
                  ))}
                </SortableContext>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Archive Section */}
          {archivedItems.length > 0 && (
            <SidebarGroup>
              <button
                onClick={() => setArchiveExpanded(!archiveExpanded)}
                className="flex items-center justify-between px-2 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group-data-[collapsible=icon]/sidebar:px-0 group-data-[collapsible=icon]/sidebar:justify-center"
              >
                <div className="flex items-center gap-1.5">
                  <Archive className="h-3.5 w-3.5 group-data-[collapsible=icon]/sidebar:mx-auto" />
                  <span className="group-data-[collapsible=icon]/sidebar:hidden">Archive ({archivedItems.length})</span>
                </div>
                <div className="group-data-[collapsible=icon]/sidebar:hidden">
                  {archiveExpanded ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </div>
              </button>
              {archiveExpanded && (
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SortableContext
                      items={archivedItems.map(item => item.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {archivedItems.map((item) => (
                        <div key={item.id} className="opacity-60">
                          <SortableItem
                            item={item}
                            onArchive={handleArchive}
                            onUnarchive={handleUnarchive}
                          />
                        </div>
                      ))}
                    </SortableContext>
                  </SidebarMenu>
                </SidebarGroupContent>
              )}
            </SidebarGroup>
          )}
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> Username
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem asChild>
                    <a href="/account">Account</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/settings?section=billing">Billing</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/signout">Sign out</a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <DragOverlay>
        {activeItem ? (
          <div className="flex items-center gap-2 bg-sidebar p-2 rounded-md shadow-lg">
            <activeItem.icon className="h-4 w-4" />
            <span className="text-sm">{activeItem.title}</span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}