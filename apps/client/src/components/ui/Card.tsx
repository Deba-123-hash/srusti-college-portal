// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Reusable Card Component
// =============================================================================

import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "bordered" | "interactive";
}

export const Card: React.FC<CardProps> = ({
  className,
  variant = "glass",
  children,
  ...props
}) => {
  const variantStyles = {
    default: "bg-slate-900 border border-slate-800 shadow-xl",
    glass: "bg-slate-900/80 backdrop-blur-md border border-slate-800/80 shadow-2xl",
    bordered: "bg-transparent border border-slate-800 hover:border-slate-700",
    interactive:
      "bg-slate-900/80 backdrop-blur-md border border-slate-800/80 shadow-xl hover:border-blue-500/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-950/20 transition-all duration-300 cursor-pointer",
  };

  return (
    <div
      className={twMerge(
        clsx("rounded-2xl overflow-hidden", variantStyles[variant], className)
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={twMerge(clsx("p-6 pb-4 border-b border-slate-800/60", className))} {...props}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <h3
      className={twMerge(clsx("text-lg font-bold text-white tracking-tight", className))}
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <p className={twMerge(clsx("text-xs text-slate-400 mt-1", className))} {...props}>
      {children}
    </p>
  );
};

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={twMerge(clsx("p-6", className))} {...props}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx("p-6 pt-4 border-t border-slate-800/60 bg-slate-950/30 flex items-center justify-between", className)
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
