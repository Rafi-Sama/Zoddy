import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function CallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; redirectTo?: string }>
}) {
  const params = await searchParams

  if (params.code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(params.code)

    if (!error && data.session) {
      // Check if user has completed onboarding
      try {
        const backendUrl = process.env.NEXT_PUBLIC_AI_BACKEND_URL || 'http://localhost:5000'
        const response = await fetch(`${backendUrl}/api/v1/onboarding/status`, {
          headers: {
            'Authorization': `Bearer ${data.session.access_token}`
          }
        })

        const onboardingData = await response.json()

        // If user hasn't completed onboarding, redirect to onboarding
        if (onboardingData.success && !onboardingData.data.hasCompletedOnboarding) {
          redirect('/onboarding')
        }

        // Otherwise, redirect to the requested page or dashboard
        const redirectTo = params.redirectTo || '/dashboard'
        redirect(redirectTo)
      } catch {
        // If we can't check onboarding status, redirect to onboarding to be safe
        redirect('/onboarding')
      }
    }
  }

  // Return to auth page if there's an error
  redirect('/auth')
}