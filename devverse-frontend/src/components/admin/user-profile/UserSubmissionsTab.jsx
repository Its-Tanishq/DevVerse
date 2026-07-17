import React from "react";
import { motion } from "framer-motion";
import { 
  RefreshCw, Check, Cpu, HardDrive 
} from "lucide-react";

export default function UserSubmissionsTab({
  submissions = [],
  loadingSubmissions = false,
  onRefresh,
  onSelectSubmission
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
    >
      <div className="p-5 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-bold text-foreground">All Submissions ({submissions.length})</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Click any row to inspect the submitted source code</p>
        </div>
        <button 
          onClick={onRefresh}
          disabled={loadingSubmissions}
          className="p-2 rounded-lg bg-accent text-muted-foreground hover:text-foreground transition-colors"
          title="Refresh submissions"
        >
          <RefreshCw size={15} className={loadingSubmissions ? "animate-spin" : ""} />
        </button>
      </div>

      {loadingSubmissions ? (
        <div className="py-16 flex flex-col items-center justify-center text-muted-foreground gap-3">
          <RefreshCw size={24} className="animate-spin text-[#7c3aed]" />
          <span className="text-sm">Loading submission logs...</span>
        </div>
      ) : submissions.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground text-sm">
          No problem submissions found for this user account.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-accent/30 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-3.5">Submission ID</th>
                <th className="px-6 py-3.5">Problem ID</th>
                <th className="px-6 py-3.5">Status / Verdict</th>
                <th className="px-6 py-3.5">Language</th>
                <th className="px-6 py-3.5">Runtime</th>
                <th className="px-6 py-3.5">Memory</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {submissions.map((sub) => (
                <tr 
                  key={sub.id || sub.ID}
                  onClick={() => onSelectSubmission && onSelectSubmission(sub)}
                  className="hover:bg-accent/40 cursor-pointer transition-colors group"
                >
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                    #{sub.id || sub.ID}
                  </td>
                  <td className="px-6 py-4 font-bold text-foreground">
                    Problem #{sub.problemsId}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                      sub.status === 'ACCEPTED' || sub.status === 'Accepted'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : sub.status?.includes('TIME')
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                        : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                    }`}>
                      {sub.status === 'ACCEPTED' || sub.status === 'Accepted' ? <Check size={12} /> : null}
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded bg-accent font-mono text-xs text-foreground uppercase">
                      {sub.language}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs font-mono">
                    <span className="flex items-center gap-1.5">
                      <Cpu size={13} className="text-muted-foreground/70" /> {sub.executionTimeMs || 0} ms
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs font-mono">
                    <span className="flex items-center gap-1.5">
                      <HardDrive size={13} className="text-muted-foreground/70" /> {sub.memoryUsedKb || 0} KB
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">
                    {new Date(sub.createdAt || Date.now()).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectSubmission && onSelectSubmission(sub);
                      }}
                      className="px-3 py-1 rounded-lg bg-[#7c3aed]/10 hover:bg-[#7c3aed]/20 text-[#7c3aed] text-xs font-semibold transition-colors"
                    >
                      View Code
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
