import React from "react";
import { useNavigate } from "react-router";
import {
  LayoutGrid,
  ChevronRight,
  ChevronLeft,
  Shuffle,
  Timer,
  Settings2,
  SquareTerminal,
} from "lucide-react";

const ProblemHeader = ({ problemId, problemTitle }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-[#1a1a1a] text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800 h-12 w-full shrink-0 transition-colors">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => navigate("/problemset")}
          className="flex items-center space-x-1.5 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <LayoutGrid className="w-4 h-4" />
          <span className="hidden sm:inline">Problems</span>
        </button>
        <ChevronRight className="w-3 h-3 text-neutral-400 dark:text-neutral-500" />
        <span className="text-neutral-900 dark:text-white font-medium">
          #{problemId} - {problemTitle}
        </span>
      </div>

      <div className="flex items-center space-x-2 hidden md:flex">
        <button className="p-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
          <Shuffle className="w-3.5 h-3.5" />
          <span>Pick random</span>
        </button>
        <button className="p-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center space-x-3">
        <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors">
          <Timer className="w-4 h-4 text-amber-500" />
          <span className="font-medium font-mono text-[13px]">12:48</span>
        </button>
        <button className="p-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
          <Settings2 className="w-4 h-4" />
        </button>
        <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
          <SquareTerminal className="w-4 h-4" />
          <span>Console</span>
        </button>
      </div>
    </div>
  );
};

export default ProblemHeader;
