"use client"

import { useEffect } from "react"

export function ClearOldSidebarCache() {
  useEffect(() => {
    // Clear old sidebar cache if it contains removed items
    const saved = localStorage.getItem('sidebarItems')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Check if any old items (products or analytics) exist
        const hasOldItems = parsed.some((item: { id: string }) =>
          item.id === 'products' || item.id === 'analytics'
        )

        if (hasOldItems) {
          // Clear the cache to force reload with new menu structure
          localStorage.removeItem('sidebarItems')
          // Force a page reload to ensure clean state
          window.location.reload()
        }
      } catch {
        // If parsing fails, clear it anyway
        localStorage.removeItem('sidebarItems')
      }
    }
  }, [])

  return null
}