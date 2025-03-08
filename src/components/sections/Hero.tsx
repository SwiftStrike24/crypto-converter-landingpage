'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getCryptoPrices, CryptoPrice } from '@/lib/api';
import { motion } from 'framer-motion';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [cryptoData, setCryptoData] = useState<CryptoPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  
  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Fetch crypto data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getCryptoPrices();
        setCryptoData(data);
      } catch (error) {
        console.error('Error fetching crypto data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Refresh data every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);
  
  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const scrollY = window.scrollY;
      const heroElement = heroRef.current;
      
      // Apply parallax effect to different elements
      const title = heroElement.querySelector('.hero-title');
      const subtitle = heroElement.querySelector('.hero-subtitle');
      const appPreview = heroElement.querySelector('.app-preview');
      const coinElements = heroElement.querySelectorAll('.floating-coin');
      
      if (title) {
        (title as HTMLElement).style.transform = `translateY(${scrollY * 0.2}px)`;
      }
      
      if (subtitle) {
        (subtitle as HTMLElement).style.transform = `translateY(${scrollY * 0.1}px)`;
      }
      
      if (appPreview) {
        (appPreview as HTMLElement).style.transform = `translateY(${scrollY * 0.05}px)`;
      }
      
      // Apply different parallax speeds to floating coins
      coinElements.forEach((coin, index) => {
        const speed = 0.03 + (index * 0.02);
        (coin as HTMLElement).style.transform = `translateY(${scrollY * speed}px)`;
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Mouse movement effect for 3D coins
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const { clientX, clientY } = e;
      const heroElement = heroRef.current;
      const coinElements = heroElement.querySelectorAll('.floating-coin');
      
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      const moveX = (clientX - centerX) / centerX;
      const moveY = (clientY - centerY) / centerY;
      
      coinElements.forEach((coin, index) => {
        const factor = 1 - (index * 0.2);
        (coin as HTMLElement).style.transform = `translate(${moveX * 20 * factor}px, ${moveY * 20 * factor}px) rotateY(${moveX * 10}deg) rotateX(${-moveY * 10}deg)`;
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Default placeholder crypto data for server-side rendering
  const placeholderCryptoData = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', current_price: 60000, price_change_percentage_24h: 2.5, image: '' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'eth', current_price: 3000, price_change_percentage_24h: 1.8, image: '' },
    { id: 'solana', name: 'Solana', symbol: 'sol', current_price: 120, price_change_percentage_24h: -0.5, image: '' },
  ];
  
  // Coin background colors
  const coinColors = {
    'bitcoin': 'bg-amber-500',
    'ethereum': 'bg-indigo-500',
    'solana': 'bg-purple-500',
    'cardano': 'bg-blue-500',
    'ripple': 'bg-cyan-500',
    'polkadot': 'bg-pink-500',
  };
  
  // Use real data if available, otherwise use placeholder data
  const displayData = cryptoData.length > 0 ? cryptoData : placeholderCryptoData;
  
  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen pt-24 pb-16 overflow-hidden bg-background-gradient"
    >
      {/* Background gradient with noise texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background-darker opacity-80"></div>
      <div className="absolute inset-0 bg-noise opacity-5"></div>
      
      {/* Floating crypto coins using real data - only render on client side */}
      {isClient && displayData.slice(0, 3).map((crypto, index) => (
        <motion.div 
          key={`coin-${crypto.id}-${index}`}
          className={`absolute floating-coin z-10`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            x: index === 0 ? '25vw' : index === 1 ? '75vw' : '50vw',
            y: index === 0 ? '25vh' : index === 1 ? '35vh' : '65vh',
          }}
          transition={{ 
            duration: 0.8, 
            delay: index * 0.2,
            type: "spring",
            stiffness: 100
          }}
          style={{
            perspective: '1000px',
            transformStyle: 'preserve-3d'
          }}
        >
          <div className="relative w-16 h-16 rounded-full overflow-hidden shadow-glow transform transition-transform duration-500 hover:scale-110">
            <div className={`w-full h-full flex items-center justify-center text-white font-bold ${coinColors[crypto.id as keyof typeof coinColors] || 'bg-gray-500'}`}>
              {crypto.symbol.substring(0, 2).toUpperCase()}
            </div>
            
            {/* Price change indicator */}
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${crypto.price_change_percentage_24h >= 0 ? 'bg-green-500' : 'bg-red-500'}`}>
              {crypto.price_change_percentage_24h >= 0 ? '↑' : '↓'}
            </div>
          </div>
        </motion.div>
      ))}
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Hero content */}
          <div className="max-w-2xl">
            <motion.h1 
              className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-text-primary via-primary-light to-primary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Real-Time Crypto Conversion at Your Fingertips
            </motion.h1>
            
            <motion.p 
              className="hero-subtitle text-text-secondary text-lg md:text-xl mb-8 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              A sleek and powerful desktop application for real-time cryptocurrency conversion and tracking. Convert between multiple cryptocurrencies with live price updates.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link
                href="#download"
                className={cn(
                  "bg-gradient-to-r from-primary to-primary-light text-white",
                  "px-8 py-3 rounded-full font-medium text-center",
                  "hover:shadow-glow transition-all duration-300",
                  "flex items-center justify-center gap-2"
                )}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download Now
              </Link>
              
              <Link
                href="#features"
                className={cn(
                  "border border-primary/30 text-text-primary",
                  "px-8 py-3 rounded-full font-medium text-center",
                  "hover:bg-primary/10 transition-all duration-300",
                  "flex items-center justify-center gap-2"
                )}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
                See Features
              </Link>
            </motion.div>
            
            {/* Live Crypto Prices */}
            <motion.div 
              className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {isLoading && !isClient ? (
                <div className="col-span-3 text-center py-4">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                </div>
              ) : (
                displayData.slice(0, 3).map((crypto, index) => (
                  <div key={`price-${crypto.id}-${index}`} className="text-center p-3 rounded-xl bg-background-card/30 backdrop-blur-sm border border-gray-800/30 hover:border-primary/30 transition-all duration-300">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold ${coinColors[crypto.id as keyof typeof coinColors] || 'bg-gray-500'}`}>
                        {crypto.symbol.substring(0, 2).toUpperCase()}
                      </div>
                      <p className="text-text-primary font-medium">{crypto.symbol.toUpperCase()}</p>
                    </div>
                    <p className="text-xl font-bold text-primary-light">${crypto.current_price.toLocaleString()}</p>
                    <p className={`text-xs ${crypto.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {crypto.price_change_percentage_24h >= 0 ? '↑' : '↓'} 
                      {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                    </p>
                  </div>
                ))
              )}
            </motion.div>
          </div>
          
          {/* App preview */}
          <motion.div 
            className="app-preview w-full max-w-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.8,
              type: "spring",
              stiffness: 100
            }}
          >
            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-800 bg-background-card">
              {/* App window header */}
              <div className="bg-background-darker p-3 flex items-center gap-2 border-b border-gray-800">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-text-secondary text-xs font-medium ml-2">Crypto Converter</div>
              </div>
              
              {/* App screenshot - use a placeholder color instead of missing image */}
              <div className="relative aspect-[16/10] w-full bg-background-darker flex items-center justify-center">
                <div className="text-text-secondary">App Preview</div>
              </div>
            </div>
            
            {/* Floating badge */}
            <motion.div 
              className="absolute -bottom-4 -right-4 bg-secondary text-background px-4 py-2 rounded-full text-sm font-medium shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Cross-Platform
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <span className="text-text-secondary text-sm mb-2">Scroll to explore</span>
        <div className="w-6 h-10 border-2 border-text-secondary rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-text-secondary rounded-full animate-scroll-indicator"></div>
        </div>
      </motion.div>
    </section>
  );
} 