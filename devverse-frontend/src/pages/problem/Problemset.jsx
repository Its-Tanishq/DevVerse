import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import apiClient from "../../config/ApiClient";
import useAuth from "../../store/AuthStore";
import toast from "react-hot-toast";
import { Shuffle, Loader2 } from "lucide-react";

import ProblemFilters from "../../components/problems/problemset/ProblemFilters";
import DailyChallenge from "../../components/problems/problemset/DailyChallenge";
import ProblemTable from "../../components/problems/problemset/ProblemTable";
import ProblemPagination from "../../components/problems/problemset/ProblemPagination";

const Problem = () => {
  const navigate = useNavigate();
  const authStatus = useAuth((state) => state.authStatus);
  const [problemsData, setProblemsData] = useState([]);
  const [dailyChallenge, setDailyChallenge] = useState(undefined); // undefined = loading, null = not found/error
  const [timeLeft, setTimeLeft] = useState("");
  const [counts, setCounts] = useState({ easy: 0, medium: 0, hard: 0 });
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalPages: 1,
    totalElements: 0,
  });
  const [filters, setFilters] = useState({
    difficulty: null,
    tag: null,
    company: null,
    status: null,
  });

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  const handleFilterChange = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type] === value ? null : value,
    }));
    setPagination((prev) => ({ ...prev, page: 0 }));
  };

  const [loading, setLoading] = useState(true);

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pagination.page,
        size: pagination.size,
      });
      if (filters.difficulty)
        queryParams.append("difficulty", filters.difficulty.toUpperCase());
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
            date: res.data.data.date,
          });
          return;
        }
      }
    } catch (err) {
      console.error(
        "No daily challenge found for today or failed to fetch:",
        err
      );
    }
    setDailyChallenge(null);
  };

  const toggleBookmark = async (problemId, currentStatus) => {
    try {
      const res = await apiClient.post("/problem/workspace", {
        problemsId: problemId,
        isBookmark: !currentStatus,
      });
      if (res.data?.success) {
        setProblemsData((prev) =>
          prev.map((p) => {
            if ((p.ID || p.id) === problemId) {
              return { ...p, bookmarked: !currentStatus };
            }
            return p;
          })
        );
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
      const tomorrowUTC = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
      );
      const diff = tomorrowUTC - now;
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

      const randomOffset = Math.floor(
        Math.random() * pagination.totalElements
      );
      const res = await apiClient.get(`/problem?page=${randomOffset}&size=1`);

      if (res.data?.success && res.data.data.content.length > 0) {
        const randomProblem = res.data.data.content[0];
        navigate(
          `/problem/${
            randomProblem.slug || randomProblem.ID || randomProblem.id
          }`
        );
      }
    } catch (err) {
      console.error("Failed to fetch random problem:", err);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleClearFilters = () => {
    setFilters({ difficulty: null, tag: null, company: null, status: null });
    setPagination((prev) => ({ ...prev, page: 0 }));
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

            <button
              onClick={handleRandomProblem}
              className="flex items-center gap-2 px-4 py-1.5 bg-neutral-100 dark:bg-black/40 hover:bg-neutral-200 dark:hover:bg-black/60 rounded-full border border-neutral-200 dark:border-white/5 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
            >
              <Shuffle className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
              <span>Random</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full flex gap-8 p-6 flex-1">
        <ProblemFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          activeFiltersCount={activeFiltersCount}
        />

        <div className="flex-1 min-w-0">
          <DailyChallenge
            dailyChallenge={dailyChallenge}
            timeLeft={timeLeft}
          />

          <ProblemTable
            problemsData={problemsData}
            loading={loading}
            onToggleBookmark={toggleBookmark}
          />

          <div className="flex items-center justify-between mt-6 px-2 flex-wrap gap-4">
            <span className="text-sm text-neutral-500 font-medium">
              Showing{" "}
              {pagination.totalElements === 0
                ? 0
                : pagination.page * pagination.size + 1}
              -
              {Math.min(
                (pagination.page + 1) * pagination.size,
                pagination.totalElements
              )}{" "}
              of {pagination.totalElements} problems
            </span>
            <ProblemPagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Problem;
