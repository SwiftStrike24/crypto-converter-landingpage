"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { convertCrypto, formatCurrency, getCryptoPrices, CryptoPrice } from '@/lib/api';

// Using the tokens from the API with USD as a possible option
type Currency = 'BTC' | 'ETH' | 'SOL' | 'XRP' | 'SUI' | 'JUP' | 'TRUMP' | 'BONK' | 'USD';

interface ConverterDemoProps {
  className?: string;
}

const ConverterDemo: React.FC<ConverterDemoProps> = ({ className }) => {
  const [fromAmount, setFromAmount] = useState<string>('');
  const [toAmount, setToAmount] = useState<string>('');
  const [fromCurrency, setFromCurrency] = useState<Currency>('BTC');
  const [toCurrency, setToCurrency] = useState<Currency>('USD');
  const [cryptoPrices, setCryptoPrices] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get the current price of the selected crypto
  const currentPrice = fromCurrency === 'USD' ? 1 : cryptoPrices[fromCurrency] || 0;

  // Fetch real crypto prices from CoinGecko
  const fetchCryptoPrices = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getCryptoPrices();
      
      // Create a map of symbol to price
      const priceMap: Record<string, number> = {};
      data.forEach((crypto: CryptoPrice) => {
        // Map the API symbols to our currency types
        const symbol = crypto.symbol.toUpperCase();
        if (symbol === 'BTC' || symbol === 'ETH' || symbol === 'SOL' || 
            symbol === 'XRP' || symbol === 'SUI' || symbol === 'JUP' || 
            symbol === 'TRUMP' || symbol === 'BONK') {
          priceMap[symbol] = crypto.current_price;
        }
      });
      
      setCryptoPrices(priceMap);
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
      setError('Failed to fetch latest prices');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch and setup interval
  useEffect(() => {
    fetchCryptoPrices();
    
    // Refresh prices every 30 seconds
    const intervalId = setInterval(fetchCryptoPrices, 30000);
    
    return () => clearInterval(intervalId);
  }, [fetchCryptoPrices]);

  // Enhanced conversion function using real data
  const handleConversion = useCallback((
    amount: string, 
    from: Currency, 
    to: Currency
  ): string => {
    if (!amount || isNaN(parseFloat(amount))) return '';
    
    let fromPrice = 0;
    let toPrice = 0;
    
    // Get the price in USD for the source currency
    if (from === 'USD') {
      fromPrice = 1; // USD is our base
    } else {
      fromPrice = cryptoPrices[from] || 0;
    }
    
    // Get the price in USD for the target currency
    if (to === 'USD') {
      toPrice = 1; // USD is our base
    } else {
      toPrice = cryptoPrices[to] || 0;
    }
    
    if (fromPrice === 0 || toPrice === 0) return '';
    
    const result = convertCrypto(parseFloat(amount), fromPrice, toPrice);
    return result.toFixed(to === 'BONK' ? 6 : 2);
  }, [cryptoPrices]);

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFromAmount(value);
    
    if (value && !isNaN(parseFloat(value))) {
      setToAmount(handleConversion(value, fromCurrency, toCurrency));
    } else {
      setToAmount('');
    }
  };

  const handleToAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setToAmount(value);
    
    if (value && !isNaN(parseFloat(value))) {
      setFromAmount(handleConversion(value, toCurrency, fromCurrency));
    } else {
      setFromAmount('');
    }
  };

  const handleFromCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurrency = e.target.value as Currency;
    setFromCurrency(newCurrency);
    // Clear inputs when changing currency
    setFromAmount('');
    setToAmount('');
  };

  const handleToCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurrency = e.target.value as Currency;
    setToCurrency(newCurrency);
    // Clear inputs when changing currency
    setFromAmount('');
    setToAmount('');
  };

  const handleSwapCurrencies = () => {
    // Only swap if we're not already in USD to crypto mode
    if (fromCurrency !== 'USD' && toCurrency === 'USD') {
      setFromCurrency('USD');
      setToCurrency(fromCurrency);
    } else if (fromCurrency === 'USD' && toCurrency !== 'USD') {
      setFromCurrency(toCurrency);
      setToCurrency('USD');
    }
    // Clear inputs when swapping currencies
    setFromAmount('');
    setToAmount('');
  };

  return (
    <div className={cn(
      "flex flex-col gap-4 bg-zinc-900 p-5 rounded-lg max-w-md mx-auto shadow-lg border border-zinc-800",
      className
    )}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button 
            className="text-white bg-zinc-800 hover:bg-zinc-700 w-8 h-8 rounded-full flex items-center justify-center"
            aria-label="Add favorite"
          >
            +
          </button>
          <button 
            className="text-white bg-zinc-800 hover:bg-zinc-700 w-8 h-8 rounded-full flex items-center justify-center"
            aria-label="Clear"
            onClick={() => {
              setFromAmount('');
              setToAmount('');
            }}
          >
            🗑️
          </button>
        </div>
        <div className="text-white font-medium text-lg">
          {isLoading ? (
            <span className="inline-block h-5 w-16 bg-zinc-800 animate-pulse rounded"></span>
          ) : (
            formatCurrency(currentPrice)
          )}
        </div>
        <button 
          className="text-red-500 bg-transparent border-none w-8 h-8 flex items-center justify-center"
          onClick={handleSwapCurrencies}
          aria-label="Swap currencies"
        >
          ⭘
        </button>
      </div>

      {/* Error message if API fails */}
      {error && (
        <div className="text-red-400 text-xs text-center bg-red-900/20 py-1 px-2 rounded">
          {error} - Using fallback data
        </div>
      )}

      {/* From Currency Input */}
      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={fromAmount}
          onChange={handleFromAmountChange}
          placeholder="Enter amount"
          className="flex-1 p-3 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <select
          value={fromCurrency}
          onChange={handleFromCurrencyChange}
          className="p-3 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer"
          aria-label="From currency"
        >
          <option value="BTC">BTC</option>
          <option value="ETH">ETH</option>
          <option value="SOL">SOL</option>
          <option value="XRP">XRP</option>
          <option value="SUI">SUI</option>
          <option value="JUP">JUP</option>
          <option value="TRUMP">TRUMP</option>
          <option value="BONK">BONK</option>
          <option value="USD">USD</option>
        </select>
      </div>

      {/* To Currency Input */}
      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={toAmount}
          onChange={handleToAmountChange}
          placeholder="Converted amount"
          className="flex-1 p-3 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <select
          value={toCurrency}
          onChange={handleToCurrencyChange}
          className="p-3 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer"
          aria-label="To currency"
          disabled={fromCurrency !== 'USD'} // Only enable if from is USD
        >
          <option value="USD">USD</option>
        </select>
      </div>

      {/* Attribution */}
      <div className="text-center text-zinc-500 text-xs my-2">
        Data provided by <span className="text-purple-500">CoinGecko</span>
        {!isLoading && <span className="ml-1">• Auto-updates every 30s</span>}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-2">
        <button 
          className="w-12 h-12 rounded-full bg-purple-900/20 hover:bg-purple-900/30 flex items-center justify-center text-purple-500 transition-colors"
          aria-label="Search"
        >
          <span className="text-xl">🔍</span>
        </button>
        <button 
          className="w-12 h-12 rounded-full bg-purple-900/20 hover:bg-purple-900/30 flex items-center justify-center text-purple-500 transition-colors"
          aria-label="Chart"
        >
          <span className="text-xl">📈</span>
        </button>
      </div>
    </div>
  );
};

export default ConverterDemo; 