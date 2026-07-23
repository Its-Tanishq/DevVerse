import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FolderOpen, Search, Plus, Edit2, Trash2, MoreHorizontal, Code2, TestTube } from "lucide-react";
import apiClient from "../../config/ApiClient";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import ProblemModal from "../../components/admin/ProblemModal";
import TestCasesModal from "../../components/admin/TestCasesModal";
import BoilerplateModal from "../../components/admin/BoilerplateModal";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All Difficulties");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [problemToDelete, setProblemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [isProblemModalOpen, setIsProblemModalOpen] = useState(false);
  const [problemToEdit, setProblemToEdit] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [testCasesProblem, setTestCasesProblem] = useState(null);
  const [boilerplateProblem, setBoilerplateProblem] = useState(null);

  // Actions Dropdown State (using Portal)
  const [dropdownState, setDropdownState] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownState(null);
      }
    }
    function handleScrollOrResize() {
      if (dropdownState) setDropdownState(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [dropdownState]);

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

  const handleDeleteClick = (problem) => {
    setProblemToDelete(problem);
    setIsDeleteModalOpen(true);
  };

  const handleAddClick = () => {
    setProblemToEdit(null);
    setIsProblemModalOpen(true);
  };

  const handleEditClick = (problem) => {
    setProblemToEdit(problem);
    setIsProblemModalOpen(true);
  };

  const handleAction = (action, problem) => {
    setDropdownState(null);
    
    if (action === 'edit') {
      handleEditClick(problem);
    } else if (action === 'delete') {
      handleDeleteClick(problem);
    } else if (action === 'testcases') {
      setTestCasesProblem(problem);
    } else if (action === 'boilerplate') {
      setBoilerplateProblem(problem);
    }
  };

  const handleSaveProblem = async (formData) => {
    try {
      setIsSaving(true);
      if (problemToEdit) {
        const problemId = problemToEdit.id || problemToEdit.ID;
        await apiClient.patch(`/problem/${problemId}`, formData);
      } else {
        await apiClient.post("/problem", formData);
      }
      setIsProblemModalOpen(false);
      fetchProblems(); // Refetch problems list
    } catch (error) {
      console.error("Failed to save problem:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!problemToDelete) return;
    try {
      setIsDeleting(true);
      const problemId = problemToDelete.id || problemToDelete.ID;
      await apiClient.delete(`/problem/${problemId}`);
      setProblems(problems.filter(p => (p.id || p.ID) !== problemId));
      setIsDeleteModalOpen(false);
      setProblemToDelete(null);
    } catch (error) {
      console.error("Failed to delete problem:", error);
    } finally {
      setIsDeleting(false);
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

  const filteredProblems = problems.filter((problem) => {
    const searchLower = searchQuery.toLowerCase();
    const titleMatch = problem.title?.toLowerCase().includes(searchLower);
    const idMatch = String(problem.id || problem.ID || "").includes(searchLower);
    const matchesSearch = titleMatch || idMatch;
    
    const matchesDifficulty = difficultyFilter === "All Difficulties" || problem.difficulty?.toUpperCase() === difficultyFilter.toUpperCase();
                              
    return matchesSearch && matchesDifficulty;
  });

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="bg-card border border-border rounded-xl px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-colors appearance-none pr-8"
          >
            <option>All Difficulties</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
          <button 
            onClick={handleAddClick}
            className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
          >
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
                  Acceptance Rate
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Total Submissions
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mb-2"></div>
                      <p className="text-muted-foreground text-sm font-medium">
                        Loading problems...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredProblems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
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
                filteredProblems.map((problem) => (
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
                      {problem.acceptanceRate != null ? `${Number(problem.acceptanceRate).toFixed(1)}%` : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {problem.totalSubmissions || 0}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          const problemId = problem.id || problem.ID;
                          if (dropdownState?.problemId === problemId) {
                            setDropdownState(null);
                          } else {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setDropdownState({
                              problemId: problemId,
                              problem: problem,
                              top: rect.bottom + 6,
                              left: rect.right - 224, // 224px equals w-56
                            });
                          }
                        }}
                        className={`p-2 rounded-xl transition-colors ${dropdownState?.problemId === (problem.id || problem.ID) ? 'bg-[#7c3aed]/10 text-[#7c3aed]' : 'hover:bg-accent text-muted-foreground hover:text-foreground border border-transparent hover:border-border'}`}
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Problem"
        description={`Are you sure you want to delete "${problemToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        isSubmitting={isDeleting}
      />

      <ProblemModal
        isOpen={isProblemModalOpen}
        onClose={() => setIsProblemModalOpen(false)}
        onSave={handleSaveProblem}
        initialData={problemToEdit}
        isSubmitting={isSaving}
      />

      <TestCasesModal
        isOpen={!!testCasesProblem}
        onClose={() => setTestCasesProblem(null)}
        problem={testCasesProblem}
      />

      <BoilerplateModal
        isOpen={!!boilerplateProblem}
        onClose={() => setBoilerplateProblem(null)}
        problem={boilerplateProblem}
      />

      {/* Portal Dropdown Menu */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {dropdownState && (
            <motion.div
              ref={dropdownRef}
              key={`portal-dropdown-${dropdownState.problemId}`}
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'fixed',
                top: `${dropdownState.top}px`,
                left: `${Math.max(16, dropdownState.left)}px`,
                zIndex: 99999,
              }}
              className="w-56 rounded-xl bg-card border border-border shadow-2xl overflow-hidden divide-y divide-border"
            >
              <div className="py-1">
                <button onClick={() => handleAction('edit', dropdownState.problem)} className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-accent flex items-center gap-2.5 transition-colors">
                  <Edit2 size={15} className="text-muted-foreground" />
                  Edit Problem
                </button>
                <button onClick={() => handleAction('testcases', dropdownState.problem)} className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-accent flex items-center gap-2.5 transition-colors">
                  <TestTube size={15} className="text-muted-foreground" />
                  Add Test Cases
                </button>
                <button onClick={() => handleAction('boilerplate', dropdownState.problem)} className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-accent flex items-center gap-2.5 transition-colors">
                  <Code2 size={15} className="text-muted-foreground" />
                  Add Boilerplate
                </button>
              </div>
              <div className="py-1">
                <button onClick={() => handleAction('delete', dropdownState.problem)} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2.5 transition-colors">
                  <Trash2 size={15} className="text-red-500" />
                  Delete Problem
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

