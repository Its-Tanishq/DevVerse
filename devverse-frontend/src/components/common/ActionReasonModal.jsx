import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X, Loader2 } from "lucide-react";

export default function ActionReasonModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title,
  icon,
  description,
  colorClass = "bg-accent text-foreground",
  buttonColor = "bg-primary text-primary-foreground",
  confirmText = "Confirm Action",
  isSubmitting = false
}) {
  const [reason, setReason] = useState("");

  if (typeof document === "undefined" || !isOpen) return null;

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason);
      setReason("");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="p-5 border-b border-border flex items-center justify-between bg-accent/30">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${colorClass}`}>
                  {icon}
                </div>
                <h3 className="font-bold text-foreground text-lg">{title}</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm">
              <div className="flex items-start gap-3 p-4 bg-accent/30 rounded-xl text-muted-foreground border border-border">
                <AlertCircle size={18} className="shrink-0 mt-0.5 text-foreground" />
                <p>{description}</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="reason" className="block text-sm font-semibold text-foreground">
                  Reason for Action <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-muted-foreground">
                  This reason will be securely recorded in the platform's audit logs.
                </p>
                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="E.g., Violating community guidelines..."
                  className="w-full p-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#7c3aed] min-h-[100px] resize-none transition-all"
                />
              </div>
            </div>

            <div className="p-5 border-t border-border flex items-center justify-end gap-3 bg-accent/10">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={!reason.trim() || isSubmitting}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${buttonColor}`}
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
