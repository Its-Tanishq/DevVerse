import React from "react";
import ReactMarkdown from "react-markdown";

const ProblemDescriptionTab = ({ description }) => {
  return (
    <div className="text-[15px] text-neutral-700 dark:text-neutral-300 space-y-5 mb-8 leading-relaxed max-w-none font-sans">
      <ReactMarkdown
        components={{
          h3: ({ node, ...props }) => <h3 className="text-lg font-bold text-neutral-900 dark:text-white mt-8 mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-xl font-bold text-neutral-900 dark:text-white mt-8 mb-4" {...props} />,
          p: ({ node, ...props }) => <p className="mb-4 text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-bold text-neutral-900 dark:text-white" {...props} />,
          code: ({ node, inline, className, children, ...props }) => {
            return inline ? (
              <code className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-200 px-1.5 py-0.5 rounded-md text-sm font-mono border border-neutral-200 dark:border-neutral-700" {...props}>
                {children}
              </code>
            ) : (
              <div className="bg-neutral-100 dark:bg-neutral-800/80 rounded-lg p-4 my-4 border border-neutral-200 dark:border-neutral-800 overflow-x-auto">
                <code className="text-sm font-mono text-neutral-800 dark:text-neutral-300" {...props}>
                  {children}
                </code>
              </div>
            );
          },
          ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-2 mb-4 marker:text-neutral-400" {...props} />,
          li: ({ node, ...props }) => <li className="text-neutral-700 dark:text-neutral-300" {...props} />
        }}
      >
        {description}
      </ReactMarkdown>
    </div>
  );
};

export default ProblemDescriptionTab;
