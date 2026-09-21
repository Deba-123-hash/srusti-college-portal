// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Reusable Empty State Component
// =============================================================================

import React from "react";
import { FolderOpen } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Button from "./Button";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          "flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/40",
          className
        )
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
        {icon || <FolderOpen className="w-7 h-7 text-slate-500" />}
      </div>
      <h4 className="text-base font-bold text-slate-200 tracking-tight">{title}</h4>
      {description && (
        <p className="mt-1.5 text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button size="sm" variant="secondary" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
