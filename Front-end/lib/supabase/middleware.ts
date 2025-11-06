import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // refreshing the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // FIXED: Use Set for O(1) lookup instead of O(n) array search
  const publicPaths = new Set(['/', '/benefits', '/pricing', '/contact', '/auth', '/login', '/signup', '/reset-password', '/update-password', '/verify-email', '/callback', '/signout'])
  const isPublicPath = publicPaths.has(request.nextUrl.pathname)

  // Redirect old login/signup routes to new unified auth page
  if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup') {
    const url = request.nextUrl.clone()
    url.pathname = '/auth'
    // Preserve redirectTo if it exists
    if (request.nextUrl.searchParams.has('redirectTo')) {
      url.searchParams.set('redirectTo', request.nextUrl.searchParams.get('redirectTo')!)
    }
    return NextResponse.redirect(url)
  }

  // If user is not authenticated and trying to access protected route
  if (!user && !isPublicPath && !request.nextUrl.pathname.startsWith('/api')) {
    // Redirect to auth page
    const url = request.nextUrl.clone()
    url.pathname = '/auth'
    url.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // If user is authenticated and trying to access auth page
  if (user && request.nextUrl.pathname === '/auth') {
    // Check if user has completed onboarding
    try {
      const backendUrl = process.env.NEXT_PUBLIC_AI_BACKEND_URL || 'http://localhost:5000'
      const session = await supabase.auth.getSession()

      if (session.data.session) {
        const response = await fetch(`${backendUrl}/api/v1/onboarding/status`, {
          headers: {
            'Authorization': `Bearer ${session.data.session.access_token}`
          }
        })

        const onboardingData = await response.json()

        if (onboardingData.success && !onboardingData.data.hasCompletedOnboarding) {
          // Redirect to onboarding if not completed
          const url = request.nextUrl.clone()
          url.pathname = '/onboarding'
          return NextResponse.redirect(url)
        }
      }
    } catch {
      // If we can't check, redirect to onboarding to be safe
      const url = request.nextUrl.clone()
      url.pathname = '/onboarding'
      return NextResponse.redirect(url)
    }

    // If onboarding is completed, redirect to dashboard
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Enforce onboarding completion for all protected routes (except onboarding itself)
  if (user && !isPublicPath && request.nextUrl.pathname !== '/onboarding' && !request.nextUrl.pathname.startsWith('/api')) {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_AI_BACKEND_URL || 'http://localhost:5000'
      const session = await supabase.auth.getSession()

      if (session.data.session) {
        const response = await fetch(`${backendUrl}/api/v1/onboarding/status`, {
          headers: {
            'Authorization': `Bearer ${session.data.session.access_token}`
          }
        })

        const onboardingData = await response.json()

        // If user hasn't completed onboarding, redirect to onboarding
        if (onboardingData.success && !onboardingData.data.hasCompletedOnboarding) {
          const url = request.nextUrl.clone()
          url.pathname = '/onboarding'
          return NextResponse.redirect(url)
        }
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error)
      // Continue if we can't check - better to let user through than block them
    }
  }

  return supabaseResponse
}