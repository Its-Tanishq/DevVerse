import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Edit2, Trash2, Eye, EyeOff, Save, Loader2, ArrowLeft } from "lucide-react";
import apiClient from "../../config/ApiClient";

export default function TestCasesModal({ isOpen, onClose, problem }) {
  const [testCases, setTestCases] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    input: "",
    output: "",
    isHidden: false
  });

  useEffect(() => {
    if (isOpen && problem) {
      fetchTestCases();
      setIsFormOpen(false);
    }
  }, [isOpen, problem]);

  const fetchTestCases = async () => {
    try {
      setLoading(true);
      const problemId = problem.id || problem.ID;
      const res = await apiClient.get(`/problem/testcase/problem/${problemId}`);
      if (res.data?.data) {
        setTestCases(res.data.data);
      } else {
        setTestCases([]);
      }
    } catch (error) {
      console.error("Failed to fetch test cases:", error);
      setTestCases([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({ input: "", output: "", isHidden: false });
    setIsFormOpen(true);
  };

  const handleEditClick = (tc) => {
    setEditingId(tc.id || tc.ID);
    setFormData({
      input: tc.input || "",
      output: tc.output || "",
      isHidden: tc.isHidden || false
    });
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (tcId) => {
    if (!window.confirm("Are you sure you want to delete this test case?")) return;
    try {
      await apiClient.delete(`/problem/testcase/${tcId}`);
      fetchTestCases();
    } catch (error) {
      console.error("Failed to delete test case:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const payload = {
        ...formData,
        problemsId: problem.id || problem.ID
      };

      if (editingId) {
        await apiClient.patch(`/problem/testcase/${editingId}`, payload);
      } else {
        await apiClient.post(`/problem/testcase`, payload);
      }
      setIsFormOpen(false);
      fetchTestCases();
    } catch (error) {
      console.error("Failed to save test case:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !problem) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-card border border-border w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        <div className="p-6 border-b border-border flex items-center justify-between bg-accent/30 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Test Cases
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage test cases for <span className="font-semibold text-foreground">{problem.title}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-accent text-muted-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {isFormOpen ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 mb-6">
                  <button 
                    onClick={() => setIsFormOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground transition-colors"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <h3 className="font-semibold text-foreground">
                    {editingId ? "Edit Test Case" : "Add Test Case"}
                  </h3>
                </div>

                <form id="tc-form" onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Input
                      </label>
                      <textarea
                        required
                        rows={6}
                        value={formData.input}
                        onChange={(e) => setFormData({ ...formData, input: e.target.value })}
                        className="w-full bg-background border border-border rounded-xl p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-colors font-mono"
                        placeholder="e.g. nums = [2,7,11,15], target = 9"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Expected Output
                      </label>
                      <textarea
                        required
                        rows={6}
                        value={formData.output}
                        onChange={(e) => setFormData({ ...formData, output: e.target.value })}
                        className="w-full bg-background border border-border rounded-xl p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-colors font-mono"
                        placeholder="e.g. [0,1]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-accent/30 p-4 rounded-xl border border-border">
                    <input
                      type="checkbox"
                      id="isHidden"
                      checked={formData.isHidden}
                      onChange={(e) => setFormData({ ...formData, isHidden: e.target.checked })}
                      className="w-4 h-4 text-[#7c3aed] rounded border-gray-300 focus:ring-[#7c3aed]"
                    />
                    <label htmlFor="isHidden" className="text-sm font-medium text-foreground cursor-pointer flex-1">
                      Hidden Test Case
                    </label>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="flex justify-end mb-4">
                  <button
                    onClick={handleAddClick}
                    className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <Plus size={16} />
                    Add Test Case
                  </button>
                </div>

                {loading ? (
                  <div className="py-12 flex justify-center items-center">
                    <Loader2 size={24} className="animate-spin text-[#7c3aed]" />
                  </div>
                ) : testCases.length === 0 ? (
                  <div className="py-12 text-center bg-accent/30 rounded-2xl border border-border border-dashed">
                    <p className="text-muted-foreground font-medium">No test cases found.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {testCases.map((tc, index) => (
                      <div key={tc.id || tc.ID} className="bg-background border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-bold text-foreground">Case {index + 1}</span>
                            {tc.isHidden ? (
                              <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 border border-amber-500/20">
                                <EyeOff size={10} /> Hidden
                              </span>
                            ) : (
                              <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 border border-emerald-500/20">
                                <Eye size={10} /> Public
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="bg-accent/50 p-2.5 rounded-lg border border-border/50">
                              <span className="text-muted-foreground font-semibold block mb-1">Input:</span>
                              <div className="font-mono text-foreground truncate">{tc.input}</div>
                            </div>
                            <div className="bg-accent/50 p-2.5 rounded-lg border border-border/50">
                              <span className="text-muted-foreground font-semibold block mb-1">Expected Output:</span>
                              <div className="font-mono text-foreground truncate">{tc.output}</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex sm:flex-col gap-2 shrink-0 self-end sm:self-center">
                          <button 
                            onClick={() => handleEditClick(tc)}
                            className="p-2 rounded-lg bg-[#7c3aed]/10 text-[#7c3aed] hover:bg-[#7c3aed]/20 transition-colors flex items-center gap-2 flex-1 justify-center"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(tc.id || tc.ID)}
                            className="p-2 rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 transition-colors flex items-center gap-2 flex-1 justify-center"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {isFormOpen && (
          <div className="p-6 border-t border-border bg-accent/30 shrink-0 flex justify-end gap-3">
            <button
              onClick={() => setIsFormOpen(false)}
              className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="tc-form"
              disabled={isSubmitting}
              className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {editingId ? "Save Changes" : "Create Test Case"}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
