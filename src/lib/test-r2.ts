/**
 * Test script for Cloudflare R2 connection
 * Run with: npx tsx src/lib/test-r2.ts
 */

import { S3Client, ListObjectsV2Command, GetBucketCorsCommand } from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';

console.log('Starting R2 connection test...');

// Load environment variables from .env.local
try {
  console.log('Loading environment variables from .env.local...');
  dotenv.config({ path: '.env.local' });
  console.log('Environment variables loaded successfully.');
} catch (error) {
  console.error('Error loading environment variables:', error);
}

// Bucket name
const BUCKET_NAME = 'cryptoconverter-downloads';

async function testR2Connection() {
  console.log('Testing R2 connection...');
  
  // Log environment variables (redacted for security)
  console.log('Environment variables:');
  console.log(`- CLOUDFLARE_ACCOUNT_ID: ${process.env.CLOUDFLARE_ACCOUNT_ID?.substring(0, 4)}...`);
  console.log(`- R2_ACCESS_KEY_ID: ${process.env.R2_ACCESS_KEY_ID?.substring(0, 4)}...`);
  console.log(`- R2_SECRET_ACCESS_KEY: ${process.env.R2_SECRET_ACCESS_KEY ? '✓ Set' : '✗ Not set'}`);
  console.log(`- R2_ENDPOINT: ${process.env.R2_ENDPOINT}`);
  console.log(`- R2_PUBLIC_URL: ${process.env.R2_PUBLIC_URL}`);
  
  try {
    // Create S3 client
    console.log('Creating S3 client...');
    
    // Get the endpoint from environment variables
    const endpoint = process.env.R2_ENDPOINT || `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`;
    
    // Log the full endpoint for debugging
    console.log(`Using endpoint: ${endpoint}`);
    
    // Create the client with explicit configuration for Cloudflare R2
    const client = new S3Client({
      region: 'auto',
      endpoint,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
      },
      // These are important for Cloudflare R2
      forcePathStyle: true,
      // Add custom user agent to help with debugging
      customUserAgent: 'CryptoConverter/1.0.0 R2Test',
    });
    
    console.log('S3 client created successfully.');
    
    // Skip listing buckets as it might not be allowed with the current permissions
    // Instead, directly test the specific bucket we need
    console.log(`\nTesting access to bucket '${BUCKET_NAME}'...`);
    
    // First, try a simple HEAD request to check if the bucket exists and is accessible
    try {
      const listObjectsCommand = new ListObjectsV2Command({
        Bucket: BUCKET_NAME,
        MaxKeys: 1, // Just check if we can access at least one object
      });
      
      console.log('Sending ListObjectsV2Command...');
      const objectsResponse = await client.send(listObjectsCommand);
      console.log('Connection successful! Bucket is accessible.');
      console.log('Objects found:', objectsResponse.Contents?.length || 0);
      
      // Now try with a specific prefix
      console.log(`\nTesting access with prefix 'latest/'...`);
      const prefixCommand = new ListObjectsV2Command({
        Bucket: BUCKET_NAME,
        MaxKeys: 10,
        Prefix: 'latest/',
      });
      
      const prefixResponse = await client.send(prefixCommand);
      console.log('Objects found with prefix:', prefixResponse.Contents?.length || 0);
      
      if (prefixResponse.Contents && prefixResponse.Contents.length > 0) {
        console.log('First few objects:');
        prefixResponse.Contents.slice(0, 3).forEach(obj => {
          console.log(`- ${obj.Key} (${obj.Size} bytes, last modified: ${obj.LastModified})`);
        });
        
        // Check CORS configuration
        await checkCorsConfiguration(client);
        
        console.log('\n✅ R2 connection test successful!');
      } else {
        console.log('No objects found with prefix "latest/". This could be normal if the bucket is empty or the prefix doesn\'t exist.');
        console.log('The connection was successful, but no objects were returned with this prefix.');
      }
    } catch (error) {
      console.error('Error accessing bucket:', error);
      throw error;
    }
  } catch (error) {
    console.error('\n❌ R2 connection test failed:', error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // Log additional properties for AWS errors
      interface AWSError extends Error {
        $metadata?: Record<string, unknown>;
        Code?: string;
      }
      
      const awsError = error as AWSError;
      if (awsError.$metadata) {
        console.error('AWS error metadata:', JSON.stringify(awsError.$metadata, null, 2));
      }
      if (awsError.Code) {
        console.error('AWS error code:', awsError.Code);
      }
    }
  }
}

async function checkCorsConfiguration(client: S3Client) {
  try {
    console.log(`\nChecking CORS configuration for bucket '${BUCKET_NAME}'...`);
    
    const corsCommand = new GetBucketCorsCommand({
      Bucket: BUCKET_NAME,
    });
    
    const corsResponse = await client.send(corsCommand);
    
    if (corsResponse.CORSRules && corsResponse.CORSRules.length > 0) {
      console.log('✅ CORS configuration found:');
      corsResponse.CORSRules.forEach((rule, index) => {
        console.log(`Rule ${index + 1}:`);
        console.log(`- Allowed Origins: ${rule.AllowedOrigins?.join(', ') || 'None'}`);
        console.log(`- Allowed Methods: ${rule.AllowedMethods?.join(', ') || 'None'}`);
        console.log(`- Allowed Headers: ${rule.AllowedHeaders?.join(', ') || 'None'}`);
        console.log(`- Exposed Headers: ${rule.ExposeHeaders?.join(', ') || 'None'}`);
        console.log(`- Max Age: ${rule.MaxAgeSeconds || 'Not set'}`);
      });
    } else {
      console.log('⚠️ No CORS rules found for this bucket.');
      console.log('You may need to configure CORS to allow direct downloads from the browser.');
      console.log('See: https://developers.cloudflare.com/r2/api/s3/cors/');
    }
  } catch (error) {
    console.error('Error checking CORS configuration:', error);
    console.log('⚠️ Unable to check CORS configuration. This may be due to insufficient permissions.');
    console.log('Make sure your R2 token has the "s3:GetBucketCors" permission.');
  }
}

// Run the test
console.log('Running R2 connection test...');
testR2Connection()
  .then(() => console.log('Test completed.'))
  .catch(error => {
    console.error('Unhandled error in test:', error);
    process.exit(1);
  }); 