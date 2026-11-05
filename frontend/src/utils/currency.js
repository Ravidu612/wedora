/**
 * Currency Formatter Utility for Wedora
 * Primary currency: LKR (Sri Lankan Rupee)
 */

export const CURRENCY_SYMBOLS = {
  LKR: 'Rs.',
  USD: '$',
  GBP: '£',
  EUR: '€',
  AUD: 'A$',
  CAD: 'C$',
  AED: 'AED',
  SGD: 'S$',
  INR: '₹',
};

export function formatCurrency(amount, currency = 'LKR') {
  const num = Number(amount) || 0;
  const symbol = CURRENCY_SYMBOLS[currency] || currency;

  return `${symbol} ${num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function formatCompactCurrency(amount, currency = 'LKR') {
  const num = Number(amount) || 0;
  const symbol = CURRENCY_SYMBOLS[currency] || currency;

  if (Math.abs(num) >= 1000000) {
    return `${symbol} ${(num / 1000000).toFixed(2)}M`;
  }
  if (Math.abs(num) >= 1000) {
    return `${symbol} ${(num / 1000).toFixed(1)}K`;
  }
  return formatCurrency(num, currency);
}

