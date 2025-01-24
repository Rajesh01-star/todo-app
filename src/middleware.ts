import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /dashboard)
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === '/' || path === '/login' || path === '/register'

  // Get the token from cookies
  const token = request.cookies.get('token')?.value || ''

  // Redirect logic
  if (isPublicPath && token) {
    // If user is on a public path but has a token, redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (!isPublicPath && !token) {
    // If user is not on a public path and has no token, redirect to login
    return NextResponse.redirect(new URL('/', request.url))
  }
}

// Configure the paths that middleware will run on
export const config = {
  matcher: [
    '/dashboard',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 