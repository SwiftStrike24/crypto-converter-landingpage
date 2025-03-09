'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import ConverterDemo from '@/components/demo/ConverterDemo';

// Platform data
const platforms = [
  {
    id: 'windows',
    name: 'Windows',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
      </svg>
    ),
    color: '#0078D7',
  },
  {
    id: 'mac',
    name: 'macOS',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 17.607c-.786 2.28-3.139 6.317-5.563 6.361-1.608.031-2.125-.953-3.963-.953-1.837 0-2.412.923-3.932.983-2.572.099-6.542-5.827-6.542-10.995 0-4.747 3.308-7.1 6.198-7.143 1.55-.028 3.014 1.045 3.959 1.045.949 0 2.727-1.29 4.596-1.101.782.033 2.979.315 4.389 2.377-3.741 2.442-3.158 7.549.858 9.426zm-5.222-17.607c-2.826.114-5.132 3.079-4.81 5.531 2.612.203 5.118-2.725 4.81-5.531z"/>
      </svg>
    ),
    color: '#999999',
  },
];

// Default version information (will be updated from API)
const defaultVersionInfo = {
  current: '1.0.0',
  releaseDate: 'March 8, 2025',
  changelog: [
    'Added support for 10 new cryptocurrencies',
    'Improved real-time price update speed',
    'Enhanced dark mode UI',
    'Fixed minor bugs and improved stability',
  ],
};

// Type for file metadata
interface FileMetadata {
  key: string;
  filename: string;
  size: string;
  version: string;
  releaseDate: string;
}

// Type for API error
interface ApiError {
  error: string;
  details?: string;
}

export default function Download() {
  const [selectedPlatform, setSelectedPlatform] = useState(platforms[0].id);
  const [fileMetadata, setFileMetadata] = useState<FileMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [retryTimeout, setRetryTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // Fetch file metadata when platform changes or on retry
  useEffect(() => {
    async function fetchFileMetadata() {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching file metadata for ${selectedPlatform}...`);
        const response = await fetch(`/api/files?platform=${selectedPlatform}`);
        
        if (!response.ok) {
          const errorData = await response.json() as ApiError;
          throw new Error(errorData.error || `Failed to fetch file metadata (${response.status})`);
        }
        
        const data = await response.json();
        console.log(`File metadata received:`, data);
        setFileMetadata(data);
      } catch (err) {
        console.error('Error fetching file metadata:', err);
        setError(err instanceof Error ? err.message : 'Failed to load download information. Please try again later.');
        
        // Auto-retry after 5 seconds (but only once)
        if (retryCount === 0) {
          const timeout = setTimeout(() => {
            console.log('Auto-retrying file metadata fetch...');
            setRetryCount(prev => prev + 1);
          }, 5000);
          
          setRetryTimeout(timeout);
        }
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchFileMetadata();
    
    // Clean up timeout on unmount
    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [selectedPlatform, retryCount, retryTimeout]);
  
  // Function to handle manual retry
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };
  
  // Prepare platform data with download URL
  const selectedPlatformData = {
    ...platforms.find(p => p.id === selectedPlatform) || platforms[0],
    downloadUrl: fileMetadata ? 
      // Use public URL if available, otherwise fall back to API route
      (process.env.NEXT_PUBLIC_R2_PUBLIC_URL ? 
        `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${encodeURIComponent(fileMetadata.key)}` : 
        `/api/download?key=${encodeURIComponent(fileMetadata.key)}`) : 
      '#',
    size: fileMetadata?.size || '24.5 MB',
  };
  
  // Prepare version info
  const versionInfo = {
    ...defaultVersionInfo,
    current: fileMetadata?.version || defaultVersionInfo.current,
    releaseDate: fileMetadata?.releaseDate || defaultVersionInfo.releaseDate,
  };
  
  return (
    <section id="download" className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-background-gradient"></div>
      <div className="absolute inset-0 bg-noise opacity-5"></div>
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-background to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-primary/10 to-transparent opacity-30 blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-primary">
            Download Crypto Converter
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Get started with Crypto Converter today. Available for Windows and macOS.
          </p>
        </motion.div>
        
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* App preview */}
          <motion.div 
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              {/* App screenshot with device frame */}
              <div className="relative rounded-2xl overflow-hidden border border-gray-800 shadow-2xl bg-background-card">
                {/* App window header */}
                <div className="bg-background-darker p-3 flex items-center gap-2 border-b border-gray-800">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-text-secondary text-xs font-medium ml-2">Crypto Converter</div>
                </div>
                
                {/* Replace static app preview with interactive ConverterDemo */}
                <div className="w-full bg-background-darker p-4">
                  <ConverterDemo />
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-purple-900 to-indigo-900 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg border border-purple-500/30 backdrop-blur-sm">
                Try it now!
              </div>
            </div>
          </motion.div>
          
          {/* Download options */}
          <motion.div 
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-background-card/50 backdrop-blur-md rounded-2xl border border-gray-800/50 p-8">
              {/* Platform selector */}
              <div className="flex flex-wrap gap-4 mb-8">
                {platforms.map((platform) => (
                  <motion.button
                    key={platform.id}
                    className={cn(
                      "flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300",
                      "border",
                      selectedPlatform === platform.id 
                        ? "border-primary/50 bg-primary/10" 
                        : "border-gray-800/50 hover:border-gray-700/50 bg-background-darker/50"
                    )}
                    onClick={() => setSelectedPlatform(platform.id)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={cn(
                      "text-text-secondary",
                      selectedPlatform === platform.id && "text-primary"
                    )}>
                      {platform.icon}
                    </div>
                    <span className={cn(
                      "font-medium",
                      selectedPlatform === platform.id ? "text-primary" : "text-text-primary"
                    )}>
                      {platform.name}
                    </span>
                  </motion.button>
                ))}
              </div>
              
              {/* Download details */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-text-primary">
                    Crypto Converter for {selectedPlatformData.name}
                  </h3>
                  <span className="text-sm text-text-secondary bg-background-darker px-3 py-1 rounded-full">
                    v{versionInfo.current}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-text-secondary mb-6">
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>Released: {versionInfo.releaseDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <span>Size: {selectedPlatformData.size}</span>
                  </div>
                </div>
                
                {/* Download button */}
                {error ? (
                  <div className="text-center">
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4 text-red-400">
                      <p className="mb-2 font-medium">{error}</p>
                      <p className="text-sm text-red-300/70">
                        There was a problem loading the download information. This could be due to a network issue or server problem.
                      </p>
                    </div>
                    <motion.button
                      onClick={handleRetry}
                      className="px-6 py-2 rounded-lg bg-background-darker border border-gray-800 text-text-primary hover:bg-background-darker/80 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 2v6h-6"></path>
                          <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                          <path d="M3 22v-6h6"></path>
                          <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
                        </svg>
                        Try Again
                      </div>
                    </motion.button>
                  </div>
                ) : (
                  <motion.a
                    href={selectedPlatformData.downloadUrl}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 py-4 rounded-xl font-medium text-white",
                      "bg-gradient-to-r from-primary to-primary-light",
                      "hover:shadow-glow transition-all duration-300",
                      isLoading && "opacity-70 pointer-events-none"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    download
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Download for {selectedPlatformData.name}
                      </>
                    )}
                  </motion.a>
                )}
              </div>
              
              {/* Changelog */}
              <div>
                <h4 className="text-lg font-semibold text-text-primary mb-3">What&apos;s New</h4>
                <ul className="space-y-2">
                  {versionInfo.changelog.map((item, index) => (
                    <motion.li 
                      key={index} 
                      className="flex items-start gap-2 text-text-secondary"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-1">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 