import React from 'react';
import { AlertTriangle, WifiOff, FileQuestion, RotateCcw, Loader2 } from 'lucide-react';

// 1. Full Page Loading Spinner / Skeleton Container
interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Accessing secured API pipeline...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 min-h-[400px] text-center" aria-busy="true" aria-live="polite">
      <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-4" />
      <p className="text-sm font-medium text-gray-500 font-sans">{message}</p>
      {/* Visual Skeleton placeholders */}
      <div className="w-full max-w-xl mt-6 space-y-3">
        <div className="h-4 bg-gray-100 rounded-sm animate-pulse w-3/4 mx-auto" />
        <div className="h-3 bg-gray-100 rounded-sm animate-pulse w-1/2 mx-auto" />
      </div>
    </div>
  );
}

// 2. Beautiful Empty State with CTA Option
interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, actionText, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center border border-dashed border-gray-100 rounded-xl bg-slate-50/50 my-4 max-w-xl mx-auto">
      <FileQuestion className="w-10 h-10 text-gray-400 mb-3" />
      <h3 className="text-sm font-bold text-gray-900 font-heading tracking-tight mb-1">{title}</h3>
      <p className="text-xs text-gray-500 leading-relaxed font-sans mb-5 max-w-sm">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-black hover:bg-zinc-800 transition-colors focus-ring rounded-lg cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

// 3. 404 Route Not Found Component
interface NotFoundStateProps {
  onGoHome: () => void;
}

export function NotFoundState({ onGoHome }: NotFoundStateProps) {
  return (
    <div className="max-w-md mx-auto text-center py-24 px-6">
      <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-5">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h2 className="text-xl font-extrabold tracking-tight text-gray-900 font-heading mb-2">404 - Page Not Found</h2>
      <p className="text-xs text-gray-500 leading-relaxed font-sans mb-8">
        The requested career directory, job listings table, or editorial guide does not exist, or has been relocated to another URI index.
      </p>
      <button
        onClick={onGoHome}
        className="inline-flex items-center justify-center px-5 py-2.5 text-xs font-bold text-white bg-black hover:bg-zinc-800 transition-all focus-ring rounded-lg cursor-pointer"
      >
        Return to JOB Lo Gateway
      </button>
    </div>
  );
}

// 4. Offline Connectivity Handler
export function OfflineState() {
  return (
    <div className="max-w-md mx-auto text-center py-16 px-6 border border-amber-100 rounded-xl bg-amber-50/20 my-6">
      <WifiOff className="w-10 h-10 text-amber-600 mx-auto mb-3" />
      <h3 className="text-sm font-bold text-amber-950 font-heading tracking-tight mb-1">Connection Interrupted</h3>
      <p className="text-xs text-amber-800 leading-relaxed font-sans">
        You are currently offline. Showing cached career data pipelines. Please check your network to resume active indexing.
      </p>
    </div>
  );
}

// 5. General Error boundary UI
interface ErrorStateProps {
  errorMsg?: string;
  onRetry: () => void;
}

export function ErrorState({ errorMsg = 'An unexpected API pipeline error occurred.', onRetry }: ErrorStateProps) {
  return (
    <div className="max-w-md mx-auto text-center py-16 px-6 border border-rose-100 rounded-xl bg-rose-50/20 my-6">
      <AlertTriangle className="w-10 h-10 text-rose-600 mx-auto mb-3" />
      <h3 className="text-sm font-bold text-rose-950 font-heading tracking-tight mb-1">System Error</h3>
      <p className="text-xs text-rose-800 leading-relaxed font-sans mb-5">{errorMsg}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-rose-900 bg-rose-100 hover:bg-rose-200 transition-colors focus-ring rounded-lg cursor-pointer mx-auto"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Re-establish Connection</span>
      </button>
    </div>
  );
}
