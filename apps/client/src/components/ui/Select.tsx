// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Reusable Select Component
// =============================================================================

import React, { forwardRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ChevronDown, AlertCircle } from "lucide-react";

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      options = [],
      error,
      helperText,
      id,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold text-slate-300 tracking-wide"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={twMerge(
              clsx(
                "w-full appearance-none rounded-xl bg-slate-900/90 border text-slate-100 text-sm transition duration-200",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "pl-3.5 pr-10 py-2.5",
                error
                  ? "border-rose-500/80 focus:ring-rose-500 bg-rose-950/10 text-rose-100"
                  : "border-slate-800 hover:border-slate-700",
                className
              )
            )}
            aria-invalid={Boolean(error)}
            {...props}
          >
            {children ||
              options.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  className="bg-slate-900 text-slate-100 py-1"
                >
                  {opt.label}
                </option>
              ))}
          </select>
          <div className="absolute right-3.5 flex items-center pointer-events-none text-slate-400">
            {error ? (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </div>
        {error ? (
          <p className="text-xs text-rose-400 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
