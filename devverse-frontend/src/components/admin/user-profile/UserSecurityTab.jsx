import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, AlertTriangle, History, RefreshCw } from "lucide-react";
import apiClient from "../../../config/ApiClient";

export default function UserSecurityTab({
  user,
  id,
  onToggleBan,
  onTogglePremium,
  onDeleteAccount,
  onRevokeSessions
}) {
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const targetId = user?.id || user?.ID || id;
      if (!targetId) return;
      try {
        setLoadingLogs(true);
        const res = await apiClient.get(`/admin/activity/USER/${targetId}`);
        if (res.data?.data) {
          setLogs(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch user activity logs", err);
      } finally {
        setLoadingLogs(false);
      }
    };
    fetchLogs();
  }, [user, id]);

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
              <div className="font-semibold text-foreground">Premium Account Status</div>
              <div className="text-xs text-muted-foreground mt-0.5">Toggle premium tier access for this user</div>
            </div>
            <button
              onClick={onTogglePremium}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                user.isPremium
                  ? 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border border-amber-500/30'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm hover:from-amber-600 hover:to-orange-600'
              }`}
            >
              {user.isPremium ? 'Remove Premium' : 'Make Premium'}
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-accent/30 border border-border">
            <div>
              <div className="font-semibold text-foreground">Active Sessions</div>
              <div className="text-xs text-muted-foreground mt-0.5">Revoke all active tokens and force logout</div>
            </div>
            <button
              onClick={onRevokeSessions}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 transition-all border border-orange-500/30"
            >
              Revoke Sessions
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-red-500/5 border border-red-500/20">
            <div>
              <div className="font-semibold text-red-500">Danger Zone: Delete Account</div>
              <div className="text-xs text-muted-foreground mt-0.5">Permanently remove this user and all data</div>
            </div>
            <button
              onClick={onDeleteAccount}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-600 transition-all border border-red-500/30"
            >
              Delete Account
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
            <span className="font-mono text-xs text-foreground">{new Date(user.updatedAt || Date.now()).toUTCString()}</span>
          </div>
          <div className="flex justify-between pt-3">
            <span className="text-muted-foreground">Auth Origin</span>
            <span className="font-semibold text-xs px-2 py-0.5 rounded bg-accent text-foreground uppercase">{user.provider || "LOCAL"}</span>
          </div>
        </div>
      </div>

      {/* Admin Action Audit Trail */}
      <div className="md:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl">
            <History size={20} />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Admin Activity Logs</h3>
            <p className="text-xs text-muted-foreground">History of administrative actions performed on this user</p>
          </div>
        </div>

        {loadingLogs ? (
          <div className="flex flex-col items-center justify-center py-8">
            <RefreshCw size={24} className="animate-spin text-[#7c3aed] mb-2" />
            <p className="text-sm text-muted-foreground">Loading audit trail...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground italic bg-accent/20 rounded-xl border border-border/40">
            No administrative actions recorded for this user.
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id || log.ID} className="flex gap-4 p-4 rounded-xl bg-accent/30 border border-border hover:bg-accent/40 transition-colors">
                <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                  log.severity === 'CRITICAL' ? 'bg-red-500' :
                  log.severity === 'WARNING' ? 'bg-orange-500' :
                  log.severity === 'INFO' ? 'bg-blue-500' : 'bg-green-500'
                }`} />
                <div className="flex-1 space-y-1">
                  <p className="text-sm text-foreground">{log.action}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>By: {log.performedBy || 'System'}</span>
                    <span className="font-mono">{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
