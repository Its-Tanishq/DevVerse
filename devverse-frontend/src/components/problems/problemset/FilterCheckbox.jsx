import React from "react";
import { Check } from "lucide-react";

const FilterCheckbox = ({
  label,
  icon,
  labelClass = "text-neutral-700 dark:text-neutral-300",
  disabled = false,
  checked = false,
  onChange,
}) => (
  <label
    className={`flex items-center gap-3 ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer group"}`}
    onClick={!disabled && onChange ? onChange : undefined}
  >
    <div
      className={`w-4 h-4 rounded-[4px] border ${checked ? "bg-purple-600 border-purple-600" : "border-neutral-300 dark:border-neutral-700 bg-transparent"} ${disabled ? "" : "group-hover:border-neutral-500"} transition-colors flex items-center justify-center shrink-0`}
    >
      {checked && <Check className="w-3 h-3 text-white" />}
    </div>
    {icon && (
      <span className="text-neutral-400 dark:text-neutral-500 shrink-0">
        {icon}
      </span>
    )}
    <span className={`text-sm font-medium ${labelClass}`}>{label}</span>
  </label>
);

export default FilterCheckbox;
