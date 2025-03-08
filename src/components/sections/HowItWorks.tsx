'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// Steps data
const steps = [
  {
    id: 'install',
    title: 'Install the App',
    description: 'Download and install Crypto Converter on your preferred platform (Windows, macOS, or Linux).',
    image: '/images/how-it-works/install.png',
  },
  {
    id: 'select',
    title: 'Select Cryptocurrencies',
    description: 'Choose from 50+ cryptocurrencies to convert between. Add your favorites for quick access.',
    image: '/images/how-it-works/select.png',
  },
  {
    id: 'convert',
    title: 'Convert Instantly',
    description: 'Enter the amount and get real-time conversion rates with up-to-the-second accuracy.',
    image: '/images/how-it-works/convert.png',
  },
  {
    id: 'track',
    title: 'Track Your Portfolio',
    description: 'Add your holdings to track your portfolio value in real-time with detailed analytics.',
    image: '/images/how-it-works/track.png',
  },
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(steps[0].id);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  
  // Intersection Observer to trigger animations when section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.2 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  
  // Auto-advance steps
  useEffect(() => {
    if (!isInView) return;
    
    const interval = setInterval(() => {
      const currentIndex = steps.findIndex(step => step.id === activeStep);
      const nextIndex = (currentIndex + 1) % steps.length;
      setActiveStep(steps[nextIndex].id);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [activeStep, isInView]);
  
  return (
    <section 
      id="how-it-works" 
      ref={sectionRef}
      className="py-20 bg-background-darker relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[120px] -z-10"></div>
      
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-primary">
            How Crypto Converter Works
          </h2>
          <p className="text-text-secondary text-lg">
            Get started in minutes with our simple, intuitive workflow.
          </p>
        </div>
        
        {/* Steps timeline */}
        <div className="flex flex-col md:flex-row gap-8 mb-16">
          <div className="w-full md:w-1/3 space-y-6">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  "relative pl-12 py-4 cursor-pointer transition-all duration-300",
                  "border-l-2 border-gray-700",
                  activeStep === step.id ? "border-l-primary" : ""
                )}
                onClick={() => setActiveStep(step.id)}
              >
                {/* Step number */}
                <div className={cn(
                  "absolute left-[-18px] top-4 w-9 h-9 rounded-full flex items-center justify-center",
                  "border-2 transition-colors duration-300",
                  activeStep === step.id 
                    ? "border-primary bg-primary/20 text-primary" 
                    : "border-gray-700 bg-background-darker text-text-secondary"
                )}>
                  {index + 1}
                </div>
                
                <h3 className={cn(
                  "text-xl font-semibold mb-2 transition-colors duration-300",
                  activeStep === step.id ? "text-primary" : "text-text-primary"
                )}>
                  {step.title}
                </h3>
                <p className="text-text-secondary text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
          
          {/* Step visualization */}
          <div className="w-full md:w-2/3 bg-background rounded-2xl p-6 border border-gray-800 relative h-[400px] md:h-auto">
            {steps.map((step) => (
              <div
                key={step.id}
                className={cn(
                  "absolute inset-0 transition-all duration-500 p-6",
                  activeStep === step.id 
                    ? "opacity-100 transform-none" 
                    : "opacity-0 translate-x-8"
                )}
                style={{ 
                  zIndex: activeStep === step.id ? 10 : 0,
                  pointerEvents: activeStep === step.id ? 'auto' : 'none'
                }}
              >
                <div className="relative w-full h-full rounded-xl overflow-hidden border border-gray-800">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Step indicator */}
                  <div className="absolute bottom-4 right-4 bg-background-darker/80 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="text-primary font-medium">Step {steps.findIndex(s => s.id === step.id) + 1}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Progress indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {steps.map((step) => (
                <button
                  key={step.id}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    activeStep === step.id ? "bg-primary w-6" : "bg-gray-700"
                  )}
                  onClick={() => setActiveStep(step.id)}
                  aria-label={`Go to step ${step.title}`}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Call to action */}
        <div className="text-center">
          <p className="text-text-secondary mb-6">
            Ready to start converting cryptocurrencies with ease?
          </p>
          <a
            href="#download"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-light text-white px-8 py-3 rounded-full font-medium hover:shadow-glow transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download Now
          </a>
        </div>
      </div>
    </section>
  );
} 