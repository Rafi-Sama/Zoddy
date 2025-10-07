import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp } from "lucide-react"

export function RevenueWidget() {
  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
        <CardTitle className="text-xs font-medium">Total Revenue</CardTitle>
        <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold">৳45,231</div>
        <div className="flex items-center text-[10px] text-muted-foreground">
          <TrendingUp className="h-2.5 w-2.5 mr-1 text-green-500" />
          +20.1% from last month
        </div>
        <div className="h-[24px] mt-1.5 flex items-end space-x-1">
          {[8, 12, 6, 15, 10, 18, 14, 22, 16, 28, 20, 35].map((height, i) => (
            <div key={i} className="bg-accent/30 rounded-sm flex-1" style={{height: `${height}%`}} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}