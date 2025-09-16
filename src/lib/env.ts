/**
 * Environment variable validation utility
 * Ensures all required environment variables are properly set
 */

// Required environment variables for R2 (server-only)
const requiredR2Vars = [
  'CLOUDFLARE_ACCOUNT_ID',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
];

/**
 * Validates that all required environment variables are set
 * @returns Object with validation status and any missing variables
 */
export function validateEnv() {
  const missingVars: string[] = [];
  const invalidVars: string[] = [];
  
  // Check required R2 variables
  requiredR2Vars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  // Optional vars hints/warnings (do not invalidate)
  if (process.env.R2_ENDPOINT &&
      !process.env.R2_ENDPOINT.includes('cloudflarestorage.com') &&
      !process.env.R2_ENDPOINT.includes('r2.cloudflarestorage.com')) {
    invalidVars.push(`R2_ENDPOINT (should contain cloudflarestorage.com)`);
  }

  return {
    isValid: missingVars.length === 0 && invalidVars.length === 0,
    missingVars,
    invalidVars,
  };
}

/**
 * Logs environment validation results
 * Useful during app initialization
 */
export function logEnvValidation() {
  const { isValid, missingVars, invalidVars } = validateEnv();
  
  if (!isValid) {
    if (missingVars.length > 0) {
      console.error('❌ Missing required environment variables:', missingVars.join(', '));
    }
    
    if (invalidVars.length > 0) {
      console.error('❌ Invalid environment variables:', invalidVars.join(', '));
    }
    
    console.error('Please check your .env.local file and ensure all required variables are set correctly.');
    console.error('\nFor Cloudflare R2, make sure your API token has the following permissions:');
    console.error('- Object Read (required for listing and downloading files)');
    console.error('- Object Write (optional, only needed if you plan to upload files)');
    console.error('- Bucket Read (required for listing buckets and checking CORS)');
    console.error('- Bucket Write (optional, only needed if you plan to modify bucket settings)');
  } else {
    console.log('✅ All required environment variables are set and valid.');
    console.log(`- Using R2 bucket: cryptoconverter-downloads`);
    if (process.env.R2_ENDPOINT) {
      console.log(`- R2 endpoint: ${process.env.R2_ENDPOINT}`);
    }
  }
  
  return isValid;
} 