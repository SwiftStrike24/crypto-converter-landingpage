'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// Testimonial data
const testimonials = [
  {
    id: 1,
    name: 'Alex Johnson',
    role: 'Crypto Trader',
    avatar: '/images/testimonials/avatar-1.jpg',
    content: 'Crypto Converter has completely transformed how I track and convert cryptocurrencies. The real-time updates and intuitive interface make it my go-to tool for all crypto conversions.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Sarah Chen',
    role: 'Blockchain Developer',
    avatar: '/images/testimonials/avatar-2.jpg',
    content: 'As a developer working with multiple cryptocurrencies, I needed a reliable conversion tool. This app exceeds all my expectations with its accuracy and extensive coin support.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Michael Rodriguez',
    role: 'Investment Advisor',
    avatar: '/images/testimonials/avatar-3.jpg',
    content: 'I recommend Crypto Converter to all my clients. It\'s fast, accurate, and makes cryptocurrency conversions accessible to everyone, regardless of technical expertise.',
    rating: 4,
  },
  {
    id: 4,
    name: 'Emily Parker',
    role: 'Crypto Enthusiast',
    avatar: '/images/testimonials/avatar-4.jpg',
    content: 'The portfolio tracking feature is a game-changer. I can now monitor all my crypto investments in one place with real-time updates. Absolutely love this app!',
    rating: 5,
  },
  {
    id: 5,
    name: 'David Kim',
    role: 'Financial Analyst',
    avatar: '/images/testimonials/avatar-5.jpg',
    content: 'The accuracy and speed of this converter are impressive. I use it daily for my financial analysis, and it has never let me down. Highly recommended for professionals.',
    rating: 4,
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Handle autoplay
  useEffect(() => {
    if (isAutoplay) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoplay]);
  
  // Pause autoplay on hover
  const handleMouseEnter = () => setIsAutoplay(false);
  const handleMouseLeave = () => setIsAutoplay(true);
  
  // Render star rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <svg
        key={index}
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={index < rating ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={index < rating ? 'text-yellow-500' : 'text-gray-400'}
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    ));
  };
  
  return (
    <section id="testimonials" className="py-20 bg-background-darker relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[120px] -z-10"></div>
      
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-primary">
            What Our Users Say
          </h2>
          <p className="text-text-secondary text-lg">
            Thousands of crypto enthusiasts trust Crypto Converter for their daily conversion needs.
          </p>
        </div>
        
        {/* Testimonial carousel */}
        <div 
          className="max-w-4xl mx-auto relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Testimonial cards */}
          <div className="relative h-[400px] md:h-[300px]">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={cn(
                  "absolute inset-0 bg-background rounded-xl p-6 md:p-8 border border-gray-800",
                  "transition-all duration-500 ease-in-out",
                  index === activeIndex 
                    ? "opacity-100 transform-none z-10" 
                    : index === (activeIndex + 1) % testimonials.length
                    ? "opacity-0 translate-x-full z-0"
                    : index === (activeIndex - 1 + testimonials.length) % testimonials.length
                    ? "opacity-0 -translate-x-full z-0"
                    : "opacity-0 scale-95 z-0"
                )}
              >
                <div className="flex flex-col md:flex-row gap-6 h-full">
                  {/* Avatar and info */}
                  <div className="flex flex-row md:flex-col items-center md:items-start gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary/30">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="md:mt-4">
                      <h3 className="text-lg font-semibold text-text-primary">{testimonial.name}</h3>
                      <p className="text-text-secondary text-sm">{testimonial.role}</p>
                      <div className="flex mt-2">
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Testimonial content */}
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="text-primary mb-4 opacity-30">
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.9 8.4c-.5-3.2-3.9-5.8-7.2-5.8v2.7c2.1 0 4.3 1.4 4.3 4.3 0 1.7-1.3 3.1-3.1 3.1-1.8 0-3.1-1.3-3.1-3.1h-2.8c0 3.2 2.7 5.8 5.9 5.8 3.2 0 5.8-2.6 5.8-5.8 0-.4 0-.8-.1-1.2zm12.2 0c-.5-3.2-3.9-5.8-7.2-5.8v2.7c2.1 0 4.3 1.4 4.3 4.3 0 1.7-1.3 3.1-3.1 3.1-1.8 0-3.1-1.3-3.1-3.1h-2.8c0 3.2 2.7 5.8 5.9 5.8 3.2 0 5.8-2.6 5.8-5.8 0-.4 0-.8-.1-1.2z" />
                      </svg>
                    </div>
                    <p className="text-text-secondary text-lg italic">
                      {testimonial.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation dots */}
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index === activeIndex ? "bg-primary w-6" : "bg-gray-700"
                )}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Navigation arrows */}
          <button
            className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-12 md:-translate-x-16 bg-background-card p-3 rounded-full border border-gray-800 text-text-primary hover:text-primary transition-colors"
            onClick={() => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
            aria-label="Previous testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button
            className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-12 md:translate-x-16 bg-background-card p-3 rounded-full border border-gray-800 text-text-primary hover:text-primary transition-colors"
            onClick={() => setActiveIndex((prev) => (prev + 1) % testimonials.length)}
            aria-label="Next testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
        
        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-primary-light mb-2">10K+</p>
            <p className="text-text-secondary">Active Users</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-primary-light mb-2">4.8</p>
            <p className="text-text-secondary">Average Rating</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-primary-light mb-2">50+</p>
            <p className="text-text-secondary">Cryptocurrencies</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-primary-light mb-2">24/7</p>
            <p className="text-text-secondary">Support</p>
          </div>
        </div>
      </div>
    </section>
  );
} 