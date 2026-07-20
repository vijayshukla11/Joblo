import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import Button from './Button';

interface ErrorStateProps {
  title?: string;
  errorMessage?: string;
  onRetry?: () => void;
  id?: string;
}

export default function ErrorState({
  title = 'Service Encountered a Temporary Connection Halt',
  errorMessage = 'The system was unable to establish a secure, DPDP-compliant channel to fetch the target portal records. Please review your internet connection and try reloading.',
  onRetry,
  id,
}: ErrorStateProps) {
  return (
    <div
      id={id || 'error-state-view'}
      className="p-8 sm:p-12 text-center flex flex-col items-center justify-center border border-red-100 rounded-2xl bg-red-50/20 max-w-lg mx-auto font-sans"
    >
      <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center shrink-0 mb-4 border border-red-500/10">
        <AlertCircle className="w-5.5 h-5.5 shrink-0" />
      </div>

      <h4 className="text-xs sm:text-sm font-bold text-red-950 tracking-tight font-heading">
        {title}
      </h4>
      <p className="text-[11px] sm:text-xs text-red-700/80 mt-1.5 leading-relaxed max-w-xs font-medium">
        {errorMessage}
      </p>

      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          className="mt-6 border-red-200/60 text-red-800 hover:bg-red-50/50"
        >
          <span>Retry Operations</span>
        </Button>
      )}
    </div>
  );
}
