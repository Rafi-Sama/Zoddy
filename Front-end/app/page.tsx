"use client"
import { MarketingLayout } from "@/components/layout/marketing-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  TrendingUp,
  ShoppingCart,
  Clock,
  Smartphone,
  CheckCircle,
  ArrowRight,
  PlayCircle,
  DollarSign,
  Users,
  BarChart3,
  MessageCircle,
  Star
} from "lucide-react"
export default function Home() {
  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-4">
            🎉 Join 1,000+ successful businesses in Bangladesh
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold font-display tracking-tight mb-6">
            Transform Your <span className="text-accent">Small Business</span> Into a
            <span className="text-primary"> Data-Driven Success</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            From WhatsApp orders to business empire. Zoddy helps Bangladeshs entrepreneurs
            track sales, manage customers, and grow revenue with powerful insights—all in Bangla.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-lg px-8 py-6">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              <PlayCircle className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
          {/* Social Proof */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-accent">৳50L+</div>
              <div className="text-sm text-muted-foreground">Revenue Tracked</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent">1,000+</div>
              <div className="text-sm text-muted-foreground">Active Businesses</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
          </div>
        </div>
      </section>
      {/* Dashboard Preview */}
      <section className="container mx-auto px-4 py-16 bg-muted/30">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            See Your Business Growth in Real-Time
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Beautiful dashboards that show what matters most—your revenue, customers, and growth.
          </p>
        </div>
        {/* Dashboard Screenshot Placeholder */}
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            <div className="bg-background border rounded-xl shadow-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="text-sm text-muted-foreground ml-4">Zoddy Dashboard</div>
              </div>
              {/* Mock Dashboard Content */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-accent">৳45,231</div>
                        <div className="text-sm text-muted-foreground">Revenue</div>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold">152</div>
                        <div className="text-sm text-muted-foreground">Orders</div>
                      </div>
                      <ShoppingCart className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold">89</div>
                        <div className="text-sm text-muted-foreground">Customers</div>
                      </div>
                      <Users className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-orange-600">৳8,450</div>
                        <div className="text-sm text-muted-foreground">Pending</div>
                      </div>
                      <Clock className="h-8 w-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="h-32 bg-gradient-to-r from-accent/20 to-primary/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-16 w-16 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            Everything You Need to Grow Your Business
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From order tracking to customer insights, Zoddy provides all the tools
            you need to run and scale your business efficiently.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: ShoppingCart,
              title: "Smart Order Management",
              description: "Track orders from WhatsApp, Facebook, or phone calls. Never lose a sale again.",
              highlight: "50% time saved"
            },
            {
              icon: Users,
              title: "Customer Intelligence",
              description: "Know your customers better. See who buys what, when, and how often.",
              highlight: "Increase repeat sales"
            },
            {
              icon: BarChart3,
              title: "Business Analytics",
              description: "Beautiful charts showing your growth, profit margins, and key metrics.",
              highlight: "Data-driven decisions"
            },
            {
              icon: MessageCircle,
              title: "WhatsApp Integration",
              description: "Connect your WhatsApp Business for automated order tracking and customer updates.",
              highlight: "Most requested feature"
            },
            {
              icon: DollarSign,
              title: "Payment Tracking",
              description: "Track bKash, cash, bank transfers. Never forget who owes you money.",
              highlight: "Improve cash flow"
            },
            {
              icon: Smartphone,
              title: "Mobile-First Design",
              description: "Works perfectly on your phone. Manage your business from anywhere.",
              highlight: "Works offline too"
            }
          ].map((feature, index) => (
            <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <feature.icon className="h-6 w-6 text-accent" />
                  </div>
                  <Badge variant="secondary" className="text-xs">{feature.highlight}</Badge>
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
      {/* Problem/Solution Section */}
      <section className="container mx-auto px-4 py-16 bg-muted/30">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold font-display mb-6 text-red-600">
              Stop Losing Money on Manual Tracking
            </h2>
            <div className="space-y-4 mb-8">
              {[
                "Lost orders in WhatsApp chats",
                "Customers who never paid",
                "No idea which products sell best",
                "Hours wasted on Excel sheets",
                "Missing growth opportunities"
              ].map((problem, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-muted-foreground">{problem}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold font-display mb-6 text-green-600">
              Zoddy Solves All of This
            </h2>
            <div className="space-y-4 mb-8">
              {[
                "All orders organized automatically",
                "Payment reminders that actually work",
                "Know exactly what to stock more",
                "Automated reporting and insights",
                "Clear growth roadmap"
              ].map((solution, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>{solution}</span>
                </div>
              ))}
            </div>
            <Link href="/auth/signup">
              <Button size="lg" className="bg-accent hover:bg-accent/90">
                Start Growing Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section id="testimonials" className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            Success Stories from Real Businesses
          </h2>
          <p className="text-xl text-muted-foreground">
            See how Zoddy helped these entrepreneurs grow their revenue
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Fatima Rahman",
              business: "Fatimas Fashion House",
              location: "Dhanmondi, Dhaka",
              growth: "300% revenue increase",
              quote: "Zoddy helped me track my WhatsApp orders properly. I discovered I was losing ৳50,000 per month in missed follow-ups!",
              rating: 5
            },
            {
              name: "Ahmed Hassan",
              business: "Hassan Electronics",
              location: "Chittagong",
              growth: "5x customer retention",
              quote: "The customer insights feature is amazing. Now I know exactly when to restock and which customers to focus on.",
              rating: 5
            },
            {
              name: "Nasir Uddin",
              business: "Nasir's Handicrafts",
              location: "Sylhet",
              growth: "2x profit margins",
              quote: "I used to spend 3 hours daily on Excel. Now Zoddy does everything automatically. More time for family!",
              rating: 5
            }
          ].map((testimonial, index) => (
            <Card key={index} className="relative">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="font-bold text-accent">{testimonial.name[0]}</span>
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.business}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <Badge className="mb-4 bg-green-100 text-green-800">{testimonial.growth}</Badge>
                <p className="italic text-sm">&ldquo;{testimonial.quote}&rdquo;</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-br from-accent/10 to-primary/10">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">
            Ready to 3x Your Business Revenue?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join successful business owners who are already using Zoddy to track,
            analyze, and grow their businesses. Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-lg px-8 py-6">
                Start Free Trial - No Credit Card Required
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Setup in 5 minutes</span>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}