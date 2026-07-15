import React from "react";
import { Flame, Zap } from "lucide-react";
import { useNavigate } from "react-router";

const DailyChallenge = ({ dailyChallenge, timeLeft }) => {
  const navigate = useNavigate();

  const handleSolve = () => {
    if (dailyChallenge) {
      const id = dailyChallenge.slug || dailyChallenge.ID || dailyChallenge.id;
      navigate(`/problem/${id}`);
    }
  };

  return (
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
            {dailyChallenge && (
              <span className="text-[11px] font-bold text-orange-500 bg-orange-500/20 px-2 py-0.5 rounded-full">
                {dailyChallenge.difficulty}
              </span>
            )}
            <span className="text-xs text-neutral-500">
              Resets in {timeLeft}
            </span>
          </div>
          {dailyChallenge === undefined ? (
            <div className="flex items-center gap-6">
              <h2 className="text-xl font-bold tracking-tight text-neutral-400">
                Loading...
              </h2>
            </div>
          ) : dailyChallenge === null ? (
            <div className="flex items-center gap-6">
              <h2 className="text-xl font-bold tracking-tight text-neutral-400">
                No Challenge Today
              </h2>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <h2 className="text-xl font-bold tracking-tight">
                #{dailyChallenge.ID || dailyChallenge.id} - {dailyChallenge.title}
              </h2>
              <div className="flex items-center gap-1.5 flex-wrap">
                {dailyChallenge.tags?.map((t) => (
                  <span
                    key={t.id || t.name || t}
                    className="text-xs font-medium bg-white dark:bg-white/5 text-neutral-600 dark:text-neutral-400 px-2.5 py-1 rounded-full border border-neutral-200 dark:border-white/5"
                  >
                    {t.name || t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <button
        onClick={handleSolve}
        disabled={!dailyChallenge || dailyChallenge === null}
        className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white dark:text-black px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] shrink-0"
      >
        <Zap className="w-4 h-4" />
        <span className="hidden sm:inline">Solve Today</span>
      </button>
    </div>
  );
};

export default DailyChallenge;
