// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Reusable Spinner Component
// =============================================================================

import React from "react";
import { Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  className,
  label = "Loading...",
}) => {
  const sizeStyles = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  return (
    <div className="inline-flex items-center gap-2 text-blue-500" role="status">
      <Loader2
        className={twMerge(clsx("animate-spin text-current", sizeStyles[size], className))}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
};

export default Spinner;
