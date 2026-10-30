import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  Users,
  Globe,
  Lock,
  Crown,
  ShieldCheck,
  Share2,
  Check,
  RefreshCw,
  Settings,
  Trash2,
  UserPlus,
  MessageSquare,
  MessageCircle,
  UserCheck,
  Loader2,
  ChevronLeft,
  KeyRound,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import groupApi from "../../services/groupApi";
import useAuth from "../../store/AuthStore";
import { cleanDescription, formatMemberCount } from "../../components/group/groupThemeUtils";
import GroupFeed from "../../components/group/GroupFeed";
import GroupMembersPreview from "../../components/group/GroupMembersPreview";
import GroupChat from "../../components/group/GroupChat";
import GroupMemberList from "../../components/group/GroupMemberList";
import GroupJoinRequests from "../../components/group/GroupJoinRequests";
import CreateGroupModal from "../../components/group/CreateGroupModal";
import InviteMemberModal from "../../components/group/InviteMemberModal";
import RequestToJoinModal from "../../components/group/RequestToJoinModal";
import JoinByCodeModal from "../../components/group/JoinByCodeModal";

const GroupDetail = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const isLoggedIn = useAuth((state) => state.authStatus);
  const currentUser = useAuth((state) => state.user);

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("feed"); // "feed" | "members" | "chat" | "requests"
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [regeneratingCode, setRegeneratingCode] = useState(false);
  const [leavingGroup, setLeavingGroup] = useState(false);

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isJoinCodeModalOpen, setIsJoinCodeModalOpen] = useState(false);
  const [joiningPublic, setJoiningPublic] = useState(false);

  const fetchGroupDetails = async () => {
    try {
      const data = await groupApi.getGroupById(groupId);
      setGroup(data);
    } catch (err) {
      console.error("Error loading group:", err);
      toast.error(
        err?.response?.data?.message || "Failed to load study circle"
      );
      navigate("/community?tab=groups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (groupId) {
      fetchGroupDetails();
    }
  }, [groupId]);

  const handleCopyInviteCode = () => {
    if (!group?.inviteCode) return;
    const inviteLink = `${window.location.origin}/groups/join/${group.inviteCode}`;
    navigator.clipboard.writeText(inviteLink);
    setCopiedInvite(true);
    toast.success("Invite link copied to clipboard!");
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  const handleRegenerateCode = async () => {
    if (!window.confirm("Regenerate invite code? Previous links will stop working."))
      return;

    setRegeneratingCode(true);
    try {
      const updated = await groupApi.regenerateInviteCode(groupId);
      setGroup((prev) => ({
        ...prev,
        inviteCode: updated?.inviteCode || prev.inviteCode,
      }));
      toast.success("New invite code generated!");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to regenerate invite code"
      );
    } finally {
      setRegeneratingCode(false);
    }
  };

  const handleLeaveGroup = async () => {
    if (!window.confirm("Are you sure you want to leave this study group?")) return;
    setLeavingGroup(true);
    try {
      await groupApi.leaveGroup(groupId);
      toast.success("You left the group");
      fetchGroupDetails();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to leave group");
    } finally {
      setLeavingGroup(false);
    }
  };

  const handleJoinPublic = async () => {
    if (!isLoggedIn) {
      toast.error("Please sign in to join");
      navigate("/signin");
      return;
    }

    setJoiningPublic(true);
    try {
      const updated = await groupApi.joinPublicGroup(groupId);
      toast.success(`You joined ${group.name}!`);
      setGroup(updated);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to join");
    } finally {
      setJoiningPublic(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this group? All posts, messages, and memberships will be lost."
      )
    )
      return;

    try {
      await groupApi.deleteGroup(groupId);
      toast.success("Group deleted successfully");
      navigate("/community?tab=groups");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete group");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-[#7c3aed]/20 rounded-full blur-xl animate-pulse" />
          <Loader2 className="relative animate-spin text-[#7c3aed]" size={40} />
        </div>
        <p className="text-sm text-muted-foreground font-medium">
          Loading study group...
        </p>
      </div>
    );
  }

  if (!group) return null;

  const isPublic = group.privacy === "PUBLIC";

  // Check creator / admin / member status
  const isCreator = Boolean(
    group.isCreator ||
      group.creator ||
      (currentUser &&
        ((group.createdById &&
          Number(group.createdById) === Number(currentUser.id || currentUser.ID)) ||
          (group.createdByUsername &&
            (currentUser.username || currentUser.actualUsername) &&
            group.createdByUsername.toLowerCase() ===
              (currentUser.actualUsername || currentUser.username).toLowerCase())))
  );

  const isAdmin = Boolean(group.isAdmin || group.admin || isCreator);
  const isMember = Boolean(group.isMember || group.member || isCreator || isAdmin);
  const isPending = Boolean(group.hasPendingRequest || group.pendingRequest || group.hasPendingJoinRequest);
  const initialLetter = (group.name || "G").charAt(0).toUpperCase();

  // If private group and user is not a member, show private barrier
  const isLockedPrivate = !isPublic && !isMember;

  // Available options only: Feed, Members, Chat, and Requests (if admin). NO Problems.
  const tabs = [
    { key: "feed", label: "Feed" },
    { key: "members", label: "Members" },
    { key: "chat", label: "Chat" },
    ...(isAdmin && !isPublic ? [{ key: "requests", label: "Requests" }] : []),
  ];

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Back button */}
      <Link
        to="/community?tab=groups"
        className="group/back inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white mb-6 transition-colors"
      >
        <ChevronLeft size={16} className="group-hover/back:-translate-x-0.5 transition-transform" />
        <span>Back to All Groups</span>
      </Link>

      {/* ───────── Hero Header (Like the Screenshot) ───────── */}
      <div className="relative rounded-2xl overflow-hidden mb-6 bg-gradient-to-r from-[#4c1d95] via-[#2e1065] to-[#0c0d12] border border-[#25273b] p-6 sm:p-7 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          {/* Left Avatar & Group Info */}
          <div className="flex items-center gap-4 min-w-0">
            {/* Square Initial Avatar */}
            <div className="w-14 h-14 rounded-2xl bg-[#7c3aed] flex items-center justify-center font-bold text-2xl text-white shadow-lg border border-white/20 flex-shrink-0">
              {group.imageUrl ? (
                <img
                  src={group.imageUrl}
                  alt={group.name}
                  className="w-full h-full rounded-2xl object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <span>{initialLetter}</span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate">
                  {group.name}
                </h1>
                {!isPublic && (
                  <Lock size={15} className="text-zinc-400 flex-shrink-0" title="Private Group" />
                )}
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 line-clamp-1">
                {formatMemberCount(group.memberCount)} &middot;{" "}
                {cleanDescription(group.description) || "Daily grind, streaks & peer reviews."}
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5 self-start sm:self-center flex-shrink-0">
            {isMember ? (
              <button
                type="button"
                onClick={handleLeaveGroup}
                disabled={leavingGroup}
                className="px-4 py-1.5 rounded-full text-xs font-medium bg-[#141522] hover:bg-[#1e1f30] text-zinc-300 hover:text-white border border-white/10 transition-colors cursor-pointer disabled:opacity-50"
              >
                {leavingGroup ? "Leaving..." : "Leave Group"}
              </button>
            ) : isPending ? (
              <span className="px-4 py-1.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Request Pending
              </span>
            ) : isPublic ? (
              <button
                type="button"
                onClick={handleJoinPublic}
                disabled={joiningPublic}
                className="px-5 py-2 rounded-full text-xs font-semibold bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-md shadow-[#7c3aed]/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {joiningPublic ? "Joining..." : "Join Group"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsRequestModalOpen(true)}
                className="px-5 py-2 rounded-full text-xs font-semibold bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-md transition-all cursor-pointer"
              >
                Request to Join
              </button>
            )}

            {/* Admin Controls */}
            {isAdmin && (
              <>
                {group.inviteCode && (
                  <button
                    type="button"
                    onClick={handleCopyInviteCode}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
                    title="Copy Invite Link"
                  >
                    {copiedInvite ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(true)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
                  title="Invite Member"
                >
                  <UserPlus size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
                  title="Group Settings"
                >
                  <Settings size={14} />
                </button>
                {isCreator && (
                  <button
                    type="button"
                    onClick={handleDeleteGroup}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors cursor-pointer"
                    title="Delete Group"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ───────── Locked Barrier (for Private Groups) ───────── */}
      {isLockedPrivate ? (
        <div className="relative rounded-2xl overflow-hidden max-w-xl mx-auto my-12 bg-[#13141f] border border-[#25273b] p-8 sm:p-12 text-center shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
            <Lock size={26} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            This Group is Private
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mb-6 max-w-md mx-auto leading-relaxed">
            Posts, feeds, and live chat are reserved exclusively for members. Submit a request to join or enter an invite code.
          </p>
          <div className="flex items-center justify-center gap-3">
            {isPending ? (
              <span className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Join request pending review
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setIsRequestModalOpen(true)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#7c3aed] hover:bg-[#6d28d9] text-white transition-all shadow-md"
              >
                Request to Join
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsJoinCodeModalOpen(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#1e1f30] hover:bg-[#282a40] text-white border border-white/10 transition-colors"
            >
              Enter Code
            </button>
          </div>
        </div>
      ) : (
        /* ───────── Unlocked Content with Underlined Tabs ───────── */
        <div>
          {/* Navigation Tabs (Underlined Style) */}
          <div className="flex items-center gap-8 border-b border-[#25273b] mb-6">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`pb-3 text-sm font-semibold transition-colors relative cursor-pointer ${
                    isActive ? "text-white" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <span>{tab.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#a855f7] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content Panes */}
          <div>
            {activeTab === "feed" && (
              <div className="space-y-6">
                <GroupFeed
                  groupId={groupId}
                  isMember={isMember}
                  isAdmin={isAdmin}
                  groupName={group.name}
                />
                <GroupMembersPreview
                  groupId={groupId}
                  totalMembers={group.memberCount}
                  isCreator={isCreator}
                  isAdmin={isAdmin}
                  onViewAll={() => setActiveTab("members")}
                  onMemberChanged={fetchGroupDetails}
                />
              </div>
            )}

            {activeTab === "members" && (
              <GroupMemberList
                groupId={groupId}
                isCreator={isCreator}
                isAdmin={isAdmin}
                isMember={isMember}
                createdById={group.createdById}
                onMemberChanged={fetchGroupDetails}
              />
            )}

            {activeTab === "chat" && (
              <GroupChat groupId={groupId} isMember={isMember} />
            )}

            {activeTab === "requests" && isAdmin && !isPublic && (
              <GroupJoinRequests
                groupId={groupId}
                onRequestHandled={fetchGroupDetails}
              />
            )}
          </div>
        </div>
      )}

      {/* ───────── Modals ───────── */}
      <CreateGroupModal
        isOpen={isEditModalOpen}
        initialData={group}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={(updated) => {
          setGroup(updated);
        }}
      />

      <InviteMemberModal
        isOpen={isInviteModalOpen}
        groupId={groupId}
        onClose={() => setIsInviteModalOpen(false)}
        onSuccess={fetchGroupDetails}
      />

      <RequestToJoinModal
        isOpen={isRequestModalOpen}
        group={group}
        onClose={() => setIsRequestModalOpen(false)}
        onSuccess={fetchGroupDetails}
      />

      <JoinByCodeModal
        isOpen={isJoinCodeModalOpen}
        onClose={() => setIsJoinCodeModalOpen(false)}
        onSuccess={fetchGroupDetails}
      />
    </div>
  );
};

export default GroupDetail;
