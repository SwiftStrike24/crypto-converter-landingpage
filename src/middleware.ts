import { NextResponse } from 'next/server';

// This middleware runs on every request
export function middleware() {
  // Check if we have the required environment variables for R2
  const requiredVars = [
    'CLOUDFLARE_ACCOUNT_ID',
    'R2_ACCESS_KEY_ID',
    'R2_SECRET_ACCESS_KEY',
    'R2_ENDPOINT',
    'R2_PUBLIC_URL',
  ];
  
  // Log environment status on the server side only
  if (process.env.NODE_ENV === 'development') {
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      console.warn(`⚠️ Some environment variables are missing: ${missingVars.join(', ')}`);
      console.warn('This is fine for development, but make sure they are set in production.');
    }
  }
  
  // Continue with the request
  return NextResponse.next();
}

// Configure the middleware to run only on API routes
export const config = {
  matcher: '/api/:path*',
}; 