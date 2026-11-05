import React from 'react';

export default function Badge({
  children,
  variant = 'default', // 'paid', 'unpaid', 'partially-paid', 'overdue', 'confirmed', 'pending', 'declined', 'gold', 'secondary'
  size = 'sm',
  className = '',
}) {
  const variantStyles = {
    paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'partially-paid': 'bg-amber-50 text-amber-700 border-amber-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    unpaid: 'bg-stone-100 text-stone-700 border-stone-200',
    overdue: 'bg-rose-50 text-rose-700 border-rose-200',
    declined: 'bg-rose-50 text-rose-700 border-rose-200',
    gold: 'bg-champagne-50 text-champagne-800 border-champagne-300',
    default: 'bg-stone-100 text-stone-700 border-stone-200',
  };

  const normalized = (variant || '').toLowerCase().replace(/\s+/g, '-');
  const matchedStyle = variantStyles[normalized] || variantStyles.default;

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${
        size === 'sm' ? 'text-[11px] px-2.5 py-0.5' : 'text-xs px-3 py-1'
      } ${matchedStyle} ${className}`}
    >
      {children}
    </span>
  );
}

