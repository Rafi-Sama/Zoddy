"use client"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { TrendingUp, Mail, Phone, User, Eye, EyeOff, Store } from "lucide-react"
export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [signupMethod, setSignupMethod] = useState<"email" | "phone">("email")
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="flex-1 bg-primary text-primary-foreground p-8 flex flex-col justify-center items-center">
        <div className="max-w-md text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold font-display">Zoddy</h1>
              <p className="text-primary-foreground/80 text-sm">Business Tracker</p>
            </div>
          </div>
          <h2 className="text-2xl font-semibold mb-4">
            Start Your Business Journey Today
          </h2>
          <p className="text-primary-foreground/80 mb-8">
            Join thousands of successful business owners who use Zoddy to track
            their progress and boost their sales.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-left">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20">
                <Store className="h-4 w-4" />
              </div>
              <div>
                <div className="font-medium">Easy Order Management</div>
                <div className="text-sm text-primary-foreground/80">Track all orders in one place</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20">
                <User className="h-4 w-4" />
              </div>
              <div>
                <div className="font-medium">Customer Insights</div>
                <div className="text-sm text-primary-foreground/80">Understand your customers better</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <div className="font-medium">Business Analytics</div>
                <div className="text-sm text-primary-foreground/80">Make data-driven decisions</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Right side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <CardDescription>
              Join Zoddy and start growing your business today
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Signup Method Toggle */}
            <div className="flex rounded-lg border p-1">
              <button
                onClick={() => setSignupMethod("email")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  signupMethod === "email"
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Mail className="h-4 w-4" />
                Email
              </button>
              <button
                onClick={() => setSignupMethod("phone")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  signupMethod === "phone"
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Phone className="h-4 w-4" />
                Phone
              </button>
            </div>
            {/* Signup Form */}
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  placeholder="Your business name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="identifier">
                  {signupMethod === "email" ? "Email Address" : "Phone Number"}
                </Label>
                <Input
                  id="identifier"
                  type={signupMethod === "email" ? "email" : "tel"}
                  placeholder={
                    signupMethod === "email"
                      ? "john@example.com"
                      : "+880 1xxx-xxxxxx"
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">
                  At least 8 characters with numbers and special characters
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <input type="checkbox" className="mt-1 rounded" required />
                <div className="text-sm">
                  I agree to the{" "}
                  <Link href="/terms" className="text-accent hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-accent hover:underline">
                    Privacy Policy
                  </Link>
                </div>
              </div>
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
                Create Account
              </Button>
            </form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            {/* Social Signup */}
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
              <Button variant="outline" className="w-full">
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </Button>
            </div>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-accent hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}