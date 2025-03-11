'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn, smoothScrollTo } from '@/lib/utils';
import { zIndex } from '@/lib/theme';
import ClientOnly from '@/components/ClientOnly';

// Navigation links
const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#faq', label: 'FAQ' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState<string | null>(null);

  // Handle scroll event to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle navigation link clicks with smooth scrolling
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    // Close mobile menu if open
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
    
    // If href is "/" or "#", scroll to top
    if (href === "/" || href === "#") {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    }
    
    // Extract the element ID from the href (remove the # symbol)
    const elementId = href.substring(1);
    
    // Use our smooth scroll utility
    smoothScrollTo(elementId);
  };

  return (
    <ClientOnly>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 w-full transition-all duration-300 z-[100]',
          {
            'bg-transparent': !isScrolled && !isMobileMenuOpen,
            'bg-background/80 backdrop-blur-md shadow-md': isScrolled || isMobileMenuOpen,
          }
        )}
        style={{ zIndex: zIndex.navbar }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 group"
            onClick={(e) => handleNavClick(e, "/")}
          >
            <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-110">
              <Image
                src="/images/logo.png"
                alt="CryptoVertX Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-primary group-hover:from-primary group-hover:to-primary-light transition-all duration-300">
              CryptoVertX
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-6">
              {navLinks.map((link) => (
                <li key={link.href} className="relative">
                  <Link
                    href={link.href}
                    className="relative px-2 py-1 text-text-secondary hover:text-text-primary transition-colors duration-300 group"
                    onClick={(e) => handleNavClick(e, link.href)}
                    onMouseEnter={() => setActiveLink(link.href)}
                    onMouseLeave={() => setActiveLink(null)}
                  >
                    {/* Hover glow effect */}
                    <span className="absolute inset-0 rounded-md bg-primary/0 group-hover:bg-primary/5 transition-all duration-300"></span>
                    
                    {/* Animated underline */}
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary/80 to-primary-light/80 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                    
                    {/* Hover particles */}
                    {activeLink === link.href && (
                      <>
                        <span className="absolute -top-1 left-0 w-1 h-1 rounded-full bg-primary/60 animate-float-slow"></span>
                        <span className="absolute -top-1 right-0 w-1 h-1 rounded-full bg-primary-light/60 animate-float-medium"></span>
                      </>
                    )}
                    
                    {/* Text with subtle lift effect */}
                    <span className="relative inline-block group-hover:transform group-hover:-translate-y-[1px] transition-transform duration-300">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            
            <Link
              href="#download"
              className="relative overflow-hidden bg-gradient-to-r from-primary to-primary-light text-white px-6 py-2 rounded-full font-medium hover:shadow-glow transition-all duration-300 group"
              onClick={(e) => handleNavClick(e, '#download')}
            >
              {/* Animated shine effect */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></span>
              
              {/* Button text with subtle scale effect */}
              <span className="relative inline-block group-hover:scale-105 transition-transform duration-300">
                Download
              </span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-text-primary relative overflow-hidden group"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="absolute inset-0 rounded-full bg-primary/0 group-hover:bg-primary/10 transition-all duration-300 scale-0 group-hover:scale-100"></span>
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-md">
            <div className="container mx-auto px-4 py-4">
              <ul className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-text-secondary hover:text-text-primary transition-colors block py-2 relative group"
                      onClick={(e) => handleNavClick(e, link.href)}
                    >
                      {/* Mobile hover effect */}
                      <span className="absolute left-0 w-0 h-full border-l-2 border-primary group-hover:w-1 transition-all duration-300"></span>
                      <span className="relative inline-block pl-3 group-hover:pl-4 transition-all duration-300">{link.label}</span>
                    </Link>
                  </li>
                ))}
                <li className="mt-4">
                  <Link
                    href="#download"
                    className="bg-gradient-to-r from-primary to-primary-light text-white px-6 py-3 rounded-full font-medium hover:shadow-glow transition-all block text-center relative overflow-hidden group"
                    onClick={(e) => handleNavClick(e, '#download')}
                  >
                    {/* Animated shine effect for mobile */}
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></span>
                    <span className="relative">Download</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}
      </header>

      {/* Add these animations to your global CSS or define them here */}
      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-3px) translateX(1px); }
          50% { transform: translateY(-1px) translateX(3px); }
          75% { transform: translateY(-2px) translateX(-2px); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-2px) translateX(-2px); }
          50% { transform: translateY(-3px) translateX(1px); }
          75% { transform: translateY(-1px) translateX(2px); }
        }
        
        .animate-float-slow {
          animation: float-slow 3s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium 2.5s ease-in-out infinite;
        }
      `}</style>
    </ClientOnly>
  );
} 