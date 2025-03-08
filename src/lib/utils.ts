import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Generate a random ID
 */
export function generateId(length: number = 8): string {
  // Use a consistent ID for server-side rendering to avoid hydration issues
  if (typeof window === 'undefined') {
    return 'ssr-id-' + length.toString();
  }
  
  // Use Math.random only on the client side
  return Math.random().toString(36).substring(2, 2 + length);
}

/**
 * Debounce function to limit how often a function can be called
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Check if the device is mobile
 */
export function isMobile(): boolean {
  // Only run on client side to avoid hydration issues
  if (typeof window === 'undefined') return false;
  
  // Use a safer approach with matchMedia if available
  if (typeof window.matchMedia === 'function') {
    return window.matchMedia('(max-width: 767px)').matches;
  }
  
  // Fallback to innerWidth
  return window.innerWidth < 768;
}

/**
 * Get the current year
 */
export function getCurrentYear(): number {
  return new Date().getFullYear();
}
