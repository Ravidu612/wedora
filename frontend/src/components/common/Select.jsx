import React, { forwardRef } from 'react';

const Select = forwardRef(
  (
    {
      label,
      error,
      options = [],
      className = '',
      required = false,
      children,
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
        <select
          ref={ref}
          className={`block w-full rounded-xl bg-white border border-stone-200 text-stone-900 text-sm py-2.5 px-3.5 transition-all duration-200 focus:outline-none focus:border-champagne-500 focus:ring-2 focus:ring-champagne-200/50 ${
            error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200' : ''
          } ${className}`}
          {...props}
        >
          {children ||
            options.map((opt) => {
              const val = typeof opt === 'object' ? opt.value : opt;
              const lbl = typeof opt === 'object' ? opt.label : opt;
              return (
                <option key={val} value={val}>
                  {lbl}
                </option>
              );
            })}
        </select>
        {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;

