import React from 'react';

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  variant?: 'white' | 'slate' | 'zinc' | 'transparent';
  spacing?: 'compact' | 'standard' | 'relaxed';
}

export default function SectionWrapper({
  children,
  className = '',
  id,
  variant = 'transparent',
  spacing = 'standard',
}: SectionWrapperProps) {
  const bgStyles = {
    white: 'bg-white',
    slate: 'bg-slate-50 border-y border-slate-100',
    zinc: 'bg-zinc-950 text-white border-y border-zinc-900',
    transparent: '',
  };

  const spacingStyles = {
    compact: 'py-8 sm:py-10',
    standard: 'py-14 sm:py-20',
    relaxed: 'py-20 sm:py-28',
  };

  return (
    <section
      id={id || 'section-wrapper'}
      className={`${bgStyles[variant]} ${spacingStyles[spacing]} ${className}`}
    >
      {children}
    </section>
  );
}
