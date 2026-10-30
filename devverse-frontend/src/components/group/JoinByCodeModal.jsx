import React, { useState } from "react";
import { KeyRound, X, ArrowRight, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import groupApi from "../../services/groupApi";

const JoinByCodeModal = ({ isOpen, onClose, onSuccess }) => {
  const [inviteCode, setInviteCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanCode = inviteCode.trim();
    if (!cleanCode) {
      toast.error("Please enter a valid invite code");
      return;
    }

    setSubmitting(true);
    try {
      const joinedGroup = await groupApi.joinByInviteCode(cleanCode);
      toast.success(
        `Successfully joined ${joinedGroup?.name || "study circle"}!`
      );
      onClose();
      if (onSuccess) {
        onSuccess(joinedGroup);
      }
      if (joinedGroup?.id) {
        navigate(`/groups/${joinedGroup.id}`);
      }
    } catch (err) {
      console.error("Invite code error:", err);
      const msg =
        err?.response?.data?.message ||
        "Invalid or expired invite code. Please verify and try again.";
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
          <div className="p-3 rounded-2xl bg-[#7c3aed]/10 text-[#7c3aed] border border-[#7c3aed]/20">
            <KeyRound size={22} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground">
              Join with Invite Code
            </h3>
            <p className="text-xs text-muted-foreground">
              Enter the 8-character code shared by a group admin.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Invite Code
            </label>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="e.g. A9B2C4D1"
              maxLength={20}
              autoFocus
              className="w-full text-center tracking-widest uppercase font-mono text-lg bg-accent/40 border border-border focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] outline-none rounded-2xl py-3 px-4 text-foreground transition-all"
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
              disabled={submitting || !inviteCode.trim()}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#7c3aed] hover:bg-[#6d28d9] text-white transition-all shadow-md shadow-[#7c3aed]/20 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Joining...</span>
                </>
              ) : (
                <>
                  <span>Join Group</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinByCodeModal;
