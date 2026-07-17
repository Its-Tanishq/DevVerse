import React from "react";
import { motion } from "framer-motion";
import { Code2, X } from "lucide-react";

export default function SubmissionInspectModal({ submission, onClose }) {
  if (typeof document === "undefined" || !submission) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden max-h-[85vh] flex flex-col"
      >
        <div className="p-5 border-b border-border flex items-center justify-between bg-accent/30">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${
              submission.status === 'ACCEPTED' || submission.status === 'Accepted'
                ? 'bg-emerald-500/10 text-emerald-500'
                : 'bg-red-500/10 text-red-500'
            }`}>
              <Code2 size={18} />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Submission #{submission.id || submission.ID}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <span>Problem #{submission.problemsId}</span> • 
                <span className="font-mono uppercase text-[#7c3aed] font-semibold">{submission.language}</span> •
                <span>{submission.executionTimeMs || 0} ms</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 bg-[#1e1e2e] text-gray-200 font-mono text-xs leading-relaxed">
          <pre className="whitespace-pre-wrap overflow-x-auto">
            {submission.code || "// No code content retrieved."}
          </pre>
        </div>

        <div className="p-4 border-t border-border bg-card flex items-center justify-between text-xs text-muted-foreground">
          <span>Submitted on {new Date(submission.createdAt || Date.now()).toLocaleString()}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-accent hover:bg-accent/80 text-foreground font-semibold rounded-xl transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </motion.div>
    </div>
  );
}
