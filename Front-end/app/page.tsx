import { MarketingLayout } from "@/components/layout/marketing-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
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

export default async function Home() {
  // Check if user is already authenticated
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If user is signed in, redirect to dashboard
  if (user) {
    redirect('/dashboard')
  }

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
            From WhatsApp orders to business empire. Zoddy helps Bangladesh&apos;s entrepreneurs
            track sales, manage customers, and grow revenue with powerful insights—all in Bangla.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/auth">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8">
              <Link href="#demo">
                <PlayCircle className="mr-2 h-5 w-5" />
                Watch Demo
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground">Orders Processed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">৳2.5Cr</div>
              <div className="text-sm text-muted-foreground">Revenue Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">98%</div>
              <div className="text-sm text-muted-foreground">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="container mx-auto px-4 py-16 border-t">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Sound Familiar? 🤔
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            These are the daily struggles of Bangladeshi online sellers
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-destructive/50 bg-destructive/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-destructive" />
                  Lost in WhatsApp Chaos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Orders scattered across WhatsApp, Facebook, and phone calls.
                  No idea which customer ordered what or when.
                </p>
              </CardContent>
            </Card>

            <Card className="border-destructive/50 bg-destructive/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-destructive" />
                  Money Mystery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  &ldquo;How much did I earn this month?&rdquo; becomes a detective mission
                  through bKash, Nagad, and bank statements.
                </p>
              </CardContent>
            </Card>

            <Card className="border-destructive/50 bg-destructive/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-destructive" />
                  Customer Amnesia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  &ldquo;This customer bought before, but what did they buy?&rdquo;
                  No customer history, no repeat business strategy.
                </p>
              </CardContent>
            </Card>

            <Card className="border-destructive/50 bg-destructive/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-destructive" />
                  Inventory Nightmares
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Promising products you don&apos;t have, missing sales because
                  you forgot to restock popular items.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 border-t">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Everything You Need to <span className="text-primary">Grow Your Business</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Built specifically for Bangladeshi entrepreneurs like you
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-full" />
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <ShoppingCart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Multi-Channel Orders</CardTitle>
                <CardDescription>
                  Manage all your WhatsApp, Facebook, and phone orders in one place.
                  Never lose track of a sale again.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    WhatsApp integration
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Facebook order tracking
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Phone order entry
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-accent/10 rounded-bl-full" />
              <CardHeader>
                <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Bangladesh Payments</CardTitle>
                <CardDescription>
                  Track bKash, Nagad, Rocket, and bank payments. Know exactly
                  where your money is.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    bKash & Nagad tracking
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Partial payment support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Auto payment reminders
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-full" />
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Smart Analytics</CardTitle>
                <CardDescription>
                  See your best products, top customers, and revenue trends.
                  Make data-driven decisions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Daily/monthly reports
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Product performance
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Customer insights
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-accent/10 rounded-bl-full" />
              <CardHeader>
                <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Customer CRM</CardTitle>
                <CardDescription>
                  Build relationships, track purchase history, and create
                  targeted marketing campaigns.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Customer profiles
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Purchase history
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    VIP customer tags
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-full" />
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Inventory Control</CardTitle>
                <CardDescription>
                  Never run out of bestsellers. Get alerts when stock is low
                  and track what&apos;s selling fast.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Stock level tracking
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Low stock alerts
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Supplier management
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-accent/10 rounded-bl-full" />
              <CardHeader>
                <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Mobile First</CardTitle>
                <CardDescription>
                  Manage your entire business from your phone. Works perfectly
                  on any device, anywhere.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Mobile responsive
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Offline support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Quick actions
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="container mx-auto px-4 py-16 border-t bg-muted/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            What Our <span className="text-primary">Successful Sellers</span> Say
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardTitle className="text-lg">Game Changer for My Business!</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  &ldquo;I used to spend hours tracking orders in notebooks. Now Zoddy does
                  everything automatically. My revenue increased 40% in just 3 months!&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">RK</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Rashida Khatun</p>
                    <p className="text-xs text-muted-foreground">Fashion Boutique, Dhaka</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardTitle className="text-lg">Perfect for Online Sellers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  &ldquo;Managing Facebook and WhatsApp orders was a nightmare. Zoddy made it
                  so simple! The Bangla interface is perfect for my team.&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">MH</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Mahmud Hassan</p>
                    <p className="text-xs text-muted-foreground">Electronics Store, Chittagong</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardTitle className="text-lg">Worth Every Taka!</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  &ldquo;The inventory alerts saved me thousands. I never miss restocking
                  bestsellers now. Customer data helps me do targeted marketing.&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">SA</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Shahana Akter</p>
                    <p className="text-xs text-muted-foreground">Cosmetics Business, Sylhet</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 border-t">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to <span className="text-primary">Transform Your Business</span>?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of successful Bangladeshi entrepreneurs.
            Start your free trial today—no credit card required!
          </p>

          <div className="bg-primary/5 rounded-lg p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
              <Badge variant="secondary" className="text-lg px-4 py-1">
                <TrendingUp className="h-4 w-4 mr-2" />
                Limited Time Offer
              </Badge>
              <span className="text-2xl font-bold text-primary">50% OFF</span>
              <span className="text-muted-foreground">First 3 Months</span>
            </div>
            <p className="text-sm text-muted-foreground">
              🎉 Special launch pricing for the next 100 sign-ups only!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/auth">
                Start Free 14-Day Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8">
              <Link href="/pricing">
                View Pricing
              </Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            ✓ No credit card required &nbsp;&nbsp;
            ✓ Full access to all features &nbsp;&nbsp;
            ✓ Cancel anytime
          </p>
        </div>
      </section>
    </MarketingLayout>
  )
}