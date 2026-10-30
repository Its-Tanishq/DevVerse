import React from "react";
import { Link } from "react-router";
import { MessageSquare, CheckCircle2, CircleDot } from "lucide-react";

export const formatRelativeTime = (dateString) => {
  if (!dateString) return "just now";
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "just now";
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

export const getTagStyle = (tag) => {
  const lower = (tag || "").toLowerCase().trim();
  if (lower.includes("dynamic") || lower === "dp") {
    return "bg-[#7c3aed]/15 text-[#7c3aed] border-[#7c3aed]/30";
  }
  if (lower.includes("java") || lower.includes("python") || lower.includes("c++")) {
    return "bg-amber-500/10 text-amber-500 border-amber-500/20";
  }
  if (lower.includes("graph") || lower.includes("tree")) {
    return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
  }
  if (lower.includes("string")) {
    return "bg-rose-500/10 text-rose-500 border-rose-500/20";
  }
  if (lower.includes("react") || lower.includes("next")) {
    return "bg-cyan-500/10 text-cyan-500 border-cyan-500/20";
  }
  if (lower.includes("array") || lower.includes("binary")) {
    return "bg-blue-500/10 text-blue-500 border-blue-500/20";
  }
  return "bg-[#7c3aed]/10 text-[#7c3aed] border-[#7c3aed]/20";
};

const DoubtCard = ({ doubt, commentCount: propCommentCount, onTagClick }) => {
  if (!doubt) return null;

  const author = doubt.author || {};
  const authorName = author.actualUsername || author.username || "Anonymous";
  const authorUsername = author.username || author.actualUsername || "";
  const initial = (authorName || "A").trim().charAt(0).toUpperCase();

  const commentCount =
    propCommentCount !== undefined
      ? propCommentCount
      : doubt.commentCount ?? doubt.comments?.length ?? 0;

  return (
    <div className="group relative bg-card border border-border hover:border-[#7c3aed]/50 rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:shadow-lg hover:shadow-[#7c3aed]/5 flex items-stretch justify-between gap-4">
      {/* Left Main Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          {/* Top Status & Timestamp */}
          <div className="flex items-center gap-2 mb-2">
            {doubt.isSolved ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <CheckCircle2 size={12} className="text-emerald-500" />
                Solved
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
                <CircleDot size={12} className="text-muted-foreground" />
                Unsolved
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(doubt.createdAt)}
            </span>
          </div>

          {/* Title */}
          <Link to={`/community/${doubt.id}`} className="block group/title">
            <h3 className="text-base sm:text-lg font-bold text-foreground group-hover/title:text-[#7c3aed] transition-colors line-clamp-1 leading-snug">
              {doubt.title}
            </h3>
          </Link>

          {/* Description Snippet */}
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {doubt.description?.replace(/[#*`_~\[\]]/g, "")}
          </p>

          {/* Tags */}
          {doubt.tags && doubt.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
              {doubt.tags.map((tag, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onTagClick && onTagClick(tag)}
                  className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-md border transition-transform hover:scale-105 cursor-pointer ${getTagStyle(
                    tag
                  )}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Author Footer */}
        <div className="flex items-center gap-2 mt-3 pt-1">
          {author.profilePic ? (
            <img
              src={author.profilePic}
              alt={authorName}
              className="w-5 h-5 rounded-full object-cover border border-border"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-[#7c3aed] text-white flex items-center justify-center text-[10px] font-bold">
              {initial}
            </div>
          )}
          <span className="text-xs text-muted-foreground">
            Asked by{" "}
            <Link
              to={authorUsername ? `/user/${authorUsername}` : "#"}
              className="font-semibold text-foreground hover:text-[#7c3aed] transition-colors"
            >
              {authorName}
            </Link>
          </span>
        </div>
      </div>

      {/* Right Side: Real Answers / Discussion Counter */}
      <Link
        to={`/community/${doubt.id}`}
        className={`flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-xl border transition-all duration-200 min-w-[62px] sm:min-w-[72px] shrink-0 self-center text-center group/answers hover:scale-105 cursor-pointer ${
          doubt.isSolved
            ? "border-emerald-500/40 bg-emerald-500/5 hover:border-emerald-500"
            : commentCount > 0
            ? "border-[#7c3aed]/30 bg-[#7c3aed]/5 hover:border-[#7c3aed]"
            : "border-border bg-background hover:border-muted-foreground/40"
        }`}
        title={`View ${commentCount} answers`}
      >
        <MessageSquare
          size={18}
          className={
            doubt.isSolved
              ? "text-emerald-500"
              : commentCount > 0
              ? "text-[#7c3aed]"
              : "text-muted-foreground"
          }
        />
        <span className="text-base font-bold text-foreground mt-1.5 leading-none">
          {commentCount}
        </span>
        <span className="text-[10px] font-medium text-muted-foreground mt-1">
          {commentCount === 1 ? "answer" : "answers"}
        </span>
      </Link>
    </div>
  );
};

export default DoubtCard;
