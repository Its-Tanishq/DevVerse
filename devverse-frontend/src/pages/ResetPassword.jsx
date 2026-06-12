import React, { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Lock, Eye, EyeOff, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-[#1e1b4b] shadow-sm shadow-indigo-100/50 dark:shadow-none mb-6">
          <ShieldCheck className="h-6 w-6 text-indigo-600 dark:text-[#c084fc]" />
        </div>

        <div className="space-y-2">
          <h2 className="text-[32px] font-bold text-slate-900 dark:text-white tracking-tight">
            Create new password
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-[15px] leading-relaxed">
            Your new password must be different from your previous passwords.
          </p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <Label
              htmlFor="newPassword"
              className="text-[13px] font-semibold text-indigo-950 dark:text-indigo-100"
            >
              New password
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <Lock className="h-[18px] w-[18px]" />
              </div>
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10 h-[46px] border-slate-200 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white shadow-sm rounded-xl focus-visible:ring-indigo-500 font-medium tracking-wider"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-[18px] w-[18px]" />
                ) : (
                  <Eye className="h-[18px] w-[18px]" />
                )}
              </button>
            </div>
            
            <div className="space-y-2 pt-1">
              <div className="flex gap-1.5 h-1">
                <div className="h-full flex-1 rounded-full bg-orange-500"></div>
                <div className="h-full flex-1 rounded-full bg-orange-500"></div>
                <div className="h-full flex-1 rounded-full bg-emerald-500"></div>
                <div className="h-full flex-1 rounded-full bg-emerald-500"></div>
                <div className="h-full flex-1 rounded-full bg-slate-200 dark:bg-slate-800"></div>
              </div>
              <p className="text-[12px] font-medium text-emerald-500">
                Strong password
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-[13px] font-semibold text-indigo-950 dark:text-indigo-100"
            >
              Confirm new password
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <Lock className="h-[18px] w-[18px]" />
              </div>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10 h-[46px] border-slate-200 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white shadow-sm rounded-xl focus-visible:ring-indigo-500 font-medium tracking-wider"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-[18px] w-[18px]" />
                ) : (
                  <Eye className="h-[18px] w-[18px]" />
                )}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111118] p-5 space-y-4">
            <p className="text-[13px] font-medium text-slate-700 dark:text-slate-400">
              Password requirements
            </p>
            <div className="space-y-3">
              <RequirementItem fulfilled={true} text="At least 8 characters" />
              <RequirementItem fulfilled={true} text="One uppercase letter" />
              <RequirementItem fulfilled={true} text="One number" />
              <RequirementItem fulfilled={false} text="One special character" />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-[46px] rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold text-[15px] shadow-sm shadow-indigo-200 dark:shadow-none transition-all"
          >
            Reset password
            <ArrowRight className="ml-2 h-[18px] w-[18px]" />
          </Button>
        </form>

        <p className="text-center text-[14px] text-slate-500 dark:text-slate-400 mt-8">
          Remember your password?{" "}
          <Link
            to="/signin"
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

const RequirementItem = ({ fulfilled, text }) => (
  <div className="flex items-center gap-2.5">
    {fulfilled ? (
      <CheckCircle2 className="h-[15px] w-[15px] text-emerald-500" />
    ) : (
      <XCircle className="h-[15px] w-[15px] text-red-500" />
    )}
    <span
      className={`text-[13px] font-medium ${
        fulfilled ? "text-emerald-500 dark:text-emerald-400/90" : "text-slate-500 dark:text-slate-500"
      }`}
    >
      {text}
    </span>
  </div>
);

export default ResetPassword;
