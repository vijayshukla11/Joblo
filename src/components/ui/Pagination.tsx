import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  id?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  id,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      id={id}
      className={`flex items-center justify-between border-t border-slate-100 bg-white px-4 py-3.5 sm:px-6 font-sans ${className}`}
      aria-label="Pagination"
    >
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="relative inline-flex items-center rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
        >
          Previous
        </button>
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="relative ml-3 inline-flex items-center rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
        >
          Next
        </button>
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-[11px] text-slate-400 font-mono uppercase tracking-wide">
            Page <span className="font-bold text-slate-800">{currentPage}</span> of{' '}
            <span className="font-bold text-slate-800">{totalPages}</span>
          </p>
        </div>
        
        <div>
          <span className="isolate inline-flex -space-x-px rounded-md shadow-3xs">
            <button
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 focus:z-20 disabled:opacity-50 cursor-pointer"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4 shrink-0" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              const isActive = page === currentPage;
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative inline-flex items-center px-3.5 py-2 text-xs font-bold ring-1 ring-inset focus:z-20 cursor-pointer ${
                    isActive
                      ? 'z-10 bg-slate-900 text-white ring-slate-900'
                      : 'text-slate-600 ring-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 focus:z-20 disabled:opacity-50 cursor-pointer"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4 shrink-0" />
            </button>
          </span>
        </div>
      </div>
    </nav>
  );
}
