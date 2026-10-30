import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  Heart,
  MessageSquare,
  Trash2,
  Send,
  Upload,
  Sparkles,
  Loader2,
  Clock,
  MoreVertical,
  X,
  Code2,
  Copy,
  Check,
  Share2,
  Bookmark,
  Flag,
} from "lucide-react";
import toast from "react-hot-toast";
import groupApi from "../../services/groupApi";
import { supabase } from "../../config/SupabaseClient";
import useAuth from "../../store/AuthStore";
import { formatRelativeTime } from "../doubt/DoubtCard";

const CodeBlockView = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const displayLang =
    language?.toLowerCase() === "python" || language?.toLowerCase() === "py"
      ? "Python 3"
      : language?.toLowerCase() === "cpp" || language?.toLowerCase() === "c++"
      ? "C++"
      : language?.toLowerCase() === "javascript" || language?.toLowerCase() === "js"
      ? "JavaScript"
      : language?.toLowerCase() === "typescript" || language?.toLowerCase() === "ts"
      ? "TypeScript"
      : language?.toLowerCase() === "java"
      ? "Java"
      : language || "Code";

  return (
    <div className="rounded-xl overflow-hidden border border-[#26283d] bg-[#0c0d14] my-3">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#26283d] bg-[#141524] text-[11px] text-zinc-400 font-medium">
        <span className="text-zinc-300 font-semibold">{displayLang}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="hover:text-white transition-colors cursor-pointer"
          title="Copy code"
        >
          {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs font-mono text-zinc-200 leading-relaxed bg-[#0c0d14]">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const PostContentRenderer = ({ content }) => {
  if (!content) return null;

  const codeRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = codeRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        text: content.slice(lastIndex, match.index),
      });
    }
    parts.push({
      type: "code",
      language: match[1] || "code",
      code: match[2],
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({
      type: "text",
      text: content.slice(lastIndex),
    });
  }

  if (parts.length === 0) {
    return (
      <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-line mb-3">
        {content}
      </p>
    );
  }

  return (
    <div className="space-y-2 mb-3">
      {parts.map((part, index) => {
        if (part.type === "text") {
          return (
            <p key={index} className="text-sm text-zinc-200 leading-relaxed whitespace-pre-line">
              {part.text}
            </p>
          );
        }
        return (
          <CodeBlockView key={index} language={part.language} code={part.code} />
        );
      })}
    </div>
  );
};

