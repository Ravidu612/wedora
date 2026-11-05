import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  type = 'button',
  variant = 'primary', // 'primary', 'secondary', 'outline', 'ghost', 'danger', 'gold-outline'
  size = 'md', // 'sm', 'md', 'lg'
  isLoading = false,
  disabled = false,
  onClick,
  className = '',
  icon: Icon,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2 shadow-sm',
    lg: 'text-base px-6 py-3.5 gap-2.5 shadow',
  };

  const variantStyles = {
    primary: 'bg-champagne-500 hover:bg-champagne-600 text-white focus:ring-champagne-400 shadow-champagne-500/20',
    secondary: 'bg-ivory hover:bg-ivory-dark text-textDark border border-stone-200 focus:ring-stone-400',
    outline: 'bg-transparent border border-stone-300 hover:bg-stone-50 text-textDark focus:ring-stone-400',
    'gold-outline': 'bg-transparent border border-champagne-400/60 hover:bg-champagne-50 text-champagne-700 focus:ring-champagne-400',
    ghost: 'bg-transparent hover:bg-stone-100 text-stone-700 hover:text-stone-900 focus:ring-stone-400',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-400 shadow-rose-600/20',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />}
          {children}
        </>
      )}
    </button>
  );
}

