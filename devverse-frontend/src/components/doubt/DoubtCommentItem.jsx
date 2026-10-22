import React, { useState } from "react";
import { Link } from "react-router";
import ReactMarkdown from "react-markdown";
import {
  ThumbsUp,
  ThumbsDown,
  Reply,
  Send,
  Loader2,
  X,
  CheckCircle,
  CornerDownRight,
} from "lucide-react";
import toast from "react-hot-toast";
import apiClient from "../../config/ApiClient";
import useAuth from "../../store/AuthStore";
import { formatRelativeTime } from "./DoubtCard";

const DoubtCommentItem = ({
  comment,
  doubtId,
  onCommentUpdated,
  depth = 0,
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
  const avatarUrl =
    author.profilePic ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=7c3aed&color=fff`;

  const totalScore = (comment.upvotes || 0) - (comment.downvotes || 0) + localVoteDelta;

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
      // Toggle / update local score estimate
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
    <div className={`relative ${isNested ? "mt-3.5 pl-4 sm:pl-6 border-l-2 border-border/70" : "mt-5"}`}>
      <div className="bg-card/90 border border-border/70 rounded-xl p-4 sm:p-5 transition-all shadow-sm">
        {/* Author row */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <Link
              to={authorUsername ? `/user/${authorUsername}` : "#"}
              className="flex items-center gap-2 group/author"
            >
              <img
                src={avatarUrl}
                alt={authorName}
                className="w-7 h-7 rounded-full object-cover border border-border"
              />
              <span className="text-xs font-semibold text-foreground group-hover/author:text-[#7c3aed] transition-colors">
                {authorName}
              </span>
            </Link>
            {author.role === "ADMIN" && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#7c3aed]/15 text-[#7c3aed] border border-[#7c3aed]/30">
                Staff
              </span>
            )}
            <span className="text-[11px] text-muted-foreground">
              {formatRelativeTime(comment.createdAt)}
            </span>
          </div>
        </div>

        {/* Comment Body with Markdown */}
        <div className="text-sm text-foreground/90 space-y-2 leading-relaxed break-words font-sans">
          <ReactMarkdown
            components={{
              h3: ({ node, ...props }) => (
                <h3 className="text-base font-bold text-foreground mt-3 mb-2" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="mb-2 leading-relaxed whitespace-pre-wrap" {...props} />
              ),
              code: ({ node, inline, className, children, ...props }) => {
                return inline ? (
                  <code
                    className="bg-accent/80 text-foreground px-1.5 py-0.5 rounded text-xs font-mono border border-border"
                    {...props}
                  >
                    {children}
                  </code>
                ) : (
                  <div className="bg-neutral-900 text-neutral-100 dark:bg-black/80 rounded-lg p-3 my-2.5 border border-border overflow-x-auto">
                    <code className="text-xs font-mono" {...props}>
                      {children}
                    </code>
                  </div>
                );
              },
              ul: ({ node, ...props }) => (
                <ul className="list-disc list-inside space-y-1 mb-2 text-sm" {...props} />
              ),
              li: ({ node, ...props }) => <li className="text-foreground/90" {...props} />,
            }}
          >
            {comment.content}
          </ReactMarkdown>
        </div>

        {/* Footer actions: vote & reply */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/50">
          <div className="flex items-center gap-1.5 bg-accent/40 rounded-lg p-1 border border-border/60">
            <button
              type="button"
              onClick={() => handleVote("UPVOTE")}
              disabled={isVoting}
              title="Upvote"
              className="p-1 rounded-md text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors cursor-pointer"
            >
              <ThumbsUp size={13} />
            </button>
            <span
              className={`text-xs font-semibold px-1 min-w-[20px] text-center ${
                totalScore > 0
                  ? "text-emerald-500"
                  : totalScore < 0
                  ? "text-red-500"
                  : "text-muted-foreground"
              }`}
            >
              {totalScore}
            </span>
            <button
              type="button"
              onClick={() => handleVote("DOWNVOTE")}
              disabled={isVoting}
              title="Downvote"
              className="p-1 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <ThumbsDown size={13} />
            </button>
          </div>

          {depth < 3 && (
            <button
              type="button"
              onClick={() => setShowReplyBox((prev) => !prev)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-[#7c3aed] transition-colors py-1 px-2.5 rounded-lg hover:bg-accent cursor-pointer"
            >
              <Reply size={13} />
              <span>{showReplyBox ? "Cancel" : "Reply"}</span>
            </button>
          )}
        </div>

        {/* Reply input form */}
        {showReplyBox && (
          <form onSubmit={handlePostReply} className="mt-3 pt-3 border-t border-border/60">
            <div className="flex items-start gap-2">
              <CornerDownRight size={15} className="text-[#7c3aed] mt-2.5 shrink-0" />
              <div className="flex-1 space-y-2">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply to ${authorName}... (markdown supported)`}
                  rows={2}
                  className="w-full text-xs bg-background border border-border focus:border-[#7c3aed] rounded-lg p-2.5 outline-none resize-y text-foreground placeholder:text-muted-foreground"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowReplyBox(false);
                      setReplyText("");
                    }}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg text-muted-foreground hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingReply || !replyText.trim()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#7c3aed] hover:bg-[#6d28d9] text-white disabled:opacity-50 transition-colors cursor-pointer shadow-sm"
                  >
                    {isSubmittingReply ? (
                      <>
                        <Loader2 size={12} className="animate-spin" />
                        Replying...
                      </>
                    ) : (
                      <>
                        <Send size={12} />
                        Post Reply
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Recursive nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-2">
          {comment.replies.map((reply) => (
            <DoubtCommentItem
              key={reply.id}
              comment={reply}
              doubtId={doubtId}
              onCommentUpdated={onCommentUpdated}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DoubtCommentItem;
