"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  User,
  Mail,
  Camera,
  Shield,
  Bell,
  Key,
  Smartphone,
  LogOut,
  Save,
  Edit2,
  ChevronRight,
  Palette,
  FileText,
  HelpCircle,
  MessageSquare,
  Star,
  Zap,
  Activity
} from "lucide-react"
import { toast } from "sonner"

// Navigation items for sidebar
const navigationItems = [
  {
    id: "profile",
    label: "Profile",
    icon: User,
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    id: "security",
    label: "Security",
    icon: Shield,
  },
  {
    id: "preferences",
    label: "Preferences",
    icon: Palette,
  },
  {
    id: "activity",
    label: "Activity",
    icon: Activity,
  },
  {
    id: "help",
    label: "Help",
    icon: HelpCircle,
  }
]

function AccountContent() {
  const searchParams = useSearchParams()
  const [activeSection, setActiveSection] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const section = searchParams.get("section")
    if (section && navigationItems.some(item => item.id === section)) {
      setActiveSection(section)
    }
  }, [searchParams])

  // Form state
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    phone: "+1 (555) 123-4567",
    bio: "Business owner and entrepreneur.",
    company: "Acme Corporation",
    role: "CEO / Founder",
    website: "https://acme-corp.com",
    location: "San Francisco, CA",
    timezone: "PST",
    language: "en",
    avatar: ""
  })

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifications: true,
    smsAlerts: false,
    weeklyReport: true,
    monthlyReport: true,
    productUpdates: false,
    marketingEmails: false
  })

  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: "30",
    loginAlerts: true
  })

  const handleSaveProfile = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setIsEditing(false)
    toast.success("Profile updated successfully")
  }

  const handleQuickSave = async (field: string, value: string | boolean | number) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    toast.success(`${field} updated with value: ${value}`)
  }

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return (
          <div className="space-y-4">
            {/* Compact Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">Profile Settings</h2>
                <p className="text-sm text-muted-foreground">Manage your personal and business information</p>
              </div>
              <Button
                variant={isEditing ? "default" : "outline"}
                size="sm"
                onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
              >
                {isEditing ? (
                  <>
                    <Save className="mr-1.5 h-3.5 w-3.5" />
                    {isSaving ? "Saving..." : "Save"}
                  </>
                ) : (
                  <>
                    <Edit2 className="mr-1.5 h-3.5 w-3.5" />
                    Edit
                  </>
                )}
              </Button>
            </div>

            {/* Avatar and Basic Info Card */}
            <Card>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={profile.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {profile.firstName[0]}{profile.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-2 border-background"
                    >
                      <Camera className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{profile.firstName} {profile.lastName}</h3>
                    <p className="text-sm text-muted-foreground">{profile.role} at {profile.company}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs h-5">
                        <Mail className="mr-1 h-2.5 w-2.5" />
                        Verified
                      </Badge>
                      <Badge variant="secondary" className="text-xs h-5">
                        <Shield className="mr-1 h-2.5 w-2.5" />
                        2FA
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* All Information in One Card */}
            <Card>
              <CardHeader className="pb-3 pt-4">
                <CardTitle className="text-sm">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Personal Info Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName" className="text-xs">First Name</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                      disabled={!isEditing}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName" className="text-xs">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                      disabled={!isEditing}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs">Phone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                      className="h-8 text-sm"
                    />
                  </div>
                </div>

                <Separator />

                {/* Business Info Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="location" className="text-xs">Location</Label>
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                      disabled={!isEditing}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="company" className="text-xs">Company</Label>
                    <Input
                      id="company"
                      value={profile.company}
                      onChange={(e) => setProfile(prev => ({ ...prev, company: e.target.value }))}
                      disabled={!isEditing}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="role" className="text-xs">Role</Label>
                    <Input
                      id="role"
                      value={profile.role}
                      onChange={(e) => setProfile(prev => ({ ...prev, role: e.target.value }))}
                      disabled={!isEditing}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="website" className="text-xs">Website</Label>
                    <Input
                      id="website"
                      value={profile.website}
                      onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                      disabled={!isEditing}
                      className="h-8 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="bio" className="text-xs">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    disabled={!isEditing}
                    rows={2}
                    className="text-sm resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {isEditing && (
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveProfile} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save All Changes"}
                </Button>
              </div>
            )}
          </div>
        )

      case "notifications":
        return (
          <div className="space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Notification Preferences</h2>
              <p className="text-sm text-muted-foreground">Control how you receive updates</p>
            </div>

            <Card>
              <CardContent className="pt-4 space-y-3">
                {[
                  { key: "emailAlerts", label: "Email Notifications", icon: Mail },
                  { key: "pushNotifications", label: "Push Notifications", icon: Bell },
                  { key: "smsAlerts", label: "SMS Alerts", icon: MessageSquare },
                  { key: "weeklyReport", label: "Weekly Reports", icon: FileText },
                  { key: "monthlyReport", label: "Monthly Reports", icon: FileText },
                  { key: "productUpdates", label: "Product Updates", icon: Zap },
                  { key: "marketingEmails", label: "Marketing Emails", icon: Star }
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
        )

      case "security":
        return (
          <div className="space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Security Settings</h2>
              <p className="text-sm text-muted-foreground">Protect your account</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              <Card>
                <CardHeader className="pb-3 pt-4">
                  <CardTitle className="text-sm">Authentication</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-normal">Two-Factor Auth</Label>
                    <Switch
                      checked={security.twoFactor}
                      onCheckedChange={(checked) => {
                        setSecurity(prev => ({ ...prev, twoFactor: checked }))
                        handleQuickSave("2FA", checked)
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-normal">Login Alerts</Label>
                    <Switch
                      checked={security.loginAlerts}
                      onCheckedChange={(checked) => {
                        setSecurity(prev => ({ ...prev, loginAlerts: checked }))
                        handleQuickSave("Login Alerts", checked)
                      }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Session Timeout</Label>
                    <Select
                      value={security.sessionTimeout}
                      onValueChange={(value) => {
                        setSecurity(prev => ({ ...prev, sessionTimeout: value }))
                        handleQuickSave("Session Timeout", value)
                      }}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3 pt-4">
                  <CardTitle className="text-sm">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start h-8">
                    <Key className="mr-2 h-3.5 w-3.5" />
                    Change Password
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start h-8">
                    <Smartphone className="mr-2 h-3.5 w-3.5" />
                    Manage Devices
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start h-8">
                    <Activity className="mr-2 h-3.5 w-3.5" />
                    View Security Log
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "preferences":
        return (
          <div className="space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Preferences</h2>
              <p className="text-sm text-muted-foreground">Customize your experience</p>
            </div>

            <Card>
              <CardHeader className="pb-3 pt-4">
                <CardTitle className="text-sm">Display Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Timezone</Label>
                    <Select defaultValue="PST">
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PST">PST</SelectItem>
                        <SelectItem value="MST">MST</SelectItem>
                        <SelectItem value="CST">CST</SelectItem>
                        <SelectItem value="EST">EST</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Date Format</Label>
                    <Select defaultValue="mm-dd-yyyy">
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Currency</Label>
                    <Select defaultValue="usd">
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD ($)</SelectItem>
                        <SelectItem value="eur">EUR (€)</SelectItem>
                        <SelectItem value="gbp">GBP (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "activity":
        return (
          <div className="space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Account Activity</h2>
              <p className="text-sm text-muted-foreground">Monitor access and sessions</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-3 pt-4">
                  <CardTitle className="text-sm">Active Sessions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { device: "Chrome on MacBook", location: "San Francisco", current: true },
                    { device: "Safari on iPhone", location: "San Francisco", current: false },
                  ].map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg border">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-3.5 w-3.5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{session.device}</p>
                          <p className="text-xs text-muted-foreground">{session.location}</p>
                        </div>
                      </div>
                      {session.current ? (
                        <Badge className="text-xs h-5">Current</Badge>
                      ) : (
                        <Button variant="ghost" size="sm" className="h-6 text-xs">
                          Revoke
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3 pt-4">
                  <CardTitle className="text-sm">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { action: "Password changed", time: "3 days ago", icon: Key },
                    { action: "2FA enabled", time: "1 week ago", icon: Shield },
                    { action: "Email updated", time: "2 weeks ago", icon: Mail },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-2 py-1.5">
                      <activity.icon className="h-3.5 w-3.5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card className="border-orange-200 dark:border-orange-900/50">
              <CardContent className="pt-4 pb-4">
                <Button variant="outline" size="sm" className="w-full text-orange-600 hover:text-orange-700 dark:text-orange-400 h-8">
                  <LogOut className="mr-2 h-3.5 w-3.5" />
                  Sign Out All Other Sessions
                </Button>
              </CardContent>
            </Card>
          </div>
        )

      case "help":
        return (
          <div className="space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Help & Support</h2>
              <p className="text-sm text-muted-foreground">Get help and find answers</p>
            </div>

            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {[
                { title: "Docs", icon: FileText, color: "text-blue-600" },
                { title: "Support", icon: MessageSquare, color: "text-green-600" },
                { title: "FAQs", icon: HelpCircle, color: "text-purple-600" },
                { title: "Updates", icon: Zap, color: "text-orange-600" },
              ].map((item, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-all">
                  <CardContent className="pt-4 pb-4 text-center">
                    <item.icon className={`h-8 w-8 mb-2 mx-auto ${item.color}`} />
                    <p className="text-sm font-medium">{item.title}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-medium">All systems operational</span>
                  </div>
                  <Badge variant="outline" className="text-xs">99.99% Uptime</Badge>
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
        { label: "Account Settings" }
      ]}
    >
      <div className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-7rem)] gap-6 w-full">
        {/* Fixed Sidebar - Better width for readability - Hidden on mobile, shows as tabs */}
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
                    <span className="text-left font-medium hidden sm:inline">{item.label}</span>
                    {activeSection === item.id && (
                      <ChevronRight className="h-3.5 w-3.5 ml-auto hidden lg:inline" />
                    )}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </aside>

        {/* Full Width Content Area */}
        <main className="flex-1 lg:overflow-y-auto w-full">
          <div className="w-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </MainLayout>
  )
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AccountContent />
    </Suspense>
  )
}