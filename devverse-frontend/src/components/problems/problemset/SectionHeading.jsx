import React from "react";

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

export default SectionHeading;
