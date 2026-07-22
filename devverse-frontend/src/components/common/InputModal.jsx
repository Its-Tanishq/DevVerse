import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";

export default function InputModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  inputLabel,
  inputPlaceholder,
  initialValue = "",
  submitText = "Submit",
  cancelText = "Cancel",
  isSubmitting = false,
  submitButtonClass = "bg-[#7c3aed] hover:bg-[#6d28d9] text-white"
}) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (isOpen) {
      setValue(initialValue);
    }
  }, [isOpen, initialValue]);

  if (typeof document === "undefined" || !isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value);
    }
  };

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
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  {inputLabel}
                </label>
                <input
                  type="text"
                  required
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-colors"
                  placeholder={inputPlaceholder}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent transition-colors"
                >
                  {cancelText}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !value.trim()}
                  className={`${submitButtonClass} px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2`}
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  {submitText}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
