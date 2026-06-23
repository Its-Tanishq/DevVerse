import React from "react";
import useAuth from "@/store/AuthStore";
import {
  Code,
  Flame,
  Zap,
  Trophy,
  Sword,
  MonitorPlay,
  ChevronRight,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

const Dashboard = () => {
  const user = useAuth((state) => state.user);
  const displayName =
    user?.name || user?.username || user?.email?.split("@")[0] || "Ethan";

  return (
    <div className="w-[90vw] max-w-7xl mx-auto pt-8 pb-12">
      <div className="mb-8 border-b border-border pb-6">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          Good morning, {displayName} <span className="text-2xl">👋</span>
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          You're on a 47-day streak — don't break the chain!
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="flex-1 space-y-6 min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-xl p-5 flex flex-col relative overflow-hidden transition-all hover:shadow-md">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-medium text-muted-foreground">
                  Problems Solved
                </span>
                <div className="bg-[#7c3aed]/10 text-[#7c3aed] p-2 rounded-full">
                  <Code size={18} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-foreground">312</span>
                <span className="text-xs text-muted-foreground mt-1">
                  +8 this week
                </span>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 flex flex-col relative overflow-hidden transition-all hover:shadow-md">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-medium text-muted-foreground">
                  Current Streak
                </span>
                <div className="bg-orange-500/10 text-orange-500 p-2 rounded-full">
                  <Flame size={18} />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-foreground">47</span>
                  <span className="text-2xl">🔥</span>
                </div>
                <span className="text-xs text-muted-foreground mt-1">
                  Personal best: 63
                </span>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 flex flex-col relative overflow-hidden transition-all hover:shadow-md">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-medium text-muted-foreground">
                  XP Points
                </span>
                <div className="bg-purple-500/10 text-purple-500 p-2 rounded-full">
                  <Zap size={18} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-foreground">
                  24,800
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  +1,240 this week
                </span>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 flex flex-col relative overflow-hidden transition-all hover:shadow-md">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-medium text-muted-foreground">
                  Global Rating
                </span>
                <div className="bg-emerald-500/10 text-emerald-500 p-2 rounded-full">
                  <Trophy size={18} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-foreground">
                  1,847
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  Top 4% worldwide
                </span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl flex flex-col overflow-hidden">
            <div className="bg-accent/50 px-6 py-3 flex justify-between items-center border-b border-border">
              <div className="flex items-center gap-2 text-orange-500 font-semibold text-sm">
                <Flame size={16} />
                <span>Today's Challenge</span>
              </div>
              <span className="text-muted-foreground text-sm">
                Resets in 8h 42m
              </span>
            </div>

            <div className="p-6 flex flex-col md:flex-row justify-between gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold text-foreground">
                    Coin Change II
                  </h3>
                  <span className="bg-orange-500/10 text-orange-500 border border-orange-500/20 px-2.5 py-0.5 rounded-full text-xs font-medium">
                    Medium
                  </span>
                </div>
                <p className="text-muted-foreground text-[14px] leading-relaxed max-w-2xl">
                  You are given an integer array coins representing coins of
                  different denominations and an integer amount. Return the
                  number of combinations that make up that amount.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="bg-accent text-muted-foreground px-3 py-1 rounded-full text-xs font-medium border border-border/50">
                    Dynamic Programming
                  </span>
                  <span className="bg-accent text-muted-foreground px-3 py-1 rounded-full text-xs font-medium border border-border/50">
                    Array
                  </span>
                  <span className="bg-accent text-muted-foreground px-3 py-1 rounded-full text-xs font-medium border border-border/50">
                    Memoization
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-start md:items-end justify-between md:min-w-[140px]">
                <div className="flex flex-col items-start md:items-end mb-4 md:mb-0">
                  <span className="text-muted-foreground text-sm mb-1">
                    Acceptance rate
                  </span>
                  <span className="text-3xl font-bold text-emerald-500">
                    61.4%
                  </span>
                </div>

                <div className="flex flex-col items-start md:items-end gap-2 w-full">
                  <button className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white w-full md:w-auto px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                    <Code size={18} />
                    <span>Solve Now</span>
                  </button>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-xs mt-1">
                    <Users size={14} />
                    <span>12,481 solved today</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 flex flex-col mt-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">
                  Activity
                </h2>
                <p className="text-sm text-muted-foreground">
                  248 contributions in the last 3 months
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-3.5 h-3.5 rounded-sm bg-accent/30"></div>
                  <div className="w-3.5 h-3.5 rounded-sm bg-[#7c3aed]/30"></div>
                  <div className="w-3.5 h-3.5 rounded-sm bg-[#7c3aed]/50"></div>
                  <div className="w-3.5 h-3.5 rounded-sm bg-[#7c3aed]/70"></div>
                  <div className="w-3.5 h-3.5 rounded-sm bg-[#7c3aed]"></div>
                </div>
                <span>More</span>
              </div>
            </div>

            <div className="flex">
              <div className="flex flex-col gap-1.5 text-[10px] text-muted-foreground pt-6 pr-3">
                <div className="h-2.5 flex items-center justify-end w-6"></div>
                <div className="h-2.5 flex items-center justify-end w-6">
                  Mon
                </div>
                <div className="h-2.5 flex items-center justify-end w-6"></div>
                <div className="h-2.5 flex items-center justify-end w-6">
                  Wed
                </div>
                <div className="h-2.5 flex items-center justify-end w-6"></div>
                <div className="h-2.5 flex items-center justify-end w-6">
                  Fri
                </div>
                <div className="h-2.5 flex items-center justify-end w-6"></div>
              </div>

              <div className="flex-1 flex flex-col gap-2">
                <div className="flex justify-around text-xs text-muted-foreground w-full pl-2">
                  <span>Oct</span>
                  <span>Nov</span>
                  <span>Dec</span>
                </div>

                <div className="flex gap-1.5 justify-between w-full">
                  {Array.from({ length: 14 }).map((_, colIdx) => (
                    <div key={colIdx} className="flex flex-col gap-1.5 flex-1">
                      {Array.from({ length: 7 }).map((_, rowIdx) => {
                        const val = ((colIdx * 7 + rowIdx) * 17) % 5;
                        const level = val === 0 ? 0 : val;
                        return (
                          <div
                            key={rowIdx}
                            className={`w-full h-2.5 rounded-sm ${
                              level === 1
                                ? "bg-[#7c3aed]/30"
                                : level === 2
                                  ? "bg-[#7c3aed]/50"
                                  : level === 3
                                    ? "bg-[#7c3aed]/70"
                                    : level === 4
                                      ? "bg-[#7c3aed]"
                                      : "bg-accent/30"
                            }`}
                          ></div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl flex flex-col mt-6">
            <div className="px-6 py-5 border-b border-border flex justify-between items-center">
              <h2 className="text-xl font-bold text-foreground">
                Recent Submissions
              </h2>
              <a
                href="#"
                className="text-[#7c3aed] text-sm hover:underline font-medium"
              >
                View all
              </a>
            </div>
            <div className="flex flex-col">
              <div className="px-6 py-4 flex items-center justify-between border-b border-border hover:bg-accent/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-500/10 text-emerald-500 p-2 rounded-full">
                    <CheckCircle2 size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground">
                      Two Sum
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium text-emerald-500">
                        Easy
                      </span>
                      <span className="text-muted-foreground text-xs">·</span>
                      <span className="text-muted-foreground text-xs">
                        2 min ago
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="bg-accent/50 border border-border/50 text-muted-foreground px-3 py-1 rounded-full text-xs font-medium hidden sm:block">
                    Python
                  </span>
                  <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-xs font-medium w-28 text-center">
                    Accepted
                  </span>
                </div>
              </div>

              <div className="px-6 py-4 flex items-center justify-between border-b border-border hover:bg-accent/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="bg-red-500/10 text-red-500 p-2 rounded-full">
                    <XCircle size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground">
                      Longest Palindromic Substring
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium text-orange-500">
                        Medium
                      </span>
                      <span className="text-muted-foreground text-xs">·</span>
                      <span className="text-muted-foreground text-xs">
                        1h ago
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="bg-accent/50 border border-border/50 text-muted-foreground px-3 py-1 rounded-full text-xs font-medium hidden sm:block">
                    C++
                  </span>
                  <span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-xs font-medium w-28 text-center">
                    Wrong Answer
                  </span>
                </div>
              </div>

              <div className="px-6 py-4 flex items-center justify-between border-b border-border hover:bg-accent/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-500/10 text-emerald-500 p-2 rounded-full">
                    <CheckCircle2 size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground">
                      Merge K Sorted Lists
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium text-red-500">
                        Hard
                      </span>
                      <span className="text-muted-foreground text-xs">·</span>
                      <span className="text-muted-foreground text-xs">
                        3h ago
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="bg-accent/50 border border-border/50 text-muted-foreground px-3 py-1 rounded-full text-xs font-medium hidden sm:block">
                    Java
                  </span>
                  <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-xs font-medium w-28 text-center">
                    Accepted
                  </span>
                </div>
              </div>

              <div className="px-6 py-4 flex items-center justify-between border-b border-border hover:bg-accent/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="bg-yellow-500/10 text-yellow-500 p-2 rounded-full">
                    <Clock size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground">
                      Maximum Subarray
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium text-orange-500">
                        Medium
                      </span>
                      <span className="text-muted-foreground text-xs">·</span>
                      <span className="text-muted-foreground text-xs">
                        Yesterday
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="bg-accent/50 border border-border/50 text-muted-foreground px-3 py-1 rounded-full text-xs font-medium hidden sm:block">
                    Python
                  </span>
                  <span className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-xs font-medium w-28 text-center">
                    Time Limit
                  </span>
                </div>
              </div>

              <div className="px-6 py-4 flex items-center justify-between hover:bg-accent/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-500/10 text-emerald-500 p-2 rounded-full">
                    <CheckCircle2 size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground">
                      Valid Parentheses
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium text-emerald-500">
                        Easy
                      </span>
                      <span className="text-muted-foreground text-xs">·</span>
                      <span className="text-muted-foreground text-xs">
                        2d ago
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="bg-accent/50 border border-border/50 text-muted-foreground px-3 py-1 rounded-full text-xs font-medium hidden sm:block">
                    TypeScript
                  </span>
                  <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-xs font-medium w-28 text-center">
                    Accepted
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-80 shrink-0 space-y-6">
          <div className="bg-transparent rounded-xl flex flex-col">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Quick Actions
            </h2>
            <div className="flex flex-col gap-3">
              <button className="bg-card hover:bg-accent border border-border rounded-2xl p-4 flex items-center justify-between transition-colors text-left group">
                <div className="flex items-center gap-4">
                  <div className="bg-[#7c3aed]/10 text-[#7c3aed] p-3 rounded-xl flex items-center justify-center">
                    <Sword size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground">
                      Start 1v1 Battle
                    </span>
                    <span className="text-xs text-muted-foreground mt-0.5">
                      Challenge a random opponent
                    </span>
                  </div>
                </div>
                <ChevronRight
                  size={18}
                  className="text-muted-foreground group-hover:text-foreground transition-colors"
                />
              </button>

              <button className="bg-card hover:bg-accent border border-border rounded-2xl p-4 flex items-center justify-between transition-colors text-left group">
                <div className="flex items-center gap-4">
                  <div className="bg-teal-500/10 text-teal-500 p-3 rounded-xl flex items-center justify-center">
                    <MonitorPlay size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground">
                      Mock Interview
                    </span>
                    <span className="text-xs text-muted-foreground mt-0.5">
                      AI-powered timed session
                    </span>
                  </div>
                </div>
                <ChevronRight
                  size={18}
                  className="text-muted-foreground group-hover:text-foreground transition-colors"
                />
              </button>

              <button className="bg-card hover:bg-accent border border-border rounded-2xl p-4 flex items-center justify-between transition-colors text-left group">
                <div className="flex items-center gap-4">
                  <div className="bg-orange-500/10 text-orange-500 p-3 rounded-xl flex items-center justify-center">
                    <Trophy size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground">
                      Join Contest
                    </span>
                    <span className="text-xs text-muted-foreground mt-0.5">
                      Next contest in 2h 14m
                    </span>
                  </div>
                </div>
                <ChevronRight
                  size={18}
                  className="text-muted-foreground group-hover:text-foreground transition-colors"
                />
              </button>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-foreground">
                Skill Breakdown
              </h2>
              <a
                href="#"
                className="text-[#7c3aed] text-xs font-medium hover:underline"
              >
                Full report
              </a>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium">
                    Arrays & Strings
                  </span>
                  <span className="text-foreground font-bold">82%</span>
                </div>
                <div className="w-full h-1.5 bg-accent/50 rounded-full overflow-hidden">
                  <div
                    className="bg-[#7c3aed] h-full rounded-full"
                    style={{ width: "82%" }}
                  ></div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium">
                    Dynamic Programming
                  </span>
                  <span className="text-foreground font-bold">54%</span>
                </div>
                <div className="w-full h-1.5 bg-accent/50 rounded-full overflow-hidden">
                  <div
                    className="bg-[#a855f7] h-full rounded-full"
                    style={{ width: "54%" }}
                  ></div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium">
                    Graphs & Trees
                  </span>
                  <span className="text-foreground font-bold">67%</span>
                </div>
                <div className="w-full h-1.5 bg-accent/50 rounded-full overflow-hidden">
                  <div
                    className="bg-[#06b6d4] h-full rounded-full"
                    style={{ width: "67%" }}
                  ></div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium">
                    Binary Search
                  </span>
                  <span className="text-foreground font-bold">90%</span>
                </div>
                <div className="w-full h-1.5 bg-accent/50 rounded-full overflow-hidden">
                  <div
                    className="bg-[#10b981] h-full rounded-full"
                    style={{ width: "90%" }}
                  ></div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium">
                    System Design
                  </span>
                  <span className="text-foreground font-bold">38%</span>
                </div>
                <div className="w-full h-1.5 bg-accent/50 rounded-full overflow-hidden">
                  <div
                    className="bg-[#f59e0b] h-full rounded-full"
                    style={{ width: "38%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl flex flex-col overflow-hidden">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="text-lg font-bold text-foreground">
                Global Leaderboard
              </h2>
              <a
                href="#"
                className="text-[#7c3aed] text-xs font-medium hover:underline"
              >
                Full rankings
              </a>
            </div>

            <div className="flex flex-col">
              <div className="px-6 py-4 flex items-center justify-between border-b border-border">
                <div className="flex items-center gap-4">
                  <span className="font-bold text-orange-500 w-5">#1</span>
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-accent">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=kaito"
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-semibold text-foreground text-sm">
                    kaito_dev
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-bold text-foreground text-sm">
                    98,420
                  </span>
                  <span className="text-emerald-500 text-[10px] font-medium">
                    +1,240
                  </span>
                </div>
              </div>

              <div className="px-6 py-4 flex items-center justify-between border-b border-border">
                <div className="flex items-center gap-4">
                  <span className="font-bold text-slate-400 w-5">#2</span>
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-accent">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=priya"
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-semibold text-foreground text-sm">
                    priya_codes
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-bold text-foreground text-sm">
                    96,180
                  </span>
                  <span className="text-emerald-500 text-[10px] font-medium">
                    +980
                  </span>
                </div>
              </div>

              <div className="px-6 py-4 flex items-center justify-between border-b border-border bg-[#7c3aed]/[0.02]">
                <div className="flex items-center gap-4">
                  <span className="font-bold text-amber-600 w-5">#3</span>
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-accent">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=ethan"
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground text-sm">
                      ethancole
                    </span>
                    <span className="bg-[#7c3aed]/20 text-[#7c3aed] text-[10px] font-medium px-1.5 py-0.5 rounded">
                      You
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-bold text-foreground text-sm">
                    94,500
                  </span>
                  <span className="text-emerald-500 text-[10px] font-medium">
                    +760
                  </span>
                </div>
              </div>

              <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="font-bold text-slate-500 w-5">#4</span>
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-accent">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=marcus"
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-semibold text-foreground text-sm">
                    marcuswebb
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-bold text-foreground text-sm">
                    91,230
                  </span>
                  <span className="text-emerald-500 text-[10px] font-medium">
                    +620
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
