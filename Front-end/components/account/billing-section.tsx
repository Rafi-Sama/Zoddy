'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { PaymentMethodDialog } from '@/components/billing/payment-method-dialog'
import {
  CreditCard,
  Download,
  TrendingUp,
  Package,
  Users,
  Plus,
  Crown,
  Building,
  Star,
  Receipt,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'
import {
  SUBSCRIPTION_PLANS,
  type PaymentMethod,
  type Invoice,
  type UsageStats,
  type Subscription
} from '@/types/billing'
import { cn } from '@/lib/utils'

export function BillingSection() {
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string>('professional')
  const [autoRenew, setAutoRenew] = useState(true)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [showAllInvoices, setShowAllInvoices] = useState(false)

  // Mock current subscription
  const [currentSubscription, setCurrentSubscription] = useState<Subscription>({
    id: 'sub_1',
    user_id: 'user_1',
    plan_id: 'professional',
    status: 'active',
    current_period_start: '2024-12-15',
    current_period_end: '2025-01-15',
    cancel_at_period_end: false,
    created_at: '2024-01-15',
    updated_at: '2024-12-15'
  })

  // Mock usage stats
  const usage: UsageStats = {
    orders: 245,
    customers: 487,
    products: 132,
    team_members: 3,
    storage_used: '8.2GB',
    api_calls: 15420
  }

  // Mock payment methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'pm_1',
      type: 'bkash',
      phone: '017XXXXX890',
      is_default: true,
      created_at: '2024-01-15'
    }
  ])

  // Mock invoices
  const invoices: Invoice[] = [
    {
      id: 'inv_1',
      invoice_number: 'INV-2024-012',
      subscription_id: 'sub_1',
      amount: 1500,
      currency: 'BDT',
      status: 'paid',
      due_date: '2024-12-15',
      paid_at: '2024-12-15',
      payment_method_id: 'pm_1',
      items: [{ description: 'Professional Plan', quantity: 1, unit_amount: 1500, amount: 1500 }],
      created_at: '2024-12-15'
    },
    {
      id: 'inv_2',
      invoice_number: 'INV-2024-011',
      subscription_id: 'sub_1',
      amount: 1500,
      currency: 'BDT',
      status: 'paid',
      due_date: '2024-11-15',
      paid_at: '2024-11-15',
      payment_method_id: 'pm_1',
      items: [{ description: 'Professional Plan', quantity: 1, unit_amount: 1500, amount: 1500 }],
      created_at: '2024-11-15'
    }
  ]

  const currentPlan = SUBSCRIPTION_PLANS.find(p => p.id === currentSubscription.plan_id)
  const displayInvoices = showAllInvoices ? invoices : invoices.slice(0, 3)

  const handlePlanChange = async (planId: string) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setCurrentSubscription(prev => ({ ...prev, plan_id: planId }))
      toast.success(`Successfully changed to ${SUBSCRIPTION_PLANS.find(p => p.id === planId)?.name} plan`)
    } catch {
      toast.error('Failed to change plan')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentMethodAdded = (method: { type: string; phone?: string; last4?: string; brand?: string; bank_name?: string }) => {
    const newMethod: PaymentMethod = {
      id: `pm_${Date.now()}`,
      type: method.type as PaymentMethod['type'],
      phone: method.phone,
      last4: method.last4,
      brand: method.brand,
      bank_name: method.bank_name,
      is_default: paymentMethods.length === 0,
      created_at: new Date().toISOString()
    }
    setPaymentMethods([...paymentMethods, newMethod])
    toast.success('Payment method added successfully')
  }

  const handleCancelSubscription = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setCurrentSubscription(prev => ({ ...prev, cancel_at_period_end: true }))
      toast.success('Subscription will be canceled at the end of the billing period')
    } catch {
      toast.error('Failed to cancel subscription')
    } finally {
      setLoading(false)
    }
  }

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free': return Users
      case 'starter': return Star
      case 'professional': return Crown
      case 'enterprise': return Building
      default: return Package
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Billing & Subscription</h2>
        <p className="text-sm text-muted-foreground">Manage your subscription and payment methods</p>
      </div>

      {/* Current Plan & Usage - Compact Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Current Plan Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Current Plan</CardTitle>
              <Badge className={cn(
                currentSubscription.cancel_at_period_end ? 'bg-orange-500' : 'bg-green-500'
              )}>
                {currentSubscription.cancel_at_period_end ? 'Canceling' : 'Active'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = getPlanIcon(currentSubscription.plan_id)
                  return (
                    <div className="p-2 rounded-lg bg-accent/10">
                      <Icon className="h-5 w-5 text-accent" />
                    </div>
                  )
                })()}
                <div>
                  <p className="font-semibold">{currentPlan?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ৳{currentPlan?.price.toLocaleString()}/month
                  </p>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => setSelectedPlan(currentSubscription.plan_id)}>
                Change Plan
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Billing cycle</span>
                <span>Monthly</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Next billing date</span>
                <span>{new Date(currentSubscription.current_period_end).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-renew" className="text-sm">Auto-renewal</Label>
                <Switch
                  id="auto-renew"
                  checked={autoRenew && !currentSubscription.cancel_at_period_end}
                  onCheckedChange={setAutoRenew}
                  disabled={currentSubscription.cancel_at_period_end}
                />
              </div>
            </div>

            {currentSubscription.cancel_at_period_end ? (
              <Button
                size="sm"
                className="w-full"
                onClick={() => {
                  setCurrentSubscription(prev => ({ ...prev, cancel_at_period_end: false }))
                  toast.success('Subscription reactivated')
                }}
              >
                Reactivate Subscription
              </Button>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                className="w-full text-destructive hover:text-destructive"
                onClick={handleCancelSubscription}
              >
                Cancel Subscription
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Usage Stats Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Usage This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Orders</p>
                <p className="text-xl font-semibold">{usage.orders}</p>
                <Progress value={75} className="h-1" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Customers</p>
                <p className="text-xl font-semibold">{usage.customers}</p>
                <Progress value={60} className="h-1" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Products</p>
                <p className="text-xl font-semibold">{usage.products}</p>
                <Progress value={45} className="h-1" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Storage</p>
                <p className="text-xl font-semibold">{usage.storage_used}</p>
                <Progress value={82} className="h-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Plan Comparison */}
      {selectedPlan && selectedPlan !== currentSubscription.plan_id && (
        <Card className="border-accent">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Change Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-4">
              {SUBSCRIPTION_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={cn(
                    'p-3 rounded-lg border-2 cursor-pointer transition-all',
                    selectedPlan === plan.id ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50',
                    plan.id === currentSubscription.plan_id && 'bg-muted'
                  )}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-sm">{plan.name}</p>
                    {plan.id === currentSubscription.plan_id && (
                      <Badge variant="secondary" className="text-xs">Current</Badge>
                    )}
                  </div>
                  <p className="text-lg font-bold">
                    {plan.price === 0 ? 'Free' : `৳${plan.price.toLocaleString()}`}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {plan.features.slice(0, 2).join(' • ')}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Button
                size="sm"
                onClick={() => handlePlanChange(selectedPlan)}
                disabled={loading || selectedPlan === currentSubscription.plan_id}
              >
                {loading && <Loader2 className="h-3 w-3 mr-2 animate-spin" />}
                Confirm Change
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedPlan(currentSubscription.plan_id)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Methods & Invoices Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Payment Methods */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment Methods
              </CardTitle>
              <Button size="sm" variant="ghost" onClick={() => setPaymentDialogOpen(true)}>
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-2 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-muted">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium capitalize">{method.type}</p>
                    <p className="text-xs text-muted-foreground">
                      {method.phone || `•••• ${method.last4}`}
                    </p>
                  </div>
                </div>
                {method.is_default && (
                  <Badge variant="secondary" className="text-xs">Default</Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Invoices */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Recent Invoices
              </CardTitle>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowAllInvoices(!showAllInvoices)}
              >
                {showAllInvoices ? 'Show Less' : 'View All'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {displayInvoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-2 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-muted">
                    <Receipt className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{invoice.invoice_number}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(invoice.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'} className="text-xs">
                    ৳{invoice.amount}
                  </Badge>
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Payment Method Dialog */}
      <PaymentMethodDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        onSuccess={handlePaymentMethodAdded}
      />
    </div>
  )
}