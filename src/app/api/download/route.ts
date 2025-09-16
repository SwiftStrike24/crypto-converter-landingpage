import { NextRequest, NextResponse } from 'next/server';
import { GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { BUCKET_NAME, createR2Client } from '@/lib/r2';
import { Readable } from 'stream';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// Define a type for R2 errors
interface R2Error extends Error {
  Code?: string;
  $metadata?: Record<string, unknown>;
  $fault?: string;
}

// Local compat wrapper to tolerate smithy type skew during build
function presignUrlCompat(client: unknown, command: unknown, expiresInSeconds: number): Promise<string> {
  const fn = getSignedUrl as unknown as (c: unknown, cmd: unknown, opts: { expiresIn: number }) => Promise<string>;
  return fn(client, command, { expiresIn: expiresInSeconds });
}

export async function GET(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const rangeHeader = request.headers.get('range') || undefined;
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

    const filename = key.split('/').pop() || 'download';

    // Decide strategy: default to presigned redirect to avoid Vercel streaming limits
    const usePresignedRedirect = process.env.DOWNLOAD_VIA_PRESIGNED !== 'false';

    console.log(`[download] host=${host} key=${key} mode=${usePresignedRedirect ? 'presigned-redirect' : 'stream'} range=${rangeHeader || 'none'}`);

    // Create a fresh client for this request
    const client = createR2Client();

    if (usePresignedRedirect) {
      const isMsi = filename.toLowerCase().endsWith('.msi');
      // Attach response headers to the signed URL so R2 serves with correct filename/content type
      const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        ResponseContentDisposition: `attachment; filename="${filename}"`,
        ResponseContentType: isMsi ? 'application/x-msi' : 'application/octet-stream',
      });
      const expiresInSeconds = 60 * 60 * 4; // 4 hours
      const signedUrl = await presignUrlCompat(client, command, expiresInSeconds);
      console.log(`[download] redirect -> R2 signed url (ttl=${expiresInSeconds}s)`);
      const headers = new Headers();
      headers.set('Location', signedUrl);
      headers.set('Cache-Control', 'no-store');
      return new NextResponse(null, { status: 307, headers });
    }

    // Streaming path (fallback)
    // Build GetObject with optional Range
    const getCommand = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ...(rangeHeader ? { Range: rangeHeader } : {}),
    });

    console.log(`Sending GetObjectCommand to R2 for key: ${key}${rangeHeader ? ` with Range: ${rangeHeader}` : ''}`);
    const response = await client.send(getCommand);
    console.log('R2 response received successfully');

    if (!response.Body) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Prepare headers
    const headers = new Headers();
    headers.set('Accept-Ranges', 'bytes');
    headers.set('Cache-Control', 'no-store');

    // Content-Type: prioritize MSI; fallback to R2 type or octet-stream
    const isMsi = filename.toLowerCase().endsWith('.msi');
    const contentType = isMsi ? 'application/x-msi' : (response.ContentType || 'application/octet-stream');
    headers.set('Content-Type', contentType);

    // Content-Disposition
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);

    // ETag passthrough if available
    if (response.ETag) {
      headers.set('ETag', response.ETag);
    }

    // Determine status and Content-Range/Length
    let status = 200;
    let contentLengthToSend = response.ContentLength ?? undefined;

    if (rangeHeader) {
      status = 206; // Partial Content

      // Prefer server-provided Content-Range
      if (response.ContentRange) {
        headers.set('Content-Range', response.ContentRange);
        // Attempt to log parsed values for telemetry
        try {
          const match = response.ContentRange.match(/bytes\s+(\d+)-(\d+)\/(\d+)/);
          if (match) {
            const start = Number(match[1]);
            const end = Number(match[2]);
            const total = Number(match[3]);
            if (typeof contentLengthToSend !== 'number') {
              contentLengthToSend = end - start + 1;
            }
            console.log(`[download] partial: start=${start} end=${end} total=${total}`);
          }
        } catch {}
      }

      // Ensure Content-Length reflects the segment size
      if (typeof contentLengthToSend === 'number') {
        headers.set('Content-Length', contentLengthToSend.toString());
      }
    } else {
      // Full content
      if (typeof contentLengthToSend === 'number') {
        headers.set('Content-Length', contentLengthToSend.toString());
      }
    }

    console.log(
      `[download] response: status=${status} contentLength=${contentLengthToSend ?? 'unknown'} ` +
      `contentRange=${headers.get('Content-Range') || 'none'} etag=${response.ETag || 'none'}`
    );

    // Convert Node.js Readable to Web ReadableStream if necessary
    const rawBody = response.Body as unknown;
    let webStream: ReadableStream<Uint8Array>;
    if (rawBody instanceof Readable) {
      webStream = Readable.toWeb(rawBody) as unknown as ReadableStream<Uint8Array>;
    } else {
      webStream = rawBody as ReadableStream<Uint8Array>;
    }

    // Return the file as a stream directly from R2 response body
    return new NextResponse(webStream, {
      status,
      headers,
    });
  } catch (error: unknown) {
    console.error('Error downloading file from R2:', error);

    // Handle specific error types
    const r2Error = error as R2Error;

    // Invalid range handling: return 416 with correct Content-Range
    if (r2Error.Code === 'InvalidRange') {
      try {
        const { searchParams } = new URL(request.url);
        const key = searchParams.get('key') as string;
        const client = createR2Client();
        const head = await client.send(new HeadObjectCommand({ Bucket: BUCKET_NAME, Key: key }));
        const total = head.ContentLength || 0;
        const headers = new Headers();
        headers.set('Accept-Ranges', 'bytes');
        headers.set('Cache-Control', 'no-store');
        headers.set('Content-Range', `bytes */${total}`);
        if (head.ETag) headers.set('ETag', head.ETag);
        console.log(`[download] 416 for key=${key} total=${total}`);
        return new NextResponse(null, { status: 416, headers });
      } catch (e) {
        console.error('Error preparing 416 response:', e);
      }
    }

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