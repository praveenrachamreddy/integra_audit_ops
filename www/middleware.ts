import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes (for reference only - actual auth is handled client-side)
const protectedRoutes = ['/dashboard', '/smart-permit', '/audit-genie', '/assistant', '/documents', '/settings'];
const authRoutes = ['/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Note: Authentication is handled client-side using useAuthGuard hook
  // This middleware is kept for potential future server-side auth implementation
  // but currently doesn't perform any authentication checks
  
  return NextResponse.next();
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
};