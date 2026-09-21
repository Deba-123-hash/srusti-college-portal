// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Reusable Error State Component
// =============================================================================

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Button from "./Button";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message = "An error occurred while loading content. Please try again.",
  onRetry,
  className,
}) => {
  return (
    <div
      role="alert"
      className={twMerge(
        clsx(
          "flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-rose-500/20 bg-rose-950/10",
          className
        )
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4 shadow-xl shadow-rose-950/20">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <h4 className="text-base font-bold text-white tracking-tight">{title}</h4>
      <p className="mt-1.5 text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <div className="mt-5">
          <Button
            size="sm"
            variant="outline"
            onClick={onRetry}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default ErrorState;
