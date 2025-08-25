'use client';

import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, useTransform, MotionValue } from 'framer-motion';
import { ChevronRight, ChevronLeft, RefreshCw, BarChart3, Wallet, Activity } from 'lucide-react';
import React from 'react';
import ParticleWave from '@/components/animations/ParticleWave';

// Steps data with icons
const steps = [
  {
    id: 'select',
    title: 'Select Cryptocurrencies',
    description: 'Choose from 50+ cryptocurrencies to convert between. Add your favorites for quick access.',
    color: 'from-purple-500 to-purple-600',
    icon: Wallet,
  },
  {
    id: 'convert',
    title: 'Convert Instantly',
    description: 'Enter the amount and get real-time conversion rates with up-to-the-second accuracy.',
    color: 'from-green-500 to-green-600',
    icon: RefreshCw,
  },
  {
    id: 'track',
    title: 'Crypto Chart',
    description: 'View detailed price charts and historical data for any cryptocurrency with customizable timeframes.',
    color: 'from-orange-500 to-orange-600',
    icon: BarChart3,
  },
  {
    id: 'analyze',
    title: 'Technical Analysis',
    description: 'Get professional buy/sell signals and market sentiment analysis powered by TradingView to make smarter trading decisions.',
    color: 'from-red-500 to-red-600',
    icon: Activity,
  },
];

const orangeStarPalette = [
  '#FFC300', '#FF5733', '#C70039', '#900C3F', '#581845', '#DAF7A6', '#FFC300', '#FF5733'
];

export default function HowItWorks({
  featuresScrollYProgress,
  howItWorksScrollYProgress,
  howItWorksScrollYVelocity,
}: {
  featuresScrollYProgress: MotionValue<number>;
  howItWorksScrollYProgress: MotionValue<number>;
  howItWorksScrollYVelocity: MotionValue<number>;
}) {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Entry animation from previous section
  const scale = useTransform(featuresScrollYProgress, [0.3, 0.6], [0.9, 1]);
  const opacity = useTransform(featuresScrollYProgress, [0.3, 0.6], [0, 1]);

  // Exit animation for this section
  const exitScale = useTransform(howItWorksScrollYProgress, [0, 0.8], [1, 0.8]);
  const exitOpacity = useTransform(howItWorksScrollYProgress, [0, 0.5, 0.8], [1, 1, 0]);
  
  const nextStep = () => {
    setActiveStep((prev) => (prev + 1) % steps.length);
  };
  
  const prevStep = () => {
    setActiveStep((prev) => (prev - 1 + steps.length) % steps.length);
  };

  return (
    <motion.section
      id="how-it-works"
      className="py-10 sm:py-12 md:py-16 bg-background-darker relative overflow-hidden"
      style={{ scale, opacity }}
    >
      <motion.div style={{ scale: exitScale, opacity: exitOpacity }}>
        <ParticleWave scrollYProgress={featuresScrollYProgress} animationType="ambient" colorPalette={orangeStarPalette} />
        <ParticleWave scrollYProgress={howItWorksScrollYProgress} scrollYVelocity={howItWorksScrollYVelocity} animationType="travel" colorPalette={orangeStarPalette} />
      {/* Background elements */}
      <div className="absolute inset-0 bg-noise opacity-5"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div 
          className="text-center mb-6 sm:mb-8 md:mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-primary">
            How It Works
          </h2>
          <p className="text-text-secondary text-sm sm:text-base max-w-2xl mx-auto px-2">
            Powerful features that make crypto conversion simple and intuitive
          </p>
        </motion.div>
        
        <div ref={containerRef} className="relative max-w-5xl mx-auto">
          {/* Step indicators */}
          <div className="flex justify-center mb-4 sm:mb-6 md:mb-8 gap-1.5 sm:gap-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(index)}
                className={cn(
                  "h-1.5 sm:h-2 rounded-full transition-all duration-300",
                  activeStep === index 
                    ? "w-6 sm:w-8 bg-primary" 
                    : "w-1.5 sm:w-2 bg-gray-700 hover:bg-gray-600"
                )}
                aria-label={`Go to step ${index + 1}: ${step.title}`}
              />
            ))}
          </div>
          
          {/* Main content area */}
          <div className="relative bg-background-card/30 backdrop-blur-sm rounded-xl border border-gray-800/30 p-4 sm:p-6 md:p-8 overflow-hidden">
            {/* Navigation buttons */}
            <button 
              onClick={prevStep}
              className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-10 bg-background-card/80 hover:bg-background-card p-1.5 sm:p-2 rounded-full border border-gray-800/50 touch-manipulation"
              aria-label="Previous step"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-text-primary" />
            </button>
            
            <button 
              onClick={nextStep}
              className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-10 bg-background-card/80 hover:bg-background-card p-1.5 sm:p-2 rounded-full border border-gray-800/50 touch-manipulation"
              aria-label="Next step"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-text-primary" />
            </button>
            
            {/* Step content with animation */}
            <div className="min-h-[250px] sm:min-h-[280px] md:min-h-[300px] flex items-center py-4 sm:py-6">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full flex flex-col md:flex-row items-center gap-4 sm:gap-6 md:gap-8 px-2 sm:px-4"
                >
                  {/* Step visualization */}
                  <div className="w-full md:w-1/2">
                    <div className={`aspect-square md:aspect-video rounded-lg sm:rounded-xl overflow-hidden relative bg-gradient-to-br ${steps[activeStep].color} flex items-center justify-center p-4 sm:p-6 md:p-8 shadow-lg`}>
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-white"
                      >
                        {/* Render the icon component */}
                        {React.createElement(steps[activeStep].icon, { 
                          className: "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 mx-auto" 
                        })}
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Step text content */}
                  <div className="w-full md:w-1/2 text-center md:text-left mt-4 md:mt-0">
                    <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/20 text-primary mb-2 sm:mb-4 text-sm sm:text-base">
                      {activeStep + 1}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-text-primary">
                      {steps[activeStep].title}
                    </h3>
                    <p className="text-text-secondary text-sm sm:text-base md:text-lg">
                      {steps[activeStep].description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          
          {/* Step quick navigation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mt-4 sm:mt-6">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(index)}
                className={cn(
                  "py-2 sm:py-3 px-2 sm:px-4 rounded-lg transition-all duration-300 flex flex-col items-center text-center",
                  activeStep === index 
                    ? "bg-primary/20 border border-primary/30" 
                    : "bg-background-card/50 border border-gray-800/30 hover:bg-background-card/80"
                )}
              >
                {/* Render the icon component */}
                {React.createElement(step.icon, { 
                  className: cn(
                    "w-4 h-4 sm:w-5 sm:h-5 mb-1",
                    activeStep === index ? "text-primary" : "text-text-secondary"
                  )
                })}
                <span className={cn(
                  "text-xs sm:text-sm font-medium line-clamp-1",
                  activeStep === index ? "text-text-primary" : "text-text-secondary"
                )}>
                  {step.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      </motion.div>
    </motion.section>
  );
} 