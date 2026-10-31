import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import {
  Search,
  PlusCircle,
  Plus,
  X,
  Code2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import apiClient from "../../config/ApiClient";
import useAuth from "../../store/AuthStore";
import DoubtCard from "../../components/doubt/DoubtCard";
import CommunityGroupsSection from "../../components/group/CommunityGroupsSection";

// Helper to count comments recursively (including nested replies)
const countAllComments = (list) => {
  let count = 0;
  if (!list || !Array.isArray(list)) return 0;
  list.forEach((c) => {
    count += 1;
    if (c.replies && c.replies.length > 0) {
      count += countAllComments(c.replies);
    }
  });
  return count;
};

const DoubtForum = () => {
  const navigate = useNavigate();
  const isLoggedIn = useAuth((state) => state.authStatus);
  const currentUser = useAuth((state) => state.user);

  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(
    tabParam === "groups" || tabParam === "feed" ? tabParam : "forum"
  );
  const [commentCounts, setCommentCounts] = useState({});
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

  useEffect(() => {
    if (tabParam && (tabParam === "groups" || tabParam === "forum" || tabParam === "feed")) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    if (newTab === "forum") {
      setSearchParams({});
    } else {
      setSearchParams({ tab: newTab });
    }
  };

  // Filter & Search states
  const [activeFilter, setActiveFilter] = useState("newest"); // "newest" | "discussed" | "unsolved" | "my"
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);

  // Inline "Ask a Question" Form state - hidden by default, opens on click
  const [isAskOpen, setIsAskOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newTags, setNewTags] = useState(["DP"]);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [showCodeAttach, setShowCodeAttach] = useState(false);
  const [snippetLang, setSnippetLang] = useState("cpp");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef(null);

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 1,
    totalElements: 0,
  });

  const fetchDoubts = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        size: pagination.size,
        sortBy: "createdAt",
        direction: "desc",
      };

      if (activeFilter === "unsolved") {
        params.isSolved = false;
      }

      const res = await apiClient.get("/doubts", { params });
      if (res.data) {
        const doubtList = res.data.content || [];
        setDoubts(doubtList);
        setPagination((prev) => ({
          ...prev,
          totalPages: res.data.totalPages || 1,
          totalElements:
            res.data.totalElements ||
            (res.data.content ? res.data.content.length : 0),
        }));

        // Fetch real comment counts for all doubts on current page
        Promise.all(
          doubtList.map(async (d) => {
            if (typeof d.commentCount === "number" && d.commentCount > 0) {
              return { id: d.id, count: d.commentCount };
            }
            try {
              const cRes = await apiClient.get(`/doubts/${d.id}/comments`);
              return { id: d.id, count: countAllComments(cRes.data) };
            } catch {
              return { id: d.id, count: d.commentCount ?? 0 };
            }
          })
        ).then((results) => {
          const countsMap = {};
          results.forEach((r) => {
            if (r) countsMap[r.id] = r.count;
          });
          setCommentCounts(countsMap);
        });
      }
    } catch (err) {
      console.error("Error fetching doubts:", err);
      setDoubts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoubts();
  }, [pagination.page, activeFilter]);

  const handleOpenAskToggle = () => {
    if (!isLoggedIn && !isAskOpen) {
      toast.error("Please sign in to ask a question");
      navigate("/signin");
      return;
    }
    setIsAskOpen((prev) => !prev);
  };

  // Markdown toolbar insertion
  const insertMarkdown = (prefix, suffix = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = newDescription;
    const selected = text.substring(start, end);

    const replacement = prefix + (selected || "text") + suffix;
    const nextVal = text.substring(0, start) + replacement + text.substring(end);
    setNewDescription(nextVal);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selected ? selected.length : 4)
      );
    }, 0);
  };

  const handleAddTag = () => {
    const val = tagInput.trim();
    if (val && !newTags.includes(val)) {
      setNewTags((prev) => [...prev, val]);
    }
    setTagInput("");
    setIsAddingTag(false);
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === "Escape") {
      setIsAddingTag(false);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setNewTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error("Please enter a question title");
      return;
    }
    if (!newDescription.trim()) {
      toast.error("Please describe your question");
      return;
    }

    setIsSubmitting(true);
    let fullDescription = newDescription.trim();
    if (showCodeAttach && codeSnippet.trim()) {
      fullDescription += `\n\n\`\`\`${snippetLang}\n${codeSnippet.trim()}\n\`\`\``;
    }

    const payload = {
      title: newTitle.trim(),
      description: fullDescription,
      tags: newTags,
    };

    try {
      const res = await apiClient.post("/doubts", payload);
      if (res.data) {
        setDoubts((prev) => [res.data, ...prev]);
      } else {
        throw new Error("No data returned");
      }
    } catch {
      // Local fallback creation
      const authorName =
        currentUser?.actualUsername ||
        currentUser?.username ||
        currentUser?.name ||
        "You";
      const localDoubt = {
        id: Date.now(),
        title: newTitle.trim(),
        description: fullDescription,
        tags: newTags.length > 0 ? newTags : ["General"],
        isSolved: false,
        createdAt: new Date().toISOString(),
        author: {
          username: currentUser?.username || "you",
          actualUsername: authorName,
          profilePic: currentUser?.profilePic || null,
        },
        comments: [],
        commentCount: 0,
      };
      setDoubts((prev) => [localDoubt, ...prev]);
    }

    toast.success("Question submitted successfully!");
    setNewTitle("");
    setNewDescription("");
    setCodeSnippet("");
    setShowCodeAttach(false);
    setIsAskOpen(false);
    setIsSubmitting(false);
  };

  // Filtered and Sorted Doubts
  const filteredDoubts = useMemo(() => {
    let result = doubts.filter((doubt) => {
      const matchesSearch =
        searchQuery === "" ||
        doubt.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doubt.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doubt.author?.actualUsername
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        doubt.author?.username
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        doubt.tags?.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesTag =
        !selectedTag ||
        doubt.tags?.some((t) => t.toLowerCase() === selectedTag.toLowerCase());

      return matchesSearch && matchesTag;
    });

    if (activeFilter === "unsolved") {
      result = result.filter((d) => !d.isSolved);
    } else if (activeFilter === "my") {
      if (isLoggedIn && currentUser) {
        result = result.filter(
          (d) =>
            d.author?.username === currentUser.username ||
            d.author?.actualUsername === currentUser.actualUsername ||
            d.author?.username === "you"
        );
      }
    } else if (activeFilter === "discussed") {
      result = [...result].sort((a, b) => {
        const countA =
          commentCounts[a.id] ?? a.commentCount ?? a.comments?.length ?? 0;
        const countB =
          commentCounts[b.id] ?? b.commentCount ?? b.comments?.length ?? 0;
        return countB - countA;
      });
    } else if (activeFilter === "newest") {
      result = [...result].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });
    }

    return result;
  }, [
    doubts,
    searchQuery,
    selectedTag,
    activeFilter,
    commentCounts,
    isLoggedIn,
    currentUser,
  ]);

  return (
    <div className="w-full min-h-screen bg-background text-foreground">
      {/* Community Header Bar */}
      <div className="border-b border-border bg-background">
        <div className="w-[90vw] max-w-7xl mx-auto pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {activeTab === "groups" ? "Community Groups" : "Community"}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {activeTab === "groups"
                  ? "Study circles, developer groups & peer collaboration"
                  : activeTab === "feed"
                  ? "Real-time updates and discussions from fellow developers"
                  : "Doubt forum — ask, answer, get unstuck"}
              </p>
            </div>

            <div>
              {activeTab === "groups" ? (
                <button
                  type="button"
                  onClick={() => setIsCreateGroupOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-medium text-sm shadow-md shadow-[#7c3aed]/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  {isCreateGroupOpen ? <X size={16} /> : <Plus size={16} />}
                  <span>{isCreateGroupOpen ? "Close Form" : "Create Group"}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleOpenAskToggle}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-medium text-sm shadow-md shadow-[#7c3aed]/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <PlusCircle size={16} />
                  <span>Ask a Question</span>
                </button>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 -mb-[1px]">
            {/* Incomplete global feed tab commented out */}
            {/* <button
              type="button"
              onClick={() => handleTabChange("feed")}
              className={`px-4 py-1.5 text-xs sm:text-sm font-medium border transition-colors cursor-pointer rounded-t-md ${
                activeTab === "feed"
                  ? "border-border border-b-2 border-b-[#7c3aed] text-[#7c3aed] bg-card"
                  : "border-border text-muted-foreground hover:text-foreground bg-card/60 hover:bg-card"
              }`}
            >
              Feed
            </button> */}
            <button
              type="button"
              onClick={() => handleTabChange("forum")}
              className={`px-4 py-1.5 text-xs sm:text-sm font-medium border transition-colors cursor-pointer rounded-t-md ${
                activeTab === "forum"
                  ? "border-border border-b-2 border-b-[#7c3aed] text-[#7c3aed] bg-card"
                  : "border-border text-muted-foreground hover:text-foreground bg-card/60 hover:bg-card"
              }`}
            >
              Forum
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("groups")}
              className={`px-4 py-1.5 text-xs sm:text-sm font-medium border transition-colors cursor-pointer rounded-t-md ${
                activeTab === "groups"
                  ? "border-border border-b-2 border-b-[#7c3aed] text-[#7c3aed] bg-card"
                  : "border-border text-muted-foreground hover:text-foreground bg-card/60 hover:bg-card"
              }`}
            >
              Groups
            </button>
          </div>
        </div>
      </div>

      {/* Main Page Content */}
      <div className="w-[90vw] max-w-7xl mx-auto py-6 sm:py-8">
        {activeTab === "groups" ? (
          <CommunityGroupsSection
            isCreateOpen={isCreateGroupOpen}
            setIsCreateOpen={setIsCreateGroupOpen}
          />
        ) : (
          <>
        {/* Controls Bar: Filter Pills & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveFilter("newest")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                activeFilter === "newest"
                  ? "border-[#7c3aed] bg-[#7c3aed]/15 text-[#7c3aed] shadow-sm shadow-[#7c3aed]/10"
                  : "border-border text-muted-foreground hover:text-foreground bg-card hover:bg-accent"
              }`}
            >
              Newest
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("discussed")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                activeFilter === "discussed"
                  ? "border-[#7c3aed] bg-[#7c3aed]/15 text-[#7c3aed] shadow-sm shadow-[#7c3aed]/10"
                  : "border-border text-muted-foreground hover:text-foreground bg-card hover:bg-accent"
              }`}
            >
              Most Discussed
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("unsolved")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                activeFilter === "unsolved"
                  ? "border-[#7c3aed] bg-[#7c3aed]/15 text-[#7c3aed] shadow-sm shadow-[#7c3aed]/10"
                  : "border-border text-muted-foreground hover:text-foreground bg-card hover:bg-accent"
              }`}
            >
              Unsolved
            </button>
            <button
              type="button"
              onClick={() => {
                if (!isLoggedIn) {
                  toast.error("Please sign in to see your questions");
                }
                setActiveFilter("my");
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                activeFilter === "my"
                  ? "border-[#7c3aed] bg-[#7c3aed]/15 text-[#7c3aed] shadow-sm shadow-[#7c3aed]/10"
                  : "border-border text-muted-foreground hover:text-foreground bg-card hover:bg-accent"
              }`}
            >
              My Questions
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              className="w-full sm:w-64 pl-9 pr-8 py-2 rounded-full bg-card border border-border text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-[#7c3aed] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Collapsible / Inline Ask a Question Box - Opens when "Ask a Question" is clicked */}
        {isAskOpen && (
          <div className="rounded-2xl border border-[#7c3aed]/40 bg-card p-5 sm:p-6 shadow-xl shadow-[#7c3aed]/5 mb-6 transition-all animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between pb-4">
              <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                Ask a Question
              </h2>
              <button
                type="button"
                onClick={() => setIsAskOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-[#7c3aed] mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Why does my DP solution give TLE?"
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-[#7c3aed] text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#7c3aed] mb-1.5">
                  Description
                </label>
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
                    rows={4}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Describe your doubt in detail.."
                    className="w-full p-3.5 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none resize-y"
                    required
                  />
                </div>
              </div>

              {/* Tags and Code snippet row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tags */}
                <div>
                  <label className="block text-xs font-semibold text-[#7c3aed] mb-1.5">
                    Tags
                  </label>
                  <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-background border border-border min-h-[42px]">
                    {newTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#7c3aed]/15 text-[#7c3aed] border border-[#7c3aed]/30"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-foreground cursor-pointer"
                        >
                          <X size={11} />
                        </button>
                      </span>
                    ))}
                    {isAddingTag ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          autoFocus
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleTagKeyDown}
                          placeholder="Type tag & Enter"
                          className="text-xs bg-transparent text-foreground outline-none w-28 px-1"
                        />
                        <button
                          type="button"
                          onClick={handleAddTag}
                          className="text-xs text-[#7c3aed] hover:text-[#6d28d9] cursor-pointer font-medium"
                        >
                          Add
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsAddingTag(true)}
                        className="text-xs text-muted-foreground hover:text-foreground px-2 py-0.5 rounded border border-dashed border-border hover:border-[#7c3aed] cursor-pointer"
                      >
                        + add
                      </button>
                    )}
                  </div>
                </div>

                {/* Code Snippet */}
                <div>
                  <label className="block text-xs font-semibold text-[#7c3aed] mb-1.5">
                    Code snippet
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowCodeAttach((prev) => !prev)}
                    className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-background border border-border hover:border-[#7c3aed]/50 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    <Code2 size={14} className="text-[#7c3aed]" />
                    <span>
                      {showCodeAttach
                        ? "Hide code snippet editor"
                        : "Attach code (optional)"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Expandable Code snippet editor */}
              {showCodeAttach && (
                <div className="rounded-xl border border-border bg-background p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      Language:
                    </span>
                    <select
                      value={snippetLang}
                      onChange={(e) => setSnippetLang(e.target.value)}
                      className="bg-card border border-border rounded-lg text-xs text-foreground px-2 py-1 outline-none"
                    >
                      <option value="cpp">C++</option>
                      <option value="java">Java</option>
                      <option value="python">Python</option>
                      <option value="javascript">JavaScript</option>
                      <option value="typescript">TypeScript</option>
                      <option value="go">Go</option>
                    </select>
                  </div>
                  <textarea
                    rows={4}
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                    placeholder="// Paste your code here..."
                    className="w-full p-2.5 bg-card rounded-lg font-mono text-xs text-emerald-400 outline-none resize-y border border-border"
                  />
                </div>
              )}

              {/* Submit Button */}
              <div className="flex items-center justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-sm shadow-md shadow-[#7c3aed]/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit Question</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Content Feed */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 size={36} className="text-[#7c3aed] animate-spin" />
            <p className="text-sm text-muted-foreground">Loading doubts from community...</p>
          </div>
        ) : filteredDoubts.length > 0 ? (
          <div className="space-y-3.5 sm:space-y-4">
            {filteredDoubts.map((doubt) => (
              <DoubtCard
                key={doubt.id}
                doubt={doubt}
                commentCount={
                  commentCounts[doubt.id] ??
                  doubt.commentCount ??
                  doubt.comments?.length ??
                  0
                }
                onTagClick={(tag) => setSelectedTag(tag)}
              />
            ))}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-border">
                <span className="text-xs text-muted-foreground">
                  Page{" "}
                  <span className="font-semibold text-foreground">
                    {pagination.page + 1}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-foreground">
                    {pagination.totalPages}
                  </span>{" "}
                  ({pagination.totalElements} total doubts)
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={pagination.page === 0}
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: Math.max(0, prev.page - 1),
                      }))
                    }
                    className="p-2 rounded-lg bg-card border border-border hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-foreground cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-xs font-semibold px-2 text-foreground">
                    {pagination.page + 1}
                  </span>
                  <button
                    type="button"
                    disabled={pagination.page >= pagination.totalPages - 1}
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: Math.min(prev.totalPages - 1, prev.page + 1),
                      }))
                    }
                    className="p-2 rounded-lg bg-card border border-border hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-foreground cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-16 text-center bg-card border border-dashed border-border rounded-2xl p-8 max-w-xl mx-auto space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#7c3aed]/10 text-[#7c3aed] flex items-center justify-center">
              <HelpCircle size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">No Questions Found</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {searchQuery || selectedTag || activeFilter !== "newest"
                  ? "No questions match your current filters or search terms."
                  : "Be the first person in DevVerse to start a discussion or ask a doubt!"}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              {(searchQuery || selectedTag || activeFilter !== "newest") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTag(null);
                    setActiveFilter("newest");
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-accent text-foreground hover:bg-accent/80 transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsAskOpen(true)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#7c3aed] hover:bg-[#6d28d9] text-white transition-colors cursor-pointer"
              >
                Ask a Question
              </button>
            </div>
          </div>
        )}
        </>
        )}
      </div>
    </div>
  );
};

export default DoubtForum;
