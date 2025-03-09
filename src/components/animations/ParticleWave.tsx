'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// Particle type definition
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  velocity: { x: number; y: number };
  opacity: number;
}

// Connection type definition
interface Connection {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity: number;
}

interface ParticleWaveProps {
  className?: string;
  colorPalette?: string[];
}

const defaultPurpleShades = [
  "#8a2be2", // Blue Violet
  "#9932cc", // Dark Orchid
  "#9370db", // Medium Purple
  "#ba55d3", // Medium Orchid
  "#da70d6", // Orchid
  "#7b68ee", // Medium Slate Blue
  "#6a5acd", // Slate Blue
  "#4b0082", // Indigo
];

const ParticleWave = ({ 
  className = "",
  colorPalette = defaultPurpleShades
}: ParticleWaveProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  
  const waveRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  
  const generateParticles = useCallback(() => {
    if (!waveRef.current) return [];
    
    const { width, height } = waveRef.current.getBoundingClientRect();
    const newParticles: Particle[] = [];
    const particleCount = Math.min(Math.floor(width * height / 10000), 150);
    
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3 + 1,
        color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
        velocity: { 
          x: (Math.random() - 0.5) * 0.3, 
          y: (Math.random() - 0.5) * 0.3 
        },
        opacity: Math.random() * 0.5 + 0.2
      });
    }
    
    return newParticles;
  }, [colorPalette]);
  
  useEffect(() => {
    setParticles(generateParticles() || []);
    
    const handleResize = () => {
      setParticles(generateParticles());
    };
    
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [generateParticles]);
  
  const animateParticles = useCallback((time: number = 0) => {
    if (!waveRef.current) return;
    
    const { width, height } = waveRef.current.getBoundingClientRect();
    const deltaTime = time - (lastTimeRef.current || time);
    lastTimeRef.current = time;
    
    setParticles(prevParticles => 
      prevParticles.map(particle => {
        // Wave motion physics
        const waveAmplitude = 0.3;
        const waveFrequency = 0.002;
        const wavePhase = time * 0.0005;
        
        // Create wave-like motion
        const waveY = Math.sin(particle.x * waveFrequency + wavePhase) * waveAmplitude;
        
        // Update position with velocity and wave effect
        let newX = particle.x + particle.velocity.x * deltaTime * 0.1;
        let newY = particle.y + particle.velocity.y * deltaTime * 0.1 + waveY;
        
        // Boundary checks with wrapping
        if (newX < 0) newX = width;
        if (newX > width) newX = 0;
        if (newY < 0) newY = height;
        if (newY > height) newY = 0;
        
        return {
          ...particle,
          x: newX,
          y: newY
        };
      })
    );
    
    animationRef.current = requestAnimationFrame(animateParticles);
  }, []);
  
  useEffect(() => {
    animationRef.current = requestAnimationFrame(animateParticles);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animateParticles]);
  
  // Create connected lines between nearby particles
  const getConnections = () => {
    const connections: Connection[] = [];
    const connectionDistance = 100;
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < connectionDistance) {
          const opacity = (1 - distance / connectionDistance) * 0.3;
          connections.push({
            id: `${p1.id}-${p2.id}`,
            x1: p1.x,
            y1: p1.y,
            x2: p2.x,
            y2: p2.y,
            opacity
          });
        }
      }
    }
    
    return connections;
  };
  
  const connections = getConnections();
  
  return (
    <div 
      className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}
      ref={waveRef}
    >
      <svg className="absolute inset-0 w-full h-full">
        {/* Create a soft gradient background for the waves */}
        <defs>
          <radialGradient id="waveGradient" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="rgba(138, 43, 226, 0.05)" />
            <stop offset="100%" stopColor="rgba(138, 43, 226, 0)" />
          </radialGradient>
        </defs>
        
        <rect x="0" y="0" width="100%" height="100%" fill="url(#waveGradient)" />
        
        {/* Draw connections between particles */}
        {connections.map(conn => (
          <line
            key={conn.id}
            x1={conn.x1}
            y1={conn.y1}
            x2={conn.x2}
            y2={conn.y2}
            stroke="rgba(138, 43, 226, 0.3)"
            strokeWidth="0.5"
            strokeOpacity={conn.opacity}
          />
        ))}
        
        {/* Draw particles */}
        {particles.map(particle => (
          <circle
            key={particle.id}
            cx={particle.x}
            cy={particle.y}
            r={particle.size}
            fill={particle.color}
            opacity={particle.opacity}
          >
            <animate
              attributeName="opacity"
              values={`${particle.opacity};${particle.opacity * 1.5};${particle.opacity}`}
              dur={`${Math.random() * 3 + 2}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>
    </div>
  );
};

export default ParticleWave; 