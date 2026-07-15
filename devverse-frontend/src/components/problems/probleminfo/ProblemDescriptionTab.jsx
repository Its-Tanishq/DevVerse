import React from "react";

const ProblemDescriptionTab = ({ description }) => {
  return (
    <div
      className="text-sm text-neutral-700 dark:text-neutral-300 space-y-4 mb-8 leading-relaxed prose dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: description }}
    />
  );
};

export default ProblemDescriptionTab;
