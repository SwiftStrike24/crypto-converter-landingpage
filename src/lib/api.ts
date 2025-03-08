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
  'trump': { 
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

// In-memory cache for API responses
const API_CACHE: Record<string, { data: CryptoPrice[]; timestamp: number }> = {};
const CACHE_DURATION = 60000; // 1 minute

// Rate limiting protection
const RATE_LIMIT = {
  lastCall: 0,
  minInterval: 2000, // 2 seconds between calls
};

// Safe timestamp function that works on both server and client
function getTimestamp(): number {
  return typeof window !== 'undefined' ? Date.now() : 0;
}

/**
 * Fetch cryptocurrency prices from CoinGecko API with authentication
 * Optimized for use with React Query
 */
export async function getCryptoPrices(): Promise<CryptoPrice[]> {
  const cacheKey = 'crypto_prices';
  
  // Check if we have cached data that's still valid
  if (API_CACHE[cacheKey] && getTimestamp() - API_CACHE[cacheKey].timestamp < CACHE_DURATION) {
    return API_CACHE[cacheKey].data;
  }
  
  // Rate limiting protection
  const now = getTimestamp();
  if (now - RATE_LIMIT.lastCall < RATE_LIMIT.minInterval) {
    // If we're calling too frequently, use cached data or wait
    if (API_CACHE[cacheKey]) {
      return API_CACHE[cacheKey].data;
    }
    
    // If no cache available, wait until we can make the call
    await new Promise(resolve => 
      setTimeout(resolve, RATE_LIMIT.minInterval - (now - RATE_LIMIT.lastCall))
    );
  }
  
  RATE_LIMIT.lastCall = getTimestamp();
  
  // Retry logic
  const MAX_RETRIES = 3;
  let retries = 0;
  
  while (retries < MAX_RETRIES) {
    try {
      const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY || process.env.COINGECKO_API_KEY;
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
          next: { revalidate: 60 } // Next.js 15 data revalidation
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch crypto prices: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json() as CryptoPrice[];
      
      // Ensure we have data for all featured cryptos by adding fallback data for missing ones
      const resultMap = new Map<string, CryptoPrice>(data.map((item: CryptoPrice) => [item.id, item]));
      
      const completeData: CryptoPrice[] = FEATURED_CRYPTOS.map(id => {
        // If we have data from the API, use it
        if (resultMap.has(id)) {
          return resultMap.get(id) as CryptoPrice;
        }
        
        // Otherwise use fallback data from metadata
        const metadata = CRYPTO_METADATA[id];
        if (metadata) {
          return {
            id,
            name: metadata.name,
            symbol: metadata.symbol,
            current_price: metadata.fallbackPrice,
            price_change_percentage_24h: metadata.fallbackChange,
            image: ''
          };
        }
        
        // Last resort fallback
        return {
          id,
          name: id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          symbol: id.substring(0, 3),
          current_price: 0,
          price_change_percentage_24h: 0,
          image: ''
        };
      });
      
      // Cache the response
      API_CACHE[cacheKey] = {
        data: completeData,
        timestamp: getTimestamp()
      };
      
      return completeData;
    } catch (error) {
      retries++;
      console.error(`Error fetching crypto prices (attempt ${retries}/${MAX_RETRIES}):`, error);
      
      if (retries >= MAX_RETRIES) {
        // Generate fallback data from CRYPTO_METADATA
        const fallbackData: CryptoPrice[] = FEATURED_CRYPTOS.map(id => {
          const metadata = CRYPTO_METADATA[id];
          return {
            id,
            name: metadata?.name || id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            symbol: metadata?.symbol || id.substring(0, 3),
            current_price: metadata?.fallbackPrice || 0,
            price_change_percentage_24h: metadata?.fallbackChange || 0,
            image: ''
          };
        });
        
        // Cache the fallback data
        API_CACHE[cacheKey] = {
          data: fallbackData,
          timestamp: getTimestamp()
        };
        
        return fallbackData;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
    }
  }
  
  // This should never be reached due to the return in the catch block
  return [];
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
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6
  }).format(amount);
} 