import React from "react";
import {
  SlidersHorizontal,
  CheckCircle2,
  Circle,
  Clock,
  Lock,
  X,
} from "lucide-react";
import useAuth from "../../../store/AuthStore";
import FilterCheckbox from "./FilterCheckbox";
import SectionHeading from "./SectionHeading";

const ProblemFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
  activeFiltersCount,
}) => {
  const authStatus = useAuth((state) => state.authStatus);

  return (
    <div className="w-[260px] shrink-0 flex flex-col gap-6">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-white/5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
          <h2 className="text-base font-bold">Filters</h2>
        </div>
        <span className="bg-purple-100 dark:bg-[#2D234A] text-purple-700 dark:text-[#9A7DFF] text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
          {activeFiltersCount}
        </span>
      </div>

      <div>
        <SectionHeading title="DIFFICULTY" />
        <div className="flex flex-col gap-3">
          {["Easy", "Medium", "Hard"].map((diff) => (
            <FilterCheckbox
              key={diff}
              label={diff}
              labelClass={
                diff === "Easy"
                  ? "text-emerald-500"
                  : diff === "Medium"
                  ? "text-orange-500"
                  : "text-red-500"
              }
              checked={filters.difficulty === diff}
              onChange={() => onFilterChange("difficulty", diff)}
            />
          ))}
        </div>
      </div>

      <div className="h-px bg-neutral-200 dark:bg-white/5 w-full"></div>

      {authStatus && (
        <>
          <div>
            <SectionHeading title="STATUS" />
            <div className="flex flex-col gap-3">
              {[
                {
                  label: "Solved",
                  icon: <CheckCircle2 className="w-4 h-4" />,
                  value: "solved",
                },
                {
                  label: "Unsolved",
                  icon: <Circle className="w-4 h-4" />,
                  value: "unsolved",
                },
                {
                  label: "Attempted",
                  icon: <Clock className="w-4 h-4" />,
                  value: "attempted",
                },
              ].map((status) => (
                <FilterCheckbox
                  key={status.label}
                  label={status.label}
                  icon={status.icon}
                  checked={filters.status === status.value}
                  onChange={() => onFilterChange("status", status.value)}
                />
              ))}
            </div>
          </div>

          <div className="h-px bg-neutral-200 dark:bg-white/5 w-full"></div>
        </>
      )}

      <div>
        <SectionHeading title="TOPICS" badge={filters.tag ? "1" : "0"} />
        <div className="flex flex-col gap-3">
          {[
            "Array",
            "String",
            "Tree",
            "Graph",
            "Dynamic Programming",
            "Linked List",
            "Binary Search",
            "Stack",
            "Heap",
            "Backtracking",
          ].map((topic) => (
            <FilterCheckbox
              key={topic}
              label={topic}
              checked={filters.tag === topic}
              onChange={() => onFilterChange("tag", topic)}
            />
          ))}
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
            <FilterCheckbox label="Google" disabled />
            <FilterCheckbox label="Amazon" disabled />
            <FilterCheckbox label="Microsoft" disabled />
            <FilterCheckbox label="Meta" disabled />
            <FilterCheckbox label="Apple" disabled />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-neutral-50 dark:from-[#111111] via-neutral-50/80 dark:via-[#111111]/80 to-transparent flex items-end justify-center pb-4">
            <button className="bg-orange-500 hover:bg-orange-600 text-white dark:text-black text-sm font-bold py-2 px-4 rounded-lg transition-colors">
              Unlock Premium
            </button>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-neutral-200 dark:border-white/5 mt-auto mb-4">
        <button
          onClick={onClearFilters}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-neutral-300 dark:border-[#2D234A] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#2D234A]/50 transition-colors text-sm font-medium"
        >
          <X className="w-4 h-4" />
          Clear all filters
        </button>
      </div>
    </div>
  );
};

export default ProblemFilters;
