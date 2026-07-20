import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export default function Input({
  className = '',
  label,
  error,
  helperText,
  leftIcon,
  id,
  type = 'text',
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  return (
    <div className="w-full flex flex-col gap-1.5 font-sans">
      {label && (
        <label
          htmlFor={inputId}
          className="text-2xs sm:text-xs font-bold text-slate-800 tracking-tight"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 shrink-0">
            {leftIcon}
          </div>
        )}
        
        <input
          id={inputId}
          type={type}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={`w-full bg-white border rounded-lg text-xs font-medium transition-all focus-ring disabled:bg-slate-50 disabled:cursor-not-allowed text-slate-900 placeholder:text-slate-400 ${
            leftIcon ? 'pl-10' : 'px-3.5'
          } ${
            error
              ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-100'
              : 'border-slate-200 focus:border-slate-900 focus:ring-slate-100'
          } py-2.5 ${className}`}
          {...props}
        />
      </div>

      {error && (
        <p id={errorId} role="alert" className="text-[10px] text-red-600 font-semibold font-mono mt-0.5">
          {error}
        </p>
      )}

      {!error && helperText && (
        <p id={helperId} className="text-[10px] text-slate-400 font-medium font-mono mt-0.5">
          {helperText}
        </p>
      )}
    </div>
  );
}
