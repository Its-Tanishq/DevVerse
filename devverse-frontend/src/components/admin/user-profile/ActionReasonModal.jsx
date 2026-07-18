import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Ban, Star, Trash2, X } from "lucide-react";

export default function ActionReasonModal({ isOpen, onClose, onConfirm, action, user }) {
  const [reason, setReason] = useState("");

  if (typeof document === "undefined" || !isOpen || !user) return null;

  const actionDetails = {
    delete: {
      title: "Delete Account",
      icon: <Trash2 size={24} className="text-red-500" />,
      colorClass: "bg-red-500/10 text-red-500",
      buttonColor: "bg-red-600 hover:bg-red-700 text-white",
      description: `You are about to permanently delete the account of @${user.actualUsername || user.username}. This action cannot be undone.`,
    },
    ban: {
      title: user.isBanned || user.isEnabled === false ? "Unban Account" : "Ban Account",
      icon: <Ban size={24} className="text-orange-500" />,
      colorClass: "bg-orange-500/10 text-orange-500",
      buttonColor: "bg-orange-600 hover:bg-orange-700 text-white",
      description: `You are about to ${user.isBanned || user.isEnabled === false ? 'unban' : 'ban'} the account of @${user.actualUsername || user.username}.`,
    },
    premium: {
      title: user.isPremium ? "Remove Premium Status" : "Grant Premium Status",
      icon: <Star size={24} className="text-indigo-500" />,
      colorClass: "bg-indigo-500/10 text-indigo-500",
      buttonColor: "bg-indigo-600 hover:bg-indigo-700 text-white",
      description: `You are about to ${user.isPremium ? 'remove premium from' : 'grant premium to'} the account of @${user.actualUsername || user.username}.`,
    },
    revoke: {
      title: "Revoke Active Sessions",
      icon: <AlertCircle size={24} className="text-orange-500" />,
      colorClass: "bg-orange-500/10 text-orange-500",
      buttonColor: "bg-orange-600 hover:bg-orange-700 text-white",
      description: `You are about to revoke all active sessions for @${user.actualUsername || user.username}. They will be logged out immediately from all devices.`,
    }
  };

  const details = actionDetails[action];

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason);
      setReason(""); // Reset for next time
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
                <div className={`p-2 rounded-xl ${details?.colorClass}`}>
                  {details?.icon}
                </div>
                <h3 className="font-bold text-foreground text-lg">{details?.title}</h3>
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
                <p>{details?.description}</p>
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
                  placeholder="E.g., Violating community guidelines, user requested deletion..."
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
                disabled={!reason.trim()}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${details?.buttonColor}`}
              >
                Confirm Action
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
