"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { TrendingUp, Menu, X } from "lucide-react"
import { useState } from "react"

interface MarketingLayoutProps {
  children: React.ReactNode
}

export function MarketingLayout({ children }: MarketingLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <TrendingUp className="h-4 w-4" />
            </div>
            <span className="font-bold font-display text-lg sm:text-xl">Zoddy</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="#features" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Features
            </Link>
            <Link href="/pricing" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Pricing
            </Link>
            <Link href="#testimonials" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Success Stories
            </Link>
            <Link href="#about" className="transition-colors hover:text-foreground/80 text-foreground/60">
              About
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/login">
              <Button className="bg-accent hover:bg-accent/90" size="sm">Get Started Free</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur">
            <nav className="container mx-auto px-4 py-4 flex flex-col space-y-3">
              <Link href="#features" className="text-foreground/60 hover:text-foreground transition-colors py-2 text-sm">
                Features
              </Link>
              <Link href="/pricing" className="text-foreground/60 hover:text-foreground transition-colors py-2 text-sm">
                Pricing
              </Link>
              <Link href="#testimonials" className="text-foreground/60 hover:text-foreground transition-colors py-2 text-sm">
                Success Stories
              </Link>
              <Link href="#about" className="text-foreground/60 hover:text-foreground transition-colors py-2 text-sm">
                About
              </Link>
              <div className="flex flex-col space-y-2 pt-4 border-t">
                <Link href="/login">
                  <Button variant="outline" className="w-full h-11">Sign In</Button>
                </Link>
                <Link href="/login">
                  <Button className="w-full bg-accent hover:bg-accent/90 h-11">Get Started Free</Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <span className="font-bold font-display text-xl">Zoddy</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Empowering small businesses across Bangladesh with data-driven growth tools.
              </p>
              <div className="text-sm text-muted-foreground">
                Made in 🇧🇩 Bangladesh
              </div>
            </div>

            {/* Product */}
            <div className="space-y-4">
              <h4 className="font-semibold">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/login" className="hover:text-foreground transition-colors">Free Trial</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">API</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h4 className="font-semibold">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Tutorials</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Community</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="font-semibold">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Cookie Policy</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Zoddy. All rights reserved. Built for Bangladesh&apos;s growing businesses.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}