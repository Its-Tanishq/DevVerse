import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Key,
  Mail,
  Send,
  MailOpen,
  ArrowRight,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import AuthLayout from "@/components/authenticaton/AuthLayout";
import toast from "react-hot-toast";
import apiClient from "@/config/ApiClient";

const getPasswordStrength = (password) => {
  let score = 0;
  if (!password) return 0;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
};

const getStrengthText = (score) => {
  if (score === 0) return "Enter a password";
  if (score <= 2) return "Weak — add more characters";
  if (score === 3) return "Moderate — add a symbol/number";
  if (score === 4) return "Good — almost there";
  return "Strong — ready to go!";
};

const getStrengthColor = (score) => {
  if (score === 0) return "bg-slate-200 dark:bg-slate-800";
  if (score <= 2) return "bg-red-500";
  if (score === 3) return "bg-orange-500";
  if (score === 4) return "bg-amber-500";
  return "bg-green-500";
};

const getTextColor = (score) => {
  if (score === 0) return "text-slate-400 dark:text-slate-500";
  if (score <= 2) return "text-red-500";
  if (score === 3) return "text-orange-500";
  if (score === 4) return "text-amber-500";
  return "text-green-500";
};

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    if (!email) return toast.error("Email is required");

    setIsLoading(true);
    try {
      await apiClient.post("/auth/forgot-password", { email });
      toast.success("OTP sent to your email!");
      if (step === 1) {
        toast("The OTP expires in 10 minutes. Check your spam folder.", {
          icon: "ℹ️",
          duration: 5000,
        });
      }
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error("OTP is required");

    setIsLoading(true);
    try {
      await apiClient.post("/auth/verify-otp", { email, otp });
      toast.success("OTP verified!");
      setStep(3);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setIsLoading(true);
    try {
      await apiClient.post("/auth/reset-password", { email, otp, newPassword });
      toast.success("Password reset successfully! You can now log in.");
      navigate("/signin");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto space-y-6">
        {step === 1 && (
          <Link
            to="/signin"
            className="inline-flex items-center text-[14px] font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sign in
          </Link>
        )}

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-[#1e1b4b] shadow-sm shadow-indigo-100/50 dark:shadow-none">
          {step === 1 && (
            <Key className="h-6 w-6 text-indigo-600 dark:text-[#c084fc]" />
          )}
          {step === 2 && (
            <MailOpen className="h-6 w-6 text-indigo-600 dark:text-[#c084fc]" />
          )}
          {step === 3 && (
            <ShieldCheck className="h-6 w-6 text-indigo-600 dark:text-[#c084fc]" />
          )}
        </div>

        <div className="space-y-2">
          <h2 className="text-[32px] font-bold text-slate-900 dark:text-white tracking-tight">
            {step === 1 && "Forgot your password?"}
            {step === 2 && "Check your email"}
            {step === 3 && "Create new password"}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-[15px] leading-relaxed">
            {step === 1 &&
              "No worries. Enter your email and we'll send you a reset link in seconds."}
            {step === 2 && (
              <>
                We sent a verification code to{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {email}
                </span>
                . Please enter it below.
              </>
            )}
            {step === 3 &&
              "Your new password must be different from your previous passwords."}
          </p>
        </div>

        {/* STEP 1: EMAIL */}
        {step === 1 && (
          <form className="space-y-6" onSubmit={handleSendOTP}>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-10 h-[46px] border-slate-200 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white shadow-sm rounded-xl focus-visible:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-[46px] rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold text-[15px] shadow-sm shadow-indigo-200 dark:shadow-none transition-all"
            >
              {isLoading ? "Sending..." : "Send reset link"}
              {!isLoading && <Send className="ml-2 h-[18px] w-[18px]" />}
            </Button>
          </form>
        )}

        {/* STEP 2: OTP */}
        {step === 2 && (
          <form className="space-y-6" onSubmit={handleVerifyOTP}>
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
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                placeholder="000000"
                className="h-[52px] text-center text-2xl tracking-[0.5em] border-slate-200 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white shadow-sm rounded-xl focus-visible:ring-indigo-500 font-bold"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-[46px] rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold text-[15px] shadow-sm shadow-indigo-200 dark:shadow-none transition-all"
            >
              {isLoading ? "Verifying..." : "Verify code"}
              {!isLoading && <ArrowRight className="ml-2 h-[18px] w-[18px]" />}
            </Button>

            <p className="text-center text-[14px] text-slate-500 dark:text-slate-400 mt-8">
              Didn't receive the email?{" "}
              <button
                type="button"
                onClick={() => handleSendOTP()}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold cursor-pointer"
              >
                Click to resend
              </button>
            </p>
          </form>
        )}

        {/* STEP 3: NEW PASSWORD */}
        {step === 3 && (
          <form className="space-y-6" onSubmit={handleResetPassword}>
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
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
                  {[1, 2, 3, 4, 5].map((index) => {
                    const score = getPasswordStrength(newPassword);
                    return (
                      <div
                        key={index}
                        className={`h-full flex-1 rounded-full transition-colors duration-300 ${
                          index <= score
                            ? getStrengthColor(score)
                            : "bg-slate-200 dark:bg-slate-800"
                        }`}
                      ></div>
                    );
                  })}
                </div>
                <p
                  className={`text-[12px] font-medium transition-colors duration-300 ${getTextColor(
                    getPasswordStrength(newPassword),
                  )}`}
                >
                  {getStrengthText(getPasswordStrength(newPassword))}
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
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-[46px] rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold text-[15px] shadow-sm shadow-indigo-200 dark:shadow-none transition-all"
            >
              {isLoading ? "Resetting..." : "Reset password"}
              {!isLoading && <ArrowRight className="ml-2 h-[18px] w-[18px]" />}
            </Button>
          </form>
        )}

        {(step === 1 || step === 3) && (
          <p className="text-center text-[14px] text-slate-500 dark:text-slate-400 mt-8">
            Remember your password?{" "}
            <Link
              to="/signin"
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold"
            >
              Sign in
            </Link>
          </p>
        )}
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
