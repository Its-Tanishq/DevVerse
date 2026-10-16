import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Users, UserCheck, User, Loader2 } from "lucide-react";
import apiClient from "@/config/ApiClient";
import FollowButton from "@/components/common/FollowButton";

export default function FollowListModal({
  isOpen,
  onClose,
  username,
  initialTab = "followers",
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Sync tab if initialTab changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // Fetch list data whenever modal opens or target username changes
  useEffect(() => {
    if (!isOpen || !username) return;

    let isMounted = true;
    setLoading(true);

    Promise.all([
      apiClient
        .get(`/follow/${username}/followers`)
        .then((res) => res.data?.data || [])
        .catch(() => []),
      apiClient
        .get(`/follow/${username}/following`)
        .then((res) => res.data?.data || [])
        .catch(() => []),
    ])
      .then(([followersList, followingList]) => {
        if (isMounted) {
          setFollowers(followersList || []);
          setFollowing(followingList || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load follow lists:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, username]);

  if (typeof document === "undefined" || !isOpen) return null;

  const currentList = activeTab === "followers" ? followers : following;
  const filteredList = currentList.filter((item) => {
    const q = searchQuery.toLowerCase();
    const uname = (item.username || "").toLowerCase();
    const bio = (item.bio || "").toLowerCase();
    return uname.includes(q) || bio.includes(q);
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-border flex items-center justify-between bg-accent/20">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#7c3aed]/10 text-[#7c3aed] rounded-xl">
                  {activeTab === "followers" ? <Users size={18} /> : <UserCheck size={18} />}
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-base">
                    @{username}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Community connections
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Tab switchers */}
            <div className="grid grid-cols-2 border-b border-border p-1 bg-accent/10">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("followers");
                  setSearchQuery("");
                }}
                className={`py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  activeTab === "followers"
                    ? "bg-card text-foreground shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>Followers</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-accent text-foreground">
                  {followers.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("following");
                  setSearchQuery("");
                }}
                className={`py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  activeTab === "following"
                    ? "bg-card text-foreground shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>Following</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-accent text-foreground">
                  {following.length}
                </span>
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-colors"
                />
              </div>
            </div>

            {/* Users List Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[220px]">
              {loading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                  <Loader2 size={24} className="animate-spin text-[#7c3aed]" />
                  <span className="text-xs">Loading {activeTab}...</span>
                </div>
              ) : filteredList.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground text-xs space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-accent/50 flex items-center justify-center text-muted-foreground">
                    <Users size={20} />
                  </div>
                  {searchQuery ? (
                    <p>No {activeTab} matched &quot;{searchQuery}&quot;</p>
                  ) : activeTab === "followers" ? (
                    <p>@{username} has no followers yet</p>
                  ) : (
                    <p>@{username} is not following anyone yet</p>
                  )}
                </div>
              ) : (
                filteredList.map((item) => (
                  <div
                    key={item.username}
                    className="flex items-center justify-between p-3 rounded-2xl bg-accent/20 border border-border hover:bg-accent/40 transition-colors gap-3"
                  >
                    <Link
                      to={`/user/${item.username}`}
                      onClick={onClose}
                      className="flex items-center gap-3 min-w-0 group hover:opacity-90 transition-opacity"
                    >
                      {item.profilePic ? (
                        <img
                          src={item.profilePic}
                          alt={item.username}
                          className="w-10 h-10 rounded-full object-cover border border-border shrink-0 group-hover:ring-2 group-hover:ring-[#7c3aed] transition-all"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-accent border border-border flex items-center justify-center text-foreground shrink-0 group-hover:ring-2 group-hover:ring-[#7c3aed] transition-all">
                          <User size={18} />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-foreground group-hover:text-[#7c3aed] transition-colors truncate">
                          {item.username}
                        </h4>
                        {item.bio ? (
                          <p className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-[240px]">
                            {item.bio}
                          </p>
                        ) : (
                          <p className="text-xs text-muted-foreground/60">
                            DevVerse developer
                          </p>
                        )}
                      </div>
                    </Link>

                    <div className="shrink-0">
                      <FollowButton
                        targetUsername={item.username}
                        size="xs"
                        onFollowChange={() => {
                          // refresh count if viewing own profile
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
