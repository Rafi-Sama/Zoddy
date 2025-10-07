import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, TrendingUp } from "lucide-react"

export function OrdersWidget() {
  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
        <CardTitle className="text-xs font-medium">Orders</CardTitle>
        <ShoppingCart className="h-3.5 w-3.5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold">+152</div>
        <div className="flex items-center gap-1.5 text-[10px]">
          <Badge variant="default" className="bg-yellow-100 text-yellow-800 text-[9px] px-1.5 py-0">12 Pending</Badge>
          <Badge variant="default" className="bg-green-100 text-green-800 text-[9px] px-1.5 py-0">140 Completed</Badge>
        </div>
        <div className="flex items-center text-[10px] text-muted-foreground mt-1">
          <TrendingUp className="h-2.5 w-2.5 mr-1 text-green-500" />
          +5 from yesterday
        </div>
      </CardContent>
    </Card>
  )
}