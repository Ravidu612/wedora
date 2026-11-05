import React from 'react';

export default function Card({
  children,
  className = '',
  title,
  subtitle,
  action,
  goldAccent = false,
  ...props
}) {
  return (
    <div
      className={`bg-white rounded-2xl border ${
        goldAccent ? 'border-champagne-300 shadow-premium' : 'border-stone-100 shadow-soft'
      } p-6 transition-all duration-200 ${className}`}
      {...props}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-stone-100">
          <div>
            {title && (
              <h3 className="text-lg font-serif font-semibold text-textDark tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-textMuted mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

