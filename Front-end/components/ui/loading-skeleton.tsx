import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface LoadingSkeletonProps {
  type?: "card" | "table" | "list" | "dashboard" | "form"
  count?: number
}

export function LoadingSkeleton({ type = "card", count = 1 }: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (type) {
      case "card":
        return (
          <Card>
            <CardHeader>
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-3/4 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        )

      case "table":
        return (
          <div className="space-y-2">
            <div className="flex gap-4 p-4 border-b">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4 p-4 border-b">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        )

      case "list":
        return (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )

      case "dashboard":
        return (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )

      case "form":
        return (
          <div className="space-y-4">
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-28 mb-2" />
              <Skeleton className="h-24 w-full" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        )

      default:
        return <Skeleton className="h-20 w-full" />
    }
  }

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </>
  )
}