import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate: (path: string) => void;
  className?: string;
  id?: string;
}

export default function Breadcrumb({ items, onNavigate, className = '', id }: BreadcrumbProps) {
  return (
    <nav
      id={id || 'breadcrumb-nav'}
      aria-label="Breadcrumb"
      className={`flex items-center gap-2 text-[10px] font-mono tracking-wide text-slate-400 uppercase font-bold select-none ${className}`}
    >
      <button
        onClick={() => onNavigate('/')}
        className="hover:text-slate-900 transition-colors cursor-pointer flex items-center gap-1 shrink-0"
        aria-label="Portal Home"
      >
        <Home className="w-3 h-3 text-slate-400 shrink-0" />
        <span>Home</span>
      </button>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3 h-3 text-slate-350 shrink-0" />
            {isLast || !item.path ? (
              <span className="text-slate-800 font-extrabold max-w-[150px] sm:max-w-xs truncate leading-none">
                {item.label}
              </span>
            ) : (
              <button
                onClick={() => onNavigate(item.path!)}
                className="hover:text-slate-900 transition-colors cursor-pointer leading-none"
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
