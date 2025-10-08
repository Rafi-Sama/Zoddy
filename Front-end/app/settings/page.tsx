"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Building2,
  Bell,
  Truck,
  Download,
  Upload,
  CreditCard,
  MessageSquare,
  Globe,
  Shield,
  Save,
  ChevronRight,
  MapPin,
  Clock,
  Package,
  Smartphone,
  FileText,
  Zap,
  CheckCircle,
  AlertCircle,
  Palette,
  DollarSign
} from "lucide-react"
import { toast } from "sonner"

// Navigation items for sidebar
const navigationItems = [
  {
    id: "business",
    label: "Business",
    icon: Building2,
    description: "Company information"
  },
  {
    id: "preferences",
    label: "Preferences",
    icon: Palette,
    description: "Display & regional"
  },
  {
    id: "payments",
    label: "Payments",
    icon: CreditCard,
    description: "Payment methods"
  },
  {
    id: "delivery",
    label: "Delivery",
    icon: Truck,
    description: "Shipping settings"
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    description: "Alert preferences"
  },
  {
    id: "integrations",
    label: "Integrations",
    icon: MessageSquare,
    description: "External services"
  },
  {
    id: "data",
    label: "Data & Privacy",
    icon: Shield,
    description: "Data management"
  }
]

function SettingsContent() {
  const searchParams = useSearchParams()
  const [activeSection, setActiveSection] = useState("business")
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const section = searchParams.get("section")
    if (section && navigationItems.some(item => item.id === section)) {
      setActiveSection(section)
    }
  }, [searchParams])

  // Business settings state
  const [businessSettings, setBusinessSettings] = useState({
    name: "Zoddy Fashion House",
    type: "fashion",
    address: "123 Dhanmondi Road, Dhaka 1205, Bangladesh",
    phone: "+880 1712-345678",
    email: "owner@zoddyfashion.com",
    website: "www.zoddyfashion.com",
    operatingHours: "Mon-Sat: 9AM-8PM, Sun: 10AM-6PM",
    registrationNumber: "BRN-2024-001234",
    vatNumber: "VAT-BD-123456"
  })

  // Preferences state
  const [preferences, setPreferences] = useState({
    currency: "bdt",
    dateFormat: "dd-mm-yyyy",
    timezone: "dhaka",
    language: "en",
    theme: "system",
    compactView: true,
    showStockAlerts: true,
    autoBackup: false
  })

  // Payment settings
  const [paymentMethods, setPaymentMethods] = useState({
    cash: true,
    bkash: true,
    nagad: false,
    rocket: false,
    bankTransfer: true,
    card: false,
    defaultMethod: "cash"
  })

  // Delivery settings
  const [deliverySettings, setDeliverySettings] = useState({
    defaultFee: "60",
    freeThreshold: "1000",
    estimatedDays: "1-3 business days",
    zones: [
      { id: 1, name: "Dhaka City", fee: "60", enabled: true },
      { id: 2, name: "Dhaka District", fee: "100", enabled: true },
      { id: 3, name: "Outside Dhaka", fee: "150", enabled: false }
    ]
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    newOrders: true,
    paymentReceived: true,
    lowStock: true,
    customerMessages: true,
    weeklyReports: false,
    marketingReminders: false,
    systemUpdates: true,
    securityAlerts: true
  })

  const handleSaveChanges = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setHasChanges(false)
    toast.success("Settings saved successfully")
  }

  const handleQuickSave = async (setting: string, value: string | boolean | number) => {
    setHasChanges(true)
    await new Promise(resolve => setTimeout(resolve, 300))
    const displayValue = typeof value === 'boolean' ? (value ? 'enabled' : 'disabled') : value
    toast.success(`${setting} ${typeof value === 'boolean' ? '' : 'set to'} ${displayValue}`)
  }

  const renderContent = () => {
    switch (activeSection) {
      case "business":
        return (
          <div className="space-y-4">
            {/* Compact Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">Business Profile</h2>
                <p className="text-sm text-muted-foreground">Manage your business information</p>
              </div>
              <Badge variant="outline" className="text-xs">
                <CheckCircle className="mr-1 h-3 w-3 text-green-600" />
                Verified Business
              </Badge>
            </div>

            {/* Logo and Basic Info Card */}
            <Card>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-white" />
                    </div>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-2 border-background"
                    >
                      <Upload className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{businessSettings.name}</h3>
                    <p className="text-sm text-muted-foreground">Fashion & Clothing</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs h-5">
                        <MapPin className="mr-1 h-2.5 w-2.5" />
                        Dhaka
                      </Badge>
                      <Badge variant="secondary" className="text-xs h-5">
                        <Clock className="mr-1 h-2.5 w-2.5" />
                        Open Now
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* All Business Information in Compact Grid */}
            <Card>
              <CardHeader className="pb-3 pt-4">
                <CardTitle className="text-sm">Business Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Basic Info Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="businessName" className="text-xs">Business Name</Label>
                    <Input
                      id="businessName"
                      value={businessSettings.name}
                      onChange={(e) => {
                        setBusinessSettings(prev => ({ ...prev, name: e.target.value }))
                        setHasChanges(true)
                      }}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="businessType" className="text-xs">Business Type</Label>
                    <Select
                      value={businessSettings.type}
                      onValueChange={(value) => {
                        setBusinessSettings(prev => ({ ...prev, type: value }))
                        setHasChanges(true)
                      }}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fashion">Fashion & Clothing</SelectItem>
                        <SelectItem value="food">Food & Beverages</SelectItem>
                        <SelectItem value="crafts">Handicrafts</SelectItem>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs">Phone Number</Label>
                    <Input
                      id="phone"
                      value={businessSettings.phone}
                      onChange={(e) => {
                        setBusinessSettings(prev => ({ ...prev, phone: e.target.value }))
                        setHasChanges(true)
                      }}
                      className="h-8 text-sm"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={businessSettings.email}
                      onChange={(e) => {
                        setBusinessSettings(prev => ({ ...prev, email: e.target.value }))
                        setHasChanges(true)
                      }}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="website" className="text-xs">Website</Label>
                    <Input
                      id="website"
                      value={businessSettings.website}
                      onChange={(e) => {
                        setBusinessSettings(prev => ({ ...prev, website: e.target.value }))
                        setHasChanges(true)
                      }}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="operatingHours" className="text-xs">Operating Hours</Label>
                    <Input
                      id="operatingHours"
                      value={businessSettings.operatingHours}
                      onChange={(e) => {
                        setBusinessSettings(prev => ({ ...prev, operatingHours: e.target.value }))
                        setHasChanges(true)
                      }}
                      className="h-8 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="businessAddress" className="text-xs">Business Address</Label>
                  <Textarea
                    id="businessAddress"
                    value={businessSettings.address}
                    onChange={(e) => {
                      setBusinessSettings(prev => ({ ...prev, address: e.target.value }))
                      setHasChanges(true)
                    }}
                    rows={2}
                    className="text-sm resize-none"
                  />
                </div>

                <Separator />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="registrationNumber" className="text-xs">Registration Number</Label>
                    <Input
                      id="registrationNumber"
                      value={businessSettings.registrationNumber}
                      onChange={(e) => {
                        setBusinessSettings(prev => ({ ...prev, registrationNumber: e.target.value }))
                        setHasChanges(true)
                      }}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="vatNumber" className="text-xs">VAT Number</Label>
                    <Input
                      id="vatNumber"
                      value={businessSettings.vatNumber}
                      onChange={(e) => {
                        setBusinessSettings(prev => ({ ...prev, vatNumber: e.target.value }))
                        setHasChanges(true)
                      }}
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "preferences":
        return (
          <div className="space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Preferences</h2>
              <p className="text-sm text-muted-foreground">Customize your application experience</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Regional Settings */}
              <Card>
                <CardHeader className="pb-3 pt-4">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Regional Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Currency</Label>
                    <Select
                      value={preferences.currency}
                      onValueChange={(value) => {
                        setPreferences(prev => ({ ...prev, currency: value }))
                        handleQuickSave("Currency", value)
                      }}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bdt">BDT (৳) - Taka</SelectItem>
                        <SelectItem value="usd">USD ($) - Dollar</SelectItem>
                        <SelectItem value="eur">EUR (€) - Euro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Date Format</Label>
                    <Select
                      value={preferences.dateFormat}
                      onValueChange={(value) => {
                        setPreferences(prev => ({ ...prev, dateFormat: value }))
                        handleQuickSave("Date Format", value)
                      }}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Timezone</Label>
                    <Select
                      value={preferences.timezone}
                      onValueChange={(value) => {
                        setPreferences(prev => ({ ...prev, timezone: value }))
                        handleQuickSave("Timezone", value)
                      }}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dhaka">Asia/Dhaka (GMT+6)</SelectItem>
                        <SelectItem value="kolkata">Asia/Kolkata (GMT+5:30)</SelectItem>
                        <SelectItem value="dubai">Asia/Dubai (GMT+4)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Language</Label>
                    <Select
                      value={preferences.language}
                      onValueChange={(value) => {
                        setPreferences(prev => ({ ...prev, language: value }))
                        handleQuickSave("Language", value)
                      }}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Display Settings */}
              <Card>
                <CardHeader className="pb-3 pt-4">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Display Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Theme</Label>
                    <Select
                      value={preferences.theme}
                      onValueChange={(value) => {
                        setPreferences(prev => ({ ...prev, theme: value }))
                        handleQuickSave("Theme", value)
                      }}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <Label className="text-sm font-normal">Compact View</Label>
                    <Switch
                      checked={preferences.compactView}
                      onCheckedChange={(checked) => {
                        setPreferences(prev => ({ ...prev, compactView: checked }))
                        handleQuickSave("Compact View", checked)
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <Label className="text-sm font-normal">Stock Alerts</Label>
                    <Switch
                      checked={preferences.showStockAlerts}
                      onCheckedChange={(checked) => {
                        setPreferences(prev => ({ ...prev, showStockAlerts: checked }))
                        handleQuickSave("Stock Alerts", checked)
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <Label className="text-sm font-normal">Auto Backup</Label>
                    <Switch
                      checked={preferences.autoBackup}
                      onCheckedChange={(checked) => {
                        setPreferences(prev => ({ ...prev, autoBackup: checked }))
                        handleQuickSave("Auto Backup", checked)
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "payments":
        return (
          <div className="space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Payment Methods</h2>
              <p className="text-sm text-muted-foreground">Configure accepted payment methods</p>
            </div>

            <Card>
              <CardContent className="pt-4 space-y-3">
                {[
                  { key: "cash", label: "Cash", desc: "Cash on delivery", icon: DollarSign },
                  { key: "bkash", label: "bKash", desc: "Mobile banking", icon: Smartphone },
                  { key: "nagad", label: "Nagad", desc: "Mobile banking", icon: Smartphone },
                  { key: "rocket", label: "Rocket", desc: "Mobile banking", icon: Smartphone },
                  { key: "bankTransfer", label: "Bank Transfer", desc: "Direct transfer", icon: Building2 },
                  { key: "card", label: "Credit/Debit Card", desc: "Card payments", icon: CreditCard }
                ].map((method) => (
                  <div key={method.key} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <method.icon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label className="text-sm cursor-pointer">{method.label}</Label>
                        <p className="text-xs text-muted-foreground">{method.desc}</p>
                      </div>
                    </div>
                    <Switch
                      checked={paymentMethods[method.key as keyof typeof paymentMethods] as boolean}
                      onCheckedChange={(checked) => {
                        setPaymentMethods(prev => ({ ...prev, [method.key]: checked }))
                        handleQuickSave(method.label, checked ? "enabled" : "disabled")
                      }}
                    />
                  </div>
                ))}

                <Separator />

                <div className="space-y-1.5">
                  <Label className="text-xs">Default Payment Method</Label>
                  <Select
                    value={paymentMethods.defaultMethod}
                    onValueChange={(value) => {
                      setPaymentMethods(prev => ({ ...prev, defaultMethod: value }))
                      handleQuickSave("Default payment", value)
                    }}
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="bkash">bKash</SelectItem>
                      <SelectItem value="bankTransfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "delivery":
        return (
          <div className="space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Delivery Settings</h2>
              <p className="text-sm text-muted-foreground">Configure shipping options and fees</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-3 pt-4">
                  <CardTitle className="text-sm">General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Default Delivery Fee (৳)</Label>
                    <Input
                      value={deliverySettings.defaultFee}
                      onChange={(e) => {
                        setDeliverySettings(prev => ({ ...prev, defaultFee: e.target.value }))
                        setHasChanges(true)
                      }}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Free Delivery Threshold (৳)</Label>
                    <Input
                      value={deliverySettings.freeThreshold}
                      onChange={(e) => {
                        setDeliverySettings(prev => ({ ...prev, freeThreshold: e.target.value }))
                        setHasChanges(true)
                      }}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Estimated Delivery Time</Label>
                    <Input
                      value={deliverySettings.estimatedDays}
                      onChange={(e) => {
                        setDeliverySettings(prev => ({ ...prev, estimatedDays: e.target.value }))
                        setHasChanges(true)
                      }}
                      className="h-8 text-sm"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3 pt-4">
                  <CardTitle className="text-sm">Delivery Zones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {deliverySettings.zones.map((zone) => (
                    <div key={zone.id} className="flex items-center justify-between p-2 rounded-lg border">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={zone.enabled}
                          onCheckedChange={(checked) => {
                            setDeliverySettings(prev => ({
                              ...prev,
                              zones: prev.zones.map(z =>
                                z.id === zone.id ? { ...z, enabled: checked } : z
                              )
                            }))
                            handleQuickSave(zone.name, checked ? "enabled" : "disabled")
                          }}
                        />
                        <div>
                          <p className="text-sm font-medium">{zone.name}</p>
                          <p className="text-xs text-muted-foreground">Fee: ৳{zone.fee}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        Edit
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full h-8 text-xs">
                    <MapPin className="mr-2 h-3 w-3" />
                    Add Zone
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "notifications":
        return (
          <div className="space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Notification Preferences</h2>
              <p className="text-sm text-muted-foreground">Control how you receive updates</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-3 pt-4">
                  <CardTitle className="text-sm">Business Alerts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { key: "newOrders", label: "New Orders", icon: Package },
                    { key: "paymentReceived", label: "Payment Received", icon: DollarSign },
                    { key: "lowStock", label: "Low Stock Alerts", icon: AlertCircle },
                    { key: "customerMessages", label: "Customer Messages", icon: MessageSquare }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-1.5">
                      <div className="flex items-center gap-2.5">
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                        <Label className="text-sm font-normal cursor-pointer">{item.label}</Label>
                      </div>
                      <Switch
                        checked={notifications[item.key as keyof typeof notifications]}
                        onCheckedChange={(checked) => {
                          setNotifications(prev => ({ ...prev, [item.key]: checked }))
                          handleQuickSave(item.label, checked)
                        }}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3 pt-4">
                  <CardTitle className="text-sm">Reports & Updates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { key: "weeklyReports", label: "Weekly Reports", icon: FileText },
                    { key: "marketingReminders", label: "Marketing Tips", icon: Zap },
                    { key: "systemUpdates", label: "System Updates", icon: Download },
                    { key: "securityAlerts", label: "Security Alerts", icon: Shield }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-1.5">
                      <div className="flex items-center gap-2.5">
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                        <Label className="text-sm font-normal cursor-pointer">{item.label}</Label>
                      </div>
                      <Switch
                        checked={notifications[item.key as keyof typeof notifications]}
                        onCheckedChange={(checked) => {
                          setNotifications(prev => ({ ...prev, [item.key]: checked }))
                          handleQuickSave(item.label, checked)
                        }}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "integrations":
        return (
          <div className="space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Integrations</h2>
              <p className="text-sm text-muted-foreground">Connect with external services</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: "WhatsApp Business",
                  description: "Connect your WhatsApp Business",
                  icon: MessageSquare,
                  connected: true,
                  color: "text-green-600"
                },
                {
                  name: "Telegram Bot",
                  description: "Automate with Telegram",
                  icon: MessageSquare,
                  connected: false,
                  color: "text-blue-600"
                },
                {
                  name: "Facebook Page",
                  description: "Link Facebook page",
                  icon: Globe,
                  connected: false,
                  color: "text-blue-700"
                },
                {
                  name: "Instagram Shop",
                  description: "Connect Instagram shop",
                  icon: Package,
                  connected: false,
                  color: "text-purple-600"
                },
                {
                  name: "Google Business",
                  description: "Google My Business",
                  icon: Globe,
                  connected: true,
                  color: "text-orange-600"
                },
                {
                  name: "SMS Gateway",
                  description: "SMS notifications",
                  icon: Smartphone,
                  connected: false,
                  color: "text-gray-600"
                }
              ].map((integration) => (
                <Card key={integration.name} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <integration.icon className={`h-4 w-4 ${integration.color}`} />
                          <p className="font-medium text-sm">{integration.name}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">{integration.description}</p>
                        <Badge
                          variant={integration.connected ? "secondary" : "outline"}
                          className="text-xs h-5"
                        >
                          {integration.connected ? (
                            <>
                              <CheckCircle className="mr-1 h-2.5 w-2.5 text-green-600" />
                              Connected
                            </>
                          ) : (
                            "Not Connected"
                          )}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant={integration.connected ? "outline" : "default"}
                      size="sm"
                      className="w-full mt-3 h-7 text-xs"
                    >
                      {integration.connected ? "Manage" : "Connect"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case "data":
        return (
          <div className="space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Data & Privacy</h2>
              <p className="text-sm text-muted-foreground">Manage your data and privacy settings</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-3 pt-4">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-3">
                    Download all your business data in CSV format
                  </p>
                  <Button variant="outline" size="sm" className="w-full h-8 text-xs">
                    Export All Data
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3 pt-4">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Backup
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-3">
                    Create a backup of your current data
                  </p>
                  <Button variant="outline" size="sm" className="w-full h-8 text-xs">
                    Create Backup
                  </Button>
                </CardContent>
              </Card>

            </div>

            <Card className="border-orange-200 dark:border-orange-900/50">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Data Retention Policy</p>
                    <p className="text-xs text-muted-foreground">
                      Your data is stored securely and retained for 5 years after account closure
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <MainLayout
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Settings" }
      ]}
    >
      <div className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-7rem)] gap-6 w-full">
        {/* Sidebar Navigation */}
        <aside className="lg:w-64 lg:shrink-0 w-full">
          <Card className="lg:h-full">
            <CardHeader className="pb-3 pt-4">
              <CardTitle className="text-base">Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <nav className="flex lg:flex-col overflow-x-auto lg:space-y-1 gap-2 lg:gap-0 pb-2 lg:pb-0">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={cn(
                      "flex items-center gap-2 lg:gap-3 px-3 py-2.5 text-sm rounded-md transition-colors whitespace-nowrap lg:w-full",
                      activeSection === item.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <div className="text-left">
                      <span className="font-medium hidden sm:block">{item.label}</span>
                      <span className="text-xs hidden lg:block opacity-70">{item.description}</span>
                    </div>
                    {activeSection === item.id && (
                      <ChevronRight className="h-3.5 w-3.5 ml-auto hidden lg:inline" />
                    )}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 lg:overflow-y-auto w-full">
          <div className="w-full">
            {renderContent()}

            {/* Floating Save Bar */}
            {hasChanges && (
              <div className="sticky bottom-0 mt-6 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">You have unsaved changes</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setHasChanges(false)}
                    >
                      Discard
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveChanges}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>Saving...</>
                      ) : (
                        <>
                          <Save className="mr-2 h-3.5 w-3.5" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </MainLayout>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SettingsContent />
    </Suspense>
  )
}