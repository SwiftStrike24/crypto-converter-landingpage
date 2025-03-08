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
  'cardano',
  'ripple',
  'polkadot'
];

// Cache for API responses to avoid unnecessary requests
const API_CACHE: Record<string, { data: CryptoPrice[]; timestamp: number }> = {};
const CACHE_DURATION = 60000; // 1 minute cache

// Rate limiting protection
const RATE_LIMIT = {
  lastCall: 0,
  minInterval: 2000, // 2 seconds between calls
};

/**
 * Fetch cryptocurrency prices from CoinGecko API with authentication
 * Optimized for use with React Query
 */
export async function getCryptoPrices(): Promise<CryptoPrice[]> {
  const cacheKey = 'crypto_prices';
  
  // Check if we have cached data that's still valid
  if (API_CACHE[cacheKey] && Date.now() - API_CACHE[cacheKey].timestamp < CACHE_DURATION) {
    return API_CACHE[cacheKey].data;
  }
  
  // Rate limiting protection
  const now = Date.now();
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
  
  RATE_LIMIT.lastCall = Date.now();
  
  try {
    const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY || process.env.COINGECKO_API_KEY;
    const headers: HeadersInit = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    
    if (apiKey) {
      headers['x-cg-api-key'] = apiKey;
    }
    
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${FEATURED_CRYPTOS.join(',')}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`,
      { 
        headers,
        next: { revalidate: 60 } // Next.js 15 data revalidation
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch crypto prices: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    
    // Cache the response
    API_CACHE[cacheKey] = {
      data,
      timestamp: Date.now()
    };
    
    return data;
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    
    // Return cached data if available, even if expired
    if (API_CACHE[cacheKey]) {
      return API_CACHE[cacheKey].data;
    }
    
    // If no cached data, return empty array but log the error
    console.error('No cached data available after API error:', error);
    return [];
  }
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