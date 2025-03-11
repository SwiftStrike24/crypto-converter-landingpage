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
  },
  {
    id: 'technical-analysis',
    title: 'Technical Analysis',
    description: 'Get instant buy/sell signals and market sentiment analysis powered by TradingView for smarter trading decisions.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 6v2"></path>
        <path d="M16.24 7.76l-1.42 1.42"></path>
        <path d="M18 12h-2"></path>
        <path d="M16.24 16.24l-1.42-1.42"></path>
        <path d="M12 18v-2"></path>
        <path d="M7.76 16.24l1.42-1.42"></path>
        <path d="M6 12h2"></path>
        <path d="M7.76 7.76l1.42 1.42"></path>
        <path d="M12 12L9 15"></path>
      </svg>
    ),
    color: 'from-orange-500/20 to-orange-600/10',
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
  }
];

export default function Features() {
  const [activeFeature, setActiveFeature] = useState(features[0].id);
  
  return (
    <section id="features" className="py-24 bg-background relative overflow-hidden">
      {/* Background elements - subtle noise texture */}
      <div className="absolute inset-0 bg-noise-pattern opacity-[0.03]"></div>
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-radial from-primary/10 to-transparent opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-radial from-secondary/10 to-transparent opacity-20 blur-3xl"></div>
      
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
        
        {/* Featured highlight */}
        <motion.div 
          className="mb-16 relative overflow-hidden rounded-2xl border border-gray-800/30 bg-background-card/50 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {features.map((feature) => (
            <div 
              key={feature.id}
              className={cn(
                "absolute inset-0 p-8 md:p-12 transition-opacity duration-500 flex flex-col md:flex-row items-center gap-8",
                activeFeature === feature.id ? "opacity-100 z-10" : "opacity-0 z-0"
              )}
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br flex-shrink-0 flex items-center justify-center text-white"
                style={{
                  background: `linear-gradient(135deg, var(--${feature.id}-start, #6366f1), var(--${feature.id}-end, #8b5cf6))`
                }}
              >
                <div className="w-12 h-12 md:w-14 md:h-14">
                  {feature.icon}
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold mb-3 text-text-primary">{feature.title}</h3>
                <p className="text-text-secondary text-lg max-w-2xl">{feature.description}</p>
              </div>
            </div>
          ))}
          
          {/* Gradient background */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-background-card to-background-card/20 opacity-50"></div>
        </motion.div>
        
        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <motion.button
              key={feature.id}
              className={cn(
                "group relative h-[180px] rounded-xl border transition-all duration-300 p-6 flex flex-col items-start justify-between text-left overflow-hidden",
                activeFeature === feature.id 
                  ? "border-primary/50 bg-primary/5" 
                  : "border-gray-800/30 bg-background-card/30 hover:bg-background-card/50"
              )}
              onClick={() => setActiveFeature(feature.id)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ 
                y: -5, 
                boxShadow: "0 15px 30px -10px rgba(var(--primary), 0.15)",
                scale: 1.02,
                transition: { 
                  duration: 0.3,
                  type: "spring",
                  stiffness: 400,
                  damping: 15
                } 
              }}
            >
              {/* Animated corner accent */}
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-primary/20 to-primary-light/30 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-500 ease-out"></div>
              
              {/* Animated border glow */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
                style={{
                  boxShadow: `inset 0 0 0 1px rgba(var(--${feature.id}-start), 0.3)`
                }}
              ></div>
              
              {/* Feature icon with animated background */}
              <div className="text-primary relative z-10">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-500 relative overflow-hidden",
                  activeFeature === feature.id ? "bg-primary/20" : "bg-primary/10 group-hover:scale-110 group-hover:rotate-3"
                )}>
                  {/* Animated icon background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                  
                  {/* Icon */}
                  <div className="relative z-10 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                </div>
              </div>
              
              {/* Feature content with animated lift */}
              <div className="relative z-10 transform group-hover:translate-y-[-2px] transition-transform duration-300">
                <h3 className="text-lg font-semibold mb-1 text-text-primary group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                <p className="text-text-secondary text-sm line-clamp-2 group-hover:line-clamp-none transition-all duration-500">{feature.description}</p>
              </div>
              
              {/* Animated particles */}
              <div className="absolute bottom-2 left-2 w-1 h-1 rounded-full bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:animate-float-slow"></div>
              <div className="absolute bottom-3 left-6 w-1 h-1 rounded-full bg-primary-light/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:animate-float-medium"></div>
              
              {/* Active indicator with pulse animation */}
              {activeFeature === feature.id && (
                <motion.div 
                  className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-primary"
                  layoutId="activeIndicator"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <span className="absolute inset-0 rounded-full bg-primary/50 animate-ping"></span>
                </motion.div>
              )}
              
              {/* Enhanced gradient overlay on hover with directional movement */}
              <div 
                className="absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none z-0 group-hover:bg-position-100"
                style={{
                  background: `linear-gradient(135deg, rgba(var(--${feature.id}-start), 0.03), rgba(var(--${feature.id}-end), 0.08))`,
                  backgroundSize: '200% 200%',
                  backgroundPosition: '0% 0%'
                }}
              ></div>
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Add these animations to your global CSS or define them here */}
      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-5px) translateX(3px); }
          50% { transform: translateY(-2px) translateX(5px); }
          75% { transform: translateY(-4px) translateX(-2px); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-3px) translateX(-3px); }
          50% { transform: translateY(-6px) translateX(2px); }
          75% { transform: translateY(-2px) translateX(4px); }
        }
        
        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium 3s ease-in-out infinite;
        }
        
        .group:hover .bg-position-100 {
          background-position: 100% 100% !important;
          transition: background-position 2s ease-in-out !important;
        }
      `}</style>
    </section>
  );
} 