import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'verified' | 'government' | 'tech' | 'remote' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
}

export default function Badge({
  children,
  className = '',
  variant = 'default',
  size = 'md',
  ...props
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold font-mono uppercase tracking-wider rounded-md border shrink-0';

  const variantStyles = {
    default: 'bg-slate-100 text-slate-800 border-slate-200/50',
    verified: 'bg-emerald-50 text-emerald-800 border-emerald-200/60 font-bold',
    government: 'bg-amber-50 text-amber-800 border-amber-200/60 font-bold',
    tech: 'bg-blue-50 text-blue-800 border-blue-200/60',
    remote: 'bg-purple-50 text-purple-800 border-purple-200/60',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-250/60',
    danger: 'bg-red-50 text-red-800 border-red-200/60',
    info: 'bg-slate-900 text-white border-transparent',
  };

  const sizeStyles = {
    sm: 'text-[8px] px-1.5 py-0.5',
    md: 'text-[9px] px-2 py-1',
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`} {...props}>
      {children}
    </span>
  );
}
