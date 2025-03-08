'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// Feature data
const features = [
  {
    id: 'real-time',
    title: 'Real-Time Conversion',
    description: 'Convert between cryptocurrencies with up-to-the-second price accuracy.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
    ),
    image: '/images/features/real-time.png',
  },
  {
    id: 'multi-crypto',
    title: 'Multiple Cryptocurrencies',
    description: 'Support for 50+ cryptocurrencies with more being added regularly.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="7"></circle>
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
      </svg>
    ),
    image: '/images/features/multi-crypto.png',
  },
  {
    id: 'live-updates',
    title: 'Live Price Updates',
    description: 'Prices update automatically so you always have the latest information.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
        <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
      </svg>
    ),
    image: '/images/features/live-updates.png',
  },
  {
    id: 'cross-platform',
    title: 'Cross-Platform',
    description: 'Available for Windows, macOS, and Linux with the same great experience.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
      </svg>
    ),
    image: '/images/features/cross-platform.png',
  },
  {
    id: 'modern-ui',
    title: 'Modern Interface',
    description: 'Sleek, intuitive design with dark mode and customizable themes.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="3" y1="9" x2="21" y2="9"></line>
        <line x1="9" y1="21" x2="9" y2="9"></line>
      </svg>
    ),
    image: '/images/features/modern-ui.png',
  },
  {
    id: 'secure',
    title: 'Secure & Private',
    description: 'Your data stays on your device with secure API connections.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    ),
    image: '/images/features/secure.png',
  },
];

export default function Features() {
  const [activeFeature, setActiveFeature] = useState(features[0].id);
  
  return (
    <section id="features" className="py-20 bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-background-darker to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background-darker to-transparent"></div>
      
      {/* Glowing orb */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-[100px] -z-10"></div>
      
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-primary">
            Powerful Features for Crypto Enthusiasts
          </h2>
          <p className="text-text-secondary text-lg">
            Designed with attention to detail, our app provides everything you need for cryptocurrency conversion and tracking.
          </p>
        </div>
        
        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={cn(
                "group relative p-6 rounded-xl transition-all duration-300 cursor-pointer",
                "border border-gray-800 hover:border-primary/50",
                "bg-background-card hover:bg-background-card/80",
                activeFeature === feature.id ? "border-primary/50 shadow-glow" : ""
              )}
              onClick={() => setActiveFeature(feature.id)}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "p-3 rounded-lg transition-colors",
                  "bg-background-darker group-hover:bg-primary/20",
                  activeFeature === feature.id ? "bg-primary/20" : ""
                )}>
                  <div className={cn(
                    "text-text-secondary group-hover:text-primary",
                    activeFeature === feature.id ? "text-primary" : ""
                  )}>
                    {feature.icon}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-text-primary group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
              
              {/* Hover indicator */}
              <div className={cn(
                "absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-primary-light",
                "transition-all duration-300 rounded-b-xl",
                activeFeature === feature.id ? "w-full" : "w-0 group-hover:w-full"
              )}></div>
            </div>
          ))}
        </div>
        
        {/* Feature showcase */}
        <div className="bg-background-darker rounded-2xl p-6 md:p-10 border border-gray-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-grid-pattern opacity-5"></div>
          
          <div className="flex flex-col lg:flex-row items-center gap-10">
            {/* Feature image */}
            <div className="w-full lg:w-1/2 relative">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className={cn(
                    "rounded-xl overflow-hidden shadow-2xl transition-all duration-500",
                    "border border-gray-800",
                    activeFeature === feature.id ? "opacity-100 scale-100" : "opacity-0 scale-95 absolute top-0 left-0"
                  )}
                >
                  <div className="relative aspect-[16/10] w-full">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Feature details */}
            <div className="w-full lg:w-1/2">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className={cn(
                    "transition-all duration-500",
                    activeFeature === feature.id ? "opacity-100 transform-none" : "opacity-0 translate-y-4 absolute"
                  )}
                >
                  {activeFeature === feature.id && (
                    <>
                      <h3 className="text-2xl md:text-3xl font-bold mb-4 text-primary">
                        {feature.title}
                      </h3>
                      <p className="text-text-secondary text-lg mb-6">
                        {feature.description}
                      </p>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-2 text-text-secondary">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          Intuitive and easy to use
                        </li>
                        <li className="flex items-center gap-2 text-text-secondary">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          Optimized for performance
                        </li>
                        <li className="flex items-center gap-2 text-text-secondary">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          Regular updates with new features
                        </li>
                      </ul>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 