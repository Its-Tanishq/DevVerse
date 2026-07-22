import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";

export default function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  description, 
  confirmText = "Confirm", 
  cancelText = "Cancel", 
  isSubmitting = false,
  confirmButtonClass = "bg-red-500 hover:bg-red-600 text-white"
}) {
  if (typeof document === "undefined" || !isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">{title}</h2>
              <button 
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-muted-foreground text-sm mb-6">
              {description}
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                disabled={isSubmitting}
                className={`${confirmButtonClass} px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2`}
              >
                {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
