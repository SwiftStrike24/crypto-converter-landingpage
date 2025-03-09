import { NextRequest, NextResponse } from 'next/server';
import { getFileMetadata, formatFileSize, extractVersionFromFilename, formatReleaseDate } from '@/lib/r2';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// Define a type for R2 errors
interface R2Error extends Error {
  Code?: string;
  $metadata?: Record<string, unknown>;
  $fault?: string;
}

// Fallback data for development if R2 connection fails
const fallbackData = {
  windows: {
    key: 'latest/CryptoConverter-Setup-1.0.0.exe',
    filename: 'CryptoConverter-Setup-1.0.0.exe',
    size: '97.17 MB',
    version: '1.0.0',
    releaseDate: 'March 8, 2025',
  },
  mac: {
    key: 'latest/CryptoConverter-Mac-1.0.0.dmg',
    filename: 'CryptoConverter-Mac-1.0.0.dmg',
    size: '92.5 MB',
    version: '1.0.0',
    releaseDate: 'March 8, 2025',
  },
};

export async function GET(request: NextRequest) {
  try {
    // Get the platform from the query parameters
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform') || 'windows';
    
    console.log(`Fetching file metadata for platform: ${platform}`);
    
    // Define the prefix based on the platform
    let prefix = '';
    if (platform === 'windows') {
      prefix = 'latest/CryptoConverter-Setup';
    } else if (platform === 'mac') {
      prefix = 'latest/CryptoConverter-Mac';
    }
    
    try {
      // Get file metadata from R2
      console.log(`Attempting to fetch files with prefix: ${prefix}`);
      const files = await getFileMetadata(prefix);
      
      if (!files.length) {
        console.log('No files found in R2, using fallback data');
        // Use fallback data in development
        if (process.env.NODE_ENV === 'development') {
          return NextResponse.json(fallbackData[platform as keyof typeof fallbackData]);
        }
        
        return NextResponse.json(
          { error: 'No files found' },
          { status: 404 }
        );
      }
      
      // Sort files by last modified date (newest first)
      const sortedFiles = [...files].sort((a, b) => {
        const dateA = a.LastModified?.getTime() || 0;
        const dateB = b.LastModified?.getTime() || 0;
        return dateB - dateA;
      });
      
      // Get the latest file
      const latestFile = sortedFiles[0];
      
      // Extract filename
      const filename = latestFile.Key?.split('/').pop() || '';
      
      // Prepare the response
      const fileData = {
        key: latestFile.Key || '',
        filename,
        size: formatFileSize(latestFile.Size || 0),
        version: extractVersionFromFilename(filename),
        lastModified: latestFile.LastModified,
        releaseDate: formatReleaseDate(latestFile.LastModified),
      };
      
      return NextResponse.json(fileData);
    } catch (error) {
      console.error('Error fetching file metadata from R2:', error);
      
      // Use fallback data in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Using fallback data due to R2 error');
        return NextResponse.json(fallbackData[platform as keyof typeof fallbackData]);
      }
      
      // Re-throw for production
      throw error;
    }
  } catch (error: unknown) {
    console.error('Error fetching file metadata:', error);
    
    // Handle specific error types
    const r2Error = error as R2Error;
    if (r2Error.Code === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication failed with Cloudflare R2. Please check your credentials.' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch file metadata', details: r2Error.message || String(error) },
      { status: 500 }
    );
  }
} 