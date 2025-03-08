'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

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
    downloadUrl: '/downloads/crypto-converter-setup.exe',
    size: '24.5 MB',
  },
  {
    id: 'mac',
    name: 'macOS',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 17.607c-.786 2.28-3.139 6.317-5.563 6.361-1.608.031-2.125-.953-3.963-.953-1.837 0-2.412.923-3.932.983-2.572.099-6.542-5.827-6.542-10.995 0-4.747 3.308-7.1 6.198-7.143 1.55-.028 3.014 1.045 3.959 1.045.949 0 2.727-1.29 4.596-1.101.782.033 2.979.315 4.389 2.377-3.741 2.442-3.158 7.549.858 9.426zm-5.222-17.607c-2.826.114-5.132 3.079-4.81 5.531 2.612.203 5.118-2.725 4.81-5.531z"/>
      </svg>
    ),
    downloadUrl: '/downloads/crypto-converter.dmg',
    size: '23.8 MB',
  },
  {
    id: 'linux',
    name: 'Linux',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.581 19.049c-.55-.446-.336-1.431-.907-1.917.553-3.365-.997-6.331-2.845-8.232-1.551-1.595-1.051-3.147-1.051-4.49 0-2.146-.881-4.41-3.55-4.41-2.853 0-3.635 2.38-3.663 3.738-.068 3.262.659 4.11-1.25 6.484-2.246 2.793-2.577 5.579-2.07 7.057-.237.276-.557.582-1.155.835-1.652.72-.441 1.925-.441 1.925s.32-.791 1.07-.791c.498 0 .806.261 1.075.528.803.793 1.578 1.41 2.305 1.642 1.684.541 4.758.541 6.474-1.174.65-.656 1.939-1.985.6-1.985-1.499 0-2.998-.896-3.497-1.295h.001c-.114-.096-.123-.263-.027-.36.096-.098.256-.1.354-.006.717.636 2.183 1.196 3.375 1.196 1.993 0 .899-1.259 3.328-1.259.682 0 .991 1.259 2.775 1.259 1.162 0 2.025-1.01 2.025-1.259 0-.25-.633-.779-1.476-1.236zm-9.248-10.526c0-.22.178-.397.398-.397.22 0 .397.177.397.397 0 .22-.177.396-.397.396-.22 0-.398-.176-.398-.396zm1.273 4.99c.1.081.247.081.347 0 .099-.081.099-.212 0-.292-.1-.081-.247-.081-.347 0-.1.08-.1.211 0 .292zm-1.273-2.99c.1.081.247.081.347 0 .099-.081.099-.212 0-.292-.1-.081-.247-.081-.347 0-.1.08-.1.211 0 .292zm1.273-2.99c.1.081.247.081.347 0 .099-.081.099-.212 0-.292-.1-.081-.247-.081-.347 0-.1.08-.1.211 0 .292zm1.273 2.99c.1.081.247.081.347 0 .099-.081.099-.212 0-.292-.1-.081-.247-.081-.347 0-.1.08-.1.211 0 .292zm1.273-2.99c.1.081.247.081.347 0 .099-.081.099-.212 0-.292-.1-.081-.247-.081-.347 0-.1.08-.1.211 0 .292z"/>
      </svg>
    ),
    downloadUrl: '/downloads/crypto-converter.AppImage',
    size: '25.2 MB',
  },
];

// Version information
const versionInfo = {
  current: '1.2.0',
  releaseDate: 'March 5, 2025',
  changelog: [
    'Added support for 10 new cryptocurrencies',
    'Improved real-time price update speed',
    'Enhanced dark mode UI',
    'Fixed minor bugs and performance improvements',
  ],
  systemRequirements: {
    windows: 'Windows 10 or later',
    mac: 'macOS 11.0 or later',
    linux: 'Ubuntu 20.04, Fedora 34, or compatible',
  },
};

