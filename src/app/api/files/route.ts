import { NextRequest, NextResponse } from 'next/server';
import { getFileMetadata, extractVersionFromFilename, formatReleaseDate } from '@/lib/r2';
import { formatFileSize } from '@/lib/utils';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// Function to generate fallback data dynamically
function generateFallbackData(platform: string) {
  const currentDate = new Date();
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(currentDate);
  
  // Default file size in bytes (98.31 MB)
  const defaultSizeBytes = 98311502;
  
  // Generate platform-specific data
  const filename = platform === 'windows' 
    ? 'CryptoVertX-Setup-1.0.0.exe'
    : 'CryptoVertX-Mac-1.0.0.dmg';
    
  return {
    key: `latest/${filename}`,
    filename,
    size: formatFileSize(defaultSizeBytes),
    version: '1.0.0',
    releaseDate: formattedDate,
  };
}

export async function GET(request: NextRequest) {
  try {
    // Get the platform from the query parameters
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform') || 'windows';
    
    console.log(`Fetching file metadata for platform: ${platform}`);
    
    // Define the prefix based on the platform
    let prefix = '';
    if (platform === 'windows') {
      prefix = 'latest/CryptoVertX-Setup';
    } else if (platform === 'mac') {
      prefix = 'latest/CryptoVertX-Mac';
    }
    
    try {
      // Get file metadata from R2
      console.log(`Attempting to fetch files with prefix: ${prefix}`);
      const files = await getFileMetadata(prefix);
      
      // If no files found with the specific prefix, try with a more generic prefix
      if (!files.length) {
        console.log('No files found with specific prefix, trying with generic prefix');
        const genericPrefix = 'latest/';
        const allFiles = await getFileMetadata(genericPrefix);
        
        // Filter files based on platform
        const filteredFiles = allFiles.filter(file => {
          const key = file.Key || '';
          if (platform === 'windows') {
            const hasInstallerKeyword = key.includes('Setup') || key.includes('Installer');
            const hasCorrectExtension = key.endsWith('.exe') || key.endsWith('.msi');
            return hasInstallerKeyword && hasCorrectExtension;
          } else if (platform === 'mac') {
            return key.includes('Mac') && (key.endsWith('.dmg') || key.endsWith('.pkg'));
          }
          return false;
        });
        
        if (filteredFiles.length) {
          console.log(`Found ${filteredFiles.length} files with generic prefix`);
          files.push(...filteredFiles);
        } else {
          console.log('No files found in R2, using fallback data');
          return NextResponse.json(generateFallbackData(platform));
        }
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
      
      // Log file size information for debugging
      console.log(`File size in bytes: ${latestFile.Size}`);
      console.log(`Formatted file size: ${fileData.size}`);
      
      return NextResponse.json(fileData);
    } catch (error) {
      console.error('Error fetching file metadata from R2:', error);
      
      // Use fallback data if there's an error
      console.log('Using fallback data due to R2 error');
      return NextResponse.json(generateFallbackData(platform));
    }
  } catch (error: unknown) {
    console.error('Error fetching file metadata:', error);
    
    // Use fallback data for any error
    const platform = new URL(request.url).searchParams.get('platform') || 'windows';
    console.log('Using fallback data due to error');
    return NextResponse.json(generateFallbackData(platform));
  }
} 