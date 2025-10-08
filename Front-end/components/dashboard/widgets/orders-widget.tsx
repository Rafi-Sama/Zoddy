import { memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, TrendingUp } from "lucide-react"

export const OrdersWidget = memo(function OrdersWidget() {
  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 p-3 sm:p-6">
        <CardTitle className="text-xs sm:text-sm font-medium">Orders</CardTitle>
        <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
      </CardHeader>
      <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
        <div className="text-lg sm:text-xl font-bold">+152</div>
        <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 text-[10px]">
          <Badge variant="default" className="bg-yellow-100 text-yellow-800 text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0">12 Pending</Badge>
          <Badge variant="default" className="bg-green-100 text-green-800 text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0">140 Completed</Badge>
        </div>
        <div className="flex items-center text-[10px] sm:text-xs text-muted-foreground mt-1">
          <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 text-green-500 flex-shrink-0" />
          <span className="truncate">+5 from yesterday</span>
        </div>
      </CardContent>
    </Card>
  )
})