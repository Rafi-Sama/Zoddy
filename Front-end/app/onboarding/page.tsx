"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  Palette,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Package,
  Store,
  Upload,
  Camera,
  Users,
  Wallet,
  ShoppingBag,
  Settings,
  Target,
  CreditCard,
  Calendar
} from "lucide-react"
export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 5
  const steps = [
    {
      id: 1,
      title: "Welcome to Zoddy",
      subtitle: "Let's get to know your business",
      icon: Sparkles
    },
    {
      id: 2,
      title: "Business Information",
      subtitle: "Tell us about your business",
      icon: Building2
    },
    {
      id: 3,
      title: "Business Goals",
      subtitle: "What are your priorities?",
      icon: Target
    },
    {
      id: 4,
      title: "Setup Preferences",
      subtitle: "Customize your experience",
      icon: Palette
    },
    {
      id: 5,
      title: "You're All Set!",
      subtitle: "Ready to grow your business",
      icon: CheckCircle
    }
  ]
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-6 bg-primary/10 rounded-full">
                <Sparkles className="h-16 w-16 text-primary" />
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold font-display">Welcome to Zoddy!</h2>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Were excited to help you transform your small business with data-driven growth tools.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3 max-w-2xl mx-auto">
              <div className="text-center space-y-2">
                <TrendingUp className="h-8 w-8 text-primary mx-auto" />
                <h3 className="font-semibold">Boost Sales</h3>
                <p className="text-sm text-muted-foreground">Increase revenue with smart insights</p>
              </div>
              <div className="text-center space-y-2">
                <Users className="h-8 w-8 text-primary mx-auto" />
                <h3 className="font-semibold">Understand Customers</h3>
                <p className="text-sm text-muted-foreground">Know your customers better</p>
              </div>
              <div className="text-center space-y-2">
                <Package className="h-8 w-8 text-primary mx-auto" />
                <h3 className="font-semibold">Manage Inventory</h3>
                <p className="text-sm text-muted-foreground">Never run out of stock</p>
              </div>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Building2 className="h-12 w-12 text-primary mx-auto" />
              <h2 className="text-2xl font-bold font-display">Tell us about your business</h2>
              <p className="text-muted-foreground">This helps us personalize your Zoddy experience</p>
            </div>
            <div className="grid gap-6 max-w-2xl mx-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="business-name">Business Name *</Label>
                  <Input id="business-name" placeholder="Rahman Electronics" />
                </div>
                <div>
                  <Label htmlFor="business-type">Business Type *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retail">Retail Store</SelectItem>
                      <SelectItem value="restaurant">Restaurant</SelectItem>
                      <SelectItem value="service">Service Business</SelectItem>
                      <SelectItem value="online">Online Store</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select division" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dhaka">Dhaka</SelectItem>
                      <SelectItem value="chittagong">Chittagong</SelectItem>
                      <SelectItem value="rajshahi">Rajshahi</SelectItem>
                      <SelectItem value="khulna">Khulna</SelectItem>
                      <SelectItem value="sylhet">Sylhet</SelectItem>
                      <SelectItem value="barisal">Barisal</SelectItem>
                      <SelectItem value="rangpur">Rangpur</SelectItem>
                      <SelectItem value="mymensingh">Mymensingh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="employees">Number of Employees</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Just me</SelectItem>
                      <SelectItem value="2-5">2-5 employees</SelectItem>
                      <SelectItem value="6-10">6-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="50+">50+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="address">Business Address</Label>
                <Textarea id="address" placeholder="Enter your business address..." rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+880 1XXX-XXXXXX" />
                </div>
                <div>
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input id="website" placeholder="www.yourbusiness.com" />
                </div>
              </div>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Target className="h-12 w-12 text-primary mx-auto" />
              <h2 className="text-2xl font-bold font-display">What are your main goals?</h2>
              <p className="text-muted-foreground">Select your top priorities (choose up to 3)</p>
            </div>
            <div className="grid gap-4 max-w-2xl mx-auto">
              {[
                {
                  icon: TrendingUp,
                  title: "Increase Sales Revenue",
                  description: "Boost overall sales and profitability"
                },
                {
                  icon: Users,
                  title: "Grow Customer Base",
                  description: "Attract and retain more customers"
                },
                {
                  icon: Package,
                  title: "Better Inventory Management",
                  description: "Optimize stock levels and reduce waste"
                },
                {
                  icon: Wallet,
                  title: "Improve Cash Flow",
                  description: "Better financial management and planning"
                },
                {
                  icon: ShoppingBag,
                  title: "Go Digital/Online",
                  description: "Establish online presence and e-commerce"
                },
                {
                  icon: Settings,
                  title: "Streamline Operations",
                  description: "Improve efficiency and save time"
                }
              ].map((goal, i) => (
                <div key={i} className="p-4 border rounded-lg hover:bg-primary/5 cursor-pointer transition-all group">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-primary/10 rounded group-hover:bg-primary/20 transition-colors">
                      <goal.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold group-hover:text-primary transition-colors">{goal.title}</h3>
                      <p className="text-sm text-muted-foreground">{goal.description}</p>
                    </div>
                    <div className="w-4 h-4 border-2 border-primary rounded group-hover:bg-primary/20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Palette className="h-12 w-12 text-primary mx-auto" />
              <h2 className="text-2xl font-bold font-display">Customize your experience</h2>
              <p className="text-muted-foreground">Set up your preferences and integrations</p>
            </div>
            <div className="grid gap-6 max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Store className="h-5 w-5" />
                    Business Logo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">Upload your business logo</p>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CreditCard className="h-5 w-5" />
                    Payment Methods
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">Select payment methods you accept</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: "Cash", popular: true },
                      { name: "bKash", popular: true },
                      { name: "Nagad", popular: true },
                      { name: "Rocket", popular: false },
                      { name: "Bank Transfer", popular: false },
                      { name: "Credit/Debit Card", popular: false }
                    ].map((method, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded">
                        <span className="text-sm">{method.name}</span>
                        <div className="flex items-center space-x-2">
                          {method.popular && <Badge variant="secondary" className="text-xs">Popular</Badge>}
                          <div className="w-4 h-4 border-2 border-primary rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5" />
                    Business Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Opens At</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="9:00 AM" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="8">8:00 AM</SelectItem>
                          <SelectItem value="9">9:00 AM</SelectItem>
                          <SelectItem value="10">10:00 AM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Closes At</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="6:00 PM" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="17">5:00 PM</SelectItem>
                          <SelectItem value="18">6:00 PM</SelectItem>
                          <SelectItem value="19">7:00 PM</SelectItem>
                          <SelectItem value="20">8:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Closed Days</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Friday" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="friday">Friday</SelectItem>
                          <SelectItem value="saturday">Saturday</SelectItem>
                          <SelectItem value="sunday">Sunday</SelectItem>
                          <SelectItem value="none">No closed days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      case 5:
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-6 bg-green-100 rounded-full">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold font-display text-green-600">Congratulations!</h2>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Your Zoddy account is now set up and ready to help grow your business.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3 max-w-2xl mx-auto">
              <Card className="text-center p-4">
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Track Performance</h3>
                <p className="text-sm text-muted-foreground">Monitor sales, customers, and growth</p>
              </Card>
              <Card className="text-center p-4">
                <Package className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Manage Inventory</h3>
                <p className="text-sm text-muted-foreground">Keep track of your stock levels</p>
              </Card>
              <Card className="text-center p-4">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Understand Customers</h3>
                <p className="text-sm text-muted-foreground">Get insights about your customers</p>
              </Card>
            </div>
            <div className="space-y-3">
              <Button size="lg" className="w-full max-w-xs">
                Go to Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <p className="text-sm text-muted-foreground">
                Need help? Check out our{" "}
                <a href="#" className="text-primary hover:underline">
                  getting started guide
                </a>
              </p>
            </div>
          </div>
        )
      default:
        return null
    }
  }
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold font-display">Setup Your Account</h1>
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
        {/* Step Indicators */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center space-y-2">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    currentStep >= step.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <step.icon className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-xs text-muted-foreground hidden md:block">{step.subtitle}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="absolute top-6 left-1/2 w-full h-0.5 bg-muted -z-10 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Step Content */}
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>
        {/* Navigation */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={nextStep}
              disabled={currentStep === totalSteps}
              className="flex items-center"
            >
              {currentStep === totalSteps ? "Get Started" : "Next"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}