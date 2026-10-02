import React from 'react';
import { cn } from '@/utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'accent' | 'highlight';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-white border-2 border-slate-200 shadow-xs',
      accent: 'bg-blue-50/50 border-2 border-blue-200 shadow-xs',
      highlight: 'bg-amber-50/50 border-2 border-amber-300 shadow-xs',
    };

    return (
      <div
        ref={ref}
        className={cn('rounded-2xl sm:rounded-3xl p-4 sm:p-6 transition-all max-w-full overflow-hidden', variants[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
