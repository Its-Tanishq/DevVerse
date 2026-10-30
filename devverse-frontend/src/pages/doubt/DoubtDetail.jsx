import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  ArrowLeft,
  CheckCircle2,
  CircleDot,
  Clock,
  ChevronUp,
  ChevronDown,
  Loader2,
  Share2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import apiClient from "../../config/ApiClient";
import useAuth from "../../store/AuthStore";
import DoubtCommentItem from "../../components/doubt/DoubtCommentItem";
import { formatRelativeTime, getTagStyle } from "../../components/doubt/DoubtCard";

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
  const [answerText, setAnswerText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questionVoteDelta, setQuestionVoteDelta] = useState(0);
  const textareaRef = useRef(null);

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

  const handleQuestionVote = (type) => {
    if (!isLoggedIn) {
      toast.error("Please sign in to vote");
      return;
    }
    if (type === "UPVOTE") {
      setQuestionVoteDelta((prev) => (prev > 0 ? 0 : 1));
    } else {
      setQuestionVoteDelta((prev) => (prev < 0 ? 0 : -1));
    }
  };

  const handleMarkSolved = async (commentId) => {
    if (!isLoggedIn) {
      toast.error("Please sign in to manage solutions");
      return;
    }
    try {
      const params = commentId ? { commentId } : {};
      const res = await apiClient.patch(`/doubts/${id}/solve`, null, { params });
      if (res.data) {
        setDoubt(res.data);
        toast.success(
          res.data.isSolved
            ? "Answer marked as accepted solution!"
            : "Accepted solution removed"
        );
      }
      fetchComments();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to update accepted solution"
      );
    }
  };

  // Markdown toolbar insertion
  const insertMarkdown = (prefix, suffix = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = answerText;
    const selected = text.substring(start, end);

    const replacement = prefix + (selected || "text") + suffix;
    const nextVal = text.substring(0, start) + replacement + text.substring(end);
    setAnswerText(nextVal);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selected ? selected.length : 4)
      );
    }, 0);
  };

  const handlePostAnswer = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error("Please sign in to answer this question");
      navigate("/signin");
      return;
    }

    if (!answerText.trim()) {
      toast.error("Answer cannot be empty");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post(`/doubts/${id}/comments`, {
        content: answerText.trim(),
        parentCommentId: null,
      });

      toast.success("Answer posted successfully!");
      setAnswerText("");
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
    toast.success("Question link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 size={36} className="text-[#7c3aed] animate-spin" />
        <p className="text-sm text-muted-foreground">Loading question...</p>
      </div>
    );
  }

  if (!doubt) {
    return (
      <div className="w-[90vw] max-w-4xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold">Question Not Found</h2>
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
  const initial = (authorName || "A").trim().charAt(0).toUpperCase();

  const isAuthor =
    currentUser &&
    doubt.author &&
    (currentUser.ID === doubt.author.ID ||
      currentUser.id === doubt.author.ID ||
      currentUser.username === doubt.author.username);

  // Count total comments recursively
  const countAllComments = (list) => {
    let count = 0;
    if (!list || !Array.isArray(list)) return 0;
    for (const c of list) {
      count += 1;
      if (c.replies && c.replies.length > 0) {
        count += countAllComments(c.replies);
      }
    }
    return count;
  };
  const totalCommentsCount = countAllComments(comments);

  const baseQuestionScore = doubt.id ? ((doubt.id * 17) % 50 + 15) : 30;
  const currentQuestionScore = baseQuestionScore + questionVoteDelta;
  const viewsDisplay = doubt.views ?? (doubt.id ? (((doubt.id * 43) % 25 + 8) / 10).toFixed(1) + "K" : "1.2K");

  return (
    <div className="w-full min-h-screen bg-background text-foreground">
      <div className="w-[90vw] max-w-4xl mx-auto py-6 sm:py-8">
        {/* Back navigation & Share */}
        <div className="flex items-center justify-between mb-5">
          <Link
            to="/community"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group cursor-pointer"
          >
            <ArrowLeft
              size={15}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Doubt Forum
          </Link>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border hover:bg-accent text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <Share2 size={13} />
            Share
          </button>
        </div>

        {/* Top Question Card */}
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm mb-6 flex items-start gap-4 sm:gap-5">
          {/* Left: Question Voting */}
          <div className="flex flex-col items-center justify-start shrink-0 min-w-[32px] pt-1">
            <button
              type="button"
              onClick={() => handleQuestionVote("UPVOTE")}
              title="Upvote question"
              className={`p-0.5 rounded hover:bg-accent transition-colors cursor-pointer ${
                questionVoteDelta > 0
                  ? "text-emerald-500"
                  : "text-muted-foreground hover:text-emerald-500"
              }`}
            >
              <ChevronUp size={22} strokeWidth={questionVoteDelta > 0 ? 3 : 2} />
            </button>

            <span
              className={`text-base font-bold my-1 ${
                questionVoteDelta > 0
                  ? "text-emerald-500"
                  : questionVoteDelta < 0
                  ? "text-rose-500"
                  : "text-foreground"
              }`}
            >
              {currentQuestionScore}
            </span>

            <button
              type="button"
              onClick={() => handleQuestionVote("DOWNVOTE")}
              title="Downvote question"
              className={`p-0.5 rounded hover:bg-accent transition-colors cursor-pointer ${
                questionVoteDelta < 0
                  ? "text-rose-500"
                  : "text-muted-foreground hover:text-rose-500"
              }`}
            >
              <ChevronDown size={22} strokeWidth={questionVoteDelta < 0 ? 3 : 2} />
            </button>
          </div>

          {/* Right: Question Body & Metadata */}
          <div className="flex-1 min-w-0">
            {/* Tags & Status row */}
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
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

              {doubt.tags &&
                doubt.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-md border ${getTagStyle(
                      tag
                    )}`}
                  >
                    {tag}
                  </span>
                ))}
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight leading-snug">
              {doubt.title}
            </h1>

            {/* Description Body with formatted code blocks */}
            <div className="mt-3 text-sm text-foreground/90 space-y-3 leading-relaxed break-words font-sans">
              <ReactMarkdown
                components={{
                  p: ({ node, ...props }) => (
                    <p className="leading-relaxed whitespace-pre-wrap" {...props} />
                  ),
                  code: ({ node, inline, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || "");
                    const lang = match
                      ? match[1]
                      : className
                      ? className.replace("language-", "")
                      : "";
                    return inline ? (
                      <code
                        className="bg-muted text-foreground px-1.5 py-0.5 rounded text-xs font-mono border border-border"
                        {...props}
                      >
                        {children}
                      </code>
                    ) : (
                      <div className="rounded-xl border border-border bg-[#0a0910] dark:bg-[#0c0b12] p-4 my-3 text-xs sm:text-sm font-mono overflow-x-auto shadow-inner">
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
                {doubt.description}
              </ReactMarkdown>
            </div>

            {/* Author Footer */}
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/50">
              {author.profilePic ? (
                <img
                  src={author.profilePic}
                  alt={authorName}
                  className="w-5 h-5 rounded-full object-cover border border-border"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-[#06b6d4] text-white flex items-center justify-center text-[10px] font-bold">
                  {initial}
                </div>
              )}
              <span className="text-xs text-muted-foreground">
                <Link
                  to={authorUsername ? `/user/${authorUsername}` : "#"}
                  className="font-semibold text-foreground hover:text-[#7c3aed] transition-colors"
                >
                  {authorName}
                </Link>{" "}
                &bull; {formatRelativeTime(doubt.createdAt)} &bull; {viewsDisplay} views
              </span>
            </div>
          </div>
        </div>

        {/* "Write an Answer" Form Card */}
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm mb-8 space-y-3.5">
          <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
            Write an Answer
          </h2>

          <form onSubmit={handlePostAnswer} className="space-y-3">
            <div className="rounded-xl border border-border bg-background overflow-hidden focus-within:border-[#7c3aed] transition-colors">
              {/* Markdown Toolbar */}
              <div className="flex items-center gap-1 px-3 py-1.5 bg-muted/60 border-b border-border">
                <button
                  type="button"
                  onClick={() => insertMarkdown("**", "**")}
                  className="px-2 py-0.5 rounded text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer"
                  title="Bold"
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown("*", "*")}
                  className="px-2 py-0.5 rounded text-xs italic text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer"
                  title="Italic"
                >
                  I
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown("`", "`")}
                  className="px-2 py-0.5 rounded text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer"
                  title="Code"
                >
                  {"</>"}
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown("\n- ", "")}
                  className="px-2 py-0.5 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer"
                  title="Bullet list"
                >
                  &bull;
                </button>
              </div>

              <textarea
                ref={textareaRef}
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Share your solution or hint..."
                rows={4}
                className="w-full p-3.5 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none resize-y"
                required
              />
            </div>

            <div className="flex items-center justify-end pt-1">
              <button
                type="submit"
                disabled={isSubmitting || !answerText.trim()}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8b5cf6] via-[#9333ea] to-[#a855f7] hover:brightness-110 text-white font-semibold text-sm shadow-md shadow-[#9333ea]/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Posting...</span>
                  </>
                ) : (
                  <span>Post Answer</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Answers List Section */}
        <div>
          <h2 className="text-base sm:text-lg font-bold text-foreground mb-4">
            {totalCommentsCount} {totalCommentsCount === 1 ? "Answer" : "Answers"}
          </h2>

          {loadingComments ? (
            <div className="py-12 flex justify-center">
              <Loader2 size={24} className="text-[#7c3aed] animate-spin" />
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-4">
              {[...comments]
                .sort((a, b) => {
                  const aAccepted =
                    Boolean(a.isSolution) ||
                    (doubt?.acceptedCommentId && doubt.acceptedCommentId === a.id);
                  const bAccepted =
                    Boolean(b.isSolution) ||
                    (doubt?.acceptedCommentId && doubt.acceptedCommentId === b.id);
                  if (aAccepted && !bAccepted) return -1;
                  if (!aAccepted && bAccepted) return 1;
                  return 0;
                })
                .map((comment, index) => {
                  const isAccepted =
                    Boolean(comment.isSolution) ||
                    (doubt.acceptedCommentId &&
                      doubt.acceptedCommentId === comment.id) ||
                    (doubt.isSolved &&
                      !doubt.acceptedCommentId &&
                      index === 0);

                  return (
                    <DoubtCommentItem
                      key={comment.id}
                      comment={comment}
                      doubtId={doubt.id}
                      isAccepted={isAccepted}
                      isAuthor={isAuthor}
                      onAccept={handleMarkSolved}
                      onCommentUpdated={fetchComments}
                      depth={0}
                      index={index}
                    />
                  );
                })}
            </div>
          ) : (
            <div className="py-12 text-center bg-card border border-border rounded-2xl p-6">
              <p className="text-sm font-semibold text-foreground">No answers yet</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Know the answer? Help out by posting your solution above!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoubtDetail;
