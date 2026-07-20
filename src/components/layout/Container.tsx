import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  clean?: boolean; // If true, removes lateral padding
}

export default function Container({ children, className = '', id, clean = false }: ContainerProps) {
  return (
    <div
      id={id || 'layout-container'}
      className={`w-full max-w-7xl mx-auto ${clean ? '' : 'px-6 sm:px-8 lg:px-10'} ${className}`}
    >
      {children}
    </div>
  );
}
