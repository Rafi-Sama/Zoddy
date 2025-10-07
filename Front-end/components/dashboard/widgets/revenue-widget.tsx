import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp } from "lucide-react"

export function RevenueWidget() {
  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 p-3 sm:p-6">
        <CardTitle className="text-xs sm:text-sm font-medium">Total Revenue</CardTitle>
        <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
      </CardHeader>
      <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
        <div className="text-lg sm:text-xl font-bold">৳45,231</div>
        <div className="flex items-center text-[10px] sm:text-xs text-muted-foreground">
          <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 text-green-500 flex-shrink-0" />
          <span className="truncate">+20.1% from last month</span>
        </div>
        <div className="h-[24px] sm:h-[32px] mt-1.5 sm:mt-2 flex items-end space-x-0.5 sm:space-x-1">
          {[8, 12, 6, 15, 10, 18, 14, 22, 16, 28, 20, 35].map((height, i) => (
            <div key={i} className="bg-accent/30 rounded-sm flex-1" style={{height: `${height}%`}} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}