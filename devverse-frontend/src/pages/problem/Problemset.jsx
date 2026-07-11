import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import apiClient from "../../config/ApiClient";
import useAuth from "../../store/AuthStore";
import {
  Shuffle,
  SlidersHorizontal,
  CheckCircle2,
  Circle,
  Clock,
  Lock,
  X,
  Flame,
  Zap,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Check,
} from "lucide-react";

const Checkbox = ({
  label,
  icon,
  labelClass = "text-neutral-700 dark:text-neutral-300",
  disabled = false,
  checked = false,
  onChange,
}) => (
  <label
    className={`flex items-center gap-3 ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer group"}`}
    onClick={!disabled && onChange ? onChange : undefined}
  >
    <div
      className={`w-4 h-4 rounded-[4px] border ${checked ? "bg-purple-600 border-purple-600" : "border-neutral-300 dark:border-neutral-700 bg-transparent"} ${disabled ? "" : "group-hover:border-neutral-500"} transition-colors flex items-center justify-center shrink-0`}
    >
      {checked && <Check className="w-3 h-3 text-white" />}
    </div>
    {icon && (
      <span className="text-neutral-400 dark:text-neutral-500 shrink-0">
        {icon}
      </span>
    )}
    <span className={`text-sm font-medium ${labelClass}`}>{label}</span>
  </label>
);

