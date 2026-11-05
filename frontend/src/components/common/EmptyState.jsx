import React from 'react';
import Button from './Button';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  actionIcon,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center bg-stone-50/50 rounded-2xl border border-dashed border-stone-200 ${className}`}>
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-champagne-50 border border-champagne-100 flex items-center justify-center text-champagne-600 mb-4 shadow-sm">
          <Icon className="w-7 h-7" />
        </div>
      )}
      <h4 className="text-base font-serif font-semibold text-textDark mb-1">
        {title}
      </h4>
      <p className="text-sm text-textMuted max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <Button onClick={onAction} icon={actionIcon} variant="primary" size="md">
          {actionText}
        </Button>
      )}
    </div>
  );
}

