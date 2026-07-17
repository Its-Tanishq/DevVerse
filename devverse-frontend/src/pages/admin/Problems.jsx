import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FolderOpen, Search, Plus, MoreHorizontal } from "lucide-react";
import apiClient from "../../config/ApiClient";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/problem");
      const data = response.data?.data;
      if (data && data.content) {
        setProblems(data.content);
      } else if (Array.isArray(data)) {
        setProblems(data);
      } else {
        setProblems([]);
      }
    } catch (error) {
      console.error("Failed to fetch problems:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toUpperCase()) {
      case "EASY":
        return "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400";
      case "MEDIUM":
        return "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400";
      case "HARD":
        return "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400";
      default:
        return "bg-gray-50 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8 border-b border-border pb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-cyan-50 dark:bg-cyan-900/20 w-10 h-10 rounded-lg flex items-center justify-center">
            <FolderOpen size={20} className="text-cyan-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Manage Problems
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Create, edit, and delete coding problems.
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row gap-3 justify-between"
      >
        <div className="flex items-center bg-card border border-border rounded-xl px-3 py-2.5 gap-2 flex-1 max-w-md transition-colors focus-within:ring-2 focus-within:ring-[#7c3aed]/20 focus-within:border-[#7c3aed]">
          <Search size={16} className="text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search problems..."
            className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex gap-2">
          <select className="bg-card border border-border rounded-xl px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-colors appearance-none pr-8">
            <option>All Difficulties</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
          <button className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-sm">
            <Plus size={16} />
            Add Problem
          </button>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-accent/30">
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Difficulty
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Acceptance
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mb-2"></div>
                      <p className="text-muted-foreground text-sm font-medium">
                        Loading problems...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : problems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="bg-cyan-50 dark:bg-cyan-900/20 w-12 h-12 rounded-xl flex items-center justify-center mb-2">
                        <FolderOpen size={24} className="text-cyan-500" />
                      </div>
                      <p className="text-muted-foreground text-sm font-medium">
                        No problems found.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                problems.map((problem) => (
                  <tr key={problem.id || problem.ID} className="border-b border-border hover:bg-accent/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-muted-foreground font-medium">
                      {problem.id || problem.ID}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">
                      {problem.title}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      N/A
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

