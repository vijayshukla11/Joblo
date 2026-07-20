import React from 'react';

export function Card({ children, className = '', id, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      id={id}
      className={`bg-white rounded-2xl border border-slate-150 shadow-3xs overflow-hidden transition-all hover:shadow-xs ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 border-b border-slate-100 flex flex-col gap-1 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '', ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`text-sm sm:text-base font-bold text-slate-900 tracking-tight font-heading ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '', ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-2xs sm:text-xs text-slate-500 font-medium ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4 ${className}`} {...props}>
      {children}
    </div>
  );
}
