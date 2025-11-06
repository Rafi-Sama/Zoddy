"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import confetti from 'canvas-confetti'
import { createClient } from "@/lib/supabase/client"
import {
  Building2,
  CheckCircle,
  Check,
  ArrowRight,
  ArrowLeft,
  Package,
  Users,
  Loader2,
  MessageCircle,
  Truck,
  UserPlus,
  Mail
} from "lucide-react"

interface OnboardingData {
  // Personal Information
  firstName: string
  lastName: string

  // Business Information
  businessName: string
  phone: string

  // Integrations (optional)
  integrations: {
    delivery: string[]
    messaging: string[]
  }

  // Team Members (optional)
  teamMembers: {
    email: string
    role: string
  }[]
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const totalSteps = 3

  const [formData, setFormData] = useState<OnboardingData>({
    firstName: "",
    lastName: "",
    businessName: "",
    phone: "",
    integrations: {
      delivery: [],
      messaging: []
    },
    teamMembers: []
  })

  const [newTeamMember, setNewTeamMember] = useState({ email: "", role: "" })

  const steps = [
    {
      id: 1,
      title: "Business Info",
      subtitle: "Essential details",
      icon: Building2,
      required: true
    },
    {
      id: 2,
      title: "Integrations",
      subtitle: "Connect tools",
      icon: Package,
      required: false
    },
    {
      id: 3,
      title: "Team",
      subtitle: "Invite members",
      icon: Users,
      required: false
    }
  ]

