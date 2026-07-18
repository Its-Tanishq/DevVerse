import React from "react";
import { motion } from "framer-motion";
import { 
  Shield, Star, Ban, CheckCircle2, Trash2, Mail, Calendar, Clock, User
} from "lucide-react";

export default function UserHeroHeader({
  user,
  id,
  onUpdateUser
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
              <div className="relative group">
                <img
                  src={user.profilePic}
                  alt={user.actualUsername}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-md ring-4 ring-background border border-border"
                />
                <button
                  onClick={() => onUpdateUser && window.confirm("Reset this user's avatar to default?") && onUpdateUser({ profilePic: null })}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center text-white text-xs font-bold"
                >
                  Reset Avatar
                </button>
              </div>
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-accent text-foreground flex items-center justify-center shadow-md ring-4 ring-background border border-border">
                <User size={40} />
              </div>
            )}

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
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
