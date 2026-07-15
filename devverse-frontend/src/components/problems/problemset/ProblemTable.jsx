import React from "react";
import {
  Bookmark,
  CheckCircle2,
  Clock,
  Circle,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router";

const ProblemTable = ({ problemsData, loading, onToggleBookmark }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-[#1A1A1A] rounded-xl border border-neutral-200 dark:border-white/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap min-w-[700px]">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-white/5 text-xs font-bold text-neutral-500 uppercase tracking-wider">
              <th className="p-4 pl-6 font-bold w-16">#</th>
              <th className="p-4 font-bold">Title</th>
              <th className="p-4 font-bold w-32">Difficulty</th>
              <th className="p-4 font-bold w-32">Acceptance</th>
              <th className="p-4 font-bold">Tags</th>
              <th className="p-4 pr-6 w-24"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-neutral-500">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600 dark:text-[#9A7DFF]" />
                    <span className="text-sm font-medium">Loading problems...</span>
                  </div>
                </td>
              </tr>
            ) : problemsData.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-neutral-500 font-medium text-sm">
                  No problems found.
                </td>
              </tr>
            ) : (
              problemsData.map((p) => (
                <tr
                  key={p.ID || p.id}
                  className="border-b border-neutral-200 dark:border-white/5 hover:bg-neutral-50 dark:hover:bg-white/[0.03] transition-colors group"
                >
                  <td className="p-4 pl-6 text-neutral-500 font-medium">
                    {p.ID || p.id}
                  </td>
                  <td
                    className="p-4 font-bold hover:text-purple-600 dark:hover:text-[#9A7DFF] cursor-pointer transition-colors max-w-xs truncate"
                    onClick={() =>
                      navigate(
                        `/problem/${p.slug || p.ID || p.id}`
                      )
                    }
                  >
                    {p.title}
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                        p.difficulty === "Easy"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : p.difficulty === "Medium"
                          ? "bg-orange-500/10 text-orange-500"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {p.difficulty}
                    </span>
                  </td>
                  <td className="p-4 text-neutral-600 dark:text-neutral-400 text-sm font-medium">
                    {p.acceptance || "0%"}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {p.tags && p.tags.length > 0 ? (
                        p.tags.map((t) => (
                          <span
                            key={t.id || t.name || t}
                            className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-neutral-50 dark:bg-white/5 text-neutral-500 dark:text-neutral-400"
                          >
                            {t.name || t}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                          N/A
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 pr-6">
                    <div className="flex items-center justify-end gap-5">
                      <Bookmark
                        onClick={() =>
                          onToggleBookmark(p.ID || p.id, p.bookmarked)
                        }
                        className={`w-4 h-4 cursor-pointer transition-colors ${
                          p.bookmarked
                            ? "text-orange-500 fill-orange-500 hover:text-orange-400"
                            : "text-neutral-400 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400 opacity-0 group-hover:opacity-100"
                        }`}
                      />
                      {p.status === "solved" ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : p.status === "attempted" ? (
                        <Clock className="w-5 h-5 text-orange-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-neutral-300 dark:text-neutral-700 hover:text-neutral-400 dark:hover:text-neutral-500 cursor-pointer transition-colors" />
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProblemTable;
