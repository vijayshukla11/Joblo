import React from 'react';
import { Database, Search } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: 'search' | 'database';
  actionLabel?: string;
  onAction?: () => void;
  id?: string;
}

export default function EmptyState({
  title = 'No records matched your filters',
  description = 'Try refining your location search, resetting industry checkboxes, or clearing text queries to see verified positions.',
  icon = 'search',
  actionLabel,
  onAction,
  id,
}: EmptyStateProps) {
  const Icon = icon === 'database' ? Database : Search;

  return (
    <div
      id={id || 'empty-state-view'}
      className="p-8 sm:p-12 text-center flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-2xl bg-white max-w-lg mx-auto font-sans"
    >
      <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0 mb-4">
        <Icon className="w-5 h-5 shrink-0" />
      </div>

      <h4 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight font-heading">
        {title}
      </h4>
      <p className="text-[11px] sm:text-xs text-slate-500 mt-1.5 leading-relaxed max-w-sm">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onAction}
          className="mt-5"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
