import React from "react";
import { motion } from "framer-motion";
import { Lock, AlertTriangle } from "lucide-react";

export default function UserSecurityTab({
  user,
  id,
  onToggleBan,
  onToggleRole
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl">
            <Lock size={20} />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Account Access Controls</h3>
            <p className="text-xs text-muted-foreground">Manage administrative privileges & login constraints</p>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-accent/30 border border-border">
            <div>
              <div className="font-semibold text-foreground">Banned / Suspended Status</div>
              <div className="text-xs text-muted-foreground mt-0.5">When banned, user cannot log in or submit code</div>
            </div>
            <button
              onClick={onToggleBan}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                user.isBanned || user.isEnabled === false
                  ? 'bg-emerald-500 text-white'
                  : 'bg-red-500/10 text-red-600 hover:bg-red-500/20'
              }`}
            >
              {user.isBanned || user.isEnabled === false ? 'Unban User' : 'Ban User'}
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-accent/30 border border-border">
            <div>
              <div className="font-semibold text-foreground">Administrative Role</div>
              <div className="text-xs text-muted-foreground mt-0.5">Admin users have complete platform access</div>
            </div>
            <button
              onClick={onToggleRole}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-card border border-border hover:bg-accent text-foreground transition-all"
            >
              {user.role === 'ADMIN' ? 'Revoke Admin' : 'Grant Admin'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Audit Information</h3>
            <p className="text-xs text-muted-foreground">Metadata and system audit trail</p>
          </div>
        </div>

        <div className="space-y-3 text-sm divide-y divide-border/50">
          <div className="flex justify-between pt-2 first:pt-0">
            <span className="text-muted-foreground">Internal Database ID</span>
            <span className="font-mono font-semibold text-foreground">#{user.id || user.ID || id}</span>
          </div>
          <div className="flex justify-between pt-3">
            <span className="text-muted-foreground">Registration Timestamp</span>
            <span className="font-mono text-xs text-foreground">{new Date(user.createdAt || Date.now()).toUTCString()}</span>
          </div>
          <div className="flex justify-between pt-3">
            <span className="text-muted-foreground">Last Account Update</span>
            <span className="font-mono text-xs text-foreground">{new Date(user.updatedAt || user.lastActive || Date.now()).toUTCString()}</span>
          </div>
          <div className="flex justify-between pt-3">
            <span className="text-muted-foreground">Auth Origin</span>
            <span className="font-semibold text-xs px-2 py-0.5 rounded bg-accent text-foreground uppercase">{user.provider || "LOCAL"}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
