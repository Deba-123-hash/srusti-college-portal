// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Reusable Dropdown Component
// =============================================================================

import React, { useState, useRef, useEffect } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface DropdownItem {
  label: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  disabled?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = "right",
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={twMerge(
            clsx(
              "absolute z-50 mt-2 min-w-[200px] rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-1.5 animate-in fade-in zoom-in-95 duration-150",
              align === "right" ? "right-0" : "left-0",
              className
            )
          )}
        >
          {items.map((item, index) => (
            <button
              key={index}
              disabled={item.disabled}
              onClick={() => {
                if (item.onClick) item.onClick();
                setIsOpen(false);
              }}
              className={twMerge(
                clsx(
                  "w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left",
                  item.danger
                    ? "text-rose-400 hover:bg-rose-950/40 hover:text-rose-300"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white",
                  item.disabled && "opacity-50 cursor-not-allowed"
                )
              )}
            >
              {item.icon && <span className="text-current shrink-0">{item.icon}</span>}
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
