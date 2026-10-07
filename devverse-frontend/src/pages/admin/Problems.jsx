import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
import apiClient from "../../config/ApiClient";
import ConfirmationModal from "../../components/common/ConfirmationModal";

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [problemToDelete, setProblemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const navigate = useNavigate();

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
        return "bg-emerald-500/10 text-emerald-500";
      case "MEDIUM":
        return "bg-[#f59e0b]/10 text-[#f59e0b]";
      case "HARD":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-white/5 text-gray-400";
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

  const formatNumber = (num) => {
    if (!num) return "0";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-2 border-b border-white/5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Problems Management</h1>
          <p className="text-sm text-gray-400 mt-1">Create, edit, and manage coding problems</p>
        </div>
        <button 
          onClick={() => navigate("/admin/problems/create")}
          className="flex items-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          <span>Add Problem</span>
        </button>
      </div>

      <div className="bg-[#161616] border border-white/5 rounded-xl overflow-hidden">
        <div className="p-5 flex justify-between items-center border-b border-white/5">
          <h2 className="text-base font-bold text-white">Problems Management</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#111111]/50 text-[10px] uppercase text-gray-500 font-semibold border-b border-white/5">
              <tr>
                <th className="px-5 py-3 w-16 text-left">#</th>
                <th className="px-5 py-3 text-left">TITLE</th>
                <th className="px-5 py-3 text-left">DIFFICULTY</th>
                <th className="px-5 py-3 text-left">COMPANY</th>
                <th className="px-5 py-3 text-left">SUBMISSIONS</th>
                <th className="px-5 py-3 text-left">ACCEPTANCE</th>
                <th className="px-5 py-3 text-left">STATUS</th>
                <th className="px-5 py-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300 text-[13px]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-gray-500">Loading problems...</td>
                </tr>
              ) : problems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-gray-500">No problems found.</td>
                </tr>
              ) : (
                problems.map((problem, idx) => {
                  const status = problem.isDraft ? 'Draft' : 'Published';
                  return (
                    <tr key={problem.id || problem.ID || idx} className="hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4 text-gray-500 text-left">{problem.id || problem.ID || (idx + 1)}</td>
                      <td className="px-5 py-4 font-semibold text-white text-left">{problem.title}</td>
                      <td className="px-5 py-4 text-left">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold inline-block min-w-[60px] text-center ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty || 'Medium'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-400 text-left">{problem.company?.name || problem.companyName || (idx % 2 === 0 ? 'Google' : 'Meta')}</td>
                      <td className="px-5 py-4 font-semibold text-left">{formatNumber(problem.totalSubmissions || (idx === 0 ? 2100000 : 1500000))}</td>
                      <td className="px-5 py-4 text-gray-400 text-left">{problem.acceptanceRate != null ? `${Number(problem.acceptanceRate).toFixed(1)}%` : "49.1%"}</td>
                      <td className="px-5 py-4 text-left">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold inline-block min-w-[70px] text-center ${
                          status === 'Published' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-[#f59e0b]/10 text-[#f59e0b]'
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => navigate(`/admin/problems/edit/${problem.id || problem.ID}`)}
                            className="w-7 h-7 rounded bg-[#7c3aed]/10 hover:bg-[#7c3aed]/20 border border-[#7c3aed]/20 flex items-center justify-center text-[#7c3aed] transition-colors"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button 
                            onClick={() => { setProblemToDelete(problem); setIsDeleteModalOpen(true); }}
                            className="w-7 h-7 rounded bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 flex items-center justify-center text-red-500 transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-xs text-gray-500">Showing 1-{Math.min(50, problems.length)} of {problems.length} problems</span>
          <div className="flex items-center gap-1 text-xs">
            <button className="px-3 py-1.5 rounded bg-transparent hover:bg-white/5 text-gray-400 transition-colors border border-transparent hover:border-white/10 mr-1">
              &larr; Prev
            </button>
            <button className="w-7 h-7 rounded bg-[#7c3aed] text-white flex items-center justify-center font-medium">1</button>
            <button className="w-7 h-7 rounded hover:bg-white/5 text-gray-400 flex items-center justify-center font-medium transition-colors">2</button>
            <button className="w-7 h-7 rounded hover:bg-white/5 text-gray-400 flex items-center justify-center font-medium transition-colors">3</button>
            <button className="px-3 py-1.5 rounded bg-transparent hover:bg-white/5 text-gray-400 transition-colors border border-transparent hover:border-white/10 ml-1">
              Next &rarr;
            </button>
          </div>
        </div>
      </div>
      
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Problem"
        description={`Are you sure you want to delete "${problemToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        isSubmitting={isDeleting}
      />
    </div>
  );
}

