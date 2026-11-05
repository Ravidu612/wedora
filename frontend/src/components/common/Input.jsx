import React, { forwardRef } from 'react';

const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      type = 'text',
      className = '',
      icon: Icon,
      required = false,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        )}
        <div className="relative rounded-xl shadow-sm">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={`block w-full rounded-xl bg-white border border-stone-200 text-stone-900 placeholder-stone-400 text-sm py-2.5 transition-all duration-200 focus:outline-none focus:border-champagne-500 focus:ring-2 focus:ring-champagne-200/50 ${
              Icon ? 'pl-10 pr-3.5' : 'px-3.5'
            } ${error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200' : ''} ${className}`}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-xs text-stone-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;

