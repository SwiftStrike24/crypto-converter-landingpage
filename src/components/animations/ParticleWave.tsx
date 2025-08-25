'use client';

import { useEffect, useRef, useCallback } from 'react';
import { MotionValue } from 'framer-motion';

// Particle type definition
interface Particle {
  id: number;
  x: number;
  y: number;
  z: number; // For 3D effect
  size: number;
  color: string;
  velocity: { x: number; y: number; z: number };
  opacity: number;
  life: number;
}

interface ParticleWaveProps {
  className?: string;
  colorPalette?: string[];
  scrollYProgress?: MotionValue<number>;
  scrollYVelocity?: MotionValue<number>;
  animationType?: 'travel' | 'ambient';
  particleDensity?: number;
}

const defaultPurpleShades = [
  "#8a2be2", "#9932cc", "#9370db", "#ba55d3", 
  "#da70d6", "#7b68ee", "#6a5acd", "#4b0082"
];

const ParticleWave = ({ 
  className = "",
  colorPalette = defaultPurpleShades,
  scrollYProgress,
  scrollYVelocity,
  animationType = 'travel',
  particleDensity = 4000,
}: ParticleWaveProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mousePositionRef = useRef({ x: -1000, y: -1000 });

  const particlesRef = useRef<Particle[]>([]);

  const createParticle = useCallback((width: number, height: number): Particle => {
    return {
      id: Math.random(),
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 2 - 1,
      size: Math.random() * 2 + 1,
      color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
      velocity: {
        x: (Math.random() - 0.5) * 0.5,
        y: (Math.random() - 0.5) * 0.5,
        z: (Math.random() - 0.5) * 0.1
      },
      opacity: Math.random() * 0.5 + 0.2,
      life: 1
    };
  }, [colorPalette]);

  const initParticles = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const particleCount = Math.min(Math.floor(canvas.width / dpr * canvas.height / dpr / particleDensity), 200);
    particlesRef.current = Array.from({ length: particleCount }, () => createParticle(canvas.width / dpr, canvas.height / dpr));
  }, [createParticle, particleDensity]);

  useEffect(() => {
    initParticles();
    window.addEventListener('resize', initParticles);
    
    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', initParticles);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initParticles]);

  const animate = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    const progress = scrollYProgress ? scrollYProgress.get() : 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current.forEach((p, index) => {
      if (animationType === 'travel') {
        // "Warp drive" travel effect driven by scroll velocity
        const velocity = scrollYVelocity ? Math.abs(scrollYVelocity.get()) / 1000 : 0;
        const scrollMultiplier = 1 + velocity * 5;
        const warpSpeed = velocity * 100;
        
        p.x += p.velocity.x * scrollMultiplier;
        p.y += p.velocity.y * scrollMultiplier + (p.velocity.y > 0 ? warpSpeed : -warpSpeed); // Move in particle's direction
        p.z += p.velocity.z;

        // Draw particle trail
        const perspective = 1 + p.z * 0.5;
        ctx.beginPath();
        const trailLength = warpSpeed * 0.75;
        ctx.moveTo(p.x, p.y - (p.velocity.y > 0 ? trailLength : -trailLength));
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size * perspective;
        ctx.globalAlpha = p.opacity * perspective * Math.min(velocity * 5, 1);
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.stroke();
      } else {
        // Ambient, gentle floating effect
        const progressMultiplier = 1 + progress * 0.2;
        p.x += p.velocity.x * 0.5 * progressMultiplier;
        p.y += p.velocity.y * 0.5 * progressMultiplier;
        p.z += p.velocity.z;

        // Draw particle circle
        const perspective = 1 + p.z * 0.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * perspective, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity * perspective;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fill();
      }

      // Mouse interaction (common for both modes)
      const rect = canvas.getBoundingClientRect();
      const mouseX = mousePositionRef.current.x - rect.left;
      const mouseY = mousePositionRef.current.y - rect.top;
      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const repelRadius = 100;
      if (dist < repelRadius) {
        const force = (repelRadius - dist) / repelRadius;
        p.x -= dx * force * 0.1;
        p.y -= dy * force * 0.1;
      }

      // Boundary check
      if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
        particlesRef.current[index] = createParticle(width, height);
      }
      if (p.z < -1 || p.z > 1) {
        p.velocity.z *= -1;
      }
    });
    
    // Draw connections (fade out during travel)
    const connectionAlpha = scrollYVelocity ? Math.max(0.1 - Math.abs(scrollYVelocity.get()) / 2000, 0) : 0.1;
    ctx.globalAlpha = animationType === 'travel' ? connectionAlpha : 0.1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.shadowBlur = 0;
    
    for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
            const p1 = particlesRef.current[i];
            const p2 = particlesRef.current[j];
            const dist = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
            
            if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
    }


    animationFrameRef.current = requestAnimationFrame(animate);
  }, [scrollYVelocity, createParticle, animationType, scrollYProgress]);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animate]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default ParticleWave; 