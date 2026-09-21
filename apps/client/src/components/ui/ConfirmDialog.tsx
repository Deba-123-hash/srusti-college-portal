// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Reusable Confirm Dialog Component
// =============================================================================

import React from "react";
import Modal from "./Modal";
import Button from "./Button";
import { AlertCircle } from "lucide-react";

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
            variant === "danger"
              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
          }`}
        >
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-white">{title}</h3>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">{message}</p>
        <div className="mt-6 flex items-center justify-end gap-3 w-full">
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="w-1/2"
          >
            {cancelLabel}
          </Button>
          <Button
            size="sm"
            variant={variant === "danger" ? "danger" : "primary"}
            onClick={onConfirm}
            isLoading={isLoading}
            className="w-1/2"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
