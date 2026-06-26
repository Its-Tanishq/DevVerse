import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  AtSign,
  Loader2,
} from "lucide-react";
import AuthLayout from "@/components/authenticaton/AuthLayout";
import useAuth from "@/store/AuthStore";
import toast from "react-hot-toast";
import SocialLoginButtons from "@/components/authenticaton/SocialLoginButtons";
import {
  getPasswordStrength,
  getStrengthText,
  getStrengthColor,
  getTextColor,
} from "@/utils/passwordUtils";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const signup = useAuth((state) => state.signup);
  const loading = useAuth((state) => state.authLoading);

  const [data, setData] = useState({
    email: "",
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await signup(data);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error) {
      // console.error(error);
      const errorMessage =
        error.response?.data?.message || "An error occurred during signup";
      toast.error(errorMessage);
    } finally {
      setData({
        email: "",
        username: "",
        password: "",
      });
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="space-y-2">
          <h2 className="text-[28px] font-bold text-slate-900 dark:text-white tracking-tight">
            Create your account
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-[15px]">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold"
            >
              Sign in
            </Link>
          </p>
        </div>

        <SocialLoginButtons />

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSignup();
          }}
        >
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
                name="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                placeholder="you@example.com"
                className="pl-10 h-[46px] border-slate-200 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white shadow-sm rounded-xl focus-visible:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="username"
              className="text-[13px] font-semibold text-indigo-950 dark:text-indigo-100"
            >
              Username
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <AtSign className="h-[18px] w-[18px]" />
              </div>
              <Input
                id="username"
                type="text"
                name="username"
                value={data.username}
                onChange={(e) => setData({ ...data, username: e.target.value })}
                placeholder="Enter your Username"
                className="pl-10 h-[46px] border-slate-200 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white shadow-sm rounded-xl focus-visible:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-[13px] font-semibold text-indigo-950 dark:text-indigo-100"
            >
              Password
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <Lock className="h-[18px] w-[18px]" />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
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
                  const score = getPasswordStrength(data.password);
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
                  getPasswordStrength(data.password),
                )}`}
              >
                {getStrengthText(getPasswordStrength(data.password))}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 pt-2 pb-2">
            <Checkbox
              id="terms"
              required
              className="rounded-lg border-slate-300 dark:border-slate-700 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 w-[18px] h-[18px]"
            />
            <Label
              htmlFor="terms"
              className="text-[13px] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600 dark:text-slate-300"
            >
              I agree to the{" "}
              <Link
                to="/terms"
                className="text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Privacy Policy
              </Link>
            </Label>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-[46px] rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold text-[15px] shadow-sm shadow-indigo-200 dark:shadow-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-[18px] w-[18px] animate-spin" />
                Please wait...
              </>
            ) : (
              <>
                Create my account
                <ArrowRight className="ml-2 h-[18px] w-[18px]" />
              </>
            )}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Signup;
