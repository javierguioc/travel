import { useCallback } from 'react';
import { useItineraryStore } from '../store/store';
import { formatUSD, formatCOP, formatCostWithConversion } from '../utils/currency';

export function useCurrency() {
  const exchangeRate = useItineraryStore((state) => state.exchangeRate);
  const showCOPConversion = useItineraryStore((state) => state.showCOPConversion);

  const convertUSDToCOP = useCallback(
    (usd) => usd * exchangeRate,
    [exchangeRate]
  );

  const formatCost = useCallback(
    (usd) => formatCostWithConversion(usd, exchangeRate, showCOPConversion),
    [exchangeRate, showCOPConversion]
  );

  return {
    exchangeRate,
    showCOPConversion,
    convertUSDToCOP,
    formatCost,
    formatUSD,
    formatCOP,
  };
}

export default useCurrency;
