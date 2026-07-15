import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import apiClient from "../../../config/ApiClient";

const ProblemNotesTab = ({ problemId }) => {
  const [notes, setNotes] = useState("");
  const [workspaceData, setWorkspaceData] = useState(null);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        setLoadingNotes(true);
        const res = await apiClient.get(
          `/problem/workspace/user/problem/${problemId}`
        );
        if (res.data?.success && res.data.data) {
          setWorkspaceData(res.data.data);
          setNotes(res.data.data.notes || "");
        }
      } catch (err) {
        console.error("Error fetching workspace notes:", err);
      } finally {
        setLoadingNotes(false);
      }
    };
    if (problemId) fetchWorkspace();
  }, [problemId]);

  const handleSaveNotes = async () => {
    try {
      setIsSavingNotes(true);
      const res = await apiClient.post("/problem/workspace", {
        problemsId: problemId,
        isBookmark: workspaceData?.isBookmark || false,
        notes: notes,
      });
      if (res.data?.success) {
        setWorkspaceData(res.data.data);
      }
    } catch (err) {
      console.error("Error saving notes:", err);
    } finally {
      setIsSavingNotes(false);
    }
  };

  return (
    <div className="text-sm text-neutral-700 dark:text-neutral-300 mb-8 flex flex-col h-64">
      {loadingNotes ? (
        <div className="flex-1 flex items-center justify-center border border-neutral-200 dark:border-neutral-800 rounded-lg">
          <Loader2 className="w-6 h-6 animate-spin text-purple-600 dark:text-[#9A7DFF]" />
        </div>
      ) : (
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="flex-1 w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-neutral-900 dark:text-white font-sans"
          placeholder="Write your notes for this problem here..."
        />
      )}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleSaveNotes}
          disabled={isSavingNotes || loadingNotes}
          className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 transition-colors text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
        >
          {isSavingNotes && <Loader2 className="w-4 h-4 animate-spin" />}
          Save Notes
        </button>
      </div>
    </div>
  );
};

export default ProblemNotesTab;
