import React, { useState, useEffect } from "react";
import { Loader2, ThumbsUp } from "lucide-react";
import apiClient from "../../../config/ApiClient";

const ProblemDiscussionTab = ({ problemId }) => {
  const [discussions, setDiscussions] = useState([]);
  const [loadingDiscussions, setLoadingDiscussions] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        setLoadingDiscussions(true);
        const res = await apiClient.get(
          `/problem/discussion/problem/${problemId}`
        );
        if (res.data?.success) {
          setDiscussions(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching discussions:", err);
      } finally {
        setLoadingDiscussions(false);
      }
    };
    if (problemId) fetchDiscussions();
  }, [problemId]);

  const handleNewPost = async () => {
    if (!newPostContent.trim()) return;
    try {
      setIsPosting(true);
      const res = await apiClient.post("/problem/discussion", {
        problemsId: problemId,
        content: newPostContent,
        isEditorial: false,
      });
      if (res.data?.success) {
        setNewPostContent("");
        setDiscussions((prev) => [res.data.data, ...prev]);
      }
    } catch (err) {
      console.error("Error creating post:", err);
    } finally {
      setIsPosting(false);
    }
  };

  const handleLikeToggle = async (discussionId, currentlyLiked) => {
    try {
      if (currentlyLiked) {
        const res = await apiClient.delete(
          `/problem/discussion/${discussionId}/like`
        );
        if (res.data?.success) {
          setDiscussions((prev) =>
            prev.map((d) =>
              (d.ID || d.id) === discussionId
                ? {
                    ...d,
                    likeCount: res.data.data.likeCount,
                    hasLikedLocally: false,
                  }
                : d
            )
          );
        }
      } else {
        const res = await apiClient.post(
          `/problem/discussion/${discussionId}/like`
        );
        if (res.data?.success) {
          setDiscussions((prev) =>
            prev.map((d) =>
              (d.ID || d.id) === discussionId
                ? {
                    ...d,
                    likeCount: res.data.data.likeCount,
                    hasLikedLocally: true,
                  }
                : d
            )
          );
        }
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  return (
    <div className="text-sm text-neutral-700 dark:text-neutral-300 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg text-neutral-900 dark:text-white">
          Discussion
        </h3>
      </div>

      <div className="mb-6 flex flex-col gap-3">
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="Share your thoughts or approach..."
          className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-neutral-900 dark:text-white"
          rows={3}
        />
        <div className="flex justify-end">
          <button
            onClick={handleNewPost}
            disabled={isPosting || !newPostContent.trim()}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
          >
            {isPosting && <Loader2 className="w-4 h-4 animate-spin" />}
            Post
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {loadingDiscussions ? (
          <div className="flex justify-center p-4">
            <Loader2 className="w-6 h-6 animate-spin text-purple-600 dark:text-[#9A7DFF]" />
          </div>
        ) : discussions.length > 0 ? (
          discussions.map((discussion) => (
            <div
              key={discussion.ID || discussion.id}
              className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-700 dark:text-purple-400 font-bold uppercase">
                  {discussion.username ? discussion.username.charAt(0) : "U"}
                </div>
                <div>
                  <div className="font-medium text-neutral-900 dark:text-white">
                    {discussion.username ||
                      `User ${discussion.userId || "Anonymous"}`}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {discussion.createdAt
                      ? new Date(discussion.createdAt).toLocaleString()
                      : "Recently"}
                  </div>
                </div>
              </div>
              <p className="whitespace-pre-wrap">{discussion.content}</p>

              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 font-medium">
                <button
                  onClick={() =>
                    handleLikeToggle(
                      discussion.ID || discussion.id,
                      discussion.hasLikedLocally
                    )
                  }
                  className={`flex items-center gap-1.5 transition-colors ${
                    discussion.hasLikedLocally
                      ? "text-purple-600 dark:text-purple-400"
                      : "hover:text-purple-600 dark:hover:text-purple-400"
                  }`}
                >
                  <ThumbsUp
                    className={`w-4 h-4 ${
                      discussion.hasLikedLocally ? "fill-current" : ""
                    }`}
                  />
                  <span>{discussion.likeCount || 0}</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-4 text-neutral-500">
            No discussions yet. Be the first to start one!
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemDiscussionTab;
