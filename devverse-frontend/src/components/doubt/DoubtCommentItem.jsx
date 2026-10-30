import React, { useState } from "react";
import { Link } from "react-router";
import ReactMarkdown from "react-markdown";
import {
  ChevronUp,
  ChevronDown,
  Check,
  CheckCircle2,
  Reply,
  Send,
  Loader2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import apiClient from "../../config/ApiClient";
import useAuth from "../../store/AuthStore";
import { formatRelativeTime } from "./DoubtCard";

const getTierBadge = (author, index = 0) => {
  if (author?.role === "ADMIN") {
    return { label: "Staff", style: "bg-[#7c3aed]/20 text-[#a855f7] border-[#7c3aed]/40" };
  }
  const tiers = [
    { label: "Platinum", style: "bg-[#78350f]/60 text-amber-300 border-amber-600/40" },
    { label: "Gold", style: "bg-[#854d0e]/60 text-yellow-300 border-yellow-600/40" },
    { label: "Silver", style: "bg-slate-800 text-slate-300 border-slate-700" },
  ];
  return tiers[index % tiers.length];
};

const DoubtCommentItem = ({
  comment,
  doubtId,
  isAccepted = false,
  isAuthor = false,
  onAccept,
  onCommentUpdated,
  depth = 0,
  index = 0,
}) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [localVoteDelta, setLocalVoteDelta] = useState(0);

  const isLoggedIn = useAuth((state) => state.authStatus);

  if (!comment) return null;

  const author = comment.author || {};
  const authorName = author.actualUsername || author.username || "Developer";
  const authorUsername = author.username || author.actualUsername || "";
  const initial = (authorName || "D").trim().charAt(0).toUpperCase();

  const baseScore = (comment.upvotes || 0) - (comment.downvotes || 0);
  const totalScore = baseScore + localVoteDelta;
  const badge = getTierBadge(author, index);

  const handleVote = async (type) => {
    if (!isLoggedIn) {
      toast.error("Please sign in to vote on answers");
      return;
    }
    if (isVoting) return;

    setIsVoting(true);
    try {
      await apiClient.post(`/doubts/comments/${comment.id}/vote`, null, {
        params: { type },
      });
      if (type === "UPVOTE") {
        setLocalVoteDelta((prev) => (prev > 0 ? 0 : 1));
      } else {
        setLocalVoteDelta((prev) => (prev < 0 ? 0 : -1));
      }
      if (onCommentUpdated) onCommentUpdated();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit vote");
    } finally {
      setIsVoting(false);
    }
  };

  const handlePostReply = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error("Please sign in to reply");
      return;
    }
    if (!replyText.trim()) {
      toast.error("Reply content cannot be empty");
      return;
    }

    setIsSubmittingReply(true);
    try {
      await apiClient.post(`/doubts/${doubtId}/comments`, {
        content: replyText.trim(),
        parentCommentId: comment.id,
      });
      toast.success("Reply added!");
      setReplyText("");
      setShowReplyBox(false);
      if (onCommentUpdated) onCommentUpdated();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to post reply");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const isNested = depth > 0;

  return (
    <div className={`relative ${isNested ? "mt-3.5 pl-4 sm:pl-6 border-l-2 border-border" : "mt-4"}`}>
      <div
        className={`rounded-2xl p-4 sm:p-5 transition-all shadow-sm flex items-start gap-4 ${
          isAccepted
            ? "border border-emerald-500/40 bg-card/90"
            : "border border-border bg-card"
        }`}
      >
        {/* Left Column: Vote & Accepted Action */}
        <div className="flex flex-col items-center justify-start shrink-0 min-w-[32px] pt-0.5">
          <button
            type="button"
            onClick={() => handleVote("UPVOTE")}
            disabled={isVoting}
            title="Upvote answer"
            className={`p-0.5 rounded hover:bg-accent transition-colors cursor-pointer ${
              localVoteDelta > 0 ? "text-emerald-500" : "text-muted-foreground hover:text-emerald-500"
            }`}
          >
            <ChevronUp size={20} strokeWidth={localVoteDelta > 0 ? 3 : 2} />
          </button>

          <span
            className={`text-sm font-bold my-0.5 ${
              localVoteDelta > 0
                ? "text-emerald-500"
                : localVoteDelta < 0
                ? "text-rose-500"
                : "text-foreground"
            }`}
          >
            {totalScore}
          </span>

          <button
            type="button"
            onClick={() => handleVote("DOWNVOTE")}
            disabled={isVoting}
            title="Downvote answer"
            className={`p-0.5 rounded hover:bg-accent transition-colors cursor-pointer ${
              localVoteDelta < 0 ? "text-rose-500" : "text-muted-foreground hover:text-rose-500"
            }`}
          >
            <ChevronDown size={20} strokeWidth={localVoteDelta < 0 ? 3 : 2} />
          </button>

          {/* Checkmark icon / button */}
          {isAccepted ? (
            isAuthor ? (
              <button
                type="button"
                onClick={() => onAccept && onAccept(comment.id)}
                className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center mt-2.5 shadow-sm hover:opacity-90 cursor-pointer"
                title="Click to unaccept this solution"
              >
                <Check size={12} strokeWidth={3} />
              </button>
            ) : (
              <div
                className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center mt-2.5 shadow-sm"
                title="Accepted Answer"
              >
                <Check size={12} strokeWidth={3} />
              </div>
            )
          ) : isAuthor ? (
            <button
              type="button"
              onClick={() => onAccept && onAccept(comment.id)}
              className="mt-2 text-muted-foreground hover:text-emerald-500 p-0.5 transition-colors cursor-pointer"
              title="Mark this answer as accepted solution"
            >
              <Check size={16} />
            </button>
          ) : (
            <div className="mt-2 text-muted-foreground/30">
              <Check size={15} />
            </div>
          )}
        </div>

        {/* Right Column: Content and Metadata */}
        <div className="flex-1 min-w-0">
          {/* Accepted Answer Badge */}
          {isAccepted && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-2.5">
              <CheckCircle2 size={13} />
              <span>Accepted Answer</span>
            </div>
          )}

          {/* Comment Body Markdown */}
          <div className="text-sm text-foreground/90 space-y-2 leading-relaxed break-words font-sans">
            <ReactMarkdown
              components={{
                p: ({ node, ...props }) => (
                  <p className="leading-relaxed whitespace-pre-wrap" {...props} />
                ),
                code: ({ node, inline, className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || "");
                  const lang = match ? match[1] : (className ? className.replace("language-", "") : "");
                  return inline ? (
                    <code
                      className="bg-muted text-foreground px-1.5 py-0.5 rounded text-xs font-mono border border-border"
                      {...props}
                    >
                      {children}
                    </code>
                  ) : (
                    <div className="rounded-xl border border-border bg-[#0a0910] dark:bg-[#0c0b12] p-3 sm:p-4 my-2.5 text-xs sm:text-sm font-mono overflow-x-auto shadow-inner">
                      {lang && (
                        <div className="text-[11px] font-semibold text-[#a855f7] mb-2 uppercase tracking-wider">
                          {lang}
                        </div>
                      )}
                      <pre className="text-emerald-300 leading-relaxed overflow-x-auto">
                        <code {...props}>{children}</code>
                      </pre>
                    </div>
                  );
                },
              }}
            >
              {comment.content}
            </ReactMarkdown>
          </div>

          {/* Author Footer */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-3 mt-3 border-t border-border/40">
            <div className="flex items-center gap-2 flex-wrap">
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
              <Link
                to={authorUsername ? `/user/${authorUsername}` : "#"}
                className="text-xs font-semibold text-foreground hover:text-[#7c3aed] transition-colors"
              >
                {authorName}
              </Link>
              {badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.style}`}
                >
                  {badge.label}
                </span>
              )}
              <span className="text-xs text-muted-foreground">
                &bull; {formatRelativeTime(comment.createdAt)}
              </span>
            </div>

            {/* Reply Toggle */}
            <button
              type="button"
              onClick={() => setShowReplyBox((prev) => !prev)}
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Reply size={12} />
              <span>Reply</span>
            </button>
          </div>

          {/* Reply Form */}
          {showReplyBox && (
            <form onSubmit={handlePostReply} className="mt-3 pt-3 border-t border-border/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-muted-foreground">
                  Reply to {authorName}
                </span>
                <button
                  type="button"
                  onClick={() => setShowReplyBox(false)}
                  className="text-muted-foreground hover:text-foreground p-0.5"
                >
                  <X size={12} />
                </button>
              </div>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your reply..."
                rows={2}
                className="w-full bg-background border border-border focus:border-[#7c3aed] rounded-lg p-2.5 text-xs text-foreground placeholder:text-muted-foreground outline-none resize-y"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmittingReply || !replyText.trim()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#7c3aed] hover:bg-[#6d28d9] text-white disabled:opacity-50 cursor-pointer"
                >
                  {isSubmittingReply ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Send size={12} />
                  )}
                  <span>Post Reply</span>
                </button>
              </div>
            </form>
          )}

          {/* Nested Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="space-y-2 mt-2">
              {comment.replies.map((reply, rIdx) => (
                <DoubtCommentItem
                  key={reply.id}
                  comment={reply}
                  doubtId={doubtId}
                  isAuthor={isAuthor}
                  onCommentUpdated={onCommentUpdated}
                  depth={depth + 1}
                  index={rIdx + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoubtCommentItem;
