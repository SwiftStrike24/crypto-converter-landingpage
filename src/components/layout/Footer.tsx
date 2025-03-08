'use client';

import Link from 'next/link';
import { getCurrentYear } from '@/lib/utils';

// Footer links
const footerLinks = [
  {
    title: 'Product',
    links: [
      { href: '#features', label: 'Features' },
      { href: '#download', label: 'Download' },
      { href: '#pricing', label: 'Pricing' },
      { href: '#roadmap', label: 'Roadmap' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { href: '#documentation', label: 'Documentation' },
      { href: '#api', label: 'API' },
      { href: '#guides', label: 'Guides' },
      { href: '#faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '#about', label: 'About' },
      { href: '#blog', label: 'Blog' },
      { href: '#careers', label: 'Careers' },
      { href: '#contact', label: 'Contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '#privacy', label: 'Privacy Policy' },
      { href: '#terms', label: 'Terms of Service' },
      { href: '#cookies', label: 'Cookie Policy' },
      { href: '#licenses', label: 'Licenses' },
    ],
  },
];

// Social media links
const socialLinks = [
  {
    href: 'https://twitter.com/cryptoConverter',
    label: 'Twitter',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
      </svg>
    ),
  },
  {
    href: 'https://github.com/cryptoConverter',
    label: 'GitHub',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
      </svg>
    ),
  },
  {
    href: 'https://discord.gg/cryptoConverter',
    label: 'Discord',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 9a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5v7a5 5 0 0 0 5 5h4"></path>
        <circle cx="15" cy="15" r="1"></circle>
        <circle cx="18" cy="18" r="1"></circle>
        <circle cx="21" cy="21" r="1"></circle>
      </svg>
    ),
  },
  {
    href: 'https://linkedin.com/company/cryptoConverter',
    label: 'LinkedIn',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-background-darker pt-16 pb-8 border-t border-gray-800">
      <div className="container mx-auto px-4">
        {/* Footer top section with links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-text-primary font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-text-secondary hover:text-primary transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter subscription */}
        <div className="border-t border-gray-800 pt-8 pb-12">
          <div className="max-w-md mx-auto">
            <h3 className="text-text-primary font-semibold mb-2 text-center">Stay Updated</h3>
            <p className="text-text-secondary text-sm mb-4 text-center">
              Subscribe to our newsletter for the latest updates and releases.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-background-card border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Footer bottom section with social links and copyright */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-primary">
              CryptoConverter
            </span>
            <span className="text-text-secondary text-sm">
              © {getCurrentYear()} All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-primary transition-colors"
                aria-label={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
} 