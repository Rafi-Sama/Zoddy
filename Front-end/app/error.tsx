"use client"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  RefreshCw,
  Home,
  AlertTriangle,
  Bug,
  TrendingUp,
  Phone,
  Mail
} from "lucide-react"
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Error Visual */}
        <div className="mb-8">
          <div className="relative">
            <h1 className="text-9xl font-bold font-display text-red-500/20">500</h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="p-4 bg-red-500/10 rounded-full">
                <AlertTriangle className="h-16 w-16 text-red-500" />
              </div>
            </div>
          </div>
        </div>
        {/* Error Message */}
        <div className="mb-12 space-y-4">
          <h2 className="text-3xl font-bold font-display">Something went wrong!</h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Were experiencing some technical difficulties. Our team has been
            notified and is working on a fix.
          </p>
          {error.digest && (
            <p className="text-sm text-muted-foreground">
              Error ID: <code className="bg-muted px-2 py-1 rounded text-xs">{error.digest}</code>
            </p>
          )}
        </div>
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button onClick={reset} size="lg" className="w-full sm:w-auto">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button variant="outline" size="lg" onClick={() => window.location.href = "/"}>
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Button>
          <Button variant="outline" size="lg" onClick={() => window.location.href = "/dashboard"}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
        </div>
        {/* Error Details Card */}
        <Card className="mb-8 text-left">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bug className="h-5 w-5" />
              What happened?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                <strong>Common causes:</strong>
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Temporary server overload</li>
                <li>• Network connectivity issues</li>
                <li>• Unexpected data format</li>
                <li>• Service maintenance in progress</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                <strong>What were doing:</strong>
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Our team has been automatically notified</li>
                <li>• Were investigating the issue</li>
                <li>• A fix is being deployed</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        {/* Support Options */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="text-center p-4 hover:bg-muted/50 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-center gap-2">
                <Phone className="h-4 w-4" />
                Emergency Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">For urgent business issues:</p>
              <a
                href="tel:+8801700URGENT"
                className="text-sm font-medium text-primary hover:underline"
              >
                +880 1700-URGENT
              </a>
              <p className="text-xs text-muted-foreground mt-1">Available 24/7</p>
            </CardContent>
          </Card>
          <Card className="text-center p-4 hover:bg-muted/50 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-center gap-2">
                <Mail className="h-4 w-4" />
                Email Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">Report this error:</p>
              <a
                href={`mailto:support@zoddy.com?subject=Error Report&body=Error ID: ${error.digest || 'Unknown'}%0A%0APlease describe what you were trying to do when this error occurred.`}
                className="text-sm font-medium text-primary hover:underline"
              >
                support@zoddy.com
              </a>
              <p className="text-xs text-muted-foreground mt-1">Include error ID if possible</p>
            </CardContent>
          </Card>
          <Card className="text-center p-4 hover:bg-muted/50 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Status Page
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">Check system status:</p>
              <a
                href="https://status.zoddy.com"
                className="text-sm font-medium text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                status.zoddy.com
              </a>
              <p className="text-xs text-muted-foreground mt-1">Real-time updates</p>
            </CardContent>
          </Card>
        </div>
        {/* Temporary Workarounds */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800 text-sm">💡 Temporary Workarounds</CardTitle>
          </CardHeader>
          <CardContent className="text-left">
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Try refreshing the page in a few minutes</li>
              <li>• Clear your browser cache and cookies</li>
              <li>• Try using a different browser or incognito mode</li>
              <li>• Check your internet connection</li>
              <li>• If using mobile app, try the web version</li>
            </ul>
          </CardContent>
        </Card>
        {/* Footer Message */}
        <div className="mt-8 text-sm text-muted-foreground">
          <p>
            We apologize for the inconvenience. Your business data is safe and
            were working to restore full functionality as quickly as possible.
          </p>
        </div>
      </div>
    </div>
  )
}