// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Reusable Textarea Component
// =============================================================================

import React, { forwardRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AlertCircle } from "lucide-react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      id,
      rows = 4,
      disabled,
      ...props
    },
    ref
  ) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-semibold text-slate-300 tracking-wide"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            id={textareaId}
            rows={rows}
            disabled={disabled}
            className={twMerge(
              clsx(
                "w-full rounded-xl bg-slate-900/90 border text-slate-100 text-sm placeholder:text-slate-500 transition duration-200 resize-y",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "p-3.5",
                error
                  ? "border-rose-500/80 focus:ring-rose-500 bg-rose-950/10 text-rose-100"
                  : "border-slate-800 hover:border-slate-700",
                className
              )
            )}
            aria-invalid={Boolean(error)}
            {...props}
          />
          {error && (
            <div className="absolute top-3.5 right-3.5 flex items-center pointer-events-none text-rose-400">
              <AlertCircle className="w-4 h-4" />
            </div>
          )}
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

Textarea.displayName = "Textarea";

export default Textarea;
