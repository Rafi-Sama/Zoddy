"use client"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Download,
  Plus,
  Eye,
  DollarSign,
  Banknote,
  PieChart,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  BarChart3,
  Calendar
} from "lucide-react"
export default function PaymentsPage() {
  return (
    <MainLayout
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Payments" }
      ]}
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display">Payments &amp; Cash Flow</h1>
            <p className="text-muted-foreground">
              Manage payments, track cash flow, and monitor financial health
            </p>
          </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="30days">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Payment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record New Payment</DialogTitle>
                <DialogDescription>
                  Add a new payment transaction to your records
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Amount (৳)</Label>
                    <Input id="amount" placeholder="0.00" />
                  </div>
                  <div>
                    <Label htmlFor="type">Transaction Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                        <SelectItem value="refund">Refund</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="method">Payment Method</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="bkash">bKash</SelectItem>
                      <SelectItem value="nagad">Nagad</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" placeholder="Payment description..." />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Add Payment</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {/* Financial Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳2,45,000</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ArrowDownLeft className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳1,85,000</div>
            <div className="flex items-center text-xs text-red-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.3% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳60,000</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +24.4% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Flow</CardTitle>
            <Wallet className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳1,25,000</div>
            <div className="flex items-center text-xs text-blue-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              Healthy flow
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Cash Flow Chart & Payment Methods */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Cash Flow Trend
            </CardTitle>
            <Select defaultValue="monthly">
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between space-x-1">
              {[
                { income: 80, expense: 60, month: 'Jan' },
                { income: 65, expense: 45, month: 'Feb' },
                { income: 90, expense: 70, month: 'Mar' },
                { income: 75, expense: 55, month: 'Apr' },
                { income: 85, expense: 65, month: 'May' },
                { income: 95, expense: 75, month: 'Jun' },
                { income: 100, expense: 80, month: 'Jul' },
                { income: 90, expense: 70, month: 'Aug' },
                { income: 85, expense: 65, month: 'Sep' },
                { income: 95, expense: 75, month: 'Oct' },
                { income: 100, expense: 85, month: 'Nov' },
                { income: 105, expense: 80, month: 'Dec' }
              ].map((data, i) => (
                <div key={i} className="flex flex-col items-center space-y-1 flex-1">
                  <div className="flex items-end space-x-1 w-full justify-center">
                    <div
                      className="bg-green-500 rounded-t"
                      style={{ height: `${data.income * 2}px`, width: '8px' }}
                    />
                    <div
                      className="bg-red-500 rounded-t"
                      style={{ height: `${data.expense * 2}px`, width: '8px' }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{data.month}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded" />
                <span className="text-sm">Income</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded" />
                <span className="text-sm">Expenses</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-sm">bKash</span>
                </div>
                <div className="text-sm font-medium">35%</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span className="text-sm">Cash</span>
                </div>
                <div className="text-sm font-medium">30%</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full" />
                  <span className="text-sm">Nagad</span>
                </div>
                <div className="text-sm font-medium">20%</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full" />
                  <span className="text-sm">Bank Transfer</span>
                </div>
                <div className="text-sm font-medium">10%</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span className="text-sm">Card</span>
                </div>
                <div className="text-sm font-medium">5%</div>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Most Popular</span>
                <span className="font-medium text-green-600">bKash</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Transaction Fees</span>
                <span className="font-medium">৳2,450/month</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Recent Transactions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Transactions</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View All
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                id: "TXN001",
                type: "income",
                amount: 15500,
                method: "bKash",
                description: "Payment from Rahman Electronics",
                status: "completed",
                date: "2024-01-15"
              },
              {
                id: "TXN002",
                type: "expense",
                amount: 8500,
                method: "Cash",
                description: "Inventory Purchase - Supplier A",
                status: "completed",
                date: "2024-01-15"
              },
              {
                id: "TXN003",
                type: "income",
                amount: 12300,
                method: "Nagad",
                description: "Online Order Payment",
                status: "pending",
                date: "2024-01-14"
              },
              {
                id: "TXN004",
                type: "expense",
                amount: 3200,
                method: "Bank Transfer",
                description: "Utility Bills Payment",
                status: "completed",
                date: "2024-01-14"
              },
              {
                id: "TXN005",
                type: "income",
                amount: 18900,
                method: "Cash",
                description: "Walk-in Customer Payment",
                status: "completed",
                date: "2024-01-13"
              }
            ].map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'income'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {transaction.type === 'income' ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownLeft className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.id} • {transaction.method} • {transaction.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}৳{transaction.amount.toLocaleString()}
                    </p>
                  </div>
                  <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                    {transaction.status === 'completed' ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <Clock className="h-3 w-3 mr-1" />
                    )}
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Financial Health & Alerts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Banknote className="h-5 w-5" />
              Financial Health Score
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">85/100</div>
              <p className="text-sm text-muted-foreground">Excellent financial health</p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Cash Flow Stability</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-muted rounded-full">
                    <div className="w-4/5 h-2 bg-green-500 rounded-full" />
                  </div>
                  <span className="text-sm font-medium">90%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Profit Margins</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-muted rounded-full">
                    <div className="w-3/4 h-2 bg-green-500 rounded-full" />
                  </div>
                  <span className="text-sm font-medium">75%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Payment Diversity</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-muted rounded-full">
                    <div className="w-4/5 h-2 bg-green-500 rounded-full" />
                  </div>
                  <span className="text-sm font-medium">85%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Growth Trend</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-muted rounded-full">
                    <div className="w-4/5 h-2 bg-green-500 rounded-full" />
                  </div>
                  <span className="text-sm font-medium">90%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Financial Alerts & Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">Strong Cash Flow</p>
                  <p className="text-xs text-green-600">
                    Your cash flow is consistently positive. Great work!
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">High Transaction Fees</p>
                  <p className="text-xs text-yellow-600">
                    Consider negotiating better rates with payment providers.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Growth Opportunity</p>
                  <p className="text-xs text-blue-600">
                    Revenue is up 12.5%. Consider expanding successful product lines.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-purple-800">Upcoming: &ldquo;Eid Season&rdquo;</p>
                  <p className="text-xs text-purple-600">
                    Prepare for 40% increase in orders. Ensure adequate cash flow.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </MainLayout>
  )
}