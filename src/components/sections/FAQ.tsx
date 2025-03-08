'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

// FAQ data
const faqItems = [
  {
    id: 'what-is',
    question: 'What is Crypto Converter?',
    answer: 'Crypto Converter is a desktop application that allows you to convert between different cryptocurrencies with real-time price updates. It provides a sleek, intuitive interface for tracking and converting cryptocurrencies.',
  },
  {
    id: 'platforms',
    question: 'Which platforms is Crypto Converter available on?',
    answer: 'Crypto Converter is available for Windows, macOS, and Linux. The application offers the same features and experience across all platforms.',
  },
  {
    id: 'cryptocurrencies',
    question: 'How many cryptocurrencies does it support?',
    answer: 'Crypto Converter currently supports over 50 cryptocurrencies, including Bitcoin, Ethereum, Solana, Cardano, Ripple, and many more. We regularly add support for new cryptocurrencies.',
  },
  {
    id: 'offline',
    question: 'Does Crypto Converter work offline?',
    answer: 'Crypto Converter requires an internet connection to fetch real-time price data. However, it can remember your last conversions and settings when offline, allowing you to view your previous calculations.',
  },
  {
    id: 'data-privacy',
    question: 'How does Crypto Converter handle my data?',
    answer: 'Crypto Converter stores all your data locally on your device. We do not collect or store any personal information on our servers. The app only connects to cryptocurrency APIs to fetch price data.',
  },
  {
    id: 'updates',
    question: 'How often is Crypto Converter updated?',
    answer: 'We release updates approximately once a month with new features, cryptocurrency additions, and performance improvements. The app will notify you when updates are available.',
  },
  {
    id: 'cost',
    question: 'Is Crypto Converter free to use?',
    answer: 'Yes, Crypto Converter is completely free to use with all features included. There are no premium tiers or subscription fees.',
  },
  {
    id: 'api-source',
    question: 'Where does the price data come from?',
    answer: 'Crypto Converter uses data from reputable cryptocurrency APIs including CoinGecko and CryptoCompare to ensure accurate and up-to-date price information.',
  },
];

export default function FAQ() {
  const [openItem, setOpenItem] = useState<string | null>(faqItems[0].id);
  
  const toggleItem = (id: string) => {
    setOpenItem(openItem === id ? null : id);
  };
  
  return (
    <section id="faq" className="py-20 bg-background-darker relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-[100px] -z-10"></div>
      
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-primary">
            Frequently Asked Questions
          </h2>
          <p className="text-text-secondary text-lg">
            Find answers to common questions about Crypto Converter.
          </p>
        </div>
        
        {/* FAQ accordion */}
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqItems.map((item) => (
              <div
                key={item.id}
                className="bg-background rounded-xl border border-gray-800 overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                  onClick={() => toggleItem(item.id)}
                >
                  <h3 className="text-lg font-medium text-text-primary">
                    {item.question}
                  </h3>
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                    openItem === item.id ? "bg-primary text-white" : "bg-background-card text-text-secondary"
                  )}>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className={`transition-transform duration-300 ${openItem === item.id ? 'rotate-180' : ''}`}
                    >
                      <polyline points={openItem === item.id ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
                    </svg>
                  </div>
                </button>
                
                <div 
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    openItem === item.id ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="p-6 pt-0 text-text-secondary">
                    {item.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Additional help */}
          <div className="mt-12 text-center">
            <p className="text-text-secondary mb-6">
              Still have questions? We&apos;re here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 bg-background border border-gray-800 hover:border-primary/50 text-text-primary px-6 py-3 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                Contact Support
              </a>
              <a
                href="#documentation"
                className="inline-flex items-center gap-2 bg-background border border-gray-800 hover:border-primary/50 text-text-primary px-6 py-3 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                Read Documentation
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 