'use client';

import Link from 'next/link';
import { getCurrentYear } from '@/lib/utils';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Footer links - simplified to only Product section
const footerLinks = [
  {
    title: 'Product',
    links: [
      { href: '#features', label: 'Features' },
      { href: '#how-it-works', label: 'How it Works' },
      { href: '#faq', label: 'FAQ' },
      { href: '#download', label: 'Download' },
    ],
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10,
    },
  },
};

// GitHub button animation variants
const githubButtonVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: { 
      type: 'spring', 
      stiffness: 400, 
      damping: 10 
    }
  },
  tap: { 
    scale: 0.95,
    transition: { 
      type: 'spring', 
      stiffness: 400, 
      damping: 10 
    }
  }
};

const glowVariants = {
  initial: { 
    opacity: 0.5,
    scale: 1
  },
  hover: { 
    opacity: 0.8,
    scale: 1.2,
    transition: { 
      repeat: Infinity,
      repeatType: "reverse" as const,
      duration: 1.5
    }
  }
};

export default function Footer() {
  return (
    <footer className="bg-background-darker pt-12 pb-6 border-t border-gray-800/30 relative overflow-hidden">
      {/* Subtle gradient background effect */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent opacity-30 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {/* Logo and copyright */}
          <motion.div 
            className="flex flex-col gap-2"
            variants={itemVariants}
          >
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8">
                <Image
                  src="/images/logo.png"
                  alt="Crypto Converter Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-primary">
                CryptoConverter
              </span>
            </div>
            <span className="text-text-secondary text-sm">
              © {getCurrentYear()} All rights reserved.
            </span>
          </motion.div>

          {/* Links section */}
          <motion.div 
            className="flex flex-col md:flex-row gap-8"
            variants={itemVariants}
          >
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h3 className="text-text-primary font-semibold mb-4 text-sm uppercase tracking-wider">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <motion.li 
                      key={link.label}
                      whileHover={{ x: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Link
                        href={link.href}
                        className="text-text-secondary hover:text-primary transition-all duration-300 text-sm flex items-center gap-1 group"
                      >
                        <span className="h-px w-0 bg-primary group-hover:w-3 transition-all duration-300"></span>
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>

          {/* Enhanced GitHub link */}
          <motion.div 
            className="flex items-center"
            variants={itemVariants}
          >
            <motion.a
              href="https://github.com/SwiftStrike24/Crypto-Converter-app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 px-4 py-2 rounded-lg border border-gray-700 shadow-lg group"
              aria-label="View source on GitHub"
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              variants={githubButtonVariants}
            >
              <div className="relative">
                <motion.div 
                  className="absolute inset-0 rounded-full bg-primary/20 blur-md"
                  variants={glowVariants}
                />
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="relative z-10 text-white"
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-medium text-sm">View Source</span>
                <span className="text-gray-400 text-xs">Star the repo ⭐</span>
              </div>
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
} 