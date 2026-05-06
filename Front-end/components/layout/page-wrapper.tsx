"use client"

import { ReactNode } from "react"
import { MainLayout } from "./main-layout"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface Breadcrumb {
  label: string
  href?: string
}

interface PageWrapperProps {
  children: ReactNode
  breadcrumbs?: Breadcrumb[]
  title?: string
  description?: string
  loading?: boolean
  error?: Error | null
  onRetry?: () => void
  loadingType?: "card" | "table" | "list" | "dashboard" | "form"
  className?: string
}

export function PageWrapper({
  children,
  breadcrumbs = [],
  title,
  description,
  loading = false,
  error = null,
  onRetry,
  loadingType = "card",
  className
}: PageWrapperProps) {
  if (loading) {
    return (
      <MainLayout breadcrumbs={breadcrumbs}>
        {title && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{title}</h1>
            {description && (
              <p className="text-muted-foreground mt-1">{description}</p>
            )}
          </div>
        )}
        <LoadingSkeleton type={loadingType} count={3} />
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout breadcrumbs={breadcrumbs}>
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle>Error Loading Data</CardTitle>
            </div>
            <CardDescription>
              {error.message || "An unexpected error occurred while loading the data."}
            </CardDescription>
          </CardHeader>
          {onRetry && (
            <CardContent>
              <Button onClick={onRetry} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </CardContent>
          )}
        </Card>
      </MainLayout>
    )
  }

  return (
    <MainLayout breadcrumbs={breadcrumbs}>
      {title && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      )}
      <div className={className}>
        {children}
      </div>
    </MainLayout>
  )
}