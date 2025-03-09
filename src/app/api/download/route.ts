import { NextRequest, NextResponse } from 'next/server';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { BUCKET_NAME, createR2Client } from '@/lib/r2';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// Define a type for R2 errors
interface R2Error extends Error {
  Code?: string;
  $metadata?: Record<string, unknown>;
  $fault?: string;
}

export async function GET(request: NextRequest) {
  try {
    // Get the file key from the query parameters
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json(
        { error: 'File key is required' },
        { status: 400 }
      );
    }

    console.log(`Attempting to download file: ${key} from bucket: ${BUCKET_NAME}`);

    // Create a fresh client for this request
    const client = createR2Client();

    // Get the file from R2
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    console.log(`Sending GetObjectCommand to R2 for key: ${key}`);
    const response = await client.send(command);
    console.log('R2 response received successfully');
    
    if (!response.Body) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Convert the readable stream to a buffer
    const chunks = [];
    for await (const chunk of response.Body as unknown as AsyncIterable<Uint8Array>) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Extract filename from the key
    const filename = key.split('/').pop() || 'download';

    // Set appropriate headers
    const headers = new Headers();
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    headers.set('Content-Type', response.ContentType || 'application/octet-stream');
    headers.set('Content-Length', buffer.length.toString());

    // Return the file as a stream
    return new NextResponse(buffer, {
      status: 200,
      headers,
    });
  } catch (error: unknown) {
    console.error('Error downloading file from R2:', error);
    
    // Handle specific error types
    const r2Error = error as R2Error;
    if (r2Error.Code === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication failed with Cloudflare R2. Please check your credentials.' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to download file', details: r2Error.message || String(error) },
      { status: 500 }
    );
  }
} 