// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Reusable Pagination Component
// =============================================================================

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  className,
}) => {
  if (totalPages <= 1) return null;

  const startItem = totalItems && pageSize ? (currentPage - 1) * pageSize + 1 : null;
  const endItem =
    totalItems && pageSize
      ? Math.min(currentPage * pageSize, totalItems)
      : null;

  return (
    <div
      className={twMerge(
        clsx(
          "flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 text-xs text-slate-400",
          className
        )
      )}
    >
      <div>
        {startItem && endItem && totalItems ? (
          <span>
            Showing <strong className="text-white font-semibold">{startItem}</strong> to{" "}
            <strong className="text-white font-semibold">{endItem}</strong> of{" "}
            <strong className="text-white font-semibold">{totalItems}</strong> entries
          </span>
        ) : (
          <span>
            Page <strong className="text-white">{currentPage}</strong> of{" "}
            <strong className="text-white">{totalPages}</strong>
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => {
            return (
              p === 1 ||
              p === totalPages ||
              Math.abs(p - currentPage) <= 1
            );
          })
          .map((page, idx, arr) => {
            const prev = arr[idx - 1];
            return (
              <React.Fragment key={page}>
                {prev && page - prev > 1 && (
                  <span className="px-1 text-slate-600">...</span>
                )}
                <button
                  onClick={() => onPageChange(page)}
                  className={twMerge(
                    clsx(
                      "w-8 h-8 rounded-xl font-semibold text-xs transition",
                      page === currentPage
                        ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
                        : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white"
                    )
                  )}
                  aria-current={page === currentPage ? "page" : undefined}
                >
                  {page}
                </button>
              </React.Fragment>
            );
          })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
