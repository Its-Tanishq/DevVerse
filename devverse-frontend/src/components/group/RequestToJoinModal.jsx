import React, { useState } from "react";
import { Lock, X, Send } from "lucide-react";
import toast from "react-hot-toast";
import groupApi from "../../services/groupApi";

const RequestToJoinModal = ({ isOpen, onClose, group, onSuccess }) => {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !group) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await groupApi.requestToJoin(group.id, { message: message.trim() });
      toast.success("Join request sent to group admins!");
      onClose();
      onSuccess && onSuccess();
    } catch (err) {
      console.error("Request to join error:", err);
      const msg =
        err?.response?.data?.message ||
        "Failed to send request. You may already have a pending request.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-card border border-border w-full max-w-md rounded-3xl shadow-2xl p-6 sm:p-7 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Lock size={22} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground">
              Request to Join
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {group.name}
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-4">
          This group is private. Send an optional note explaining why you'd like
          to collaborate in this study circle.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Personal Note (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Hey! I'm preparing for FAANG interviews and practicing dynamic programming daily."
              rows={3}
              maxLength={500}
              className="w-full bg-accent/40 border border-border focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] outline-none rounded-xl px-4 py-2.5 text-xs text-foreground transition-all resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#7c3aed] hover:bg-[#6d28d9] text-white transition-all shadow-md shadow-[#7c3aed]/20 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send size={13} />
                  <span>Send Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestToJoinModal;
