// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Login Page Component
// =============================================================================

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginSchema, LoginInput } from "@srusti/shared";
import { useAuthStore } from "../../store/authStore";
import { api } from "../../lib/api";
import { Eye, EyeOff, Lock, Mail, AlertCircle, Loader2 } from "lucide-react";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const fromPath = (location.state as any)?.from?.pathname || null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setApiError(null);
    try {
      const response = await api.post("/auth/login", data);
      const { user, accessToken } = response.data.data;

      // Update in-memory Zustand auth store
      setAuth(user, accessToken);

      // Navigate to destination or role-specific landing page
      if (fromPath) {
        navigate(fromPath, { replace: true });
      } else if (user.role === "SUPER_ADMIN" || user.role === "DEPT_ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else if (user.role === "FACULTY") {
        navigate("/faculty/dashboard", { replace: true });
      } else {
        navigate("/student/dashboard", { replace: true });
      }
    } catch (err: any) {
      const message =
        err.response?.data?.error?.message ||
        "Unable to sign in. Please verify your credentials and try again.";
      setApiError(message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 mb-4 shadow-xl shadow-blue-950/30">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Srusti Academy Portal
        </h2>
        <p className="mt-2 text-xs text-slate-400 uppercase tracking-widest font-semibold">
          Secure Authentication System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-900/90 backdrop-blur-md py-8 px-6 shadow-2xl rounded-2xl border border-slate-800 sm:px-10">
          {apiError && (
            <div
              className="mb-6 rounded-xl bg-rose-500/10 border border-rose-500/30 p-4 text-xs text-rose-300 flex items-start gap-3"
              role="alert"
            >
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Authentication Failed</p>
                <p className="mt-0.5 text-rose-200/80">{apiError}</p>
              </div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
              >
                Institutional Email
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  disabled={isSubmitting}
                  {...register("email")}
                  className={`block w-full pl-10 pr-3 py-2.5 bg-slate-950/80 border rounded-xl text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    errors.email ? "border-rose-500/80" : "border-slate-800 focus:border-blue-500"
                  }`}
                  placeholder="name@srusti.ac.in"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-rose-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-blue-400 hover:text-blue-300 transition"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  {...register("password")}
                  className={`block w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border rounded-xl text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    errors.password ? "border-rose-500/80" : "border-slate-800 focus:border-blue-500"
                  }`}
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-rose-400">{errors.password.message}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-900/30 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-slate-800 pt-5 text-center">
            <p className="text-xs text-slate-500">
              Need assistance? Contact IT Services at{" "}
              <span className="text-slate-400">admin@srusti.ac.in</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
