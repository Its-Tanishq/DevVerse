import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Edit2, Trash2, Save, Loader2, ArrowLeft, Code2 } from "lucide-react";
import apiClient from "../../config/ApiClient";

const LANGUAGES = [
  "CPP", "JAVA", "PYTHON", "JAVASCRIPT", "TYPESCRIPT", 
  "C_SHARP", "C", "GO", "KOTLIN", "RUST"
];

export default function BoilerplateModal({ isOpen, onClose, problem }) {
  const [boilerplates, setBoilerplates] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    language: "JAVA",
    boilerplate: ""
  });

  useEffect(() => {
    if (isOpen && problem) {
      fetchBoilerplates();
      setIsFormOpen(false);
    }
  }, [isOpen, problem]);

  const fetchBoilerplates = async () => {
    try {
      setLoading(true);
      const problemId = problem.id || problem.ID;
      const res = await apiClient.get(`/problem/boilerplate/problem/${problemId}`);
      if (res.data?.data) {
        setBoilerplates(res.data.data);
      } else {
        setBoilerplates([]);
      }
    } catch (error) {
      console.error("Failed to fetch boilerplates:", error);
      setBoilerplates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({ language: "JAVA", boilerplate: "" });
    setIsFormOpen(true);
  };

  const handleEditClick = (bp) => {
    setEditingId(bp.id || bp.ID);
    setFormData({
      language: bp.language || "JAVA",
      boilerplate: bp.boilerplate || ""
    });
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (bpId) => {
    if (!window.confirm("Are you sure you want to delete this boilerplate?")) return;
    try {
      await apiClient.delete(`/problem/boilerplate/${bpId}`);
      fetchBoilerplates();
    } catch (error) {
      console.error("Failed to delete boilerplate:", error);
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
        await apiClient.patch(`/problem/boilerplate/${editingId}`, payload);
      } else {
        await apiClient.post(`/problem/boilerplate`, payload);
      }
      setIsFormOpen(false);
      fetchBoilerplates();
    } catch (error) {
      console.error("Failed to save boilerplate:", error);
      alert(error.response?.data?.message || "Failed to save boilerplate");
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
              Code Boilerplates
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage starter code for <span className="font-semibold text-foreground">{problem.title}</span>
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
                    {editingId ? "Edit Boilerplate" : "Add Boilerplate"}
                  </h3>
                </div>

                <form id="bp-form" onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Language
                    </label>
                    <select
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      className="w-full sm:w-1/2 bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-colors appearance-none"
                    >
                      {LANGUAGES.map((lang) => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5 flex justify-between items-center">
                      <span>Starter Code</span>
                      <span className="text-xs text-muted-foreground font-normal">This will be pre-filled in the code editor</span>
                    </label>
                    <textarea
                      required
                      rows={12}
                      value={formData.boilerplate}
                      onChange={(e) => setFormData({ ...formData, boilerplate: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl p-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-colors font-mono"
                      placeholder="class Solution {&#10;    public int[] twoSum(int[] nums, int target) {&#10;        &#10;    }&#10;}"
                    />
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
                    Add Boilerplate
                  </button>
                </div>

                {loading ? (
                  <div className="py-12 flex justify-center items-center">
                    <Loader2 size={24} className="animate-spin text-[#7c3aed]" />
                  </div>
                ) : boilerplates.length === 0 ? (
                  <div className="py-12 text-center bg-accent/30 rounded-2xl border border-border border-dashed">
                    <Code2 size={32} className="mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground font-medium">No boilerplates found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {boilerplates.map((bp) => (
                      <div key={bp.id || bp.ID} className="bg-background border border-border rounded-xl overflow-hidden flex flex-col">
                        <div className="bg-accent/50 p-3 flex items-center justify-between border-b border-border">
                          <span className="font-bold text-foreground text-sm uppercase tracking-wider">{bp.language}</span>
                          <div className="flex gap-1">
                            <button 
                              onClick={() => handleEditClick(bp)}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-[#7c3aed] hover:bg-[#7c3aed]/10 transition-colors"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(bp.id || bp.ID)}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="p-4 bg-accent/10">
                          <pre className="text-xs font-mono text-muted-foreground overflow-x-auto whitespace-pre-wrap max-h-32">
                            {bp.boilerplate}
                          </pre>
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
              form="bp-form"
              disabled={isSubmitting}
              className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {editingId ? "Save Changes" : "Create Boilerplate"}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
