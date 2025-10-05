"use client"
import { MarketingLayout } from "@/components/layout/marketing-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  CheckCircle,
  ArrowRight,
  Crown,
  Building,
  Users,
  X,
  Star,
  Phone
} from "lucide-react"
export default function PricingPage() {
  const plans = [
    {
      name: "Free Trial",
      description: "Perfect for testing Zoddy",
      price: "৳0",
      period: "14 days",
      badge: "Try First",
      badgeColor: "bg-blue-100 text-blue-800",
      features: [
        "Up to 50 orders",
        "5 products",
        "2 customers",
        "Basic dashboard",
        "WhatsApp integration",
        "Email support"
      ],
      limitations: [
        "Limited analytics",
        "No payment reminders",
        "No team access"
      ],
      cta: "Start Free Trial",
      ctaVariant: "outline" as const,
      icon: Users
    },
    {
      name: "Starter",
      description: "For small business owners",
      price: "৳৪৯৯",
      period: "month",
      badge: "Most Popular",
      badgeColor: "bg-accent text-accent-foreground",
      popular: true,
      features: [
        "Unlimited orders",
        "Unlimited products",
        "Unlimited customers",
        "Advanced analytics",
        "Payment reminders",
        "WhatsApp automation",
        "Inventory tracking",
        "Customer insights",
        "Export data",
        "Priority support"
      ],
      limitations: [],
      cta: "Get Started",
      ctaVariant: "default" as const,
      icon: Star,
      savings: "Save ৳২,০০০ yearly"
    },
    {
      name: "Growth",
      description: "For growing businesses",
      price: "৳৯৯৯",
      period: "month",
      badge: "Best Value",
      badgeColor: "bg-green-100 text-green-800",
      features: [
        "Everything in Starter",
        "Advanced reporting",
        "Team collaboration (3 users)",
        "API access",
        "Custom integrations",
        "SMS notifications",
        "Advanced automation",
        "Business analytics",
        "Priority phone support",
        "Dedicated account manager"
      ],
      limitations: [],
      cta: "Upgrade to Growth",
      ctaVariant: "default" as const,
      icon: Crown,
      savings: "Save ৳৪,০০০ yearly"
    },
    {
      name: "Enterprise",
      description: "For large businesses",
      price: "Custom",
      period: "contact us",
      badge: "Contact Sales",
      badgeColor: "bg-purple-100 text-purple-800",
      features: [
        "Everything in Growth",
        "Unlimited team members",
        "Custom features",
        "White-label solution",
        "On-premise deployment",
        "24/7 phone support",
        "Custom training",
        "SLA guarantee",
        "Dedicated infrastructure",
        "Compliance support"
      ],
      limitations: [],
      cta: "Contact Sales",
      ctaVariant: "outline" as const,
      icon: Building
    }
  ]
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
      {/* Pricing Cards */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden ${
                plan.popular ? 'ring-2 ring-accent shadow-xl scale-105' : ''
              } hover:shadow-lg transition-all`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-accent text-accent-foreground text-center py-2 text-sm font-medium">
                  Most Popular
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
                  <Badge className={plan.badgeColor}>{plan.badge}</Badge>
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-base">{plan.description}</CardDescription>
                <div className="py-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  {plan.savings && (
                    <div className="text-sm text-green-600 font-medium mt-1">{plan.savings}</div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                  {plan.limitations.map((limitation, i) => (
                    <div key={i} className="flex items-center gap-3 opacity-50">
                      <X className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="text-sm">{limitation}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4">
                  <Link href={plan.name === "Enterprise" ? "/contact" : "/login"}>
                    <Button
                      variant={plan.ctaVariant}
                      className={`w-full ${
                        plan.ctaVariant === 'default' ? 'bg-accent hover:bg-accent/90' : ''
                      }`}
                    >
                      {plan.cta}
                      {plan.name !== "Enterprise" && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
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