export default function Download() {
  const [activePlatform, setActivePlatform] = useState(platforms[0].id);
  const [showChangelog, setShowChangelog] = useState(false);
  
  return (
    <section id="download" className="py-20 bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[120px] -z-10"></div>
      
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-primary">
            Download Crypto Converter
          </h2>
          <p className="text-text-secondary text-lg">
            Get started with Crypto Converter today. Available for Windows, macOS, and Linux.
          </p>
        </div>
        
        {/* Download card */}
        <div className="max-w-4xl mx-auto bg-background-darker rounded-2xl overflow-hidden border border-gray-800">
          {/* App preview */}
          <div className="relative h-64 md:h-80 bg-background-card">
            <Image
              src="/images/app-banner.jpg"
              alt="Crypto Converter App"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background-darker to-transparent"></div>
            
            {/* Version badge */}
            <div className="absolute top-4 right-4 bg-primary/90 text-white px-3 py-1 rounded-full text-sm font-medium">
              v{versionInfo.current}
            </div>
          </div>
          
          {/* Download options */}
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Platform selection */}
              <div className="w-full md:w-1/3">
                <h3 className="text-xl font-semibold mb-4 text-text-primary">
                  Choose Your Platform
                </h3>
                
                <div className="space-y-3">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-lg transition-all",
                        "border hover:border-primary/50",
                        activePlatform === platform.id 
                          ? "bg-primary/10 border-primary/50 text-primary" 
                          : "bg-background border-gray-800 text-text-secondary"
                      )}
                      onClick={() => setActivePlatform(platform.id)}
                    >
                      <div className="text-current">
                        {platform.icon}
                      </div>
                      <span>{platform.name}</span>
                    </button>
                  ))}
                </div>
                
                {/* System requirements */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-text-primary mb-2">
                    System Requirements
                  </h4>
                  <p className="text-text-secondary text-sm">
                    {versionInfo.systemRequirements[activePlatform as keyof typeof versionInfo.systemRequirements]}
                  </p>
                </div>
              </div>
              
              {/* Download details */}
              <div className="w-full md:w-2/3">
                <h3 className="text-xl font-semibold mb-4 text-text-primary">
                  Download Details
                </h3>
                
                {/* Active platform info */}
                {platforms.map((platform) => (
                  platform.id === activePlatform && (
                    <div key={platform.id} className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="text-primary">
                            {platform.icon}
                          </div>
                          <span className="text-text-primary font-medium">
                            Crypto Converter for {platform.name}
                          </span>
                        </div>
                        <span className="text-text-secondary text-sm">
                          {platform.size}
                        </span>
                      </div>
                      
                      {/* Download button */}
                      <a
                        href={platform.downloadUrl}
                        className="w-full bg-gradient-to-r from-primary to-primary-light text-white py-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:shadow-glow transition-all mb-4"
                        download
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Download for {platform.name}
                      </a>
                      
                      {/* Alternative download */}
                      <div className="flex justify-between items-center">
                        <a
                          href={`${platform.downloadUrl.replace('.exe', '-portable.zip').replace('.dmg', '.zip').replace('.AppImage', '.tar.gz')}`}
                          className="text-text-secondary text-sm hover:text-primary transition-colors"
                          download
                        >
                          Download portable version
                        </a>
                        <span className="text-text-secondary text-sm">
                          Released: {versionInfo.releaseDate}
                        </span>
                      </div>
                    </div>
                  )
                ))}
                
                {/* Changelog */}
                <div className="mt-8">
                  <button
                    className="flex items-center gap-2 text-text-primary mb-4"
                    onClick={() => setShowChangelog(!showChangelog)}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className={`transition-transform ${showChangelog ? 'rotate-180' : ''}`}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                    <span className="font-medium">Changelog v{versionInfo.current}</span>
                  </button>
                  
                  {showChangelog && (
                    <div className="bg-background p-4 rounded-lg border border-gray-800 text-text-secondary">
                      <ul className="space-y-2 list-disc list-inside">
                        {versionInfo.changelog.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional info */}
        <div className="mt-16 text-center">
          <p className="text-text-secondary mb-4">
            By downloading, you agree to our <a href="#terms" className="text-primary hover:underline">Terms of Service</a> and <a href="#privacy" className="text-primary hover:underline">Privacy Policy</a>.
          </p>
          <p className="text-text-secondary text-sm">
            Having trouble? <a href="#contact" className="text-primary hover:underline">Contact support</a>
          </p>
        </div>
      </div>
    </section>
  );
} 