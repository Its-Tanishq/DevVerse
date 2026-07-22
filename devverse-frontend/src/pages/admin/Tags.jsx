import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, Search, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import apiClient from "../../config/ApiClient";
import toast from "react-hot-toast";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import InputModal from "../../components/common/InputModal";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function Tags() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [tagName, setTagName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/problem/tag");
      const data = response.data?.data;
      if (Array.isArray(data)) {
        setTags(data);
      } else if (data && data.content) {
        setTags(data.content);
      } else {
        setTags([]);
      }
    } catch (error) {
      console.error("Failed to fetch tags:", error);
      toast.error("Failed to fetch tags");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTagWithValue = async (name) => {
    try {
      setIsSubmitting(true);
      await apiClient.post("/problem/tag", { name });
      toast.success("Tag added successfully");
      setIsAddOpen(false);
      setTagName("");
      fetchTags();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add tag");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTagWithValue = async (name) => {
    try {
      setIsSubmitting(true);
      await apiClient.patch(`/problem/tag/${selectedTag.id || selectedTag.ID}`, { name });
      toast.success("Tag updated successfully");
      setIsEditOpen(false);
      setSelectedTag(null);
      setTagName("");
      fetchTags();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update tag");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTag = async () => {
    try {
      setIsSubmitting(true);
      await apiClient.delete(`/problem/tag/${selectedTag.id || selectedTag.ID}`);
      toast.success("Tag deleted successfully");
      setIsDeleteOpen(false);
      setSelectedTag(null);
      fetchTags();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete tag");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8 border-b border-border pb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-blue-50 dark:bg-blue-900/20 w-10 h-10 rounded-lg flex items-center justify-center">
            <Tag size={20} className="text-blue-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Manage Tags
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Add, edit, or remove tags associated with problems.
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
            placeholder="Search tags..."
            className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <button 
          onClick={() => {
            setTagName("");
            setIsAddOpen(true);
          }}
          className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus size={16} />
          Add Tag
        </button>
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
                  Tag
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Problems
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
                      <p className="text-muted-foreground text-sm font-medium">
                        Loading tags...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : tags.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="bg-blue-50 dark:bg-blue-900/20 w-12 h-12 rounded-xl flex items-center justify-center mb-2">
                        <Tag size={24} className="text-blue-500" />
                      </div>
                      <p className="text-muted-foreground text-sm font-medium">
                        No tags found.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                tags.map((tag) => (
                  <tr key={tag.id || tag.ID} className="border-b border-border hover:bg-accent/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-500 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold uppercase">
                          {tag.name ? tag.name.charAt(0) : "?"}
                        </div>
                        <span className="font-semibold text-foreground text-sm">
                          {tag.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {tag.problemCount ?? 0}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => {
                            setSelectedTag(tag);
                            setTagName(tag.name);
                            setIsEditOpen(true);
                          }}
                          className="p-1.5 rounded-lg hover:bg-[#7c3aed]/10 text-muted-foreground hover:text-[#7c3aed] transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedTag(tag);
                            setIsDeleteOpen(true);
                          }}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modals */}
      <InputModal
        isOpen={isAddOpen || isEditOpen}
        onClose={() => {
          setIsAddOpen(false);
          setIsEditOpen(false);
        }}
        onSubmit={(value) => {
          if (isAddOpen) {
            handleAddTagWithValue(value);
          } else {
            handleEditTagWithValue(value);
          }
        }}
        title={isAddOpen ? "Add Tag" : "Edit Tag"}
        inputLabel="Tag Name"
        inputPlaceholder="Enter tag name"
        initialValue={tagName}
        submitText={isAddOpen ? "Add Tag" : "Save Changes"}
        isSubmitting={isSubmitting}
      />

      <ConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteTag}
        title="Delete Tag"
        description={`Are you sure you want to delete the tag "${selectedTag?.name}"? This action cannot be undone.`}
        confirmText="Delete Tag"
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
