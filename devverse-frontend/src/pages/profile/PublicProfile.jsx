import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Users,
  UserCheck,
  Shield,
  Star,
  Award,
  Flame,
  Activity,
  Code2,
  Calendar,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  Sparkles,
  Edit3,
  Loader2,
  Search
} from "lucide-react";
import apiClient from "@/config/ApiClient";
import useAuth from "@/store/AuthStore";
import FollowButton from "@/components/common/FollowButton";
import FollowListModal from "@/components/common/FollowListModal";

export default function PublicProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Follow counts and modal
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followModalOpen, setFollowModalOpen] = useState(false);
  const [followModalTab, setFollowModalTab] = useState("followers");

  // Submissions and stats
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // Active tab in public profile: 'overview' | 'submissions'
  const [activeTab, setActiveTab] = useState("overview");

  const currentUsername = currentUser?.actualUsername || currentUser?.username;
  const targetUsername = profileUser?.actualUsername || profileUser?.username || username;
  const isSelf = currentUsername && targetUsername && (currentUsername.toLowerCase() === targetUsername.toLowerCase());

  // Fetch user profile data
  useEffect(() => {
    if (!username) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    apiClient
      .get(`/user/username/${username}`)
      .then((res) => {
        if (!isMounted) return;
        if (res.data?.data) {
          const u = res.data.data;
          setProfileUser(u);
          const userId = u.id || u.ID;
          if (userId) {
            fetchSubmissions(userId);
          }
        } else {
          setError("User not found");
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Failed to fetch user profile:", err);
        setError("User not found or unavailable");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [username]);

  // Fetch follow counts
  const refreshFollowCounts = (uname) => {
    const nameToFetch = uname || targetUsername;
    if (!nameToFetch) return;

    apiClient
      .get(`/follow/${nameToFetch}/counts`)
      .then((res) => {
        if (res.data?.data) {
          setFollowerCount(res.data.data.followersCount || 0);
          setFollowingCount(res.data.data.followingCount || 0);
        }
      })
      .catch(() => {
        // Fallback to list endpoints
        Promise.all([
          apiClient.get(`/follow/${nameToFetch}/followers`).catch(() => ({ data: { data: [] } })),
          apiClient.get(`/follow/${nameToFetch}/following`).catch(() => ({ data: { data: [] } })),
        ]).then(([fRes, ingRes]) => {
          setFollowerCount(fRes.data?.data?.length || 0);
          setFollowingCount(ingRes.data?.data?.length || 0);
        });
      });
  };

  useEffect(() => {
    if (targetUsername) {
      refreshFollowCounts(targetUsername);
    }
  }, [targetUsername]);

  const fetchSubmissions = async (userId) => {
    try {
      setLoadingSubmissions(true);
      const res = await apiClient.get(`/problem/submission/user/${userId}`);
      if (res.data?.data) {
        setSubmissions(res.data.data);
      }
    } catch (err) {
      console.warn("Could not fetch user submissions:", err);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  // Compute stats
  const totalSubmissions = submissions.length;
  const acceptedSubmissions = submissions.filter(
    (s) => s.verdict === "ACCEPTED" || s.verdict === "CORRECT" || s.status === "ACCEPTED"
  );
  
  // Unique solved problems
  const uniqueSolvedProblemIds = new Set(
    acceptedSubmissions.map((s) => s.problemsId || s.problemId || s.problem?.id).filter(Boolean)
  );
  const solvedCount = uniqueSolvedProblemIds.size;
  const acceptanceRate = totalSubmissions > 0
    ? Math.round((acceptedSubmissions.length / totalSubmissions) * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="h-64 bg-card/60 animate-pulse rounded-3xl border border-border" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-48 bg-card/60 animate-pulse rounded-2xl border border-border" />
            <div className="h-48 bg-card/60 animate-pulse rounded-2xl border border-border" />
            <div className="h-48 bg-card/60 animate-pulse rounded-2xl border border-border" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-16 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-card border border-border rounded-3xl p-8 text-center shadow-xl space-y-5"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center">
            <User size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">User Not Found</h2>
            <p className="text-sm text-muted-foreground mt-1">
              The user &quot;@{username}&quot; could not be found or doesn&apos;t exist.
            </p>
          </div>
          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-accent hover:bg-accent/80 text-foreground transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft size={14} /> Go Back
            </button>
            <Link
              to="/problemset"
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white transition-colors"
            >
              Explore Problems
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const connections = profileUser.connections || {};

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb / Back button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group cursor-pointer"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
            Back
          </button>

          {isSelf && (
            <Link
              to="/profile"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-accent hover:bg-accent/80 text-foreground border border-border transition-colors"
            >
              <Edit3 size={13} />
              Edit My Settings
            </Link>
          )}
        </div>

        {/* HERO HEADER CARD */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#7c3aed]/15 via-pink-500/10 to-transparent rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
            
            {/* Left: Avatar & Identity Details */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="relative shrink-0">
                {profileUser.profilePic ? (
                  <img
                    src={profileUser.profilePic}
                    alt={targetUsername}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover shadow-md ring-4 ring-background border border-border"
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-accent text-foreground flex items-center justify-center shadow-md ring-4 ring-background border border-border">
                    <User size={48} className="text-muted-foreground" />
                  </div>
                )}
                
                {profileUser.isPremium && (
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white p-1.5 rounded-xl shadow-md border-2 border-background">
                    <Star size={14} className="fill-white" />
                  </div>
                )}
              </div>

              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                    {targetUsername}
                  </h1>

                  {profileUser.role === "ADMIN" && (
                    <span className="bg-[#7c3aed]/10 border border-[#7c3aed]/30 text-[#7c3aed] px-2.5 py-0.5 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                      <Shield size={12} /> Admin
                    </span>
                  )}
                  {profileUser.isPremium && (
                    <span className="bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                      <Star size={12} className="fill-amber-500" /> Pro
                    </span>
                  )}
                </div>

                {/* Bio */}
                <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
                  {profileUser.bio || "Passionate software developer on DevVerse."}
                </p>

                {/* Followers / Following interactive counter buttons */}
                <div className="flex items-center gap-4 pt-1">
                  <button
                    onClick={() => {
                      setFollowModalTab("followers");
                      setFollowModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group cursor-pointer"
                  >
                    <span className="font-bold text-foreground text-sm group-hover:text-[#7c3aed] transition-colors">
                      {followerCount}
                    </span>
                    <span>Followers</span>
                  </button>

                  <div className="w-1 h-1 rounded-full bg-border" />

                  <button
                    onClick={() => {
                      setFollowModalTab("following");
                      setFollowModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group cursor-pointer"
                  >
                    <span className="font-bold text-foreground text-sm group-hover:text-[#7c3aed] transition-colors">
                      {followingCount}
                    </span>
                    <span>Following</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Follow Action & Connections */}
            <div className="flex flex-col sm:items-end gap-4 shrink-0 pt-2 sm:pt-0">
              {isSelf ? (
                <Link
                  to="/profile"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2 text-xs font-semibold rounded-xl bg-accent hover:bg-accent/80 text-foreground border border-border shadow-sm transition-colors"
                >
                  <Edit3 size={14} />
                  Edit Profile
                </Link>
              ) : (
                <FollowButton
                  targetUsername={targetUsername}
                  size="md"
                  onFollowChange={(newStatus) => {
                    setFollowerCount((prev) => (newStatus ? prev + 1 : Math.max(0, prev - 1)));
                  }}
                />
              )}

              {/* Social links */}
              <div className="flex items-center gap-2">
                {connections.GITHUB && (
                  <a
                    href={`https://github.com/${connections.GITHUB}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-accent/40 border border-border hover:bg-accent hover:text-[#7c3aed] text-muted-foreground transition-colors"
                    title={`GitHub: @${connections.GITHUB}`}
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                  </a>
                )}

                {connections.LINKEDIN && (
                  <a
                    href={`https://linkedin.com/in/${connections.LINKEDIN}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-accent/40 border border-border hover:bg-accent hover:text-[#0A66C2] text-muted-foreground transition-colors"
                    title={`LinkedIn: ${connections.LINKEDIN}`}
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>

          </div>
        </motion.div>

        {/* 4 STATS CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Level</span>
              <Award size={16} className="text-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-foreground">
              {profileUser.level || 1}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              DevVerse ranking
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">XP Points</span>
              <Activity size={16} className="text-blue-500" />
            </div>
            <div className="text-2xl font-extrabold text-foreground">
              {(profileUser.xpPoint || 0).toLocaleString()}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Total earned XP
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Streak</span>
              <Flame size={16} className="text-orange-500" />
            </div>
            <div className="text-2xl font-extrabold text-foreground flex items-center gap-1.5">
              {profileUser.streak || 0} <span className="text-xs font-medium text-muted-foreground">days</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Active consistency
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Acceptance</span>
              <CheckCircle2 size={16} className="text-emerald-500" />
            </div>
            <div className="text-2xl font-extrabold text-foreground">
              {acceptanceRate}%
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {solvedCount} problems solved
            </p>
          </div>
        </div>

        {/* TABS: Overview & Activity */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                activeTab === "overview"
                  ? "bg-[#7c3aed] text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              Activity Overview
            </button>
            <button
              onClick={() => setActiveTab("submissions")}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "submissions"
                  ? "bg-[#7c3aed] text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              Recent Submissions
              <span className="px-1.5 py-0.2 bg-black/20 text-white/90 rounded-full text-[10px]">
                {submissions.length}
              </span>
            </button>
          </div>

          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Solved Summary Card */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                    <Code2 size={18} className="text-[#7c3aed]" />
                    Problem Solving Performance
                  </h3>
                  <span className="text-xs text-muted-foreground font-medium">
                    {totalSubmissions} submissions
                  </span>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Problems Solved</span>
                    <span className="font-bold text-foreground">{solvedCount}</span>
                  </div>
                  <div className="w-full h-2 bg-accent rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#7c3aed] rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (solvedCount / 50) * 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-muted-foreground">Accuracy Rate</span>
                    <span className="font-bold text-emerald-500">{acceptanceRate}%</span>
                  </div>
                  <div className="w-full h-2 bg-accent rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${acceptanceRate}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Developer Details Card */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                  <Sparkles size={18} className="text-amber-500" />
                  Developer Snapshot
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between py-2 border-b border-border/60">
                    <span className="text-muted-foreground">Handle</span>
                    <span className="font-semibold text-foreground">@{targetUsername}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border/60">
                    <span className="text-muted-foreground">Status</span>
                    <span className="text-emerald-500 font-semibold flex items-center gap-1">
                      <CheckCircle2 size={12} /> Active Developer
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-muted-foreground">Community Tier</span>
                    <span className="font-semibold text-foreground">
                      {profileUser.isPremium ? "Premium Pro" : "Standard Developer"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "submissions" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden"
            >
              {loadingSubmissions ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 size={24} className="animate-spin text-[#7c3aed]" />
                  <span className="text-xs">Loading activity...</span>
                </div>
              ) : submissions.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground text-xs space-y-2">
                  <Code2 size={24} className="mx-auto text-muted-foreground" />
                  <p>No public submissions recorded yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {submissions.slice(0, 15).map((sub) => {
                    const isAccepted = sub.verdict === "ACCEPTED" || sub.verdict === "CORRECT" || sub.status === "ACCEPTED";
                    return (
                      <div
                        key={sub.id || sub.ID}
                        className="p-4 flex items-center justify-between hover:bg-accent/20 transition-colors gap-4"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`p-2 rounded-xl shrink-0 ${
                            isAccepted ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                          }`}>
                            {isAccepted ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">
                              {sub.problemTitle || `Problem #${sub.problemsId || sub.problemId || "N/A"}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {sub.language || "code"} &bull; {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : "Recent"}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-2">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            isAccepted
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-red-500/10 text-red-600 dark:text-red-400"
                          }`}>
                            {sub.verdict || sub.status || "COMPLETED"}
                          </span>

                          {(sub.problemsId || sub.problemId) && (
                            <Link
                              to={`/problem/${sub.problemsId || sub.problemId}`}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                              title="View Problem"
                            >
                              <ExternalLink size={14} />
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Community Followers / Following Modal */}
        <FollowListModal
          isOpen={followModalOpen}
          onClose={() => {
            setFollowModalOpen(false);
            refreshFollowCounts(targetUsername);
          }}
          username={targetUsername}
          initialTab={followModalTab}
        />

      </div>
    </div>
  );
}
