/**
 * API utilities for the Crypto Converter landing page
 * Handles fetching cryptocurrency data from external APIs
 */

// Types for cryptocurrency data
export interface CryptoPrice {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
}

// Featured cryptocurrencies to display
export const FEATURED_CRYPTOS = [
  'bitcoin',
  'ethereum',
  'solana',
  'ripple',
  'sui',
  'jupiter-exchange-solana',
  'official-trump',
  'bonk'
];

// Metadata for cryptocurrencies (fallback data when API fails)
export const CRYPTO_METADATA: Record<string, { 
  name: string; 
  symbol: string; 
  color: string;
  fallbackPrice: number;
  fallbackChange: number;
}> = {
  'bitcoin': { 
    name: 'Bitcoin', 
    symbol: 'btc', 
    color: 'bg-amber-500',
    fallbackPrice: 86250.00,
    fallbackChange: -0.76
  },
  'ethereum': { 
    name: 'Ethereum', 
    symbol: 'eth', 
    color: 'bg-indigo-500',
    fallbackPrice: 2213.95,
    fallbackChange: 2.77
  },
  'solana': { 
    name: 'Solana', 
    symbol: 'sol', 
    color: 'bg-purple-500',
    fallbackPrice: 137.71,
    fallbackChange: -4.61
  },
  'sui': { 
    name: 'Sui', 
    symbol: 'sui', 
    color: 'bg-blue-500',
    fallbackPrice: 2.53,
    fallbackChange: -3.78
  },
  'ripple': { 
    name: 'XRP', 
    symbol: 'xrp', 
    color: 'bg-blue-400',
    fallbackPrice: 0.51,
    fallbackChange: -2.34
  },
  'official-trump': { 
    name: 'Trump', 
    symbol: 'trump', 
    color: 'bg-red-500',
    fallbackPrice: 12.03,
    fallbackChange: -6.78
  },
  'jupiter-exchange-solana': { 
    name: 'Jupiter', 
    symbol: 'jup', 
    color: 'bg-pink-500',
    fallbackPrice: 0.551813,
    fallbackChange: -6.73
  },
  'bonk': { 
    name: 'Bonk', 
    symbol: 'bonk', 
    color: 'bg-orange-500',
    fallbackPrice: 0.000012,
    fallbackChange: -5.20
  }
};

// Enhanced caching system with localStorage persistence
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class EnhancedCache {
  private memoryCache: Record<string, CacheEntry<unknown>> = {};
  private readonly namespace: string;
  
  constructor(namespace: string = 'crypto_converter_cache') {
    this.namespace = namespace;
    this.loadFromStorage();
  }
  
  // Get item from cache (memory first, then localStorage)
  get<T>(key: string): T | null {
    const now = Date.now();
    const cacheKey = `${this.namespace}:${key}`;
    
    // Try memory cache first
    if (this.memoryCache[cacheKey] && now < this.memoryCache[cacheKey].expiry) {
      return this.memoryCache[cacheKey].data as T;
    }
    
    // Try localStorage if available
    if (typeof window !== 'undefined') {
      try {
        const storedItem = localStorage.getItem(cacheKey);
        if (storedItem) {
          const parsedItem = JSON.parse(storedItem) as CacheEntry<T>;
          if (now < parsedItem.expiry) {
            // Refresh memory cache
            this.memoryCache[cacheKey] = parsedItem;
            return parsedItem.data;
          } else {
            // Remove expired item
            localStorage.removeItem(cacheKey);
          }
        }
      } catch (error) {
        console.warn('Error accessing localStorage:', error);
      }
    }
    
    return null;
  }
  
  // Set item in cache (both memory and localStorage)
  set<T>(key: string, data: T, ttlMs: number): void {
    const now = Date.now();
    const cacheKey = `${this.namespace}:${key}`;
    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expiry: now + ttlMs
    };
    
    // Update memory cache
    this.memoryCache[cacheKey] = entry;
    
    // Update localStorage if available
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(cacheKey, JSON.stringify(entry));
      } catch (error) {
        console.warn('Error writing to localStorage:', error);
      }
    }
  }
  
  // Load all cache entries from localStorage into memory
  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        const now = Date.now();
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith(`${this.namespace}:`)) {
            const value = localStorage.getItem(key);
            if (value) {
              const entry = JSON.parse(value) as CacheEntry<unknown>;
              if (now < entry.expiry) {
                this.memoryCache[key] = entry;
              } else {
                localStorage.removeItem(key);
              }
            }
          }
        }
      } catch (error) {
        console.warn('Error loading cache from localStorage:', error);
      }
    }
  }
  
  // Clear all cache entries
  clear(): void {
    this.memoryCache = {};
    if (typeof window !== 'undefined') {
      try {
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key?.startsWith(`${this.namespace}:`)) {
            localStorage.removeItem(key);
          }
        }
      } catch (error) {
        console.warn('Error clearing localStorage cache:', error);
      }
    }
  }
}

// Initialize cache
const cache = new EnhancedCache();

// Advanced rate limiting with token bucket algorithm
class TokenBucket {
  private tokens: number;
  private lastRefill: number;
  private readonly capacity: number;
  private readonly refillRate: number; // tokens per millisecond
  
