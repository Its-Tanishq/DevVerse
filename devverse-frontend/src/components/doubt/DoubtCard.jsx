import React from "react";
import { Link } from "react-router";
import { MessageSquare, CheckCircle2, HelpCircle, Tag, Clock, User } from "lucide-react";

export const formatRelativeTime = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return date.toLocaleDateString();
  } catch {
    return dateString;
  }
};

const DoubtCard = ({ doubt, onTagClick }) => {
  if (!doubt) return null;

  const author = doubt.author || {};
  const authorName = author.actualUsername || author.username || "Anonymous";
  const authorUsername = author.username || author.actualUsername || "";
  const avatarUrl =
    author.profilePic ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=7c3aed&color=fff`;

  return (
    <div className="group relative bg-card border border-border/80 hover:border-[#7c3aed]/50 rounded-2xl p-5 sm:p-6 transition-all duration-200 hover:shadow-lg hover:shadow-[#7c3aed]/5 backdrop-blur-sm flex flex-col justify-between">
      <div>
        {/* Top meta: solved status & date */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            {doubt.isSolved ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <CheckCircle2 size={13} className="text-emerald-500" />
                Solved
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <HelpCircle size={13} className="text-amber-500" />
                Unsolved
              </span>
            )}
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock size={12} />
              {formatRelativeTime(doubt.createdAt)}
            </span>
          </div>

          <Link
            to={`/community/${doubt.id}`}
            className="text-xs font-medium text-muted-foreground hover:text-[#7c3aed] flex items-center gap-1 transition-colors"
          >
            <MessageSquare size={13} />
            <span>Join Discussion</span>
          </Link>
        </div>

        {/* Title */}
        <Link to={`/community/${doubt.id}`}>
          <h3 className="text-lg font-bold text-foreground group-hover:text-[#7c3aed] transition-colors line-clamp-2 leading-snug">
            {doubt.title}
          </h3>
        </Link>

        {/* Description snippet */}
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {doubt.description?.replace(/[#*`_~\[\]]/g, "")}
        </p>

        {/* Tags */}
        {doubt.tags && doubt.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3.5">
            {doubt.tags.map((tag, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onTagClick && onTagClick(tag)}
                className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-accent/60 text-muted-foreground hover:text-foreground hover:bg-accent border border-border transition-colors cursor-pointer"
              >
                <Tag size={10} className="text-[#7c3aed]" />
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Author footer */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/60">
        <Link
          to={authorUsername ? `/user/${authorUsername}` : "#"}
          className="flex items-center gap-2.5 group/author hover:opacity-85 transition-opacity"
        >
          <img
            src={avatarUrl}
            alt={authorName}
            className="w-7 h-7 rounded-full object-cover border border-border"
          />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-foreground group-hover/author:text-[#7c3aed] transition-colors leading-none">
              {authorName}
            </span>
            {authorUsername && (
              <span className="text-[11px] text-muted-foreground leading-none mt-1">
                @{authorUsername}
              </span>
            )}
          </div>
        </Link>

        <Link
          to={`/community/${doubt.id}`}
          className="text-xs font-medium text-[#7c3aed] hover:underline flex items-center gap-1"
        >
          View Solution &rarr;
        </Link>
      </div>
    </div>
  );
};

export default DoubtCard;
