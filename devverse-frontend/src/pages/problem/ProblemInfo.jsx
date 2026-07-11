import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import apiClient from "../../config/ApiClient";
import {
  LayoutGrid,
  ChevronRight,
  ChevronLeft,
  Shuffle,
  Timer,
  Settings2,
  SquareTerminal,
  Bookmark,
  Share2,
  FileText,
  Lightbulb,
  MessageSquare,
  BookOpen,
  Lock,
  History,
  Notebook,
  ThumbsUp,
  ThumbsDown,
  Flame,
  Code2,
  Moon,
  Minus,
  Plus,
  RotateCcw,
  Maximize,
  FileCode2,
  Play,
  Send,
  CheckCircle2,
  Clock,
  Cpu,
  ListChecks,
  X,
  Loader2,
} from "lucide-react";

const ProblemInfo = () => {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("result");
  const [leftTab, setLeftTab] = useState("description");
  const [problemData, setProblemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [discussions, setDiscussions] = useState([]);
  const [loadingDiscussions, setLoadingDiscussions] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [notes, setNotes] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [workspaceData, setWorkspaceData] = useState(null);
  const [loadingNotes, setLoadingNotes] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/problem/${identifier}`);
        if (res.data?.success) {
          setProblemData(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching problem:", err);
      } finally {
        setLoading(false);
      }
    };
    if (identifier) fetchProblem();
  }, [identifier]);

  useEffect(() => {
    if (leftTab === "discussion" && problemData) {
      const fetchDiscussions = async () => {
        try {
          setLoadingDiscussions(true);
          const problemId = problemData.ID || problemData.id;
          const res = await apiClient.get(`/problem/discussion/problem/${problemId}`);
          if (res.data?.success) {
            setDiscussions(res.data.data);
          }
        } catch (err) {
          console.error("Error fetching discussions:", err);
        } finally {
          setLoadingDiscussions(false);
        }
      };
      fetchDiscussions();
    }
  }, [leftTab, problemData]);

  useEffect(() => {
    if (leftTab === "submissions" && problemData) {
      const fetchSubmissions = async () => {
        try {
          setLoadingSubmissions(true);
          const problemId = problemData.ID || problemData.id;
          const res = await apiClient.get(`/problem/submission/problem/${problemId}`);
          if (res.data?.success) {
            setSubmissions(res.data.data);
          }
        } catch (err) {
          console.error("Error fetching submissions:", err);
        } finally {
          setLoadingSubmissions(false);
        }
      };
      fetchSubmissions();
    }
  }, [leftTab, problemData]);

  useEffect(() => {
    if (leftTab === "notes" && problemData) {
      const fetchWorkspace = async () => {
        try {
          setLoadingNotes(true);
          const problemId = problemData.ID || problemData.id;
          const res = await apiClient.get(`/problem/workspace/user/problem/${problemId}`);
          if (res.data?.success && res.data.data) {
            setWorkspaceData(res.data.data);
            setNotes(res.data.data.notes || "");
          }
        } catch (err) {
          console.error("Error fetching workspace notes:", err);
        } finally {
          setLoadingNotes(false);
        }
      };
      fetchWorkspace();
    }
  }, [leftTab, problemData]);

  const handleSaveNotes = async () => {
    try {
      setIsSavingNotes(true);
      const problemId = problemData.ID || problemData.id;
      const res = await apiClient.post("/problem/workspace", {
        problemsId: problemId,
        isBookmark: workspaceData?.isBookmark || false,
        notes: notes
      });
      if (res.data?.success) {
        setWorkspaceData(res.data.data);
      }
    } catch (err) {
      console.error("Error saving notes:", err);
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleNewPost = async () => {
    if (!newPostContent.trim()) return;
    try {
      setIsPosting(true);
      const problemId = problemData.ID || problemData.id;
      const res = await apiClient.post("/problem/discussion", {
        problemsId: problemId,
        content: newPostContent,
        isEditorial: false
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
        const res = await apiClient.delete(`/problem/discussion/${discussionId}/like`);
        if (res.data?.success) {
          setDiscussions((prev) => 
            prev.map((d) => 
              (d.ID || d.id) === discussionId 
                ? { ...d, likeCount: res.data.data.likeCount, hasLikedLocally: false } 
                : d
            )
          );
        }
      } else {
        const res = await apiClient.post(`/problem/discussion/${discussionId}/like`);
        if (res.data?.success) {
          setDiscussions((prev) => 
            prev.map((d) => 
              (d.ID || d.id) === discussionId 
                ? { ...d, likeCount: res.data.data.likeCount, hasLikedLocally: true } 
                : d
            )
          );
        }
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-white dark:bg-[#1a1a1a]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600 dark:text-[#9A7DFF]" />
      </div>
    );
  }

  if (!problemData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full bg-white dark:bg-[#1a1a1a]">
        <h2 className="text-xl font-bold text-neutral-500 mb-4">Problem not found.</h2>
        <button onClick={() => navigate("/problemset")} className="text-purple-600 hover:underline">Return to Problemset</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-white dark:bg-[#1a1a1a] text-neutral-700 dark:text-neutral-300 font-sans transition-colors">
      <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-[#1a1a1a] text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800 h-12 w-full shrink-0 transition-colors">
        <div className="flex items-center space-x-2">
          <button onClick={() => navigate("/problemset")} className="flex items-center space-x-1.5 hover:text-neutral-900 dark:hover:text-white transition-colors">
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Problems</span>
          </button>
          <ChevronRight className="w-3 h-3 text-neutral-400 dark:text-neutral-500" />
          <span className="text-neutral-900 dark:text-white font-medium">
            #{problemData.ID || problemData.id} - {problemData.title}
          </span>
        </div>

        <div className="flex items-center space-x-2 hidden md:flex">
          <button className="p-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
            <Shuffle className="w-3.5 h-3.5" />
            <span>Pick random</span>
          </button>
          <button className="p-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors">
            <Timer className="w-4 h-4 text-amber-500" />
            <span className="font-medium font-mono text-[13px]">12:48</span>
          </button>
          <button className="p-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
            <Settings2 className="w-4 h-4" />
          </button>
          <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
            <SquareTerminal className="w-4 h-4" />
            <span>Console</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/2 flex flex-col border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1a1a1a] overflow-y-auto p-6 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 text-sm font-medium">
              <span className="text-neutral-500">#{problemData.ID || problemData.id}</span>
              <span className={`px-2 py-0.5 rounded-full ${problemData.difficulty === 'Easy' ? 'text-emerald-600 dark:text-emerald-500 bg-emerald-100 dark:bg-emerald-500/10' : problemData.difficulty === 'Medium' ? 'text-orange-600 dark:text-orange-500 bg-orange-100 dark:bg-orange-500/10' : 'text-red-600 dark:text-red-500 bg-red-100 dark:bg-red-500/10'}`}>
                {problemData.difficulty}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-amber-500 transition-colors border border-neutral-200 dark:border-neutral-700">
                <Bookmark className={`w-4 h-4 ${problemData.bookmarked ? 'fill-amber-500' : ''}`} />
              </button>
              <button className="p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors border border-neutral-200 dark:border-neutral-700">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
            {problemData.title}
          </h1>

          <div className="flex items-center gap-2 mb-6 flex-wrap">
            {problemData.tags?.map((tag) => (
              <span
                key={tag.id || tag.name || tag}
                className="text-xs font-medium text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800/80 px-3 py-1.5 rounded-full"
              >
                {tag.name || tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1 border-b border-neutral-200 dark:border-neutral-800 mb-6">
            <button
              onClick={() => setLeftTab("description")}
              className={`flex items-center gap-2 px-4 py-2 transition-colors ${leftTab === "description" ? "border-b-2 border-purple-600 dark:border-purple-500 text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10" : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50"}`}
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">Description</span>
            </button>
            <button
              onClick={() => setLeftTab("hints")}
              className={`flex items-center gap-2 px-4 py-2 transition-colors ${leftTab === "hints" ? "border-b-2 border-purple-600 dark:border-purple-500 text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10" : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50"}`}
            >
              <Lightbulb className="w-4 h-4" />
              <span className="text-sm font-medium">Hints</span>
            </button>
            <button
              onClick={() => setLeftTab("discussion")}
              className={`flex items-center gap-2 px-4 py-2 transition-colors ${leftTab === "discussion" ? "border-b-2 border-purple-600 dark:border-purple-500 text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10" : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50"}`}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm font-medium">Discussion</span>
            </button>
            <button
              onClick={() => setLeftTab("editorial")}
              className={`flex items-center gap-2 px-4 py-2 transition-colors ${leftTab === "editorial" ? "border-b-2 border-purple-600 dark:border-purple-500 text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10" : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50"}`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-medium">Editorial</span>
              <Lock className="w-3 h-3 text-amber-500" />
            </button>
            <button
              onClick={() => setLeftTab("submissions")}
              className={`flex items-center gap-2 px-4 py-2 transition-colors ${leftTab === "submissions" ? "border-b-2 border-purple-600 dark:border-purple-500 text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10" : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50"}`}
            >
              <History className="w-4 h-4" />
              <span className="text-sm font-medium">Submissions</span>
            </button>
            <button
              onClick={() => setLeftTab("notes")}
              className={`flex items-center gap-2 px-4 py-2 transition-colors ${leftTab === "notes" ? "border-b-2 border-purple-600 dark:border-purple-500 text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10" : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50"}`}
            >
              <Notebook className="w-4 h-4" />
              <span className="text-sm font-medium">Notes</span>
            </button>
          </div>

          {leftTab === "description" && (
            <div className="text-sm text-neutral-700 dark:text-neutral-300 space-y-4 mb-8 leading-relaxed prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: problemData.description }}>
            </div>
          )}

          {leftTab === "hints" && (
            <div className="text-sm text-neutral-700 dark:text-neutral-300 space-y-4 mb-8">
              {problemData.hints ? problemData.hints.split('\n').map((hint, i) => hint.trim() && (
                <div key={i} className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
                  <div className="font-bold mb-2 text-neutral-900 dark:text-white">
                    Hint {i + 1}
                  </div>
                  <p dangerouslySetInnerHTML={{ __html: hint }}></p>
                </div>
              )) : (
                <p className="text-neutral-500">No hints available.</p>
              )}
            </div>
          )}

          {leftTab === "discussion" && (
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
                          {discussion.username ? discussion.username.charAt(0) : 'U'}
                        </div>
                        <div>
                          <div className="font-medium text-neutral-900 dark:text-white">
                            {discussion.username || `User ${discussion.userId || "Anonymous"}`}
                          </div>
                          <div className="text-xs text-neutral-500">
                            {discussion.createdAt ? new Date(discussion.createdAt).toLocaleString() : 'Recently'}
                          </div>
                        </div>
                      </div>
                      <p className="whitespace-pre-wrap">{discussion.content}</p>
                      
                      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 font-medium">
                        <button 
                          onClick={() => handleLikeToggle(discussion.ID || discussion.id, discussion.hasLikedLocally)} 
                          className={`flex items-center gap-1.5 transition-colors ${discussion.hasLikedLocally ? 'text-purple-600 dark:text-purple-400' : 'hover:text-purple-600 dark:hover:text-purple-400'}`}
                        >
                          <ThumbsUp className={`w-4 h-4 ${discussion.hasLikedLocally ? 'fill-current' : ''}`} />
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
          )}

          {leftTab === "submissions" && (
            <div className="text-sm text-neutral-700 dark:text-neutral-300 mb-8 overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap min-w-[500px]">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500">
                    <th className="py-3 font-medium">Time Submitted</th>
                    <th className="py-3 font-medium">Status</th>
                    <th className="py-3 font-medium">Runtime</th>
                    <th className="py-3 font-medium">Memory</th>
                    <th className="py-3 font-medium">Language</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingSubmissions ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-purple-600 dark:text-[#9A7DFF]" />
                      </td>
                    </tr>
                  ) : submissions.length > 0 ? (
                    submissions.map((sub) => (
                      <tr key={sub.ID || sub.id} className="border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                        <td className="py-3">{sub.createdAt ? new Date(sub.createdAt).toLocaleString() : 'N/A'}</td>
                        <td className={`py-3 font-medium ${sub.status === 'ACCEPTED' ? 'text-emerald-600 dark:text-emerald-500' : 'text-red-600 dark:text-red-500'}`}>
                          {sub.status || 'N/A'}
                        </td>
                        <td className="py-3">{sub.executionTimeMs != null ? `${sub.executionTimeMs} ms` : 'N/A'}</td>
                        <td className="py-3">{sub.memoryUsedKb != null ? `${(sub.memoryUsedKb / 1024).toFixed(1)} MB` : 'N/A'}</td>
                        <td className="py-3">{sub.language || 'N/A'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-neutral-500">
                        No submissions yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {leftTab === "notes" && (
            <div className="text-sm text-neutral-700 dark:text-neutral-300 mb-8 flex flex-col h-64">
              {loadingNotes ? (
                <div className="flex-1 flex items-center justify-center border border-neutral-200 dark:border-neutral-800 rounded-lg">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-600 dark:text-[#9A7DFF]" />
                </div>
              ) : (
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="flex-1 w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-neutral-900 dark:text-white"
                  placeholder="Write your notes for this problem here..."
                />
              )}
              <div className="flex justify-end mt-4">
                <button 
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes || loadingNotes}
                  className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 transition-colors text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                >
                  {isSavingNotes && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Notes
                </button>
              </div>
            </div>
          )}

          {leftTab === "editorial" && (
            <div className="text-sm text-neutral-700 dark:text-neutral-300 mb-8">
              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-6 mb-8 flex flex-col items-center justify-center text-center">
                <Lock className="w-10 h-10 text-amber-500 mb-3" />
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                  Premium Editorial
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4 max-w-sm">
                  Unlock this editorial to get an in-depth video explanation,
                  interactive visualizations, and optimal solutions.
                </p>
                <button className="bg-amber-500 hover:bg-amber-600 transition-colors text-white px-6 py-2.5 rounded-lg font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                  Unlock with Premium
                </button>
              </div>

              <div className="opacity-40 select-none pointer-events-none blur-[3px]">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                  Approach 1: Dynamic Programming (Bottom-Up)
                </h2>
                <p className="mb-4">
                  The problem asks us to find the number of ways to make up the{" "}
                  <code className="text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/10 px-1.5 py-0.5 rounded text-[13px]">
                    amount
                  </code>{" "}
                  using the given{" "}
                  <code className="text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/10 px-1.5 py-0.5 rounded text-[13px]">
                    coins
                  </code>
                  . This is a classic variation of the unbounded knapsack
                  problem.
                </p>
                <h4 className="font-bold text-neutral-900 dark:text-white mb-2">
                  Intuition
                </h4>
                <p className="mb-4">
                  Let{" "}
                  <code className="text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/10 px-1.5 py-0.5 rounded text-[13px]">
                    dp[i]
                  </code>{" "}
                  be the number of ways to make change for the amount{" "}
                  <code className="text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/10 px-1.5 py-0.5 rounded text-[13px]">
                    i
                  </code>
                  . We initialize{" "}
                  <code className="text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/10 px-1.5 py-0.5 rounded text-[13px]">
                    dp[0] = 1
                  </code>{" "}
                  because there is exactly one way to make change for zero
                  amount (by using no coins).
                </p>
                <div className="bg-neutral-50 dark:bg-[#1e1e1e] border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 font-mono text-sm mb-4 leading-relaxed text-neutral-800 dark:text-neutral-300">
                  <span className="text-pink-600 dark:text-pink-500">def</span>{" "}
                  <span className="text-blue-600 dark:text-blue-400">
                    change
                  </span>
                  (amount, coins):
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;dp = [
                  <span className="text-emerald-600 dark:text-emerald-500">
                    0
                  </span>
                  ] * (amount +{" "}
                  <span className="text-emerald-600 dark:text-emerald-500">
                    1
                  </span>
                  )<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;dp[
                  <span className="text-emerald-600 dark:text-emerald-500">
                    0
                  </span>
                  ] ={" "}
                  <span className="text-emerald-600 dark:text-emerald-500">
                    1
                  </span>
                  <br />
                </div>
              </div>
            </div>
          )}

          <div className="mt-auto pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-neutral-500 font-medium">Acceptance</span>
                <span className="text-emerald-600 dark:text-emerald-500 font-bold">
                  61.4%
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-neutral-500 font-medium">
                  Submissions
                </span>
                <span className="text-neutral-900 dark:text-white font-bold">
                  1.2M
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-neutral-500 font-medium">Difficulty</span>
                <span className="text-orange-600 dark:text-orange-500 font-bold">
                  {problemData.difficulty}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-1/2 flex flex-col bg-neutral-50 dark:bg-[#1e1e1e] transition-colors">
          <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1a1a1a] text-xs transition-colors">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-colors text-neutral-900 dark:text-white font-medium">
                <Code2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Python 3</span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 rotate-90" />
              </button>
              <button className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                <Moon className="w-4 h-4" />
                <span>Dark</span>
              </button>
              <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-md overflow-hidden bg-neutral-100 dark:bg-neutral-800/50">
                <button className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-white text-neutral-500 dark:text-neutral-400 transition-colors">
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-neutral-900 dark:text-white font-medium">
                  14
                </span>
                <button className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-white text-neutral-500 dark:text-neutral-400 transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors border border-neutral-300 dark:border-neutral-700 rounded-md bg-neutral-100 dark:bg-neutral-800/50 hover:bg-neutral-200 dark:hover:bg-neutral-700">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
              <button className="p-1.5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors border border-neutral-300 dark:border-neutral-700 rounded-md bg-neutral-100 dark:bg-neutral-800/50 hover:bg-neutral-200 dark:hover:bg-neutral-700">
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1 px-4 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1a1a1a] transition-colors">
            <div className="flex items-center gap-2 px-4 py-2 border-t-2 border-purple-600 dark:border-purple-500 bg-neutral-50 dark:bg-[#1e1e1e] text-purple-700 dark:text-purple-400 text-sm">
              <FileCode2 className="w-4 h-4" />
              <span className="font-medium">solution.py</span>
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 ml-1"></div>
            </div>
            <button className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 flex bg-white dark:bg-[#121212] p-4 font-mono text-[14px] leading-loose overflow-y-auto transition-colors">
            <div className="flex flex-col text-neutral-400 dark:text-neutral-600 text-right pr-4 select-none border-r border-neutral-200 dark:border-neutral-800 min-h-full">
              {[...Array(20)].map((_, i) => (
                <span key={i}>{i + 1}</span>
              ))}
            </div>
            <div className="pl-4 text-neutral-800 dark:text-neutral-300 whitespace-pre">
              <span className="text-pink-600 dark:text-pink-500">class</span>{" "}
              <span className="text-blue-600 dark:text-blue-400">Solution</span>
              :<br />
              {"    "}
              <span className="text-pink-600 dark:text-pink-500">def</span>{" "}
              <span className="text-blue-600 dark:text-blue-400">change</span>
              (self, amount:{" "}
              <span className="text-emerald-600 dark:text-emerald-400">
                int
              </span>
              , coins: List[
              <span className="text-emerald-600 dark:text-emerald-400">
                int
              </span>
              ]) -{">"}{" "}
              <span className="text-emerald-600 dark:text-emerald-400">
                int
              </span>
              :<br />
              {"        "}
              <span className="text-neutral-500">
                # dp[i] = number of ways to make amount i
              </span>
              <br />
              {"        "}dp = [
              <span className="text-orange-600 dark:text-orange-400">0</span>] *
              (amount +{" "}
              <span className="text-orange-600 dark:text-orange-400">1</span>)
              <br />
              {"        "}dp[
              <span className="text-orange-600 dark:text-orange-400">0</span>] ={" "}
              <span className="text-orange-600 dark:text-orange-400">1</span>
              <br />
              <br />
              {"        "}
              <span className="text-pink-600 dark:text-pink-500">
                for
              </span> coin{" "}
              <span className="text-pink-600 dark:text-pink-500">in</span>{" "}
              coins:
              <br />
              {"            "}
              <span className="text-pink-600 dark:text-pink-500">
                for
              </span> i{" "}
              <span className="text-pink-600 dark:text-pink-500">in</span>{" "}
              <span className="text-blue-600 dark:text-blue-400">range</span>
              (coin, amount +{" "}
              <span className="text-orange-600 dark:text-orange-400">1</span>):
              <br />
              {"                "}dp[i] += dp[i - coin]
              <br />
              <br />
              {"        "}
              <span className="text-pink-600 dark:text-pink-500">
                return
              </span>{" "}
              dp[amount]
              <br />
            </div>
          </div>

          <div className="flex items-center justify-between px-4 py-1.5 bg-white dark:bg-[#1a1a1a] text-[11px] text-neutral-500 border-t border-b border-neutral-200 dark:border-neutral-800 transition-colors">
            <div>
              Ln 11, Col 28 &nbsp;&nbsp;&nbsp; Python 3.11 &nbsp;&nbsp;&nbsp;
              UTF-8
            </div>
            <div className="flex items-center gap-4">
              <span>Spaces: 4</span>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span>No errors</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-[#121212] transition-colors">
            <div className="flex items-center gap-2 text-neutral-500 text-sm bg-neutral-200/50 dark:bg-neutral-900/50 px-3 py-1.5 rounded border border-neutral-300 dark:border-neutral-800">
              <SquareTerminal className="w-4 h-4" />
              <span>
                Ctrl+Enter <span className="text-neutral-600">to run</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-600 dark:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-400/10 transition-colors">
                <Play className="w-4 h-4 fill-emerald-600 dark:fill-emerald-400" />
                Run
              </button>
              <button className="flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-white bg-[#8B5CF6] hover:bg-[#7c3aed] transition-colors shadow-[0_0_15px_rgba(139,92,246,0.2)] dark:shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                <Send className="w-4 h-4" />
                Submit
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between px-4 border-t border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1a1a1a] transition-colors">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab("test-cases")}
                className={`flex items-center gap-2 px-4 py-3 transition-colors text-sm font-medium ${activeTab === "test-cases" ? "border-b-2 border-purple-600 dark:border-purple-500 text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10" : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"}`}
              >
                <SquareTerminal className="w-4 h-4" />
                Test Cases
              </button>
              <button
                onClick={() => setActiveTab("result")}
                className={`flex items-center gap-2 px-4 py-3 transition-colors text-sm font-medium ${activeTab === "result" ? "border-b-2 border-purple-600 dark:border-purple-500 text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10" : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"}`}
              >
                <CheckCircle2 className="w-4 h-4" />
                Result
              </button>
            </div>
            <button className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 flex gap-4 p-4 bg-white dark:bg-[#121212] overflow-y-auto max-h-[260px] shrink-0 border-b border-neutral-200 dark:border-neutral-800 transition-colors">
            {activeTab === "result" ? (
              <>
                <div className="w-48 bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20 rounded-xl flex flex-col items-center justify-center p-4 h-full shrink-0">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-500" />
                  </div>
                  <div className="text-emerald-600 dark:text-emerald-500 font-bold text-xl mb-1">
                    Accepted
                  </div>
                  <div className="text-emerald-600/60 dark:text-emerald-500/60 text-xs">
                    All test cases passed
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex gap-4">
                    <div className="flex-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 relative overflow-hidden">
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500 mb-3">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-bold">Runtime</span>
                      </div>
                      <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                        48ms
                      </div>
                      <div className="h-1.5 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden mb-3">
                        <div className="h-full w-[92%] bg-emerald-500 rounded-full"></div>
                      </div>
                      <div className="text-xs text-neutral-500">
                        Faster than 92.4% of Python3 submissions
                      </div>
                    </div>

                    <div className="flex-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 relative overflow-hidden">
                      <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-500 mb-3">
                        <Cpu className="w-4 h-4" />
                        <span className="text-sm font-bold">Memory</span>
                      </div>
                      <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                        23.7 MB
                      </div>
                      <div className="h-1.5 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden mb-3">
                        <div className="h-full w-[87%] bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.2)] dark:shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
                      </div>
                      <div className="text-xs text-neutral-500">
                        Less memory than 87.1% of Python3 submissions
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3 bg-neutral-100 dark:bg-neutral-900 rounded-xl text-sm font-medium border border-neutral-200 dark:border-neutral-800 mt-auto">
                    <div className="flex items-center gap-3">
                      <ListChecks className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                      <span className="text-neutral-500 dark:text-neutral-400">
                        Test Cases
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-500">
                        73 / 73 passed
                      </span>
                    </div>
                    <div className="text-neutral-500">
                      Language:{" "}
                      <span className="text-neutral-900 dark:text-white">
                        Python 3
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col w-full gap-4">
                <div className="flex gap-2">
                  <button className="px-4 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm font-medium">
                    Case 1
                  </button>
                  <button className="px-4 py-1.5 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-sm font-medium transition-colors">
                    Case 2
                  </button>
                  <button className="px-4 py-1.5 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-sm font-medium transition-colors">
                    Case 3
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  <div>
                    <div className="text-xs text-neutral-500 mb-1 font-medium">
                      amount =
                    </div>
                    <div className="bg-neutral-50 dark:bg-[#1e1e1e] border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 font-mono text-sm text-neutral-800 dark:text-neutral-300">
                      5
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500 mb-1 font-medium">
                      coins =
                    </div>
                    <div className="bg-neutral-50 dark:bg-[#1e1e1e] border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 font-mono text-sm text-neutral-800 dark:text-neutral-300">
                      [1, 2, 5]
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemInfo;
