import React from 'react';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: DropdownOption[];
  label?: string;
  error?: string;
  helperText?: string;
}

export default function Dropdown({
  className = '',
  options,
  label,
  error,
  helperText,
  id,
  ...props
}: DropdownProps) {
  const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className="w-full flex flex-col gap-1.5 font-sans">
      {label && (
        <label
          htmlFor={selectId}
          className="text-2xs sm:text-xs font-bold text-slate-800 tracking-tight"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <select
          id={selectId}
          className={`w-full bg-white border rounded-lg text-xs font-semibold px-3.5 py-2.5 transition-all focus-ring disabled:bg-slate-50 disabled:cursor-not-allowed text-slate-900 appearance-none cursor-pointer ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-150'
              : 'border-slate-200 focus:border-slate-950 focus:ring-slate-100'
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="font-sans font-medium text-slate-900">
              {opt.label}
            </option>
          ))}
        </select>
        
        {/* Customized indicator arrow */}
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500 shrink-0">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {error && (
        <p className="text-[10px] text-red-600 font-semibold font-mono mt-0.5">
          {error}
        </p>
      )}

      {!error && helperText && (
        <p className="text-[10px] text-slate-400 font-medium font-mono mt-0.5">
          {helperText}
        </p>
      )}
    </div>
  );
}