const GroupFeed = ({ groupId, isMember, isAdmin, groupName = "the group" }) => {
  const currentUser = useAuth((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // New post state
  const [postContent, setPostContent] = useState("");
  const [postMediaUrl, setPostMediaUrl] = useState("");
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [submittingPost, setSubmittingPost] = useState(false);

  // Code snippet attachment toggle
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [snippetCode, setSnippetCode] = useState("");
  const [snippetLang, setSnippetLang] = useState("python");

  // Comments state: map of postId -> { open: boolean, loading: boolean, comments: [] }
  const [commentsState, setCommentsState] = useState({});
  const [newCommentText, setNewCommentText] = useState({});
  const [submittingComment, setSubmittingComment] = useState({});
  const [bookmarked, setBookmarked] = useState({});

  const fetchFeed = async (pageNum = 0, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const data = await groupApi.getGroupFeed(groupId, {
        page: pageNum,
        size: 10,
        sortBy: "createdAt",
        direction: "desc",
      });

      const content = data?.content || [];
      setTotalPages(data?.totalPages || 1);
      setPage(pageNum);

      if (append) {
        setPosts((prev) => [...prev, ...content]);
      } else {
        setPosts(content);
      }

      // Auto-load comments for posts that have comments
      content.forEach(async (p) => {
        if (p.commentCount > 0) {
          try {
            const commentsData = await groupApi.getPostComments(groupId, p.id);
            setCommentsState((prev) => ({
              ...prev,
              [p.id]: {
                open: true,
                loading: false,
                comments: Array.isArray(commentsData) ? commentsData : [],
              },
            }));
          } catch (e) {
            // Ignore auto fetch error
          }
        }
      });
    } catch (err) {
      console.error("Error fetching group feed:", err);
      toast.error("Failed to load group posts");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (groupId) {
      fetchFeed(0, false);
    }
  }, [groupId]);

  const handleMediaUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be under 5MB");
      return;
    }

    setUploadingMedia(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `post_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;

      let publicUrl = "";
      const { error: uploadError } = await supabase.storage
        .from("post_images")
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        const { error: fallbackError } = await supabase.storage
          .from("profile_photos")
          .upload(fileName, file, { upsert: true });

        if (fallbackError) throw uploadError;

        publicUrl = supabase.storage
          .from("profile_photos")
          .getPublicUrl(fileName).data.publicUrl;
      } else {
        publicUrl = supabase.storage
          .from("post_images")
          .getPublicUrl(fileName).data.publicUrl;
      }

      setPostMediaUrl(publicUrl);
      toast.success("Image attached!");
    } catch (err) {
      console.warn("Storage upload note:", err);
      toast.error("Could not upload image. Try again.");
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    let finalContent = postContent.trim();
    if (showCodeInput && snippetCode.trim()) {
      finalContent = `${finalContent}\n\n\`\`\`${snippetLang}\n${snippetCode.trim()}\n\`\`\``.trim();
    }

    if (!finalContent) {
      toast.error("Post content cannot be empty");
      return;
    }

    setSubmittingPost(true);
    try {
      const newPost = await groupApi.createPost(groupId, {
        content: finalContent,
        mediaUrl: postMediaUrl || null,
      });

      toast.success("Post published!");
      setPostContent("");
      setSnippetCode("");
      setShowCodeInput(false);
      setPostMediaUrl("");
      setPosts((prev) => [newPost, ...prev]);
    } catch (err) {
      console.error("Post creation error:", err);
      toast.error(err?.response?.data?.message || "Failed to publish post");
    } finally {
      setSubmittingPost(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await groupApi.deletePost(groupId, postId);
      toast.success("Post deleted");
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete post");
    }
  };

  const handleToggleLike = async (post) => {
    const currentlyLiked = Boolean(post.hasLiked);
    const currentCount = Number(post.likeCount || 0);

    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? {
              ...p,
              hasLiked: !currentlyLiked,
              likeCount: currentlyLiked
                ? Math.max(0, currentCount - 1)
                : currentCount + 1,
            }
          : p
      )
    );

    try {
      await groupApi.toggleLike(groupId, post.id);
    } catch (err) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id
            ? {
                ...p,
                hasLiked: currentlyLiked,
                likeCount: currentCount,
              }
            : p
        )
      );
      toast.error("Could not update like");
    }
  };

  const toggleCommentsDrawer = async (postId) => {
    const isCurrentlyOpen = commentsState[postId]?.open;

    if (isCurrentlyOpen) {
      setCommentsState((prev) => ({
        ...prev,
        [postId]: { ...prev[postId], open: false },
      }));
      return;
    }

    setCommentsState((prev) => ({
      ...prev,
      [postId]: {
        open: true,
        loading: true,
        comments: prev[postId]?.comments || [],
      },
    }));

    try {
      const comments = await groupApi.getComments(groupId, postId);
      setCommentsState((prev) => ({
        ...prev,
        [postId]: {
          open: true,
          loading: false,
          comments: Array.isArray(comments) ? comments : [],
        },
      }));
    } catch (err) {
      console.error("Error fetching comments:", err);
      toast.error("Failed to load comments");
      setCommentsState((prev) => ({
        ...prev,
        [postId]: { ...prev[postId], loading: false },
      }));
    }
  };

  const handleAddComment = async (postId) => {
    const text = newCommentText[postId]?.trim();
    if (!text) return;

    setSubmittingComment((prev) => ({ ...prev, [postId]: true }));
    try {
      const added = await groupApi.addComment(groupId, postId, {
        content: text,
      });

      setCommentsState((prev) => ({
        ...prev,
        [postId]: {
          ...prev[postId],
          comments: [...(prev[postId]?.comments || []), added],
        },
      }));

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, commentCount: (p.commentCount || 0) + 1 }
            : p
        )
      );

      setNewCommentText((prev) => ({ ...prev, [postId]: "" }));
      toast.success("Comment added");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to post comment");
    } finally {
      setSubmittingComment((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      await groupApi.deleteComment(groupId, postId, commentId);
      setCommentsState((prev) => ({
        ...prev,
        [postId]: {
          ...prev[postId],
          comments: prev[postId]?.comments?.filter((c) => c.id !== commentId),
        },
      }));

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, commentCount: Math.max(0, (p.commentCount || 1) - 1) }
            : p
        )
      );
      toast.success("Comment deleted");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete comment");
    }
  };

  const userAvatar =
    currentUser?.profilePic ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      currentUser?.username || "You"
    )}&background=7c3aed&color=fff&bold=true`;

  return (
    <div className="space-y-6">
      {/* ───────── Share Box (Like in Screenshot) ───────── */}
      {isMember && (
        <div className="bg-[#13141f] border border-[#25273b] rounded-2xl p-4 sm:p-5 shadow-xl">
          <form onSubmit={handleCreatePost} className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={userAvatar}
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover border border-white/10 flex-shrink-0"
              />
              <input
                type="text"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder={`Share with ${groupName}...`}
                className="flex-1 bg-[#0c0d14] border border-[#26283d] focus:border-[#7c3aed] outline-none rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 transition-all"
              />
              <button
                type="submit"
                disabled={submittingPost || (!postContent.trim() && !snippetCode.trim())}
                className="px-6 py-2 rounded-full text-xs font-bold bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-md shadow-[#7c3aed]/25 transition-all cursor-pointer disabled:opacity-50 flex-shrink-0"
              >
                {submittingPost ? "POSTING..." : "POST"}
              </button>
            </div>

            {/* Optional attachments bar */}
            <div className="flex items-center gap-3 pt-1 pl-13 text-xs text-zinc-400">
              <button
                type="button"
                onClick={() => setShowCodeInput((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border transition-colors cursor-pointer ${
                  showCodeInput
                    ? "border-[#7c3aed] text-[#c084fc] bg-[#7c3aed]/10"
                    : "border-white/10 text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Code2 size={13} />
                <span>{showCodeInput ? "Remove Code" : "Attach Code"}</span>
              </button>

              <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                <Upload size={13} />
                <span>{uploadingMedia ? "Uploading..." : "Attach Image"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMediaUpload}
                  disabled={uploadingMedia}
                  className="hidden"
                />
              </label>

              {postMediaUrl && (
                <span className="text-[11px] text-emerald-400">✓ Image ready</span>
              )}
            </div>

            {/* Code Snippet Editor Drawer */}
            {showCodeInput && (
              <div className="rounded-xl border border-[#26283d] bg-[#0c0d14] p-3 space-y-2 mt-2">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span className="font-semibold">Code Snippet</span>
                  <select
                    value={snippetLang}
                    onChange={(e) => setSnippetLang(e.target.value)}
                    className="bg-[#141524] border border-[#26283d] rounded-lg px-2.5 py-1 text-xs text-white outline-none"
                  >
                    <option value="python">Python 3</option>
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="go">Go</option>
                  </select>
                </div>
                <textarea
                  rows={4}
                  value={snippetCode}
                  onChange={(e) => setSnippetCode(e.target.value)}
                  placeholder="// Paste your code solution here..."
                  className="w-full p-3 bg-black/40 rounded-lg font-mono text-xs text-emerald-400 outline-none resize-y border border-[#26283d]"
                />
              </div>
            )}
          </form>
        </div>
      )}

      {/* ───────── Feed Stream ───────── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="animate-spin text-[#7c3aed]" size={32} />
          <p className="text-sm text-zinc-400">Loading feed...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-[#13141f] border border-[#25273b] rounded-2xl p-10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#7c3aed]/10 text-[#7c3aed] mx-auto flex items-center justify-center mb-3">
            <MessageSquare size={24} />
          </div>
          <h3 className="font-bold text-base text-white mb-1">
            No posts yet
          </h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Be the first to share an update, solution approach, or start a discussion!
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {posts.map((post) => {
            const authorAvatar =
              post.authorProfilePic ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                post.authorUsername || "Author"
              )}&background=7c3aed&color=fff&bold=true`;

            const canDelete = post.isAuthor || isAdmin;
            const commentsInfo = commentsState[post.id] || {
              open: false,
              loading: false,
              comments: [],
            };

            return (
              <div
                key={post.id}
                className="bg-[#13141f] border border-[#25273b] rounded-2xl p-5 sm:p-6 shadow-xl"
              >
                {/* Post Author Header */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={authorAvatar}
                      alt={post.authorUsername}
                      className="w-10 h-10 rounded-full object-cover border border-white/10 bg-[#0c0d14]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/user/${post.authorUsername}`}
                          className="font-bold text-sm text-white hover:text-[#c084fc] transition-colors"
                        >
                          {post.authorUsername}
                        </Link>
                        <span className="text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                          Gold
                        </span>
                        <span className="text-xs text-zinc-500">
                          &middot; {formatRelativeTime(post.createdAt)}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        @{post.authorUsername}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {canDelete ? (
                      <button
                        type="button"
                        onClick={() => handleDeletePost(post.id)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Delete post"
                      >
                        <Trash2 size={15} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => toast("Post options")}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-white transition-colors cursor-pointer"
                        title="Options"
                      >
                        <MoreVertical size={15} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Post Content (with code rendering) */}
                <PostContentRenderer content={post.content} />

                {/* Attached Image / Media */}
                {post.mediaUrl && (
                  <div className="mb-4 rounded-xl overflow-hidden border border-[#25273b] max-w-lg">
                    <img
                      src={post.mediaUrl}
                      alt="Post visual"
                      className="w-full max-h-96 object-cover bg-black/40"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Post Interaction Row */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <div className="flex items-center gap-6">
                    <button
                      type="button"
                      onClick={() => handleToggleLike(post)}
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                        post.hasLiked ? "text-red-400" : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      <Heart
                        size={15}
                        className={post.hasLiked ? "fill-red-400 text-red-400" : ""}
                      />
                      <span>{post.likeCount || 0}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleCommentsDrawer(post.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <MessageSquare size={15} />
                      <span>{post.commentCount || 0}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success("Post link copied!");
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      title="Share post"
                    >
                      <Share2 size={14} />
                      <span>{post.commentCount > 0 ? "12" : "0"}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-zinc-500">
                    <button
                      type="button"
                      onClick={() => {
                        setBookmarked((prev) => ({ ...prev, [post.id]: !prev[post.id] }));
                        toast.success(bookmarked[post.id] ? "Removed from bookmarks" : "Saved to bookmarks");
                      }}
                      className="hover:text-white transition-colors cursor-pointer"
                      title="Save post"
                    >
                      <Bookmark size={15} className={bookmarked[post.id] ? "fill-white text-white" : ""} />
                    </button>
                    <button
                      type="button"
                      onClick={() => toast.success("Post reported for review")}
                      className="hover:text-white transition-colors cursor-pointer"
                      title="Report post"
                    >
                      <Flag size={14} />
                    </button>
                  </div>
                </div>

                {/* Comments Section */}
                {((commentsInfo.open && commentsInfo.comments.length > 0) || isMember) && (
                  <div className="mt-4 pt-3 border-t border-white/5 space-y-3">
                    {/* Comments list */}
                    {commentsInfo.loading ? (
                      <div className="py-2 text-center">
                        <Loader2
                          className="animate-spin text-[#7c3aed] mx-auto"
                          size={16}
                        />
                      </div>
                    ) : (
                      commentsInfo.comments.length > 0 && (
                        <div className="space-y-2.5">
                          {commentsInfo.comments.map((comment) => {
                            const canDeleteComment =
                              comment.authorId === currentUser?.id || isAdmin;
                            const cAvatar =
                              comment.authorProfilePic ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                comment.authorUsername || "User"
                              )}&background=7c3aed&color=fff`;

                            return (
                              <div
                                key={comment.id}
                                className="flex items-start justify-between gap-2.5 bg-[#0c0d14] rounded-xl p-3 border border-[#25273b]"
                              >
                                <div className="flex items-start gap-2.5 min-w-0">
                                  <img
                                    src={cAvatar}
                                    alt={comment.authorUsername}
                                    className="w-7 h-7 rounded-full object-cover border border-white/10 flex-shrink-0 mt-0.5"
                                  />
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <Link
                                        to={`/user/${comment.authorUsername}`}
                                        className="font-bold text-xs text-white hover:text-[#c084fc] transition-colors"
                                      >
                                        {comment.authorUsername}
                                      </Link>
                                      <span className="text-[10px] text-zinc-500">
                                        &middot; {formatRelativeTime(comment.createdAt)}
                                      </span>
                                    </div>
                                    <p className="text-xs text-zinc-300 mt-1 whitespace-pre-wrap">
                                      {comment.content}
                                    </p>
                                  </div>
                                </div>

                                {canDeleteComment && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeleteComment(post.id, comment.id)
                                    }
                                    className="p-1 rounded-md text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                                    title="Delete comment"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )
                    )}

                    {/* Add comment input */}
                    {isMember && (
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          value={newCommentText[post.id] || ""}
                          onChange={(e) =>
                            setNewCommentText((prev) => ({
                              ...prev,
                              [post.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleAddComment(post.id);
                            }
                          }}
                          placeholder="Write a comment..."
                          className="flex-1 bg-[#0c0d14] border border-[#25273b] focus:border-[#7c3aed] outline-none rounded-xl px-4 py-2 text-xs text-white placeholder:text-zinc-500 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddComment(post.id)}
                          disabled={
                            submittingComment[post.id] ||
                            !newCommentText[post.id]?.trim()
                          }
                          className="w-8 h-8 rounded-full bg-[#7c3aed] text-white hover:bg-[#6d28d9] flex items-center justify-center transition-colors disabled:opacity-40 cursor-pointer flex-shrink-0 shadow-md shadow-[#7c3aed]/20"
                          title="Send comment"
                        >
                          <Send size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Load More Button */}
          {page + 1 < totalPages && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => fetchFeed(page + 1, true)}
                disabled={loadingMore}
                className="px-6 py-2.5 rounded-full text-xs font-bold bg-[#141524] hover:bg-[#1e1f32] text-white border border-[#25273b] transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loadingMore ? "Loading more..." : "Load Older Posts"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GroupFeed;
