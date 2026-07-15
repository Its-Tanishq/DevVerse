import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProblemPagination = ({ pagination, onPageChange }) => {
  const { page, totalPages } = pagination;
  const pages = [];

  for (let i = 0; i < totalPages; i++) {
    if (
      i === 0 ||
      i === totalPages - 1 ||
      (i >= page - 1 && i <= page + 1)
    ) {
      pages.push(i);
    } else if (
      (i === page - 2 && page > 2) ||
      (i === page + 2 && page < totalPages - 3)
    ) {
      pages.push("...");
    }
  }

  const finalPages = pages.filter(
    (p, idx, arr) => p !== "..." || arr[idx - 1] !== "..."
  );

  return (
    <div className="flex items-center gap-1.5">
      <button
        disabled={page === 0 || totalPages === 0}
        onClick={() => onPageChange(Math.max(0, page - 1))}
        className="w-8 h-8 flex items-center justify-center rounded border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      {finalPages.map((p, i) =>
        p === "..." ? (
          <span
            key={`dots-${i}`}
            className="w-8 h-8 flex items-center justify-center text-neutral-600"
          >
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 flex items-center justify-center rounded border ${
              page === p
                ? "bg-purple-600 dark:bg-[#9A7DFF] text-white dark:text-black font-bold border-transparent"
                : "border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white font-medium text-sm"
            } transition-colors`}
          >
            {p + 1}
          </button>
        )
      )}
      <button
        disabled={page >= totalPages - 1 || totalPages === 0}
        onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
        className="w-8 h-8 flex items-center justify-center rounded border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ProblemPagination;
