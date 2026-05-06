'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Mail, Lock, Loader2, Chrome, Apple } from 'lucide-react'

type AuthStep = 'email' | 'login' | 'signup' | 'verification-sent'

function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  // Get redirect URL from query params (used by middleware)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const redirectTo = searchParams.get('redirectTo') || '/onboarding'

  const [step, setStep] = useState<AuthStep>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isFacebookLoading, setIsFacebookLoading] = useState(false)
  const [isAppleLoading, setIsAppleLoading] = useState(false)

  const supabase = createClient()

  // Check if email exists in the system
  const checkEmailExists = async () => {
    setIsLoading(true)
    try {
      const backendUrl = process.env.NEXT_PUBLIC_AI_BACKEND_URL || 'http://localhost:5000'
      const response = await fetch(`${backendUrl}/api/v1/auth/check-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      // Backend returns { success: true, data: { exists: boolean } }
      if (result.success && result.data?.exists) {
        setStep('login')
      } else {
        setStep('signup')
      }
    } catch (error) {
      console.error('Error checking email:', error);
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle email submission
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your email')
      return
    }
    await checkEmailExists()
  }

  // Handle login for existing users
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error(error.message)
      } else if (data.user) {
        toast.success('Welcome back!')

        // Check if user has completed onboarding
        const backendUrl = process.env.NEXT_PUBLIC_AI_BACKEND_URL || 'http://localhost:5000'
        const response = await fetch(`${backendUrl}/api/v1/onboarding/status`, {
          headers: {
            'Authorization': `Bearer ${data.session.access_token}`
          }
        })
        const onboardingData = await response.json()

        if (onboardingData.success && onboardingData.data.hasCompletedOnboarding) {
          router.push('/dashboard')
        } else {
          router.push('/onboarding')
        }
        router.refresh()
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle signup for new users
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/callback?redirectTo=/onboarding`,
        }
      })

      if (error) {
        toast.error(error.message)
      } else if (data.user) {
        // Check if this is actually a duplicate (Supabase sometimes returns user even if already exists)
        if (data.user.identities && data.user.identities.length === 0) {
          toast.error('This email is already registered. Please sign in instead.')
          setStep('login')
        } else {
          // Successfully created - show verification message
          setStep('verification-sent')
          toast.success('Account created! Please check your email to verify your account.')
        }
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle OAuth login
  const handleOAuthLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    if (provider === 'google') setIsGoogleLoading(true)
    if (provider === 'facebook') setIsFacebookLoading(true)
    if (provider === 'apple') setIsAppleLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/callback?redirectTo=/onboarding`,
        },
      })

      if (error) {
        toast.error(error.message)
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setIsGoogleLoading(false)
      setIsFacebookLoading(false)
      setIsAppleLoading(false)
    }
  }

  // Handle password reset
  const handleForgotPassword = async () => {
    if (!email) {
      toast.error('Please enter your email address first')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Password reset email sent! Please check your inbox.')
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const renderContent = () => {
    switch (step) {
      case 'email':
        return (
          <>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Welcome to Zoddy</CardTitle>
              <CardDescription className="text-center">
                Enter your email to continue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      required
                      className="pl-10"
                      autoFocus
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Continue
                </Button>
              </form>

              <div className="relative">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                  OR
                </span>
              </div>

              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleOAuthLogin('google')}
                  disabled={isGoogleLoading}
                >
                  {isGoogleLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Chrome className="mr-2 h-4 w-4" />
                  )}
                  Continue with Google
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleOAuthLogin('facebook')}
                  disabled={isFacebookLoading}
                >
                  {isFacebookLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  )}
                  Continue with Facebook
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleOAuthLogin('apple')}
                  disabled={isAppleLoading}
                >
                  {isAppleLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Apple className="mr-2 h-4 w-4" />
                  )}
                  Continue with Apple
                </Button>
              </div>
            </CardContent>
          </>
        )

      case 'login':
        return (
          <>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
              <CardDescription className="text-center">
                Sign in to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      value={email}
                      disabled
                      className="pl-10 bg-muted"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('email')
                      setPassword('')
                    }}
                    className="text-xs text-primary hover:underline"
                  >
                    Use different email
                  </button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      required
                      className="pl-10"
                      autoFocus
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign in
                </Button>
              </form>
            </CardContent>
          </>
        )

      case 'signup':
        return (
          <>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Create your account</CardTitle>
              <CardDescription className="text-center">
                Set up your password to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      disabled
                      className="pl-10 bg-muted"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('email')
                      setPassword('')
                      setConfirmPassword('')
                    }}
                    className="text-xs text-primary hover:underline"
                  >
                    Use different email
                  </button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      required
                      className="pl-10"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create account
                </Button>
              </form>
            </CardContent>
          </>
        )

      case 'verification-sent':
        return (
          <>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Check your email</CardTitle>
              <CardDescription className="text-center">
                We&apos;ve sent a verification link to<br />
                <strong>{email}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-4">
                <div className="inline-flex p-4 bg-primary/10 rounded-full">
                  <Mail className="h-12 w-12 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Click the link in the email to verify your account and complete onboarding.
                </p>
                <div className="pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStep('email')
                      setEmail('')
                      setPassword('')
                      setConfirmPassword('')
                    }}
                    className="w-full"
                  >
                    Back to sign in
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        )
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        {renderContent()}
        {step !== 'verification-sent' && (
          <CardFooter>
            <p className="text-xs text-muted-foreground text-center w-full">
              By continuing, you agree to our{' '}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <AuthForm />
    </Suspense>
  )
}
