import { memo } from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: string
  type?: "order" | "payment" | "custom"
  color?: string
  icon?: React.ReactNode
  label?: string
  showIcon?: boolean
  showLabel?: boolean
  size?: "xs" | "sm" | "md"
  className?: string
}

export const StatusBadge = memo(function StatusBadge({
  status,
  color,
  icon,
  label,
  showIcon = true,
  showLabel = true,
  size = "sm",
  className
}: StatusBadgeProps) {
  const sizeClasses = {
    xs: "text-[9px] px-1.5 py-0.5",
    sm: "text-[10px] px-2 py-1",
    md: "text-xs px-2.5 py-1.5"
  }

  return (
    <Badge
      className={cn(
        color,
        sizeClasses[size],
        "inline-flex items-center gap-1 whitespace-nowrap",
        className
      )}
    >
      {showIcon && icon}
      {showLabel && <span className="capitalize">{label || status}</span>}
    </Badge>
  )
})