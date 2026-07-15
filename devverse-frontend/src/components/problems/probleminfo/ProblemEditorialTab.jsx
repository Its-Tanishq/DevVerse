import React from "react";
import { Lock } from "lucide-react";

const ProblemEditorialTab = () => {
  return (
    <div className="text-sm text-neutral-700 dark:text-neutral-300 mb-8">
      <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-6 mb-8 flex flex-col items-center justify-center text-center">
        <Lock className="w-10 h-10 text-amber-500 mb-3" />
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
          Premium Editorial
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4 max-w-sm">
          Unlock this editorial to get an in-depth video explanation,
          interactive visualizations, and optimal solutions.
        </p>
        <button className="bg-amber-500 hover:bg-amber-600 transition-colors text-white px-6 py-2.5 rounded-lg font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)]">
          Unlock with Premium
        </button>
      </div>

      <div className="opacity-40 select-none pointer-events-none blur-[3px]">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
          Approach 1: Dynamic Programming (Bottom-Up)
        </h2>
        <p className="mb-4">
          The problem asks us to find the number of ways to make up the{" "}
          <code className="text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/10 px-1.5 py-0.5 rounded text-[13px]">
            amount
          </code>{" "}
          using the given{" "}
          <code className="text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/10 px-1.5 py-0.5 rounded text-[13px]">
            coins
          </code>
          . This is a classic variation of the unbounded knapsack problem.
        </p>
        <h4 className="font-bold text-neutral-900 dark:text-white mb-2">
          Intuition
        </h4>
        <p className="mb-4">
          Let{" "}
          <code className="text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/10 px-1.5 py-0.5 rounded text-[13px]">
            dp[i]
          </code>{" "}
          be the number of ways to make change for the amount{" "}
          <code className="text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/10 px-1.5 py-0.5 rounded text-[13px]">
            i
          </code>
          . We initialize{" "}
          <code className="text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/10 px-1.5 py-0.5 rounded text-[13px]">
            dp[0] = 1
          </code>{" "}
          because there is exactly one way to make change for zero amount (by
          using no coins).
        </p>
        <div className="bg-neutral-50 dark:bg-[#1e1e1e] border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 font-mono text-sm mb-4 leading-relaxed text-neutral-800 dark:text-neutral-300">
          <span className="text-pink-600 dark:text-pink-500">def</span>{" "}
          <span className="text-blue-600 dark:text-blue-400">change</span>
          (amount, coins):
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;dp = [
          <span className="text-emerald-600 dark:text-emerald-500">0</span>] *
          (amount +{" "}
          <span className="text-emerald-600 dark:text-emerald-500">1</span>)
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;dp[
          <span className="text-emerald-600 dark:text-emerald-500">0</span>] ={" "}
          <span className="text-emerald-600 dark:text-emerald-500">1</span>
          <br />
        </div>
      </div>
    </div>
  );
};

export default ProblemEditorialTab;
