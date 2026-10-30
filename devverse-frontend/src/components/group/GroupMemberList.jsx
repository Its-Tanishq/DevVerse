import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
  Users,
  Crown,
  ShieldCheck,
  User,
  ShieldAlert,
  UserMinus,
  Loader2,
  LogOut,
} from "lucide-react";
import toast from "react-hot-toast";
import groupApi from "../../services/groupApi";
import useAuth from "../../store/AuthStore";
import { formatRelativeTime } from "../doubt/DoubtCard";

const GroupMemberList = ({
  groupId,
  isCreator,
  isAdmin,
  isMember,
  createdById,
  onMemberChanged,
}) => {
  const currentUser = useAuth((state) => state.user);
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionUserId, setActionUserId] = useState(null);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const data = await groupApi.getMembers(groupId);
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching members:", err);
      toast.error("Failed to load group members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (groupId) {
      fetchMembers();
    }
  }, [groupId]);

  const handlePromoteToAdmin = async (userId, username) => {
    if (!window.confirm(`Promote @${username} to Group Admin?`)) return;

    setActionUserId(userId);
    try {
      await groupApi.promoteToAdmin(groupId, userId);
      toast.success(`@${username} is now an admin!`);
      fetchMembers();
      onMemberChanged && onMemberChanged();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to promote member"
      );
    } finally {
      setActionUserId(null);
    }
  };

  const handleRemoveMember = async (userId, username) => {
    if (
      !window.confirm(
        `Are you sure you want to remove @${username} from this group?`
      )
    )
      return;

    setActionUserId(userId);
    try {
      await groupApi.removeMember(groupId, userId);
      toast.success(`Removed @${username} from group`);
      setMembers((prev) => prev.filter((m) => m.userId !== userId));
      onMemberChanged && onMemberChanged();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to remove member"
      );
    } finally {
      setActionUserId(null);
    }
  };

  const handleLeaveGroup = async () => {
    if (!window.confirm("Are you sure you want to leave this study group?")) return;

    try {
      await groupApi.leaveGroup(groupId);
      toast.success("You have left the group");
      navigate("/community?tab=groups");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to leave group");
    }
  };

  return (
    <div className="bg-[#13141f] border border-[#25273b] rounded-2xl p-6 sm:p-7 shadow-xl">
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-white/5">
        <div>
          <h3 className="font-bold text-lg text-white flex items-center gap-2">
            Members &middot; {members.length}
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Developers and collaborators in this circle.
          </p>
        </div>

        {isMember && !isCreator && (
          <button
            type="button"
            onClick={handleLeaveGroup}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
          >
            <LogOut size={13} />
            <span>Leave Group</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2">
          <Loader2 className="animate-spin text-[#7c3aed]" size={28} />
          <p className="text-xs text-zinc-400">Loading members...</p>
        </div>
      ) : members.length === 0 ? (
        <p className="text-xs text-zinc-400 text-center py-8">
          No members found.
        </p>
      ) : (
        <div className="space-y-3">
          {members.map((member, index) => {
            const isMemberCreator = Number(member.userId) === Number(createdById);
            const isMemberAdmin = member.role === "ADMIN" || isMemberCreator;
            const isMe = Number(member.userId) === Number(currentUser?.id || currentUser?.ID);
            const isBusy = actionUserId === member.userId;
            const rank = ["Gold", "Gold", "Platinum", "Gold", "Silver"][index % 5];

            const memberAvatar =
              member.profilePic ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                member.username || "Member"
              )}&background=7c3aed&color=fff&bold=true`;

            return (
              <div
                key={member.id || member.userId}
                className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-[#0c0d14] border border-[#25273b] transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={memberAvatar}
                    alt={member.username}
                    className="w-10 h-10 rounded-full object-cover border border-white/10 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        to={`/user/${member.username}`}
                        className="font-bold text-sm text-white hover:text-[#c084fc] transition-colors truncate"
                      >
                        {member.username}
                      </Link>
                      {isMe && (
                        <span className="text-[10px] font-semibold bg-[#7c3aed]/15 text-[#c084fc] px-1.5 py-0.2 rounded-md">
                          You
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-medium text-amber-400">
                        {rank}
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        &middot; Joined {formatRelativeTime(member.joinedAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right controls: Role pill & actions */}
                <div className="flex items-center gap-2.5 flex-shrink-0">
                  {isMemberCreator ? (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#7c3aed]/20 text-[#c084fc] border border-[#7c3aed]/40">
                      Creator
                    </span>
                  ) : isMemberAdmin ? (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#7c3aed]/20 text-[#c084fc] border border-[#7c3aed]/40">
                      Admin
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#1e2030] text-zinc-400 border border-white/10">
                      Member
                    </span>
                  )}

                  {/* Promote to Admin (Creator only) */}
                  {isCreator && !isMe && !isMemberAdmin && (
                    <button
                      type="button"
                      onClick={() =>
                        handlePromoteToAdmin(member.userId, member.username)
                      }
                      disabled={isBusy}
                      className="p-1 rounded-lg text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors cursor-pointer text-xs"
                      title="Promote to Admin"
                    >
                      <ShieldAlert size={14} />
                    </button>
                  )}

                  {/* Remove Member */}
                  {!isMe && !isMemberCreator && (isCreator || (isAdmin && !isMemberAdmin)) && (
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveMember(member.userId, member.username)
                      }
                      disabled={isBusy}
                      className="text-xs font-semibold text-red-400 hover:text-red-300 ml-1 transition-colors cursor-pointer disabled:opacity-50"
                      title="Remove Member"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GroupMemberList;
