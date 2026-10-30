import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import groupApi from "../../services/groupApi";
import useAuth from "../../store/AuthStore";
import { formatMemberCount } from "./groupThemeUtils";

const getMemberRankBadge = (member, index) => {
  const ranks = ["Gold", "Gold", "Platinum", "Gold", "Silver"];
  return ranks[index % ranks.length];
};

const GroupMembersPreview = ({
  groupId,
  totalMembers,
  isCreator,
  isAdmin,
  onViewAll,
  onMemberChanged,
}) => {
  const currentUser = useAuth((state) => state.user);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchPreviewMembers = async () => {
      try {
        const data = await groupApi.getMembers(groupId);
        if (isMounted) {
          setMembers(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to load members preview:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (groupId) {
      fetchPreviewMembers();
    }
    return () => {
      isMounted = false;
    };
  }, [groupId]);

  const handleRemove = async (userId, username) => {
    if (!window.confirm(`Are you sure you want to remove @${username}?`)) return;
    setRemovingId(userId);
    try {
      await groupApi.removeMember(groupId, userId);
      toast.success(`Removed @${username}`);
      setMembers((prev) => prev.filter((m) => m.userId !== userId));
      onMemberChanged && onMemberChanged();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to remove member");
    } finally {
      setRemovingId(null);
    }
  };

  const previewList = members.slice(0, 5);
  const count = totalMembers || members.length;

  return (
    <div className="bg-[#13141f] border border-[#25273b] rounded-2xl p-5 sm:p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-base sm:text-lg text-white">
          Members &middot; {formatMemberCount(count)}
        </h3>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="animate-spin text-[#7c3aed]" size={24} />
        </div>
      ) : previewList.length === 0 ? (
        <p className="text-xs text-zinc-500 py-4 text-center">No members found</p>
      ) : (
        <div className="divide-y divide-white/5">
          {previewList.map((member, index) => {
            const isMe =
              Number(member.userId) === Number(currentUser?.id || currentUser?.ID);
            const isMemberAdmin = member.role === "ADMIN";
            const canRemove = (isCreator || isAdmin) && !isMe && !isMemberAdmin;
            const rank = getMemberRankBadge(member, index);

            const avatar =
              member.profilePic ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                member.username || "Member"
              )}&background=7c3aed&color=fff&bold=true`;

            return (
              <div
                key={member.id || member.userId}
                className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={avatar}
                    alt={member.username}
                    className="w-10 h-10 rounded-full object-cover border border-white/10 flex-shrink-0 bg-[#0c0d14]"
                  />
                  <div className="min-w-0">
                    <Link
                      to={`/user/${member.username}`}
                      className="font-bold text-sm text-white hover:text-[#c084fc] transition-colors truncate block"
                    >
                      {member.username}
                    </Link>
                    <span className="text-[11px] font-medium text-amber-400">
                      {rank}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 flex-shrink-0">
                  {isMemberAdmin ? (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#7c3aed]/20 text-[#c084fc] border border-[#7c3aed]/40">
                      Admin
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#1e2030] text-zinc-400 border border-white/10">
                      Member
                    </span>
                  )}

                  {canRemove && (
                    <button
                      type="button"
                      onClick={() => handleRemove(member.userId, member.username)}
                      disabled={removingId === member.userId}
                      className="text-xs font-semibold text-red-400 hover:text-red-300 ml-1 transition-colors cursor-pointer disabled:opacity-50"
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

      {members.length > 0 && (
        <button
          type="button"
          onClick={onViewAll}
          className="w-full text-center text-xs font-semibold text-[#a855f7] hover:text-[#c084fc] pt-4 mt-3 border-t border-white/5 transition-colors cursor-pointer"
        >
          View all {formatMemberCount(count)} members
        </button>
      )}
    </div>
  );
};

export default GroupMembersPreview;

