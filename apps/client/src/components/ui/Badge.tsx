// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Reusable Badge Component
// =============================================================================

import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "blue" | "emerald" | "amber" | "rose" | "slate" | "purple" | "gold";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "blue",
  size = "md",
  children,
  ...props
}) => {
  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
  };

  const variantStyles = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    slate: "bg-slate-800 text-slate-300 border-slate-700",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    gold: "bg-amber-400/10 text-amber-300 border-amber-400/30",
  };

  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center gap-1 font-semibold rounded-full border tracking-wide uppercase",
          sizeStyles[size],
          variantStyles[variant],
          className
        )
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
