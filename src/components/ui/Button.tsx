import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'emerald';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all focus-ring cursor-pointer select-none disabled:cursor-not-allowed disabled:opacity-50';
  
  const variantStyles = {
    primary: 'bg-slate-900 text-white hover:bg-slate-850 active:scale-[0.985] shadow-xs',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 active:scale-[0.985]',
    outline: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 active:scale-[0.985]',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-50 hover:text-black',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:scale-[0.985] shadow-xs',
    emerald: 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.985] shadow-xs',
  };

  const sizeStyles = {
    xs: 'px-2.5 py-1.5 text-[10px] gap-1',
    sm: 'px-3 py-2 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-xs gap-2',
    lg: 'px-5 py-3 text-sm gap-2',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />}
      {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
}
