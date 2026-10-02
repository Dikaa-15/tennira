import React from 'react';
import { cn } from '@/utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'secondary' | 'outline';
  size?: 'default' | 'large' | 'emergency';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = 'primary',
      size = 'default',
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-bold select-none cursor-pointer transition-all duration-150 focus-visible:outline-3 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm active:bg-blue-800',
      danger: 'bg-red-500 hover:bg-red-600 text-white shadow-md active:bg-red-700',
      secondary:
        'bg-white hover:bg-slate-100 text-slate-800 border-2 border-slate-300 shadow-xs active:bg-slate-200',
      outline:
        'bg-transparent hover:bg-blue-50 text-blue-600 border-2 border-blue-600 active:bg-blue-100',
    };

    const sizes = {
      default: 'h-14 min-h-[56px] px-6 text-lg rounded-xl',
      large: 'h-16 min-h-[64px] px-8 text-xl rounded-2xl',
      emergency: 'h-16 min-h-[64px] w-full px-6 text-xl rounded-2xl tracking-wide',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-3">
            <svg
              className="animate-spin h-6 w-6 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Memproses...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
