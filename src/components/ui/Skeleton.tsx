import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'card' | 'circle' | 'rectangle';
}

export default function Skeleton({
  className = '',
  variant = 'rectangle',
  ...props
}: SkeletonProps) {
  const baseStyles = 'bg-slate-150 animate-pulse shrink-0';

  const variantStyles = {
    text: 'h-3.5 w-full rounded-sm',
    card: 'h-40 w-full rounded-2xl',
    circle: 'rounded-full',
    rectangle: 'rounded-lg',
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
}
