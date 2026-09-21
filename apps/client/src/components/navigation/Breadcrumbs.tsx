// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Reusable Breadcrumbs Component
// =============================================================================

import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { clsx } from "clsx";

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={clsx("flex items-center space-x-2 text-xs text-slate-400 py-2", className)}
    >
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-white transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="sr-only">Home</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            {isLast || !item.path ? (
              <span className="font-semibold text-slate-200 truncate max-w-[200px]">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.path}
                className="hover:text-white transition-colors truncate max-w-[150px]"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
