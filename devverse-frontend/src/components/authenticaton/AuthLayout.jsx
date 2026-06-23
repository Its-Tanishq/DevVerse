import React from "react";
import { Code2, Sparkles, Trophy, Map } from "lucide-react";

const FeatureItem = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-4">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#EBE9FE] dark:bg-[#1e1b4b] text-indigo-600 dark:text-[#c084fc] shadow-sm shadow-indigo-100/50 dark:shadow-none">
      <Icon className="h-5 w-5" />
    </div>
    <span className="text-slate-700 dark:text-purple-200 font-medium text-[15px]">
      {text}
    </span>
  </div>
);

const AuthLayout = ({ children }) => {
  return (
    <div className="flex flex-1 min-h-[calc(100vh-4.5rem)] w-full bg-white dark:bg-background">
      <div className="hidden lg:flex w-[45%] flex-col justify-between bg-[#F4F7FF] dark:bg-[#111118] p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-purple-200/40 dark:bg-purple-900/20 blur-[120px]" />
          <div className="absolute top-[40%] right-[-20%] w-[60%] h-[60%] rounded-full bg-blue-200/40 dark:bg-cyan-900/20 blur-[100px]" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-indigo-600 text-white font-bold text-lg">
            D
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white">
            DevVerse
          </span>
        </div>

        <div className="relative z-10 m-auto ml-0 flex flex-col max-w-md">
          <h1 className="text-[40px] leading-tight font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
            Your developer <br />
            <span className="text-[#7c3aed]">career, leveled up.</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-[15px] mb-12 max-w-90 leading-relaxed">
            Join 1.4M+ developers mastering algorithms, shipping projects, and
            landing dream roles.
          </p>

          <div className="space-y-5">
            <FeatureItem icon={Code2} text="3,200+ curated problems" />
            <FeatureItem icon={Sparkles} text="AI-powered code review" />
            <FeatureItem icon={Trophy} text="Live contest leaderboards" />
            <FeatureItem icon={Map} text="Expert learning paths" />
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-100 space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
