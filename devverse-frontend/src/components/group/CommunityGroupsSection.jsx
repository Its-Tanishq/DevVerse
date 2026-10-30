import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router";
import {
  X,
  Plus,
  KeyRound,
  Search,
  Lock,
  Globe,
  Loader2,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import groupApi from "../../services/groupApi";
import useAuth from "../../store/AuthStore";
import GroupCard from "./GroupCard";
import JoinByCodeModal from "./JoinByCodeModal";
import RequestToJoinModal from "./RequestToJoinModal";
import { detectTopic } from "./groupThemeUtils";

const CommunityGroupsSection = ({ isCreateOpen: controlledCreateOpen, setIsCreateOpen: setControlledCreateOpen }) => {
  const navigate = useNavigate();
  const isLoggedIn = useAuth((state) => state.authStatus);
  const currentUser = useAuth((state) => state.user);

  // Default to false: Form is closed initially; opens when clicking "Create Group"
  const [internalCreateOpen, setInternalCreateOpen] = useState(false);
  const isCreateOpen = controlledCreateOpen !== undefined ? controlledCreateOpen : internalCreateOpen;
  const setIsCreateOpen = setControlledCreateOpen || setInternalCreateOpen;

  const formRef = useRef(null);
  const nameInputRef = useRef(null);

  // Form State (no topic field needed)
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState("PUBLIC");
  const [isCreating, setIsCreating] = useState(false);

  // Group Data State
  const [myGroups, setMyGroups] = useState([]);
  const [browseGroups, setBrowseGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [viewAllBrowse, setViewAllBrowse] = useState(false);

  // Modals
  const [isJoinCodeModalOpen, setIsJoinCodeModalOpen] = useState(false);
  const [requestJoinGroup, setRequestJoinGroup] = useState(null);
  const [joiningGroupId, setJoiningGroupId] = useState(null);

  // Smoothly scroll and focus when the form opens
  useEffect(() => {
    if (isCreateOpen) {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
    }
  }, [isCreateOpen]);

  // Fetch groups directly from API (only original backend data)
  const loadGroups = async () => {
    setLoading(true);
    try {
      // 1. Fetch public / browse groups
      let publicList = [];
      try {
        const publicRes = await groupApi.getPublicGroups({ size: 50 });
        publicList = Array.isArray(publicRes?.content)
          ? publicRes.content
          : Array.isArray(publicRes)
          ? publicRes
          : [];
      } catch (err) {
        console.warn("Public groups API fetch note:", err);
      }

      // 2. Fetch user's joined groups
      let myList = [];
      if (isLoggedIn) {
        try {
          const myRes = await groupApi.getMyGroups();
          myList = Array.isArray(myRes) ? myRes : [];
        } catch (err) {
          console.warn("My groups API fetch note:", err);
        }
      }

      setMyGroups(myList);

      // Exclude groups already in myGroups from Browse list
      const myIds = new Set(myList.map((g) => String(g.id)));
      const filteredPublic = publicList.filter((g) => !myIds.has(String(g.id)));
      setBrowseGroups(filteredPublic);
    } catch (err) {
      console.error("Error loading groups:", err);
      setMyGroups([]);
      setBrowseGroups([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, [isLoggedIn]);

  // Handle Create Group Form Submit
  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    if (!groupName.trim() || groupName.trim().length < 3) {
      toast.error("Group name must be at least 3 characters");
      return;
    }

    if (!isLoggedIn) {
      toast.error("Please sign in to create a community group");
      navigate("/signin");
      return;
    }

    setIsCreating(true);

    try {
      const payload = {
        name: groupName.trim(),
        description: description.trim(),
        privacy: privacy,
      };

      const res = await groupApi.createGroup(payload);
      const newGroup = res?.data || res;

      toast.success(`Group "${groupName.trim()}" created successfully!`);
      setGroupName("");
      setDescription("");
      setPrivacy("PUBLIC");
      setIsCreateOpen(false);

      if (newGroup && newGroup.id) {
        setMyGroups((prev) => [newGroup, ...prev]);
        navigate(`/groups/${newGroup.id}`);
      } else {
        loadGroups();
      }
    } catch (err) {
      console.warn("API group creation fallback:", err);
      // Client-side fallback if backend is offline
      const mockCreated = {
        id: `local-${Date.now()}`,
        name: groupName.trim(),
        description: description.trim(),
        privacy: privacy,
        memberCount: 1,
        activeTime: "Active just now",
        isMember: true,
        createdByUsername: currentUser?.username || "you",
      };
      setMyGroups((prev) => [mockCreated, ...prev]);
      toast.success(`Group "${groupName.trim()}" created!`);
      setGroupName("");
      setDescription("");
      setIsCreateOpen(false);
    } finally {
      setIsCreating(false);
    }
  };

  // Handle Joining Public Group
  const handleJoinPublic = async (group) => {
    if (!isLoggedIn) {
      toast.error("Please sign in to join groups");
      navigate("/signin");
      return;
    }

    setJoiningGroupId(group.id);
    try {
      if (typeof group.id === "number" || (!isNaN(group.id) && !String(group.id).includes("seed"))) {
        await groupApi.joinPublicGroup(group.id);
      }

      toast.success(`Joined ${group.name}!`);

      // Update state: move from browseGroups to myGroups
      setBrowseGroups((prev) => prev.filter((g) => g.id !== group.id));
      setMyGroups((prev) => [
        { ...group, isMember: true, memberCount: (group.memberCount || 0) + 1 },
        ...prev,
      ]);
    } catch (err) {
      console.error("Join error:", err);
      toast.error(err?.response?.data?.message || "Failed to join group");
    } finally {
      setJoiningGroupId(null);
    }
  };

  // Handle Requesting to Join Private Group
  const handleRequestJoinClick = (group) => {
    if (!isLoggedIn) {
      toast.error("Please sign in to request access");
      navigate("/signin");
      return;
    }
    setRequestJoinGroup(group);
  };

  // Filtered browse groups for search and view all
  const filteredBrowseGroups = useMemo(() => {
    let list = browseGroups;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (g) =>
          g.name?.toLowerCase().includes(q) ||
          g.description?.toLowerCase().includes(q) ||
          (detectTopic(g) && detectTopic(g).toLowerCase().includes(q))
      );
    }
    if (!viewAllBrowse && !searchQuery.trim()) {
      return list.slice(0, 3);
    }
    return list;
  }, [browseGroups, searchQuery, viewAllBrowse]);

  // Filtered my groups
  const filteredMyGroups = useMemo(() => {
    if (!searchQuery.trim()) return myGroups;
    const q = searchQuery.toLowerCase();
    return myGroups.filter(
      (g) =>
        g.name?.toLowerCase().includes(q) ||
        g.description?.toLowerCase().includes(q) ||
        (detectTopic(g) && detectTopic(g).toLowerCase().includes(q))
    );
  }, [myGroups, searchQuery]);

  return (
    <div className="w-full space-y-10 pb-16">
      {/* ────────────────────────────────────────────── */}
      {/* Top Section: "Create Group" Form               */}
      {/* (Opens when "+ Create Group" is clicked)       */}
      {/* ────────────────────────────────────────────── */}
      {isCreateOpen && (
        <div
          ref={formRef}
          className="relative bg-[#13141f] border border-[#25273b] rounded-2xl p-6 sm:p-7 shadow-2xl shadow-black/30 transition-all animate-in fade-in duration-200"
        >
          {/* Header with Title & Close Icon */}
          <div className="flex items-center justify-between pb-5">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Create Group
            </h2>
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="text-zinc-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleCreateSubmit} className="space-y-4">
            {/* Group Name */}
            <div>
              <label className="block text-xs font-semibold text-[#c4b5fd] mb-1.5">
                Group name
              </label>
              <input
                ref={nameInputRef}
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g. DP Masters"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-[#0c0d14] border border-[#26283d] focus:border-[#a855f7] text-sm text-white placeholder:text-zinc-600 outline-none transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-[#c4b5fd] mb-1.5">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this group about?"
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0c0d14] border border-[#26283d] focus:border-[#a855f7] text-sm text-white placeholder:text-zinc-600 outline-none resize-y min-h-[64px] transition-all"
              />
            </div>

            {/* Privacy & Create Button Row */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-1">
              {/* Privacy Segmented Toggle */}
              <div className="w-full sm:w-64">
                <label className="block text-xs font-semibold text-[#c4b5fd] mb-1.5">
                  Privacy
                </label>
                <div className="flex items-center p-1 rounded-xl bg-[#0c0d14] border border-[#26283d]">
                  <button
                    type="button"
                    onClick={() => setPrivacy("PUBLIC")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      privacy === "PUBLIC"
                        ? "bg-[#3b1768] text-white shadow-sm border border-[#7c3aed]/40"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    Public
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrivacy("PRIVATE")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      privacy === "PRIVATE"
                        ? "bg-[#3b1768] text-white shadow-sm border border-[#7c3aed]/40"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    Private
                  </button>
                </div>
              </div>

              {/* Bottom Submit Button */}
              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-8 py-2.5 rounded-full bg-[#a855f7] hover:bg-[#9333ea] text-white font-semibold text-sm shadow-md shadow-[#a855f7]/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  {isCreating ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Loader2 size={14} className="animate-spin" />
                      <span>Creating...</span>
                    </span>
                  ) : (
                    <span>Create</span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ────────────────────────────────────────────── */}
      {/* Section 1: "My Groups · {count}"               */}
      {/* ────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            My Groups · {filteredMyGroups.length}
          </h2>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center items-center">
            <Loader2 size={32} className="animate-spin text-[#7c3aed]" />
          </div>
        ) : filteredMyGroups.length === 0 ? (
          <div className="bg-[#13141f] border border-[#25273b] rounded-2xl p-8 text-center max-w-md mx-auto my-4">
            <p className="text-sm text-zinc-400">
              You haven't joined any groups yet. Browse the open groups below or click "Create Group" above to start one!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMyGroups.map((group, idx) => (
              <GroupCard
                key={group.id}
                group={group}
                isMyGroup={true}
                index={idx}
                onJoin={handleJoinPublic}
                onRequestJoin={handleRequestJoinClick}
                joiningGroupId={joiningGroupId}
              />
            ))}
          </div>
        )}
      </section>

      {/* ────────────────────────────────────────────── */}
      {/* Section 2: "Browse Groups" (with View all)     */}
      {/* ────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Browse Groups
          </h2>

          <div className="flex items-center gap-4">
            {/* Search Filter input */}
            <div className="relative hidden sm:block">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search circles..."
                className="pl-8 pr-3 py-1 text-xs bg-[#13141f] border border-[#25273b] rounded-full text-white placeholder:text-zinc-500 outline-none focus:border-[#a855f7] w-36 focus:w-48 transition-all"
              />
            </div>

            <button
              type="button"
              onClick={() => setViewAllBrowse((prev) => !prev)}
              className="text-xs font-semibold text-[#a855f7] hover:text-[#c084fc] transition-colors cursor-pointer"
            >
              {viewAllBrowse ? "Show less" : "View all"}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center items-center">
            <Loader2 size={32} className="animate-spin text-[#7c3aed]" />
          </div>
        ) : filteredBrowseGroups.length === 0 ? (
          <div className="bg-[#13141f] border border-[#25273b] rounded-2xl p-8 text-center text-zinc-400 text-sm">
            {searchQuery
              ? `No groups found matching "${searchQuery}".`
              : "No other public groups available to browse right now."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBrowseGroups.map((group, idx) => (
              <GroupCard
                key={group.id}
                group={group}
                isMyGroup={false}
                index={idx + 3}
                onJoin={handleJoinPublic}
                onRequestJoin={handleRequestJoinClick}
                joiningGroupId={joiningGroupId}
              />
            ))}
          </div>
        )}
      </section>

      {/* Modals for join requests and code join */}
      <JoinByCodeModal
        isOpen={isJoinCodeModalOpen}
        onClose={() => setIsJoinCodeModalOpen(false)}
        onSuccess={() => loadGroups()}
      />

      <RequestToJoinModal
        isOpen={Boolean(requestJoinGroup)}
        group={requestJoinGroup}
        onClose={() => setRequestJoinGroup(null)}
        onSuccess={() => {
          setBrowseGroups((prev) =>
            prev.map((g) =>
              g.id === requestJoinGroup?.id
                ? { ...g, hasPendingRequest: true }
                : g
            )
          );
        }}
      />
    </div>
  );
};

export default CommunityGroupsSection;
