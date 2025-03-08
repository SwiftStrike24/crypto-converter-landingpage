'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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
    color: 'from-blue-500/20 to-blue-600/10',
    size: 'large',
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
    color: 'from-purple-500/20 to-purple-600/10',
    size: 'medium',
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
    color: 'from-green-500/20 to-green-600/10',
    size: 'medium',
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
    color: 'from-orange-500/20 to-orange-600/10',
    size: 'small',
  },
  {
    id: 'portfolio',
    title: 'Crypto Charts',
    description: 'View detailed price charts and historical data with customizable timeframes.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
      </svg>
    ),
    color: 'from-red-500/20 to-red-600/10',
    size: 'small',
  },
  {
    id: 'dark-mode',
    title: 'Dark Mode',
    description: 'Easy on the eyes with a beautiful dark interface that looks great day or night.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    ),
    color: 'from-indigo-500/20 to-indigo-600/10',
    size: 'small',
  }
];

export default function Features() {
  const [activeFeature, setActiveFeature] = useState(features[0].id);
  
  return (
    <section id="features" className="py-24 bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-radial from-primary/20 to-transparent opacity-30 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-radial from-secondary/20 to-transparent opacity-30 blur-3xl"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-primary"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Powerful Features
          </motion.h2>
          <motion.p 
            className="text-text-secondary max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Everything you need for seamless cryptocurrency conversion and tracking in one elegant application.
          </motion.p>
        </div>
        
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-gray-800/50 bg-background-card p-6 hover:border-primary/50 transition-all duration-300",
                "backdrop-blur-sm flex flex-col",
                feature.size === 'large' ? 'lg:col-span-2 lg:row-span-2' : 
                feature.size === 'medium' ? 'lg:col-span-1 lg:row-span-2' : 
                'lg:col-span-1 lg:row-span-1',
                activeFeature === feature.id ? 'ring-2 ring-primary/50' : ''
              )}
              onClick={() => setActiveFeature(feature.id)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              {/* Feature icon */}
              <div className="mb-4 text-primary">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  {feature.icon}
                </div>
              </div>
              
              {/* Feature content */}
              <h3 className="text-xl font-semibold mb-2 text-text-primary">{feature.title}</h3>
              <p className="text-text-secondary mb-4">{feature.description}</p>
              
              {/* Feature image - only show for large and medium cards */}
              {(feature.size === 'large' || feature.size === 'medium') && (
                <div className="mt-auto relative w-full overflow-hidden rounded-lg">
                  <div className={`aspect-video relative bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                    <span className="text-text-primary opacity-30 font-bold text-xl">{feature.title}</span>
                  </div>
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background-card to-transparent opacity-60"></div>
                </div>
              )}
              
              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 