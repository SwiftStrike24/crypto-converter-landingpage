import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware ensures that API routes are treated as dynamic
export function middleware(request: NextRequest) {
  // Add cache control headers to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
  }
  
  return NextResponse.next();
}

// Configure the middleware to run only on API routes
export const config = {
  matcher: ['/api/:path*'],
}; 