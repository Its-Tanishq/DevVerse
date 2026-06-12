import React from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Key, Mail, Send, Info } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

const ForgotPassword = () => {
  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto">
        <Link
          to="/signin"
          className="inline-flex items-center text-[14px] font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to sign in
        </Link>

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-[#1e1b4b] mb-6 shadow-sm shadow-indigo-100/50 dark:shadow-none">
          <Key className="h-6 w-6 text-indigo-600 dark:text-[#c084fc]" />
        </div>

        <h2 className="text-[32px] font-bold text-slate-900 dark:text-white tracking-tight mb-3">
          Forgot your password?
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-[15px] mb-8 leading-relaxed">
          No worries. Enter your email and we'll send you a reset link in seconds.
        </p>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-[13px] font-semibold text-indigo-950 dark:text-indigo-100"
            >
              Email address
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <Mail className="h-[18px] w-[18px]" />
              </div>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="pl-10 h-[46px] border-slate-200 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white shadow-sm rounded-xl focus-visible:ring-indigo-500"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-[46px] rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold text-[15px] shadow-sm shadow-indigo-200 dark:shadow-none transition-all"
          >
            Send reset link
            <Send className="ml-2 h-[18px] w-[18px]" />
          </Button>
        </form>

        <div className="mt-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111118] p-4">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-cyan-600 dark:text-cyan-400 shrink-0" />
            <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
              The reset link expires in 15 minutes. Check your spam folder if you do not see it.
            </p>
          </div>
        </div>

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

export default ForgotPassword;