  constructor(capacity: number, refillRatePerSecond: number) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillRate = refillRatePerSecond / 1000;
    this.lastRefill = Date.now();
  }
  
  async consume(tokens: number = 1): Promise<boolean> {
    this.refill();
    
    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }
    
    // Calculate wait time to get enough tokens
    const waitTime = Math.ceil((tokens - this.tokens) / this.refillRate);
    
    // If wait time is reasonable, wait and then consume
    if (waitTime <= 5000) { // Max 5 seconds wait
      await new Promise(resolve => setTimeout(resolve, waitTime));
      this.refill();
      this.tokens -= tokens;
      return true;
    }
    
    return false;
  }
  
  private refill(): void {
    const now = Date.now();
    const elapsedTime = now - this.lastRefill;
    const newTokens = elapsedTime * this.refillRate;
    
    if (newTokens > 0) {
      this.tokens = Math.min(this.capacity, this.tokens + newTokens);
      this.lastRefill = now;
    }
  }
}

// Global rate limiter for CoinGecko API (10 requests per minute)
const rateLimiter = new TokenBucket(10, 10/60);

/**
 * Fetch cryptocurrency prices from CoinGecko API with enhanced caching and error handling
 * Optimized for free tier usage with persistent caching
 */
export async function getCryptoPrices(): Promise<CryptoPrice[]> {
  const cacheKey = 'crypto_prices';
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes for production use
  const SHORT_CACHE_DURATION = 30 * 1000; // 30 seconds for error cases
  
  // Check if we have cached data
  const cachedData = cache.get<CryptoPrice[]>(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  
  // Check if we can make an API call (rate limiting)
  const canMakeRequest = await rateLimiter.consume();
  if (!canMakeRequest) {
    console.warn('Rate limit exceeded, using fallback data');
    const fallbackData = generateFallbackData();
    cache.set(cacheKey, fallbackData, SHORT_CACHE_DURATION);
    return fallbackData;
  }
  
  // Retry logic with exponential backoff
  const MAX_RETRIES = 3;
  let retries = 0;
  let lastError: Error | null = null;
  
  while (retries < MAX_RETRIES) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY || '';
      const headers: HeadersInit = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };
      
      if (apiKey) {
        headers['x-cg-api-key'] = apiKey;
      }
      
      // Use the v3 API endpoint with all our featured cryptos
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${FEATURED_CRYPTOS.join(',')}&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h&locale=en`,
        { 
          headers,
          signal: controller.signal,
          next: { revalidate: 300 } // Next.js 15 data revalidation (5 minutes)
        }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch crypto prices: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json() as CryptoPrice[];
      
      // Process and normalize the data
      const completeData = processApiResponse(data);
      
      // Cache the successful response
      cache.set(cacheKey, completeData, CACHE_DURATION);
      
      return completeData;
    } catch (error) {
      retries++;
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`Error fetching crypto prices (attempt ${retries}/${MAX_RETRIES}):`, error);
      
      if (retries >= MAX_RETRIES) {
        // Generate fallback data
        const fallbackData = generateFallbackData();
        
        // Cache the fallback data for a shorter duration
        cache.set(cacheKey, fallbackData, SHORT_CACHE_DURATION);
        
        // Log telemetry for monitoring
        logApiFailure(lastError);
        
        return fallbackData;
      }
      
      // Wait before retrying (exponential backoff)
      const backoffTime = 1000 * Math.pow(2, retries);
      await new Promise(resolve => setTimeout(resolve, backoffTime));
    }
  }
  
  // This should never be reached due to the return in the catch block
  return generateFallbackData();
}

/**
 * Process and normalize API response data
 */
function processApiResponse(data: CryptoPrice[]): CryptoPrice[] {
  // Create a map for quick lookups
  const resultMap = new Map<string, CryptoPrice>(data.map(item => [item.id, item]));
  
  // Ensure we have data for all featured cryptos
  return FEATURED_CRYPTOS.map(id => {
    // If we have data from the API, use it
    if (resultMap.has(id)) {
      return resultMap.get(id) as CryptoPrice;
    }
    
    // Otherwise use fallback data from metadata
    return createFallbackCrypto(id);
  });
}

/**
 * Generate fallback data for all featured cryptocurrencies
 */
function generateFallbackData(): CryptoPrice[] {
  return FEATURED_CRYPTOS.map(id => createFallbackCrypto(id));
}

/**
 * Create fallback data for a single cryptocurrency
 */
function createFallbackCrypto(id: string): CryptoPrice {
  const metadata = CRYPTO_METADATA[id];
  return {
    id,
    name: metadata?.name || id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    symbol: metadata?.symbol || id.substring(0, 3),
    current_price: metadata?.fallbackPrice || 0,
    price_change_percentage_24h: metadata?.fallbackChange || 0,
    image: ''
  };
}

/**
 * Log API failures for monitoring
 */
function logApiFailure(error: Error): void {
  // In a production app, you might send this to a monitoring service
  console.error('CoinGecko API failure:', {
    timestamp: new Date().toISOString(),
    error: error.message,
    stack: error.stack
  });
  
  // You could implement a more sophisticated telemetry system here
  // For example, sending to an analytics service or server-side logging
}

/**
 * Convert amount from one cryptocurrency to another
 */
export function convertCrypto(
  amount: number,
  fromPrice: number,
  toPrice: number
): number {
  if (!fromPrice || !toPrice) return 0;
  return (amount * fromPrice) / toPrice;
}

/**
 * Format currency with proper formatting
 */
export function formatCurrency(amount: number): string {
  // Handle different magnitudes appropriately
  if (amount >= 1000) {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    });
  } else if (amount >= 1) {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 4
    });
  } else if (amount >= 0.01) {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 6
    });
  } else {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 8
    });
  }
} 