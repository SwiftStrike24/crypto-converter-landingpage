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
            className="flex items-center gap-2"
            onClick={(e) => handleNavClick(e, "/")}
          >
            <div className="relative w-10 h-10">
              <Image
                src="/images/logo.png"
                alt="CryptoVertX Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-primary">
              CryptoVertX
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-text-primary transition-colors"
                    onClick={(e) => handleNavClick(e, link.href)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            
            <Link
              href="#download"
              className="bg-gradient-to-r from-primary to-primary-light text-white px-6 py-2 rounded-full font-medium hover:shadow-glow transition-all"
              onClick={(e) => handleNavClick(e, '#download')}
            >
              Download
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-text-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                      className="text-text-secondary hover:text-text-primary transition-colors block py-2"
                      onClick={(e) => handleNavClick(e, link.href)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li className="mt-4">
                  <Link
                    href="#download"
                    className="bg-gradient-to-r from-primary to-primary-light text-white px-6 py-3 rounded-full font-medium hover:shadow-glow transition-all block text-center"
                    onClick={(e) => handleNavClick(e, '#download')}
                  >
                    Download
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}
      </header>
    </ClientOnly>
  );
} 