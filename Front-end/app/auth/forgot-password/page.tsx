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
import { TrendingUp, ArrowLeft, CheckCircle, Shield, Mail, Phone } from "lucide-react"
export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"request" | "verify" | "reset">("request")
  const [resetMethod, setResetMethod] = useState<"email" | "phone">("email")
  const handleRequestReset = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("verify")
  }
  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("reset")
  }
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle password reset
  }
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
            Secure Account Recovery
          </h2>
          <p className="text-primary-foreground/80 mb-8">
            Don&apos;t worry! We&apos;ll help you get back into your account safely
            and securely. Your business data is always protected.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-left">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <div className="font-medium">Secure Process</div>
                <div className="text-sm text-primary-foreground/80">Multi-step verification</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <div className="font-medium">Multiple Options</div>
                <div className="text-sm text-primary-foreground/80">Email or SMS recovery</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20">
                <CheckCircle className="h-4 w-4" />
              </div>
              <div>
                <div className="font-medium">Quick Recovery</div>
                <div className="text-sm text-primary-foreground/80">Back to business in minutes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Right side - Reset Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          {step === "request" && (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
                <CardDescription>
                  Enter your email or phone number to receive a verification code
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Reset Method Toggle */}
                <div className="flex rounded-lg border p-1">
                  <button
                    onClick={() => setResetMethod("email")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      resetMethod === "email"
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </button>
                  <button
                    onClick={() => setResetMethod("phone")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      resetMethod === "phone"
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Phone className="h-4 w-4" />
                    Phone
                  </button>
                </div>
                <form onSubmit={handleRequestReset} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="identifier">
                      {resetMethod === "email" ? "Email Address" : "Phone Number"}
                    </Label>
                    <Input
                      id="identifier"
                      type={resetMethod === "email" ? "email" : "tel"}
                      placeholder={
                        resetMethod === "email"
                          ? "Enter your email"
                          : "Enter your phone number"
                      }
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
                    Send Verification Code
                  </Button>
                </form>
                <div className="text-center">
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center gap-2 text-sm text-accent hover:underline"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                  </Link>
                </div>
              </CardContent>
            </>
          )}
          {step === "verify" && (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Verify Code</CardTitle>
                <CardDescription>
                  Weve sent a 6-digit code to your {resetMethod}. Enter it below.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp">Verification Code</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      className="text-center text-lg tracking-widest"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
                    Verify Code
                  </Button>
                </form>
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Didnt receive the code?
                  </p>
                  <Button variant="ghost" className="text-accent hover:underline">
                    Resend Code (0:30)
                  </Button>
                </div>
                <div className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => setStep("request")}
                    className="inline-flex items-center gap-2 text-sm text-accent hover:underline"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Change {resetMethod}
                  </Button>
                </div>
              </CardContent>
            </>
          )}
          {step === "reset" && (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Create New Password</CardTitle>
                <CardDescription>
                  Choose a strong password for your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Enter new password"
                      required
                    />
                    <div className="text-xs text-muted-foreground">
                      At least 8 characters with numbers and special characters
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                    <Input
                      id="confirmNewPassword"
                      type="password"
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
                    Reset Password
                  </Button>
                </form>
                <div className="text-center">
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center gap-2 text-sm text-accent hover:underline"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                  </Link>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}