import React, { useState } from "react";
import { UserPlus, X, Send } from "lucide-react";
import toast from "react-hot-toast";
import groupApi from "../../services/groupApi";

const InviteMemberModal = ({ isOpen, onClose, groupId, onSuccess }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanInput = usernameOrEmail.trim();
    if (!cleanInput) {
      toast.error("Please enter a username or email");
      return;
    }

    setSubmitting(true);
    try {
      await groupApi.inviteUser(groupId, { usernameOrEmail: cleanInput });
      toast.success(`User '${cleanInput}' added to the group!`);
      setUsernameOrEmail("");
      onClose();
      onSuccess && onSuccess();
    } catch (err) {
      console.error("Invite user error:", err);
      const msg =
        err?.response?.data?.message ||
        "Could not invite user. Check the username/email and try again.";
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
            <UserPlus size={22} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground">Invite Member</h3>
            <p className="text-xs text-muted-foreground">
              Add a developer directly to this study group.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Username or Email
            </label>
            <input
              type="text"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              placeholder="e.g. johndoe or john@example.com"
              required
              autoFocus
              className="w-full bg-accent/40 border border-border focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] outline-none rounded-2xl py-3 px-4 text-sm text-foreground transition-all"
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
              disabled={submitting || !usernameOrEmail.trim()}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#7c3aed] hover:bg-[#6d28d9] text-white transition-all shadow-md shadow-[#7c3aed]/20 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Send size={13} />
                  <span>Add Member</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteMemberModal;
