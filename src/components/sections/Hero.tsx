'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  
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
        (coin as HTMLElement).style.transform = `translate(${moveX * 20 * factor}px, ${moveY * 20 * factor}px)`;
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen pt-24 pb-16 overflow-hidden bg-background-gradient"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background-darker opacity-80"></div>
      
      {/* Floating coins */}
      <div className="absolute top-1/4 left-1/4 w-16 h-16 floating-coin">
        <Image
          src="/images/bitcoin.svg"
          alt="Bitcoin"
          width={64}
          height={64}
          className="animate-float"
        />
      </div>
      <div className="absolute top-1/3 right-1/4 w-12 h-12 floating-coin">
        <Image
          src="/images/ethereum.svg"
          alt="Ethereum"
          width={48}
          height={48}
          className="animate-float-delay-1"
        />
      </div>
      <div className="absolute bottom-1/4 left-1/3 w-10 h-10 floating-coin">
        <Image
          src="/images/solana.svg"
          alt="Solana"
          width={40}
          height={40}
          className="animate-float-delay-2"
        />
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Hero content */}
          <div className="max-w-2xl">
            <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-text-primary via-primary-light to-primary">
              Real-Time Crypto Conversion at Your Fingertips
            </h1>
            <p className="hero-subtitle text-text-secondary text-lg md:text-xl mb-8 max-w-xl">
              A sleek and powerful desktop application for real-time cryptocurrency conversion and tracking. Convert between multiple cryptocurrencies with live price updates.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
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
            </div>
            
            {/* Stats */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary-light">10K+</p>
                <p className="text-text-secondary text-sm">Active Users</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary-light">50+</p>
                <p className="text-text-secondary text-sm">Cryptocurrencies</p>
              </div>
              <div className="text-center sm:col-span-1 col-span-2">
                <p className="text-3xl font-bold text-primary-light">24/7</p>
                <p className="text-text-secondary text-sm">Live Updates</p>
              </div>
            </div>
          </div>
          
          {/* App preview */}
          <div className="app-preview w-full max-w-lg">
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
              
              {/* App screenshot */}
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src="/images/app-preview.png"
                  alt="Crypto Converter App"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            
            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 bg-secondary text-background px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              Cross-Platform
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <span className="text-text-secondary text-sm mb-2">Scroll to explore</span>
        <div className="w-6 h-10 border-2 border-text-secondary rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-text-secondary rounded-full animate-scroll-indicator"></div>
        </div>
      </div>
    </section>
  );
} 