import React from "react";

const ProblemHintsTab = ({ hints }) => {
  return (
    <div className="text-sm text-neutral-700 dark:text-neutral-300 space-y-4 mb-8">
      {hints ? (
        hints.split("\n").map(
          (hint, i) =>
            hint.trim() && (
              <div
                key={i}
                className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4"
              >
                <div className="font-bold mb-2 text-neutral-900 dark:text-white">
                  Hint {i + 1}
                </div>
                <p dangerouslySetInnerHTML={{ __html: hint }}></p>
              </div>
            )
        )
      ) : (
        <p className="text-neutral-500">No hints available.</p>
      )}
    </div>
  );
};

export default ProblemHintsTab;
