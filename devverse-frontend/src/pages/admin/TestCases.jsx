import { motion } from "framer-motion";
import { TerminalSquare, Search, Plus, MoreHorizontal } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function TestCases() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8 border-b border-border pb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 w-10 h-10 rounded-lg flex items-center justify-center">
            <TerminalSquare size={20} className="text-emerald-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Manage Test Cases
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Create and configure test cases for problems.
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
            placeholder="Search by problem name..."
            className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <button className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-sm">
          <Plus size={16} />
          Add Test Case
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
                  Problem
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Input
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Expected Output
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border hover:bg-accent/30 transition-colors">
                <td className="px-6 py-4 text-sm font-semibold text-foreground">
                  Two Sum
                </td>
                <td className="px-6 py-4">
                  <code className="bg-accent/50 text-foreground px-2 py-1 rounded-md text-xs font-mono border border-border/50">
                    [2,7,11,15], 9
                  </code>
                </td>
                <td className="px-6 py-4">
                  <code className="bg-accent/50 text-foreground px-2 py-1 rounded-md text-xs font-mono border border-border/50">
                    [0,1]
                  </code>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 px-2.5 py-1 rounded-full text-xs font-medium">
                    Sample
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>

              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 w-12 h-12 rounded-xl flex items-center justify-center mb-2">
                      <TerminalSquare size={24} className="text-emerald-500" />
                    </div>
                    <p className="text-muted-foreground text-sm font-medium">
                      Test case data will be loaded from the API.
                    </p>
                    <p className="text-muted-foreground/60 text-xs">
                      Connect your backend to see real data here
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
