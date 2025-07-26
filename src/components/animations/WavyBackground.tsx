'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useAnimationContext } from '@/lib/animations';

interface WavyBackgroundProps {
  className?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

const WavyBackground = ({
  className = "",
  primaryColor = "#9945ff",
  secondaryColor = "#14f195"
}: WavyBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const rippleRef = useRef<{ x: number; y: number; strength: number; time: number }[]>([]);
  
  // Get animation context
  const { scrollProgress, mousePosition, isHighPerformance } = useAnimationContext();
  
  // Wave configuration
  const WAVE_LAYERS = isHighPerformance ? 4 : 2;
  const WAVE_SEGMENTS = isHighPerformance ? 100 : 50;
  
  // Draw wave layer with neon glow
  const drawWaveLayer = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number,
    layerIndex: number,
    color: string,
    amplitude: number,
    frequency: number,
    speed: number,
    scrollOffset: number
  ) => {
    const segmentWidth = width / WAVE_SEGMENTS;
    
    ctx.beginPath();
    ctx.moveTo(0, height);
    
    // Calculate wave points
    const points: { x: number; y: number }[] = [];
    
    for (let i = 0; i <= WAVE_SEGMENTS; i++) {
      const x = i * segmentWidth;
      const baseY = height * 0.6;
      
      // Base wave calculation
      let y = baseY + Math.sin((x * frequency + time * speed) * Math.PI / 180) * amplitude;
      
      // Add scroll influence
      y += scrollOffset * scrollProgress;
      
      // Add ripple effects from mouse
      rippleRef.current.forEach(ripple => {
        const dx = x - ripple.x;
        const dy = baseY - ripple.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 300;
        const timeFactor = Math.max(0, 1 - (time - ripple.time) / 2000);
        
        if (distance < maxDistance && timeFactor > 0) {
          const rippleHeight = Math.sin((distance - (time - ripple.time) * 0.3) * 0.05) * 
            ripple.strength * timeFactor * (1 - distance / maxDistance);
          y += rippleHeight * 20;
        }
      });
      
      // Apply secondary wave for more organic motion
      y += Math.sin((x * frequency * 0.5 + time * speed * 1.3) * Math.PI / 180) * amplitude * 0.3;
      
      points.push({ x, y });
      ctx.lineTo(x, y);
    }
    
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    
    // Create gradient fill with transparency
    const gradient = ctx.createLinearGradient(0, height * 0.5, 0, height);
    const alpha = 0.1 - layerIndex * 0.02;
    gradient.addColorStop(0, `${color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`);
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Add neon glow effect on top edge if high performance
    if (isHighPerformance) {
      ctx.beginPath();
      points.forEach((point, i) => {
        if (i === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.3 - layerIndex * 0.05;
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    }
  };
  
  // Animation loop
  const animate = useCallback((timestamp: number = 0) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply composition for better blending
    ctx.globalCompositeOperation = 'screen';
    
    // Draw multiple wave layers
    for (let i = 0; i < WAVE_LAYERS; i++) {
      const layerProgress = i / WAVE_LAYERS;
      const amplitude = 30 + i * 10 + scrollProgress * 20;
      const frequency = 0.01 - i * 0.002;
      const speed = 0.02 + i * 0.01 + scrollProgress * 0.02;
      const scrollOffset = i * 20;
      
      // Alternate colors between layers
      const color = i % 2 === 0 ? primaryColor : secondaryColor;
      
      drawWaveLayer(
        ctx,
        canvas.width,
        canvas.height,
        timestamp,
        i,
        color,
        amplitude,
        frequency,
        speed,
        scrollOffset
      );
    }
    
    // Reset composition
    ctx.globalCompositeOperation = 'source-over';
    
    // Clean up old ripples
    rippleRef.current = rippleRef.current.filter(
      ripple => timestamp - ripple.time < 2000
    );
    
    animationRef.current = requestAnimationFrame(animate);
  }, [primaryColor, secondaryColor, scrollProgress, isHighPerformance, WAVE_LAYERS]);
  
  // Handle mouse interactions
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Add ripple
      rippleRef.current.push({
        x,
        y,
        strength: 1,
        time: performance.now()
      });
    };
    
    // Add subtle ripples on mouse move
    let lastRippleTime = 0;
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current || !isHighPerformance) return;
      
      const now = performance.now();
      if (now - lastRippleTime < 100) return; // Throttle ripples
      
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Only add ripple if mouse is in lower portion of screen
      if (y > rect.height * 0.4) {
        rippleRef.current.push({
          x,
          y,
          strength: 0.3,
          time: now
        });
        lastRippleTime = now;
      }
    };
    
    window.addEventListener('click', handleClick);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isHighPerformance]);
  
  // Set up canvas and start animation
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const updateDimensions = () => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      canvasRef.current.width = rect.width;
      canvasRef.current.height = rect.height;
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);
  
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          filter: isHighPerformance ? 'contrast(1.2) brightness(1.1)' : undefined,
          opacity: 0.8
        }}
      />
    </div>
  );
};

export default WavyBackground; 