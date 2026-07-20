import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  variant?: 'full-screen' | 'card' | 'inline';
  id?: string;
}

export default function LoadingState({
  message = 'Retrieving encrypted record sets...',
  variant = 'card',
  id,
}: LoadingStateProps) {
  if (variant === 'inline') {
    return (
      <div id={id} className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 font-mono select-none">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600 shrink-0" />
        <span>{message}</span>
      </div>
    );
  }

  const containerStyles = {
    'full-screen': 'fixed inset-0 bg-white/80 backdrop-blur-xs z-50 flex items-center justify-center',
    card: 'p-12 flex flex-col items-center justify-center border border-slate-150 rounded-2xl bg-white max-w-lg w-full mx-auto shadow-3xs',
  };

  return (
    <div id={id || 'loading-state-view'} className={`${containerStyles[variant]} font-sans`}>
      <div className="flex flex-col items-center text-center gap-4">
        {/* Spinner ripple effect */}
        <div className="relative flex items-center justify-center">
          <div className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-emerald-500/10 opacity-75" />
          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-3xs">
            <Loader2 className="w-4.5 h-4.5 animate-spin shrink-0" />
          </div>
        </div>

        <div className="space-y-1 select-none">
          <p className="text-xs font-bold text-slate-900 tracking-tight font-heading">
            {message}
          </p>
          {variant === 'full-screen' && (
            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wide">
              India Sourcing Gateway Secured
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
