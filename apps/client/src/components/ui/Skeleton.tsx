// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Reusable Skeleton Component
// =============================================================================

import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "rectangular" | "circular" | "text";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = "rectangular",
  ...props
}) => {
  const variantStyles = {
    rectangular: "rounded-xl",
    circular: "rounded-full",
    text: "rounded-md h-4 my-1",
  };

  return (
    <div
      className={twMerge(
        clsx(
          "animate-pulse bg-slate-800/70 border border-slate-700/20",
          variantStyles[variant],
          className
        )
      )}
      aria-hidden="true"
      {...props}
    />
  );
};

export default Skeleton;
