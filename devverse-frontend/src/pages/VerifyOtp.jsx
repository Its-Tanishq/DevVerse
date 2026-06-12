import React, { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MailOpen, ArrowRight } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

const VerifyOtp = () => {
  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-[#1e1b4b] shadow-sm shadow-indigo-100/50 dark:shadow-none mb-6">
          <MailOpen className="h-6 w-6 text-indigo-600 dark:text-[#c084fc]" />
        </div>

        <div className="space-y-2">
          <h2 className="text-[32px] font-bold text-slate-900 dark:text-white tracking-tight">
            Check your email
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-[15px] leading-relaxed">
            We sent a verification code to <span className="font-semibold text-slate-700 dark:text-slate-300">you@example.com</span>. Please enter it below.
          </p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <Label
              htmlFor="otp"
              className="text-[13px] font-semibold text-indigo-950 dark:text-indigo-100"
            >
              Verification Code
            </Label>
            <Input
              id="otp"
              type="text"
              maxLength={6}
              placeholder="000000"
              className="h-[52px] text-center text-2xl tracking-[0.5em] border-slate-200 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white shadow-sm rounded-xl focus-visible:ring-indigo-500 font-bold"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full h-[46px] rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold text-[15px] shadow-sm shadow-indigo-200 dark:shadow-none transition-all"
          >
            Verify code
            <ArrowRight className="ml-2 h-[18px] w-[18px]" />
          </Button>
        </form>

        <p className="text-center text-[14px] text-slate-500 dark:text-slate-400 mt-8">
          Didn't receive the email?{" "}
          <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold cursor-pointer">
            Click to resend
          </button>
        </p>

        <p className="text-center text-[14px] text-slate-500 dark:text-slate-400 mt-2">
          <Link
            to="/signin"
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default VerifyOtp;
