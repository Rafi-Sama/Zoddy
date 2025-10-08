import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Star } from "lucide-react"

export function InsightsWidget() {
  return (
    <Card className="h-full overflow-hidden">
      <CardHeader>
        <CardTitle className="text-sm sm:text-base">📊 Business Insights</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Your day-1 ROI dashboard</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 sm:space-y-3 scrollbar-hide overflow-y-auto max-h-[calc(100%-4rem)] p-3 sm:p-6 pt-0">
        <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2">
          <div className="p-2 sm:p-3 border rounded-lg bg-green-50 border-green-200">
            <div className="flex items-center gap-1 sm:gap-1.5 mb-1 sm:mb-1.5">
              <Clock className="h-3 w-3 text-green-600 flex-shrink-0" />
              <span className="text-[10px] sm:text-xs font-medium text-green-800 truncate">Time Saved</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-green-700">4.5 hours</div>
            <div className="text-[9px] sm:text-[10px] text-green-600">This month vs manual tracking</div>
          </div>
          <div className="p-2 sm:p-3 border rounded-lg bg-blue-50 border-blue-200">
            <div className="flex items-center gap-1 sm:gap-1.5 mb-1 sm:mb-1.5">
              <Star className="h-3 w-3 text-blue-600 flex-shrink-0" />
              <span className="text-[10px] sm:text-xs font-medium text-blue-800 truncate">Best Customer</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-blue-700 truncate">Ayesha Rahman</div>
            <div className="text-[9px] sm:text-[10px] text-blue-600">3 orders • ৳8,000 total</div>
          </div>
        </div>
        <div className="p-2 sm:p-3 border rounded-lg bg-orange-50 border-orange-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="text-[10px] sm:text-xs font-medium text-orange-800">Customer Retention Alert</div>
              <div className="text-[9px] sm:text-xs text-orange-700">5 customers haven&apos;t ordered in 30 days</div>
            </div>
            <Button size="sm" variant="outline" className="border-orange-300 text-orange-700 h-6 sm:h-7 text-[9px] sm:text-[10px] px-2 self-start sm:self-auto">
              Send Message
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}