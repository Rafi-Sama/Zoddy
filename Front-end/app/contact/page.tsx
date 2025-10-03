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
  Users
} from "lucide-react"
export default function ContactPage() {
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
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first-name">First Name *</Label>
                      <Input id="first-name" placeholder="Rahman" />
                    </div>
                    <div>
                      <Label htmlFor="last-name">Last Name *</Label>
                      <Input id="last-name" placeholder="Ahmed" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" type="email" placeholder="rahman@business.com" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="+880 1XXX-XXXXXX" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="business-name">Business Name</Label>
                      <Input id="business-name" placeholder="Rahman Electronics" />
                    </div>
                    <div>
                      <Label htmlFor="inquiry-type">Inquiry Type *</Label>
                      <Select>
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
                    <Input id="subject" placeholder="How can we help you?" />
                  </div>
                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                    />
                  </div>
                  <Button className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <p className="text-sm text-muted-foreground text-center">
                    We typically respond within 24 hours during business days.
                  </p>
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