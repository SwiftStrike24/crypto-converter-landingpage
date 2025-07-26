'use client';

import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useScroll, MotionValue } from 'framer-motion';

// Animation context for sharing scroll and mouse data
interface AnimationContextType {
  scrollProgress: number;
  mousePosition: { x: number; y: number };
  scrollYProgress: MotionValue<number>;
  isHighPerformance: boolean;
}

const AnimationContext = createContext<AnimationContextType | null>(null);

export const useAnimationContext = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimationContext must be used within AnimationProvider');
  }
  return context;
};

// Performance detection utility
export const detectPerformance = (): boolean => {
  // Check device memory if available
  if ('deviceMemory' in navigator) {
    return (navigator as any).deviceMemory >= 4;
  }
  
  // Check for mobile devices
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Simple performance check based on screen size and device type
  const isLargeScreen = window.innerWidth > 1024;
  
  return !isMobile && isLargeScreen;
};

// FPS counter utility
export const createFPSCounter = () => {
  let fps = 60;
  let lastTime = performance.now();
  let frames = 0;
  
  const update = () => {
    frames++;
    const currentTime = performance.now();
    
    if (currentTime >= lastTime + 1000) {
      fps = Math.round((frames * 1000) / (currentTime - lastTime));
      frames = 0;
      lastTime = currentTime;
    }
    
    return fps;
  };
  
  return { update, getFPS: () => fps };
};

export { AnimationContext };

/**
 * Animation utilities for the Crypto Converter landing page
 * Using Framer Motion animation variants
 */

// Fade in animation variant
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.6 }
  }
};

// Fade up animation variant
export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

// Staggered children animation variant
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Scale animation variant
export const scaleUp = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5 }
  }
};

// Floating animation for 3D elements
export const float = {
  initial: { y: 0 },
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  }
};

// Pulse animation for buttons and interactive elements
export const pulse = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  }
};

/**
 * Animation for horizontal scrolling text
 */
export const scrollXAnimation = {
  '@keyframes scrollX': {
    '0%': { transform: 'translateX(0)' },
    '100%': { transform: 'translateX(-50%)' }
  },
  '.animate-scroll-x': {
    animation: 'scrollX 20s linear infinite'
  }
}; 