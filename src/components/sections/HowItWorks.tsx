'use client';

import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, RefreshCw, BarChart3, Wallet, Activity } from 'lucide-react';
import React from 'react';

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

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const nextStep = () => {
    setActiveStep((prev) => (prev + 1) % steps.length);
  };
  
  const prevStep = () => {
    setActiveStep((prev) => (prev - 1 + steps.length) % steps.length);
  };

  return (
    <section 
      id="how-it-works" 
      className="py-16 bg-background-darker relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-noise opacity-5"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-primary">
            How It Works
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Powerful features that make crypto conversion simple and intuitive
          </p>
        </motion.div>
        
        <div ref={containerRef} className="relative max-w-5xl mx-auto">
          {/* Step indicators */}
          <div className="flex justify-center mb-8 gap-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  activeStep === index 
                    ? "w-8 bg-primary" 
                    : "bg-gray-700 hover:bg-gray-600"
                )}
                aria-label={`Go to step ${index + 1}: ${step.title}`}
              />
            ))}
          </div>
          
          {/* Main content area */}
          <div className="relative bg-background-card/30 backdrop-blur-sm rounded-xl border border-gray-800/30 p-6 md:p-8 overflow-hidden">
            {/* Navigation buttons */}
            <button 
              onClick={prevStep}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background-card/80 hover:bg-background-card p-2 rounded-full border border-gray-800/50"
              aria-label="Previous step"
            >
              <ChevronLeft className="w-5 h-5 text-text-primary" />
            </button>
            
            <button 
              onClick={nextStep}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background-card/80 hover:bg-background-card p-2 rounded-full border border-gray-800/50"
              aria-label="Next step"
            >
              <ChevronRight className="w-5 h-5 text-text-primary" />
            </button>
            
            {/* Step content with animation */}
            <div className="min-h-[300px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full flex flex-col md:flex-row items-center gap-8"
                >
                  {/* Step visualization */}
                  <div className="w-full md:w-1/2">
                    <div className={`aspect-square md:aspect-video rounded-xl overflow-hidden relative bg-gradient-to-br ${steps[activeStep].color} flex items-center justify-center p-8 shadow-lg`}>
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-white"
                      >
                        {/* Render the icon component */}
                        {React.createElement(steps[activeStep].icon, { className: "w-24 h-24 md:w-32 md:h-32 mx-auto" })}
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Step text content */}
                  <div className="w-full md:w-1/2 text-center md:text-left">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary mb-4">
                      {activeStep + 1}
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-text-primary">
                      {steps[activeStep].title}
                    </h3>
                    <p className="text-text-secondary text-lg">
                      {steps[activeStep].description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          
          {/* Step quick navigation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(index)}
                className={cn(
                  "py-3 px-4 rounded-lg transition-all duration-300 flex flex-col items-center text-center",
                  activeStep === index 
                    ? "bg-primary/20 border border-primary/30" 
                    : "bg-background-card/50 border border-gray-800/30 hover:bg-background-card/80"
                )}
              >
                {/* Render the icon component */}
                {React.createElement(step.icon, { 
                  className: cn(
                    "w-5 h-5 mb-1",
                    activeStep === index ? "text-primary" : "text-text-secondary"
                  )
                })}
                <span className={cn(
                  "text-sm font-medium",
                  activeStep === index ? "text-text-primary" : "text-text-secondary"
                )}>
                  {step.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 