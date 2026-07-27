import { NextResponse } from 'next/server';
import { parseBackendResponse } from '@/lib/parseBackendResponse';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

/**
 * Middleware to check installation status and redirect to /install if needed
 */
export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow access to install page, settings page (has its own auth), and API routes
  if (pathname.startsWith('/install') || pathname.startsWith('/settings') || pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Check installation status
  try {
    const response = await fetch(`${API_BASE_URL}/api/install`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const data = await parseBackendResponse(response);

    // Only redirect when the backend explicitly reports not installed.
    // Empty/invalid responses usually mean the API is down — don't trap users on /install.
    if (response.ok && !data._emptyBody && !data._invalidJson && !data.installed) {
      const installUrl = new URL('/install', request.url);
      return NextResponse.redirect(installUrl);
    }
  } catch (error) {
    console.error('Error checking installation status in middleware:', error);
    // On network error, allow the request to proceed
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
