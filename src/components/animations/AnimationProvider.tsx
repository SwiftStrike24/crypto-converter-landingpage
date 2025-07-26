'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useScroll } from 'framer-motion';
import { AnimationContext, detectPerformance } from '@/lib/animations';

interface AnimationProviderProps {
  children: ReactNode;
}

export const AnimationProvider = ({ children }: AnimationProviderProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHighPerformance, setIsHighPerformance] = useState(true);
  const { scrollYProgress } = useScroll();
  
  // Set up performance detection
  useEffect(() => {
    setIsHighPerformance(detectPerformance());
    
    // Re-check on resize
    const handleResize = () => {
      setIsHighPerformance(detectPerformance());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Track scroll progress
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (value) => {
      setScrollProgress(value);
    });
    
    return unsubscribe;
  }, [scrollYProgress]);
  
  return (
    <AnimationContext.Provider
      value={{
        scrollProgress,
        mousePosition,
        scrollYProgress,
        isHighPerformance
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
};