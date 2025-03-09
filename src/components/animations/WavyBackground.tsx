'use client';

import { motion, useTransform, useScroll } from 'framer-motion';

interface WavyBackgroundProps {
  className?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

const WavyBackground = ({
  className = "",
  primaryColor = "rgba(138, 43, 226, 0.05)",
  secondaryColor = "rgba(123, 104, 238, 0.04)"
}: WavyBackgroundProps) => {
  const { scrollYProgress } = useScroll({});
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0,50 C20,40 35,60 50,50 C65,40 80,60 100,50 L100,100 L0,100 Z"
          fill={primaryColor}
          style={{ y: y1 }}
        />
        <motion.path
          d="M0,60 C15,70 30,50 50,60 C70,70 85,50 100,60 L100,100 L0,100 Z"
          fill={secondaryColor}
          style={{ y: y2 }}
        />
      </svg>
    </div>
  );
};

export default WavyBackground; 