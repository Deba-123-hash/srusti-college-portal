// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Toast Container & Presentation Component
// =============================================================================

import React from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { useToastStore, ToastItem } from "../../store/toastStore";
import { clsx } from "clsx";

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => (
        <ToastMessage key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastMessage: React.FC<{ toast: ToastItem; onDismiss: () => void }> = ({
  toast,
  onDismiss,
}) => {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
  };

  const borders = {
    success: "border-emerald-500/30 bg-slate-900/95 text-emerald-100",
    error: "border-rose-500/30 bg-slate-900/95 text-rose-100",
    warning: "border-amber-500/30 bg-slate-900/95 text-amber-100",
    info: "border-blue-500/30 bg-slate-900/95 text-blue-100",
  };

  return (
    <div
      className={clsx(
        "pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-md transition-all duration-200 animate-in slide-in-from-right-8",
        borders[toast.type]
      )}
      role="alert"
    >
      {icons[toast.type]}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <h5 className="text-xs font-bold text-white tracking-wide uppercase">
            {toast.title}
          </h5>
        )}
        <p className="text-xs text-slate-300 mt-0.5 leading-relaxed break-words">
          {toast.message}
        </p>
      </div>
      <button
        onClick={onDismiss}
        className="text-slate-400 hover:text-white transition p-1 rounded-lg hover:bg-slate-800"
        aria-label="Close notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default ToastContainer;
