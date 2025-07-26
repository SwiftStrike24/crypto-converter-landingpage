'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAnimationContext } from '@/lib/animations';
import { createFPSCounter } from '@/lib/animations';

// Enhanced particle type with tail positions
interface Particle {
  id: number;
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  color: string;
  velocity: { x: number; y: number };
  opacity: number;
  glowIntensity: number;
  glowPhase: number;
  tail: { x: number; y: number }[];
  jitterOffset: { x: number; y: number };
  driftForce: number;
  isAmbient?: boolean;
}

interface ParticleWaveProps {
  className?: string;
  colorPalette?: string[];
}

const defaultNeonColors = [
  "#9945ff", // Bright purple
  "#14f195", // Mint green
  "#00d9ff", // Cyan
  "#ff00ff", // Magenta
  "#8a2be2", // Blue Violet
  "#da70d6", // Orchid
  "#4b0082", // Indigo
];

const ParticleWave = ({ 
  className = "",
  colorPalette = defaultNeonColors
}: ParticleWaveProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const fpsCounter = useRef(createFPSCounter());
  
  // Get animation context
  const animationContext = useAnimationContext();
  const { scrollProgress, mousePosition, isHighPerformance } = animationContext;
  
  // Performance settings based on device
  const PARTICLE_COUNT = isHighPerformance ? 120 : 60;
  const AMBIENT_COUNT = isHighPerformance ? 20 : 10;
  const TAIL_LENGTH = isHighPerformance ? 5 : 0;
  const ENABLE_GLOW = isHighPerformance;
  
  // Generate particles with enhanced properties
  const generateParticles = useCallback(() => {
    if (!canvasRef.current) return [];
    
    const { width, height } = canvasRef.current.getBoundingClientRect();
    const newParticles: Particle[] = [];
    
    // Regular particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      newParticles.push({
        id: i,
        x,
        y,
        baseX: x,
        baseY: y,
        size: Math.random() * 3 + 1,
        color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
        velocity: { 
          x: (Math.random() - 0.5) * 0.5, 
          y: (Math.random() - 0.5) * 0.5 
        },
        opacity: Math.random() * 0.5 + 0.3,
        glowIntensity: Math.random() * 0.5 + 0.5,
        glowPhase: Math.random() * Math.PI * 2,
        tail: [],
        jitterOffset: { x: 0, y: 0 },
        driftForce: Math.random() * 0.02 + 0.01,
        isAmbient: false
      });
    }
    
    // Ambient particles (larger, slower)
    for (let i = 0; i < AMBIENT_COUNT; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      newParticles.push({
        id: PARTICLE_COUNT + i,
        x,
        y,
        baseX: x,
        baseY: y,
        size: Math.random() * 8 + 4,
        color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
        velocity: { 
          x: (Math.random() - 0.5) * 0.1, 
          y: (Math.random() - 0.5) * 0.1 
        },
        opacity: Math.random() * 0.1 + 0.05,
        glowIntensity: Math.random() * 0.3 + 0.2,
        glowPhase: Math.random() * Math.PI * 2,
        tail: [],
        jitterOffset: { x: 0, y: 0 },
        driftForce: Math.random() * 0.005 + 0.002,
        isAmbient: true
      });
    }
    
    return newParticles;
  }, [colorPalette, PARTICLE_COUNT, AMBIENT_COUNT]);
  
  // Set up canvas and particles
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const updateDimensions = () => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });
      canvasRef.current.width = rect.width;
      canvasRef.current.height = rect.height;
      setParticles(generateParticles());
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [generateParticles]);
  
  // Draw particles with enhanced effects
  const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    const { x, y, size, color, opacity, glowIntensity, tail, isAmbient } = particle;
    
    // Draw tail if enabled
    if (TAIL_LENGTH > 0 && tail.length > 1 && !isAmbient) {
      ctx.beginPath();
      ctx.moveTo(tail[0].x, tail[0].y);
      
      for (let i = 1; i < tail.length; i++) {
        const alpha = opacity * (1 - i / tail.length) * 0.3;
        ctx.strokeStyle = `${color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = size * 0.5;
        ctx.lineTo(tail[i].x, tail[i].y);
        ctx.stroke();
      }
    }
    
    // Draw particle with glow
    if (ENABLE_GLOW) {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
      gradient.addColorStop(0, `${color}${Math.floor(opacity * glowIntensity * 255).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(0.3, `${color}${Math.floor(opacity * glowIntensity * 0.5 * 255).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x - size * 3, y - size * 3, size * 6, size * 6);
    }
    
    // Draw main particle
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
    ctx.fill();
  };
  
  // Animation loop
  const animate = useCallback((timestamp: number = 0) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const deltaTime = timestamp - (lastTimeRef.current || timestamp);
    lastTimeRef.current = timestamp;
    
    // Update FPS
    const fps = fpsCounter.current.update();
    
    // Performance degradation
    const shouldDegrade = fps < 30 && isHighPerformance;
    if (shouldDegrade && deltaTime < 100) {
      console.log(`Performance degradation activated: FPS ${fps}`);
    }
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    const updatedParticles = particles.map(particle => {
      // Calculate wave effect
      const waveAmplitude = 0.5 + scrollProgress * 0.5;
      const waveFrequency = 0.002;
      const wavePhase = timestamp * 0.0005;
      const waveY = Math.sin(particle.x * waveFrequency + wavePhase) * waveAmplitude;
      
      // Jitter effect
      const jitterX = (Math.random() - 0.5) * 0.5;
      const jitterY = (Math.random() - 0.5) * 0.5;
      
      // Gravitational drift
      const driftY = particle.driftForce * deltaTime * 0.1;
      
      // Mouse interaction (ripple effect)
      let mouseForceX = 0;
      let mouseForceY = 0;
      const dx = mousePosition.x - particle.x;
      const dy = mousePosition.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const interactionRadius = 150;
      
      if (distance < interactionRadius && distance > 0) {
        const force = (1 - distance / interactionRadius) * 0.5;
        mouseForceX = (dx / distance) * force * -5;
        mouseForceY = (dy / distance) * force * -5;
      }
      
      // Scroll-linked speed
      const speedMultiplier = 1 + scrollProgress * 2;
      
      // Update position
      let newX = particle.x + 
        (particle.velocity.x * speedMultiplier + jitterX + mouseForceX) * deltaTime * 0.1;
      let newY = particle.y + 
        (particle.velocity.y * speedMultiplier + waveY + jitterY + driftY + mouseForceY) * deltaTime * 0.1;
      
      // Boundary wrapping
      if (newX < 0) newX = canvas.width;
      if (newX > canvas.width) newX = 0;
      if (newY < 0) newY = canvas.height;
      if (newY > canvas.height) newY = 0;
      
      // Update tail
      const newTail = [...particle.tail];
      if (!particle.isAmbient && TAIL_LENGTH > 0) {
        newTail.push({ x: particle.x, y: particle.y });
        if (newTail.length > TAIL_LENGTH) {
          newTail.shift();
        }
      }
      
      // Update glow phase
      const newGlowPhase = particle.glowPhase + deltaTime * 0.002;
      const newGlowIntensity = 0.5 + Math.sin(newGlowPhase) * 0.3;
      
      return {
        ...particle,
        x: newX,
        y: newY,
        tail: newTail,
        glowPhase: newGlowPhase,
        glowIntensity: newGlowIntensity,
        jitterOffset: { x: jitterX, y: jitterY }
      };
    });
    
    setParticles(updatedParticles);
    
    // Draw connections
    const connectionDistance = 100;
    for (let i = 0; i < updatedParticles.length; i++) {
      const p1 = updatedParticles[i];
      if (p1.isAmbient) continue;
      
      for (let j = i + 1; j < updatedParticles.length; j++) {
        const p2 = updatedParticles[j];
        if (p2.isAmbient) continue;
        
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < connectionDistance) {
          const opacity = (1 - distance / connectionDistance) * 0.2;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(153, 69, 255, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    
    // Draw all particles
    updatedParticles.forEach(particle => drawParticle(ctx, particle));
    
    animationRef.current = requestAnimationFrame(animate);
  }, [particles, scrollProgress, mousePosition, isHighPerformance, TAIL_LENGTH, ENABLE_GLOW]);
  
  // Start animation
  useEffect(() => {
    if (particles.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, particles.length]);
  
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ 
          filter: isHighPerformance ? 'contrast(1.1) brightness(1.05)' : undefined 
        }}
      />
    </div>
  );
};

export default ParticleWave; 