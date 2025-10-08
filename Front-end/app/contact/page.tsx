"use client"
import { useState } from "react"
import { MarketingLayout } from "@/components/layout/marketing-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Clock,
  MessageCircle,
  Send,
  Building2,
  HelpCircle,
  Lightbulb,
  Phone,
  Mail,
  MapPin,
  Shield,
  Users,
  CheckCircle
} from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    businessName: "",
    inquiryType: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id.replace('-', '')]: value
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      inquiryType: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email ||
        !formData.inquiryType || !formData.subject || !formData.message) {
      alert("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData)
      setIsSubmitting(false)
      setIsSubmitted(true)

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          businessName: "",
          inquiryType: "",
          subject: "",
          message: ""
        })
        setIsSubmitted(false)
      }, 3000)
    }, 1500)
  }
  return (
    <MarketingLayout>
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
              Get in Touch with <span className="text-primary">Zoddy</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Were here to help your business grow. Reach out to us for support,
              partnerships, or just to say hello.
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Send us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {isSubmitted && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
                        <CheckCircle className="h-5 w-5" />
                        <span>Your message has been sent successfully! We&apos;ll get back to you soon.</span>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="first-name">First Name *</Label>
                        <Input
                          id="first-name"
                          placeholder="Rahman"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="last-name">Last Name *</Label>
                        <Input
                          id="last-name"
                          placeholder="Ahmed"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="rahman@business.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          placeholder="+880 1XXX-XXXXXX"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="business-name">Business Name</Label>
                        <Input
                          id="business-name"
                          placeholder="Rahman Electronics"
                          value={formData.businessName}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <Label htmlFor="inquiry-type">Inquiry Type *</Label>
                        <Select
                          value={formData.inquiryType}
                          onValueChange={handleSelectChange}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="support">Technical Support</SelectItem>
                            <SelectItem value="sales">Sales Inquiry</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                            <SelectItem value="billing">Billing Question</SelectItem>
                            <SelectItem value="feature">Feature Request</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        placeholder="How can we help you?"
                        value={formData.subject}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us more about your inquiry..."
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full inline-block" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                    <p className="text-sm text-muted-foreground text-center">
                      We typically respond within 24 hours during business days.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
            {/* Contact Information */}
            <div className="space-y-6">
              {/* Contact Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-muted-foreground">+880 1700-000000</p>
                      <p className="text-muted-foreground">+880 2-9876543</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-muted-foreground">hello@zoddy.com</p>
                      <p className="text-muted-foreground">support@zoddy.com</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-muted-foreground">
                        Level 10, Bashundhara City<br />
                        Panthapath, Dhaka 1205<br />
                        Bangladesh
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Business Hours</p>
                      <p className="text-muted-foreground">
                        Saturday - Thursday<br />
                        9:00 AM - 6:00 PM (BST)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Support Options */}
              <Card>
                <CardHeader>
                  <CardTitle>Other Ways to Get Help</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <HelpCircle className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">Help Center</p>
                        <p className="text-xs text-muted-foreground">Find answers to common questions</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <MessageCircle className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">Live Chat</p>
                        <p className="text-xs text-muted-foreground">Chat with our support team</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">Feature Request</p>
                        <p className="text-xs text-muted-foreground">Suggest new features</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <Shield className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">Security</p>
                        <p className="text-xs text-muted-foreground">Report security issues</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Emergency Contact */}
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-800">Emergency Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-red-700 text-sm mb-3">
                    For urgent technical issues affecting your business operations:
                  </p>
                  <div className="space-y-2">
                    <p className="font-medium text-red-800">+880 1700-URGENT</p>
                    <p className="text-red-700 text-sm">Available 24/7</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          {/* Office Locations */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold font-display text-center mb-12">Our Offices</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Dhaka Headquarters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">
                      Level 10, Bashundhara City<br />
                      Panthapath, Dhaka 1205
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Main office and development center
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Chittagong Office
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">
                      CDA Avenue, Nasirabad<br />
                      Chittagong 4000
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Customer support and sales
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Sylhet Branch
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">
                      Zindabazar Commercial Area<br />
                      Sylhet 3100
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Regional support office
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          {/* FAQ Section */}
          <div className="mt-16 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold font-display text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  question: "How quickly will I get a response?",
                  answer: "We typically respond to inquiries within 24 hours during business days. For urgent issues, we aim to respond within 4 hours."
                },
                {
                  question: "Do you offer phone support?",
                  answer: "Yes! Phone support is available for all paid plans during business hours. Emergency support is available 24/7."
                },
                {
                  question: "Can I schedule a demo?",
                  answer: "Absolutely! Contact our sales team to schedule a personalized demo of Zoddys features for your business."
                },
                {
                  question: "Is there local support in Bangladesh?",
                  answer: "Yes, we have offices in Dhaka, Chittagong, and Sylhet with local support teams who understand your business needs."
                }
              ].map((faq, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  )
}