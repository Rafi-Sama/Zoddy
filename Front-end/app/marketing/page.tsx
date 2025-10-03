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
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Megaphone,
  TrendingUp,
  Eye,
  MousePointer,
  Share2,
  MessageCircle,
  Facebook,
  Instagram,
  Plus,
  Play,
  Pause,
  Edit,
  Clock,
  DollarSign,
  Send,
  Settings,
  Gift,
  Tag,
  Target,
  BarChart3,
  Mail,
  Users,
  Calendar,
  Zap,
  Star,
  Globe
} from "lucide-react"
export default function MarketingPage() {
  return (
    <MainLayout
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Marketing" }
      ]}
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display">Marketing Tools</h1>
            <p className="text-muted-foreground">
              Create campaigns, track performance, and grow your customer base
            </p>
          </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Marketing Campaign</DialogTitle>
                <DialogDescription>
                  Set up a new marketing campaign to reach your target audience
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="campaign-name">Campaign Name</Label>
                    <Input id="campaign-name" placeholder="Eid Special Offer 2024" />
                  </div>
                  <div>
                    <Label htmlFor="campaign-type">Campaign Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email Marketing</SelectItem>
                        <SelectItem value="social">Social Media</SelectItem>
                        <SelectItem value="sms">SMS Campaign</SelectItem>
                        <SelectItem value="discount">Discount Promotion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="target-audience">Target Audience</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Customers</SelectItem>
                      <SelectItem value="vip">VIP Customers</SelectItem>
                      <SelectItem value="new">New Customers</SelectItem>
                      <SelectItem value="inactive">Inactive Customers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="message">Campaign Message</Label>
                  <Textarea id="message" placeholder="Your marketing message..." rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input id="start-date" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="budget">Budget (৳)</Label>
                    <Input id="budget" placeholder="5000" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Save Draft</Button>
                  <Button>Launch Campaign</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {/* Marketing Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2 this week
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24,567</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +18.2% this month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8%</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +0.3% this month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marketing ROI</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2x</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +0.8x this month
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Active Campaigns & Performance */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Active Campaigns</CardTitle>
            <Button variant="outline" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "Eid Special Discount",
                  type: "Email + Social",
                  status: "running",
                  reach: 12500,
                  clicks: 890,
                  conversions: 45,
                  budget: 8000,
                  spent: 6200
                },
                {
                  name: "New Product Launch",
                  type: "Social Media",
                  status: "running",
                  reach: 8900,
                  clicks: 560,
                  conversions: 28,
                  budget: 5000,
                  spent: 4100
                },
                {
                  name: "Customer Retention",
                  type: "Email",
                  status: "scheduled",
                  reach: 0,
                  clicks: 0,
                  conversions: 0,
                  budget: 3000,
                  spent: 0
                }
              ].map((campaign, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Target className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{campaign.name}</h4>
                      <p className="text-sm text-muted-foreground">{campaign.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-sm font-medium">{campaign.reach.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Reach</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">{campaign.clicks}</p>
                      <p className="text-xs text-muted-foreground">Clicks</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">{campaign.conversions}</p>
                      <p className="text-xs text-muted-foreground">Sales</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">৳{campaign.spent}/৳{campaign.budget}</p>
                      <p className="text-xs text-muted-foreground">Budget</p>
                    </div>
                    <Badge variant={campaign.status === 'running' ? 'default' : 'secondary'}>
                      {campaign.status === 'running' ? (
                        <Play className="h-3 w-3 mr-1" />
                      ) : (
                        <Clock className="h-3 w-3 mr-1" />
                      )}
                      {campaign.status}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        {campaign.status === 'running' ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Channel Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Facebook className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Facebook</span>
                </div>
                <div className="text-sm font-medium">4.8% CTR</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Instagram className="h-4 w-4 text-pink-600" />
                  <span className="text-sm">Instagram</span>
                </div>
                <div className="text-sm font-medium">6.2% CTR</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Email</span>
                </div>
                <div className="text-sm font-medium">12.5% CTR</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">WhatsApp</span>
                </div>
                <div className="text-sm font-medium">18.3% CTR</div>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Best Performer</span>
                <span className="font-medium text-green-600">WhatsApp</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Spent</span>
                <span className="font-medium">৳45,600</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Avg. CPC</span>
                <span className="font-medium">৳12.50</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Marketing Tools */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Marketing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subscribers</span>
                <span className="font-medium">2,847</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Open Rate</span>
                <span className="font-medium text-green-600">24.5%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Click Rate</span>
                <span className="font-medium text-blue-600">12.8%</span>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Button className="w-full" variant="outline">
                <Send className="h-4 w-4 mr-2" />
                Create Email Campaign
              </Button>
              <Button className="w-full" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Manage Subscribers
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Social Media
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2 p-2 border rounded">
                <Facebook className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-xs font-medium">1.2K</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-2 border rounded">
                <Instagram className="h-4 w-4 text-pink-600" />
                <div>
                  <p className="text-xs font-medium">890</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Button className="w-full" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
              <Button className="w-full" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Posts
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Promotions & Offers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Active Offers</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Redemptions</span>
                <span className="font-medium text-green-600">156</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Revenue Generated</span>
                <span className="font-medium text-blue-600">৳45,600</span>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Button className="w-full" variant="outline">
                <Tag className="h-4 w-4 mr-2" />
                Create Discount
              </Button>
              <Button className="w-full" variant="outline">
                <Gift className="h-4 w-4 mr-2" />
                Loyalty Program
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Quick Actions & Templates */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Campaign Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                { name: "Welcome Series", description: "Onboard new customers", icon: Users },
                { name: "Flash Sale", description: "Limited time offers", icon: Tag },
                { name: "Product Launch", description: "Introduce new products", icon: Star },
                { name: "Re-engagement", description: "Win back customers", icon: Target },
                { name: "Seasonal Campaign", description: "Holiday promotions", icon: Calendar },
                { name: "Referral Program", description: "Customer referrals", icon: Share2 }
              ].map((template, i) => (
                <div key={i} className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded">
                      <template.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{template.name}</p>
                      <p className="text-xs text-muted-foreground">{template.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Marketing Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Auto-send Welcome Emails</p>
                  <p className="text-xs text-muted-foreground">Automatically welcome new customers</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Abandoned Cart Reminders</p>
                  <p className="text-xs text-muted-foreground">Recover lost sales</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Social Media Auto-posting</p>
                  <p className="text-xs text-muted-foreground">Share new products automatically</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Review Request Emails</p>
                  <p className="text-xs text-muted-foreground">Ask for reviews after purchase</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
            <Separator />
            <Button className="w-full" variant="outline">
              <Globe className="h-4 w-4 mr-2" />
              Manage Integrations
            </Button>
          </CardContent>
        </Card>
      </div>
      </div>
    </MainLayout>
  )
}