"use client"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import {
  Building2,
  Bell,
  Truck,
  Download,
  Trash2,
  Upload,
  User,
  CreditCard,
  MessageSquare
} from "lucide-react"
export default function SettingsPage() {
  return (
    <MainLayout
      breadcrumbs={[
        { label: "Settings" }
      ]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your business profile and application preferences.
          </p>
        </div>
        <div className="grid gap-6">
          {/* Business Profile */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                <CardTitle>Business Profile</CardTitle>
              </div>
              <CardDescription>
                Update your business information and branding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input id="businessName" placeholder="Your Business Name" defaultValue="Zoddy Fashion House" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Select defaultValue="fashion">
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessAddress">Business Address</Label>
                <Textarea
                  id="businessAddress"
                  placeholder="Enter your business address"
                  defaultValue="123 Dhanmondi Road, Dhaka 1205, Bangladesh"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+880 1xxx-xxxxxx" defaultValue="+880 1712-345678" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="business@example.com" defaultValue="owner@zoddyfashion.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo">Business Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-muted rounded-lg flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Logo
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="operatingHours">Operating Hours</Label>
                <Input id="operatingHours" placeholder="e.g., Mon-Sat: 9AM-6PM" defaultValue="Mon-Sat: 9AM-8PM, Sun: 10AM-6PM" />
              </div>
            </CardContent>
          </Card>
          {/* Preferences */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <CardTitle>Preferences</CardTitle>
              </div>
              <CardDescription>
                Customize your application experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select defaultValue="bdt">
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bdt">BDT (৳) - Bangladeshi Taka</SelectItem>
                      <SelectItem value="usd">USD ($) - US Dollar</SelectItem>
                      <SelectItem value="eur">EUR (€) - Euro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select defaultValue="dd-mm-yyyy">
                    <SelectTrigger>
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Time Zone</Label>
                  <Select defaultValue="dhaka">
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dhaka">Asia/Dhaka (GMT+6)</SelectItem>
                      <SelectItem value="kolkata">Asia/Kolkata (GMT+5:30)</SelectItem>
                      <SelectItem value="dubai">Asia/Dubai (GMT+4)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                <CardTitle>Payment Methods</CardTitle>
              </div>
              <CardDescription>
                Configure accepted payment methods for your business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Cash", enabled: true, description: "Cash on delivery" },
                { name: "bKash", enabled: true, description: "Mobile banking" },
                { name: "Nagad", enabled: false, description: "Mobile banking" },
                { name: "Rocket", enabled: false, description: "Mobile banking" },
                { name: "Bank Transfer", enabled: true, description: "Direct bank transfer" },
                { name: "Credit/Debit Card", enabled: false, description: "Card payments" },
              ].map((method) => (
                <div key={method.name} className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label className="text-base">{method.name}</Label>
                    <div className="text-sm text-muted-foreground">{method.description}</div>
                  </div>
                  <Switch defaultChecked={method.enabled} />
                </div>
              ))}
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="defaultPayment">Default Payment Method</Label>
                <Select defaultValue="cash">
                  <SelectTrigger>
                    <SelectValue placeholder="Select default payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bkash">bKash</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          {/* Delivery Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                <CardTitle>Delivery Settings</CardTitle>
              </div>
              <CardDescription>
                Configure delivery options and fees
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deliveryFee">Default Delivery Fee</Label>
                  <Input id="deliveryFee" placeholder="60" defaultValue="60" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="freeDeliveryThreshold">Free Delivery Threshold</Label>
                  <Input id="freeDeliveryThreshold" placeholder="1000" defaultValue="1000" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedDays">Estimated Delivery Days</Label>
                <Input id="estimatedDays" placeholder="e.g., 1-3 business days" defaultValue="1-3 business days" />
              </div>
              <div className="space-y-3">
                <Label>Delivery Zones</Label>
                <div className="space-y-2">
                  {[
                    { zone: "Dhaka City", fee: "৳60", enabled: true },
                    { zone: "Dhaka District", fee: "৳100", enabled: true },
                    { zone: "Outside Dhaka", fee: "৳150", enabled: false },
                  ].map((zone) => (
                    <div key={zone.zone} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Switch defaultChecked={zone.enabled} />
                        <div>
                          <div className="font-medium">{zone.zone}</div>
                          <div className="text-sm text-muted-foreground">Delivery fee: {zone.fee}</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <CardTitle>Notifications</CardTitle>
              </div>
              <CardDescription>
                Manage your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "New Orders", description: "Get notified when you receive new orders", enabled: true },
                { name: "Payment Received", description: "Notification when payments are received", enabled: true },
                { name: "Low Stock Alerts", description: "Alert when product stock is running low", enabled: true },
                { name: "Customer Messages", description: "Notification for customer inquiries", enabled: true },
                { name: "Weekly Reports", description: "Weekly business performance digest", enabled: false },
                { name: "Marketing Reminders", description: "Reminders for marketing activities", enabled: false },
              ].map((notification) => (
                <div key={notification.name} className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label className="text-base">{notification.name}</Label>
                    <div className="text-sm text-muted-foreground">{notification.description}</div>
                  </div>
                  <Switch defaultChecked={notification.enabled} />
                </div>
              ))}
            </CardContent>
          </Card>
          {/* Integrations */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                <CardTitle>Integrations</CardTitle>
              </div>
              <CardDescription>
                Connect with external platforms and services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {[
                  {
                    name: "WhatsApp Business",
                    description: "Connect your WhatsApp Business account",
                    status: "Connected",
                    connected: true
                  },
                  {
                    name: "Telegram Bot",
                    description: "Automate customer service with Telegram",
                    status: "Not Connected",
                    connected: false
                  },
                  {
                    name: "Facebook Page",
                    description: "Link your Facebook business page",
                    status: "Not Connected",
                    connected: false
                  },
                ].map((integration) => (
                  <div key={integration.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <div className="font-medium">{integration.name}</div>
                      <div className="text-sm text-muted-foreground">{integration.description}</div>
                      <div className={`text-sm ${integration.connected ? 'text-green-600' : 'text-muted-foreground'}`}>
                        {integration.status}
                      </div>
                    </div>
                    <Button variant={integration.connected ? "outline" : "default"}>
                      {integration.connected ? "Manage" : "Connect"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          {/* Data Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                <CardTitle>Data Management</CardTitle>
              </div>
              <CardDescription>
                Export, backup, or delete your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="flex flex-col items-center gap-2 h-20">
                  <Download className="h-5 w-5" />
                  <span>Export Data</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center gap-2 h-20">
                  <Download className="h-5 w-5" />
                  <span>Backup Data</span>
                </Button>
                <Button variant="destructive" className="flex flex-col items-center gap-2 h-20">
                  <Trash2 className="h-5 w-5" />
                  <span>Delete Account</span>
                </Button>
              </div>
            </CardContent>
          </Card>
          {/* Save Changes */}
          <div className="flex justify-end gap-4">
            <Button variant="outline">Cancel</Button>
            <Button className="bg-accent hover:bg-accent/90">Save Changes</Button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}