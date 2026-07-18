import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Activity, Award, Code2, Flame, RefreshCw, ExternalLink, Edit2, Save, X 
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./icons";
import apiClient from "../../../config/ApiClient";

export default function UserOverviewTab({
  user,
  submissions = [],
  loadingSubmissions = false,
  acceptedSubmissions = 0,
  totalSubmissions = 0,
  acceptanceRate = 0,
  onTabChange,
  onUpdateUser
}) {
  const [problemStats, setProblemStats] = useState({ EASY: 0, MEDIUM: 0, HARD: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const targetId = user?.id || user?.ID;
      if (!targetId) return;
      try {
        const res = await apiClient.get(`/admin/user/${targetId}/problem-stats`);
        if (res.data?.data) {
          setProblemStats(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch problem stats", err);
      }
    };
    fetchStats();
  }, [user]);

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editBioContent, setEditBioContent] = useState("");

  const handleSaveBio = () => {
    if (onUpdateUser) {
      onUpdateUser({ bio: editBioContent });
    }
    setIsEditingBio(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      {/* Left Column: Stats & Performance */}
      <div className="lg:col-span-2 space-y-6">
        {/* 4-card metric grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">XP Points</span>
              <Activity size={16} className="text-blue-500" />
            </div>
            <div className="text-2xl font-black text-foreground">
              {(user.xpPoint || 0).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Level {user.level || 1}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Solved</span>
              <Award size={16} className="text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-foreground">
              {acceptedSubmissions}
            </div>
            <div className="text-xs text-muted-foreground mt-1 flex gap-2">
              <span className="text-green-500">{problemStats.EASY} E</span>
              <span className="text-yellow-500">{problemStats.MEDIUM} M</span>
              <span className="text-red-500">{problemStats.HARD} H</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Accept Rate</span>
              <Code2 size={16} className="text-purple-500" />
            </div>
            <div className="text-2xl font-black text-foreground">
              {acceptanceRate}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">Overall accuracy</div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Streak</span>
              <Flame size={16} className="text-orange-500" />
            </div>
            <div className="text-2xl font-black text-foreground">
              {user.streak || 0} <span className="text-sm font-normal text-muted-foreground">days</span>
            </div>
            <div className="text-xs text-orange-500/80 font-medium mt-1 flex items-center gap-1">
              <Flame size={12} className="fill-orange-500" /> Active streak
            </div>
          </div>
        </div>

        {/* User Bio Card */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-3 relative group">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">About & Bio</h3>
            {!isEditingBio ? (
              <button 
                onClick={() => {
                  setEditBioContent(user.bio || "");
                  setIsEditingBio(true);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground"
                title="Edit Bio"
              >
                <Edit2 size={14} />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsEditingBio(false)}
                  className="p-1.5 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground"
                >
                  <X size={14} />
                </button>
                <button 
                  onClick={handleSaveBio}
                  className="p-1.5 bg-[#7c3aed]/10 text-[#7c3aed] hover:bg-[#7c3aed]/20 rounded-lg flex items-center gap-1 text-xs font-bold"
                >
                  <Save size={14} /> Save
                </button>
              </div>
            )}
          </div>
          
          {isEditingBio ? (
            <textarea
              value={editBioContent}
              onChange={(e) => setEditBioContent(e.target.value)}
              placeholder="Enter user bio..."
              className="w-full min-h-[100px] p-3 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/50 resize-none"
              autoFocus
            />
          ) : user.bio ? (
            <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap bg-accent/30 p-4 rounded-xl border border-border/50">
              {user.bio}
            </p>
          ) : (
            <div className="text-sm text-muted-foreground italic bg-accent/20 p-4 rounded-xl border border-border/40">
              No bio description provided by this user yet.
            </div>
          )}
        </div>

        {/* Recent Submissions Preview */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Recent Submissions</h3>
            {totalSubmissions > 0 && (
              <button 
                onClick={() => onTabChange && onTabChange("submissions")} 
                className="text-xs font-bold text-[#7c3aed] hover:underline flex items-center gap-1"
              >
                View All ({totalSubmissions}) <ExternalLink size={12} />
              </button>
            )}
          </div>

          {loadingSubmissions ? (
            <div className="py-8 flex items-center justify-center text-muted-foreground gap-2 text-sm">
              <RefreshCw size={16} className="animate-spin" /> Fetching submissions...
            </div>
          ) : submissions.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-sm">
              No problem submissions recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
              {submissions.slice(0, 5).map((sub) => (
                <div key={sub.id || sub.ID} className="p-3.5 bg-card hover:bg-accent/40 transition-colors flex items-center justify-between gap-4 text-sm">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${
                      sub.status === 'ACCEPTED' || sub.status === 'Accepted' ? 'bg-emerald-500' : 'bg-red-500'
                    }`}></span>
                    <span className="font-semibold text-foreground">
                      Problem #{sub.problemsId}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-accent text-muted-foreground font-mono uppercase">
                      {sub.language}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className={sub.status === 'ACCEPTED' || sub.status === 'Accepted' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-red-500 font-medium'}>
                      {sub.status}
                    </span>
                    <span>{new Date(sub.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Account Meta & Quick Details */}
      <div className="space-y-6">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Account Information</h3>
          <div className="space-y-3 text-sm divide-y divide-border/50">
            <div className="flex items-center justify-between pt-2 first:pt-0">
              <span className="text-muted-foreground">Provider</span>
              <span className="font-semibold text-foreground uppercase tracking-wide px-2 py-0.5 rounded bg-accent text-xs">
                {user.provider || "LOCAL"}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2.5">
              <span className="text-muted-foreground">Assigned Role</span>
              <span className={`font-bold text-xs px-2 py-0.5 rounded ${
                user.role === 'ADMIN' ? 'bg-[#7c3aed]/10 text-[#7c3aed]' : 'bg-accent text-foreground'
              }`}>
                {user.role || "USER"}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2.5">
              <span className="text-muted-foreground">Subscription</span>
              <span className={`font-bold text-xs px-2 py-0.5 rounded ${
                user.isPremium ? 'bg-amber-500/10 text-amber-600' : 'bg-accent text-muted-foreground'
              }`}>
                {user.isPremium ? "PREMIUM PLAN" : "FREE TIER"}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2.5">
              <span className="text-muted-foreground">Account Status</span>
              <span className={`font-bold text-xs px-2 py-0.5 rounded ${
                user.isBanned || user.isEnabled === false ? 'bg-red-500/10 text-red-600' : 'bg-emerald-500/10 text-emerald-600'
              }`}>
                {user.isBanned || user.isEnabled === false ? "BANNED / RESTRICTED" : "ACTIVE"}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2.5">
              <span className="text-muted-foreground">Registered</span>
              <span className="font-medium text-foreground text-xs">
                {new Date(user.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Connected Accounts Snapshot */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Social Linkages</h3>
          {user.connections && Object.keys(user.connections).length > 0 ? (
            <div className="space-y-3">
              {user.connections.GITHUB && (
                <a 
                  href={`https://github.com/${user.connections.GITHUB}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-accent/40 hover:bg-accent transition-colors text-sm group"
                >
                  <div className="flex items-center gap-2.5">
                    <GithubIcon size={16} />
                    <span className="font-medium text-foreground">github/{user.connections.GITHUB}</span>
                  </div>
                  <ExternalLink size={14} className="text-muted-foreground group-hover:text-foreground" />
                </a>
              )}
              {user.connections.LINKEDIN && (
                <a 
                  href={`https://linkedin.com/in/${user.connections.LINKEDIN}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-accent/40 hover:bg-accent transition-colors text-sm group"
                >
                  <div className="flex items-center gap-2.5 text-[#0A66C2]">
                    <LinkedinIcon size={16} />
                    <span className="font-medium text-foreground">in/{user.connections.LINKEDIN}</span>
                  </div>
                  <ExternalLink size={14} className="text-muted-foreground group-hover:text-foreground" />
                </a>
              )}
            </div>
          ) : (
            <div className="text-xs text-muted-foreground text-center py-4 bg-accent/20 rounded-xl">
              No third-party developer connections attached.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