const SectionHeading = ({ title, badge }) => (
  <div className="flex items-center justify-between mb-3">
    <h3 className="text-xs font-bold text-neutral-500 tracking-wider uppercase">
      {title}
    </h3>
    {badge && (
      <span className="bg-purple-100 dark:bg-[#2D234A] text-purple-700 dark:text-[#9A7DFF] text-[10px] font-bold px-2 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </div>
);

const Problem = () => {
  const navigate = useNavigate();
  const authStatus = useAuth((state) => state.authStatus);
  const [problemsData, setProblemsData] = useState([]);
  const [dailyChallenge, setDailyChallenge] = useState(undefined); // undefined = loading, null = not found/error
  const [timeLeft, setTimeLeft] = useState("");
  const [counts, setCounts] = useState({ easy: 0, medium: 0, hard: 0 });
  const [pagination, setPagination] = useState({ page: 0, size: 20, totalPages: 1, totalElements: 0 });
  const [filters, setFilters] = useState({
    difficulty: null,
    tag: null,
    company: null,
    status: null,
  });

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type] === value ? null : value
    }));
    setPagination(prev => ({ ...prev, page: 0 }));
  };

  const [loading, setLoading] = useState(true);

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pagination.page,
        size: pagination.size,
      });
      if (filters.difficulty) queryParams.append("difficulty", filters.difficulty.toUpperCase());
      if (filters.tag) queryParams.append("tag", filters.tag);
      if (filters.company) queryParams.append("company", filters.company);
      if (filters.status) queryParams.append("status", filters.status);

      const res = await apiClient.get(`/problem?${queryParams.toString()}`);
      if (res.data?.success) {
        setProblemsData(res.data.data.content);
        setPagination((prev) => ({
          ...prev,
          page: res.data.data.currentPage,
          totalPages: res.data.data.totalPages,
          totalElements: res.data.data.totalElements,
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCounts = async () => {
    try {
      const res = await apiClient.get("/problem/count");
      if (res.data?.success) {
        setCounts(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDailyChallenge = async () => {
    try {
      const res = await apiClient.get("/problem/dc/today");
      if (res.data?.success && res.data.data) {
        const problemId = res.data.data.problemsId;
        const problemRes = await apiClient.get(`/problem/${problemId}`);
        if (problemRes.data?.success) {
          setDailyChallenge({
            ...problemRes.data.data,
            date: res.data.data.date
          });
          return;
        }
      }
    } catch (err) {
      console.error("No daily challenge found for today or failed to fetch:", err);
    }
    setDailyChallenge(null);
  };

  const toggleBookmark = async (problemId, currentStatus) => {
    try {
      const res = await apiClient.post("/problem/workspace", {
        problemsId: problemId,
        isBookmark: !currentStatus
      });
      if (res.data?.success) {
        setProblemsData(prev => prev.map(p => {
          if ((p.ID || p.id) === problemId) {
            return { ...p, bookmarked: !currentStatus };
          }
          return p;
        }));
        if (!currentStatus) {
          toast.success("Problem bookmarked!");
        } else {
          toast.success("Bookmark removed!");
        }
      }
    } catch (err) {
      console.error("Failed to toggle bookmark:", err);
      toast.error("Failed to update bookmark");
    }
  };

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diff = tomorrow - now;
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff / 1000 / 60) % 60);
      setTimeLeft(`${h}h ${m}m`);
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchCounts();
    fetchDailyChallenge();
  }, []);

  useEffect(() => {
    fetchProblems();
  }, [pagination.page, pagination.size, filters]);

  const handleRandomProblem = async () => {
    try {
      if (pagination.totalElements === 0) return;
      
      const randomOffset = Math.floor(Math.random() * pagination.totalElements);
      const res = await apiClient.get(`/problem?page=${randomOffset}&size=1`);
      
      if (res.data?.success && res.data.data.content.length > 0) {
        const randomProblem = res.data.data.content[0];
        navigate(`/problem/${randomProblem.slug || randomProblem.ID || randomProblem.id}`);
      }
    } catch (err) {
      console.error("Failed to fetch random problem:", err);
    }
  };

  const renderPagination = () => {
    const { page, totalPages } = pagination;
    const pages = [];

    for (let i = 0; i < totalPages; i++) {
      if (
        i === 0 ||
        i === totalPages - 1 ||
        (i >= page - 1 && i <= page + 1)
      ) {
        pages.push(i);
      } else if (
        (i === page - 2 && page > 2) ||
        (i === page + 2 && page < totalPages - 3)
      ) {
        pages.push("...");
      }
    }
    
    const finalPages = pages.filter((p, idx, arr) => p !== "..." || arr[idx-1] !== "...");

    return (
      <div className="flex items-center gap-1.5">
        <button 
          disabled={page === 0 || totalPages === 0}
          onClick={() => setPagination(prev => ({ ...prev, page: Math.max(0, page - 1) }))}
          className="w-8 h-8 flex items-center justify-center rounded border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {finalPages.map((p, i) => (
          p === "..." ? (
            <span key={`dots-${i}`} className="w-8 h-8 flex items-center justify-center text-neutral-600">...</span>
          ) : (
            <button
              key={p}
              onClick={() => setPagination(prev => ({ ...prev, page: p }))}
              className={`w-8 h-8 flex items-center justify-center rounded border ${page === p ? 'bg-purple-600 dark:bg-[#9A7DFF] text-white dark:text-black font-bold border-transparent' : 'border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white font-medium text-sm'} transition-colors`}
            >
              {p + 1}
            </button>
          )
        ))}
        <button 
          disabled={page >= totalPages - 1 || totalPages === 0}
          onClick={() => setPagination(prev => ({ ...prev, page: Math.min(totalPages - 1, page + 1) }))}
          className="w-8 h-8 flex items-center justify-center rounded border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="flex-1 w-full bg-neutral-50 dark:bg-[#111111] text-neutral-900 dark:text-white font-sans flex flex-col">
      <div className="w-full bg-white dark:bg-[#1A1A1A] p-4 border-b border-neutral-200 dark:border-white/5 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold tracking-tight">Problems</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-1.5 bg-neutral-100 dark:bg-black/40 rounded-full border border-neutral-200 dark:border-white/5 text-sm font-medium">
              <div className="flex items-center gap-1.5 text-emerald-500">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                <span>{counts.easy} Easy</span>
              </div>
              <div className="text-neutral-300 dark:text-neutral-700">|</div>
              <div className="flex items-center gap-1.5 text-orange-500">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"></div>
                <span>{counts.medium} Medium</span>
              </div>
              <div className="text-neutral-300 dark:text-neutral-700">|</div>
              <div className="flex items-center gap-1.5 text-red-500">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                <span>{counts.hard} Hard</span>
              </div>
            </div>

            <button onClick={handleRandomProblem} className="flex items-center gap-2 px-4 py-1.5 bg-neutral-100 dark:bg-black/40 hover:bg-neutral-200 dark:hover:bg-black/60 rounded-full border border-neutral-200 dark:border-white/5 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors">
              <Shuffle className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
              <span>Random</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full flex gap-8 p-6 flex-1">
        <div className="w-[260px] shrink-0 flex flex-col gap-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-white/5">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
              <h2 className="text-base font-bold">Filters</h2>
            </div>
            <span className="bg-purple-100 dark:bg-[#2D234A] text-purple-700 dark:text-[#9A7DFF] text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {activeFiltersCount}
            </span>
          </div>

          <div>
            <SectionHeading title="DIFFICULTY" />
            <div className="flex flex-col gap-3">
              {["Easy", "Medium", "Hard"].map(diff => (
                <Checkbox 
                  key={diff} 
                  label={diff} 
                  labelClass={diff === "Easy" ? "text-emerald-500" : diff === "Medium" ? "text-orange-500" : "text-red-500"} 
                  checked={filters.difficulty === diff}
                  onChange={() => handleFilterChange("difficulty", diff)}
                />
              ))}
            </div>
          </div>

          <div className="h-px bg-neutral-200 dark:bg-white/5 w-full"></div>

          {authStatus && (
            <>
              <div>
                <SectionHeading title="STATUS" />
                <div className="flex flex-col gap-3">
                  {[
                    { label: "Solved", icon: <CheckCircle2 className="w-4 h-4" />, value: "solved" },
                    { label: "Unsolved", icon: <Circle className="w-4 h-4" />, value: "unsolved" },
                    { label: "Attempted", icon: <Clock className="w-4 h-4" />, value: "attempted" }
                  ].map(status => (
                    <Checkbox
                      key={status.label}
                      label={status.label}
                      icon={status.icon}
                      checked={filters.status === status.value}
                      onChange={() => handleFilterChange("status", status.value)}
                    />
                  ))}
                </div>
              </div>

              <div className="h-px bg-neutral-200 dark:bg-white/5 w-full"></div>
            </>
          )}

          <div>
            <SectionHeading title="TOPICS" badge={filters.tag ? "1" : "0"} />
            <div className="flex flex-col gap-3">
              {["Array", "String", "Tree", "Graph", "Dynamic Programming", "Linked List", "Binary Search", "Stack", "Heap", "Backtracking"].map(topic => (
                <Checkbox 
                  key={topic} 
                  label={topic} 
                  checked={filters.tag === topic}
                  onChange={() => handleFilterChange("tag", topic)}
                />
              ))}
            </div>
          </div>

          <div className="mt-2">
            <SectionHeading title="COMPANY" />
            <div className="relative border border-orange-500/20 rounded-xl p-4 bg-orange-50/50 dark:bg-orange-500/5 overflow-hidden">
              <div className="flex items-center gap-2 text-orange-500 mb-4">
                <Lock className="w-4 h-4" />
                <span className="text-xs font-bold">Premium feature</span>
              </div>

              <div className="flex flex-col gap-3 opacity-30 select-none">
                <Checkbox label="Google" disabled />
                <Checkbox label="Amazon" disabled />
                <Checkbox label="Microsoft" disabled />
                <Checkbox label="Meta" disabled />
                <Checkbox label="Apple" disabled />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-neutral-50 dark:from-[#111111] via-neutral-50/80 dark:via-[#111111]/80 to-transparent flex items-end justify-center pb-4">
                <button className="bg-orange-500 hover:bg-orange-600 text-white dark:text-black text-sm font-bold py-2 px-4 rounded-lg transition-colors">
                  Unlock Premium
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-200 dark:border-white/5 mt-auto mb-4">
            <button 
              onClick={() => {
                setFilters({ difficulty: null, tag: null, company: null, status: null });
                setPagination(prev => ({ ...prev, page: 0 }));
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-neutral-300 dark:border-[#2D234A] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#2D234A]/50 transition-colors text-sm font-medium"
            >
              <X className="w-4 h-4" />
              Clear all filters
            </button>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="border border-orange-500/20 bg-gradient-to-r from-orange-50 dark:from-orange-500/10 to-transparent p-5 rounded-xl flex items-center justify-between mb-6 shadow-[inset_0_0_20px_rgba(249,115,22,0.05)]">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-500/10 rounded-full flex items-center justify-center border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.15)]">
                <Flame className="w-7 h-7 text-orange-500" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="text-sm font-bold text-orange-500">
                    Daily Challenge
                  </span>
                  {dailyChallenge && (
                    <span className="text-[11px] font-bold text-orange-500 bg-orange-500/20 px-2 py-0.5 rounded-full">
                      {dailyChallenge.difficulty}
                    </span>
                  )}
                  <span className="text-xs text-neutral-500">
                    Resets in {timeLeft}
                  </span>
                </div>
                {dailyChallenge === undefined ? (
                  <div className="flex items-center gap-6">
                    <h2 className="text-xl font-bold tracking-tight text-neutral-400">
                      Loading...
                    </h2>
                  </div>
                ) : dailyChallenge === null ? (
                  <div className="flex items-center gap-6">
                    <h2 className="text-xl font-bold tracking-tight text-neutral-400">
                      No Challenge Today
                    </h2>
                  </div>
                ) : (
                  <div className="flex items-center gap-6">
                    <h2 className="text-xl font-bold tracking-tight">
                      #{dailyChallenge.ID || dailyChallenge.id} - {dailyChallenge.title}
                    </h2>
                    <div className="flex items-center gap-1.5">
                      {dailyChallenge.tags?.map((t) => (
                        <span
                          key={t.id || t.name || t}
                          className="text-xs font-medium bg-white dark:bg-white/5 text-neutral-600 dark:text-neutral-400 px-2.5 py-1 rounded-full border border-neutral-200 dark:border-white/5"
                        >
                          {t.name || t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button 
              onClick={() => {
                if (dailyChallenge && dailyChallenge.ID) {
                  navigate(`/problem/${dailyChallenge.slug || dailyChallenge.ID || dailyChallenge.id}`);
                }
              }}
              disabled={!dailyChallenge || dailyChallenge === null}
              className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white dark:text-black px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)]"
            >
              <Zap className="w-4 h-4" />
              Solve Today
            </button>
          </div>

          <div className="bg-white dark:bg-[#1A1A1A] rounded-xl border border-neutral-200 dark:border-white/5 overflow-hidden">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-white/5 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  <th className="p-4 pl-6 font-bold w-16">#</th>
                  <th className="p-4 font-bold">Title</th>
                  <th className="p-4 font-bold w-32">Difficulty</th>
                  <th className="p-4 font-bold w-32">Acceptance</th>
                  <th className="p-4 font-bold">Tags</th>
                  <th className="p-4 pr-6 w-24"></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-neutral-500">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-600 dark:text-[#9A7DFF]" />
                        <span className="text-sm font-medium">Loading problems...</span>
                      </div>
                    </td>
                  </tr>
                ) : problemsData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-neutral-500 font-medium text-sm">
                      No problems found.
                    </td>
                  </tr>
                ) : (
                  problemsData.map((p, i) => (
                  <tr
                    key={p.ID || p.id}
                    className="border-b border-neutral-200 dark:border-white/5 hover:bg-neutral-50 dark:hover:bg-white/[0.03] transition-colors group"
                  >
                    <td className="p-4 pl-6 text-neutral-500 font-medium">
                      {p.ID || p.id}
                    </td>
                    <td className="p-4 font-bold hover:text-purple-600 dark:hover:text-[#9A7DFF] cursor-pointer transition-colors max-w-xs truncate" onClick={() => navigate(`/problem/${p.slug || p.ID || p.id}`)}>
                      {p.title}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                          p.difficulty === "Easy"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : p.difficulty === "Medium"
                              ? "bg-orange-500/10 text-orange-500"
                              : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {p.difficulty}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-600 dark:text-neutral-400 text-sm font-medium">
                      {p.acceptance || "0%"}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {p.tags && p.tags.length > 0 ? (
                          p.tags.map((t) => (
                            <span
                              key={t.id || t.name || t}
                              className={`text-[11px] px-2 py-0.5 rounded-full font-medium bg-neutral-50 dark:bg-white/5 text-neutral-500 dark:text-neutral-400`}
                            >
                              {t.name || t}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-neutral-500 dark:text-neutral-400">N/A</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 pr-6">
                      <div className="flex items-center justify-end gap-5">
                        <Bookmark
                          onClick={() => toggleBookmark(p.ID || p.id, p.bookmarked)}
                          className={`w-4 h-4 cursor-pointer transition-colors ${p.bookmarked ? "text-orange-500 fill-orange-500 hover:text-orange-400" : "text-neutral-400 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400 opacity-0 group-hover:opacity-100"}`}
                        />
                        {p.status === "solved" ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : p.status === "attempted" ? (
                          <Clock className="w-5 h-5 text-orange-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-neutral-300 dark:text-neutral-700 hover:text-neutral-400 dark:hover:text-neutral-500 cursor-pointer transition-colors" />
                        )}
                      </div>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-6 px-2">
            <span className="text-sm text-neutral-500 font-medium">
              Showing {pagination.totalElements === 0 ? 0 : pagination.page * pagination.size + 1}-{Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of {pagination.totalElements} problems
            </span>
            {renderPagination()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Problem;
