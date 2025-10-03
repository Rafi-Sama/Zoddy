"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Home,
  ArrowLeft,
  HelpCircle,
  TrendingUp,
  Search
} from "lucide-react"
export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Visual */}
        <div className="mb-8">
          <div className="relative">
            <h1 className="text-9xl font-bold font-display text-primary/20">404</h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="p-4 bg-primary/10 rounded-full">
                <Search className="h-16 w-16 text-primary" />
              </div>
            </div>
          </div>
        </div>
        {/* Error Message */}
        <div className="mb-12 space-y-4">
          <h2 className="text-3xl font-bold font-display">Page Not Found</h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Oops! The page you&apos;re looking for seems to have wandered off.
            Don&apos;t worry, it happens to the best of us.
          </p>
        </div>
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <TrendingUp className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <Button variant="ghost" size="lg" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
        {/* Helpful Links */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="text-center p-4 hover:bg-muted/50 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-center gap-2">
                <Search className="h-4 w-4" />
                Popular Pages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <Link href="/pricing" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="/contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact Us
              </Link>
              <Link href="/about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                About Zoddy
              </Link>
            </CardContent>
          </Card>
          <Card className="text-center p-4 hover:bg-muted/50 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <Link href="/orders" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Orders
              </Link>
              <Link href="/customers" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Customers
              </Link>
              <Link href="/analytics" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Analytics
              </Link>
            </CardContent>
          </Card>
          <Card className="text-center p-4 hover:bg-muted/50 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <Link href="/contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact Support
              </Link>
              <a href="tel:+8801700000000" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Call Us
              </a>
              <a href="mailto:help@zoddy.com" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Email Support
              </a>
            </CardContent>
          </Card>
        </div>
        {/* Footer Message */}
        <div className="text-sm text-muted-foreground">
          <p>
            If you think this is an error, please{" "}
            <Link href="/contact" className="text-primary hover:underline">
              contact our support team
            </Link>{" "}
            and we&apos;ll help you find what you&apos;re looking for.
          </p>
        </div>
      </div>
    </div>
  )
}