 import dynamic from 'next/dynamic'
import { ComponentType, ReactNode } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

// Default loading component
function DefaultLoadingComponent() {
  return (
    <div className="w-full h-32 flex items-center justify-center">
      <Skeleton className="w-full h-full" />
    </div>
  )
}

// Lazy load with custom loading component
export function lazyLoad<T extends Record<string, unknown>>(
  importFunc: () => Promise<{ default: ComponentType<T> }>,
  loadingComponent?: ReactNode
) {
  return dynamic(importFunc, {
    loading: () => (loadingComponent ? <>{loadingComponent}</> : <DefaultLoadingComponent />),
    ssr: true
  })
}

// Lazy load with no SSR (client-only components)
export function lazyLoadClient<T extends Record<string, unknown>>(
  importFunc: () => Promise<{ default: ComponentType<T> }>,
  loadingComponent?: ReactNode
) {
  return dynamic(importFunc, {
    loading: () => (loadingComponent ? <>{loadingComponent}</> : <DefaultLoadingComponent />),
    ssr: false
  })
}

// Preload component on hover/focus
export function preloadComponent(
  importFunc: () => Promise<{ default: ComponentType<unknown> }>
) {
  importFunc()
}