import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import toast from "react-hot-toast";
import useAuth from "@/config/Store";
import SocialLoginButtons from "@/components/SocialLoginButtons";

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuth((state) => state.login);
  const loading = useAuth((state) => state.authLoading);

  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleSignin = async () => {
    try {
      await login(data);
      navigate("/"); // TODO: Change it when dashboard created
    } catch (error) {
      // console.error(error);
      const errorMessage =
        error.response?.data?.message || "An error occurred during signin";
      toast.error(errorMessage);
    } finally {
      setData({
        email: "",
        password: "",
      });
    }
  };

  return (
    <AuthLayout>
      <div className="text-center space-y-2">
        <h2 className="text-[28px] font-bold text-slate-900 dark:text-white tracking-tight">
          Welcome back
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-[15px]">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold"
          >
            Sign up free
          </Link>
        </p>
      </div>

      <SocialLoginButtons />

      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          handleSignin();
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
              placeholder="you@example.com"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="pl-10 h-[46px] border-slate-200 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white shadow-sm rounded-xl focus-visible:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              className="text-[13px] font-semibold text-indigo-950 dark:text-indigo-100"
            >
              Password
            </Label>
            <Link
              to="/forgot-password"
              className="text-[13px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <Lock className="h-[18px] w-[18px]" />
            </div>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              name="password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
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
              Sign in to DevVerse
              <ArrowRight className="ml-2 h-[18px] w-[18px]" />
            </>
          )}
        </Button>
      </form>

      <p className="text-center text-[12px] text-slate-500 dark:text-slate-400 pt-2">
        By signing in, you agree to our{" "}
        <Link
          to="/terms"
          className="text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Terms
        </Link>{" "}
        and{" "}
        <Link
          to="/privacy"
          className="text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Privacy Policy
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Signin;
