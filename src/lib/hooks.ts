/**
 * Custom hooks for the Crypto Converter landing page
 */

import { useQuery } from '@tanstack/react-query';
import { getCryptoPrices, type CryptoPrice } from './api';

/**
 * Hook to fetch cryptocurrency prices using React Query
 * Provides loading, error, and data states with automatic refetching
 */
export function useCryptoPrices() {
  return useQuery<CryptoPrice[], Error>({
    queryKey: ['cryptoPrices'],
    queryFn: getCryptoPrices,
    staleTime: 60000, // 1 minute before refetching
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
} 