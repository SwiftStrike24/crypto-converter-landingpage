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

/**
 * Fetch cryptocurrency prices from CoinGecko API
 */
export async function getCryptoPrices(): Promise<CryptoPrice[]> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${FEATURED_CRYPTOS.join(',')}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch crypto prices');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
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