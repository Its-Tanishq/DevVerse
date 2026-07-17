import React from "react";
import { motion } from "framer-motion";
import { 
  Shield, Star, Ban, CheckCircle2, Trash2, Mail, Calendar, Clock 
} from "lucide-react";

export default function UserHeroHeader({
  user,
  id,
  actionLoading,
  onTogglePremium,
  onToggleRole,
  onToggleBan,
  onDeleteAccount
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden"
    >
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#7c3aed]/10 via-pink-500/5 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      <div className="relative z-10 space-y-6">
        {/* User Profile & Identity Details */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="relative">
            {user.profilePic ? (
              <img
                src={user.profilePic}
                alt={user.actualUsername}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-md ring-4 ring-background border border-border"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 text-white flex items-center justify-center text-3xl font-extrabold shadow-md ring-4 ring-background uppercase">
                {user.actualUsername ? user.actualUsername[0] : (user.username ? user.username[0] : "U")}
              </div>
            )}
            {/* Online Indicator */}
            <div 
              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-card flex items-center justify-center ${
                new Date(user.lastActive) > new Date(Date.now() - 3600000) ? 'bg-emerald-500' : 'bg-gray-400 dark:bg-gray-600'
              }`}
              title={new Date(user.lastActive) > new Date(Date.now() - 3600000) ? 'Online recently' : 'Offline'}
            ></div>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {user.actualUsername || user.username}
              </h1>
              {user.role === "ADMIN" && (
                <span className="bg-[#7c3aed]/10 border border-[#7c3aed]/30 text-[#7c3aed] px-2.5 py-0.5 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                  <Shield size={12} /> Admin
                </span>
              )}
              {user.isPremium ? (
                <span className="bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                  <Star size={12} className="fill-amber-500" /> Premium
                </span>
              ) : (
                <span className="bg-accent text-muted-foreground px-2.5 py-0.5 rounded-full text-xs font-medium uppercase">
                  Free Tier
                </span>
              )}
              {user.isBanned || user.isEnabled === false ? (
                <span className="bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                  <Ban size={12} /> Banned
                </span>
              ) : (
                <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                  <CheckCircle2 size={12} /> Active
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Mail size={14} className="text-muted-foreground/70" />
                {user.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-muted-foreground/70" />
                Joined {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-muted-foreground/70" />
                Last seen {new Date(user.lastActive || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Toolbar Divider & Buttons */}
        <div className="border-t border-border/70 pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-extrabold text-muted-foreground uppercase tracking-wider">
            <Shield size={14} className="text-[#7c3aed]" /> Quick Admin Controls
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-3">
            <button
              onClick={onTogglePremium}
              disabled={actionLoading === 'premium'}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
                user.isPremium 
                  ? 'bg-card hover:bg-accent border border-amber-500/30 text-amber-600 dark:text-amber-400' 
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white hover:shadow-md'
              }`}
            >
              <Star size={14} className={user.isPremium ? 'fill-amber-500' : ''} />
              <span>{user.isPremium ? 'Remove Premium' : 'Make Premium'}</span>
            </button>

            <button
              onClick={onToggleRole}
              disabled={actionLoading === 'role'}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
                user.role === 'ADMIN'
                  ? 'bg-card hover:bg-accent border border-indigo-500/30 text-indigo-500'
                  : 'bg-card hover:bg-accent border border-border text-foreground hover:border-[#7c3aed]/40'
              }`}
            >
              <Shield size={14} className="text-indigo-500" />
              <span>{user.role === 'ADMIN' ? 'Demote to User' : 'Promote to Admin'}</span>
            </button>

            <button
              onClick={onToggleBan}
              disabled={actionLoading === 'ban'}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
                user.isBanned || user.isEnabled === false
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white hover:shadow-md' 
                  : 'bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-400'
              }`}
            >
              {user.isBanned || user.isEnabled === false ? <CheckCircle2 size={14} /> : <Ban size={14} />}
              <span>{user.isBanned || user.isEnabled === false ? 'Unban User' : 'Ban User'}</span>
            </button>

            <button
              onClick={onDeleteAccount}
              disabled={actionLoading === 'delete'}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-600 dark:text-red-400 flex items-center justify-center gap-2 transition-all shadow-sm"
              title="Delete Account"
            >
              <Trash2 size={14} />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
