import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (path: string) => void;
}

export default function Breadcrumbs({ items, onNavigate }: BreadcrumbsProps) {
  return (
    <nav 
      aria-label="Breadcrumb" 
      className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-1.5 text-xs text-gray-400 select-none"
    >
      <button
        onClick={() => onNavigate('/')}
        className="flex items-center gap-1 hover:text-black transition-colors focus-ring rounded p-1 cursor-pointer"
        aria-label="Go to JOB Lo Home"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="sr-only">Home</span>
      </button>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3 h-3 text-gray-300 shrink-0" aria-hidden="true" />
            {isLast || !item.path ? (
              <span 
                className="font-medium text-gray-600 truncate max-w-[200px] sm:max-w-xs" 
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <button
                onClick={() => onNavigate(item.path!)}
                className="hover:text-black transition-colors focus-ring rounded px-1 py-0.5 cursor-pointer font-medium truncate max-w-[150px] sm:max-w-none"
              >
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
