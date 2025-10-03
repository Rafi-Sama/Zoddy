import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// Define protected routes that require authentication
// const protectedRoutes = [
//   '/dashboard',
//   '/orders',
//   '/products',
//   '/customers',
//   '/inventory',
//   '/analytics',
//   '/payments',
//   '/marketing',
//   '/settings'
// ]

export function middleware() {
  // DEVELOPMENT MODE: All routes are public for now
  // TODO: Enable authentication when ready for production

  // Uncomment the code below to enable authentication:
  // import type { NextRequest } from 'next/server' at the top and add request parameter
  /*
  const { pathname } = request.nextUrl

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  )

  // For now, simulate authentication check
  // In a real app, you'd check for JWT tokens, session cookies, etc.
  const isAuthenticated = request.cookies.get('auth-token')?.value ||
                         request.headers.get('authorization')

  // If trying to access a protected route without authentication
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If authenticated and trying to access auth pages, redirect to dashboard
  if (isAuthenticated && pathname.startsWith('/auth/')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  */

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}