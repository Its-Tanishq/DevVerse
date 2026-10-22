import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import {
  MessageSquare,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Loader2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Tag as TagIcon,
  X,
  Layers,
  ArrowUpDown,
} from "lucide-react";
import toast from "react-hot-toast";
import apiClient from "../../config/ApiClient";
import useAuth from "../../store/AuthStore";
import DoubtCard from "../../components/doubt/DoubtCard";
import AskDoubtModal from "../../components/doubt/AskDoubtModal";

const DoubtForum = () => {
  const navigate = useNavigate();
  const isLoggedIn = useAuth((state) => state.authStatus);

  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filters & Pagination state
  const [filterSolved, setFilterSolved] = useState(null); // null = all, false = unsolved, true = solved
  const [direction, setDirection] = useState("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
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
        direction,
      };

      if (filterSolved !== null) {
        params.isSolved = filterSolved;
      }

      const res = await apiClient.get("/doubts", { params });
      if (res.data) {
        setDoubts(res.data.content || []);
        setPagination((prev) => ({
          ...prev,
          totalPages: res.data.totalPages || 1,
          totalElements: res.data.totalElements || 0,
        }));
      }
    } catch (err) {
      console.error("Error fetching doubts:", err);
      toast.error("Failed to load doubts forum");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoubts();
  }, [pagination.page, filterSolved, direction]);

  const handleOpenAskModal = () => {
    if (!isLoggedIn) {
      toast.error("Please sign in to ask a doubt");
      navigate("/signin");
      return;
    }
    setIsModalOpen(true);
  };

  const handleFilterChange = (status) => {
    setFilterSolved(status);
    setPagination((prev) => ({ ...prev, page: 0 }));
  };

  const handleTagSelect = (tag) => {
    setSelectedTag((prev) => (prev === tag ? null : tag));
  };

  // Filter doubts client-side for search query and selected tag
  const filteredDoubts = useMemo(() => {
    return doubts.filter((doubt) => {
      const matchesSearch =
        searchQuery === "" ||
        doubt.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doubt.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doubt.author?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doubt.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTag =
        !selectedTag ||
        doubt.tags?.some((t) => t.toLowerCase() === selectedTag.toLowerCase());

      return matchesSearch && matchesTag;
    });
  }, [doubts, searchQuery, selectedTag]);

  // Extract all unique tags on current page for quick filter chips
  const pageTags = useMemo(() => {
    const set = new Set();
    doubts.forEach((d) => {
      if (Array.isArray(d.tags)) {
        d.tags.forEach((t) => set.add(t));
      }
    });
    return Array.from(set).slice(0, 8);
  }, [doubts]);

  return (
    <div className="w-[90vw] max-w-7xl mx-auto py-8 sm:py-10">
      {/* Hero Header */}
      <div className="relative rounded-3xl p-6 sm:p-10 mb-8 overflow-hidden bg-gradient-to-br from-card via-card to-accent/40 border border-border shadow-sm">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-[#7c3aed]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#7c3aed]/15 text-[#7c3aed] border border-[#7c3aed]/30">
              <Sparkles size={13} />
              Community Knowledge Hub
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              Developer <span className="text-[#7c3aed]">Doubt Forum</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Got stuck on a tricky algorithm, code error, or architecture dilemma?
              Post your doubt, get answers with code solutions, and help fellow devs grow.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={handleOpenAskModal}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-lg shadow-[#7c3aed]/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Plus size={18} strokeWidth={2.5} />
              Ask a Doubt
            </button>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search, Filters, Sorting */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search doubts by title, tag, or author..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-card border border-border focus:border-[#7c3aed] text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Status Filter Pills & Sort Dropdown */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex bg-card p-1 rounded-xl border border-border shadow-sm">
            <button
              type="button"
              onClick={() => handleFilterChange(null)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterSolved === null
                  ? "bg-[#7c3aed] text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All Doubts
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                filterSolved === false
                  ? "bg-amber-500 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <HelpCircle size={13} />
              Unsolved
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                filterSolved === true
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <CheckCircle2 size={13} />
              Solved
            </button>
          </div>

          {/* Sort order toggle */}
          <button
            type="button"
            onClick={() => {
              setDirection((prev) => (prev === "desc" ? "asc" : "desc"));
              setPagination((prev) => ({ ...prev, page: 0 }));
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-card border border-border hover:border-foreground/20 text-xs font-semibold text-foreground transition-colors cursor-pointer shadow-sm"
            title="Toggle sort direction"
          >
            <ArrowUpDown size={13} className="text-[#7c3aed]" />
            <span>{direction === "desc" ? "Newest First" : "Oldest First"}</span>
          </button>
        </div>
      </div>

      {/* Selected Tag Indicator / Tags Cloud */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
          <TagIcon size={12} className="text-[#7c3aed]" />
          Tags:
        </span>
        {selectedTag && (
          <span className="inline-flex items-center gap-1.5 bg-[#7c3aed] text-white text-xs font-semibold px-2.5 py-1 rounded-lg shadow-sm">
            #{selectedTag}
            <button
              type="button"
              onClick={() => setSelectedTag(null)}
              className="hover:opacity-80 cursor-pointer"
            >
              <X size={12} />
            </button>
          </span>
        )}
        {pageTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleTagSelect(tag)}
            className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
              selectedTag === tag
                ? "bg-[#7c3aed]/20 text-[#7c3aed] border-[#7c3aed]"
                : "bg-card hover:bg-accent text-muted-foreground hover:text-foreground border-border"
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Content Feed */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 size={36} className="text-[#7c3aed] animate-spin" />
          <p className="text-sm text-muted-foreground">Loading doubts from community...</p>
        </div>
      ) : filteredDoubts.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDoubts.map((doubt) => (
              <DoubtCard
                key={doubt.id}
                doubt={doubt}
                onTagClick={handleTagSelect}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-border">
              <span className="text-xs text-muted-foreground">
                Page <span className="font-semibold text-foreground">{pagination.page + 1}</span> of{" "}
                <span className="font-semibold text-foreground">{pagination.totalPages}</span> (
                {pagination.totalElements} total doubts)
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={pagination.page === 0}
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: Math.max(0, prev.page - 1) }))
                  }
                  className="p-2 rounded-lg bg-card border border-border hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-foreground"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-semibold px-2">{pagination.page + 1}</span>
                <button
                  type="button"
                  disabled={pagination.page >= pagination.totalPages - 1}
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      page: Math.min(prev.totalPages - 1, prev.page + 1),
                    }))
                  }
                  className="p-2 rounded-lg bg-card border border-border hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-foreground"
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
            <h3 className="text-lg font-bold text-foreground">No Doubts Found</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {searchQuery || selectedTag || filterSolved !== null
                ? "No questions match your current filters or search terms. Try clearing them."
                : "Be the first person in DevVerse to start a discussion or ask a doubt!"}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            {(searchQuery || selectedTag || filterSolved !== null) && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTag(null);
                  setFilterSolved(null);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-accent text-foreground hover:bg-accent/80 transition-colors"
              >
                Reset Filters
              </button>
            )}
            <button
              type="button"
              onClick={handleOpenAskModal}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#7c3aed] text-white hover:bg-[#6d28d9] transition-colors"
            >
              Ask a Doubt
            </button>
          </div>
        </div>
      )}

      {/* Modal for asking doubt */}
      <AskDoubtModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDoubtCreated={(newDoubt) => {
          setDoubts((prev) => [newDoubt, ...prev]);
        }}
      />
    </div>
  );
};

export default DoubtForum;
