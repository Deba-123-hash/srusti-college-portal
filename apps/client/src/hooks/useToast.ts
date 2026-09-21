// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// useToast Hook
// =============================================================================

import { useToastStore, ToastType } from "../store/toastStore";

export const useToast = () => {
  const { addToast, removeToast, clearToasts, toasts } = useToastStore();

  const toast = {
    show: (type: ToastType, message: string, title?: string, duration?: number) => {
      return addToast({ type, message, title, duration });
    },
    success: (message: string, title = "Success", duration?: number) => {
      return addToast({ type: "success", message, title, duration });
    },
    error: (message: string, title = "Error", duration?: number) => {
      return addToast({ type: "error", message, title, duration });
    },
    warning: (message: string, title = "Notice", duration?: number) => {
      return addToast({ type: "warning", message, title, duration });
    },
    info: (message: string, title = "Information", duration?: number) => {
      return addToast({ type: "info", message, title, duration });
    },
    dismiss: (id: string) => removeToast(id),
    clear: () => clearToasts(),
  };

  return { toast, toasts };
};

export default useToast;
