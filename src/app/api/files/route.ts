import { NextRequest, NextResponse } from 'next/server';
import { HeadObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { createR2Client, BUCKET_NAME, extractVersionFromFilename, formatReleaseDate } from '@/lib/r2';
import { formatFileSize } from '@/lib/utils';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const platform = (searchParams.get('platform') || 'windows').toLowerCase();
  const host = request.headers.get('host') || '';

  try {
    console.log(`[files] host=${host} platform=${platform}`);

    // Build filter for platform
    const isWindows = platform === 'windows';
    const isMac = platform === 'mac' || platform === 'macos';

    // List under latest/ to find candidate
    const client = createR2Client();
    const list = await client.send(new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: 'latest/',
      MaxKeys: 20,
    }));

    const contents = list.Contents || [];

    // Filter by platform and file type
    const filtered = contents.filter(obj => {
      const key = obj.Key || '';
      if (isWindows) {
        const hasInstallerKeyword = key.includes('Setup') || key.includes('Installer');
        const hasCorrectExtension = key.toLowerCase().endsWith('.msi') || key.toLowerCase().endsWith('.exe');
        return key.startsWith('latest/') && hasInstallerKeyword && hasCorrectExtension;
      }
      if (isMac) {
        return key.startsWith('latest/') && (key.toLowerCase().endsWith('.dmg') || key.toLowerCase().endsWith('.pkg'));
      }
      return false;
    });

    if (!filtered.length) {
      console.log('[files] no matching installer found');
      return NextResponse.json(
        { error: 'No installer found for requested platform' },
        { status: 404, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    // Pick newest by LastModified
    const latest = [...filtered].sort((a, b) => (b.LastModified?.getTime() || 0) - (a.LastModified?.getTime() || 0))[0];
    const key = latest.Key as string;
    const filename = key.split('/').pop() || 'download';

    // HEAD to get authoritative metadata
    const head = await client.send(new HeadObjectCommand({ Bucket: BUCKET_NAME, Key: key }));

    const sizeBytes = head.ContentLength ?? latest.Size ?? 0;
    const version = extractVersionFromFilename(filename);
    const releaseDate = formatReleaseDate(head.LastModified || latest.LastModified);
    const etag = head.ETag ? head.ETag.replace(/\"/g, '').replace(/"/g, '') : undefined;
    const sha256 = head.Metadata?.sha256 || head.Metadata?.['x-amz-meta-sha256'] || undefined;

    console.log(`[files] key=${key} filename=${filename} sizeBytes=${sizeBytes} etag=${etag || 'none'} sha256=${sha256 ? sha256.substring(0, 8) + '...' : 'none'}`);

    const body = {
      key,
      filename,
      sizeBytes,
      size: formatFileSize(sizeBytes),
      version,
      releaseDate,
      etag,
      sha256,
    };

    return new NextResponse(JSON.stringify(body), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('[files] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch file metadata', details: error instanceof Error ? error.message : String(error) },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
} 