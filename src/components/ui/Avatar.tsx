import React, { useState } from 'react';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  id?: string;
}

export default function Avatar({ src, alt, size = 'md', className = '', id }: AvatarProps) {
  const [error, setError] = useState(false);

  const initials = alt
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const sizeStyles = {
    xs: 'w-6 h-6 text-[9px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-16 h-16 text-base',
  };

  return (
    <div
      id={id}
      className={`relative rounded-full flex items-center justify-center shrink-0 overflow-hidden font-bold select-none border border-slate-100 bg-slate-50 text-slate-800 font-sans ${sizeStyles[size]} ${className}`}
    >
      {src && !error ? (
        <img
          src={src}
          alt={alt}
          onError={() => setError(true)}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <span className="font-heading tracking-tight text-slate-600">{initials}</span>
      )}
    </div>
  );
}
