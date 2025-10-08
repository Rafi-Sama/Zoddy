"use client"
import { MarketingLayout } from "@/components/layout/marketing-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Brain,
  Shield,
  Smartphone,
  MessageSquare,
  Calculator,
  BarChart3,
  Users,
  ArrowRight,
  Sparkles,
  HeartHandshake,
  Target,
  ChevronRight
} from "lucide-react"
import { useState } from "react"

export default function BenefitsPage() {
  const [selectedPainPoint, setSelectedPainPoint] = useState(0)

  const painPoints = [
    {
      title: "Lost Orders on WhatsApp",
      description: "Messages getting buried, orders forgotten, customers angry",
      solution: "Never lose another order with our smart tracking system",
      icon: MessageSquare,
      stats: "87% fewer lost orders"
    },
    {
      title: "Manual Calculations Eating Your Time",
      description: "Hours wasted on Excel, still making mistakes",
      solution: "Automated calculations that save 3+ hours daily",
      icon: Calculator,
      stats: "3.5 hours saved daily"
    },
    {
      title: "No Idea What's Actually Profitable",
      description: "Selling blind, no clue which products make money",
      solution: "Real-time profit insights for every single product",
      icon: BarChart3,
      stats: "42% profit increase"
    },
    {
      title: "Customer Data Scattered Everywhere",
      description: "Names in one place, numbers in another, orders lost",
      solution: "Everything about every customer in one place",
      icon: Users,
      stats: "5x faster customer service"
    }
  ]

  const transformations = [
    {
      before: "Spending 4+ hours daily on manual tasks",
      after: "Everything automated in 30 minutes",
      metric: "8x faster"
    },
    {
      before: "Missing 20% of orders due to chaos",
      after: "Zero orders lost with systematic tracking",
      metric: "100% captured"
    },
    {
      before: "Guessing which products to stock",
      after: "Data-driven inventory decisions",
      metric: "45% less waste"
    },
    {
      before: "Customers complaining about delays",
      after: "Proactive updates keeping them happy",
      metric: "98% satisfaction"
    }
  ]

  const socialProof = [
    {
      name: "Fatima's Boutique",
      location: "Dhanmondi",
      review: "আমার ব্যবসা এখন ৩ গুণ বড়! Zoddy ছাড়া আমি আর ভাবতেই পারি না।",
      growth: "3x growth in 6 months",
      avatar: "FB"
    },
    {
      name: "Rahman Electronics",
      location: "Chattogram",
      review: "Finally sleeping peacefully. No more order nightmares!",
      growth: "₹2L to ₹7L monthly",
      avatar: "RE"
    },
    {
      name: "Tasnim's Kitchen",
      location: "Sylhet",
      review: "My husband can't believe how organized I am now!",
      growth: "150+ daily orders managed",
      avatar: "TK"
    }
  ]

  return (
    <MarketingLayout>
      <div className="min-h-screen">
        {/* Emotional Hook Hero */}
        <section className="py-20 px-4 bg-gradient-to-br from-red-50 via-background to-green-50 dark:from-red-950/20 dark:via-background dark:to-green-950/20">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <Badge className="mb-4 px-4 py-1" variant="secondary">
                <Sparkles className="h-3 w-3 mr-1" />
                Join 5,000+ successful sellers
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold font-display mb-6">
                Stop Losing Money Because of
                <span className="text-red-500 block mt-2">Messy WhatsApp Orders</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                You&apos;re working 14 hours a day, still missing orders, and your family barely sees you.
                <span className="font-semibold block mt-2">
                  What if you could manage 10x more orders in half the time?
                </span>
              </p>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Bank-level Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium">24/7 Support in Bangla</span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-medium">Works on Any Phone</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8">
                  Start Free for 14 Days
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8">
                  See Live Demo
                  <Zap className="ml-2 h-5 w-5" />
                </Button>
              </div>

              <p className="text-sm text-muted-foreground mt-4">
                No credit card • Cancel anytime • ৳499/month after trial
              </p>
            </div>

            {/* Visual Impact Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
              <Card className="text-center p-6 border-2 border-green-500/20 bg-green-50/50 dark:bg-green-950/20">
                <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">150%</div>
                <p className="text-sm text-muted-foreground">Average Revenue Increase</p>
              </Card>
              <Card className="text-center p-6 border-2 border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/20">
                <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">3.5hrs</div>
                <p className="text-sm text-muted-foreground">Saved Every Day</p>
              </Card>
              <Card className="text-center p-6 border-2 border-purple-500/20 bg-purple-50/50 dark:bg-purple-950/20">
                <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">5,000+</div>
                <p className="text-sm text-muted-foreground">Happy Sellers</p>
              </Card>
              <Card className="text-center p-6 border-2 border-orange-500/20 bg-orange-50/50 dark:bg-orange-950/20">
                <Shield className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">0%</div>
                <p className="text-sm text-muted-foreground">Orders Lost</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Pain Points & Solutions */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <Badge className="mb-4" variant="destructive">
                <AlertTriangle className="h-3 w-3 mr-1" />
                The Reality
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
                These Problems Are Killing Your Business
              </h2>
              <p className="text-xl text-muted-foreground">
                (And you know it, but didn&apos;t have a solution... until now)
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="space-y-4">
                {painPoints.map((point, idx) => (
                  <Card
                    key={idx}
                    className={`p-6 cursor-pointer transition-all ${
                      selectedPainPoint === idx
                        ? 'border-primary shadow-lg scale-105'
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedPainPoint(idx)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${
                        selectedPainPoint === idx
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}>
                        <point.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold mb-1">{point.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{point.description}</p>
                        <div className="flex items-center gap-2 text-primary">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="text-sm font-medium">{point.solution}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="sticky top-20 h-fit">
                <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10">
                  <Badge className="mb-4" variant="default">
                    <Zap className="h-3 w-3 mr-1" />
                    Your Solution
                  </Badge>
                  <h3 className="text-2xl font-bold mb-4">
                    {painPoints[selectedPainPoint].title} - SOLVED!
                  </h3>
                  <p className="text-lg mb-6">
                    {painPoints[selectedPainPoint].solution}
                  </p>
                  <div className="p-4 bg-background rounded-lg mb-6">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {painPoints[selectedPainPoint].stats}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Average improvement our users see
                    </p>
                  </div>
                  <Button className="w-full" size="lg">
                    See How It Works
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Before/After Transformation */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <Badge className="mb-4" variant="default">
                <Sparkles className="h-3 w-3 mr-1" />
                The Transformation
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
                From Chaos to Control in 14 Days
              </h2>
              <p className="text-xl text-muted-foreground">
                This is exactly what happens when you start using Zoddy
              </p>
            </div>

            <div className="space-y-6">
              {transformations.map((item, idx) => (
                <Card key={idx} className="p-6">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-red-500 mb-2">
                        <AlertTriangle className="h-5 w-5" />
                        <span className="font-medium">BEFORE</span>
                      </div>
                      <p className="text-lg">{item.before}</p>
                    </div>
                    <div className="px-4">
                      <ArrowRight className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-green-500 mb-2">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="font-medium">AFTER</span>
                      </div>
                      <p className="text-lg font-medium">{item.after}</p>
                    </div>
                    <Badge className="text-lg px-4 py-2" variant="default">
                      {item.metric}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <Badge className="mb-4" variant="secondary">
                <HeartHandshake className="h-3 w-3 mr-1" />
                Real Stories
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
                They Were Skeptical Too...
              </h2>
              <p className="text-xl text-muted-foreground">
                Now they can&apos;t imagine running their business without Zoddy
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {socialProof.map((story, idx) => (
                <Card key={idx} className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold">
                      {story.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold">{story.name}</h3>
                      <p className="text-sm text-muted-foreground">{story.location}</p>
                    </div>
                  </div>
                  <p className="text-lg mb-4 italic">&ldquo;{story.review}&rdquo;</p>
                  <Badge variant="secondary" className="w-full justify-center py-2">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    {story.growth}
                  </Badge>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-lg text-muted-foreground mb-6">
                Join 5,000+ Bangladeshi entrepreneurs who&apos;ve transformed their business
              </p>
              <Button size="lg" className="text-lg px-8">
                Start Your Success Story
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* About Us (Brief) */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <Badge className="mb-4" variant="outline">
              <Target className="h-3 w-3 mr-1" />
              Who We Are
            </Badge>
            <h2 className="text-3xl font-bold font-display mb-6">
              Built by Bangladeshis, for Bangladeshis
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              We&apos;re not another foreign company trying to sell you complex software.
              We&apos;re your neighbors who understood your struggles because we lived them.
              Our founders ran WhatsApp businesses, dealt with bKash payments, and lost
              orders in message floods. That&apos;s why Zoddy works exactly how YOU need it to.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6">
                <Brain className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-bold mb-2">We Understand You</h3>
                <p className="text-sm text-muted-foreground">
                  Built specifically for Bangladesh&apos;s unique business environment
                </p>
              </Card>
              <Card className="p-6">
                <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-bold mb-2">Your Data is Safe</h3>
                <p className="text-sm text-muted-foreground">
                  Hosted in Bangladesh, protected by bank-level security
                </p>
              </Card>
              <Card className="p-6">
                <HeartHandshake className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-bold mb-2">We&apos;re Here for You</h3>
                <p className="text-sm text-muted-foreground">
                  24/7 support in Bangla, because your success is our success
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-5xl font-bold font-display mb-6">
              Every Day You Wait, You&apos;re Losing Money
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              While you&apos;re thinking about it, your competitors are already using Zoddy to steal your customers
            </p>
            <div className="bg-background rounded-lg p-8 shadow-lg mb-8">
              <h3 className="text-2xl font-bold mb-4">Start Today, See Results Tomorrow</h3>
              <ul className="text-left max-w-md mx-auto space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>14-day free trial (really free, no tricks)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Full setup support in Bangla</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Import your existing data in minutes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Cancel anytime, no questions asked</span>
                </li>
              </ul>
              <Button size="lg" className="text-lg px-12">
                Yes, I Want to Grow My Business
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Join 5,000+ successful sellers • ৳499/month after trial
              </p>
            </div>
          </div>
        </section>
      </div>
    </MarketingLayout>
  )
}