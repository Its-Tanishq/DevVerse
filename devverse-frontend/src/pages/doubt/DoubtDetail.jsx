import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  Clock,
  Tag,
  MessageSquare,
  Send,
  Loader2,
  User,
  Check,
  Edit3,
  Eye,
  Share2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import apiClient from "../../config/ApiClient";
import useAuth from "../../store/AuthStore";
import DoubtCommentItem from "../../components/doubt/DoubtCommentItem";
import { formatRelativeTime } from "../../components/doubt/DoubtCard";
import FollowButton from "../../components/common/FollowButton";

const DoubtDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const currentUser = useAuth((state) => state.user);
  const isLoggedIn = useAuth((state) => state.authStatus);

  const [doubt, setDoubt] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);

  // New answer / comment state
  const [commentText, setCommentText] = useState("");
  const [activeTab, setActiveTab] = useState("write"); // "write" | "preview"
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSolving, setIsSolving] = useState(false);

  const fetchDoubt = async () => {
    try {
      const res = await apiClient.get(`/doubts/${id}`);
      setDoubt(res.data);
    } catch (err) {
      console.error("Error fetching doubt:", err);
      toast.error(err?.response?.data?.message || "Doubt not found");
      navigate("/community");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const res = await apiClient.get(`/doubts/${id}/comments`);
      setComments(res.data || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDoubt();
      fetchComments();
    }
  }, [id]);

  const handleMarkSolved = async () => {
    if (!isLoggedIn) {
      toast.error("Please sign in");
      return;
    }
    setIsSolving(true);
    try {
      const res = await apiClient.patch(`/doubts/${id}/solve`);
      setDoubt(res.data);
      toast.success("Doubt marked as solved!");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to mark doubt as solved"
      );
    } finally {
      setIsSolving(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error("Please sign in to answer this doubt");
      navigate("/signin");
      return;
    }

    if (!commentText.trim()) {
      toast.error("Answer cannot be empty");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post(`/doubts/${id}/comments`, {
        content: commentText.trim(),
        parentCommentId: null,
      });

      toast.success("Answer posted!");
      setCommentText("");
      setActiveTab("write");
      fetchComments();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to post answer. Try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Doubt link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 size={36} className="text-[#7c3aed] animate-spin" />
        <p className="text-sm text-muted-foreground">Loading doubt...</p>
      </div>
    );
  }

  if (!doubt) {
    return (
      <div className="w-[90vw] max-w-4xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold">Doubt Not Found</h2>
        <Link
          to="/community"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#7c3aed] text-white text-sm"
        >
          <ArrowLeft size={16} />
          Back to Doubt Forum
        </Link>
      </div>
    );
  }

  const author = doubt.author || {};
  const authorName = author.actualUsername || author.username || "Anonymous";
  const authorUsername = author.username || author.actualUsername || "";
  const avatarUrl =
    author.profilePic ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=7c3aed&color=fff`;

  const isAuthor =
    currentUser &&
    doubt.author &&
    (currentUser.ID === doubt.author.ID ||
      currentUser.id === doubt.author.ID ||
      currentUser.username === doubt.author.username);

  // Count total comments recursively
  const countAllComments = (list) => {
    let count = 0;
    for (const c of list) {
      count += 1;
      if (c.replies && c.replies.length > 0) {
        count += countAllComments(c.replies);
      }
    }
    return count;
  };
  const totalCommentsCount = countAllComments(comments);

  return (
    <div className="w-[90vw] max-w-5xl mx-auto py-8 sm:py-10">
      {/* Back navigation */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/community"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Doubt Forum
        </Link>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border hover:bg-accent text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <Share2 size={13} />
          Share Doubt
        </button>
      </div>

      {/* Main Question Container */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Status + Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            {doubt.isSolved ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <CheckCircle2 size={14} className="text-emerald-500" />
                Solved
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <HelpCircle size={14} className="text-amber-500" />
                Open / Unsolved
              </span>
            )}
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock size={12} />
              Asked {formatRelativeTime(doubt.createdAt)}
            </span>
          </div>

          {/* Mark as Solved action for author */}
          {isAuthor && !doubt.isSolved && (
            <button
              onClick={handleMarkSolved}
              disabled={isSolving}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isSolving ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Check size={13} strokeWidth={3} />
              )}
              Mark Doubt as Solved
            </button>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-tight">
          {doubt.title}
        </h1>

        {/* Author info pill */}
        <div className="flex items-center justify-between flex-wrap gap-4 pt-1">
          <div className="flex items-center gap-3">
            <Link
              to={authorUsername ? `/user/${authorUsername}` : "#"}
              className="flex items-center gap-2.5 group/author"
            >
              <img
                src={avatarUrl}
                alt={authorName}
                className="w-9 h-9 rounded-full object-cover border border-border"
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground group-hover/author:text-[#7c3aed] transition-colors leading-tight">
                  {authorName}
                </span>
                {authorUsername && (
                  <span className="text-xs text-muted-foreground leading-tight">
                    @{authorUsername}
                  </span>
                )}
              </div>
            </Link>

            {authorUsername && currentUser?.username !== authorUsername && (
              <FollowButton targetUsername={authorUsername} size="xs" />
            )}
          </div>

          {/* Tags */}
          {doubt.tags && doubt.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {doubt.tags.map((t, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-accent/80 text-foreground border border-border"
                >
                  <Tag size={11} className="text-[#7c3aed]" />
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Question Body */}
        <div className="pt-4 border-t border-border/60 text-[15px] text-foreground/90 leading-relaxed font-sans space-y-4 break-words">
          <ReactMarkdown
            components={{
              h2: ({ node, ...props }) => (
                <h2 className="text-xl font-bold text-foreground mt-6 mb-3 border-b border-border pb-2" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-lg font-bold text-foreground mt-5 mb-2" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="mb-4 whitespace-pre-wrap leading-relaxed" {...props} />
              ),
              strong: ({ node, ...props }) => (
                <strong className="font-bold text-foreground" {...props} />
              ),
              code: ({ node, inline, className, children, ...props }) => {
                return inline ? (
                  <code
                    className="bg-accent text-foreground px-1.5 py-0.5 rounded-md text-xs font-mono border border-border"
                    {...props}
                  >
                    {children}
                  </code>
                ) : (
                  <div className="bg-neutral-900 text-neutral-100 dark:bg-black/80 rounded-xl p-4 my-4 border border-border overflow-x-auto shadow-inner">
                    <code className="text-xs sm:text-sm font-mono" {...props}>
                      {children}
                    </code>
                  </div>
                );
              },
              ul: ({ node, ...props }) => (
                <ul className="list-disc list-inside space-y-2 mb-4 marker:text-[#7c3aed]" {...props} />
              ),
              li: ({ node, ...props }) => <li className="text-foreground/90" {...props} />,
            }}
          >
            {doubt.description}
          </ReactMarkdown>
        </div>
      </div>

      {/* Answers / Comments Section */}
      <div className="mt-10 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <MessageSquare size={20} className="text-[#7c3aed]" />
            <h2 className="text-xl font-bold text-foreground">
              Answers & Discussion
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-accent text-muted-foreground border border-border">
              {totalCommentsCount}
            </span>
          </div>
        </div>

        {/* Answer input form */}
        <div className="bg-card border border-border/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Your Answer / Solution
            </span>
            <div className="flex items-center gap-1 bg-accent/50 p-0.5 rounded-lg border border-border text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("write")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  activeTab === "write"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Edit3 size={12} />
                Write
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  activeTab === "preview"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Eye size={12} />
                Preview
              </button>
            </div>
          </div>

          <form onSubmit={handleAddComment} className="space-y-3">
            {activeTab === "write" ? (
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a clear, helpful solution. You can format code using ```python, ```java, ```js etc."
                rows={4}
                className="w-full bg-background border border-border focus:border-[#7c3aed] rounded-xl p-3.5 text-sm text-foreground placeholder:text-muted-foreground outline-none resize-y transition-all"
              />
            ) : (
              <div className="min-h-[120px] max-h-[220px] overflow-y-auto bg-background/50 border border-border rounded-xl p-4 text-sm text-foreground/90">
                {commentText ? (
                  <ReactMarkdown
                    components={{
                      code: ({ node, inline, children, ...props }) =>
                        inline ? (
                          <code className="bg-accent px-1 py-0.5 rounded text-xs font-mono" {...props}>
                            {children}
                          </code>
                        ) : (
                          <pre className="bg-neutral-900 text-neutral-100 p-3 rounded-lg overflow-x-auto text-xs font-mono my-2">
                            {children}
                          </pre>
                        ),
                    }}
                  >
                    {commentText}
                  </ReactMarkdown>
                ) : (
                  <span className="text-muted-foreground italic text-xs">
                    Nothing to preview. Type something in Write mode.
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-muted-foreground">
                Markdown & code blocks supported.
              </span>
              <button
                type="submit"
                disabled={isSubmitting || !commentText.trim()}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-[#7c3aed] hover:bg-[#6d28d9] text-white transition-all shadow-md shadow-[#7c3aed]/20 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send size={13} />
                    Post Answer
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Comments Feed */}
        {loadingComments ? (
          <div className="py-12 flex justify-center">
            <Loader2 size={24} className="text-[#7c3aed] animate-spin" />
          </div>
        ) : comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((c) => (
              <DoubtCommentItem
                key={c.id}
                comment={c}
                doubtId={doubt.id}
                onCommentUpdated={fetchComments}
                depth={0}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center bg-card border border-border rounded-2xl p-6">
            <MessageSquare size={28} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-sm font-semibold text-foreground">No answers yet</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Know the answer? Help out by posting your solution above!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoubtDetail;