  const handleInputChange = (field: keyof OnboardingData, value: string | { delivery: string[]; messaging: string[] } | { email: string; role: string }[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleIntegrationToggle = (type: 'delivery' | 'messaging', value: string) => {
    setFormData(prev => {
      const current = prev.integrations[type]
      const isSelected = current.includes(value)

      return {
        ...prev,
        integrations: {
          ...prev.integrations,
          [type]: isSelected
            ? current.filter(item => item !== value)
            : [...current, value]
        }
      }
    })
  }

  const addTeamMember = () => {
    if (!newTeamMember.email || !newTeamMember.role) {
      toast.error("Please enter both email and role")
      return
    }

    if (formData.teamMembers.some(m => m.email === newTeamMember.email)) {
      toast.error("This email is already added")
      return
    }

    setFormData(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, newTeamMember]
    }))
    setNewTeamMember({ email: "", role: "" })
    toast.success("Team member added")
  }

  const removeTeamMember = (email: string) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter(m => m.email !== email)
    }))
  }

  const validateBusinessInfo = () => {
    return formData.firstName &&
           formData.lastName &&
           formData.businessName &&
           formData.phone
  }

  const celebrate = () => {
    const duration = 2000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

    const interval: NodeJS.Timeout = setInterval(() => {
      const timeLeft = animationEnd - Date.now()
      if (timeLeft <= 0) return clearInterval(interval)

      const particleCount = 50 * (timeLeft / duration)
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    }, 250)
  }

  const nextStep = () => {
    if (currentStep === 1 && !validateBusinessInfo()) {
      toast.error("Please fill in all required fields")
      return
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipToEnd = () => {
    handleSubmit()
  }

  const handleSubmit = async () => {
    if (!validateBusinessInfo()) {
      toast.error("Please complete the business information first")
      setCurrentStep(1)
      return
    }

    setIsLoading(true)

    try {
      // Get the current session token
      const supabase = createClient()
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !session) {
        toast.error("You must be logged in to complete onboarding")
        window.location.href = '/auth'
        return
      }

      const backendUrl = process.env.NEXT_PUBLIC_AI_BACKEND_URL || 'http://localhost:5000'

      const response = await fetch(`${backendUrl}/api/v1/onboarding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        celebrate()
        toast.success("Welcome to Zoddy! Your business is all set up.")

        // Refresh the organization context
        window.location.href = '/dashboard'
      } else {
        throw new Error(data.message || 'Failed to save onboarding data')
      }
    } catch (error) {
      console.error('Error during onboarding:', error)
      toast.error("Failed to complete onboarding. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5">
            <div className="text-center mb-6">
              <div className="inline-flex p-3 bg-primary/10 rounded-full mb-4">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Tell us about yourself and your business</h2>
              <p className="text-sm text-muted-foreground">Just a few quick fields to get started</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="first-name" className="text-sm">
                    First Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="first-name"
                    placeholder="e.g., Ahmed"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last-name" className="text-sm">
                    Last Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="last-name"
                    placeholder="e.g., Rahman"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="business-name" className="text-sm">
                  Business Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="business-name"
                  placeholder="e.g., Rahman Electronics"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm">
                  Phone Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+880 1XXX-XXXXXX"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-5">
            <div className="text-center mb-6">
              <div className="inline-flex p-3 bg-primary/10 rounded-full mb-4">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Connect Your Tools</h2>
              <p className="text-sm text-muted-foreground">Optional - you can set these up later</p>
            </div>

            {/* Delivery Services */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Delivery Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Pathao",
                    "RedX",
                    "Steadfast",
                    "Sundarban",
                    "Paperfly",
                    "eCourier"
                  ].map((service) => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => handleIntegrationToggle('delivery', service.toLowerCase())}
                      className={`flex items-center justify-between p-2.5 rounded-lg border text-sm transition-colors ${
                        formData.integrations.delivery.includes(service.toLowerCase())
                          ? "bg-primary text-primary-foreground border-primary"
                          : "hover:bg-muted border-input"
                      }`}
                    >
                      <span>{service}</span>
                      {formData.integrations.delivery.includes(service.toLowerCase()) && (
                        <Check className="h-3.5 w-3.5" />
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Messaging Platforms */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Messaging Platforms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "WhatsApp",
                    "Telegram",
                    "Messenger",
                    "Viber",
                    "SMS",
                    "Email"
                  ].map((platform) => (
                    <button
                      key={platform}
                      type="button"
                      onClick={() => handleIntegrationToggle('messaging', platform.toLowerCase())}
                      className={`flex items-center justify-between p-2.5 rounded-lg border text-sm transition-colors ${
                        formData.integrations.messaging.includes(platform.toLowerCase())
                          ? "bg-primary text-primary-foreground border-primary"
                          : "hover:bg-muted border-input"
                      }`}
                    >
                      <span>{platform}</span>
                      {formData.integrations.messaging.includes(platform.toLowerCase()) && (
                        <Check className="h-3.5 w-3.5" />
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 3:
        return (
          <div className="space-y-5">
            <div className="text-center mb-6">
              <div className="inline-flex p-3 bg-primary/10 rounded-full mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Invite Your Team</h2>
              <p className="text-sm text-muted-foreground">Optional - add team members anytime</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Add Team Members</CardTitle>
                <CardDescription className="text-sm">
                  Invite colleagues to collaborate
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="member-email" className="text-sm">Email Address</Label>
                    <Input
                      id="member-email"
                      type="email"
                      placeholder="colleague@example.com"
                      value={newTeamMember.email}
                      onChange={(e) => setNewTeamMember(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="member-role" className="text-sm">Role</Label>
                    <Select
                      value={newTeamMember.role}
                      onValueChange={(value) => setNewTeamMember(prev => ({ ...prev, role: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="support">Support</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="button"
                    onClick={addTeamMember}
                    variant="secondary"
                    className="w-full"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </div>

                {formData.teamMembers.length > 0 && (
                  <>
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium mb-3">Team Members ({formData.teamMembers.length})</p>
                      <div className="space-y-2">
                        {formData.teamMembers.map((member, index) => (
                          <div key={index} className="flex items-center justify-between p-2.5 bg-muted rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="p-1.5 bg-background rounded-full">
                                <Mail className="h-3.5 w-3.5" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{member.email}</p>
                                <p className="text-xs text-muted-foreground">{member.role}</p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeTeamMember(member.email)}
                              className="h-7 px-2 text-xs"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      currentStep > step.id
                        ? "bg-primary text-primary-foreground"
                        : currentStep === step.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{step.id}</span>
                    )}
                  </div>
                  <div className="text-center mt-2">
                    <p className="text-xs font-medium">
                      {step.title}
                      {!step.required && (
                        <Badge variant="secondary" className="ml-1 text-[10px] px-1 py-0">
                          Optional
                        </Badge>
                      )}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 w-full mx-2 transition-colors ${
                      currentStep > step.id ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Card */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={currentStep === 1 ? 'invisible' : ''}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center gap-3">
            {currentStep > 1 && (
              <Button
                variant="ghost"
                onClick={skipToEnd}
                disabled={isLoading}
              >
                Skip to finish
              </Button>
            )}

            <Button
              onClick={nextStep}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : currentStep === totalSteps ? (
                <>
                  Complete Setup
                  <CheckCircle className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}