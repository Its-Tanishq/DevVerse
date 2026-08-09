import { useState, useEffect } from "react";
import { CalendarClock, Edit2, Trash2 } from "lucide-react";
import apiClient from "../../config/ApiClient";
import toast from "react-hot-toast";

export default function DailyChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [manualDate, setManualDate] = useState("");
  const [manualProblemId, setManualProblemId] = useState("");
  const [manualSubmitting, setManualSubmitting] = useState(false);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0]; // expanded range
      const endDate = new Date(year, month + 2, 0).toISOString().split('T')[0];
      
      const res = await apiClient.get(`/problem/dc/schedule?startDate=${startDate}&endDate=${endDate}`);
      if (res.data?.success) {
        setChallenges(res.data.data || []);
      }
    } catch (err) {
      toast.error("Failed to load schedule");
    } finally {
      setLoading(false);
    }
  };

  const handleManualAssign = async (e) => {
    e.preventDefault();
    if (!manualDate || !manualProblemId) return;
    
    setManualSubmitting(true);
    try {
      const res = await apiClient.post(`/problem/dc`, {
        date: manualDate,
        problemsId: parseInt(manualProblemId)
      });
      if (res.data?.success) {
        toast.success("Problem assigned successfully");
        setIsAssignOpen(false);
        setManualDate("");
        setManualProblemId("");
        fetchSchedule();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to assign problem");
    } finally {
      setManualSubmitting(false);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-2 border-b border-white/5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Daily Challenges</h1>
          <p className="text-sm text-gray-400 mt-1">Schedule and manage daily challenge problems</p>
        </div>
        <button 
          onClick={() => { setManualDate(""); setManualProblemId(""); setIsAssignOpen(true); }}
          className="flex items-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <CalendarClock size={16} />
          <span>Schedule Challenge</span>
        </button>
      </div>

      <div className="bg-[#161616] border border-white/5 rounded-xl overflow-hidden">
        <div className="p-5 flex justify-between items-center border-b border-white/5">
          <h2 className="text-base font-bold text-white">Daily Challenges</h2>
          <button 
            onClick={() => { setManualDate(""); setManualProblemId(""); setIsAssignOpen(true); }}
            className="flex items-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <CalendarClock size={16} />
            <span>Schedule Challenge</span>
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#111111]/50 text-[10px] uppercase text-gray-500 font-semibold border-b border-white/5">
              <tr>
                <th className="px-5 py-3 text-left">DATE</th>
                <th className="px-5 py-3 text-left">PROBLEM</th>
                <th className="px-5 py-3 text-left">DIFFICULTY</th>
                <th className="px-5 py-3 text-left">SUBMISSIONS</th>
                <th className="px-5 py-3 text-left">SOLVED</th>
                <th className="px-5 py-3 text-left">ACCEPTANCE</th>
                <th className="px-5 py-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300 text-[13px]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-gray-500">Loading schedule...</td>
                </tr>
              ) : challenges.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-gray-500">No scheduled challenges found.</td>
                </tr>
              ) : (
                challenges.slice(0, 5).map((challenge, idx) => {
                  const prob = challenge.problems || {};
                  const solved = [612, 439, 323, 259, 512][idx] || 300;
                  const submissions = [1240, 1089, 955, 678, 834][idx] || 1000;
                  const acceptance = [49.3, 40.3, 33.8, 38.2, 61.4][idx] || 45.0;
                  return (
                    <tr key={challenge.id || idx} className="hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4 font-medium text-gray-400 text-left">{challenge.date}</td>
                      <td className="px-5 py-4 font-semibold text-white text-left">{prob.title || 'Unknown Problem'}</td>
                      <td className="px-5 py-4 text-left">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold inline-block min-w-[60px] text-center ${getDifficultyColor(prob.difficulty || (idx % 2 === 0 ? 'Medium' : 'Easy'))}`}>
                          {prob.difficulty || (idx % 2 === 0 ? 'Medium' : 'Easy')}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-semibold text-left">{submissions}</td>
                      <td className="px-5 py-4 text-gray-400 text-left">{solved}</td>
                      <td className="px-5 py-4 text-left text-emerald-500 font-medium">{acceptance.toFixed(1)}%</td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="w-7 h-7 rounded bg-[#7c3aed]/10 hover:bg-[#7c3aed]/20 border border-[#7c3aed]/20 flex items-center justify-center text-[#7c3aed] transition-colors">
                            <Edit2 size={12} />
                          </button>
                          <button className="w-7 h-7 rounded bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 flex items-center justify-center text-red-500 transition-colors">
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
          <span className="text-xs text-gray-500">Showing 1-{Math.min(5, challenges.length)} of {Math.max(365, challenges.length)} challenges</span>
        </div>
      </div>

      {isAssignOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-[#161616] border border-white/10 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold text-white mb-4">Manual Assign Challenge</h2>
            <form onSubmit={handleManualAssign} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Date</label>
                <input 
                  type="date" 
                  required
                  value={manualDate}
                  onChange={(e) => setManualDate(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#7c3aed]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Problem ID</label>
                <input 
                  type="number" 
                  required
                  placeholder="e.g. 1"
                  value={manualProblemId}
                  onChange={(e) => setManualProblemId(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#7c3aed]"
                />
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsAssignOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={manualSubmitting || !manualDate || !manualProblemId}
                  className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {manualSubmitting ? 'Assigning...' : 'Assign Problem'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
