// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Reusable Button Component
// =============================================================================

import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "gold";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2 gap-2",
      lg: "text-base px-6 py-3 gap-2.5",
    };

    const variantStyles = {
      primary:
        "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30 border border-blue-500/30 focus:ring-blue-500",
      secondary:
        "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700/80 focus:ring-slate-400",
      outline:
        "bg-transparent hover:bg-slate-800/60 text-slate-200 border border-slate-700 hover:border-slate-600 focus:ring-slate-400",
      ghost:
        "bg-transparent hover:bg-slate-800/50 text-slate-300 hover:text-white border-transparent focus:ring-slate-400",
      danger:
        "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/30 border border-rose-500/30 focus:ring-rose-500",
      gold:
        "bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold shadow-lg shadow-amber-950/30 border border-amber-400/40 focus:ring-amber-400",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={twMerge(
          clsx(
            baseStyles,
            sizeStyles[size],
            variantStyles[variant],
            isLoading && "cursor-wait",
            className
          )
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
