// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Reusable Input Component
// =============================================================================

import React, { forwardRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AlertCircle } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-slate-300 tracking-wide"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={twMerge(
              clsx(
                "w-full rounded-xl bg-slate-900/90 border text-slate-100 text-sm placeholder:text-slate-500 transition duration-200",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                leftIcon ? "pl-10" : "pl-3.5",
                rightIcon || error ? "pr-10" : "pr-3.5",
                "py-2.5",
                error
                  ? "border-rose-500/80 focus:ring-rose-500 bg-rose-950/10 text-rose-100"
                  : "border-slate-800 hover:border-slate-700",
                className
              )
            )}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...props}
          />
          {rightIcon && !error && (
            <div className="absolute right-3.5 flex items-center text-slate-400">
              {rightIcon}
            </div>
          )}
          {error && (
            <div className="absolute right-3.5 flex items-center pointer-events-none text-rose-400">
              <AlertCircle className="w-4 h-4" />
            </div>
          )}
        </div>
        {error ? (
          <p id={`${inputId}-error`} className="text-xs text-rose-400 font-medium">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${inputId}-helper`} className="text-xs text-slate-400">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
