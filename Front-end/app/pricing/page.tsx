"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MarketingLayout } from "@/components/layout/marketing-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { SUBSCRIPTION_PLANS } from "@/types/billing"
import { toast } from "sonner"
import {
  CheckCircle,
  ArrowRight,
  Crown,
  Building,
  Users,
  Star,
  Phone
} from "lucide-react"
export default function PricingPage() {
  const router = useRouter()
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("monthly")

  const handleGetStarted = (planId: string) => {
    if (planId === 'enterprise') {
      toast.info("Our sales team will contact you shortly!")
      router.push('/contact')
      return
    }
    // Navigate to billing page with selected plan
    router.push(`/account/billing?plan=${planId}&interval=${billingInterval}`)
  }

  const formatPrice = (price: number, interval: "monthly" | "yearly") => {
    if (price === 0) return "Free"
    const displayPrice = interval === "yearly" ? price * 10 : price // 2 months free
    return `৳${displayPrice.toLocaleString('en-BD')}`
  }

  // Use the shared SUBSCRIPTION_PLANS from billing types
  const plans = SUBSCRIPTION_PLANS.map(plan => ({
    ...plan,
    cta: plan.id === 'enterprise' ? 'Contact Sales' : plan.price === 0 ? 'Start Free' : 'Get Started',
    ctaVariant: plan.popular ? 'default' as const : 'outline' as const,
    icon: plan.id === 'free' ? Users : plan.id === 'starter' ? Star : plan.id === 'professional' ? Crown : Building
  }))
  const faqs = [
    {
      question: "Can I change plans anytime?",
      answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately and we'll prorate the billing."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, bKash, Nagad, Rocket, and bank transfers. All payments are processed securely."
    },
    {
      question: "Is there a setup fee?",
      answer: "No setup fees! You can start using Zoddy immediately after signing up. We also provide free onboarding support."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Absolutely! You can cancel your subscription at any time. No long-term contracts or cancellation fees."
    },
    {
      question: "Do you offer support in Bengali?",
      answer: "Yes! Our support team is fluent in both Bengali and English. We understand local business needs."
    },
    {
      question: "Is my data safe and secure?",
      answer: "Your data security is our top priority. We use bank-level encryption and regular backups. Your data belongs to you."
    }
  ]
  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold font-display tracking-tight mb-6">
            Simple, Transparent <span className="text-accent">Pricing</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Choose the perfect plan for your business. Start free, upgrade when youre ready.
            All plans include our core features to help you grow.
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground mb-12">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>No setup fees</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>
      {/* Billing Toggle */}
      <section className="container mx-auto px-4 pb-8">
        <div className="flex items-center justify-center gap-4">
          <Label htmlFor="billing-toggle" className={cn(
            "text-base font-medium",
            billingInterval === "monthly" && "text-primary"
          )}>
            Monthly
          </Label>
          <Switch
            id="billing-toggle"
            checked={billingInterval === "yearly"}
            onCheckedChange={(checked) => setBillingInterval(checked ? "yearly" : "monthly")}
          />
          <Label htmlFor="billing-toggle" className={cn(
            "text-base font-medium",
            billingInterval === "yearly" && "text-primary"
          )}>
            Yearly
            <Badge variant="default" className="ml-2 bg-green-500">
              Save 2 months!
            </Badge>
          </Label>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => {
            const isEnterprise = plan.id === 'enterprise'
            const savings = billingInterval === "yearly" && !isEnterprise && plan.price > 0 ? plan.price * 2 : 0

            return (
              <Card
                key={plan.id}
                className={cn(
                  "relative overflow-hidden hover:shadow-lg transition-all",
                  plan.popular && "ring-2 ring-accent shadow-xl scale-105"
                )}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-accent text-accent-foreground text-center py-2 text-sm font-medium">
                    {plan.badge}
                  </div>
                )}
                <CardHeader className={plan.popular ? 'pt-12' : ''}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-accent/10">
                      {(() => {
                        const Icon = plan.icon
                        return <Icon className="h-6 w-6 text-accent" />
                      })()}
                    </div>
                    {plan.badge && !plan.popular && (
                      <Badge variant="secondary">{plan.badge}</Badge>
                    )}
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                  <div className="py-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">
                        {isEnterprise ? "Custom" : formatPrice(plan.price, billingInterval)}
                      </span>
                      {!isEnterprise && plan.price > 0 && (
                        <span className="text-muted-foreground">
                          /{billingInterval === "yearly" ? "year" : "month"}
                        </span>
                      )}
                    </div>
                    {savings > 0 && (
                      <div className="text-sm text-green-600 font-medium mt-1">
                        Save ৳{savings.toLocaleString('en-BD')} yearly
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {plan.features.slice(0, 6).map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4">
                    <Button
                      variant={plan.ctaVariant}
                      className={cn(
                        "w-full",
                        plan.ctaVariant === 'default' && "bg-accent hover:bg-accent/90"
                      )}
                      onClick={() => handleGetStarted(plan.id)}
                    >
                      {plan.cta}
                      {plan.id !== "enterprise" && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>
      {/* Features Comparison */}
      <section className="container mx-auto px-4 py-16 bg-muted/30">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-display mb-4">
            Compare All Features
          </h2>
          <p className="text-xl text-muted-foreground">
            See exactly whats included in each plan
          </p>
        </div>
        <div className="max-w-6xl mx-auto overflow-x-auto">
          <table className="w-full bg-background rounded-lg shadow">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium">Features</th>
                <th className="text-center p-4 font-medium">Free Trial</th>
                <th className="text-center p-4 font-medium">Starter</th>
                <th className="text-center p-4 font-medium">Growth</th>
                <th className="text-center p-4 font-medium">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: "Orders", free: "50", starter: "Unlimited", growth: "Unlimited", enterprise: "Unlimited" },
                { feature: "Products", free: "5", starter: "Unlimited", growth: "Unlimited", enterprise: "Unlimited" },
                { feature: "Team Members", free: "1", starter: "1", growth: "3", enterprise: "Unlimited" },
                { feature: "WhatsApp Integration", free: "✓", starter: "✓", growth: "✓", enterprise: "✓" },
                { feature: "Analytics", free: "Basic", starter: "Advanced", growth: "Advanced", enterprise: "Custom" },
                { feature: "Payment Reminders", free: "✗", starter: "✓", growth: "✓", enterprise: "✓" },
                { feature: "API Access", free: "✗", starter: "✗", growth: "✓", enterprise: "✓" },
                { feature: "Phone Support", free: "✗", starter: "✗", growth: "✓", enterprise: "24/7" },
              ].map((row, index) => (
                <tr key={index} className="border-b last:border-b-0">
                  <td className="p-4 font-medium">{row.feature}</td>
                  <td className="p-4 text-center">{row.free}</td>
                  <td className="p-4 text-center">{row.starter}</td>
                  <td className="p-4 text-center">{row.growth}</td>
                  <td className="p-4 text-center">{row.enterprise}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-display mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-muted-foreground">
            Real feedback from businesses using Zoddy
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              name: "Rashida Begum",
              business: "Rashidas Boutique",
              plan: "Starter Plan",
              quote: "The Starter plan is perfect for my small boutique. I can track all my orders and the payment reminders saved me ৳25,000 last month!",
              rating: 5
            },
            {
              name: "Karim Sheikh",
              business: "Sheikh Electronics",
              plan: "Growth Plan",
              quote: "Growth plan's team features help me manage my 3 shop assistants. The analytics show exactly which products to order more.",
              rating: 5
            },
            {
              name: "Fatema Khan",
              business: "Khan Handicrafts",
              plan: "Starter Plan",
              quote: "Started with free trial, upgraded to Starter within a week. The WhatsApp integration alone is worth the price!",
              rating: 5
            }
          ].map((testimonial, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="font-bold text-accent">{testimonial.name[0]}</span>
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.business}</div>
                    <Badge variant="outline" className="text-xs mt-1">{testimonial.plan}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="italic text-sm">&ldquo;{testimonial.quote}&rdquo;</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16 bg-muted/30">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-display mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about Zoddy pricing
          </p>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      {/* Final CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl p-12">
          <h2 className="text-3xl font-bold font-display mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of successful businesses. Start your free trial today—no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-lg px-8 py-6">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                <Phone className="mr-2 h-5 w-5" />
                Talk to Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  )
}