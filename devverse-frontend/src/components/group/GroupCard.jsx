import React from "react";
import { Link, useNavigate } from "react-router";
import { Lock, Clock, Sparkles } from "lucide-react";
import useAuth from "../../store/AuthStore";
import {
  detectTopic,
  cleanDescription,
  getGroupPalette,
  formatMemberCount,
  formatActiveTime,
} from "./groupThemeUtils";

export const getGroupAvatarFallback = (name) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "Group"
  )}&background=7c3aed&color=fff&bold=true`;
};

const GroupCard = ({
  group,
  onJoin,
  onRequestJoin,
  joiningGroupId,
  isMyGroup = false,
  index = 0,
}) => {
  const navigate = useNavigate();
  const currentUser = useAuth((state) => state.user);

  if (!group) return null;

  const isPublic = group.privacy === "PUBLIC";
  const isPrivate = !isPublic;

  // Membership detection
  const isCreator = Boolean(
    group.isCreator ||
      group.creator ||
      (currentUser &&
        ((group.createdById &&
          Number(group.createdById) ===
            Number(currentUser.id || currentUser.ID)) ||
          (group.createdByUsername &&
            (currentUser.username || currentUser.actualUsername) &&
            group.createdByUsername.toLowerCase() ===
              (
                currentUser.actualUsername || currentUser.username
              ).toLowerCase())))
  );

  const isAdmin = Boolean(group.isAdmin || group.admin || isCreator);
  const isMember = Boolean(
    isMyGroup ||
      group.isMember ||
      group.member ||
      isCreator ||
      isAdmin
  );
  const isPending = Boolean(
    group.hasPendingRequest ||
      group.pendingRequest ||
      group.hasPendingJoinRequest
  );
  const isProcessing = joiningGroupId === group.id;

  const topic = detectTopic(group);
  const palette = getGroupPalette(group, index);
  const initialLetter = (group.name || "G").charAt(0).toUpperCase();
  const displayDescription =
    cleanDescription(group.description) ||
    "Collaborative developer circle for discussions, problem solving, and learning.";

  const handleOpen = () => {
    navigate(`/groups/${group.id}`);
  };

  const handleJoinClick = (e) => {
    e.stopPropagation();
    if (isPublic) {
      onJoin && onJoin(group);
    } else {
      onRequestJoin && onRequestJoin(group);
    }
  };

  return (
    <div className="group relative bg-[#13141f] border border-[#25273b] hover:border-[#7c3aed]/50 rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5">
      {/* Top Banner with Palette & Avatar Initial */}
      <div className={`relative h-20 ${palette.banner} flex items-center px-4 overflow-hidden select-none`}>
        {/* Subtle decorative glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

        {/* Initial Circle Avatar */}
        <div
          className={`relative z-10 w-11 h-11 rounded-full ${palette.avatarBg} flex items-center justify-center font-bold text-lg shadow-md border border-white/20`}
        >
          {group.imageUrl ? (
            <img
              src={group.imageUrl}
              alt={group.name}
              className="w-full h-full rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <span>{initialLetter}</span>
          )}
        </div>

        {/* Private lock badge on top right */}
        {isPrivate && (
          <div
            className="absolute top-3.5 right-4 text-white/90 drop-shadow-sm flex items-center justify-center"
            title="Private Group"
          >
            <Lock size={15} />
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          {/* Title */}
          <div className="flex items-center gap-1.5">
            <Link
              to={`/groups/${group.id}`}
              className="font-bold text-base text-white hover:text-[#c4b5fd] transition-colors line-clamp-1 block"
            >
              {group.name}
            </Link>
            {isPrivate && (
              <Lock size={13} className="text-zinc-400 flex-shrink-0" />
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-zinc-400 mt-1 line-clamp-2 min-h-[32px] leading-relaxed">
            {displayDescription}
          </p>

          {/* Tag & Members Row */}
          <div className="flex items-center gap-2 mt-3.5">
            <span
              className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${palette.tagBg}`}
            >
              {topic || (group.privacy === "PRIVATE" ? "Private" : "Public")}
            </span>
            <span className="text-xs text-zinc-400 font-medium">
              {formatMemberCount(group.memberCount)}
            </span>
          </div>
        </div>

        {/* Card Footer: Active Ago & Action Button */}
        <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-white/5">
          <span className="text-xs text-zinc-400 font-normal">
            {formatActiveTime(group)}
          </span>

          <div>
            {isMember ? (
              <button
                type="button"
                onClick={handleOpen}
                className="px-5 py-1.5 rounded-full text-xs font-semibold bg-[#222336] hover:bg-[#2d2e46] text-white border border-white/10 transition-colors cursor-pointer"
              >
                Open
              </button>
            ) : isPending ? (
              <button
                type="button"
                disabled
                className="px-5 py-1.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-500 cursor-not-allowed"
              >
                Pending
              </button>
            ) : (
              <button
                type="button"
                onClick={handleJoinClick}
                disabled={isProcessing}
                className={`px-5 py-1.5 rounded-full text-xs font-semibold ${palette.button} shadow-sm transition-all cursor-pointer disabled:opacity-50`}
              >
                {isProcessing ? "Joining..." : "Join"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
