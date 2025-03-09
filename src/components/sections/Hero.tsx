'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { getCryptoPrices, CryptoPrice, formatCurrency, FEATURED_CRYPTOS, CRYPTO_METADATA } from '@/lib/api';
import { motion } from 'framer-motion';
import ClientOnly from '@/components/ClientOnly';
import ConverterDemo from '@/components/demo/ConverterDemo';

// Floating crypto coin component with physics-based animation
const FloatingCryptoIcon = ({
  crypto,
  index
}: {
  crypto: CryptoPrice;
  index: number;
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [animationValues, setAnimationValues] = useState({
    x: 0,
    y: 0,
    rotate: 0,
    scale: 0.8
  });
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const coinRef = useRef<HTMLDivElement>(null);

  // Animation configuration
  const floatSpeed = 0.3 + (index % 3) * 0.2;
  const floatDistance = 30 + (index % 4) * 10; // Distance for movement
  const rotationAmount = 10; // Max rotation in degrees

  // Mouse interaction settings
  const interactionDistance = 250; // Pixels
  const interactionStrength = 0.5;

  // Get coin color from CRYPTO_METADATA
  const getCoinColor = (id: string): string => {
    return CRYPTO_METADATA[id]?.color || 'bg-gray-500';
  };

  // Track mouse position using a ref to avoid re-renders
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Set initial position on mount
  useEffect(() => {
    const xPos = 5 + (index % 4) * 23 + Math.random() * 10; // Distributed across width
    const yPos = 10 + Math.floor(index / 4) * 25 + Math.random() * 15; // Distributed across height

    setPosition({
      x: xPos,
      y: yPos
    });

    setAnimationValues(prev => ({
      ...prev,
      scale: 1
    }));
  }, [index]);

  // Continuous animation effect
  useEffect(() => {
    if (position.x === 0 && position.y === 0) return;

    let animationFrame: number;
    let lastTime = 0;
    let totalTime = 0;

    // Use floatSpeed to adjust animation periods
    const animationPeriodX = 8000 + index * 1000 * (1 / floatSpeed); // Adjust period based on floatSpeed
    const animationPeriodY = 10000 + index * 1200 * (1 / floatSpeed); // Adjust period based on floatSpeed
    const rotationPeriod = 15000 + index * 800; // 15-21 seconds for rotation cycle

    let mouseInfluenceX = 0;
    let mouseInfluenceY = 0;
    const mouseInfluenceDecay = 0.9; // Decay rate for mouse influence

    const animateFloat = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      totalTime += deltaTime;

      // Base animation runs continuously
      const xMovement = Math.sin(totalTime / animationPeriodX * Math.PI * 2) * floatDistance;
      const yMovement = Math.sin(totalTime / animationPeriodY * Math.PI * 2) * floatDistance;
      const rotation = Math.sin(totalTime / rotationPeriod * Math.PI * 2) * rotationAmount;

      // Decay mouse influence every frame
      mouseInfluenceX *= mouseInfluenceDecay;
      mouseInfluenceY *= mouseInfluenceDecay;

      // Apply repulsion only when mouse is near
      if (coinRef.current) {
        const rect = coinRef.current.getBoundingClientRect();
        const coinCenterX = rect.left + rect.width / 2;
        const coinCenterY = rect.top + rect.height / 2;

        const dx = mousePositionRef.current.x - coinCenterX;
        const dy = mousePositionRef.current.y - coinCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < interactionDistance && distance > 0) {
          const repulsionStrength = (1 - distance / interactionDistance) * interactionStrength;
          mouseInfluenceX = -dx * repulsionStrength;
          mouseInfluenceY = -dy * repulsionStrength;
        }
      }

      // Update animation values with base movement plus mouse influence
      setAnimationValues({
        x: xMovement + mouseInfluenceX,
        y: yMovement + mouseInfluenceY,
        rotate: rotation,
        scale: 1
      });

      animationFrame = requestAnimationFrame(animateFloat);
    };

    animationFrame = requestAnimationFrame(animateFloat);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [position, index, floatDistance, interactionDistance, interactionStrength, rotationAmount, floatSpeed]);

  if (position.x === 0 && position.y === 0) return null;

  return (
    <div
      ref={coinRef}
      className="absolute z-10 pointer-events-auto"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: `translate(${animationValues.x}px, ${animationValues.y}px) rotate(${animationValues.rotate}deg) scale(${animationValues.scale})`,
        willChange: 'transform' // Optimize rendering performance
      }}
    >
      <div
        className="w-16 h-16 rounded-full overflow-hidden shadow-lg hover:shadow-glow transform transition-transform duration-300 hover:scale-110 shadow-primary/50"
      >
        {crypto.image ? (
          <div className="relative w-full h-full">
            <Image
              src={crypto.image}
              alt={crypto.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className={`w-full h-full flex items-center justify-center text-white font-bold ${getCoinColor(crypto.id)}`}>
            {crypto.symbol.substring(0, 2).toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
};

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [cryptoData, setCryptoData] = useState<CryptoPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Set isClient to true on mount (client-side only)
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
        // Use placeholder data on error
        setCryptoData(generatePlaceholderData());
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Refresh data every 5 minutes instead of every minute
    // This reduces API calls significantly while keeping data reasonably fresh
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Generate placeholder crypto data from CRYPTO_METADATA
  const generatePlaceholderData = (): CryptoPrice[] => {
    return FEATURED_CRYPTOS.map(id => {
      const metadata = CRYPTO_METADATA[id];
      return {
        id,
        name: metadata?.name || id,
        symbol: metadata?.symbol || id.substring(0, 3),
        current_price: metadata?.fallbackPrice || 0,
        price_change_percentage_24h: metadata?.fallbackChange || 0,
        image: ''
      };
    });
  };

  // Use real data if available, otherwise use generated placeholder data
  const displayData = cryptoData.length > 0 ? cryptoData : generatePlaceholderData();

  // Get coin color from CRYPTO_METADATA
  const getCoinColor = (id: string): string => {
    return CRYPTO_METADATA[id]?.color || 'bg-gray-500';
  };

  // Calculate transform styles based on state
  const getTitleTransform = () => `translateY(${scrollY * 0.2}px)`;
  const getSubtitleTransform = () => `translateY(${scrollY * 0.1}px)`;
  const getAppPreviewTransform = () => `translateY(${scrollY * 0.05}px)`;

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen pt-24 pb-16 overflow-hidden bg-background-gradient"
    >
      {/* Background gradient with noise texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background-darker opacity-80"></div>
      <div className="absolute inset-0 bg-noise opacity-5"></div>

      {/* Floating crypto coins using real data - only render on client side */}
      <div className="absolute inset-0 overflow-hidden">
        <ClientOnly>
          {displayData.slice(0, Math.min(8, displayData.length)).map((crypto, index) => (
            <FloatingCryptoIcon
              key={`coin-${crypto.id}-${index}`}
              crypto={crypto}
              index={index}
            />
          ))}
        </ClientOnly>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Hero content */}
          <div className="max-w-2xl">
            <ClientOnly>
              <motion.h1
                className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-text-primary via-primary-light to-primary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ transform: getTitleTransform() }}
              >
                Real-Time Crypto Conversion at Your Fingertips
              </motion.h1>
            </ClientOnly>

            <ClientOnly>
              <motion.p
                className="hero-subtitle text-text-secondary text-lg md:text-xl mb-8 max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{ transform: getSubtitleTransform() }}
              >
                A sleek and powerful desktop application for real-time cryptocurrency conversion and tracking. Convert between multiple cryptocurrencies with live price updates.
              </motion.p>
            </ClientOnly>

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
              className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {isLoading && !isClient ? (
                <div className="col-span-full text-center py-4">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                </div>
              ) : (
                displayData.map((crypto, index) => (
                  <div key={`price-${crypto.id}-${index}`} className="text-center p-3 rounded-xl bg-background-card/30 backdrop-blur-sm border border-gray-800/30 hover:border-primary/30 transition-all duration-300">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      {crypto.image ? (
                        <div className="relative w-5 h-5">
                          <Image
                            src={crypto.image}
                            alt={crypto.name}
                            fill
                            sizes="20px"
                            className="rounded-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold ${getCoinColor(crypto.id)}`}>
                          {crypto.symbol.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <p className="text-text-primary font-medium">{crypto.symbol.toUpperCase()}</p>
                    </div>
                    <p className="text-2xl font-bold text-text-primary">
                      {formatCurrency(crypto.current_price)}
                    </p>
                    <p className={`text-sm font-medium ${crypto.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {crypto.price_change_percentage_24h >= 0 ? '+' : ''}{crypto.price_change_percentage_24h.toFixed(2)}%
                    </p>
                  </div>
                ))
              )}
            </motion.div>
          </div>

          {/* App preview */}
          <ClientOnly>
            <motion.div
              className="app-preview w-full max-w-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{ transform: getAppPreviewTransform() }}
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

                {/* Replace placeholder with ConverterDemo component */}
                <div className="w-full bg-background-darker p-4">
                  <ConverterDemo />
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
          </ClientOnly>
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