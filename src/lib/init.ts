/**
 * Application initialization script
 * Validates environment and logs important information during app startup
 */

import { logEnvValidation } from './env';
import { BUCKET_NAME } from './r2';

/**
 * Initialize the application
 * This function should be called during app startup
 */
export function initializeApp() {
  console.log('🚀 Initializing Crypto Converter Landing Page...');
  
  // Log Node.js environment
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  
  // Validate environment variables
  const envValid = logEnvValidation();
  
  // Log R2 configuration
  console.log(`📦 R2 Bucket: ${BUCKET_NAME}`);
  
  if (!envValid) {
    console.warn('⚠️ Application initialized with invalid environment. Some features may not work correctly.');
  } else {
    console.log('✅ Application initialized successfully.');
  }
  
  return envValid;
}

// Export a function to check if we're in development mode
export const isDev = () => process.env.NODE_ENV === 'development'; 