import React from 'react';

export default function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  badgeText,
  badgeType = 'neutral', // 'success', 'warning', 'danger', 'gold', 'neutral'
  className = '',
}) {
  const badgeColors = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    gold: 'bg-champagne-50 text-champagne-700 border-champagne-200',
    neutral: 'bg-stone-50 text-stone-600 border-stone-200',
  };

  return (
    <div className={`bg-white rounded-2xl p-5 border border-stone-100 shadow-soft hover:shadow-md transition-all duration-200 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-textMuted">
          {title}
        </span>
        {Icon && (
          <div className="w-9 h-9 rounded-xl bg-champagne-50 border border-champagne-100 flex items-center justify-center text-champagne-600">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <div className="text-2xl font-serif font-bold text-textDark tracking-tight">
          {value}
        </div>
        {badgeText && (
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${badgeColors[badgeType]}`}>
            {badgeText}
          </span>
        )}
      </div>

      {subtext && (
        <p className="text-xs text-textMuted mt-1.5 leading-relaxed">
          {subtext}
        </p>
      )}
    </div>
  );
}

