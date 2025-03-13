import { NextResponse } from 'next/server';

// This middleware runs on every API request
export function middleware() {
  // Only check environment variables in development
  if (process.env.NODE_ENV === 'development') {
    // Check if we have the required environment variables for R2
    const requiredVars = [
      'CLOUDFLARE_ACCOUNT_ID',
      'R2_ACCESS_KEY_ID',
      'R2_SECRET_ACCESS_KEY',
      'R2_ENDPOINT',
      'R2_PUBLIC_URL',
    ];
    
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      console.warn(`⚠️ Missing env vars: ${missingVars.join(', ')}`);
    }
  }
  
  // Continue with the request - no processing needed
  return NextResponse.next();
}

// Configure the middleware to run only on API routes
export const config = {
  matcher: '/api/:path*',
}; 