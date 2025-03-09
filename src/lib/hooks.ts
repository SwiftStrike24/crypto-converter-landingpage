/**
 * Custom hooks for the Crypto Converter landing page
 */

import { useState, useEffect } from 'react';
import { getCryptoPrices, type CryptoPrice } from './api';

/**
 * Hook to fetch cryptocurrency prices using native fetch
 * Provides loading, error, and data states
 */
export function useCryptoPrices() {
  const [data, setData] = useState<CryptoPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchData() {
      try {
        setIsLoading(true);
        const prices = await getCryptoPrices();
        if (isMounted) {
          setData(prices);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch crypto prices'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    // Set up refetching every 5 minutes to reduce API calls
    const intervalId = setInterval(fetchData, 5 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return { data, isLoading, error };
} 