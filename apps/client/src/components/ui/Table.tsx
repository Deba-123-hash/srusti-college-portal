// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Reusable Table Component
// =============================================================================

import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const Table: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
      <table
        className={twMerge(clsx("w-full text-left text-sm text-slate-300", className))}
        {...props}
      >
        {children}
      </table>
    </div>
  );
};

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <thead
      className={twMerge(
        clsx("bg-slate-950/60 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800", className)
      )}
      {...props}
    >
      {children}
    </thead>
  );
};

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <tbody className={twMerge(clsx("divide-y divide-slate-800/60", className))} {...props}>
      {children}
    </tbody>
  );
};

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <tr
      className={twMerge(
        clsx("hover:bg-slate-800/40 transition-colors", className)
      )}
      {...props}
    >
      {children}
    </tr>
  );
};

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <th className={twMerge(clsx("py-3.5 px-4 font-semibold tracking-wider", className))} {...props}>
      {children}
    </th>
  );
};

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <td className={twMerge(clsx("py-3.5 px-4 text-xs sm:text-sm text-slate-300", className))} {...props}>
      {children}
    </td>
  );
};

export default Table;
