import React from "react";
import {
  Shuffle,
  SlidersHorizontal,
  CheckCircle2,
  Circle,
  Clock,
  Lock,
  X,
  Flame,
  Zap,
  Bookmark,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Checkbox = ({
  label,
  icon,
  labelClass = "text-neutral-700 dark:text-neutral-300",
  disabled = false,
}) => (
  <label
    className={`flex items-center gap-3 ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer group"}`}
  >
    <div
      className={`w-4 h-4 rounded-[4px] border border-neutral-300 dark:border-neutral-700 bg-transparent ${disabled ? "" : "group-hover:border-neutral-500"} transition-colors flex items-center justify-center shrink-0`}
    ></div>
    {icon && (
      <span className="text-neutral-400 dark:text-neutral-500 shrink-0">
        {icon}
      </span>
    )}
    <span className={`text-sm font-medium ${labelClass}`}>{label}</span>
  </label>
);

const SectionHeading = ({ title, badge }) => (
  <div className="flex items-center justify-between mb-3">
    <h3 className="text-xs font-bold text-neutral-500 tracking-wider uppercase">
      {title}
    </h3>
    {badge && (
      <span className="bg-purple-100 dark:bg-[#2D234A] text-purple-700 dark:text-[#9A7DFF] text-[10px] font-bold px-2 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </div>
);

const problemsData = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    acceptance: "49.1%",
    tags: ["Array", "Hash Table"],
    status: "solved",
    bookmarked: false,
  },
  {
    id: 2,
    title: "Add Two Numbers",
    difficulty: "Medium",
    acceptance: "40.3%",
    tags: ["Linked List", "Math", "+1"],
    status: "solved",
    bookmarked: true,
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    acceptance: "33.8%",
    tags: ["String", "Sliding Window"],
    status: "unsolved",
    bookmarked: false,
  },
  {
    id: 4,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    acceptance: "38.2%",
    tags: ["Array", "Binary Search", "+1"],
    status: "unsolved",
    bookmarked: true,
  },
  {
    id: 5,
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    acceptance: "32.4%",
    tags: ["String", "Dynamic Programming"],
    status: "unsolved",
    bookmarked: false,
  },
  {
    id: 10,
    title: "Regular Expression Matching",
    difficulty: "Hard",
    acceptance: "28.1%",
    tags: ["String", "DP", "+1"],
    status: "unsolved",
    bookmarked: false,
  },
  {
    id: 15,
    title: "3Sum",
    difficulty: "Medium",
    acceptance: "32.5%",
    tags: ["Array", "Two Pointers", "+1"],
    status: "solved",
    bookmarked: false,
  },
  {
    id: 21,
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    acceptance: "62.9%",
    tags: ["Linked List", "Recursion"],
    status: "solved",
    bookmarked: false,
  },
  {
    id: 42,
    title: "Trapping Rain Water",
    difficulty: "Hard",
    acceptance: "59.3%",
    tags: ["Array", "Stack", "+1"],
    status: "unsolved",
    bookmarked: true,
  },
  {
    id: 53,
    title: "Maximum Subarray",
    difficulty: "Medium",
    acceptance: "50.2%",
    tags: ["Array", "DP", "+1"],
    status: "solved",
    bookmarked: false,
  },
  {
    id: 70,
    title: "Climbing Stairs",
    difficulty: "Easy",
    acceptance: "51.7%",
    tags: ["Math", "Dynamic Programming", "+1"],
    status: "solved",
    bookmarked: false,
  },
  {
    id: 104,
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    acceptance: "73.8%",
    tags: ["Tree", "DFS", "+1"],
    status: "unsolved",
    bookmarked: false,
  },
];

const Problem = () => {
  return (
    <div className="flex-1 w-full bg-neutral-50 dark:bg-[#111111] text-neutral-900 dark:text-white font-sans flex flex-col">
      <div className="w-full bg-white dark:bg-[#1A1A1A] p-4 border-b border-neutral-200 dark:border-white/5 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold tracking-tight">Problems</h1>

            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm font-medium bg-purple-100 dark:bg-[#2D234A] text-purple-700 dark:text-[#9A7DFF] rounded-full transition-colors">
                All
              </button>
              <button className="px-3 py-1 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">
                Easy
              </button>
              <button className="px-3 py-1 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">
                Medium
              </button>
              <button className="px-3 py-1 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">
                Hard
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-1.5 bg-neutral-100 dark:bg-black/40 rounded-full border border-neutral-200 dark:border-white/5 text-sm font-medium">
              <div className="flex items-center gap-1.5 text-emerald-500">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                <span>312 Easy</span>
              </div>
              <div className="text-neutral-300 dark:text-neutral-700">|</div>
              <div className="flex items-center gap-1.5 text-orange-500">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"></div>
                <span>89 Medium</span>
              </div>
              <div className="text-neutral-300 dark:text-neutral-700">|</div>
              <div className="flex items-center gap-1.5 text-red-500">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                <span>21 Hard</span>
              </div>
            </div>

            <button className="flex items-center gap-2 px-4 py-1.5 bg-neutral-100 dark:bg-black/40 hover:bg-neutral-200 dark:hover:bg-black/60 rounded-full border border-neutral-200 dark:border-white/5 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors">
              <Shuffle className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
              <span>Random</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full flex gap-8 p-6 flex-1">
        <div className="w-[260px] shrink-0 flex flex-col gap-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-white/5">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
              <h2 className="text-base font-bold">Filters</h2>
            </div>
            <span className="bg-purple-100 dark:bg-[#2D234A] text-purple-700 dark:text-[#9A7DFF] text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              5
            </span>
          </div>

          <div>
            <SectionHeading title="DIFFICULTY" />
            <div className="flex flex-col gap-3">
              <Checkbox label="Easy" labelClass="text-emerald-500" />
              <Checkbox label="Medium" labelClass="text-orange-500" />
              <Checkbox label="Hard" labelClass="text-red-500" />
            </div>
          </div>

          <div className="h-px bg-neutral-200 dark:bg-white/5 w-full"></div>

          <div>
            <SectionHeading title="STATUS" />
            <div className="flex flex-col gap-3">
              <Checkbox
                label="Solved"
                icon={<CheckCircle2 className="w-4 h-4" />}
              />
              <Checkbox
                label="Unsolved"
                icon={<Circle className="w-4 h-4" />}
              />
              <Checkbox
                label="Attempted"
                icon={<Clock className="w-4 h-4" />}
              />
            </div>
          </div>

          <div className="h-px bg-neutral-200 dark:bg-white/5 w-full"></div>

          <div>
            <SectionHeading title="TOPICS" badge="3" />
            <div className="flex flex-col gap-3">
              <Checkbox label="Array" />
              <Checkbox label="String" />
              <Checkbox label="Tree" />
              <Checkbox label="Graph" />
              <Checkbox label="Dynamic Programming" />
              <Checkbox label="Linked List" />
              <Checkbox label="Binary Search" />
              <Checkbox label="Stack" />
              <Checkbox label="Heap" />
              <Checkbox label="Backtracking" />
            </div>
          </div>

          <div className="mt-2">
            <SectionHeading title="COMPANY" />
            <div className="relative border border-orange-500/20 rounded-xl p-4 bg-orange-50/50 dark:bg-orange-500/5 overflow-hidden">
              <div className="flex items-center gap-2 text-orange-500 mb-4">
                <Lock className="w-4 h-4" />
                <span className="text-xs font-bold">Premium feature</span>
              </div>

              <div className="flex flex-col gap-3 opacity-30 select-none">
                <Checkbox label="Google" disabled />
                <Checkbox label="Amazon" disabled />
                <Checkbox label="Microsoft" disabled />
                <Checkbox label="Meta" disabled />
                <Checkbox label="Apple" disabled />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-neutral-50 dark:from-[#111111] via-neutral-50/80 dark:via-[#111111]/80 to-transparent flex items-end justify-center pb-4">
                <button className="bg-orange-500 hover:bg-orange-600 text-white dark:text-black text-sm font-bold py-2 px-4 rounded-lg transition-colors">
                  Unlock Premium
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-200 dark:border-white/5 mt-auto mb-4">
            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-neutral-300 dark:border-[#2D234A] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#2D234A]/50 transition-colors text-sm font-medium">
              <X className="w-4 h-4" />
              Clear all filters
            </button>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="border border-orange-500/20 bg-gradient-to-r from-orange-50 dark:from-orange-500/10 to-transparent p-5 rounded-xl flex items-center justify-between mb-6 shadow-[inset_0_0_20px_rgba(249,115,22,0.05)]">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-500/10 rounded-full flex items-center justify-center border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.15)]">
                <Flame className="w-7 h-7 text-orange-500" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="text-sm font-bold text-orange-500">
                    Daily Challenge
                  </span>
                  <span className="text-[11px] font-bold text-orange-500 bg-orange-500/20 px-2 py-0.5 rounded-full">
                    Medium
                  </span>
                  <span className="text-xs text-neutral-500">
                    Resets in 8h 42m
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <h2 className="text-xl font-bold tracking-tight">
                    #518 - Coin Change II
                  </h2>
                  <div className="flex items-center gap-1.5">
                    {["Dynamic Programming", "Array", "Memoization"].map(
                      (t) => (
                        <span
                          key={t}
                          className="text-xs font-medium bg-white dark:bg-white/5 text-neutral-600 dark:text-neutral-400 px-2.5 py-1 rounded-full border border-neutral-200 dark:border-white/5"
                        >
                          {t}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
            <button className="bg-orange-500  hover:bg-orange-600 text-white dark:text-black px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)]">
              <Zap className="w-4 h-4" />
              Solve Today
            </button>
          </div>

          <div className="bg-white dark:bg-[#1A1A1A] rounded-xl border border-neutral-200 dark:border-white/5 overflow-hidden">
            <table className="w-full text-left border-collapse whitespace-nowrap">
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
                {problemsData.map((p, i) => (
                  <tr
                    key={p.id}
                    className="border-b border-neutral-200 dark:border-white/5 hover:bg-neutral-50 dark:hover:bg-white/[0.03] transition-colors group"
                  >
                    <td className="p-4 pl-6 text-neutral-500 font-medium">
                      {p.id}
                    </td>
                    <td className="p-4 font-bold hover:text-purple-600 dark:hover:text-[#9A7DFF] cursor-pointer transition-colors max-w-xs truncate">
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
                      {p.acceptance}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {p.tags.map((t) => (
                          <span
                            key={t}
                            className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${t.startsWith("+") ? "bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-300" : "bg-neutral-50 dark:bg-white/5 text-neutral-500 dark:text-neutral-400"}`}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 pr-6">
                      <div className="flex items-center justify-end gap-5">
                        <Bookmark
                          className={`w-4 h-4 cursor-pointer transition-colors ${p.bookmarked ? "text-orange-500 fill-orange-500 hover:text-orange-400" : "text-neutral-400 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400 opacity-0 group-hover:opacity-100"}`}
                        />
                        {p.status === "solved" ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-neutral-300 dark:text-neutral-700 hover:text-neutral-400 dark:hover:text-neutral-500 cursor-pointer transition-colors" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-6 px-2">
            <span className="text-sm text-neutral-500 font-medium">
              Showing 1-12 of 2,648 problems
            </span>
            <div className="flex items-center gap-1.5">
              <button className="w-8 h-8 flex items-center justify-center rounded border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-purple-600 dark:bg-[#9A7DFF] text-white dark:text-black font-bold">
                1
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white transition-colors font-medium">
                2
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white transition-colors font-medium">
                3
              </button>
              <span className="w-8 h-8 flex items-center justify-center text-neutral-600">
                ...
              </span>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white transition-colors font-medium text-sm">
                220
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white transition-colors font-medium text-sm">
                221
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Problem;
