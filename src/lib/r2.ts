import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { validateEnv } from './env';

// Define AWS error interface
interface AWSError extends Error {
  $metadata?: Record<string, unknown>;
  Code?: string;
  $fault?: string;
}

// Validate environment variables
const { isValid, missingVars } = validateEnv();
if (!isValid) {
  console.error('❌ R2 client initialization failed due to missing environment variables:', missingVars.join(', '));
}

// Bucket name
export const BUCKET_NAME = 'cryptoconverter-downloads';

/**
 * Creates a new S3 client for Cloudflare R2
 * Following Cloudflare R2 best practices as of 2025
 */
export const createR2Client = () => {
  // Ensure we have all required environment variables
  if (!process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY || !process.env.CLOUDFLARE_ACCOUNT_ID) {
    console.error('❌ Missing required R2 credentials');
    // Return a client that will fail gracefully
    return new S3Client({
      region: 'auto',
      endpoint: 'https://example.com',
      credentials: {
        accessKeyId: 'missing',
        secretAccessKey: 'missing',
      },
    });
  }

  // Get the endpoint from environment variables
  const endpoint = process.env.R2_ENDPOINT || `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  
  // Log the endpoint for debugging (redacted for security)
  console.log(`Creating R2 client with endpoint: ${endpoint.substring(0, 15)}...`);

  // Create the client with proper configuration
  // For Cloudflare R2, we need to use the 'auto' region and include the account ID in the endpoint
  return new S3Client({
    region: 'auto',
    endpoint,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true, // Required for Cloudflare R2
  });
};

// Initialize the S3 client for Cloudflare R2
export const r2Client = createR2Client();

/**
 * Get file metadata from R2
 * @param prefix The prefix to filter objects by
 * @returns Array of file metadata objects
 */
export async function getFileMetadata(prefix: string) {
  try {
    // Validate environment before proceeding
    if (!isValid) {
      throw new Error('R2 client not properly configured. Missing environment variables.');
    }
    
    // Create a fresh client for this request
    const client = createR2Client();
    
    console.log(`Fetching files with prefix: ${prefix} from bucket: ${BUCKET_NAME}`);
    
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: prefix,
      // Add a small limit to avoid large responses
      MaxKeys: 10,
    });
    
    console.log('Sending ListObjectsV2Command to R2...');
    const response = await client.send(command);
    console.log(`R2 response received. Found ${response.Contents?.length || 0} objects.`);
    return response.Contents || [];
  } catch (error) {
    console.error('Error fetching file metadata from R2:', error);
    
    // Log additional details for AWS errors
    if (error && typeof error === 'object' && '$metadata' in error) {
      console.error('AWS error metadata:', JSON.stringify((error as AWSError).$metadata, null, 2));
    }
    
    throw error; // Re-throw to allow proper error handling upstream
  }
}

/**
 * Generate a URL for downloading a file
 * @param key The object key in the R2 bucket
 * @returns URL for downloading the file
 */
export async function getDownloadUrl(key: string) {
  try {
    // Always use the public URL if available
    if (process.env.R2_PUBLIC_URL) {
      // For direct downloads from R2 public bucket
      return `${process.env.R2_PUBLIC_URL}/${encodeURIComponent(key)}`;
    }
    
    // Fallback to API route if public URL is not configured
    // This will proxy the download through the Next.js API
    return `/api/download?key=${encodeURIComponent(key)}`;
  } catch (error) {
    console.error('Error generating download URL:', error);
    return '';
  }
}

// Get file size in human-readable format
export function formatFileSize(sizeInBytes: number): string {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`;
  } else if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  } else if (sizeInBytes < 1024 * 1024 * 1024) {
    return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
  } else {
    return `${(sizeInBytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  }
}

// Extract version from filename
export function extractVersionFromFilename(filename: string): string {
  const match = filename.match(/Setup-(\d+\.\d+\.\d+)/i);
  return match ? match[1] : '1.0.0'; // Default to 1.0.0 if not found
}

// Get release date (using file's last modified date)
export function formatReleaseDate(lastModified?: Date): string {
  if (!lastModified) return 'March 8, 2025'; // Default date
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(lastModified);
} 