import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import apiClient from "../../config/ApiClient";
import {
  Bookmark,
  Share2,
  FileText,
  Lightbulb,
  MessageSquare,
  BookOpen,
  Lock,
  History,
  Notebook,
  Loader2,
} from "lucide-react";

import ProblemHeader from "../../components/problems/probleminfo/ProblemHeader";
import ProblemDescriptionTab from "../../components/problems/probleminfo/ProblemDescriptionTab";
import ProblemHintsTab from "../../components/problems/probleminfo/ProblemHintsTab";
import ProblemDiscussionTab from "../../components/problems/probleminfo/ProblemDiscussionTab";
import ProblemSubmissionsTab from "../../components/problems/probleminfo/ProblemSubmissionsTab";
import ProblemNotesTab from "../../components/problems/probleminfo/ProblemNotesTab";
import ProblemEditorialTab from "../../components/problems/probleminfo/ProblemEditorialTab";
import ProblemCodeEditor from "../../components/problems/probleminfo/ProblemCodeEditor";

const ProblemInfo = () => {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const [leftTab, setLeftTab] = useState("description");
  const [problemData, setProblemData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/problem/${identifier}`);
        if (res.data?.success) {
          setProblemData(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching problem:", err);
      } finally {
        setLoading(false);
      }
    };
    if (identifier) fetchProblem();
  }, [identifier]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-white dark:bg-[#1a1a1a]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600 dark:text-[#9A7DFF]" />
      </div>
    );
  }

  if (!problemData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full bg-white dark:bg-[#1a1a1a]">
        <h2 className="text-xl font-bold text-neutral-500 mb-4">
          Problem not found.
        </h2>
        <button
          onClick={() => navigate("/problemset")}
          className="text-purple-600 hover:underline"
        >
          Return to Problemset
        </button>
      </div>
    );
  }

  const problemId = problemData.ID || problemData.id;

  return (
    <div className="flex flex-col h-screen w-full bg-white dark:bg-[#1a1a1a] text-neutral-700 dark:text-neutral-300 font-sans transition-colors">
      <ProblemHeader
        problemId={problemId}
        problemTitle={problemData.title}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane */}
        <div className="w-1/2 flex flex-col border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1a1a1a] overflow-y-auto p-6 transition-colors font-sans">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 text-sm font-medium">
              <span className="text-neutral-500">#{problemId}</span>
              <span
                className={`px-2 py-0.5 rounded-full ${
                  problemData.difficulty === "Easy"
                    ? "text-emerald-600 dark:text-emerald-500 bg-emerald-100 dark:bg-emerald-500/10"
                    : problemData.difficulty === "Medium"
                    ? "text-orange-600 dark:text-orange-500 bg-orange-100 dark:bg-orange-500/10"
                    : "text-red-600 dark:text-red-500 bg-red-100 dark:bg-red-500/10"
                }`}
              >
                {problemData.difficulty}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-amber-500 transition-colors border border-neutral-200 dark:border-neutral-700">
                <Bookmark
                  className={`w-4 h-4 ${
                    problemData.bookmarked ? "fill-amber-500" : ""
                  }`}
                />
              </button>
              <button className="p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors border border-neutral-200 dark:border-neutral-700">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
            {problemData.title}
          </h1>

          <div className="flex items-center gap-2 mb-6 flex-wrap">
            {problemData.tags?.map((tag) => (
              <span
                key={tag.id || tag.name || tag}
                className="text-xs font-medium text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800/80 px-3 py-1.5 rounded-full"
              >
                {tag.name || tag}
              </span>
            ))}
          </div>

          {/* Left panel tabs navigation */}
          <div className="flex items-center gap-1 border-b border-neutral-200 dark:border-neutral-800 mb-6 flex-wrap">
            <button
              onClick={() => setLeftTab("description")}
              className={`flex items-center gap-2 px-4 py-2 transition-colors ${
                leftTab === "description"
                  ? "border-b-2 border-purple-600 dark:border-purple-500 text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">Description</span>
            </button>
            <button
              onClick={() => setLeftTab("hints")}
              className={`flex items-center gap-2 px-4 py-2 transition-colors ${
                leftTab === "hints"
                  ? "border-b-2 border-purple-600 dark:border-purple-500 text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              <span className="text-sm font-medium">Hints</span>
            </button>
            <button
              onClick={() => setLeftTab("discussion")}
              className={`flex items-center gap-2 px-4 py-2 transition-colors ${
                leftTab === "discussion"
                  ? "border-b-2 border-purple-600 dark:border-purple-500 text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm font-medium">Discussion</span>
            </button>
            <button
              onClick={() => setLeftTab("editorial")}
              className={`flex items-center gap-2 px-4 py-2 transition-colors ${
                leftTab === "editorial"
                  ? "border-b-2 border-purple-600 dark:border-purple-500 text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-medium">Editorial</span>
              <Lock className="w-3 h-3 text-amber-500" />
            </button>
            <button
              onClick={() => setLeftTab("submissions")}
              className={`flex items-center gap-2 px-4 py-2 transition-colors ${
                leftTab === "submissions"
                  ? "border-b-2 border-purple-600 dark:border-purple-500 text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
              }`}
            >
              <History className="w-4 h-4" />
              <span className="text-sm font-medium">Submissions</span>
            </button>
            <button
              onClick={() => setLeftTab("notes")}
              className={`flex items-center gap-2 px-4 py-2 transition-colors ${
                leftTab === "notes"
                  ? "border-b-2 border-purple-600 dark:border-purple-500 text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
              }`}
            >
              <Notebook className="w-4 h-4" />
              <span className="text-sm font-medium">Notes</span>
            </button>
          </div>

          {/* Left panel tabs content */}
          {leftTab === "description" && (
            <ProblemDescriptionTab description={problemData.description} />
          )}

          {leftTab === "hints" && (
            <ProblemHintsTab hints={problemData.hints} />
          )}

          {leftTab === "discussion" && (
            <ProblemDiscussionTab problemId={problemId} />
          )}

          {leftTab === "editorial" && <ProblemEditorialTab />}

          {leftTab === "submissions" && (
            <ProblemSubmissionsTab problemId={problemId} />
          )}

          {leftTab === "notes" && <ProblemNotesTab problemId={problemId} />}

          <div className="mt-auto pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-neutral-500 font-medium">Acceptance</span>
                <span className="text-emerald-600 dark:text-emerald-500 font-bold">
                  61.4%
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-neutral-500 font-medium">
                  Submissions
                </span>
                <span className="text-neutral-900 dark:text-white font-bold">
                  1.2M
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-neutral-500 font-medium">Difficulty</span>
                <span className="text-orange-600 dark:text-orange-500 font-bold">
                  {problemData.difficulty}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane (Code Editor & Output Console) */}
        <ProblemCodeEditor />
      </div>
    </div>
  );
};

export default ProblemInfo;
