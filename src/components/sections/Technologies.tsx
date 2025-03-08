'use client';

import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

// Technology data
const technologies = [
  {
    category: 'Frontend',
    items: [
      { name: 'React 18', icon: '/images/tech/react.svg' },
      { name: 'TypeScript', icon: '/images/tech/typescript.svg' },
      { name: 'Material-UI', icon: '/images/tech/mui.svg' },
      { name: 'Styled Components', icon: '/images/tech/styled-components.svg' },
    ],
  },
  {
    category: 'Desktop Integration',
    items: [
      { name: 'Electron', icon: '/images/tech/electron.svg' },
      { name: 'Vite', icon: '/images/tech/vite.svg' },
      { name: 'Electron Builder', icon: '/images/tech/electron-builder.svg' },
    ],
  },
  {
    category: 'Data & APIs',
    items: [
      { name: 'Axios', icon: '/images/tech/axios.svg' },
      { name: 'Recharts', icon: '/images/tech/recharts.svg' },
      { name: 'CryptoCompare API', icon: '/images/tech/cryptocompare.svg' },
      { name: 'CoinGecko API', icon: '/images/tech/coingecko.svg' },
    ],
  },
];

// Security features
const securityFeatures = [
  {
    title: 'Local Data Storage',
    description: 'Your data stays on your device, not on our servers.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="3" y1="9" x2="21" y2="9"></line>
        <path d="M13 14h4"></path>
        <path d="M13 18h4"></path>
        <circle cx="8" cy="16" r="2"></circle>
      </svg>
    ),
  },
  {
    title: 'Secure API Connections',
    description: 'All API connections use HTTPS encryption.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    ),
  },
  {
    title: 'No Account Required',
    description: 'Use the app without creating an account or sharing personal information.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
        <line x1="18" y1="8" x2="23" y2="13"></line>
        <line x1="23" y1="8" x2="18" y2="13"></line>
      </svg>
    ),
  },
  {
    title: 'Open Source',
    description: 'Our code is open source and can be audited by anyone.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
      </svg>
    ),
  },
];

export default function Technologies() {
  const techRef = useRef<HTMLDivElement>(null);
  
  // Animation for tech icons on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const icons = entry.target.querySelectorAll('.tech-icon');
            icons.forEach((icon, index) => {
              setTimeout(() => {
                (icon as HTMLElement).style.opacity = '1';
                (icon as HTMLElement).style.transform = 'translateY(0)';
              }, index * 100);
            });
          }
        });
      },
      { threshold: 0.2 }
    );
    
    if (techRef.current) {
      observer.observe(techRef.current);
    }
    
    return () => {
      if (techRef.current) {
        observer.unobserve(techRef.current);
      }
    };
  }, []);
  
  return (
    <section id="technologies" className="py-20 bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-secondary/10 rounded-full blur-[100px] -z-10"></div>
      
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-primary">
            Built with Modern Technologies
          </h2>
          <p className="text-text-secondary text-lg">
            Crypto Converter is built with the latest technologies to ensure performance, security, and a great user experience.
          </p>
        </div>
        
        {/* Tech stack */}
        <div ref={techRef} className="grid md:grid-cols-3 gap-8 mb-16">
          {technologies.map((tech) => (
            <div 
              key={tech.category}
              className="bg-background-card rounded-xl p-6 border border-gray-800 hover:border-primary/30 transition-colors"
            >
              <h3 className="text-xl font-semibold mb-6 text-text-primary">
                {tech.category}
              </h3>
              
              <div className="grid grid-cols-2 gap-6">
                {tech.items.map((item, index) => (
                  <div 
                    key={item.name}
                    className="tech-icon flex flex-col items-center opacity-0 transform translate-y-4 transition-all duration-500"
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="w-12 h-12 mb-3 relative">
                      <div className="absolute inset-0 bg-primary/10 rounded-full transform scale-0 transition-transform duration-300 group-hover:scale-100"></div>
                      <div className="relative w-full h-full flex items-center justify-center">
                        {/* Placeholder for tech icon */}
                        <div className="w-8 h-8 bg-primary/20 rounded-md flex items-center justify-center text-primary">
                          {item.name.charAt(0)}
                        </div>
                      </div>
                    </div>
                    <span className="text-text-secondary text-sm">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Security features */}
        <div className="bg-background-darker rounded-xl p-8 border border-gray-800">
          <h3 className="text-2xl font-semibold mb-8 text-center text-text-primary">
            Security & Privacy Features
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityFeatures.map((feature) => (
              <div 
                key={feature.title}
                className="p-6 bg-background rounded-lg border border-gray-800 hover:border-primary/30 transition-all group"
              >
                <div className="text-primary mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-medium mb-2 text-text-primary">
                  {feature.title}
                </h4>
                <p className="text-text-secondary text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}